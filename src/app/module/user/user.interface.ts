import { userRolesObject } from "./user.constant";

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  status: "pending" | "active" | "inactive" | "deleted";
  photo: string;
  source: "web" | "app";
};

export type TUserRoles = keyof typeof userRolesObject;
