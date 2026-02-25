export interface Task {
  id: string;
  title: string;
  completed: boolean;
  startDate: number; // timestamp
  dueDate: number;   // timestamp
}

export type TaskFilter = "all" | "active" | "completed";

export interface TaskError {
  code: string;
  message: string;
}

export type Result<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: TaskError };
