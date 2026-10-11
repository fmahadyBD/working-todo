import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFormComponent],
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;

  readonly title = 'Today';
  readonly subtitle = 'Focus on what matters right now';
  readonly icon = '☀️';
  readonly section = 'TODAY' as const;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.taskService.getBySection(this.section).subscribe({
      next: (d) => { this.tasks = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}