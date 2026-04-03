import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { analyticsServices } from "./analytics.service";
import { sendResponse } from "../../utils/sendResponse";

const getSpendingAnalytics = catchAsync(async (req: Request, res: Response) => {
  const { year, monthIndex, timezone, categoryIds } = req.query as any;
  const userId = req.user.userId;

  const result = await analyticsServices.getSpendingAnalyticsFromDB(
    userId,
    Number(year),
    Number(monthIndex),
    timezone,
    categoryIds,
  );

  sendResponse(res, {
    message: "Spending analytics retrieved successfully",
    data: result,
  });
});

const getIncomeAnalytics = catchAsync(async (req: Request, res: Response) => {
  const { year, monthIndex, timezone, categoryIds } = req.query as any;
  const userId = req.user.userId;

  const result = await analyticsServices.getIncomeAnalyticsFromDB(
    userId,
    Number(year),
    Number(monthIndex),
    timezone,
    categoryIds,
  );

  sendResponse(res, {
    message: "Income analytics retrieved successfully",
    data: result,
  });
});

export const analyticsControllers = {
  getSpendingAnalytics,
  getIncomeAnalytics,
};
