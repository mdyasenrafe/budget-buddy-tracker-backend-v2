import express from "express";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { userRolesObject } from "../user/user.constant";
import { analyticsControllers } from "./analytics.controller";

const router = express.Router();

router.get(
  "/spending",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  analyticsControllers.getSpendingAnalytics
);

router.get(
  "/income",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  analyticsControllers.getIncomeAnalytics
);

export const analyticsRoutes = router;
