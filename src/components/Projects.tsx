import { useReveal } from "@/hooks/useReveal";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "AI Chat Bot",
    description: "An experimental chatbot powered by curiosity and duct tape.",
    tags: ["Python", "AI", "NLP"],
    color: "from-amber-500/20 to-orange-600/10",
  },
  {
    title: "Portfolio Website",
    description: "This very site you're looking at. Meta, right?",
    tags: ["React", "TypeScript", "Tailwind"],
    color: "from-blue-500/20 to-cyan-600/10",
  },
  {
    title: "Task Tracker",
    description: "A to-do app that judges you silently for not finishing tasks.",
    tags: ["JavaScript", "CSS", "HTML"],
    color: "from-emerald-500/20 to-green-600/10",
  },
  {
    title: "Mystery Project",
    description: "Top secret. Even I don't know what it does yet.",
    tags: ["???", "Coming Soon"],
    color: "from-purple-500/20 to-pink-600/10",
  },
];

const Projects = () => {
  const ref = useReveal();

  return (
    <section id="projects" className="py-24 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <h2 className="font-mono-display text-sm text-primary mb-2 tracking-wider uppercase">Projects</h2>
        <h3 className="text-3xl sm:text-4xl font-bold mb-10">Things I've built</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/40 transition-all duration-300"
            >
              {/* Placeholder visual */}
              <div className={`h-36 bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                <span className="font-mono-display text-2xl font-bold text-foreground/30 group-hover:text-foreground/50 transition-colors">
                  {"</>"}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{project.title}</h4>
                  <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
