import { useEffect, useState } from "react";

type ScrollDirection = "up" | "down";

export function useScrollDirection(threshold = 8): ScrollDirection {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("up");

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      if (Math.abs(delta) >= threshold) {
        setScrollDirection(delta > 0 && currentY > 80 ? "down" : "up");
        lastY = Math.max(currentY, 0);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrollDirection;
}
