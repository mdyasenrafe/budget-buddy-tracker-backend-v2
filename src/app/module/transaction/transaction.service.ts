import mongoose, { Types } from "mongoose";
import { TTransaction } from "./transaction.type";
import { BudgetModel } from "../budget/budget.model";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { CardModel } from "../card/card.model";
import { CardOverviewModel } from "../cardOverview/cardOverview.model";
import { TransactionModel } from "./transaction.model";
import { QueryBuilder } from "../../builder/QueryBuilder";

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

export const transactionServices = {
  addTransaction,
  getTransactionsFromDBByUserId,
  getTransactionFromDBById,
};
