import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, catchError } from 'rxjs';
import { of } from 'rxjs';
import { Summary, Expense, DateFilter } from '../../core/models/expense.model';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth/auth';
import { ExpenseService } from '../../core/services/Expense/expense';
import { CommonModule } from '@angular/common';
import { Navigation } from '../../shared/components/navigation/navigation';
import { ExpensesSummary } from '../../shared/components/expenses-summary/expenses-summary';
import { LucideAngularModule } from 'lucide-angular';
import { Category } from '../../core/services/category/category';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,ExpensesSummary,LucideAngularModule],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit, OnDestroy {
  currentUser: User | null = null;
  summary: Summary = { totalBalance: 0, totalIncome: 0, totalExpenses: 0 };
  paginatedExpenses: Expense[] = [];
  allFilteredExpenses: Expense[] = [];
  hasMore = false;  
  selectedFilter: DateFilter = DateFilter.THIS_MONTH;
  filters = Object.values(DateFilter);
  showFilterDropdown = false;
  
  isLoading = false;
  error: string | null = null;
  
  private readonly PAGE_SIZE = 10;
  private currentPage = 1;
  private destroy$ = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    public router: Router,
    public categoryService: Category
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSummary();
    this.loadExpenses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSummary(): void {
    this.expenseService.getSummary(this.selectedFilter)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.error = 'Failed to load summary. Please try again.';
          return of({ totalBalance: 0, totalIncome: 0, totalExpenses: 0 });
        })
      )
      .subscribe(summary => {
        this.summary = summary;
        this.error = null;
      });
  }

  loadExpenses(): void {
    this.isLoading = true;
    this.error = null;
    
    try {
      this.allFilteredExpenses = this.expenseService.getFilteredExpenses(this.selectedFilter);
      
      this.currentPage = 1;
      
      this.loadPage(1);
    } catch (error) {
      this.error = 'Failed to load expenses. Please try again.';
      this.paginatedExpenses = [];
      this.hasMore = false;
    } finally {
      this.isLoading = false;
    }
  }

  private loadPage(page: number): void {
    const startIndex = (page - 1) * this.PAGE_SIZE;
    const endIndex = startIndex + this.PAGE_SIZE;
    
    const pageExpenses = this.allFilteredExpenses.slice(startIndex, endIndex);
    
    if (page === 1) {
      this.paginatedExpenses = pageExpenses;
    } else {
      this.paginatedExpenses = [...this.paginatedExpenses, ...pageExpenses];
    }
    
    this.currentPage = page;
    this.hasMore = endIndex < this.allFilteredExpenses.length;
  }
  
  selectFilter(filter: DateFilter): void {
    this.selectedFilter = filter;
    this.showFilterDropdown = false;
    this.loadSummary();
    this.loadExpenses();
  }   

  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  navigateToAddExpense(): void {
    this.router.navigate(['/add-expense']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadMore(): void {
    if (!this.isLoading && this.hasMore) {
      this.isLoading = true;
      setTimeout(() => {
        this.loadPage(this.currentPage + 1);
        this.isLoading = false;
      }, 300);
    }
  }
}
