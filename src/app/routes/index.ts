import { Router } from "express";
import { uploadRoutes } from "../module/upload/upload.route";
import { userRoutes } from "../module/user/user.route";
import { AuthRoutes } from "../module/auth/auth.route";

const router = Router();

const modulesRoutes = [
  {
    path: "/upload",
    route: uploadRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
