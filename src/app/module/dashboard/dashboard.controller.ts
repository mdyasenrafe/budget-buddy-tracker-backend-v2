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
