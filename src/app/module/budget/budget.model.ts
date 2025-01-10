import { Schema, model } from "mongoose";
import { TBudget } from "./budget.type";
import { TBudgetMonthValues, TBudgetStatusValues } from "./budget.constant";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

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

budgetTrackerSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  const existingBudget = await this.collection.findOne({
    userId: this.userId,
    name: this.name,
    month: this.month,
  });

  if (existingBudget) {
    throw new AppError(
      httpStatus.CONFLICT,
      `A budget with name '${this.name}' already exists for ${this.month}`
    );
  }

  next();
});

export const BudgetModel = model<TBudget>("budget", budgetTrackerSchema);
