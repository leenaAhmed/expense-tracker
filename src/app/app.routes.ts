import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard-guard';

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
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard ]
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
