import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/task.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Notifications</h2>
    <button (click)="load()">Refresh</button>
    <div *ngIf="items.length === 0">No notifications.</div>
    <ul>
      <li *ngFor="let n of items">
        <strong>{{ n.title }}</strong> — {{ n.message }}
        <small>({{ n.createdAt | date:'short' }})</small>
        <span *ngIf="!n.read"> 🔴 NEW</span>
        <button *ngIf="!n.read" (click)="markRead(n)">Mark Read</button>
      </li>
    </ul>
  `
})
export class NotificationsComponent implements OnInit {
  items: Notification[] = [];
  constructor(private notificationService: NotificationService) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.notificationService.getAll().subscribe({
      next: (data) => (this.items = data),
      error: (err) => alert('Failed: ' + err.message)
    });
  }
  markRead(n: Notification): void {
    if (!n.id) return;
    this.notificationService.markRead(n.id).subscribe(() => this.load());
  }
}
