import { useState } from "react";
import { X, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ANNOUNCEMENTS = [
  "🚀 New: Faster AI generation with upgraded models!",
  "✨ Particle effects & performance optimizations added",
  "🔒 Improved authentication system with Google Sign-In",
];

const AnnouncementBar = () => {
  const [dismissed, setDismissed] = useState(false);
  const [current, setCurrent] = useState(0);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed top-16 left-0 right-0 z-40 bg-primary/10 border-b border-primary/20 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Megaphone className="h-3.5 w-3.5 text-primary shrink-0" />
            <button
              onClick={() => setCurrent((c) => (c + 1) % ANNOUNCEMENTS.length)}
              className="text-xs text-foreground/90 truncate hover:text-primary transition-colors"
            >
              {ANNOUNCEMENTS[current]}
            </button>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="ml-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBar;
