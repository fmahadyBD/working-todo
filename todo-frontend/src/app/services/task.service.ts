import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task, TaskRequest, Priority, TaskSection } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private url = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url);
  }

  getBySection(section: TaskSection): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}/section/${section}`);
  }

  /** Only pending/in-progress tasks in a section */
  getActiveBySection(section: TaskSection): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}/section/${section}/active`);
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.url}/${id}`);
  }

  create(req: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.url, req);
  }

  update(id: number, req: TaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.url}/${id}`, req);
  }

  complete(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/${id}/complete`, {});
  }

  uncomplete(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/${id}/uncomplete`, {});
  }

  move(id: number, section: TaskSection): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/${id}/move/${section}`, {});
  }

  /** ✅ Change only the priority of a task */
  updatePriority(id: number, priority: Priority): Observable<Task> {
    // Fetch full task first, then update
    return new Observable<Task>(observer => {
      this.getById(id).subscribe({
        next: (task) => {
          const req: TaskRequest = {
            task: task.task,
            category: task.category,
            priority: priority,                    // ⬅️ new priority
            status: task.status,
            section: task.section,
            plannedDate: task.plannedDate,
            originalDueDate: task.originalDueDate,
            projectGoal: task.projectGoal,
            notes: task.notes
          };
          this.update(id, req).subscribe(observer);
        },
        error: (err) => observer.error(err)
      });
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}