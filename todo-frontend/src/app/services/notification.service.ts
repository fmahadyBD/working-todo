import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notification } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private url = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Notification[]> { return this.http.get<Notification[]>(this.url); }
  getUnread(): Observable<Notification[]> { return this.http.get<Notification[]>(`${this.url}/unread`); }
  markRead(id: number): Observable<Notification> {
    return this.http.patch<Notification>(`${this.url}/${id}/read`, {});
  }
}
