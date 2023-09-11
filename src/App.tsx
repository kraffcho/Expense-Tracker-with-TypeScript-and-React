import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { getCurrentDateStringUtil } from "./utils/formatDate";
import { loadExpensesFromLocalStorage, saveExpensesToLocalStorage, } from "./utils/localStorageUtil";
import { calculateTotalExpense } from "./utils/calculationUtil";
import { getSortedAndFilteredExpenses } from "./utils/filterUtil";
import { SortKey, SortOrder } from "./utils/enum";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import SearchBar from "./components/SearchBar";
import TotalExpense from "./components/TotalExpense";
import SortOptions from "./components/SortOptions";
import "./App.scss";

// Define the ExpenseItem interface for type safety
export interface ExpenseItem {
  id: string;
  name: string;
  price: number;
  date: string;
}

function App() {
  // Initialize state for expenses from localStorage
  let initialExpenses: ExpenseItem[] = loadExpensesFromLocalStorage();

  // Declare state variables
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [name, setName] = useState<string>("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [price, setPrice] = useState<number | null>(null);
  const getCurrentDateString = () => getCurrentDateStringUtil();
  const [date, setDate] = useState<string>(getCurrentDateString());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemsBeingDeleted, setItemsBeingDeleted] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>(SortKey.DATE);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    saveExpensesToLocalStorage(expenses);
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
  const totalExpenses = calculateTotalExpense(expenses);

  // Function to filter expenses by the selected date
  const filterByDate = (date: string) => {
    setSelectedDate(date);
  };

  // Function to clear the selected date filter
  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  // Filter and sort expenses based on search query and sort options
  const sortedAndFilteredExpenses = getSortedAndFilteredExpenses(
    expenses,
    searchQuery,
    selectedDate,
    sortKey,
    sortOrder
  );

  // Calculate the total expenses for filtered and sorted items only
  const filteredTotalExpenses = calculateTotalExpense(
    sortedAndFilteredExpenses
  );

  // Check if the form is valid before submission (name and price are required)
  const isFormValid = Boolean(name && price !== null && price > 0);

  return (
    <div className="App">
      <h1>Expense Tracker with TypeScript and React</h1>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
          <ExpenseList
            expenses={sortedAndFilteredExpenses}
            itemsBeingDeleted={itemsBeingDeleted}
            onDelete={deleteExpense}
            onEdit={editExpense}
            onDateFilter={filterByDate}
          />
          <TotalExpense
            totalExpenses={totalExpenses}
            filteredExpenses={filteredTotalExpenses}
            hasFilters={!!(selectedDate || searchQuery)}
          />
          <SortOptions
            sortKey={sortKey}
            sortOrder={sortOrder}
            setSortKey={setSortKey}
            setSortOrder={setSortOrder}
          />
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
      <ExpenseForm
        name={name}
        price={price}
        date={date}
        isFormValid={isFormValid}
        editingId={editingId}
        setName={setName}
        setPrice={setPrice}
        setDate={setDate}
        addOrUpdateExpense={addOrUpdateExpense}
        getCurrentDateString={getCurrentDateString}
      />
    </div>
  );
}

export default App;
