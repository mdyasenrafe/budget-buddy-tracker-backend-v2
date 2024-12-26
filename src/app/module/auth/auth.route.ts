import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { authValidations } from "./auth.validation";
import { authControllers } from "./auth.controller";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(authValidations.userSignupSchema),
  authControllers.register
);
router.post(
  "/login",
  validateRequest(authValidations.userSigninSchema),
  authControllers.signin
);

export const authRoutes = router;
