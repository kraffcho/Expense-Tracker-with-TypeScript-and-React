import { useState, useEffect, useRef } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import "./App.scss";

// Define the ExpenseItem interface for type safety
interface ExpenseItem {
  id: string;
  name: string;
  price: number;
  date: string;
}

function App() {
  // Initialize state for expenses from localStorage
  let initialExpenses: ExpenseItem[] = [];
  try {
    initialExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
  } catch (error) {
    // Log parsing errors
    console.error("Could not parse expenses from localStorage:", error);
  }

  // Declare state variables
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [name, setName] = useState<string>("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [price, setPrice] = useState<number | null>(null);
  const getCurrentDateString = () => format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState<string>(getCurrentDateString());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemsBeingDeleted, setItemsBeingDeleted] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<"name" | "price" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    } catch (error) {
      console.error("Could not save expenses to localStorage:", error);
    }
  }, [expenses]);

  // Reset form fields after adding/updating an expense
  const resetForm = () => {
    setName("");
    setPrice(null);
    setDate(getCurrentDateString());
    setEditingId(null);
  };

  // Scroll to the expense form when editing an expense
  useEffect(() => {
    if (editingId) {
      const formElement = document.querySelector(
        ".expenses-form"
      ) as HTMLElement;
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
        formElement.classList.add("animated-outline");

        // Remove the animated class after 3 seconds
        setTimeout(() => {
          formElement.classList.remove("animated-outline");
        }, 3000);
      }
    }
  }, [editingId]);

  // Add or update an existing expense
  const addOrUpdateExpense = () => {
    let updated = false;
    // If we are in editing mode, update the expense with the given id
    if (editingId) {
      const updatedExpenses = expenses.map((expense) => {
        if (expense.id === editingId) {
          updated = true;
          return { id: editingId, name, price: price as number, date };
        }
        return expense;
      });
      setExpenses(updatedExpenses);
    } else {
      // Otherwise, add a new expense to the list
      const newExpense: ExpenseItem = {
        id: uuidv4(),
        name,
        price: price as number,
        date,
      };
      setExpenses([...expenses, newExpense]);
    }
    // Reset form after add/update operation
    resetForm();

    // If the item was updated, clear the date filter
    if (updated) {
      clearDateFilter();
    }
  };

  // Delete an expense with animation and delay
  const deleteExpense = (id: string) => {
    setItemsBeingDeleted((prevItems) => [...prevItems, id]);
    setTimeout(() => {
      setExpenses((prevExpenses) => {
        // Remove the expense from state after 500ms
        return prevExpenses.filter((expense) => expense.id !== id);
      });
      // Remove item from itemsBeingDeleted list
      setItemsBeingDeleted((prevItems) => {
        return prevItems.filter((item) => item !== id);
      });
    }, 500);
  };

  // Edit an expense
  const editExpense = (id: string) => {
    const expenseToEdit = expenses.find((expense) => expense.id === id);
    if (expenseToEdit) {
      setName(expenseToEdit.name);
      setPrice(expenseToEdit.price);
      setDate(expenseToEdit.date);
      setEditingId(id);
      nameInputRef.current?.focus(); // Focus on the name input field
    }
  };

  // Calculate the total expenses by summing up the 'price' of all ExpenseItems
  const getTotalExpense = () =>
    expenses.reduce((total, item) => total + item.price, 0).toFixed(2);

  // Calculate the total expenses for filtered and sorted items only
  const getFilteredTotalExpense = () =>
    sortedAndFilteredExpenses
      .reduce((total, item) => total + item.price, 0)
      .toFixed(2);

  // Function to filter expenses by the selected date
  const filterByDate = (date: string) => {
    setSelectedDate(date);
  };

  // Function to clear the selected date filter
  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  // Date formatter using date-fns
  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    if (isToday(dateObj)) {
      return "Today";
    } else if (isYesterday(dateObj)) {
      return "Yesterday";
    } else {
      return format(dateObj, "dd/MM/yyyy");
    }
  };

  // Check if the form is valid before submission (name and price are required)
  const isFormValid = name && price !== null && price > 0;

  // Filter and sort expenses based on search query and sort options
  const sortedAndFilteredExpenses = expenses
    .filter((expense) =>
      expense.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((expense) => (selectedDate ? expense.date === selectedDate : true))
    .sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="App">
      <h1>Expense Tracker with TypeScript and React</h1>
      <div className="search-form">
        <input
          type="text"
          placeholder="Filter by name or click on date to filter by date"
          className="filter-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {sortedAndFilteredExpenses.length > 0 ? (
        <>
          {(selectedDate || searchQuery) && (
            <div className="filters">
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>Clear Search</button>
              )}
              {selectedDate && (
                <button onClick={clearDateFilter}>Clear Date Filter</button>
              )}
            </div>
          )}
          <ul>
            <li className="heading">
              <span>Name</span>
              <span>Price</span>
              <span>Date</span>
              <span>Actions</span>
            </li>
            {sortedAndFilteredExpenses.map((expense) => (
              <li
                key={expense.id}
                className={
                  itemsBeingDeleted.includes(expense.id) ? "fade-out" : ""
                }
              >
                <span>{expense.name}</span>
                <span>${expense.price}</span>
                <span onClick={() => filterByDate(expense.date)} className="date">
                  {formatDate(expense.date)}
                </span>
                <span>
                  <span role="img" aria-label="Edit Expense" onClick={() => editExpense(expense.id)}>✏️</span>
                  <span role="img" aria-label="Delete Expense" onClick={() => deleteExpense(expense.id)}>🗑️</span>
                </span>
              </li>
            ))}
          </ul>
          <h2> Total Expense: {(selectedDate || searchQuery) && (<><span>${getFilteredTotalExpense()}</span> of </>)} ${getTotalExpense()}</h2>
          <div className="sort-order">
            <select title="Sort" className="minimal" onChange={(e) => setSortKey(e.target.value as "name" | "price" | "date") } value={sortKey}>
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="date">Sort by Date</option>
            </select>
            <select title="Order" className="minimal" onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")} value={sortOrder}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </>
      ) : searchQuery ? (
        <p className="no-results">
          <span>
            🔎 No results found for "<strong>{searchQuery}</strong>".
          </span>
          <button onClick={() => setSearchQuery("")}>Clear Search</button>
        </p>
      ) : (
        <p>No expenses added yet.</p>
      )}
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
    </div>
  );
}

export default App;
