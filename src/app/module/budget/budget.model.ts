import { Schema, model } from "mongoose";
import cron from "node-cron";
import { TBudget } from "./budget.type";

const SpendHistorySchema = new Schema(
  {
    month: { type: Date, required: true },
    spent: { type: Number, default: 0 },
  },
  { _id: false }
);

const LimitHistorySchema = new Schema(
  {
    month: { type: Date, required: true },
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

// Run every hour for testing purposes
cron.schedule("0 * * * *", async () => {
  console.log("Running cron job for budget updates (every hour)");

  const currentDate = new Date();
  const startOfCurrentHour = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    currentDate.getHours()
  );
  console.log(startOfCurrentHour);

  try {
    const budgets = await BudgetModel.find();

    for (const budget of budgets) {
      const hourExists = budget.spendHistory.some(
        (entry: { month: Date }) =>
          entry.month.getTime() === startOfCurrentHour.getTime()
      );

      if (!hourExists) {
        // Add current hour's default spendHistory
        budget.spendHistory.push({ month: startOfCurrentHour, spent: 0 });

        // Copy the last limit value into the new hour
        const lastLimit =
          budget.limitHistory[budget.limitHistory.length - 1]?.limit || 0;
        budget.limitHistory.push({
          month: startOfCurrentHour,
          limit: lastLimit,
        });

        // Save the updated document
        await budget.save();
        console.log(`Budget updated for user: ${budget.userId}`);
      }
    }
  } catch (error) {
    console.error("Error while running cron job:", error);
  }
});
