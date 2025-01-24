import httpStatus from "http-status";
import { AppError } from "../errors/AppError";

export const validateYearAndMonth = ({
  year,
  monthIndex,
}: {
  year: number;
  monthIndex: number;
}) => {
  if (!year || isNaN(Number(year))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "'year' is required and must be a valid number."
    );
  }

  if (!monthIndex && monthIndex !== 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "'monthIndex' is required and must be a valid number between 0 (January) and 11 (December)."
    );
  }
};
