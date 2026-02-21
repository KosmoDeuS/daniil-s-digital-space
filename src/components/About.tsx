import { useReveal } from "@/hooks/useReveal";
import { MapPin, GraduationCap, Sparkles } from "lucide-react";

const facts = [
  { icon: MapPin, text: "Based in Aberdeen, Scotland" },
  { icon: GraduationCap, text: "HND Computing Science student" },
  { icon: Sparkles, text: "AI enthusiast & creative thinker" },
];

const About = () => {
  const ref = useReveal();

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <h2 className="font-mono-display text-sm text-primary mb-2 tracking-wider uppercase">About</h2>
        <h3 className="text-3xl sm:text-4xl font-bold mb-6">A bit about me</h3>
        <p className="text-muted-foreground text-lg leading-relaxed mb-10">
          I'm Daniil — a computing science student who loves experimenting with tech, breaking things 
          (and occasionally fixing them), and dreaming up ambitious projects. When I'm not coding, 
          I'm probably overthinking something creative or surviving another Scottish winter.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {facts.map((fact) => (
            <div
              key={fact.text}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
            >
              <fact.icon size={20} className="text-primary shrink-0" />
              <span className="text-sm text-foreground">{fact.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
