import { Types } from "mongoose";

export type TCard = {
  userId: Types.ObjectId;
  last4Digits: string;
  bankName: string;
  accountHolderName: string;
  expireDate: string;
  totalBalance: number;
  totalDeposit: number;
  totalExpense: number;
};
