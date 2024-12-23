import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../types/error";

export const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const message = "Validation error";
  const errorSources: TErrorSources = err.errors.map((error: ZodIssue) => {
    return {
      message: error.message,
      path: error.path[error.path.length - 1],
    };
  });

  return {
    statusCode,
    message,
    errorSources,
  };
};
