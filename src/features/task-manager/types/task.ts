/**
 * EN: Task Manager type definitions — defines the data model and result pattern.
 * RU: Типы менеджера задач — определяет модель данных и паттерн результата.
 *
 * EN: Used by:
 *   - services/taskService.ts — business logic operates on these types
 *   - repositories/taskRepository.ts — stores/loads Task[] from localStorage
 *   - components/TaskManager.tsx — renders tasks and handles Result responses
 * RU: Используется в:
 *   - services/taskService.ts — бизнес-логика работает с этими типами
 *   - repositories/taskRepository.ts — сохраняет/загружает Task[] из localStorage
 *   - components/TaskManager.tsx — отрисовывает задачи и обрабатывает ответы Result
 */

/**
 * EN: Task — a single task item with title, completion status, and timestamps.
 *     startDate and dueDate are stored as Unix timestamps (milliseconds).
 * RU: Task — одна задача с названием, статусом выполнения и временными метками.
 *     startDate и dueDate хранятся как Unix-метки времени (миллисекунды).
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  startDate: number; // timestamp — EN: auto-set at creation / RU: устанавливается автоматически при создании
  dueDate: number;   // timestamp — EN: entered by user / RU: вводится пользователем
}

/**
 * EN: TaskFilter — the three possible filter states for the task list.
 * RU: TaskFilter — три возможных состояния фильтра для списка задач.
 */
export type TaskFilter = "all" | "active" | "completed";

/**
 * EN: TaskError — error object returned by service methods on failure.
 * RU: TaskError — объект ошибки, возвращаемый методами сервиса при неудаче.
 */
export interface TaskError {
  code: string;
  message: string;
}

/**
 * EN: Result<T> — discriminated union for consistent success/error returns.
 *     success=true → data is present, error is null.
 *     success=false → data is null, error contains code + message.
 * RU: Result<T> — размеченное объединение для единообразных ответов успех/ошибка.
 *     success=true → data присутствует, error равен null.
 *     success=false → data равен null, error содержит code + message.
 */
export type Result<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: TaskError };
