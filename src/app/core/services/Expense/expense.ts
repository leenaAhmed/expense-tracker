import { Injectable } from '@angular/core';
import { differenceInDays, isSameMonth } from 'date-fns';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Expense, DateFilter, Summary } from '../../models/expense.model';
import { CurrencyService } from '../Currency/currency';
import { StorageService } from '../Storage/storage';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expensesSubject.asObservable();

  constructor(
    private storage: StorageService,
    private currency: CurrencyService
  ) {
    this.loadExpenses();
  }

  private loadExpenses(): void {
    const expenses = this.storage.getItem<Expense[]>('expenses') || [];
    this.expensesSubject.next(expenses);
  }

  addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'amountInUSD'>): Observable<void> {
    return this.currency.convertToUSD(expense.amount, expense.currency).pipe(
      map(amountInUSD => {
        const newExpense: Expense = {
          ...expense,
          id: this.generateId(),
          amountInUSD,
          createdAt: new Date()
        };
        
        const expenses = [...this.expensesSubject.value, newExpense];
        this.storage.setItem('expenses', expenses);
        this.expensesSubject.next(expenses);
      })
    );
  }

  getFilteredExpenses(filter: DateFilter): Expense[] {
    const expenses = this.expensesSubject.value;
    const now = new Date();
    
    let filtered: Expense[] = [];
    
    switch (filter) {
      case DateFilter.LAST_7_DAYS:
        filtered = expenses.filter(e => 
          differenceInDays(now, new Date(e.date)) <= 7
        );
        break;
      case DateFilter.THIS_MONTH:
        filtered = expenses.filter(e => 
          isSameMonth(now, new Date(e.date))
        );
        break;
      case DateFilter.LAST_30_DAYS:
        filtered = expenses.filter(e => 
          differenceInDays(now, new Date(e.date)) <= 30
        );
        break;
      case DateFilter.THIS_YEAR:
        filtered = expenses.filter(e => 
          new Date(e.date).getFullYear() === now.getFullYear()
        );
        break;
      default:
        filtered = expenses;
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getSummary(selectedFilter: DateFilter): Observable<Summary>{
    return this.expenses$.pipe(
      map(expenses => {
        const filtered = this.getFilteredExpenses(selectedFilter);
        const totalBalance = filtered.reduce((acc, expense) => {
          return acc + expense.amountInUSD;
        }, 0);
        const totalIncome = filtered.filter(expense => expense.amountInUSD > 0).reduce((acc, expense) => {
          return acc + expense.amountInUSD;
        }, 0);
        const totalExpenses = Math.abs(filtered.filter(expense => expense.amountInUSD < 0).reduce((acc, expense) => {
          return acc + expense.amountInUSD;
        }, 0));
        return { totalBalance, totalIncome, totalExpenses };
      })
    );
  }
}

