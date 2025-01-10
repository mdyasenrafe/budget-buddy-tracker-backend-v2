import { Types } from "mongoose";
import { TBudgetStatusValues, TBudgetMonthValues } from "./budget.constant";

export type TBudgetRequest = {
  category: Types.ObjectId;
  name: string;
  limit: number;
};

export type TBudget = {
  userId: Types.ObjectId;
  name: string;
  category: Types.ObjectId;
  spent: number;
  limit: number;
  status: (typeof TBudgetStatusValues)[number];
  month: (typeof TBudgetMonthValues)[number];
  createdAt?: Date;
  updatedAt?: Date;
};
