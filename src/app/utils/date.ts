import { TBudgetMonthValues } from "../module/budget/budget.constant";

export const getCurrentMonth = (): (typeof TBudgetMonthValues)[number] => {
  const currentMonth = new Date().getMonth();
  return TBudgetMonthValues[currentMonth];
};
