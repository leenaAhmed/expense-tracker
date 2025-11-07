import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular/src/icons';
import { Category } from '../../../core/services/category/category';
import { Expense } from '../../../core/models/expense.model';

@Component({
  selector: 'app-expense-card',
  imports: [LucideAngularModule ],
  templateUrl: './expense-card.html',
})
export class ExpenseCard { 
  @Input() expense?: Expense;
  constructor(
      public router: Router,
      public category: Category
    ) {}
}
