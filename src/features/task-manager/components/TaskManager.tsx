/**
 * EN: UI Layer — Task Manager component. This is the ONLY layer that handles rendering and user events.
 *     It does NOT contain business logic or access localStorage directly.
 *     All operations go through TaskService, which returns Result objects.
 * RU: UI-слой — компонент менеджера задач. Это ЕДИНСТВЕННЫЙ слой, который занимается отрисовкой и событиями.
 *     НЕ содержит бизнес-логики и НЕ обращается к localStorage напрямую.
 *     Все операции проходят через TaskService, который возвращает объекты Result.
 *
 * EN: Architecture flow: UI (this file) → Service (taskService.ts) → Repository (taskRepository.ts) → localStorage
 * RU: Поток архитектуры: UI (этот файл) → Service (taskService.ts) → Repository (taskRepository.ts) → localStorage
 *
 * EN: Interacts with:
 *   - services/taskService.ts — all CRUD and filter operations
 *   - types/task.ts — Task, TaskFilter types
 *   - utils/formatDate.ts — formatTimestamp() for displaying dates
 *   - src/lib/utils.ts — cn() for conditional class names
 * RU: Взаимодействует с:
 *   - services/taskService.ts — все CRUD и операции фильтрации
 *   - types/task.ts — типы Task, TaskFilter
 *   - utils/formatDate.ts — formatTimestamp() для отображения дат
 *   - src/lib/utils.ts — cn() для условных CSS-классов
 */

import { useState, useEffect, useMemo, FormEvent } from "react";
import { Check, Trash2, Plus } from "lucide-react";
import { Task, TaskFilter } from "../types/task";
import { TaskService } from "../services/taskService";
import { TaskRepository } from "../repositories/taskRepository";
import { formatTimestamp } from "../utils/formatDate";
import { cn } from "@/lib/utils";

/**
 * EN: Create service instance with injected repository (Dependency Injection pattern).
 * RU: Создаём экземпляр сервиса с внедрённым репозиторием (паттерн Dependency Injection).
 */
const service = new TaskService(new TaskRepository());

/** EN: Filter button configs / RU: Конфигурация кнопок фильтров */
const FILTERS: { label: string; value: TaskFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  /**
   * EN: Load tasks when component mounts or filter changes.
   * RU: Загружаем задачи при монтировании компонента или смене фильтра.
   */
  useEffect(() => {
    refreshTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  /**
   * EN: Fetches filtered tasks from the service and updates state.
   * RU: Получает отфильтрованные задачи из сервиса и обновляет состояние.
   */
  const refreshTasks = () => {
    const result = service.getFilteredTasks(filter);
    if (result.success) {
      setTasks(result.data);
      setError(null);
    } else {
      setError(result.error.message);
    }
  };

  /**
   * EN: Form submit handler — calls service.addTask(), clears title on success (keeps dueDate).
   * RU: Обработчик отправки формы — вызывает service.addTask(), очищает title при успехе (dueDate сохраняется).
   */
  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const result = service.addTask({ title, dueDate });
    if (result.success) {
      setTitle(""); // EN: Clear title only / RU: Очищаем только title
      setError(null);
      refreshTasks();
    } else {
      setError(result.error.message);
    }
  };

  /**
   * EN: Toggles task completion status via service.
   * RU: Переключает статус выполнения задачи через сервис.
   */
  const handleToggle = (id: string) => {
    const result = service.toggleTask(id);
    if (result.success) {
      refreshTasks();
    } else {
      setError(result.error.message);
    }
  };

  /**
   * EN: Deletes a task via service.
   * RU: Удаляет задачу через сервис.
   */
  const handleDelete = (id: string) => {
    const result = service.deleteTask(id);
    if (result.success) {
      refreshTasks();
    } else {
      setError(result.error.message);
    }
  };

  /**
   * EN: Memoized task counts for filter badges (recalculated when tasks change).
   * RU: Мемоизированные счётчики задач для значков фильтров (пересчитываются при изменении задач).
   */
  const taskCount = useMemo(() => {
    const all = service.getAllTasks();
    return {
      all: all.length,
      active: all.filter((t) => !t.completed).length,
      completed: all.filter((t) => t.completed).length,
    };
  }, [tasks]);

  return (
    <div className="min-h-screen marble-bg text-foreground pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* EN: Page header / RU: Заголовок страницы */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-mono-display font-bold text-gradient mb-2">
            Task Manager Service
          </h1>
          <p className="text-muted-foreground text-sm">
            Layered Architecture — UI · Service · Repository
          </p>
        </div>

        {/* EN: Add task form / RU: Форма добавления задачи */}
        <form
          onSubmit={handleAdd}
          className="bg-card border border-border rounded-lg p-4 mb-6 flex flex-col gap-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* EN: Task title input / RU: Поле ввода названия задачи */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title…"
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Task title"
            />
            {/* EN: Due date picker (datetime-local) / RU: Выбор дедлайна (datetime-local) */}
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [color-scheme:dark]"
              aria-label="Due date"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 h-10 rounded-md bg-primary text-primary-foreground px-4 text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus size={16} /> Add Task
          </button>
        </form>

        {/* EN: Error message display / RU: Отображение сообщения об ошибке */}
        {error && (
          <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {/* EN: Filter buttons with task counts / RU: Кнопки фильтров со счётчиками задач */}
        <div className="flex gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {f.label}
              <span className="ml-1.5 opacity-70">
                ({taskCount[f.value]})
              </span>
            </button>
          ))}
        </div>

        {/* EN: Task list or empty state / RU: Список задач или пустое состояние */}
        {tasks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No tasks yet — add one above ☝️
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={cn(
                  "bg-card border border-border rounded-lg p-4 transition-all",
                  task.completed && "opacity-60"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* EN: Toggle complete checkbox / RU: Чекбокс переключения статуса */}
                  <button
                    onClick={() => handleToggle(task.id)}
                    className={cn(
                      "mt-0.5 flex-shrink-0 h-5 w-5 rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex items-center justify-center",
                      task.completed
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground hover:border-primary"
                    )}
                    aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    {task.completed && <Check size={12} />}
                  </button>

                  {/* EN: Task content — title + dates / RU: Содержимое задачи — название + даты */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium leading-snug",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.title}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                      <span>Created: {formatTimestamp(task.startDate)}</span>
                      <span>Due: {formatTimestamp(task.dueDate)}</span>
                    </div>
                  </div>

                  {/* EN: Delete button / RU: Кнопка удаления */}
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-1"
                    aria-label="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
