import { Schema, model } from "mongoose";
import cron from "node-cron";
import { TBudget } from "./budget.type";

const SpendHistorySchema = new Schema(
  {
    month: { type: Date, default: new Date() },
    spent: { type: Number, default: 0 },
  },
  { _id: false }
);

const LimitHistorySchema = new Schema(
  {
    month: { type: Date, default: new Date() },
    limit: { type: Number, required: true },
  },
  { _id: false }
);

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
    spendHistory: [SpendHistorySchema],
    limitHistory: [LimitHistorySchema],
  },
  {
    timestamps: true,
  }
);

export const BudgetModel = model<TBudget>("budget", budgetTrackerSchema);

// Cron job to update spendHistory and limitHistory
cron.schedule("0 0 1 * *", async () => {
  console.log("Running cron job for budget updates");

  const currentDate = new Date();
  const startOfCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  try {
    const budgets = await BudgetModel.find();

    for (const budget of budgets) {
      const monthExists = budget.spendHistory.some(
        (entry: { month: Date }) =>
          entry.month.getTime() === startOfCurrentMonth.getTime()
      );

      if (!monthExists) {
        // Add current month's default spendHistory
        budget.spendHistory.push({ month: startOfCurrentMonth, spent: 0 });

        // Copy the last limit value into the new month
        const lastLimit =
          budget.limitHistory[budget.limitHistory.length - 1]?.limit || 0;
        budget.limitHistory.push({
          month: startOfCurrentMonth,
          limit: lastLimit,
        });

        // Save the updated document
        await budget.save();
      }
    }
  } catch (error) {
    console.error("Error while running cron job:", error);
  }
});
