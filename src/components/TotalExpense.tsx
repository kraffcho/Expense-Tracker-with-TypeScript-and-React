import React from "react";

interface TotalExpenseProps {
  totalExpenses: string;
  filteredExpenses: string;
  hasFilters: boolean;
}

const TotalExpense: React.FC<TotalExpenseProps> = ({
  totalExpenses,
  filteredExpenses,
  hasFilters,
}) => {
  return (
    <h2>Total Expense: {hasFilters && (
    <><span>${filteredExpenses}</span> of</>
    )} ${totalExpenses}</h2>
  );
};

export default TotalExpense;