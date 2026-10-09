import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task, TaskRequest, TaskSection } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private url = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Task[]> { return this.http.get<Task[]>(this.url); }
  getBySection(section: TaskSection): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}/section/${section}`);
  }
  getById(id: number): Observable<Task> { return this.http.get<Task>(`${this.url}/${id}`); }
  create(payload: TaskRequest): Observable<Task> { return this.http.post<Task>(this.url, payload); }
  update(id: number, payload: TaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.url}/${id}`, payload);
  }
  complete(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/${id}/complete`, {});
  }
  move(id: number, section: TaskSection): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/${id}/move/${section}`, {});
  }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
