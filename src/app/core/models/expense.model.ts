import { ExpenseCategory } from "./category.model";

export interface Expense {
  id: string;
  category: ExpenseCategory;
  categoryIcon: string;
  amount: number;
  currency: string;
  amountInUSD: number;
  date: Date;
  receipt?: string;
  frequency: 'Manually' | 'Daily' | 'Weekly' | 'Monthly';
  createdAt: Date;
}

export enum DateFilter {
  ALL = 'All Time',
  THIS_MONTH = 'This month',
  LAST_7_DAYS = 'Last 7 Days',
  LAST_30_DAYS = 'Last 30 Days',
  THIS_YEAR = 'This Year'
}

export interface Summary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  hasMore: boolean;
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' }
];