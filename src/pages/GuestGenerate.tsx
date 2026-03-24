import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Copy, Video, Smartphone, FileText, MessageSquare, Sparkles, ArrowRight, X } from "lucide-react";

const GUEST_LIMIT = 3;
const STORAGE_KEY = "trendnova_guest_usage";

const getGuestUsage = (): number => {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
  } catch {
    return 0;
  }
};

const incrementGuestUsage = () => {
  localStorage.setItem(STORAGE_KEY, String(getGuestUsage() + 1));
};

const contentTypes = [
  { id: "youtube-script", label: "YouTube Script", icon: Video },
  { id: "tiktok-idea", label: "TikTok/Reels Idea", icon: Smartphone },
  { id: "blog-post", label: "Blog Post", icon: FileText },
  { id: "social-caption", label: "Social Caption", icon: MessageSquare },
];

const GuestGenerate = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("youtube-script");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  const usage = getGuestUsage();
  const remaining = Math.max(0, GUEST_LIMIT - usage);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    if (usage >= GUEST_LIMIT) {
      setShowSignupPrompt(true);
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { contentType: selectedType, topic, guest: true },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      incrementGuestUsage();
      setResult(data.result);
      toast.success("Content generated!");

      // Check if they just used their last generation
      if (getGuestUsage() >= GUEST_LIMIT) {
        setTimeout(() => setShowSignupPrompt(true), 2000);
      }
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
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border/30 bg-card/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">TrendNova</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {remaining} free {remaining === 1 ? "generation" : "generations"} left
            </span>
            <Link to="/signup">
              <Button variant="hero" size="sm" className="gap-1">
                Sign Up <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Try TrendNova Free</h1>
          <p className="text-muted-foreground text-sm mb-8">
            {remaining > 0
              ? `${remaining} free generation${remaining === 1 ? "" : "s"} remaining — no account needed`
              : "Sign up for free to keep generating!"}
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
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
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

      {/* Signup Prompt Modal */}
      <AnimatePresence>
        {showSignupPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card p-8 max-w-md w-full text-center relative"
            >
              <button
                onClick={() => setShowSignupPrompt(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <Sparkles className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                You've used all free generations!
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Create a free account to get 5 generations per day, or upgrade for even more.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/signup">
                  <Button variant="hero" className="w-full gap-2">
                    Sign Up Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="glass" className="w-full">
                    Already have an account? Log in
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuestGenerate;
