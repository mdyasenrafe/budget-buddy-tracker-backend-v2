import { Schema } from "mongoose";
import { TBudget } from "./budget.type";
import { BudgetModel } from "./budget.model";

const createBudgetToDB = (data: TBudget) => {};
const getBudgetsFromDB = (userId: Schema.Types.ObjectId) => {
  const budget = BudgetModel.find({ userId: userId });
};
