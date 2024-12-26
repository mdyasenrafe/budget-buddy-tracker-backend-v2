import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoriesServices } from "./catogory.service";
import { sendResponse } from "../../utils/sendResponse";

const fetchCategories = catchAsync(async (req, res) => {
  const result = await categoriesServices.fetchCategoriesFromDB();
  sendResponse(res, {
    message: "Categories fetched successfully",
    data: result,
  });
});

export const categoryControllers = {
  fetchCategories,
};
