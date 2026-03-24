import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Clock, Video, Smartphone, FileText, MessageSquare } from "lucide-react";

const iconMap: Record<string, any> = {
  "youtube-script": Video,
  "tiktok-idea": Smartphone,
  "blog-post": FileText,
  "social-caption": MessageSquare,
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

  useEffect(() => {
    if (!user) return;
    supabase
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setItems((data as Generation[]) || []);
        setLoading(false);
      });
  }, [user]);

  if (profile?.plan === "free") {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-4">History</h1>
        <div className="glass-card p-8 text-center">
          <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Upgrade to Pro or Premium to save your generation history.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">History</h1>
        <p className="text-muted-foreground text-sm mb-8">Your past generations</p>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-4 animate-pulse h-24" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground">No generations yet. Start creating!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => {
            const Icon = iconMap[item.content_type] || FileText;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{item.content_type.replace("-", " ")}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{item.prompt}</p>
                    <p className="text-sm text-foreground/80 mt-2 line-clamp-3">{item.result}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
