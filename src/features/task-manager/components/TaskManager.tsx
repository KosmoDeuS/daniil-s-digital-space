import { useState, useEffect, useMemo, FormEvent } from "react";
import { Check, Trash2, Plus } from "lucide-react";
import { Task, TaskFilter } from "../types/task";
import { TaskService } from "../services/taskService";
import { TaskRepository } from "../repositories/taskRepository";
import { formatTimestamp } from "../utils/formatDate";
import { cn } from "@/lib/utils";

const service = new TaskService(new TaskRepository());
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

  // Load tasks on mount & filter change
  useEffect(() => {
    refreshTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const refreshTasks = () => {
    const result = service.getFilteredTasks(filter);
    if (result.success) {
      setTasks(result.data);
      setError(null);
    } else {
      setError(result.error.message);
    }
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const result = service.addTask({ title, dueDate });
    if (result.success) {
      setTitle(""); // clear title, keep dueDate
      setError(null);
      refreshTasks();
    } else {
      setError(result.error.message);
    }
  };

  const handleToggle = (id: string) => {
    const result = service.toggleTask(id);
    if (result.success) {
      refreshTasks();
    } else {
      setError(result.error.message);
    }
  };

  const handleDelete = (id: string) => {
    const result = service.deleteTask(id);
    if (result.success) {
      refreshTasks();
    } else {
      setError(result.error.message);
    }
  };

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
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-mono-display font-bold text-gradient mb-2">
            Task Manager Service
          </h1>
          <p className="text-muted-foreground text-sm">
            Layered Architecture — UI · Service · Repository
          </p>
        </div>

        {/* Add Task Form */}
        <form
          onSubmit={handleAdd}
          className="bg-card border border-border rounded-lg p-4 mb-6 flex flex-col gap-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title…"
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Task title"
            />
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

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {/* Filters */}
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

        {/* Task List */}
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
                  {/* Toggle */}
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

                  {/* Content */}
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

                  {/* Delete */}
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
