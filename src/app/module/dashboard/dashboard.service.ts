import { Types } from "mongoose";
import { validateYearAndMonth } from "../../utils/dateValidation";
import { getMonthEnd, getMonthStart } from "../../utils/date";
import { CardModel } from "../card/card.model";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { TransactionModel } from "../transaction/transaction.model";
import { CardOverviewModel } from "../cardOverview/cardOverview.model";

const retrieveDashboardMetrics = async (
  userId: Types.ObjectId,
  year: number,
  monthIndex: number,
  timezone = "UTC"
) => {
  validateYearAndMonth({ year, monthIndex });

  const monthStartDate = getMonthStart(year, monthIndex, timezone);
  const monthEndDate = getMonthEnd(year, monthIndex, timezone);

  const userCards = await CardModel.find({ userId, status: "active" });

  if (!userCards || userCards.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No cards found for the user. Please add a card and try again."
    );
  }

  const userCardOverview = await CardOverviewModel.findOne({ userId });

  if (!userCardOverview) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Card overview not found. Please ensure your account is set up correctly."
    );
  }

  const activeTransactions = await TransactionModel.find({
    user: userId,
    status: "active",
    date: {
      $gte: monthStartDate,
      $lte: monthEndDate,
    },
  });

  const totalBalance = userCardOverview?.totalBalance || 0;

  const totalMonthlySpending = activeTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const totalMonthlyIncome = activeTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const totalCardCount = userCards.length;

  return {
    totalBalance,
    monthlySpending: totalMonthlySpending,
    monthlyIncome: totalMonthlyIncome,
    totalCard: totalCardCount,
  };
};

export const dashboardServices = {
  retrieveDashboardMetrics,
};
