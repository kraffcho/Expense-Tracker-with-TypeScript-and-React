import { ExpenseItem } from "../App";
import { SortKey, SortOrder } from "./enum";

export const getSortedAndFilteredExpenses = (
  expenses: ExpenseItem[],
  searchQuery: string,
  selectedDate: string | null,
  sortKey: SortKey,
  sortOrder: SortOrder
) => {
  return expenses
    .filter((expense) =>
      expense.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((expense) => (selectedDate ? expense.date === selectedDate : true))
    .sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
};
