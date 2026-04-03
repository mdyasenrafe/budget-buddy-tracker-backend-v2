import { Types } from "mongoose";
import { TransactionModel } from "../transaction/transaction.model";
import { getMonthEnd, getMonthStart } from "../../utils/date";

const getAnalyticsFromDB = async (
  userId: Types.ObjectId,
  type: "income" | "expense",
  year: number,
  month: number,
  timezone: string,
  categoryIds?: string
) => {
  const startDate = getMonthStart(year, month, timezone);
  const endDate = getMonthEnd(year, month, timezone);

  const matchStage: any = {
    user: userId,
    type,
    status: "active",
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  if (categoryIds) {
    const ids = categoryIds.split(",").map((id) => new Types.ObjectId(id.trim()));
    matchStage.category = { $in: ids };
  }

  const aggregation = await TransactionModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    { $unwind: "$categoryDetails" },
    {
      $project: {
        _id: 1,
        totalAmount: 1,
        label: "$categoryDetails.label",
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  const total = aggregation.reduce((sum, item) => sum + item.totalAmount, 0);

  return {
    total,
    categories: aggregation,
  };
};

const getSpendingAnalyticsFromDB = async (
  userId: Types.ObjectId,
  year: number,
  month: number,
  timezone: string,
  categoryIds?: string
) => {
  return await getAnalyticsFromDB(
    userId,
    "expense",
    year,
    month,
    timezone,
    categoryIds
  );
};

const getIncomeAnalyticsFromDB = async (
  userId: Types.ObjectId,
  year: number,
  month: number,
  timezone: string,
  categoryIds?: string
) => {
  return await getAnalyticsFromDB(
    userId,
    "income",
    year,
    month,
    timezone,
    categoryIds
  );
};

export const analyticsServices = {
  getSpendingAnalyticsFromDB,
  getIncomeAnalyticsFromDB,
};
