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

export const dashboardRoutes = router;
