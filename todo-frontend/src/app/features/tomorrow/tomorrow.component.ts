import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-tomorrow',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFormComponent],
  templateUrl: './tomorrow.component.html',
  styleUrls: ['./tomorrow.component.css']
})
export class TomorrowComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;

  readonly title = 'Tomorrow';
  readonly subtitle = 'Plan ahead for a smooth day';
  readonly icon = '🌅';
  readonly section = 'TOMORROW' as const;

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