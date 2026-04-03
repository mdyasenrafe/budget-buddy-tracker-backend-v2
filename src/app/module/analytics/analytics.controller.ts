import { Request, Response } from "express";
import { Types } from "mongoose";
import { catchAsync } from "../../utils/catchAsync";
import { analyticsServices } from "./analytics.service";
import { sendResponse } from "../../utils/sendResponse";

const getSpendingAnalytics = catchAsync(async (req: Request, res: Response) => {
  console.log("========== GET SPENDING ANALYTICS ==========");
  console.log("req.originalUrl:", req.originalUrl);
  console.log("req.query:", req.query);
  console.log("req.user:", req.user);

  const { year, monthIndex, timezone, categoryIds } = req.query as any;
  const userId = req.user.userId;

  console.log("parsed year:", Number(year));
  console.log("parsed monthIndex:", Number(monthIndex));
  console.log("parsed timezone:", timezone);
  console.log("parsed categoryIds:", categoryIds);
  console.log("userId from token:", userId);
  console.log("userId typeof:", typeof userId);
  console.log("userId as ObjectId:", new Types.ObjectId(userId));

  const result = await analyticsServices.getSpendingAnalyticsFromDB(
    userId,
    Number(year),
    Number(monthIndex),
    timezone,
    categoryIds,
  );

  console.log("final spending result:", JSON.stringify(result, null, 2));

  sendResponse(res, {
    message: "Spending analytics retrieved successfully",
    data: result,
  });
});

const getIncomeAnalytics = catchAsync(async (req: Request, res: Response) => {
  console.log("========== GET INCOME ANALYTICS ==========");
  console.log("req.originalUrl:", req.originalUrl);
  console.log("req.query:", req.query);
  console.log("req.user:", req.user);

  const { year, monthIndex, timezone, categoryIds } = req.query as any;
  const userId = req.user.userId;

  console.log("parsed year:", Number(year));
  console.log("parsed monthIndex:", Number(monthIndex));
  console.log("parsed timezone:", timezone);
  console.log("parsed categoryIds:", categoryIds);
  console.log("userId from token:", userId);
  console.log("userId typeof:", typeof userId);
  console.log("userId as ObjectId:", new Types.ObjectId(userId));

  const result = await analyticsServices.getIncomeAnalyticsFromDB(
    userId,
    Number(year),
    Number(monthIndex),
    timezone,
    categoryIds,
  );

  console.log("final income result:", JSON.stringify(result, null, 2));

  sendResponse(res, {
    message: "Income analytics retrieved successfully",
    data: result,
  });
});

export const analyticsControllers = {
  getSpendingAnalytics,
  getIncomeAnalytics,
};
