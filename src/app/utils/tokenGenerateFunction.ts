import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import config from "../../config";

export const generateToken = (id: Types.ObjectId, role: string): string => {
  const token = jwt.sign(
    { userId: id, role: role },
    config.access_token_secret as string
  );
  return token;
};
