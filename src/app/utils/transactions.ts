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

export const calculateWeeklyBalances = (
  transactions: TTransaction[],
  weeklyRanges: TWeekRanges[],
  runningBalance: number
) => {
  return weeklyRanges.map((range) => {
    const weeklyTransactions = transactions.filter(
      (txn) => txn.date >= range.start && txn.date <= range.end
    );

    const weeklyTotalChange = weeklyTransactions.reduce((sum, txn) => {
      return txn.type === "income" ? sum + txn.amount : sum - txn.amount;
    }, 0);

    runningBalance += weeklyTotalChange;

    return runningBalance;
  });
};
