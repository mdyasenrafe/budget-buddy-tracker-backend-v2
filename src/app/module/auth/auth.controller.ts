import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const { data, token } = await authServices.createUserIntoDB(req.body);
  sendResponse(res, {
    data: data,
    token,
    message: "User registered successfully",
  });
});

const signin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { data, token } = await authServices.signinUser(email, password);
  sendResponse(res, {
    data: data,
    token,
    message: "User logged in successfully",
  });
});

export const authControllers = {
  register,
  signin,
};
