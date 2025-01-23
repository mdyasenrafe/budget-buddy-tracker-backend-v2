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
router.put(
  "/:id",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  validateRequest(cardValidations.cardUpdateSchema),
  cardControllers.updateCard
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
router.delete(
  "/:id",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  cardControllers.deleteCard
);
router.get(
  "/:id/metrics",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  cardControllers.getCardMetrics
);

router.get(
  "/weekly-transactions/:cardId",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  cardControllers.getWeeklyTransactionsByCardID
);

export const cardRoutes = router;
