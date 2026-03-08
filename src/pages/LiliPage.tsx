/**
 * EN: Romantic "/lili" page — minimal black background with animated heart text composition.
 * RU: Романтическая страница "/lili" — минималистичный чёрный фон с анимированным текстовым сердцем.
 */

import HeartTextFlow from "@/components/HeartTextFlow";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const LiliPage = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden animate-fade-in">
    {/* Back link */}
    <Link
      to="/"
      className="absolute top-5 left-5 text-pink-400/60 hover:text-pink-300 transition-colors z-10 flex items-center gap-1 text-sm"
    >
      <ArrowLeft size={16} />
      Back
    </Link>

    {/* Heart composition */}
    <div className="w-[90vmin] h-[90vmin] max-w-[600px] max-h-[600px] flex items-center justify-center">
      <HeartTextFlow />
    </div>
  </div>
);

export default LiliPage;
