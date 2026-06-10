import { useState, useCallback } from "react";
import { X, Clapperboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ANNOUNCEMENTS = [
  "🎬 New: AI Video Generation is live — create stunning video content!",
  "🚀 New: Faster AI generation with upgraded models!",
  "✨ Particle effects & performance optimizations added",
  "🔒 Improved authentication system with Google Sign-In",
];

const AnnouncementBar = () => {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = useCallback(() => setDismissed(true), []);

  if (dismissed) return null;

  const marqueeContent = ANNOUNCEMENTS.map((text, i) => (
    <span key={i} className="flex items-center gap-2 shrink-0 mx-8">
      {i === 0 && <Clapperboard className="h-3.5 w-3.5 text-accent shrink-0" />}
      <span className="text-xs text-foreground/90 whitespace-nowrap">{text}</span>
      <span className="text-primary/40 mx-4">•</span>
    </span>
  ));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed top-16 left-0 right-0 z-40 bg-primary/5 border-b border-primary/10 backdrop-blur-md overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center relative">
          <div className="flex-1 overflow-hidden relative">
            <div className="flex animate-[marquee-scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
              {marqueeContent}
              {marqueeContent}
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-3 text-muted-foreground hover:text-foreground transition-colors shrink-0 z-10"
            aria-label="Dismiss announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBar;
