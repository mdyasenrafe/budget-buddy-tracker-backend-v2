import { CategoryModel } from "./category.model";
import { TCategory } from "./category.types";

const fetchCategoriesFromDB = async (): Promise<TCategory[]> => {
  const categories = await CategoryModel.find();
  return categories;
};

export const categoriesServices = {
  fetchCategoriesFromDB,
};
