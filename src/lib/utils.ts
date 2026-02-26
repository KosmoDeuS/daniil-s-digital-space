/**
 * EN: Utility function cn() — merges Tailwind CSS class names intelligently.
 *     Combines clsx (conditional classes) with tailwind-merge (resolves conflicting Tailwind classes).
 *     Example: cn("px-4", condition && "px-8") → "px-8" (tailwind-merge deduplicates).
 * RU: Утилита cn() — умно объединяет CSS-классы Tailwind.
 *     Комбинирует clsx (условные классы) с tailwind-merge (разрешает конфликтующие классы Tailwind).
 *     Пример: cn("px-4", condition && "px-8") → "px-8" (tailwind-merge убирает дубликаты).
 *
 * EN: Used by: almost all components — any place that conditionally applies Tailwind classes
 * RU: Используется: почти всеми компонентами — везде, где условно применяются классы Tailwind
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
