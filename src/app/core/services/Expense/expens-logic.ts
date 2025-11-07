// src/app/core/services/expense.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Expense, DateFilter, PaginationState, Summary } from '../../models/expense.model';
import { CurrencyService } from '../Currency/currency';
import { StorageService } from '../Storage/storage';
 

@Injectable({
  providedIn: 'root'
})
export class ExpenseLogic {
  private readonly STORAGE_KEY = 'expenses';
  private readonly INCOME_KEY = 'income';
  
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  private incomeSubject = new BehaviorSubject<number>(10840); // Default from design
  
  public expenses$ = this.expensesSubject.asObservable();
  public income$ = this.incomeSubject.asObservable();

  constructor(
    private storage: StorageService,
    private currency: CurrencyService
  ) {
    this.loadExpenses();
    this.loadIncome();
  }

  /**
   * Load expenses from localStorage
   */
  private loadExpenses(): void {
    const expenses = this.storage.getItem<Expense[]>(this.STORAGE_KEY) || [];
    // Convert date strings back to Date objects
    const parsedExpenses = expenses.map(e => ({
      ...e,
      date: new Date(e.date),
      createdAt: new Date(e.createdAt)
    }));
    this.expensesSubject.next(parsedExpenses);
  }

  /**
   * Load income from localStorage
   */
  private loadIncome(): void {
    const income = this.storage.getItem<number>(this.INCOME_KEY);
    if (income !== null) {
      this.incomeSubject.next(income);
    }
  }

  /**
   * Add new expense with currency conversion
   */
  addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'amountInUSD'>): Observable<void> {
    return this.currency.convertToUSD(expense.amount, expense.currency).pipe(
      tap(amountInUSD => {
        const newExpense: Expense = {
          ...expense,
          id: this.generateId(),
          amountInUSD: Number(amountInUSD.toFixed(2)),
          createdAt: new Date()
        };

        const expenses = [...this.expensesSubject.value, newExpense];
        this.storage.setItem(this.STORAGE_KEY, expenses);
        this.expensesSubject.next(expenses);
      }),
      map(() => void 0)
    );
  }

  /**
   * Update existing expense
   */
  updateExpense(id: string, updates: Partial<Expense>): Observable<void> {
    const expenses = this.expensesSubject.value;
    const index = expenses.findIndex(e => e.id === id);
    
    if (index === -1) {
      throw new Error('Expense not found');
    }

    const expense = { ...expenses[index], ...updates };
    
    // If amount or currency changed, recalculate USD amount
    if (updates.amount !== undefined || updates.currency !== undefined) {
      return this.currency.convertToUSD(expense.amount, expense.currency).pipe(
        tap(amountInUSD => {
          expense.amountInUSD = Number(amountInUSD.toFixed(2));
          expenses[index] = expense;
          this.storage.setItem(this.STORAGE_KEY, expenses);
          this.expensesSubject.next([...expenses]);
        }),
        map(() => void 0)
      );
    }

    expenses[index] = expense;
    this.storage.setItem(this.STORAGE_KEY, expenses);
    this.expensesSubject.next([...expenses]);
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  /**
   * Delete expense
   */
  deleteExpense(id: string): void {
    const expenses = this.expensesSubject.value.filter(e => e.id !== id);
    this.storage.setItem(this.STORAGE_KEY, expenses);
    this.expensesSubject.next(expenses);
  }

  /**
   * Get filtered expenses with pagination
   */
  getFilteredExpenses(
    filter: DateFilter,
    page: number = 1,
    pageSize: number = 10
  ): { expenses: Expense[]; pagination: PaginationState } {
    const allExpenses = this.expensesSubject.value;
    const filtered = this.applyDateFilter(allExpenses, filter);
    
    // Sort by date descending (newest first)
    const sorted = filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Apply pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = sorted.slice(start, end);

    return {
      expenses: paginated,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: sorted.length,
        hasMore: end < sorted.length
      }
    };
  }

  /**
   * Apply date filter
   */
  private applyDateFilter(expenses: Expense[], filter: DateFilter): Expense[] {
    const now = new Date();

    switch (filter) {
      case DateFilter.THIS_MONTH:
        return expenses.filter(e => {
          const expenseDate = new Date(e.date);
          return expenseDate.getMonth() === now.getMonth() && 
                 expenseDate.getFullYear() === now.getFullYear();
        });
      
      case DateFilter.LAST_7_DAYS:
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return expenses.filter(e => new Date(e.date) >= sevenDaysAgo);
      
      case DateFilter.LAST_30_DAYS:
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return expenses.filter(e => new Date(e.date) >= thirtyDaysAgo);
      
      case DateFilter.THIS_YEAR:
        return expenses.filter(e => 
          new Date(e.date).getFullYear() === now.getFullYear()
        );
      
      case DateFilter.ALL:
      default:
        return expenses;
    }
  }

  /**
   * Get summary (balance, income, expenses)
   */
  getSummary(filter: DateFilter = DateFilter.ALL): Observable<Summary> {
    return this.expenses$.pipe(
      map(allExpenses => {
        const filtered = this.applyDateFilter(allExpenses, filter);
        const totalExpenses = filtered.reduce((sum, e) => sum + e.amountInUSD, 0);
        const income = this.incomeSubject.value;
        
        return {
          totalIncome: Number(income.toFixed(2)),
          totalExpenses: Number(totalExpenses.toFixed(2)),
          totalBalance: Number((income - totalExpenses).toFixed(2))
        };
      })
    );
  }

  /**
   * Update income
   */
  setIncome(amount: number): void {
    this.storage.setItem(this.INCOME_KEY, amount);
    this.incomeSubject.next(amount);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all expenses
   */
  clearAllExpenses(): void {
    this.storage.removeItem(this.STORAGE_KEY);
    this.expensesSubject.next([]);
  }
}