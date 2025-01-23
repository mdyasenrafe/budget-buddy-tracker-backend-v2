import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { transactionServices } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";

const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user;
  const transactionData = req.body;
  const newTransaction = await transactionServices.addTransaction(
    transactionData,
    currentUser?.userId
  );

  sendResponse(res, {
    message: "Transaction created successfully",
    data: newTransaction,
  });
});

const getTransactions = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user;
  const queryParams = req?.query;
  const { result, meta } =
    await transactionServices.getTransactionsFromDBByUserId(
      currentUser?.userId,
      queryParams
    );

  sendResponse(res, {
    message: "Transactions retrieved successfully",
    data: result,
    meta: meta,
  });
});

const getTransactionById = catchAsync(async (req: Request, res: Response) => {
  const transactionId: string = req?.params?.id;
  const transaction =
    await transactionServices.getTransactionFromDBById(transactionId);

  sendResponse(res, {
    message: "Transaction retrieved successfully",
    data: transaction,
  });
});

const deleteTransaction = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user;
  const transactionId: string = req?.params?.id;

  await transactionServices.deleteTransactionFromDB(
    transactionId,
    currentUser?.userId
  );

  sendResponse(res, {
    message: "Transaction deleted successfully",
    data: {},
  });
});

export const transactionControllers = {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
};
