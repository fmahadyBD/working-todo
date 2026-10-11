import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskSection, Priority } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

type SortKey = 'task' | 'category' | 'priority' | 'status' | 'plannedDate' | 'projectGoal';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() changed = new EventEmitter<void>();

  // Toolbar
  searchTerm = '';
  statusFilter: 'ALL' | 'PENDING' | 'COMPLETED' = 'ALL';
  priorityFilter: 'ALL' | Priority = 'ALL';

  // Sorting
  sortKey: SortKey = 'plannedDate';
  sortDir: 'asc' | 'desc' = 'asc';

  // Dropdown options
  readonly priorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  // In-flight tracking (disable controls while saving)
  savingIds = new Set<number>();

  constructor(private taskService: TaskService) {}

  /* ---------- Complete toggle ---------- */
  toggleComplete(t: Task, checked: boolean): void {
    if (!t.id) return;
    this.savingIds.add(t.id);

    const action$ = checked
      ? this.taskService.complete(t.id)
      : this.taskService.uncomplete(t.id);

    action$.subscribe({
      next: () => {
        this.savingIds.delete(t.id!);
        this.changed.emit();
      },
      error: () => {
        this.savingIds.delete(t.id!);
        alert('Failed to update task');
      }
    });
  }

  /* ---------- Priority dropdown ---------- */
  changePriority(t: Task, newPriority: Priority): void {
    if (!t.id || t.priority === newPriority) return;
    this.savingIds.add(t.id);

    this.taskService.updatePriority(t.id, newPriority).subscribe({
      next: () => {
        this.savingIds.delete(t.id!);
        this.changed.emit();
      },
      error: () => {
        this.savingIds.delete(t.id!);
        alert('Failed to update priority');
      }
    });
  }

  /* ---------- Row actions ---------- */
  move(t: Task, section: TaskSection): void {
    if (!t.id) return;
    this.taskService.move(t.id, section).subscribe(() => this.changed.emit());
  }

  remove(t: Task): void {
    if (!t.id) return;
    if (!confirm(`Delete "${t.task}"?`)) return;
    this.taskService.delete(t.id).subscribe(() => this.changed.emit());
  }

  /* ---------- Sorting ---------- */
  setSort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
  }

  sortIcon(key: SortKey): string {
    if (this.sortKey !== key) return '↕';
    return this.sortDir === 'asc' ? '↑' : '↓';
  }

  /* ---------- Filtering + sorting pipeline ---------- */
  get visibleTasks(): Task[] {
    const q = this.searchTerm.trim().toLowerCase();

    let list = this.tasks.filter(t => {
      // Status filter
      if (this.statusFilter === 'COMPLETED' && t.status !== 'COMPLETED') return false;
      if (this.statusFilter === 'PENDING' && t.status === 'COMPLETED') return false;

      // Priority filter
      if (this.priorityFilter !== 'ALL' && t.priority !== this.priorityFilter) return false;

      // Search
      if (!q) return true;
      return (
        (t.task || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.projectGoal || '').toLowerCase().includes(q) ||
        (t.notes || '').toLowerCase().includes(q)
      );
    });

    const dir = this.sortDir === 'asc' ? 1 : -1;
    const priorityRank: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3, URGENT: 4 };

    list = [...list].sort((a, b) => {
      const av = a[this.sortKey] ?? '';
      const bv = b[this.sortKey] ?? '';
      if (this.sortKey === 'priority') {
        return ((priorityRank[av as string] || 0) - (priorityRank[bv as string] || 0)) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });

    return list;
  }

  /* ---------- Helpers ---------- */
  isSaving(t: Task): boolean {
    return !!t.id && this.savingIds.has(t.id);
  }

  priorityClass(p?: string): string {
    return 'prio-' + (p || 'MEDIUM').toLowerCase();
  }

  statusClass(s?: string): string {
    return 'status-' + (s || 'PENDING').toLowerCase();
  }

  trackId(_: number, t: Task): number | undefined {
    return t.id;
  }
}