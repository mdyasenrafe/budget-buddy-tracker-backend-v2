import { Types } from "mongoose";
import {
  TTransactionStatusValues,
  TTransactionTypeValues,
} from "./transaction.constant";

export type TTransaction = {
  title: string;
  description: string;
  amount: number;
  date: Date;
  type: (typeof TTransactionTypeValues)[number];
  budget?: Types.ObjectId;
  category: Types.ObjectId;
  user: Types.ObjectId;
  card: Types.ObjectId;
  status: (typeof TTransactionStatusValues)[number];
};
