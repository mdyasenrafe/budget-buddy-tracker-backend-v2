import { TErrorSources, TGenericErrorResponse } from "../types/error";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${extractedMessage} is already exists`,
    },
  ];
  return {
    statusCode: 400,
    message: "Already Exists",
    errorSources,
  };
};
