import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TCard } from "./card.type";
import { sendResponse } from "../../utils/sendResponse";
import { cardServices } from "./card.service";

const createCard = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const cardData: TCard = req.body;
  const newCard = await cardServices.createCardToDB(cardData, user?.userId);

  sendResponse(res, {
    message: "Card created successfully",
    data: newCard,
  });
});

const getCards = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const cards = await cardServices.getCardsFromDB(user?.userId);
  sendResponse(res, {
    message: "Cards retrieved successfully",
    data: cards,
  });
});

const getCardById = catchAsync(async (req: Request, res: Response) => {
  const cardId: string = req?.params?.id;
  const cards = await cardServices.getCardsByIdFromDB(cardId);
  sendResponse(res, {
    message: "Cards retrieved successfully",
    data: cards,
  });
});

const updateCard = catchAsync(async (req: Request, res: Response) => {
  const cardId: string = req.params.id;
  const updateData = req.body;
  const updatedCard = await cardServices.updateCardInDB(cardId, updateData);
  sendResponse(res, {
    message: "Card updated successfully",
    data: updatedCard,
  });
});

export const cardControllers = {
  createCard,
  getCards,
  getCardById,
  updateCard,
};
