import { Types } from "mongoose";

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
