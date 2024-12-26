import express from "express";
import { categoryControllers } from "./category.cotroller";

const router = express.Router();

router.get("/", categoryControllers.fetchCategories);

export const categoryRoutes = router;
