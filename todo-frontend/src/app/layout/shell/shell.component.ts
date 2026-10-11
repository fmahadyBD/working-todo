import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css']
})
export class ShellComponent {
  nav = [
    { path: '/dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { path: '/today', label: 'Today', icon: 'fa-sun' },
    { path: '/tomorrow', label: 'Tomorrow', icon: 'fa-cloud-sun' },
    { path: '/weekly', label: 'Weekly', icon: 'fa-calendar-week' },
    { path: '/monthly', label: 'Monthly', icon: 'fa-calendar-days' },
    { path: '/notifications', label: 'Notifications', icon: 'fa-bell' },
  ];

  sidebarOpen = true;

  constructor(public notifService: NotificationService) { }

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
}