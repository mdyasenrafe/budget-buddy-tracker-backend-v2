import { Schema, model } from "mongoose";
import { TBudget } from "./budget.type";

const budgetTrackerSchema = new Schema<TBudget>(
  {
    userId: {
      ref: "user",
      type: Schema.Types.ObjectId,
      required: [true, "userId is required"],
    },
    category: {
      ref: "category",
      type: Schema.Types.ObjectId,
      required: [true, "Category is required"],
    },
    limit: {
      type: Number,
      required: [true, "Limit is required"],
    },
    spent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

budgetTrackerSchema.virtual("isOverLimit").get(function () {
  return this.spent >= this.limit;
});

export const BudgetModel = model<TBudget>("budget", budgetTrackerSchema);
