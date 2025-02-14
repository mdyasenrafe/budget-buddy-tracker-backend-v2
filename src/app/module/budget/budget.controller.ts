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

const getBudgetById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const budget = await budgetServices.getBudgetByIdFromDB(id);
  sendResponse(res, {
    message: "Budget retrieved successfully",
    data: budget,
  });
});

const editBudget = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const updateData = req.body;

  const updatedBudget = await budgetServices.editBudgetToDB(
    id,
    user?.userId,
    updateData
  );

  sendResponse(res, {
    message: "Budget updated successfully",
    data: updatedBudget,
  });
});

const deleteBudget = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  const updatedBudget = await budgetServices.deleteBudgetFromDB(
    id,
    user?.userId
  );

  sendResponse(res, {
    message: "Budget deleted successfully",
    data: updatedBudget,
  });
});

const getWeeklyTransactionsByBudgetID = catchAsync(
  async (req: Request, res: Response) => {
    const currentUser = req.user;
    const budgetId = req?.params?.budgetId;
    const { year, monthIndex, timezone } = req.query;

    const weeklyTotals =
      await budgetServices.getWeeklyTransactionByBudgetIDFromDB(
        currentUser?.userId,
        budgetId,
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

export const budgetControllers = {
  createBudget,
  getBudgets,
  getBudgetById,
  editBudget,
  deleteBudget,
  getWeeklyTransactionsByBudgetID,
};
