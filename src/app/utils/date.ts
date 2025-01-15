import { TBudgetMonthValues } from "../module/budget/budget.constant";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getCurrentMonth = (): (typeof TBudgetMonthValues)[number] => {
  const currentMonth = new Date().getMonth();
  return TBudgetMonthValues[currentMonth];
};

export const getWeeklyRanges = (monthStart: Date, timezone: string) => {
  const start = dayjs(monthStart).tz(timezone).startOf("week").add(1, "day");
  const endOfMonth = dayjs(monthStart).tz(timezone).endOf("month");

  const weeks: { start: Date; end: Date }[] = [];
  let currentWeekStart = start;

  while (currentWeekStart.isBefore(endOfMonth)) {
    const currentWeekEnd = currentWeekStart.endOf("week").isAfter(endOfMonth)
      ? endOfMonth
      : currentWeekStart.endOf("week");
    weeks.push({
      start: currentWeekStart.toDate(),
      end: currentWeekEnd.toDate(),
    });
    currentWeekStart = currentWeekStart.add(1, "week").startOf("week");
  }

  return weeks;
};
