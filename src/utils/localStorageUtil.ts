import { ExpenseItem } from "../App";

export const loadExpensesFromLocalStorage = (): ExpenseItem[] => {
  try {
    return JSON.parse(localStorage.getItem("expenses") || "[]");
  } catch (error) {
    console.error("Could not parse expenses from localStorage:", error);
    return [];
  }
};

export const saveExpensesToLocalStorage = (expenses: ExpenseItem[]) => {
  try {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  } catch (error) {
    console.error("Could not save expenses to localStorage:", error);
  }
};
