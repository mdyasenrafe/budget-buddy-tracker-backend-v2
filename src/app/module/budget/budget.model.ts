import { Schema, model } from "mongoose";
import { TBudget } from "./budget.type";
import { TBudgetMonthValues, TBudgetStatusValues } from "./budget.constant";

const budgetTrackerSchema = new Schema<TBudget>(
  {
    userId: {
      ref: "user",
      type: Schema.Types.ObjectId,
      required: [true, "userId is required"],
    },
    name: { type: String, required: true },
    category: {
      ref: "category",
      type: Schema.Types.ObjectId,
      required: [true, "Category is required"],
    },
    spent: { type: Number, default: 0 },
    limit: { type: Number, required: [true, "Limit is required"] },
    status: {
      type: String,
      enum: TBudgetStatusValues,
      default: "active",
    },
    month: {
      type: String,
      enum: TBudgetMonthValues,
      required: [true, "Month is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const BudgetModel = model<TBudget>("budget", budgetTrackerSchema);
