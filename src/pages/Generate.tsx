import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Sparkles, Copy, RefreshCw, Download,
  Video, Smartphone, FileText, MessageSquare,
  Mail, Hash, Megaphone, Package, Send, Linkedin, Zap, ListOrdered,
} from "lucide-react";

const contentTypes = [
  { id: "youtube-script", label: "YouTube Script", icon: Video },
  { id: "tiktok-idea", label: "TikTok/Reels", icon: Smartphone },
  { id: "blog-post", label: "Blog Post", icon: FileText },
  { id: "social-caption", label: "Social Caption", icon: MessageSquare },
  { id: "tweet-thread", label: "X/Twitter Thread", icon: Hash },
  { id: "linkedin-post", label: "LinkedIn Post", icon: Linkedin },
  { id: "email", label: "Email", icon: Mail },
  { id: "ad-copy", label: "Ad Copy", icon: Megaphone },
  { id: "product-description", label: "Product Desc.", icon: Package },
  { id: "cold-dm", label: "Cold DM", icon: Send },
  { id: "video-hooks", label: "Video Hooks", icon: Zap },
  { id: "outline", label: "Outline", icon: ListOrdered },
];

const tones = ["casual", "professional", "witty", "bold", "friendly", "expert"] as const;
const lengths = ["short", "medium", "long"] as const;

const Generate = () => {
  const { profile, refreshProfile } = useAuth();
  const [selectedType, setSelectedType] = useState("youtube-script");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState<typeof tones[number]>("casual");
  const [length, setLength] = useState<typeof lengths[number]>("medium");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const isFree = profile?.plan === "free" || !profile?.plan;
  const maxUsage = profile?.plan === "premium" ? Infinity : profile?.plan === "pro" ? 20 : 2;
  const usageLeft = profile?.plan === "premium" ? "∞" : String(Math.max(0, maxUsage - (profile?.daily_usage_count ?? 0)));

  const runGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    if (profile?.plan !== "premium" && (profile?.daily_usage_count ?? 0) >= maxUsage) {
      toast.error("Daily limit reached. Upgrade your plan for more.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { contentType: selectedType, topic, tone, length, audience, keywords },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setResult(data.result);
      await refreshProfile();
      toast.success("Done! Your content is ready.");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedType}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Generate Content</h1>
        <p className="text-muted-foreground text-sm mb-8">
          {usageLeft} generations remaining today
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {contentTypes.map((ct) => {
            const locked = isFree && ct.id !== "youtube-script";
            return (
              <button
                key={ct.id}
                onClick={() => {
                  if (locked) {
                    toast.error("Upgrade to Pro or Premium to unlock this content type.");
                    return;
                  }
                  setSelectedType(ct.id);
                }}
                className={`glass-card p-4 text-center transition-all duration-200 relative ${
                  selectedType === ct.id ? "border-primary/50 bg-primary/5" : "hover:border-border/50"
                } ${locked ? "opacity-50" : ""}`}
              >
                <ct.icon className={`h-5 w-5 mx-auto mb-2 ${selectedType === ct.id ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs font-medium ${selectedType === ct.id ? "text-primary" : "text-muted-foreground"}`}>
                  {ct.label}
                </span>
                {locked && <span className="absolute top-1 right-1 text-[9px] text-muted-foreground">🔒</span>}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">What do you want to generate?</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 5 productivity tips for remote workers"
              className="bg-secondary border-border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Audience (optional)</label>
              <Input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. early-stage founders"
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Keywords to include (optional)</label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. notion, async, focus"
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Tone</label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-3 py-1.5 rounded-md text-xs capitalize border transition-all ${
                      tone === t ? "border-primary/60 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Length</label>
              <div className="flex gap-2">
                {lengths.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={`px-3 py-1.5 rounded-md text-xs capitalize border transition-all ${
                      length === l ? "border-primary/60 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="hero" onClick={runGenerate} disabled={loading} className="gap-2">
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating..." : "Generate"}
            </Button>
            {result && !loading && (
              <Button variant="outline" onClick={runGenerate} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display font-semibold text-foreground">Your Content</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={copyResult} className="gap-1">
                <Copy className="h-3 w-3" /> Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadResult} className="gap-1">
                <Download className="h-3 w-3" /> Download
              </Button>
            </div>
          </div>
          <div className="glass-card p-6">
            <Textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="bg-transparent border-none resize-none min-h-[300px] text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {result.trim().split(/\s+/).length} words · {result.length} chars
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Generate;
