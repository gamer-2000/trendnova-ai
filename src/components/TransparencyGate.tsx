import { useState, useEffect, useRef } from "react";
import { Check, X, ShieldCheck, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACK_KEY = "trendnova_transparency_ack_v1";

const honest = [
  "We're a small indie project — built and maintained by one creator, not a big company.",
  "TrendNova is currently hosted on Vercel (trendova-ai.vercel.app). A custom domain is on the roadmap.",
  "The Free plan is genuinely free. No credit card. No hidden trial that turns into a charge.",
  "Paid upgrades are handled manually over email — you pay only after we confirm. No auto-billing.",
  "Your generated content belongs to you. We don't resell it or train models on it.",
  "We use Google AdSense to keep the free plan running. You can upgrade to remove ads.",
  "All pages are served over HTTPS. Auth is handled by Supabase (industry-standard).",
];

const neverDo = [
  "Ask for your credit/debit card on the free plan.",
  "Ask for your password outside the login page.",
  "Email you from any address other than trendnova0001@gmail.com.",
  "Sell, share, or leak your personal data to third parties.",
  "Auto-charge you or sign you up for hidden subscriptions.",
];

const TransparencyGate = () => {
  const [open, setOpen] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ack = localStorage.getItem(ACK_KEY);
    if (!ack) setOpen(true);
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 12) {
      setScrolledToEnd(true);
    }
  };

  const accept = () => {
    localStorage.setItem(ACK_KEY, new Date().toISOString());
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="glass-card border border-primary/30 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-border/30 flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">
              Before you use TrendNova — please read
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              We want you to know exactly who we are and how we operate. This shows once.
            </p>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-100/90">
              A lot of new sites turn out to be scams. We get the suspicion. Read this fully so you
              can decide for yourself — scroll to the bottom to continue.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" /> What's true about us
            </h3>
            <ul className="space-y-2">
              {honest.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <X className="h-4 w-4 text-red-400" /> What we will never do
            </h3>
            <ul className="space-y-2">
              {neverDo.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-lg glass-card border border-border/30">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Real human contact</span>
            </div>
            <a
              href="mailto:trendnova0001@gmail.com"
              className="text-sm text-primary break-all"
            >
              trendnova0001@gmail.com
            </a>
            <p className="text-xs text-muted-foreground mt-2">
              Got doubts? Email us first. We'd rather answer 100 questions than have you feel
              scammed.
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-2">
            ↓ Scroll to the bottom to enable the button ↓
          </p>
        </div>

        <div className="p-5 border-t border-border/30 flex flex-col sm:flex-row items-center gap-3 justify-between">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            By continuing you confirm you've read this notice and our{" "}
            <a href="/privacy" className="text-primary underline">Privacy Policy</a>.
          </p>
          <Button
            onClick={accept}
            disabled={!scrolledToEnd}
            className="w-full sm:w-auto shrink-0"
          >
            {scrolledToEnd ? "I've read this — continue" : "Scroll to continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransparencyGate;
