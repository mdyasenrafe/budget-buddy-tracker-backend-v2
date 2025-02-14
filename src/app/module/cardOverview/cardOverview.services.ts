import httpStatus from "http-status";
import { CardOverviewModel } from "./cardOverview.model";
import { AppError } from "../../errors/AppError";
import { Types } from "mongoose";
import { UserModel } from "../user/user.model";
import { TCardOverviewPayload } from "./cardOverview.type";

const createCardOverviewToDB = async (
  totalBalance: number,
  userId: Types.ObjectId
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const payload: TCardOverviewPayload = {
    userId: userId,
    totalBalance: totalBalance,
    accountHolderName: user?.name,
  };

  const cardOverview = await CardOverviewModel.create(payload);

  if (!cardOverview) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to create Card Overview"
    );
  }

  return cardOverview;
};

const getCardOverviewByUserId = async (userId: Types.ObjectId) => {
  const cardOverview = await CardOverviewModel.findOne({ userId })
    .populate("userId")
    .exec();

  return cardOverview;
};

export const cardOverviewServices = {
  createCardOverviewToDB,
  getCardOverviewByUserId,
};
