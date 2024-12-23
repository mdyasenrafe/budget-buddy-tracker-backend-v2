import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Userservices } from "./user.service";

const getProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await Userservices.getUserFromDB(user.userId);
  sendResponse(res, {
    message: "User profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { user, body } = req;
  const result = await Userservices.updateUserIntoDB(user, body);
  sendResponse(res, {
    message: "Profile updated successfully",
    data: result,
  });
});

export const UserControllers = {
  getProfile,
  updateProfile,
};
