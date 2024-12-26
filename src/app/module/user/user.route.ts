import express from "express";
import { userRolesObject } from "./user.constant";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidations } from "./user.validation";
import { userControllers } from "./user.controller";
import { authenticateToken } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get(
  "/me",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  userControllers.getProfile
);
router.put(
  "/me",
  authenticateToken(userRolesObject.admin, userRolesObject.user),
  validateRequest(userValidations.userUpdateSchema),
  userControllers.updateProfile
);

export const userRoutes = router;
