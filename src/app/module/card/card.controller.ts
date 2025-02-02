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

const deleteCard = catchAsync(async (req: Request, res: Response) => {
  const cardId: string = req.params.id;
  const result = await cardServices.deleteCardFromDB(cardId);
  sendResponse(res, {
    message: "Card deleted successfully",
    data: result,
  });
});

const getCardMetrics = catchAsync(async (req: Request, res: Response) => {
  const { id: cardId } = req.params;
  const { year, monthIndex, timezone } = req.query;

  const user = req.user;

  // Fetch metrics
  const metrics = await cardServices.getCardMetrics(
    user?.userId,
    cardId,
    Number(year),
    Number(monthIndex),
    (timezone as string) || "UTC"
  );

  sendResponse(res, {
    message: "Card metrics retrieved successfully",
    data: metrics,
  });
});

const getWeeklyTransactionsByCardID = catchAsync(
  async (req: Request, res: Response) => {
    const currentUser = req.user;
    const cardId = req?.params?.cardId;
    const { year, monthIndex, timezone } = req.query;

    const weeklyTotals = await cardServices.getWeeklyTransactionByCardIDFromDB(
      currentUser?.userId,
      cardId,
      parseInt(year as string),
      parseInt(monthIndex as string),
      (timezone as string) || "UTC"
    );

    sendResponse(res, {
      message: "Weekly transactions retrieved successfully",
      data: weeklyTotals,
    });
  }
);

const getWeeklyTransactionSummaryByCardID = catchAsync(
  async (req: Request, res: Response) => {
    const currentUser = req.user;
    const cardId = req?.params?.cardId;
    const { year, monthIndex, timezone } = req.query;

    const weeklySummaries =
      await cardServices.getWeeklyTransactionSummaryByCardID(
        currentUser?.userId,
        cardId,
        parseInt(year as string),
        parseInt(monthIndex as string),
        (timezone as string) || "UTC"
      );

    sendResponse(res, {
      message: "Weekly transaction summaries retrieved successfully",
      data: weeklySummaries,
    });
  }
);

const getSpendingCategoriesByCardID = catchAsync(
  async (req: Request, res: Response) => {
    const currentUser = req.user;
    const cardId = req?.params?.cardId;
    const { year, monthIndex, timezone } = req.query;

    const weeklySummaries = await cardServices.getSpendingCategoriesByCardID(
      currentUser?.userId,
      cardId,
      parseInt(year as string),
      parseInt(monthIndex as string),
      (timezone as string) || "UTC"
    );

    sendResponse(res, {
      message: "Weekly transaction summaries retrieved successfully",
      data: weeklySummaries,
    });
  }
);

export const cardControllers = {
  createCard,
  getCards,
  getCardById,
  updateCard,
  deleteCard,
  getCardMetrics,
  getWeeklyTransactionsByCardID,
  getWeeklyTransactionSummaryByCardID,
  getSpendingCategoriesByCardID,
};
