import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats?: Dashboard;
  loading = true;
  error?: string;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: (err) => { this.error = err.message; this.loading = false; }
    });
  }

  get cards() {
    if (!this.stats) return [];
    return [
      { label: 'Today',      value: this.stats.todayTasks,           icon: '☀️',  color: 'indigo', link: '/today' },
      { label: 'Tomorrow',   value: this.stats.tomorrowTasks,        icon: '🌅',  color: 'cyan',   link: '/tomorrow' },
      { label: 'This Week',  value: this.stats.weeklyTasks,          icon: '📅',  color: 'violet', link: '/weekly' },
      { label: 'This Month', value: this.stats.monthlyTasks,         icon: '🗓️',  color: 'pink',   link: '/monthly' },
      { label: 'Completed',  value: this.stats.completedTasks,       icon: '✅',  color: 'green' },
      { label: 'Pending',    value: this.stats.pendingTasks,         icon: '⏳',  color: 'amber' },
      { label: 'Unread',     value: this.stats.unreadNotifications,  icon: '🔔',  color: 'red',    link: '/notifications' },
    ];
  }
}