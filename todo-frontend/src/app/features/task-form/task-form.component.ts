import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Priority, TaskRequest, TaskSection } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Output() created = new EventEmitter<void>();

  expanded = false;
  submitting = false;
  error?: string;

  priorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  sections: TaskSection[] = ['TODAY', 'TOMORROW', 'WEEKLY', 'MONTHLY'];

  model: TaskRequest = this.blank();

  constructor(private taskService: TaskService) {}

  blank(): TaskRequest {
    return {
      task: '',
      category: '',
      priority: 'MEDIUM',
      section: 'TODAY',
      plannedDate: new Date().toISOString().slice(0, 10),
      projectGoal: '',
      notes: ''
    };
  }

  toggle() { this.expanded = !this.expanded; }

  submit(): void {
    if (!this.model.task.trim()) { this.error = 'Task name is required'; return; }
    this.submitting = true;
    this.error = undefined;
    this.taskService.create(this.model).subscribe({
      next: () => {
        this.submitting = false;
        this.model = this.blank();
        this.expanded = false;
        this.created.emit();
      },
      error: (err) => { this.error = err.message; this.submitting = false; }
    });
  }
}