import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { dashboardServices } from "./dashboard.service";

const getDashboardMetrics = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user;
  const { year, monthIndex, timezone } = req.query;
  const dashboardMetrics = await dashboardServices.retrieveDashboardMetrics(
    currentUser?.userId,
    Number(year),
    Number(monthIndex),
    timezone as string
  );

  sendResponse(res, {
    message: "Dashboard metrics fetched successfully.",
    data: dashboardMetrics,
  });
});

const getBalanceTrend = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user;
  const { year, monthIndex, timezone } = req.query;

  const balanceTrend = await dashboardServices.getBalanceTrend(
    currentUser?.userId,
    Number(year),
    Number(monthIndex),
    timezone as string
  );

  sendResponse(res, {
    message: "Balance trend fetched successfully.",
    data: balanceTrend,
  });
});

const getWeeklySpendIncomeComparison = catchAsync(
  async (req: Request, res: Response) => {
    const currentUser = req.user;
    const { year, monthIndex, timezone } = req.query;

    const weeklyComparison =
      await dashboardServices.getWeeklySpendIncomeComparison(
        currentUser?.userId,
        Number(year),
        Number(monthIndex),
        timezone as string
      );

    sendResponse(res, {
      message: "Weekly spend-income comparison fetched successfully.",
      data: weeklyComparison,
    });
  }
);

export const dashboardControllers = {
  getDashboardMetrics,
  getBalanceTrend,
  getWeeklySpendIncomeComparison,
};
