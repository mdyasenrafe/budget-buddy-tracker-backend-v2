import express from "express";
import { uploadControllers } from "./upload.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { uploadValidations } from "./upload.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(uploadValidations.uploadSchema),
  uploadControllers.uploadFile
);

export const uploadRoutes = router;
