import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TodayComponent } from './components/today/today.component';
import { TomorrowComponent } from './components/tomorrow/tomorrow.component';
import { WeeklyComponent } from './components/weekly/weekly.component';
import { MonthlyComponent } from './components/monthly/monthly.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'today', component: TodayComponent },
  { path: 'tomorrow', component: TomorrowComponent },
  { path: 'weekly', component: WeeklyComponent },
  { path: 'monthly', component: MonthlyComponent },
  { path: 'notifications', component: NotificationsComponent }
];
