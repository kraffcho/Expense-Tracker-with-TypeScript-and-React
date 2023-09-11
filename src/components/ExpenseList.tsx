import React from "react";
import { ExpenseItem } from "../App";
import { formatDateUtil } from "../utils/formatDate";

type ExpenseListProps = {
  expenses: ExpenseItem[];
  itemsBeingDeleted: string[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onDateFilter: (date: string) => void;
};

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  itemsBeingDeleted,
  onDelete,
  onEdit,
  onDateFilter,
}) => {
  return (
    <ul>
      <li className="heading">
        <span>Name</span>
        <span>Price</span>
        <span>Date</span>
        <span>Actions</span>
      </li>
      {expenses.map((expense) => (
        <li
          key={expense.id}
          className={itemsBeingDeleted.includes(expense.id) ? "fade-out" : ""}
        >
          <span>{expense.name}</span>
          <span>${expense.price}</span>
          <span onClick={() => onDateFilter(expense.date)} className="date">
            {formatDateUtil(expense.date)}
          </span>
          <span>
            <span
              role="img"
              aria-label="Edit Expense"
              onClick={() => onEdit(expense.id)}
            >
              ✏️
            </span>
            <span
              role="img"
              aria-label="Delete Expense"
              onClick={() => onDelete(expense.id)}
            >
              🗑️
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ExpenseList;