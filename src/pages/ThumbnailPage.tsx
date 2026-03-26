import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Image, Loader2, Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ThumbnailPage = () => {
  const { profile } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const isPaidPlan = profile?.plan === "pro" || profile?.plan === "premium";

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error("Enter a description for your thumbnail");
    setLoading(true);
    setImageUrl(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("generate-thumbnail", {
        body: { prompt: prompt.trim() },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (res.error) throw new Error(res.error.message);
      const result = res.data;
      if (result.error) throw new Error(result.error);
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
        toast.success("Thumbnail generated!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate thumbnail");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `trendnova-thumbnail-${Date.now()}.png`;
    link.click();
  };

  if (!isPaidPlan) {
    return (
      <div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Thumbnail Creator</h1>
          <p className="text-muted-foreground text-sm mb-8">AI-powered thumbnail generation</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 text-center max-w-md mx-auto"
        >
          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Pro & Premium Only</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Thumbnail creation is available on Pro (₹50/mo) and Premium (₹100/mo) plans.
          </p>
          <Link to="/dashboard/billing">
            <Button variant="hero">Upgrade Now</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Thumbnail Creator</h1>
        <p className="text-muted-foreground text-sm mb-8">Describe your video and get an AI-generated thumbnail</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-6"
      >
        <div className="flex gap-3">
          <Input
            placeholder="e.g. Top 10 AI tools for creators in 2026"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
            className="flex-1 bg-secondary/50 border-border/30"
          />
          <Button variant="hero" onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Image className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </motion.div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 flex flex-col items-center justify-center"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">Creating your thumbnail... this may take a moment</p>
        </motion.div>
      )}

      {imageUrl && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="rounded-lg overflow-hidden mb-4">
            <img src={imageUrl} alt="Generated thumbnail" className="w-full rounded-lg" />
          </div>
          <Button variant="glass" className="gap-2" onClick={handleDownload}>
            <Download className="h-4 w-4" /> Download Thumbnail
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ThumbnailPage;
