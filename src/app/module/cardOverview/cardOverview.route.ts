import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { userRolesObject } from "../user/user.constant";
import { cardOverviewControllers } from "./cardOverview.controller";
import { cardValidations } from "./cardOverview.validation";

const router = express.Router();

router.post(
  "/",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  validateRequest(cardValidations.CardOverviewValidationSchema),
  cardOverviewControllers.createCardOverview
);
router.get(
  "/",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  cardOverviewControllers.getCardOverview
);

export const cardOverviewRoutes = router;
