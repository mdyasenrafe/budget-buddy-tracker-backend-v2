import mongoose, { Schema } from "mongoose";
import { TCard } from "./card.type";

const CardSchema: Schema = new Schema<TCard>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    last4Digits: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    expireDate: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

CardSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("totalBalance")) {
    this.totalDeposit = this.totalBalance;
    this.totalExpense = 0;
  }
  next();
});

export const CardModel = mongoose.model<TCard>("card", CardSchema);
