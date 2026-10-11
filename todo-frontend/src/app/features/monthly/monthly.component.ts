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
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.css']
})
export class MonthlyComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;

  readonly title = 'Monthly';
  readonly subtitle = 'Big picture, long-term goals';
  readonly icon = '🗓️';
  readonly section = 'MONTHLY' as const;

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