/**
 * EN: Task Manager page — wraps the TaskManager component with the shared Header and Footer.
 *     Applies the same marble-bg styling as the home page for visual consistency.
 * RU: Страница менеджера задач — оборачивает компонент TaskManager общими Header и Footer.
 *     Использует тот же фон marble-bg, что и главная страница, для визуальной целостности.
 *
 * EN: Interacts with:
 *   - src/components/Header.tsx — navigation bar
 *   - src/components/Footer.tsx — footer
 *   - src/features/task-manager/components/TaskManager.tsx — main task manager UI
 * RU: Взаимодействует с:
 *   - src/components/Header.tsx — панель навигации
 *   - src/components/Footer.tsx — подвал
 *   - src/features/task-manager/components/TaskManager.tsx — основной UI менеджера задач
 */

import TaskManager from "@/features/task-manager/components/TaskManager";

const TaskManagerPage = () => <TaskManager />;

export default TaskManagerPage;
