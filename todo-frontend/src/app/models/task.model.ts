export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
export type TaskSection = 'TODAY' | 'TOMORROW' | 'WEEKLY' | 'MONTHLY';

export interface Task {
  id?: number;
  task: string;
  category?: string;
  priority?: Priority;
  status?: TaskStatus;
  section?: TaskSection;
  createdDate?: string;
  plannedDate?: string;
  originalDueDate?: string;
  completedAt?: string;
  projectGoal?: string;
  notes?: string;
  lastUpdated?: string;
}

export interface TaskRequest {
  task: string;
  category?: string;
  priority?: Priority;
  status?: TaskStatus;
  section?: TaskSection;
  plannedDate?: string;
  originalDueDate?: string;
  projectGoal?: string;
  notes?: string;
}

export interface Notification {
  id?: number;
  title: string;
  message: string;
  taskId?: number;
  read: boolean;
  createdAt?: string;
}

export interface Dashboard {
  todayTasks: number;
  tomorrowTasks: number;
  weeklyTasks: number;
  monthlyTasks: number;
  completedTasks: number;
  pendingTasks: number;
  unreadNotifications: number;
}
