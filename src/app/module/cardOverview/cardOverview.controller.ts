import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { cardOverviewServices } from "./cardOverview.services";

const createCardOverview = catchAsync(async (req: Request, res: Response) => {
  const cardOverviewData = req.body;
  const userId = req?.user?.userId;
  const result = await cardOverviewServices.createCardOverviewToDB(
    cardOverviewData?.totalBalance,
    userId
  );
  sendResponse(res, {
    data: result,
    message: "Card Overview created successfully",
  });
});

const getCardOverview = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId;
  const result = await cardOverviewServices.getCardOverviewByUserId(userId);
  sendResponse(res, {
    data: result,
    message: "Card Overview retrieved successfully",
  });
});

export const cardOverviewControllers = {
  createCardOverview,
  getCardOverview,
};
