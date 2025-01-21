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

export const categorizeTransactionsByWeek = (
  transactions: TTransaction[],
  weeklyRanges: TWeekRanges[]
): { income: number[]; expense: number[] } => {
  const income: number[] = [];
  const expense: number[] = [];

  weeklyRanges.forEach(({ start, end }) => {
    const weeklyTransactions = transactions.filter(
      (txn) => txn.date >= start && txn.date <= end
    );

    const weeklyIncome = weeklyTransactions
      .filter((txn) => txn.type === "income")
      .reduce((sum, txn) => sum + txn.amount, 0);

    const weeklyExpense = weeklyTransactions
      .filter((txn) => txn.type === "expense")
      .reduce((sum, txn) => sum + txn.amount, 0);

    income.push(weeklyIncome);
    expense.push(weeklyExpense);
  });

  return { income, expense };
};
