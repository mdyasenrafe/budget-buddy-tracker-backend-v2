import mongoose, { Types } from "mongoose";
import { TTransaction } from "./transaction.type";
import { BudgetModel } from "../budget/budget.model";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { CardModel } from "../card/card.model";
import { CardOverviewModel } from "../cardOverview/cardOverview.model";
import { TransactionModel } from "./transaction.model";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { getMonthEnd, getMonthStart, getWeeklyRanges } from "../../utils/date";
import {
  calculateDateRangeTotals,
  calculateWeeklyBalances,
} from "../../utils/transactions";

const getTransactionsFromDBByUserId = async (
  userId: Types.ObjectId,
  query: Record<string, unknown>
) => {
  const usersQuery = new QueryBuilder(
    TransactionModel.find({ user: userId }).populate(
      "category user card budget"
    ),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await usersQuery.modelQuery;
  const meta = await usersQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getTransactionFromDBById = async (id: string) => {
  const result = await TransactionModel.findById(id);
  return result;
};

const addTransaction = async (data: TTransaction, userId: Types.ObjectId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { type, amount, budget: budgetId, card: cardId } = data;

    if (!type || !["income", "expense"].includes(type)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid transaction type");
    }

    if (type === "expense") {
      await handleExpenseTransaction(budgetId, cardId, amount, userId, session);
    } else if (type === "income") {
      await handleIncomeTransaction(cardId, amount, userId, session);
    }

    const payload: TTransaction = {
      ...data,
      user: userId,
    };

    const result = await TransactionModel.create([payload], { session });

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const handleExpenseTransaction = async (
  budgetId: Types.ObjectId | undefined,
  cardId: Types.ObjectId | undefined,
  amount: number,
  userId: Types.ObjectId,
  session: mongoose.ClientSession
) => {
  if (budgetId) {
    const budget = await BudgetModel.findById(budgetId).session(session);

    if (!budget) {
      throw new AppError(httpStatus.NOT_FOUND, "Budget not found");
    }

    await BudgetModel.findByIdAndUpdate(
      budgetId,
      { $inc: { spent: amount } },
      { new: true, session }
    );
  }

  if (cardId) {
    const card = await CardModel.findById(cardId).session(session);

    if (!card) {
      throw new AppError(httpStatus.NOT_FOUND, "Card not found");
    }

    await CardModel.findByIdAndUpdate(
      cardId,
      {
        $inc: { totalBalance: -amount, totalExpense: amount },
      },
      { new: true, session }
    );
  }

  // Update CardOverview
  await CardOverviewModel.findOneAndUpdate(
    { userId },
    {
      $inc: { totalBalance: -amount, totalExpense: amount },
    },
    { new: true, upsert: true, session }
  );
};

const handleIncomeTransaction = async (
  cardId: Types.ObjectId | undefined,
  amount: number,
  userId: Types.ObjectId,
  session: mongoose.ClientSession
) => {
  if (cardId) {
    const card = await CardModel.findById(cardId).session(session);
    if (!card) {
      throw new AppError(httpStatus.NOT_FOUND, "Card not found");
    }

    await CardModel.findByIdAndUpdate(
      cardId,
      {
        $inc: { totalBalance: amount, totalDeposit: amount },
      },
      { new: true, session }
    );
  }
  await CardOverviewModel.findOneAndUpdate(
    { userId },
    {
      $inc: { totalBalance: amount, totalDeposit: amount },
    },
    { new: true, upsert: true, session }
  );
};

const getWeeklyTransactionByBudgetIDFromDB = async (
  userId: Types.ObjectId,
  budgetId: string,
  year: number,
  monthIndex: number,
  timezone: string = "UTC"
) => {
  const monthStart = getMonthStart(year, monthIndex, timezone);
  const monthEnd = getMonthEnd(year, monthIndex, timezone);

  const weeklyRanges = getWeeklyRanges(monthStart, timezone);

  const transactions = await TransactionModel.find({
    user: userId,
    budget: budgetId,
    date: {
      $gte: monthStart,
      $lte: monthEnd,
    },
  });

  const weeklyTotals = calculateDateRangeTotals(transactions, weeklyRanges);

  return weeklyTotals;
};
const getWeeklyTransactionByCardIDFromDB = async (
  userId: Types.ObjectId,
  cardId: string,
  year: number,
  monthIndex: number,
  timezone: string = "UTC"
) => {
  const monthStart = getMonthStart(year, monthIndex, timezone);
  const weeklyRanges = getWeeklyRanges(monthStart, timezone);

  // Fetch the card details to get the initial balance
  const card = await CardModel.findOne({ _id: cardId, userId });

  if (!card) {
    throw new Error("Card not found");
  }

  // Use the card's totalBalance as the initial balance
  let runningBalance = card.totalBalance;

  // Fetch all transactions for the card within the specified date range
  const transactions = await TransactionModel.find({
    user: userId,
    card: cardId,
    date: {
      $gte: monthStart,
      $lte: getMonthEnd(year, monthIndex, timezone),
    },
    status: "active",
  });

  const weeklyTotals = calculateWeeklyBalances(
    transactions,
    weeklyRanges,
    runningBalance
  );

  return weeklyTotals;
};

export const transactionServices = {
  addTransaction,
  getTransactionsFromDBByUserId,
  getTransactionFromDBById,
  getWeeklyTransactionByBudgetIDFromDB,
};
