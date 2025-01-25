import { Router } from "express";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { userRolesObject } from "../user/user.constant";

const router = Router();

router.get(
  "/",
  authenticateToken(userRolesObject.admin, userRolesObject.user)
  // cardControllers.getCards
);

export const dashboardRoutes = router;
