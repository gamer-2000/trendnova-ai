import { motion } from "framer-motion";
import { Video, Smartphone, FileText, MessageSquare, Zap, TrendingUp } from "lucide-react";

const features = [
  { icon: Video, title: "YouTube Scripts", desc: "Full video scripts with hooks, structure, and CTAs that drive engagement." },
  { icon: Smartphone, title: "TikTok & Reels Ideas", desc: "Trending content ideas optimized for short-form virality." },
  { icon: FileText, title: "Blog Posts", desc: "SEO-optimized articles that rank and convert readers." },
  { icon: MessageSquare, title: "Social Captions", desc: "Scroll-stopping captions for Instagram, Twitter, and LinkedIn." },
  { icon: Zap, title: "Instant Generation", desc: "Get results in seconds with our high-speed AI engine." },
  { icon: TrendingUp, title: "Trend Analysis", desc: "Content suggestions based on current trending topics." },
];

const Features = () => (
  <section id="features" className="section-padding">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
          Everything You Need to Go <span className="gradient-text">Viral</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Powerful AI tools designed for modern content creators.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-6 group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <f.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
