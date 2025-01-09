import { Model, Types } from "mongoose";

export type TBudget = {
  userId: Types.ObjectId;
  limit: number;
  category: Types.ObjectId;
  name: string;
  spent: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface TBudgetMethods {
  getMonthlySpent(month: number, year: number): number;
}

export type TBudgetDocument = Document & TBudget & TBudgetMethods;

export type TBudgetModel = Model<TBudget, {}, TBudgetMethods>;
