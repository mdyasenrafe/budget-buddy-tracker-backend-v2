import { ICategory } from "./category.types";
import CategoryModel from "./category.model";

const fetchCategoriesFromDB = async (): Promise<ICategory[]> => {
  const categories = await CategoryModel.find();
  return categories;
};

export const categoriesServices = {
  fetchCategoriesFromDB,
};
