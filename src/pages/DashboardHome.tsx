import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Wand2, TrendingUp, Quote, Image, Video, History, ArrowUpRight, Zap, Clock,
} from "lucide-react";

const quickActions = [
  { to: "/dashboard/generate", label: "Generate content", desc: "Scripts, posts, emails, ads", icon: Wand2 },
  { to: "/dashboard/captions", label: "Captions", desc: "Per-platform captions + hashtags", icon: Quote, tag: "PRO" },
  { to: "/dashboard/thumbnails", label: "Thumbnails", desc: "16:9 covers that get clicks", icon: Image, tag: "PRO" },
  { to: "/dashboard/video", label: "Video", desc: "Storyboarded short videos", icon: Video, tag: "PREMIUM" },
];

const DashboardHome = () => {
  const { user, profile } = useAuth();
  const [recent, setRecent] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user || profile?.plan === "free") return;
    supabase
      .from("generations")
      .select("id, content_type, prompt, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data, count }) => {
        setRecent(data ?? []);
        setTotal(count ?? 0);
      });
  }, [user, profile?.plan]);

  const plan = profile?.plan ?? "free";
  const limit = plan === "premium" ? Infinity : plan === "pro" ? 20 : 2;
  const used = profile?.daily_usage_count ?? 0;
  const pct = limit === Infinity ? 100 : Math.min(100, Math.round((used / limit) * 100));
  const maxLabel = limit === Infinity ? "∞" : String(limit);

  return (
    <div className="max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">
          Welcome back{profile?.email ? `, ${profile.email.split("@")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground text-sm">Here's where things stand today.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 sm:col-span-2"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" /> Today's usage
            </span>
            <span className="text-xs text-muted-foreground">resets at midnight</span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground mb-4">
            {used} <span className="text-muted-foreground text-lg font-medium">/ {maxLabel}</span>
          </p>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Plan</span>
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="font-display text-2xl font-bold text-foreground mb-1">{plan.toUpperCase()}</p>
          <p className="text-xs text-muted-foreground flex-1">
            {plan === "free" ? "YouTube scripts only" : plan === "pro" ? "All formats · 20/day" : "Everything · unlimited"}
          </p>
          {plan !== "premium" && (
            <Link
              to="/dashboard/billing"
              className="text-xs text-primary font-medium inline-flex items-center gap-1 mt-3 hover:gap-1.5 transition-all"
            >
              Upgrade <ArrowUpRight className="h-3 w-3" />
            </Link>
          )}
        </motion.div>
      </div>

      {/* Quick actions */}
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60 mb-3">
        Start something
      </h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {quickActions.map((a, i) => (
          <motion.div
            key={a.to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Link
              to={a.to}
              className="glass-card-hover p-5 flex items-start gap-4 group h-full"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <a.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{a.label}</p>
                  {a.tag && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {a.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent */}
      {plan !== "free" && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              Recent {total > 0 && <span className="text-muted-foreground/40">· {total} total</span>}
            </h2>
            <Link to="/dashboard/history" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="glass-card divide-y divide-border/40">
            {recent.length === 0 ? (
              <div className="p-8 text-center">
                <History className="h-6 w-6 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nothing yet — generate something.</p>
              </div>
            ) : (
              recent.map((r) => (
                <Link
                  key={r.id}
                  to="/dashboard/history"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md shrink-0">
                    {r.content_type.replace(/-/g, " ")}
                  </span>
                  <p className="text-sm text-foreground/80 truncate flex-1">{r.prompt}</p>
                  <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
