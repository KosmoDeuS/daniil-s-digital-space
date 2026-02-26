/**
 * EN: Date formatting utility — converts a Unix timestamp (ms) to a human-readable string.
 *     Format: "25 Feb 2026, 14:30" (en-GB locale). Used by the UI layer to display dates.
 * RU: Утилита форматирования дат — конвертирует Unix-метку времени (мс) в читаемую строку.
 *     Формат: "25 Feb 2026, 14:30" (локаль en-GB). Используется UI-слоем для отображения дат.
 *
 * EN: Used by: components/TaskManager.tsx — to display startDate and dueDate
 * RU: Используется в: components/TaskManager.tsx — для отображения startDate и dueDate
 */

export function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
