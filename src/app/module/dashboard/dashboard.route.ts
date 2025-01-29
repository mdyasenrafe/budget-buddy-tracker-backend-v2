import { Router } from "express";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { userRolesObject } from "../user/user.constant";
import { dashboardControllers } from "./dashboard.controller";

const router = Router();

router.get(
  "/metric",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  dashboardControllers.getDashboardMetrics
);

router.get(
  "/balance-trend",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  dashboardControllers.getBalanceTrend
);

export const dashboardRoutes = router;
