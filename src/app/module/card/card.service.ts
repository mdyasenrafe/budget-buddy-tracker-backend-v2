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

const updateCardInDB = async (id: string, updateData: Partial<TCard>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingCard = await CardModel.findById(id);
    if (!existingCard) {
      throw new AppError(404, "Card not found");
    }

    const result = await CardModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      session,
    });

    if (
      updateData.totalBalance &&
      existingCard.totalBalance !== updateData.totalBalance
    ) {
      const balanceDifference =
        updateData.totalBalance - existingCard.totalBalance;
      await CardOverviewModel.findOneAndUpdate(
        { userId: existingCard.userId },
        {
          $inc: {
            totalBalance: balanceDifference,
          },
        },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      error.statusCode || 500,
      error.message || "An error occurred during card update"
    );
  }
};

const deleteCardFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const card = await CardModel.findOneAndUpdate(
      { _id: id },
      { status: "deleted" },
      { new: true, session }
    );

    if (!card) {
      throw new AppError(404, "Card not found");
    }

    await CardOverviewModel.findOneAndUpdate(
      { userId: card.userId },
      {
        $inc: {
          totalBalance: -card.totalBalance,
          totalDeposit: -card.totalBalance,
        },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return card;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      error.statusCode || 500,
      error.message || "An error occurred during card deletion"
    );
  }
};

export const cardServices = {
  createCardToDB,
  getCardsFromDB,
  getCardsByIdFromDB,
  updateCardInDB,
  deleteCardFromDB,
};
