import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { authValidations } from "../auth/auth.validation";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { userRolesArray, userRolesObject } from "../user/user.constant";
import { userValidations } from "../user/user.validation";
import { cardOverviewControllers } from "./card.controller";
import { cardValidations } from "./card.validation";

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
