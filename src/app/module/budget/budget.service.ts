import { Schema, Types } from "mongoose";
import { TBudget, TBudgetRequest } from "./budget.type";
import { BudgetModel } from "./budget.model";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const createBudgetToDB = async (
  data: TBudgetRequest,
  userId: Types.ObjectId
) => {
  const payload: TBudget = {
    ...data,
    userId: userId,
    spendHistory: [{ month: new Date(), spent: 0 }],
    limitHistory: [{ month: new Date(), limit: data?.limit }],
  };
  const budget = await BudgetModel.create(payload);
  return budget;
};

const getBudgetsFromDB = async (
  userId: Schema.Types.ObjectId,
  monthIndex: number
) => {
  const startOfMonth = new Date(new Date().getFullYear(), monthIndex, 1);
  const endOfMonth = new Date(new Date().getFullYear(), monthIndex + 1, 0);

  const budgets = await BudgetModel.find({
    userId: userId,
    "spendHistory.month": { $gte: startOfMonth, $lte: endOfMonth },
  })
    .populate("category")
    .populate("userId")
    .select("limitHistory spendHistory");

  if (!budgets.length) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No budgets found for the given user and month"
    );
  }

  return budgets;
};

export const budgetServices = {
  createBudgetToDB,
  getBudgetsFromDB,
};
