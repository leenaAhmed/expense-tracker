import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard-guard';
import { Navigation } from './shared/components/navigation/navigation';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: '',
    component: Navigation ,
    children: [
      {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard ]
  },
  {
    path: 'expenses',
    loadComponent: () => import('./features/expenses/expenses-list/expenses-list').then(m => m.ExpensesList),
    canActivate: [authGuard]
  },
    ]
  },
  {
    path: 'add-expense',
    loadComponent: () => import('./features/expenses/add-expense/add-expense').then(m => m.AddExpense),
    canActivate: [authGuard ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
