import React, { useEffect, useRef, KeyboardEvent } from "react";

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

// Rendering the form and adding or editing an expense
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
  const formRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const lastFocusedElementRef = useRef<string | null>(null);

  // Focus the name input when editing an expense
  useEffect(() => {
    if (editingId) {
      nameInputRef.current?.focus();
    }
  }, [editingId]);

  // Handle clicks outside the form
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        lastFocusedElementRef.current = null;
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    if (
      !editingId &&
      name === "" &&
      price === null &&
      date === getCurrentDateString() &&
      (lastFocusedElementRef.current === "nameInput" ||
        lastFocusedElementRef.current === "priceInput")
    ) {
      nameInputRef.current?.focus();
    }
  }, [name, price, date, editingId, getCurrentDateString]);

  // Add or Update the expense when the user presses Enter
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && isFormValid) {
      addOrUpdateExpense();
    }
  };

  const handleFocus = (id: string) => {
    lastFocusedElementRef.current = id;
  };

  return (
    <div ref={formRef} className="expenses-form">
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
          onKeyDown={handleKeyDown}
          onFocus={() => handleFocus("nameInput")}
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
          onKeyDown={handleKeyDown}
          onFocus={() => handleFocus("priceInput")}
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
          onKeyDown={handleKeyDown}
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
