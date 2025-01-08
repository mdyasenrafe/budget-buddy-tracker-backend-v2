import { Types } from "mongoose";
import { type } from "os";

export type TCardOverview = {
  userId: Types.ObjectId;
  last4Digits: "****";
  bankName: "BudgetBuddyTracker";
  accountHolderName: string;
  expireDate: "N/A";
  totalBalance: number;
  totalDeposit: number;
  totalExpense: number;
};

export type TCardOverviewPayload = {
  totalBalance: number;
  userId: Types.ObjectId;
  accountHolderName: string;
};
