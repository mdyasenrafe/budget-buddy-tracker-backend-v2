import mongoose, { Types } from "mongoose";
import { CardModel } from "./card.model";
import { TCard } from "./card.type";
import { AppError } from "../../errors/AppError";
import { CardOverviewModel } from "../cardOverview/cardOverview.model";
import { getMonthEnd, getMonthStart, getWeeklyRanges } from "../../utils/date";
import { TransactionModel } from "../transaction/transaction.model";
import httpStatus from "http-status";
import {
  calculateWeeklyBalances,
  categorizeTransactionsByWeek,
} from "../../utils/transactions";

const getCardsFromDB = async (id: string) => {
  const result = await CardModel.find({
    userId: id,
    status: "active",
  }).populate("userId");
  return result;
};

const getCardsByIdFromDB = async (id: string) => {
  const result = await CardModel.findById(id).populate("userId");
  return result;
};

const createCardToDB = async (cardData: TCard, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payload = {
      ...cardData,
      userId: userId,
      totalDeposit: Number(cardData.totalBalance),
    };

    const newCard = await CardModel.create([payload], { session });

    const cardOverview = await CardOverviewModel.findOneAndUpdate(
      { userId: userId },
      {
        $inc: {
          totalBalance: +cardData.totalBalance,
          totalDeposit: +cardData.totalBalance,
        },
      },
      { new: true, session, upsert: true }
    );

    await session.commitTransaction();
    session.endSession();

    return newCard;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "An error occurred during card creation"
    );
  }
};

const updateCardInDB = async (id: string, updateData: Partial<TCard>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingCard = await CardModel.findById(id);
    if (!existingCard) {
      throw new AppError(httpStatus.NOT_FOUND, "Card not found");
    }

    const result = await CardModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      session,
    });

    if (
      updateData.totalBalance &&
      existingCard.totalBalance !== updateData.totalBalance
    ) {
      const balanceDifference =
        updateData.totalBalance - existingCard.totalBalance;
      await CardOverviewModel.findOneAndUpdate(
        { userId: existingCard.userId },
        {
          $inc: {
            totalBalance: balanceDifference,
          },
        },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "An error occurred during card update"
    );
  }
};

const deleteCardFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const card = await CardModel.findOneAndUpdate(
      { _id: id },
      { status: "deleted" },
      { new: true, session }
    );

    if (!card) {
      throw new AppError(httpStatus.NOT_FOUND, "Card not found");
    }

    await CardOverviewModel.findOneAndUpdate(
      { userId: card.userId },
      {
        $inc: {
          totalBalance: -card.totalBalance,
          totalDeposit: -card.totalBalance,
        },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return card;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "An error occurred during card deletion"
    );
  }
};

const getCardMetrics = async (
  userId: Types.ObjectId,
  cardId: string,
  year: number,
  monthIndex: number,
  timezone = "UTC"
) => {
  if (!year) {
    throw new AppError(httpStatus.BAD_REQUEST, "'year' is required.");
  }

  if (isNaN(Number(year))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "'year' must be a valid number."
    );
  }

  if (!monthIndex && monthIndex !== 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "'monthIndex' is required and must be between 0 (January) and 11 (December)."
    );
  }

  if (isNaN(Number(monthIndex))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "'monthIndex' must be a valid number."
    );
  }

  const monthStart = getMonthStart(year, monthIndex, timezone);
  const monthEnd = getMonthEnd(year, monthIndex, timezone);

  const card = await CardModel.findOne({ _id: cardId, userId });
  if (!card) {
    throw new AppError(httpStatus.NOT_FOUND, "Card not found");
  }

  const transactions = await TransactionModel.find({
    user: userId,
    card: cardId,
    status: "active",
    date: {
      $gte: monthStart,
      $lte: monthEnd,
    },
  });

  // Aggregate metrics
  const totalTransactions = transactions.length;
  const totalBalance = card.totalBalance || 0;

  const monthlySpending = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const monthlyIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  return {
    totalTransactions,
    totalBalance,
    monthlySpending,
    monthlyIncome,
  };
};

