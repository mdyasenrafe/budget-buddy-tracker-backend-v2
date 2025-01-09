import { Schema, model } from "mongoose";
import {
  TBudget,
  TBudgetDocument,
  TBudgetMethods,
  TBudgetModel,
} from "./budget.type";

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

budgetTrackerSchema.method(
  "getMonthlySpent",
  function (month: number, year: number) {
    const now = new Date();
    const budgetStart: Date = this.createdAt || now;

    const startMonth = budgetStart.getMonth();
    const startYear = budgetStart.getFullYear();

    if (year < startYear || (year === startYear && month < startMonth)) {
      return 0;
    }

    const monthsElapsed = (year - startYear) * 12 + (month - startMonth);
    const monthlySpent = this.spent / (monthsElapsed + 1);
    return monthlySpent;
  }
);

budgetTrackerSchema.method("getSpentForLast15Minutes", function () {
  const now = new Date();
  const createdAt: Date = this.createdAt || now;

  const timeElapsedInMinutes = Math.floor(
    (now.getTime() - createdAt.getTime()) / (1000 * 60)
  );

  const intervalsElapsed = Math.floor(timeElapsedInMinutes / 15);
  const spentPerInterval = this.spent / (intervalsElapsed + 1);
  return spentPerInterval;
});

budgetTrackerSchema.virtual("isOverLimit").get(function (
  this: TBudgetDocument
) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const spentThisMonth = this.getMonthlySpent(currentMonth, currentYear);
  return spentThisMonth >= this.limit;
});

export const BudgetModel = model<TBudget, TBudgetModel>(
  "budget",
  budgetTrackerSchema
);
