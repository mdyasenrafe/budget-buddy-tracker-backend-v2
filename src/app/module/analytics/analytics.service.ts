import { Types } from "mongoose";
import { TransactionModel } from "../transaction/transaction.model";
import { CategoryModel } from "../category/category.model";
import { getMonthEnd, getMonthStart } from "../../utils/date";

const getAnalyticsFromDB = async (
  userId: Types.ObjectId,
  type: "income" | "expense",
  year: number,
  month: number,
  timezone: string,
  categoryIds?: string,
) => {
  const startDate = getMonthStart(year, month, timezone);
  const endDate = getMonthEnd(year, month, timezone);

  const normalizedUserId =
    typeof userId === "string" ? new Types.ObjectId(userId) : userId;

  const matchStage: any = {
    user: normalizedUserId,
    type,
    status: "active",
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  if (categoryIds) {
    const ids = categoryIds
      .split(",")
      .map((id) => new Types.ObjectId(id.trim()));
    matchStage.category = { $in: ids };
  }

  const groupedTransactions = await TransactionModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  const categoryObjectIds = groupedTransactions
    .map((item) => {
      try {
        return new Types.ObjectId(String(item._id));
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Types.ObjectId[];

  const categories = await CategoryModel.find({
    _id: { $in: categoryObjectIds },
  })
    .select("_id label")
    .lean();

  const categoryMap = new Map(
    categories.map((category: any) => [String(category._id), category.label]),
  );

  const finalCategories = groupedTransactions.map((item) => ({
    _id: String(item._id),
    totalAmount: item.totalAmount,
    label: categoryMap.get(String(item._id)) || "Unknown",
  }));

  const total = finalCategories.reduce(
    (sum, item) => sum + item.totalAmount,
    0,
  );

  return {
    total,
    categories: finalCategories,
  };
};

const getSpendingAnalyticsFromDB = async (
  userId: Types.ObjectId,
  year: number,
  month: number,
  timezone: string,
  categoryIds?: string,
) => {
  return await getAnalyticsFromDB(
    userId,
    "expense",
    year,
    month,
    timezone,
    categoryIds,
  );
};

const getIncomeAnalyticsFromDB = async (
  userId: Types.ObjectId,
  year: number,
  month: number,
  timezone: string,
  categoryIds?: string,
) => {
  return await getAnalyticsFromDB(
    userId,
    "income",
    year,
    month,
    timezone,
    categoryIds,
  );
};

export const analyticsServices = {
  getSpendingAnalyticsFromDB,
  getIncomeAnalyticsFromDB,
};
