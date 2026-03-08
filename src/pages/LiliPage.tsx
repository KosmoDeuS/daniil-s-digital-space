/**
 * Romantic "/lili" page — black background, animated heart, particles, styled header/footer.
 */

import HeartTextFlow from "@/components/HeartTextFlow";
import PinkParticles from "@/components/PinkParticles";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

const LiliPage = () => {
  const [mounted, setMounted] = useState(false);
  const header = useScrollReveal();
  const footer = useScrollReveal();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <PinkParticles />

      {/* Header */}
      <div ref={header.ref}>
        <header
          className={`relative z-10 flex items-center justify-between px-6 py-4 transition-all duration-[1.5s] ease-out ${
            header.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
          }`}
        >
          <Link
            to="/"
            className="text-pink-400/70 hover:text-pink-300 transition-colors flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft size={16} />
            <span className="font-light tracking-wide">Back</span>
          </Link>
          <div className="flex items-center gap-2 text-pink-400/50">
            <Heart size={14} className="animate-pulse" fill="currentColor" />
            <span className="text-xs tracking-[0.3em] uppercase font-light">
              For You
            </span>
            <Heart size={14} className="animate-pulse" fill="currentColor" />
          </div>
          <div className="w-16" />
        </header>
      </div>

      {/* Heart */}
      <main
        className={`flex-1 flex items-center justify-center relative z-10 transition-all duration-[1.5s] ease-out ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div className="w-[98vmin] h-[98vmin] max-w-[900px] max-h-[900px] flex items-center justify-center">
          <HeartTextFlow />
        </div>
      </main>

      {/* Footer */}
      <div ref={footer.ref}>
        <footer
          className={`relative z-10 py-8 px-6 transition-all duration-[1.5s] ease-out ${
            footer.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-pink-500/30" />
              <Heart size={12} className="text-pink-500/40" fill="currentColor" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-pink-500/30" />
            </div>

            <p className="text-pink-300/50 text-sm italic font-light leading-relaxed">
              «Ты — моё всё»
            </p>

            <div className="flex items-center justify-center gap-1.5">
              {[10, 8, 6, 8, 10].map((size, i) => (
                <Heart
                  key={i}
                  size={size}
                  className="text-pink-500/25"
                  fill="currentColor"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            <p className="text-pink-400/20 text-[10px] tracking-[0.3em] uppercase font-light">
              Made with love · Forever yours
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LiliPage;