const getWeeklyTransactionByCardIDFromDB = async (
  userId: Types.ObjectId,
  cardId: string,
  year: number,
  monthIndex: number,
  timezone: string = "UTC"
) => {
  if (!year || isNaN(Number(year))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "'year' is required and must be a valid number."
    );
  }

  if (!monthIndex && monthIndex !== 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "'monthIndex' is required and must be a valid number between 0 (January) and 11 (December)."
    );
  }

  const monthStart = getMonthStart(year, monthIndex, timezone);
  const weeklyRanges = getWeeklyRanges(monthStart, timezone);

  const card = await CardModel.findOne({ _id: cardId, userId });

  if (!card) {
    throw new AppError(httpStatus.NOT_FOUND, "Card not found");
  }

  let runningBalance = card.totalBalance;

  const transactions = await TransactionModel.find({
    status: "active",
    user: userId,
    card: cardId,
    date: {
      $gte: monthStart,
      $lte: getMonthEnd(year, monthIndex, timezone),
    },
  });

  const weeklyTotals = calculateWeeklyBalances(
    transactions,
    weeklyRanges,
    runningBalance
  );

  return weeklyTotals;
};

const getWeeklyTransactionSummaryByCardID = async (
  userId: Types.ObjectId,
  cardId: string,
  year: number,
  monthIndex: number,
  timezone: string = "UTC"
) => {
  if (!year || isNaN(Number(year))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "'year' is required and must be a valid number."
    );
  }

  if (!monthIndex && monthIndex !== 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "'monthIndex' is required and must be a valid number between 0 (January) and 11 (December)."
    );
  }

  const monthStart = getMonthStart(year, monthIndex, timezone);
  const weeklyRanges = getWeeklyRanges(monthStart, timezone);

  const card = await CardModel.findOne({ _id: cardId });

  if (!card) {
    throw new AppError(httpStatus.NOT_FOUND, "Card not found");
  }

  const transactions = await TransactionModel.find({
    status: "active",
    user: userId,
    card: cardId,
    date: {
      $gte: monthStart,
      $lte: getMonthEnd(year, monthIndex, timezone),
    },
  });

  const weeklyTotals = categorizeTransactionsByWeek(transactions, weeklyRanges);

  return weeklyTotals;
};

const getSpendingCategoriesByCardID = async (
  userId: Types.ObjectId,
  cardId: string,
  year: number,
  monthIndex: number,
  timezone: string = "UTC"
) => {
  if (!year || isNaN(Number(year))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "'year' is required and must be a valid number."
    );
  }

  if (!monthIndex && monthIndex !== 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "'monthIndex' is required and must be a valid number between 0 (January) and 11 (December)."
    );
  }

  const monthStart = getMonthStart(year, monthIndex, timezone);
  const monthEnd = getMonthEnd(year, monthIndex, timezone);

  const card = await CardModel.findOne({ _id: cardId });

  if (!card) {
    throw new AppError(httpStatus.NOT_FOUND, "Card not found");
  }

  const transactions = await TransactionModel.find({
    status: "active",
    user: userId,
    card: cardId,
    date: { $gte: monthStart, $lte: monthEnd },
  }).populate("category");

  const spendingCategories: { [key: string]: number } = {};

  transactions.forEach((transaction: any) => {
    const categoryLabel = transaction?.category?.label || "Uncategorized";
    const amount = transaction.amount || 0;

    if (spendingCategories[categoryLabel]) {
      spendingCategories[categoryLabel] += amount;
    } else {
      spendingCategories[categoryLabel] = amount;
    }
  });

  const finalResult = Object.entries(spendingCategories).map(
    ([label, amount]) => ({
      label,
      amount,
    })
  );

  return finalResult;
};

export const cardServices = {
  createCardToDB,
  getCardsFromDB,
  getCardsByIdFromDB,
  updateCardInDB,
  deleteCardFromDB,
  getCardMetrics,
  getWeeklyTransactionByCardIDFromDB,
  getWeeklyTransactionSummaryByCardID,
  getSpendingCategoriesByCardID,
};
