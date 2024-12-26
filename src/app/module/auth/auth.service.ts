import httpStatus from "http-status";
import { TUser } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import bcrypt from "bcrypt";
import { AppError } from "../../errors/AppError";
import { generateToken } from "../../utils/tokenGenerateFunction";

const createUserIntoDB = async (payload: TUser) => {
  if (payload.role === "admin") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to create an admin user"
    );
  }

  if (payload.status === "deleted" || payload.status === "inactive") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to create an inactive or deleted user"
    );
  }

  const result = await UserModel.create(payload);
  const token = generateToken(result._id, result.role);
  return { data: result, token };
};

const signinUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (user.status === "deleted") {
    throw new AppError(httpStatus.FORBIDDEN, "User account has been deleted");
  }

  const token = generateToken(user._id, user.role);
  return { data: user, token };
};

export const authServices = {
  createUserIntoDB,
  signinUser,
};
