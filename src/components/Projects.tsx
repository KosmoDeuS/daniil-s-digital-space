/**
 * EN: Projects section — currently a humorous placeholder indicating no projects yet.
 *     Uses the useReveal hook for scroll-triggered animation.
 * RU: Секция проектов — сейчас юмористическая заглушка, сообщающая что проектов пока нет.
 *     Использует хук useReveal для анимации при прокрутке.
 *
 * EN: Interacts with:
 *   - src/pages/Index.tsx — rendered inside the home page
 *   - src/hooks/useReveal.ts — scroll reveal animation
 * RU: Взаимодействует с:
 *   - src/pages/Index.tsx — отрисовывается внутри главной страницы
 *   - src/hooks/useReveal.ts — анимация появления при прокрутке
 */

import { useReveal } from "@/hooks/useReveal";
import { Coffee } from "lucide-react";

const Projects = () => {
  const ref = useReveal();

  return (
    <section id="projects" className="py-24 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-mono-display text-sm text-primary mb-2 tracking-wider uppercase">Projects</h2>
        <h3 className="text-3xl sm:text-4xl font-bold mb-10">Things I've built</h3>

        {/* EN: Placeholder card with joke / RU: Карточка-заглушка с шуткой */}
        <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center gap-4">
          <Coffee size={48} className="text-muted-foreground" />
          <p className="text-xl font-semibold text-foreground">Nothing here yet...</p>
          <p className="text-muted-foreground max-w-md">
            My projects are like my sleep schedule — they exist in theory. 
            Check back later, I might surprise us both.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Projects;
