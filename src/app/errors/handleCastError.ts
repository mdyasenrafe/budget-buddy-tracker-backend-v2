import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../types/error";

export const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];
  return {
    statusCode: 404,
    message: "Invalid id",
    errorSources,
  };
};
