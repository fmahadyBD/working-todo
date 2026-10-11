import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',     loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'today',         loadComponent: () => import('./features/today/today.component').then(m => m.TodayComponent) },
      { path: 'tomorrow',      loadComponent: () => import('./features/tomorrow/tomorrow.component').then(m => m.TomorrowComponent) },
      { path: 'weekly',        loadComponent: () => import('./features/weekly/weekly.component').then(m => m.WeeklyComponent) },
      { path: 'monthly',       loadComponent: () => import('./features/monthly/monthly.component').then(m => m.MonthlyComponent) },
      { path: 'notifications', loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent) },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];