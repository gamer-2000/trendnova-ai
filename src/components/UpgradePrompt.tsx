import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "trendnova_upgrade_prompt_dismissed_at";
// Show again 6 hours after dismissal
const SNOOZE_MS = 6 * 60 * 60 * 1000;
// Initial delay after page load before first showing
const INITIAL_DELAY_MS = 45 * 1000;

const UpgradePrompt = () => {
  const { profile, loading } = useAuth();
  const [visible, setVisible] = useState(false);

  const isPremium = profile?.plan === "premium";

  useEffect(() => {
    if (loading || isPremium) return;

    const dismissedAt = Number(localStorage.getItem(STORAGE_KEY) || 0);
    const now = Date.now();
    if (dismissedAt && now - dismissedAt < SNOOZE_MS) return;

    const timer = setTimeout(() => setVisible(true), INITIAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [loading, isPremium]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  };

  if (isPremium || !visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] max-w-xs animate-in slide-in-from-right-4 fade-in duration-500">
      <div className="relative glass-card border border-primary/30 rounded-2xl p-4 shadow-2xl bg-card/95 backdrop-blur-xl">
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <h3 className="font-display font-bold text-sm text-foreground">
            Tired of ads?
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          Upgrade to <span className="text-foreground font-semibold">Premium</span> for an
          ad-free experience plus unlimited writing.
        </p>
        <Link
          to="/dashboard/billing"
          onClick={dismiss}
          className="block text-center w-full py-2 px-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          Upgrade to Premium
        </Link>
      </div>
    </div>
  );
};

export default UpgradePrompt;
