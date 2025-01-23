import { Schema, Types } from "mongoose";
import { TBudget, TBudgetRequest } from "./budget.type";
import { BudgetModel } from "./budget.model";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { CategoryModel } from "../category/category.model";
import {
  getCurrentMonth,
  getMonthEnd,
  getMonthStart,
  getWeeklyRanges,
} from "../../utils/date";
import { CardModel } from "../card/card.model";
import { TransactionModel } from "../transaction/transaction.model";
import {
  calculateDateRangeTotals,
  categorizeTransactionsByWeek,
} from "../../utils/transactions";

const createBudgetToDB = async (
  data: TBudgetRequest,
  userId: Types.ObjectId
) => {
  const category = await CategoryModel.findOne({ _id: data?.category });
  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "The specified category does not exist"
    );
  }

  const payload: TBudget = {
    ...data,
    userId: userId,
    spent: 0,
    month: getCurrentMonth(),
    status: "active",
  };

  const budget = await BudgetModel.create(payload);
  return budget;
};

const getBudgetsFromDB = async (
  userId: Schema.Types.ObjectId,
  monthIndex: number
) => {
  const startOfMonth = new Date(new Date().getFullYear(), monthIndex, 1);
  const endOfMonth = new Date(
    new Date().getFullYear(),
    monthIndex + 1,
    0,
    23,
    59,
    59
  );

  const budgets = await BudgetModel.find({
    userId: userId,
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    status: "active",
  })
    .populate("category")
    .populate("userId");

  if (!budgets.length) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No budgets found for the given user and month"
    );
  }

  return budgets;
};

const getBudgetByIdFromDB = async (id: string) => {
  const budget = await BudgetModel.findById(id);
  return budget;
};

const editBudgetToDB = async (
  id: string,
  userId: Schema.Types.ObjectId,
  data: Partial<TBudgetRequest>
) => {
  const budget = await BudgetModel.findOne({ _id: id, userId });

  if (!budget) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Budget not found or you do not have permission to edit this budget"
    );
  }

  if (data.category) {
    const category = await CategoryModel.findOne({ _id: data.category });
    if (!category) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "The specified category does not exist"
      );
    }
  }

  const updatedBudget = await BudgetModel.findOneAndUpdate(
    { _id: id, userId },
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!updatedBudget) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Budget not found or you do not have permission to edit this budget"
    );
  }

  return updatedBudget;
};

const deleteBudgetFromDB = async (
  id: string,
  userId: Schema.Types.ObjectId
) => {
  const budget = await BudgetModel.findOne({ _id: id, userId });

  if (!budget) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Budget not found or you do not have permission to delete this budget"
    );
  }

  const updatedBudget = await BudgetModel.findOneAndUpdate(
    { _id: id, userId },
    { $set: { status: "deleted" } },
    { new: true, runValidators: true }
  );

  if (!updatedBudget) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Budget not found or you do not have permission to delete this budget"
    );
  }

  return updatedBudget;
};

const getWeeklyTransactionByBudgetIDFromDB = async (
  userId: Types.ObjectId,
  budgetId: string,
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

  const weeklyRanges = getWeeklyRanges(monthStart, timezone);

  const transactions = await TransactionModel.find({
    status: "active",
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

export const budgetServices = {
  createBudgetToDB,
  getBudgetsFromDB,
  getBudgetByIdFromDB,
  editBudgetToDB,
  deleteBudgetFromDB,
  getWeeklyTransactionByBudgetIDFromDB,
};
