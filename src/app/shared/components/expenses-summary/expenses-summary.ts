import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { Summary, DateFilter } from '../../../core/models/expense.model';
import { ArrowDown, ArrowUp , LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'app-expenses-summary',
  imports: [CommonModule , LucideAngularModule],
  templateUrl: './expenses-summary.html',
  styleUrl: './expenses-summary.scss',
})
export class ExpensesSummary {
  @Input() currentUser: User | null = null;
  @Input() summary: Summary = { totalBalance: 0, totalIncome: 0, totalExpenses: 0 };
  @Input() selectedFilter: DateFilter = DateFilter.THIS_MONTH;
  @Input() filters: DateFilter[] = [];
  @Input() showFilterDropdown = false;
  
  @Output() filterSelected = new EventEmitter<DateFilter>();
  @Output() filterDropdownToggled = new EventEmitter<void>();

  readonly arrowdown = ArrowDown ;
  readonly arrowup = ArrowUp;
  getUserInitials(): string {
    if (!this.currentUser?.name) return 'U';
    const names = this.currentUser.name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  toggleFilterDropdown(): void {
    this.filterDropdownToggled.emit();
  }

  selectFilter(filter: DateFilter): void {
    this.filterSelected.emit(filter);
  } 

  formatCurrency(amount: number): string {
    return `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
