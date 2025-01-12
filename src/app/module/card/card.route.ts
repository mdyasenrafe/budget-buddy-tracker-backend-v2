import { Router } from "express";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { cardValidations } from "./card.validation";
import { userRolesObject } from "../user/user.constant";
import { cardControllers } from "./card.controller";
const router = Router();

router.post(
  "/",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  validateRequest(cardValidations.cardCreateSchema),
  cardControllers.createCard
);
router.get(
  "/",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  cardControllers.getCards
);
router.get(
  "/:id",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  cardControllers.getCardById
);

export const cardRoutes = router;
