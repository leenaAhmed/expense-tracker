import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subject } from 'rxjs';
import { Summary, Expense, DateFilter } from '../../../core/models/expense.model';
import { Category } from '../../../core/services/category/category';
import { ExpenseService } from '../../../core/services/Expense/expense';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseCard } from '../../../shared/components/expense-card/expense-card';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Spinner } from '../../../shared/components/spinner/spinner';
@Component({
  selector: 'app-expenses-list',
  imports: [
    CommonModule,
    LucideAngularModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ExpenseCard,
    EmptyState,
    Spinner
  ],
  templateUrl: './expenses-list.html',
})
export class ExpensesList {
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
  filteredCount = 0;
  totalSpent = 0;
  averageSpent = 0;
  constructor(
    private expenseService: ExpenseService,
    public router: Router,
    public category: Category
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadExpenses(): void {
    this.isLoading = true;
    this.error = null;

    try {
      this.allFilteredExpenses = this.expenseService.getFilteredExpenses(this.selectedFilter);
      this.filteredCount = this.allFilteredExpenses.length;
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
    this.calculateStats();
  }

  selectFilter(filter: DateFilter): void {
    this.selectedFilter = filter;
    this.showFilterDropdown = false;
    this.loadExpenses();
  }

  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  navigateToAddExpense(): void {
    this.router.navigate(['/add-expense']);
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

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadExpenses();
  }
  calculateStats(): void {
    this.totalSpent = this.paginatedExpenses.reduce((sum, e) => sum + e.amountInUSD, 0);
    this.averageSpent = this.filteredCount > 0 ? this.totalSpent / this.filteredCount : 0;
  }
}
