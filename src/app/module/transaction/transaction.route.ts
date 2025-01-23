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

router.delete(
  "/:id",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  transactionControllers.deleteTransaction
);

export const transactionRoutes = router;
