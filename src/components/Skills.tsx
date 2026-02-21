import { useReveal } from "@/hooks/useReveal";

const skills = [
  { label: "Стрессоустойчивый", emoji: "🧘" },
  { label: "Кризис менеджер", emoji: "🔥" },
  { label: "Фантазёр", emoji: "💭" },
  { label: "Любитель ИИ", emoji: "🤖" },
  { label: "Плохо знаю 3 языка", emoji: "🗣️" },
];

const Skills = () => {
  const ref = useReveal();

  return (
    <section id="skills" className="py-24 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <h2 className="font-mono-display text-sm text-primary mb-2 tracking-wider uppercase">Skills</h2>
        <h3 className="text-3xl sm:text-4xl font-bold mb-10">What I bring to the table</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.label}
              className="group p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:glow-amber transition-all duration-300 text-center"
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
