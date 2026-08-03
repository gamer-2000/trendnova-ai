import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Clock, Video, Smartphone, FileText, MessageSquare, Search, Copy, Check,
  ChevronDown, Trash2, Quote, Mail, Hash, Megaphone, Package, Send, Linkedin,
  Zap, ListOrdered, Lock,
} from "lucide-react";
import { Link } from "react-router-dom";

const iconMap: Record<string, any> = {
  "youtube-script": Video,
  "tiktok-idea": Smartphone,
  "blog-post": FileText,
  "social-caption": MessageSquare,
  captions: Quote,
  email: Mail,
  "tweet-thread": Hash,
  "ad-copy": Megaphone,
  "product-description": Package,
  "cold-dm": Send,
  "linkedin-post": Linkedin,
  "video-hooks": Zap,
  outline: ListOrdered,
};

interface Generation {
  id: string;
  content_type: string;
  prompt: string;
  result: string;
  created_at: string;
}

const HistoryPage = () => {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setItems((data as Generation[]) || []);
        setLoading(false);
      });
  }, [user]);

  const types = useMemo(
    () => ["all", ...Array.from(new Set(items.map((i) => i.content_type)))],
    [items],
  );

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          (filter === "all" || i.content_type === filter) &&
          (query.trim() === "" ||
            i.prompt.toLowerCase().includes(query.toLowerCase()) ||
            i.result.toLowerCase().includes(query.toLowerCase())),
      ),
    [items, filter, query],
  );

  const copy = (item: Generation) => {
    navigator.clipboard.writeText(item.result);
    setCopied(item.id);
    setTimeout(() => setCopied(null), 1500);
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("generations").delete().eq("id", id);
    if (error) return toast.error("Couldn't delete that");
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Deleted");
  };

  if (profile?.plan === "free") {
    return (
      <div className="max-w-lg">
        <div className="glass-card p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">History is a paid feature</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Upgrade to Pro or Premium and everything you generate gets saved here.
          </p>
          <Button asChild variant="hero">
            <Link to="/dashboard/billing">See plans</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">History</h1>
        <p className="text-muted-foreground text-sm">
          {items.length} saved {items.length === 1 ? "generation" : "generations"}
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your generations..."
            className="bg-secondary border-border pl-9"
          />
        </div>
      </div>

      {types.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize border transition-all ${
                filter === t
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Clock className="h-7 w-7 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {items.length === 0 ? "No generations yet. Go make something." : "Nothing matches that search."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => {
            const Icon = iconMap[item.content_type] || FileText;
            const isOpen = open === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.04 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/[0.03] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-primary">
                        {item.content_type.replace(/-/g, " ")}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{item.prompt}</p>
                    {!isOpen && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.result}</p>
                    )}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-border/40"
                    >
                      <div className="p-4">
                        <p className="text-sm text-foreground/85 whitespace-pre-wrap max-h-[420px] overflow-y-auto">
                          {item.result}
                        </p>
                        <div className="flex items-center gap-1 mt-4">
                          <Button variant="ghost" size="sm" onClick={() => copy(item)} className="gap-1.5 text-xs">
                            {copied === item.id ? (
                              <><Check className="h-3 w-3 text-primary" /> Copied</>
                            ) : (
                              <><Copy className="h-3 w-3" /> Copy</>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(item.id)}
                            className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
