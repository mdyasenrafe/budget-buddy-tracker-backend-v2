import { Types } from "mongoose";
import {
  TTransactionStatusValues,
  TTransactionTypeValues,
} from "./transaction.constant";
import { TCategory } from "../category/category.types";

export type TTransaction = {
  title: string;
  description: string;
  amount: number;
  date: Date;
  type: (typeof TTransactionTypeValues)[number];
  budget?: Types.ObjectId;
  category: TCategory;
  user: Types.ObjectId;
  card?: Types.ObjectId;
  status: (typeof TTransactionStatusValues)[number];
  attachment?: string;
};
