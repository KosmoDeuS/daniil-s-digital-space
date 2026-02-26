/**
 * EN: Service Layer — contains ALL business logic for the Task Manager.
 *     Validates input, creates/toggles/deletes tasks, filters by status.
 *     Wraps all repository calls in try/catch to return REPOSITORY_*_ERROR codes.
 *     Never accesses localStorage or DOM directly.
 * RU: Слой сервиса — содержит ВСЮ бизнес-логику менеджера задач.
 *     Валидирует ввод, создаёт/переключает/удаляет задачи, фильтрует по статусу.
 *     Оборачивает все вызовы репозитория в try/catch для возврата кодов REPOSITORY_*_ERROR.
 *     Никогда не обращается к localStorage или DOM напрямую.
 *
 * EN: Interacts with:
 *   - repositories/taskRepository.ts — calls loadTasks()/saveTasks() for persistence
 *   - types/task.ts — uses Task, TaskFilter, Result types
 *   - components/TaskManager.tsx — UI layer calls these service methods
 * RU: Взаимодействует с:
 *   - repositories/taskRepository.ts — вызывает loadTasks()/saveTasks() для хранения
 *   - types/task.ts — использует типы Task, TaskFilter, Result
 *   - components/TaskManager.tsx — UI-слой вызывает методы этого сервиса
 */

import { Task, TaskFilter, Result } from "../types/task";
import { TaskRepository } from "../repositories/taskRepository";

/**
 * EN: Generates a unique ID — timestamp + random 6-char suffix (e.g. "1739985000000-ab12cd").
 * RU: Генерирует уникальный ID — метка времени + случайный суффикс из 6 символов (напр. "1739985000000-ab12cd").
 */
function generateId(): string {
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${Date.now()}-${suffix}`;
}

/** EN: Helper — creates a success Result / RU: Помощник — создаёт успешный Result */
function ok<T>(data: T): Result<T> {
  return { success: true, data, error: null };
}

/** EN: Helper — creates an error Result / RU: Помощник — создаёт Result с ошибкой */
function err<T>(code: string, message: string): Result<T> {
  return { success: false, data: null, error: { code, message } };
}

export class TaskService {
  private repo: TaskRepository;

  constructor(repo: TaskRepository) {
    this.repo = repo;
  }

  /**
   * EN: Returns all tasks (no filtering). Returns [] on repository error.
   * RU: Возвращает все задачи (без фильтрации). Возвращает [] при ошибке репозитория.
   */
  getAllTasks(): Task[] {
    try {
      return this.repo.loadTasks();
    } catch {
      return [];
    }
  }

  /**
   * EN: Returns filtered tasks. Validates filter value; returns UNKNOWN_FILTER for invalid filters.
   * RU: Возвращает отфильтрованные задачи. Валидирует значение фильтра; возвращает UNKNOWN_FILTER для невалидных.
   */
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

  /**
   * EN: Creates a new task. Validates title (non-empty) and dueDate (valid, >= now).
   *     New task is added to the BEGINNING of the array (unshift).
   *     dueDate string from datetime-local input is converted to timestamp.
   * RU: Создаёт новую задачу. Валидирует title (не пустой) и dueDate (валидный, >= сейчас).
   *     Новая задача добавляется в НАЧАЛО массива (unshift).
   *     Строка dueDate из input datetime-local конвертируется в timestamp.
   */
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

    // EN: Add to the beginning / RU: Добавляем в начало
    tasks.unshift(newTask);

    try {
      this.repo.saveTasks(tasks);
    } catch {
      return err("REPOSITORY_SAVE_ERROR", "Failed to save task.");
    }

    return ok(newTask);
  }

  /**
   * EN: Toggles the completed status of a task by ID. Returns the updated task.
   * RU: Переключает статус выполнения задачи по ID. Возвращает обновлённую задачу.
   */
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

  /**
   * EN: Deletes a task by ID. Returns the deleted task's ID and the remaining tasks array.
   * RU: Удаляет задачу по ID. Возвращает ID удалённой задачи и оставшийся массив задач.
   */
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
