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
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/today', label: 'Today', icon: '☀️' },
    { path: '/tomorrow', label: 'Tomorrow', icon: '🌅' },
    { path: '/weekly', label: 'Weekly', icon: '📅' },
    { path: '/monthly', label: 'Monthly', icon: '🗓️' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
  ];

  sidebarOpen = true;

  constructor(public notifService: NotificationService) {}

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
}