import mongoose, { Schema } from "mongoose";
import { CardModel } from "./card.model";
import { TCard } from "./card.type";
import { AppError } from "../../errors/AppError";
import { CardOverviewModel } from "../cardOverview/cardOverview.model";

const getCardsFromDB = async (id: string) => {
  const result = await CardModel.find({ userId: id }).populate("userId");
  return result;
};

const getCardsByIdFromDB = async (id: string) => {
  const result = await CardModel.findById(id).populate("userId");
  return result;
};

const createCardToDB = async (cardData: TCard, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payload = {
      ...cardData,
      userId: userId,
      totalDeposit: Number(cardData.totalBalance),
    };

    const newCard = await CardModel.create([payload], { session });

    const cardOverview = await CardOverviewModel.findOneAndUpdate(
      { userId: userId },
      {
        $inc: {
          totalBalance: +cardData.totalBalance,
          totalDeposit: +cardData.totalBalance,
        },
      },
      { new: true, session, upsert: true }
    );

    await session.commitTransaction();
    session.endSession();

    return newCard;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      error.statusCode || 500,
      error.message || "An error occurred during card creation"
    );
  }
};

export const cardServices = {
  createCardToDB,
  getCardsFromDB,
  getCardsByIdFromDB,
};
