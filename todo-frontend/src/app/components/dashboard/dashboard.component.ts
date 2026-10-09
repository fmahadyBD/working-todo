import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Dashboard</h2>
    <div *ngIf="stats">
      <p>Today: <a routerLink="/today">{{ stats.todayTasks }}</a></p>
      <p>Tomorrow: <a routerLink="/tomorrow">{{ stats.tomorrowTasks }}</a></p>
      <p>Weekly: <a routerLink="/weekly">{{ stats.weeklyTasks }}</a></p>
      <p>Monthly: <a routerLink="/monthly">{{ stats.monthlyTasks }}</a></p>
      <p>Completed: {{ stats.completedTasks }}</p>
      <p>Pending: {{ stats.pendingTasks }}</p>
      <p>Unread Notifications: {{ stats.unreadNotifications }}</p>
    </div>
    <button (click)="load()">Refresh</button>
  `
})
export class DashboardComponent implements OnInit {
  stats?: Dashboard;
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => (this.stats = data),
      error: (err) => alert('Failed to load dashboard: ' + err.message)
    });
  }
}
