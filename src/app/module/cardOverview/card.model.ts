import mongoose, { Schema } from "mongoose";
import { TCardOverview } from "./card.type";

const CardOverviewSchema: Schema = new Schema<TCardOverview>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },
  last4Digits: {
    type: String,
    default: "****",
    immutable: true,
  },
  bankName: {
    type: String,
    default: "BudgetBuddyTracker",
    immutable: true,
  },
  accountHolderName: {
    type: String,
    required: true,
  },
  expireDate: {
    type: String,
    default: "N/A",
    immutable: true,
  },
  totalBalance: {
    type: Number,
    required: true,
    min: 0,
  },
  totalDeposit: {
    type: Number,
    default: 0,
  },
  totalExpense: {
    type: Number,
    default: 0,
  },
});

CardOverviewSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("totalBalance")) {
    this.totalDeposit = this.totalBalance;
    this.totalExpense = 0;
  }
  next();
});

export const CardOverviewModel = mongoose.model<TCardOverview>(
  "CardOverview",
  CardOverviewSchema
);
