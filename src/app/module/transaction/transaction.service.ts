/**
 * @function addTransaction
 * Handles the addition of a transaction based on its type (income or expense).
 *
 * Process:
 * 1. Determine the transaction type (income or expense).
 *
 * For Income:
 * - If a card is selected:
 *    - Update the card's `totalBalance` and `totalDeposit`.
 *    - Update the `CardOverviewModel` to reflect the new balance and deposit.
 *
 * For Expense:
 * - If a budget is selected:
 *    - Check if the budget exists:
 *        - If it exists, update the `spent` value in the budget model.
 * - If a card is selected:
 *    - Update the card's `totalBalance` and `totalExpense`.
 *    - Update the `CardOverviewModel` to reflect the new balance and expense.
 *
 * lastly we need to add this transction to our transaction model
 */
const addTransaction = () => {};
