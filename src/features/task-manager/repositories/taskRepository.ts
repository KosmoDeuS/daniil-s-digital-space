/**
 * EN: Repository Layer — handles all localStorage persistence for tasks.
 *     This is the ONLY place in the app that accesses localStorage directly.
 *     The Service layer calls these methods and catches any thrown errors.
 * RU: Слой репозитория — обрабатывает всё хранение задач в localStorage.
 *     Это ЕДИНСТВЕННОЕ место в приложении, которое обращается к localStorage напрямую.
 *     Слой сервиса вызывает эти методы и перехватывает любые выброшенные ошибки.
 *
 * EN: Interacts with:
 *   - services/taskService.ts — the service layer calls loadTasks() and saveTasks()
 *   - types/task.ts — uses the Task interface for type safety
 *   - Browser localStorage — storage key: "taskManagerTasks"
 * RU: Взаимодействует с:
 *   - services/taskService.ts — слой сервиса вызывает loadTasks() и saveTasks()
 *   - types/task.ts — использует интерфейс Task для типобезопасности
 *   - localStorage браузера — ключ хранения: "taskManagerTasks"
 */

import { Task } from "../types/task";

/** EN: localStorage key for task data / RU: Ключ localStorage для данных задач */
const STORAGE_KEY = "taskManagerTasks";

export class TaskRepository {
  /**
   * EN: Loads all tasks from localStorage. Returns [] if key doesn't exist.
   *     Throws on parse errors (caught by TaskService).
   * RU: Загружает все задачи из localStorage. Возвращает [] если ключ не существует.
   *     Выбрасывает ошибку при ошибках парсинга (перехватывается TaskService).
   */
  loadTasks(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    return JSON.parse(raw) as Task[];
  }

  /**
   * EN: Saves the full task array to localStorage, overwriting previous data.
   *     Throws on stringify/save errors (caught by TaskService).
   * RU: Сохраняет весь массив задач в localStorage, перезаписывая предыдущие данные.
   *     Выбрасывает ошибку при ошибках сериализации/сохранения (перехватывается TaskService).
   */
  saveTasks(tasks: Task[]): void {
    const serialized = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, serialized);
  }
}
