import { Types } from "mongoose";

export type TSpendHistory = {
  month: Date;
  spent: number;
};

export type TLimitHistory = {
  month: Date;
  limit: number;
};

export type TBudget = {
  userId: Types.ObjectId;
  name: string;
  category: Types.ObjectId;
  spendHistory: TSpendHistory[];
  limitHistory: TLimitHistory[];
  createdAt?: Date;
  updatedAt?: Date;
};

// export interface TBudgetMethods {
//   getMonthlySpent(month: number, year: number): number;
// }

// export type TBudgetDocument = Document & TBudget & TBudgetMethods;

// export type TBudgetModel = Model<TBudget, {}, TBudgetMethods>;
