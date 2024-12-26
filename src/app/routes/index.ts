import { Router } from "express";
import { uploadRoutes } from "../module/upload/upload.route";
import { userRoutes } from "../module/user/user.route";
import { authRoutes } from "../module/auth/auth.route";
import { categoryRoutes } from "../module/category/category.route";

const router = Router();

const modulesRoutes = [
  {
    path: "/upload",
    route: uploadRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/category",
    route: categoryRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
