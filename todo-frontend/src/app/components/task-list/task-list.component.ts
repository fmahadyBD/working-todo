import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskSection } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="tasks.length === 0">No tasks.</div>
    <ul>
      <li *ngFor="let t of tasks">
        <strong>{{ t.task }}</strong>
        <span> [{{ t.priority }}] </span>
        <span> Status: {{ t.status }} </span>
        <span *ngIf="t.projectGoal"> | Goal: {{ t.projectGoal }}</span>
        <button (click)="complete(t)" *ngIf="t.status !== 'COMPLETED'">Complete</button>
        <button (click)="move(t, 'TODAY')">→ Today</button>
        <button (click)="move(t, 'WEEKLY')">→ Weekly</button>
        <button (click)="move(t, 'MONTHLY')">→ Monthly</button>
        <button (click)="remove(t)">Delete</button>
      </li>
    </ul>
  `
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() changed = new EventEmitter<void>();
  constructor(private taskService: TaskService) {}
  complete(t: Task): void {
    if (!t.id) return;
    this.taskService.complete(t.id).subscribe(() => this.changed.emit());
  }
  move(t: Task, section: TaskSection): void {
    if (!t.id) return;
    this.taskService.move(t.id, section).subscribe(() => this.changed.emit());
  }
  remove(t: Task): void {
    if (!t.id) return;
    if (!confirm(`Delete "${t.task}"?`)) return;
    this.taskService.delete(t.id).subscribe(() => this.changed.emit());
  }
}
