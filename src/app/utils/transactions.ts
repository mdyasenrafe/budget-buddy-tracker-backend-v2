import { TTransaction } from "../module/transaction/transaction.type";
import { TWeekRanges } from "./date";

export const calculateDateRangeTotals = (
  transactions: TTransaction[],
  ranges: TWeekRanges[]
): number[] => {
  return ranges.map(({ start, end }) => {
    const total = transactions
      .filter(
        (transaction) =>
          new Date(transaction.date) >= start &&
          new Date(transaction.date) <= end
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return total;
  });
};
