import mongoose from "mongoose";
import { TErrorSources } from "../types/error";

export const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const statusCode = 400;
  const errorSources: TErrorSources = Object.values(err.errors).map((value) => {
    return {
      message: value.name,
      path: value.path,
    };
  });
  return {
    statusCode,
    message: "Validation error",
    errorSources,
  };
};
