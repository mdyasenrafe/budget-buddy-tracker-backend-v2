import { Types } from "mongoose";
import { TCardStatusValues } from "./card.constant";

export type TCard = {
  userId: Types.ObjectId;
  last4Digits: string;
  bankName: string;
  accountHolderName: string;
  expireDate: string;
  totalBalance: number;
  totalDeposit: number;
  totalExpense: number;
  status: (typeof TCardStatusValues)[number];
};
