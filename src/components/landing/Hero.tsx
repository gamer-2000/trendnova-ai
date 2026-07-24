import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Sparkles, CreditCard, Zap, MessagesSquare, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

const rotating = ["YouTube", "TikTok", "Instagram", "Blogs", "X", "LinkedIn"];

const typedLines = [
  { label: "YouTube Script", body: "Hook: What if I told you 90% of creators are doing this wrong?" },
  { label: "Blog Intro", body: "The way we create content is being rewritten — one prompt at a time." },
  { label: "Instagram Caption", body: "Stop scrolling. Start shipping. Your ideas deserve an audience ✨" },
  { label: "Thumbnail Prompt", body: "Bold cinematic shot, cyan neon rim light, close-up expression, 8K detail." },
];

const useTyping = () => {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  useEffect(() => {
    const line = typedLines[i].body;
    let n = 0;
    setText("");
    const int = setInterval(() => {
      n++;
      setText(line.slice(0, n));
      if (n >= line.length) {
        clearInterval(int);
        setTimeout(() => setI((v) => (v + 1) % typedLines.length), 1600);
      }
    }, 22);
    return () => clearInterval(int);
  }, [i]);
  return { text, label: typedLines[i].label, index: i };
};

const Hero = () => {
  const [word, setWord] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWord((v) => (v + 1) % rotating.length), 2200);
    return () => clearInterval(t);
  }, []);
  const { text, label } = useTyping();

  return (
    <section className="relative pt-36 pb-24 sm:pt-40 sm:pb-32 px-4 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[600px] pointer-events-none" style={{ background: "var(--gradient-hero)" }} />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur-md px-3 py-1.5 text-xs text-muted-foreground mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            New — AI Video Generation is live
            <ArrowRight className="h-3 w-3" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-foreground"
          >
            Create Viral{" "}
            <span className="gradient-text-primary">Content</span>
            <br />
            with AI for{" "}
            <span className="relative inline-flex align-baseline overflow-hidden h-[1.1em] min-w-[6ch]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotating[word]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="gradient-text-primary"
                >
                  {rotating[word]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            Generate high-quality scripts, captions, blog posts, thumbnails, hashtags, and marketing content
            in seconds — all inside one AI workspace built for creators and brands.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link to="/signup">
              <Button size="lg" className="gradient-button rounded-full h-12 px-6 gap-2 text-sm">
                Start Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#demo">
              <Button size="lg" variant="outline" className="rounded-full h-12 px-6 gap-2 border-border/60 bg-card/40 backdrop-blur-md hover:bg-card/70">
                <Play className="h-4 w-4" /> Watch Demo
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
          >
            {[
              { icon: CreditCard, label: "No credit card" },
              { icon: Sparkles, label: "AI powered" },
              { icon: Zap, label: "Fast generation" },
              { icon: MessagesSquare, label: "Discord community" },
            ].map((t) => (
              <span key={t.label} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {t.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Dashboard mock */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[32px] bg-primary/10 blur-3xl" />
          <div className="relative glass-card p-2 shadow-[0_30px_80px_-20px_hsl(180_90%_50%/0.25)]">
            <div className="rounded-[16px] bg-background/80 overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/40">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-3 text-[11px] text-muted-foreground font-mono">trendnova.ai / generate</span>
              </div>

              <div className="grid grid-cols-[140px_1fr] min-h-[380px]">
                <div className="border-r border-border/40 p-3 space-y-1 bg-card/40">
                  {["Scripts", "Captions", "Blogs", "Thumbnails", "Ads", "Emails"].map((s, idx) => (
                    <div
                      key={s}
                      className={`text-xs px-2.5 py-2 rounded-lg ${idx === 0 ? "bg-primary/15 text-primary" : "text-muted-foreground"}`}
                    >
                      {s}
                    </div>
                  ))}
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
                    <div className="inline-flex items-center gap-1 text-[10px] text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Generating
                    </div>
                  </div>
                  <div className="rounded-xl bg-secondary/50 border border-border/40 p-4 text-sm leading-relaxed text-foreground/90 min-h-[120px]">
                    <span>{text}</span>
                    <span className="caret" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["Hook", "Story", "CTA"].map((chip, i) => (
                      <div key={chip} className="rounded-lg border border-border/40 bg-card/40 px-2.5 py-2 text-[10px]">
                        <div className="text-muted-foreground">{chip}</div>
                        <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${60 + i * 12}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[10px] text-muted-foreground">Model: TrendNova Core</div>
                    <div className="text-[10px] px-2 py-1 rounded-full bg-primary/15 text-primary">Ready in 2.4s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating chips */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-10 hidden sm:flex glass-card px-3 py-2 items-center gap-2 text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" /> +240 ideas today
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 bottom-10 hidden sm:flex glass-card px-3 py-2 items-center gap-2 text-xs"
          >
            <Zap className="h-3.5 w-3.5 text-primary" /> 2.4s avg latency
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
