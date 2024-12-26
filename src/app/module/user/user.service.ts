import { Types } from "mongoose";
import { UserModel } from "./user.model";
import { TUser } from "./user.interface";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { AppError } from "../../errors/AppError";

const getUserFromDB = async (id: Types.ObjectId) => {
  const result = await UserModel.findById(id);
  return result;
};

const updateUserIntoDB = async (
  currentUser: JwtPayload,
  payload: Partial<TUser>
) => {
  const { userId, role } = currentUser;
  if ("role" in payload) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Role cannot be updated. Please remove the role field from the request body if you wish to proceed."
    );
  }
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 12);
  }
  const result = await UserModel.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const userServices = {
  getUserFromDB,
  updateUserIntoDB,
};
