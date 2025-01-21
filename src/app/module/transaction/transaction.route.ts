import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { transactionValidations } from "./transaction.validation";
import { transactionControllers } from "./transaction.controller";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { userRolesObject } from "../user/user.constant";

const router = express.Router();

router.post(
  "/",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  validateRequest(transactionValidations.createTransactionSchema),
  transactionControllers.createTransaction
);
router.get(
  "/",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  transactionControllers.getTransactions
);
router.get(
  "/:id",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  transactionControllers.getTransactionById
);
router.get(
  "/weekly-budget-transactions/:budgetId",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  transactionControllers.getWeeklyTransactionsByBudgetID
);

router.get(
  "/weekly-card-transactions/:cardId",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  transactionControllers.getWeeklyTransactionsByCardID
);
router.delete(
  "/:id",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  transactionControllers.deleteTransaction
);

router.get(
  "/weekly-summary-card/:cardId",
  transactionControllers.getWeeklyTransactionSummaryByCardID
);

export const transactionRoutes = router;
