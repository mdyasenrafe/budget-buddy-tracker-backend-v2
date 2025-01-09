import { Schema, model } from "mongoose";
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

budgetTrackerSchema.pre("find", async function () {
  const currentDate = new Date();
  const startOfCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const docs = await this.model.find(this.getQuery());

  for (const doc of docs) {
    const monthExists = doc.spendHistory.some(
      (entry: { month: Date }) =>
        entry.month.getTime() === startOfCurrentMonth.getTime()
    );

    if (!monthExists) {
      doc.spendHistory.push({ month: startOfCurrentMonth, spent: 0 });

      const lastLimit = doc.limitHistory[doc.limitHistory.length - 1]?.limit;
      doc.limitHistory.push({ month: startOfCurrentMonth, limit: lastLimit });

      await doc.save();
    }
  }
});

export const BudgetModel = model<TBudget>("budget", budgetTrackerSchema);
