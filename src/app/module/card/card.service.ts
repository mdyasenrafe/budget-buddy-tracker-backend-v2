import mongoose from "mongoose";
import { CardModel } from "./card.model";
import { TCard } from "./card.type";
import { AppError } from "../../errors/AppError";
import { CardOverviewModel } from "../cardOverview/card.model";

const getCardsFromDB = async (id: string) => {
  const result = await CardModel.find({ userId: id }).populate("userId");
  return result;
};

const createCardToDB = async (cardData: TCard, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payload = {
      ...cardData,
      userId: userId,
      totalDeposit: cardData.totalBalance,
    };

    const newCard = await CardModel.create([payload], { session });

    const user = await CardOverviewModel.findByIdAndUpdate(
      userId,
      {
        $inc: {
          totalBalance: +cardData.totalBalance,
          totalDeposit: +cardData.totalDeposit,
        },
      },
      { new: true, session }
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

export const CardServices = {
  createCardToDB,
  getCardsFromDB,
};
