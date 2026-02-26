/**
 * EN: useIsMobile hook — detects if the viewport width is below 768px (mobile breakpoint).
 *     Listens to window resize via matchMedia and returns a boolean.
 * RU: Хук useIsMobile — определяет, является ли ширина окна менее 768px (мобильная точка перехода).
 *     Слушает изменение размера окна через matchMedia и возвращает boolean.
 *
 * EN: Used by: UI components that need responsive behavior (e.g. sidebar, shadcn components)
 * RU: Используется: UI-компонентами, которым нужно адаптивное поведение (например, sidebar, компоненты shadcn)
 */

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
