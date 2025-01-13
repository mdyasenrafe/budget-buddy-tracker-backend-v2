import mongoose, { Schema, model } from "mongoose";
import { TTransaction } from "./transaction.type";
import { TTransactionStatusValues } from "./transaction.constant";

const TransactionSchema: Schema = new Schema<TTransaction>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: TTransactionStatusValues,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "category",
    },
    budget: {
      type: Schema.Types.ObjectId,
      ref: "budget",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    card: {
      type: Schema.Types.ObjectId,
      ref: "card",
    },
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },
    attachment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const TransactionModel = mongoose.model<TTransaction>(
  "transaction",
  TransactionSchema
);
