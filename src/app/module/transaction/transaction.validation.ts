import { z } from "zod";
import {
  TTransactionTypeValues,
  TTransactionStatusValues,
} from "./transaction.constant";

const createTransactionSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  amount: z.number().positive({ message: "Amount must be a positive number" }),
  date: z.string(),
  type: z.enum(TTransactionTypeValues, { message: "Invalid transaction type" }),
  category: z.string().min(1, { message: "Category is required" }),
  budget: z.string().optional(),
  card: z.string().optional(),
  attachment: z.string().optional(),
});

export const transactionValidations = {
  createTransactionSchema,
};
