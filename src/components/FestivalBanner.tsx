import { getActiveFestival } from "@/lib/festivals";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

const FestivalBanner = () => {
  const festival = getActiveFestival();
  const [dismissed, setDismissed] = useState(false);

  if (!festival || dismissed) return null;

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      className={`fixed top-16 left-0 right-0 z-40 bg-gradient-to-r ${festival.accentColor} text-white text-center py-2 px-4 text-sm font-medium shadow-lg`}
    >
      <span className="mr-1">{festival.emoji}</span>
      {festival.greeting} — Enjoy creating with TrendNova!
      <span className="ml-1">{festival.emoji}</span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

export default FestivalBanner;
