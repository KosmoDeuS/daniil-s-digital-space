import { Task } from "../types/task";

const STORAGE_KEY = "taskManagerTasks";

export class TaskRepository {
  loadTasks(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    return JSON.parse(raw) as Task[];
  }

  saveTasks(tasks: Task[]): void {
    const serialized = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, serialized);
  }
}
