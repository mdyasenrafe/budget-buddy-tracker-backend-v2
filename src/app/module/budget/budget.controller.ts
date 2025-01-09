import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { budgetServices } from "./budget.service";

const createBudget = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const budgetData = req.body;
  const newBudget = await budgetServices.createBudgetToDB(
    budgetData,
    user?.userId
  );

  sendResponse(res, {
    message: "Budget created successfully",
    data: newBudget,
  });
});

const getBudgets = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const monthIndex = Number(req.params.monthIndex);
  const budgets = await budgetServices.getBudgetsFromDB(
    user?.userId,
    monthIndex
  );

  sendResponse(res, {
    message: "Budgets retrieved successfully",
    data: budgets,
  });
});

export const budgetControllers = {
  createBudget,
  getBudgets,
};
