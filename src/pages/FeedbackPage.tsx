import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Star, Send } from "lucide-react";

interface FeedbackItem {
  id: string;
  name: string;
  comment: string;
  rating: number;
  created_at: string;
}

const FeedbackPage = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  const fetchFeedback = async () => {
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setFeedbacks(data as FeedbackItem[]);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("feedback").insert({ name, comment, rating });
    setLoading(false);
    if (error) {
      toast.error("Failed to submit feedback");
    } else {
      toast.success("Thank you for your feedback!");
      setName("");
      setComment("");
      setRating(5);
      fetchFeedback();
    }
  };

  return (
    <div className="max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Feedback</h1>
        <p className="text-muted-foreground text-sm mb-8">Share your thoughts</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="glass-card p-6 mb-8 space-y-4"
      >
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((r) => (
              <button key={r} type="button" onClick={() => setRating(r)}>
                <Star className={`h-6 w-6 transition-colors ${r <= rating ? "text-primary fill-primary" : "text-muted"}`} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Comment</label>
          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your feedback..." className="bg-secondary border-border" />
        </div>
        <Button variant="hero" disabled={loading} className="gap-2">
          <Send className="h-4 w-4" /> {loading ? "Submitting..." : "Submit Feedback"}
        </Button>
      </motion.form>

      <h2 className="font-display font-semibold text-foreground mb-4">Recent Feedback</h2>
      <div className="space-y-4">
        {feedbacks.map((fb, i) => (
          <motion.div
            key={fb.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm text-foreground">{fb.name}</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((r) => (
                  <Star key={r} className={`h-3 w-3 ${r <= fb.rating ? "text-primary fill-primary" : "text-muted"}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{fb.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPage;
