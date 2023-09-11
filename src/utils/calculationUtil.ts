import { ExpenseItem } from "../App";

export const calculateTotalExpense = (expenses: ExpenseItem[]): string => {
  return expenses.reduce((total, item) => total + item.price, 0).toFixed(2);
};