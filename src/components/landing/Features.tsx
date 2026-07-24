import { motion } from "framer-motion";
import {
  Video, FileText, Image as ImageIcon, MessageSquare, Music2, Twitter,
  Linkedin, Search, Mail, Megaphone, RefreshCw, Hash, Repeat, Lightbulb,
  ShoppingBag, PenLine,
} from "lucide-react";

const features = [
  { icon: Video, title: "AI Scripts", desc: "YouTube scripts with hooks, arcs, and CTAs — ready to film." },
  { icon: FileText, title: "Blog Generator", desc: "Long-form articles that read human and rank in search." },
  { icon: ImageIcon, title: "Thumbnail Generator", desc: "Scroll-stopping thumbnail prompts and visuals." },
  { icon: MessageSquare, title: "Instagram Captions", desc: "Captions that stop the scroll and grow engagement." },
  { icon: Music2, title: "TikTok Ideas", desc: "Short-form hooks and scripts tuned for the FYP." },
  { icon: Twitter, title: "Twitter Threads", desc: "Threads with rhythm, tension, and quotable lines." },
  { icon: Linkedin, title: "LinkedIn Posts", desc: "Professional posts with a POV, not corporate fluff." },
  { icon: Search, title: "SEO Articles", desc: "Keyword-aware structure without robotic filler." },
  { icon: Mail, title: "Email Generator", desc: "Cold, warm, newsletter — copy that gets opened." },
  { icon: Megaphone, title: "Ad Copy", desc: "Meta, Google, TikTok ads that convert on the first pass." },
  { icon: PenLine, title: "AI Rewrite", desc: "Rewrite tone, tighten, or expand any draft instantly." },
  { icon: Hash, title: "Hashtag Generator", desc: "Curated hashtag sets by niche and reach tier." },
  { icon: Repeat, title: "Content Repurposing", desc: "Turn one video into 10 posts across every platform." },
  { icon: Lightbulb, title: "Video Ideas", desc: "Endless titles and ideas based on what's trending." },
  { icon: ShoppingBag, title: "Product Descriptions", desc: "Store copy that sells without sounding like a bot." },
  { icon: RefreshCw, title: "Titles & Descriptions", desc: "Optimized YouTube titles and descriptions in one click." },
];

const Features = () => (
  <section id="features" className="section-padding relative">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground mb-5">
          Features
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
          Everything you need to <span className="gradient-text-primary">create</span>
        </h2>
        <p className="text-muted-foreground">
          One workspace, sixteen content formats. Ship in minutes instead of days.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 4) * 0.06 }}
            className="glass-card-hover p-6 group relative overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500 blur-2xl" />
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-base mb-1.5 text-foreground">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
