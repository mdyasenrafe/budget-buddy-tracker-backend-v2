import { Router } from "express";
import { authenticateToken } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { userRolesObject } from "../user/user.constant";
import { budgetValidations } from "../budget/budget.validation";
import { budgetControllers } from "../budget/budget.controller";

const router = Router();

router.post(
  "/",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  validateRequest(budgetValidations.TBudgetRequestSchema),
  budgetControllers.createBudget
);
router.get(
  "/:monthIndex",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  budgetControllers.getBudgets
);

export const budgetRoutes = router;
