import React, { useEffect, useRef } from "react";

interface ExpenseFormProps {
  name: string;
  price: number | null;
  date: string;
  isFormValid: boolean;
  editingId: string | null;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setPrice: React.Dispatch<React.SetStateAction<number | null>>;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  addOrUpdateExpense: () => void;
  getCurrentDateString: () => string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  name,
  price,
  date,
  isFormValid,
  editingId,
  setName,
  setPrice,
  setDate,
  addOrUpdateExpense,
  getCurrentDateString,
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) {
      nameInputRef.current?.focus();
    }
  }, [editingId]);

  return (
    <div className="expenses-form">
      <div>
        <label htmlFor="nameInput" className="visually-hidden">
          Name
        </label>
        <input
          ref={nameInputRef}
          id="nameInput"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="priceInput" className="visually-hidden">
          Price
        </label>
        <input
          id="priceInput"
          type="number"
          placeholder="Price"
          min="0"
          value={price || ""}
          onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
        />
      </div>
      <div>
        <label htmlFor="dateInput" className="visually-hidden">
          Date
        </label>
        <input
          id="dateInput"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button disabled={!isFormValid} onClick={addOrUpdateExpense}>
        {isFormValid
          ? editingId
            ? "Update"
            : "Add to List"
          : "Fill all fields"}
      </button>
    </div>
  );
};

export default ExpenseForm;