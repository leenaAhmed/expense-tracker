import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CATEGORY_OPTIONS, ExpenseCategory } from '../../../core/models/category.model';
import { CURRENCIES } from '../../../core/models/expense.model';
import { ExpenseService } from '../../../core/services/Expense/expense';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LucideAngularModule, ShoppingCart , IceCreamCone , CarFront , CalendarDays, House, ShoppingBag, Newspaper, Car, Building2, Plus} from 'lucide-angular';

@Component({
  selector: 'app-add-expense',
  imports: [CommonModule, 
    ReactiveFormsModule ,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    LucideAngularModule,
    MatButtonModule],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.scss',
})
export class AddExpense {
  expenseForm: FormGroup;
  categoryOptions = CATEGORY_OPTIONS;
  currencies = CURRENCIES;
  showCategoryDropdown = false;
  selectedFileName = '';
  isSubmitting = false;
  readonly Plus = Plus;
  readonly CalendarDays= CalendarDays;
  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router
  ) {
    this.expenseForm = this.fb.group({
      category: ['Entertainment', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      currency: ['USD', Validators.required],
      date: [this.getTodayDate(), Validators.required],
      receipt: [null],
      frequency: ['Manually']
    });
  }

  ngOnInit(): void {}

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  toggleCategoryDropdown(): void {
    this.showCategoryDropdown = !this.showCategoryDropdown;
  }

  selectCategory(category: ExpenseCategory): void {
    this.expenseForm.patchValue({ category });
    this.showCategoryDropdown = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.expenseForm.patchValue({ receipt: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.expenseForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: any } = {
      'Groceries': ShoppingCart,
      'Entertainment':IceCreamCone ,
      'Transportation': CarFront,
      'Rent': House,
      'News Paper': Newspaper,
      'Gas': Building2,
      'Shopping': ShoppingBag
    };
    return icons[category] || '';
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      this.isSubmitting = true;
      const formValue = this.expenseForm.value;
      
      // Find category icon
      const categoryOption = this.categoryOptions.find(c => c.name === formValue.category);
      
      const expense = {
        category: formValue.category,
        categoryIcon: categoryOption?.icon || 'box',
        amount: parseFloat(formValue.amount),
        currency: formValue.currency,
        date: new Date(formValue.date),
        receipt: formValue.receipt,
        frequency: formValue.frequency as any
      };

      this.expenseService.addExpense(expense).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error adding expense:', error);
          this.isSubmitting = false;
          alert('Failed to add expense. Please try again.');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  // In your component
    getCurrencySymbol(): string {
      const currencyCode = this.expenseForm.get('currency')?.value || 'USD';
      const currency = this.currencies.find(c => c.code === currencyCode);
      return currency?.symbol || '$';
    }
}


