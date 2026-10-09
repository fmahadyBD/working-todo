import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-monthly',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFormComponent],
  template: `
    <h2>Monthly</h2>
    <app-task-form (created)="load()"></app-task-form>
    <hr />
    <app-task-list [tasks]="tasks" (changed)="load()"></app-task-list>
  `
})
export class MonthlyComponent implements OnInit {
  tasks: Task[] = [];
  constructor(private taskService: TaskService) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.taskService.getBySection('MONTHLY').subscribe({
      next: (data) => (this.tasks = data),
      error: (err) => alert('Failed to load tasks: ' + err.message)
    });
  }
}
