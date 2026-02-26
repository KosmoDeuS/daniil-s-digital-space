/**
 * EN: useReveal hook — provides a scroll-triggered fade-in + slide-up animation.
 *     Attaches an IntersectionObserver to the referenced element. When the element
 *     becomes 15% visible, it transitions from opacity:0/translateY(30px) to visible.
 *     Observer disconnects after first reveal (one-time animation).
 * RU: Хук useReveal — реализует анимацию плавного появления + сдвига вверх при прокрутке.
 *     Присоединяет IntersectionObserver к элементу по ref. Когда элемент становится
 *     видимым на 15%, он переходит из opacity:0/translateY(30px) в видимое состояние.
 *     Observer отключается после первого появления (одноразовая анимация).
 *
 * EN: Used by: About.tsx, Skills.tsx, Projects.tsx, Contact.tsx — any section that needs scroll reveal
 * RU: Используется в: About.tsx, Skills.tsx, Projects.tsx, Contact.tsx — в любой секции с анимацией появления
 */

import { useEffect, useRef } from "react";

export function useReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // EN: Start hidden and shifted down / RU: Начинаем скрытым и сдвинутым вниз
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // EN: Reveal the element / RU: Показываем элемент
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
