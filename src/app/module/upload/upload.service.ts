import axios from "axios";
import config from "../../../config";
import { TUpload } from "./upload.types";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const uploadFileToCloud = async (payload: TUpload) => {
  const url = `https://api.cloudinary.com/v1_1/${config.cloudinary_cloud_name}/upload`;
  payload["upload_preset"] = "ml_default";
  try {
    const response = await axios.post(url, payload);
    return {
      url: response.data.url,
      secure_url: response.data.secure_url,
      ...response.data,
    };
  } catch (error: any) {
    console.log("Error uploading file:", error.response.data);
    const statusCode = error.response
      ? error.response.status
      : httpStatus.INTERNAL_SERVER_ERROR;
    throw new AppError(statusCode, "File upload failed");
  }
};

export const uploadServices = {
  uploadFileToCloud,
};
