import { ArrowDown, Mail } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-3xl text-center">
        <p className="font-mono-display text-sm text-primary mb-4 tracking-wider uppercase">
          HND Computing Science · Aberdeen, Scotland
        </p>
        <h1 className="text-5xl sm:text-7xl font-bold leading-tight mb-6">
          Daniil{" "}
          <span className="text-gradient">Rusnak</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          Just a cool dude. Currently studying Computing Science, experimenting with AI, 
          and building things that sometimes work.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            View Projects
            <ArrowDown size={16} />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
          >
            Contact Me
            <Mail size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
