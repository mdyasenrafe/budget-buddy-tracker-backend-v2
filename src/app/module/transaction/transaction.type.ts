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
  category: string;
  userId: string;
  cardId: string;
  status: (typeof TTransactionStatusValues)[number];
};
