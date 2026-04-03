import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Wand2, Copy, Video, Smartphone, FileText, MessageSquare } from "lucide-react";

const contentTypes = [
  { id: "youtube-script", label: "YouTube Script", icon: Video },
  { id: "tiktok-idea", label: "TikTok/Reels Idea", icon: Smartphone },
  { id: "blog-post", label: "Blog Post", icon: FileText },
  { id: "social-caption", label: "Social Caption", icon: MessageSquare },
];

const Generate = () => {
  const { profile, refreshProfile } = useAuth();
  const [selectedType, setSelectedType] = useState("youtube-script");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const maxUsage = profile?.plan === "premium" ? Infinity : profile?.plan === "pro" ? 20 : 1;
  const usageLeft = profile?.plan === "premium" ? "∞" : String(maxUsage - (profile?.daily_usage_count ?? 0));

  const handleGenerate = async () => {
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
        body: { contentType: selectedType, topic },
      });

      if (error) throw error;
      if (data?.error) {
        if (data.error.includes("Rate limit")) toast.error("Rate limited. Try again shortly.");
        else if (data.error.includes("Payment")) toast.error("Credits exhausted.");
        else toast.error(data.error);
        return;
      }

      setResult(data.result);
      await refreshProfile();
      toast.success("Content generated!");
    } catch (err: any) {
      toast.error(err.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {contentTypes.map((ct) => (
            <button
              key={ct.id}
              onClick={() => setSelectedType(ct.id)}
              className={`glass-card p-4 text-center transition-all duration-200 ${
                selectedType === ct.id
                  ? "border-primary/50 bg-primary/5"
                  : "hover:border-border/50"
              }`}
            >
              <ct.icon className={`h-5 w-5 mx-auto mb-2 ${selectedType === ct.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs font-medium ${selectedType === ct.id ? "text-primary" : "text-muted-foreground"}`}>
                {ct.label}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Topic / Description</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 5 productivity tips for remote workers"
              className="bg-secondary border-border"
            />
          </div>

          <Button variant="hero" onClick={handleGenerate} disabled={loading} className="gap-2">
            <Wand2 className="h-4 w-4" />
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display font-semibold text-foreground">Result</h2>
            <Button variant="ghost" size="sm" onClick={copyResult} className="gap-1">
              <Copy className="h-3 w-3" /> Copy
            </Button>
          </div>
          <div className="glass-card p-6">
            <Textarea
              value={result}
              readOnly
              className="bg-transparent border-none resize-none min-h-[300px] text-foreground"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Generate;
