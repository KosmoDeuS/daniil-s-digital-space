import { Task, TaskFilter, Result } from "../types/task";
import { TaskRepository } from "../repositories/taskRepository";

function generateId(): string {
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${Date.now()}-${suffix}`;
}

function ok<T>(data: T): Result<T> {
  return { success: true, data, error: null };
}

function err<T>(code: string, message: string): Result<T> {
  return { success: false, data: null, error: { code, message } };
}

export class TaskService {
  private repo: TaskRepository;

  constructor(repo: TaskRepository) {
    this.repo = repo;
  }

  getAllTasks(): Task[] {
    try {
      return this.repo.loadTasks();
    } catch {
      return [];
    }
  }

  getFilteredTasks(filter: TaskFilter | string): Result<Task[]> {
    if (filter !== "all" && filter !== "active" && filter !== "completed") {
      return err("UNKNOWN_FILTER", `Unknown filter: "${filter}"`);
    }

    let tasks: Task[];
    try {
      tasks = this.repo.loadTasks();
    } catch {
      return err("REPOSITORY_READ_ERROR", "Failed to read tasks from storage.");
    }

    switch (filter) {
      case "active":
        return ok(tasks.filter((t) => !t.completed));
      case "completed":
        return ok(tasks.filter((t) => t.completed));
      default:
        return ok(tasks);
    }
  }

  addTask(input: { title: string; dueDate: string }): Result<Task> {
    const trimmedTitle = input.title.trim();
    if (!trimmedTitle) {
      return err("INVALID_TITLE", "Task title cannot be empty.");
    }

    const dueDateTimestamp = new Date(input.dueDate).getTime();
    if (!input.dueDate || isNaN(dueDateTimestamp)) {
      return err("INVALID_DUE_DATE", "Please provide a valid due date.");
    }

    const startDate = Date.now();
    if (dueDateTimestamp < startDate) {
      return err("DUE_DATE_BEFORE_START_DATE", "Due date must be in the future.");
    }

    const newTask: Task = {
      id: generateId(),
      title: trimmedTitle,
      completed: false,
      startDate,
      dueDate: dueDateTimestamp,
    };

    let tasks: Task[];
    try {
      tasks = this.repo.loadTasks();
    } catch {
      return err("REPOSITORY_READ_ERROR", "Failed to read tasks from storage.");
    }

    tasks.unshift(newTask);

    try {
      this.repo.saveTasks(tasks);
    } catch {
      return err("REPOSITORY_SAVE_ERROR", "Failed to save task.");
    }

    return ok(newTask);
  }

  toggleTask(id: string): Result<Task> {
    if (!id || typeof id !== "string") {
      return err("INVALID_ID", "Invalid task ID.");
    }

    let tasks: Task[];
    try {
      tasks = this.repo.loadTasks();
    } catch {
      return err("REPOSITORY_READ_ERROR", "Failed to read tasks from storage.");
    }

    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return err("TASK_NOT_FOUND", `Task with id "${id}" not found.`);
    }

    tasks[index] = { ...tasks[index], completed: !tasks[index].completed };

    try {
      this.repo.saveTasks(tasks);
    } catch {
      return err("REPOSITORY_SAVE_ERROR", "Failed to save tasks.");
    }

    return ok(tasks[index]);
  }

  deleteTask(id: string): Result<{ deletedTaskId: string; tasks: Task[] }> {
    if (!id || typeof id !== "string") {
      return err("INVALID_ID", "Invalid task ID.");
    }

    let tasks: Task[];
    try {
      tasks = this.repo.loadTasks();
    } catch {
      return err("REPOSITORY_READ_ERROR", "Failed to read tasks from storage.");
    }

    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return err("TASK_NOT_FOUND", `Task with id "${id}" not found.`);
    }

    tasks.splice(index, 1);

    try {
      this.repo.saveTasks(tasks);
    } catch {
      return err("REPOSITORY_SAVE_ERROR", "Failed to save tasks.");
    }

    return ok({ deletedTaskId: id, tasks });
  }
}
