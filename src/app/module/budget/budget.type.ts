import { Types } from "mongoose";

export type TBudget = {
  limit: number;
  category: Types.ObjectId;
  name: string;
  spend: number;
};
