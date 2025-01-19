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
  "/month/:monthIndex",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  budgetControllers.getBudgets
);
router.get(
  "/:id",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  budgetControllers.getBudgetById
);
router.put(
  "/:id",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  validateRequest(budgetValidations.TBudgetEditSchema),
  budgetControllers.editBudget
);
router.delete(
  "/:id/delete",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  budgetControllers.deleteBudget
);

export const budgetRoutes = router;
