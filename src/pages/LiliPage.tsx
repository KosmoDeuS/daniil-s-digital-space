/**
 * Romantic "/lili" page — black background, animated heart, particles, styled header/footer.
 */

import HeartTextFlow from "@/components/HeartTextFlow";
import PinkParticles from "@/components/PinkParticles";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { useEffect, useState } from "react";

const LiliPage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, hsl(0 0% 2%), hsl(350 65% 15%), hsl(345 60% 20%))' }}>
      <PinkParticles />

      {/* Header */}
      <header
        className={`relative z-10 flex items-center justify-between px-6 py-4 transition-all duration-1000 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
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
        <div className="w-16" /> {/* balance spacer */}
      </header>

      {/* Heart */}
      <main
        className={`flex-1 flex items-center justify-center relative z-10 transition-all duration-[1.5s] ease-out ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div className="w-[98vmin] h-[98vmin] max-w-[900px] max-h-[900px] flex items-center justify-center">
          <HeartTextFlow />
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`relative z-10 text-center py-4 transition-all duration-1000 delay-500 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-pink-400/30 text-xs tracking-[0.25em] uppercase font-light">
          Made with love
        </p>
      </footer>
    </div>
  );
};

export default LiliPage;
