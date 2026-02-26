/**
 * EN: Skills section — displays a grid of skill cards with emojis.
 *     Uses the useReveal hook for scroll-triggered animation.
 * RU: Секция навыков — отображает сетку карточек навыков с эмодзи.
 *     Использует хук useReveal для анимации при прокрутке.
 *
 * EN: Interacts with:
 *   - src/pages/Index.tsx — rendered inside the home page
 *   - src/hooks/useReveal.ts — scroll reveal animation
 *   - src/index.css — uses .glow-accent utility on hover
 * RU: Взаимодействует с:
 *   - src/pages/Index.tsx — отрисовывается внутри главной страницы
 *   - src/hooks/useReveal.ts — анимация появления при прокрутке
 *   - src/index.css — использует утилиту .glow-accent при наведении
 */

import { useReveal } from "@/hooks/useReveal";

/** EN: Skill items — label + emoji / RU: Навыки — название + эмодзи */
const skills = [
  { label: "Stress-Resistant", emoji: "🧘" },
  { label: "Crisis Manager", emoji: "🔥" },
  { label: "Daydreamer", emoji: "💭" },
  { label: "AI Enthusiast", emoji: "🤖" },
  { label: "Barely Know 3 Languages", emoji: "🗣️" },
];

const Skills = () => {
  const ref = useReveal();

  return (
    <section id="skills" className="py-24 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <h2 className="font-mono-display text-sm text-primary mb-2 tracking-wider uppercase">Skills</h2>
        <h3 className="text-3xl sm:text-4xl font-bold mb-10">What I bring to the table</h3>

        {/* EN: Skills grid — responsive 2/3 columns / RU: Сетка навыков — адаптивная 2/3 колонки */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.label}
              className="group p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:glow-accent transition-all duration-300 text-center"
            >
              <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">
                {skill.emoji}
              </span>
              <span className="text-sm font-medium text-foreground">{skill.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
