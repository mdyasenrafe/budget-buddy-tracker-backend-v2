import { Types } from "mongoose";

export type TBudget = {
  userId: Types.ObjectId;
  limit: number;
  category: Types.ObjectId;
  name: string;
  spent: number;
};
