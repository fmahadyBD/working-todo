import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/task.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  items: Notification[] = [];
  loading = true;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.notificationService.getAll().subscribe({
      next: (d) => { this.items = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  markRead(n: Notification): void {
    if (!n.id) return;
    this.notificationService.markRead(n.id).subscribe(() => this.load());
  }

  get unreadCount(): number { return this.items.filter(i => !i.read).length; }
}