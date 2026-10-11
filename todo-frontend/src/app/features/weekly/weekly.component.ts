import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-weekly',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFormComponent],
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.css']
})
export class WeeklyComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;

  readonly title = 'Weekly';
  readonly subtitle = 'Your week at a glance';
  readonly icon = '📅';
  readonly section = 'WEEKLY' as const;

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