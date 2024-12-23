import { Response } from "express";
import httpStatus from "http-status";

type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

type TResponse<T> = {
  message: string;
  data: T;
  token?: string;
  meta?: TMeta;
};

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: data.message,
    token: data.token,
    data: data.data,
    meta: data?.meta,
  });
};
