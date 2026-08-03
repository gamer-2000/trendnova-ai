import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Sparkles, Copy, RefreshCw, Hash, Instagram, Linkedin, Smile,
  Smartphone, Youtube, Twitter, Facebook, Lock, Check,
} from "lucide-react";
import { Link } from "react-router-dom";

const platforms = [
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "tiktok", label: "TikTok", icon: Smartphone },
  { id: "youtube", label: "YouTube", icon: Youtube },
  { id: "x", label: "X / Twitter", icon: Twitter },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "facebook", label: "Facebook", icon: Facebook },
];

const tones = ["casual", "professional", "witty", "bold", "friendly", "expert"] as const;

function splitCaptions(raw: string): string[] {
  const cleaned = raw.replace(/```/g, "").trim();
  const parts = cleaned
    .split(/\n(?=\s*\d{1,2}[.)]\s)/)
    .map((p) => p.replace(/^\s*\d{1,2}[.)]\s*/, "").trim())
    .filter((p) => p.length > 0);
  return parts.length > 1 ? parts : [cleaned];
}

const CaptionsPage = () => {
  const { profile, refreshProfile } = useAuth();
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState<typeof tones[number]>("casual");
  const [emoji, setEmoji] = useState(true);
  const [hashtagCount, setHashtagCount] = useState(8);
  const [variants, setVariants] = useState(5);
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const isFree = !profile?.plan || profile.plan === "free";

  const run = async () => {
    if (!topic.trim()) {
      toast.error("Tell me what the post is about first");
      return;
    }
    setLoading(true);
    setCaptions([]);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: {
          contentType: "captions",
          topic,
          tone,
          length: "short",
          platform,
          emoji,
          hashtagCount,
          variants,
        },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      setCaptions(splitCaptions(data.result));
      await refreshProfile();
      toast.success("Captions ready");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyOne = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  if (isFree) {
    return (
      <div className="max-w-lg">
        <div className="glass-card p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Captions is a Pro feature</h2>
          <p className="text-sm text-muted-foreground mb-6">
            The free plan covers YouTube scripts. Upgrade to Pro (₹100) to generate captions for every platform.
          </p>
          <Button asChild variant="hero">
            <Link to="/dashboard/billing">See plans</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Captions</h1>
        <p className="text-muted-foreground text-sm">
          Scroll-stopping captions with hashtags, tuned per platform.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-5 sm:p-6 space-y-5"
      >
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
            Platform
          </label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  platform === p.id
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                }`}
              >
                <p.icon className="h-3.5 w-3.5" />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
            What's the post about?
          </label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. behind the scenes of our new coffee blend"
            className="bg-secondary border-border"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2 block">
              Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize border transition-all ${
                    tone === t
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <Hash className="h-3 w-3" /> Hashtags
                </label>
                <span className="text-xs text-primary font-medium">{hashtagCount}</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={hashtagCount}
                onChange={(e) => setHashtagCount(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Variants
                  </label>
                  <span className="text-xs text-primary font-medium">{variants}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={variants}
                  onChange={(e) => setVariants(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <button
                onClick={() => setEmoji((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all mt-4 ${
                  emoji
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                <Smile className="h-3.5 w-3.5" />
                Emojis {emoji ? "on" : "off"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="hero" onClick={run} disabled={loading} className="gap-2">
            <Sparkles className="h-4 w-4" />
            {loading ? "Writing..." : "Generate captions"}
          </Button>
          {captions.length > 0 && !loading && (
            <Button variant="outline" onClick={run} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Regenerate
            </Button>
          )}
        </div>
      </motion.div>

      {loading && (
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-5 h-36 animate-pulse" />
          ))}
        </div>
      )}

      {captions.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {captions.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 flex flex-col group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Option {i + 1}
                </span>
                <button
                  onClick={() => copyOne(c, i)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Copy caption"
                >
                  {copied === i ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap flex-1">{c}</p>
              <p className="text-[11px] text-muted-foreground mt-3">{c.length} chars</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CaptionsPage;
