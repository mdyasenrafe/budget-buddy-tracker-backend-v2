import express from "express";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { userRolesObject } from "../user/user.constant";
import { validateRequest } from "../../middlewares/validateRequest";
import { analyticsValidations } from "./analytics.validation";
import { analyticsControllers } from "./analytics.controller";

const router = express.Router();

router.get(
  "/spending",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  validateRequest(analyticsValidations.getAnalyticsSchema),
  analyticsControllers.getSpendingAnalytics
);

router.get(
  "/income",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  validateRequest(analyticsValidations.getAnalyticsSchema),
  analyticsControllers.getIncomeAnalytics
);

export const analyticsRoutes = router;
