import { Types } from "mongoose";

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
  createdAt?: Date;
  updatedAt?: Date;
};
