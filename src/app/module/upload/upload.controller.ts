import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { uploadServices } from "./upload.service";

const uploadFile = catchAsync(async (req, res) => {
  const result = await uploadServices.uploadFileToCloud(req.body);
  sendResponse(res, {
    data: result,
    message: "File uploaded successfully",
  });
});

export const uploadControllers = {
  uploadFile,
};
