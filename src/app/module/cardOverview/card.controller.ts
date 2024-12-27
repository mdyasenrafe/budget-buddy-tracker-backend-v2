import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { cardOverviewServices } from "./card.services";
import { TUser } from "../user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

const createCardOverview = catchAsync(async (req: Request, res: Response) => {
  const cardOverviewData = req.body;
  const userId = req?.user?.userId;
  const result = await cardOverviewServices.createCardOverviewToDB(
    cardOverviewData,
    userId
  );
  sendResponse(res, {
    data: result,
    message: "Card Overview created successfully",
  });
});

const getCardOverview = catchAsync(async (req: Request, res: Response) => {
  const userId: string = req.user?._id;
  const cardOverview =
    await cardOverviewServices.getCardOverviewByUserId(userId);
  sendResponse(res, {
    data: cardOverview,
    message: "Card Overview retrieved successfully",
  });
});

export const cardOverviewControllers = {
  createCardOverview,
  getCardOverview,
};
