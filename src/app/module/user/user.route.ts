import express from "express";
import { UserRolesObject } from "./user.constant";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { UserControllers } from "./user.controller";
import { authenticateToken } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get(
  "/me",
  authenticateToken(UserRolesObject.admin, UserRolesObject.user),
  UserControllers.getProfile
);
router.put(
  "/me",
  authenticateToken(UserRolesObject.admin, UserRolesObject.user),
  validateRequest(UserValidations.userUpdateSchema),
  UserControllers.updateProfile
);

export const userRoutes = router;
