import { v4 as uuidv4 } from "uuid";
import { Category, DratfExpense, Expense } from "../types";

export type BudgetActions =
  | { type: "add-budget"; payload: { budget: number } }
  | { type: "show-modal" }
  | { type: "hide-modal" }
  | { type: "add-expense"; payload: { expense: DratfExpense } }
  | { type: "remove-expense"; payload: { id: Expense["id"] } }
  | { type: "get-expense-by-id"; payload: { id: Expense["id"] } }
  | { type: "update-expense"; payload: { expense: Expense } }
  | { type: "reset" }
  | { type: "filter-category"; payload: { id: Category["id"] } };

export type BudgetState = {
  budget: number;
  modal: boolean;
  expenses: Expense[];
  editingID: Expense["id"];
  currentCategory: Category["id"];
};

const initialBudget = (): number => {
  const localStorageBudget = localStorage.getItem("budget");
  return localStorageBudget ? +localStorageBudget : 0;
};

const localStorageExpenses = (): Expense[] => {
  const localStorageExpenses = localStorage.getItem("expenses");
  return localStorageExpenses ? JSON.parse(localStorageExpenses) : [];
};

export const initialState: BudgetState = {
  budget: initialBudget(),
  modal: false,
  expenses: localStorageExpenses(),
  editingID: "",
  currentCategory: "",
};

const createExpense = (draftExpense: DratfExpense): Expense => {
  return {
    ...draftExpense,
    id: uuidv4(),
  };
};

export const budgetReducer = (
  state: BudgetState = initialState,
  action: BudgetActions,
): BudgetState => {
  if (action.type === "add-budget") {
    return {
      ...state,
      budget: action.payload.budget,
    };
  }
  if (action.type === "show-modal") {
    return {
      ...state,
      modal: true,
    };
  }
  if (action.type === "hide-modal") {
    return {
      ...state,
      modal: false,
      editingID: "",
    };
  }
  if (action.type === "add-expense") {
    const expense = createExpense(action.payload.expense);
    return {
      ...state,
      expenses: [...state.expenses, expense],
      modal: false,
    };
  }
  if (action.type === "remove-expense") {
    return {
      ...state,
      expenses: state.expenses.filter(
        (expense) => expense.id !== action.payload.id,
      ),
    };
  }
  if (action.type === "get-expense-by-id") {
    return {
      ...state,
      modal: true,
      editingID: action.payload.id,
    };
  }
  if (action.type === "update-expense") {
    return {
      ...state,
      expenses: state.expenses.map((expense) =>
        expense.id === action.payload.expense.id
          ? action.payload.expense
          : expense,
      ),
      modal: false,
      editingID: "",
    };
  }
  if (action.type === "reset") {
    return {
      ...state,
      budget: 0,
      expenses: [],
    };
  }
  if (action.type === "filter-category") {
    return {
      ...state,
      currentCategory: action.payload.id,
    };
  }

  return state;
};
