import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'employee',
    loadComponent: () => import('./employee/dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent),
    canActivate: [roleGuard(['Employee'])]
  },
  {
    path: 'manager',
    loadComponent: () => import('./manager/dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent),
    canActivate: [roleGuard(['Manager', 'HRAdmin'])]
  },
  {
    path: 'hr',
    loadComponent: () => import('./hr/dashboard/hr-dashboard.component').then(m => m.HrDashboardComponent),
    canActivate: [roleGuard(['HRAdmin', 'Manager'])]
  },
  { path: '**', redirectTo: '/login' }
];
