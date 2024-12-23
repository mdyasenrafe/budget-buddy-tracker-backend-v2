import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import { TUserRoles } from "../module/user/user.interface";
import { catchAsync } from "../utils/catchAsync";
import config from "../../config";
import { AppError } from "../errors/AppError";
import { UserModel } from "../module/user/user.model";

export const authenticateToken = (...requiredRoles: TUserRoles[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(
        token,
        config.access_token_secret as string
      ) as JwtPayload;
      const { role, userId } = decoded;
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You have no access to this route"
        );
      }
      const user = await UserModel.findById(userId);

      req.user = decoded as JwtPayload;
      if (!user) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          "User not found: The user associated with this token could not be found."
        );
      }
    } else {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Authentication failed: No token provided."
      );
    }
    next();
  });
};
