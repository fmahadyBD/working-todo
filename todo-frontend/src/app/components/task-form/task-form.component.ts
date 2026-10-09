import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Priority, TaskRequest, TaskSection } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3>Create Task</h3>
    <form (ngSubmit)="submit()">
      <div><label>Task *</label> <input [(ngModel)]="model.task" name="task" required /></div>
      <div><label>Category</label> <input [(ngModel)]="model.category" name="category" /></div>
      <div>
        <label>Priority</label>
        <select [(ngModel)]="model.priority" name="priority">
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>
      </div>
      <div>
        <label>Section</label>
        <select [(ngModel)]="model.section" name="section">
          <option value="TODAY">TODAY</option>
          <option value="TOMORROW">TOMORROW</option>
          <option value="WEEKLY">WEEKLY</option>
          <option value="MONTHLY">MONTHLY</option>
        </select>
      </div>
      <div><label>Planned Date</label> <input type="date" [(ngModel)]="model.plannedDate" name="plannedDate" /></div>
      <div><label>Project / Goal</label> <input [(ngModel)]="model.projectGoal" name="projectGoal" /></div>
      <div><label>Notes</label> <textarea [(ngModel)]="model.notes" name="notes"></textarea></div>
      <button type="submit">Create</button>
    </form>
  `
})
export class TaskFormComponent {
  @Output() created = new EventEmitter<void>();
  model: TaskRequest = {
    task: '',
    category: '',
    priority: 'MEDIUM' as Priority,
    section: 'TODAY' as TaskSection,
    plannedDate: new Date().toISOString().slice(0, 10),
    projectGoal: '',
    notes: ''
  };
  constructor(private taskService: TaskService) {}
  submit(): void {
    if (!this.model.task.trim()) { alert('Task name is required'); return; }
    this.taskService.create(this.model).subscribe({
      next: () => {
        this.model.task = '';
        this.model.category = '';
        this.model.notes = '';
        this.created.emit();
      },
      error: (err) => alert('Failed to create: ' + err.message)
    });
  }
}
