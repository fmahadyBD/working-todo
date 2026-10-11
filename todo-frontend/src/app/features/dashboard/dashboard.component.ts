import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { forkJoin } from 'rxjs';

import { DashboardService } from '../../services/dashboard.service';
import { TaskService } from '../../services/task.service';
import { Dashboard, Task } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats?: Dashboard;
  tasks: Task[] = [];
  loading = true;
  error?: string;

  /* ============================================================
     KPI CARDS
     ============================================================ */
  get cards() {
    if (!this.stats) return [];
    const s = this.stats;
    return [
      { label: 'Today',      value: s.todayTasks,          icon: 'fa-sun',            color: 'indigo', link: '/today' },
      { label: 'Tomorrow',   value: s.tomorrowTasks,       icon: 'fa-cloud-sun',      color: 'cyan',   link: '/tomorrow' },
      { label: 'This Week',  value: s.weeklyTasks,         icon: 'fa-calendar-week',  color: 'violet', link: '/weekly' },
      { label: 'This Month', value: s.monthlyTasks,        icon: 'fa-calendar-days',  color: 'pink',   link: '/monthly' },
      { label: 'Completed',  value: s.completedTasks,      icon: 'fa-circle-check',   color: 'green',  subtitle: `${this.completionPercent}% of total` },
      { label: 'Pending',    value: s.pendingTasks,        icon: 'fa-hourglass-half', color: 'amber',  subtitle: 'Awaiting action' },
      { label: 'Unread',     value: s.unreadNotifications, icon: 'fa-bell',           color: 'red',    link: '/notifications', subtitle: 'Notifications' },
    ];
  }

  /* ============================================================
     CHART 1 — Doughnut (status breakdown)
     ============================================================ */
  public doughnutType = 'doughnut' as const;

  public doughnutData: ChartData<'doughnut'> = {
    labels: ['Completed', 'Pending', 'Today', 'Tomorrow', 'Weekly', 'Monthly'],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0],
      backgroundColor: [
        'rgba(16, 185, 129, 0.85)',
        'rgba(245, 158, 11, 0.85)',
        'rgba(99, 102, 241, 0.85)',
        'rgba(56, 189, 248, 0.85)',
        'rgba(167, 139, 250, 0.85)',
        'rgba(244, 114, 182, 0.85)',
      ],
      borderColor: 'rgba(18, 18, 26, 1)',
      borderWidth: 3,
      hoverOffset: 8,
    }]
  };

  public doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#a1a1b5',
          padding: 14,
          font: { family: 'Inter', size: 12, weight: 600 },
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(18, 18, 26, 0.95)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      }
    }
  };

  /* ============================================================
     CHART 2 — Bar (tasks per section)
     ============================================================ */
  public barType = 'bar' as const;

  public barData: ChartData<'bar'> = {
    labels: ['Today', 'Tomorrow', 'Weekly', 'Monthly'],
    datasets: [{
      label: 'Active tasks',
      data: [0, 0, 0, 0],
      backgroundColor: [
        'rgba(99, 102, 241, 0.75)',
        'rgba(56, 189, 248, 0.75)',
        'rgba(167, 139, 250, 0.75)',
        'rgba(244, 114, 182, 0.75)',
      ],
      borderWidth: 0,
      borderRadius: 10,
      borderSkipped: false,
      barPercentage: 0.55,
    }]
  };

  public barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(18, 18, 26, 0.95)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        ticks: { color: '#a1a1b5', font: { family: 'Inter', size: 12, weight: 600 } },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6b6b85',
          font: { family: 'Inter', size: 11 },
          stepSize: 1,
          precision: 0,
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
        border: { display: false },
      }
    }
  };

  /* ============================================================
     CHART 3 — Line (7-day trend)
     ============================================================ */
  public lineType = 'line' as const;

  public lineData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Created',
        data: [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgb(99, 102, 241)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        borderWidth: 3,
      },
      {
        label: 'Completed',
        data: [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgb(16, 185, 129)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        borderWidth: 3,
      }
    ]
  };

  public lineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#a1a1b5',
          padding: 16,
          font: { family: 'Inter', size: 12, weight: 600 },
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(18, 18, 26, 0.95)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        ticks: { color: '#6b6b85', font: { family: 'Inter', size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6b6b85',
          font: { family: 'Inter', size: 11 },
          stepSize: 1,
          precision: 0,
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
        border: { display: false },
      }
    }
  };

  /* ============================================================
     Lifecycle
     ============================================================ */
  constructor(
    private dashboardService: DashboardService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = undefined;

    forkJoin({
      stats: this.dashboardService.getStats(),
      tasks: this.taskService.getAll(),
    }).subscribe({
      next: ({ stats, tasks }) => {
        this.stats = stats;
        this.tasks = tasks;
        this.updateCharts(stats);
        this.buildTrend(tasks);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load dashboard';
        this.loading = false;
      }
    });
  }

  /* ============================================================
     Chart updates
     ============================================================ */
  private updateCharts(s: Dashboard): void {
    this.doughnutData = {
      ...this.doughnutData,
      datasets: [{
        ...this.doughnutData.datasets[0],
        data: [
          s.completedTasks,
          s.pendingTasks,
          s.todayTasks,
          s.tomorrowTasks,
          s.weeklyTasks,
          s.monthlyTasks,
        ]
      }]
    };

    this.barData = {
      ...this.barData,
      datasets: [{
        ...this.barData.datasets[0],
        data: [s.todayTasks, s.tomorrowTasks, s.weeklyTasks, s.monthlyTasks]
      }]
    };
  }

  private buildTrend(tasks: Task[]): void {
    const DAYS = 7;
    const labels: string[] = [];
    const created: number[] = [];
    const completed: number[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = DAYS - 1; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(day.getDate() - i);
      const dayMs = day.getTime();

      labels.push(
        day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
      );

      const createdCount = tasks.filter(t => {
        if (!t.createdDate) return false;
        const c = new Date(t.createdDate);
        c.setHours(0, 0, 0, 0);
        return c.getTime() === dayMs;
      }).length;

      const completedCount = tasks.filter(t => {
        if (!t.completedAt) return false;
        const c = new Date(t.completedAt);
        c.setHours(0, 0, 0, 0);
        return c.getTime() === dayMs;
      }).length;

      created.push(createdCount);
      completed.push(completedCount);
    }

    this.lineData = {
      labels,
      datasets: [
        { ...this.lineData.datasets[0], data: created },
        { ...this.lineData.datasets[1], data: completed },
      ]
    };
  }

  /* ============================================================
     Helpers
     ============================================================ */
  get completionPercent(): number {
    if (!this.stats) return 0;
    const s = this.stats;
    const total = s.completedTasks + s.pendingTasks;
    return total === 0 ? 0 : Math.round((s.completedTasks / total) * 100);
  }

  get totalTasks(): number {
    if (!this.stats) return 0;
    const s = this.stats;
    return s.todayTasks + s.tomorrowTasks + s.weeklyTasks + s.monthlyTasks;
  }

  get ringDashOffset(): number {
    const circumference = 2 * Math.PI * 52;
    return circumference - (circumference * this.completionPercent / 100);
  }

  get ringCircumference(): number {
    return 2 * Math.PI * 52;
  }
}