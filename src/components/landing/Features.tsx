import { motion } from "framer-motion";
import { Video, Smartphone, FileText, MessageSquare, Clock, Lightbulb } from "lucide-react";

const features = [
  { icon: Video, title: "YouTube Scripts", desc: "Complete scripts with hooks, structure, and calls-to-action — ready to film." },
  { icon: Smartphone, title: "TikTok & Reels Ideas", desc: "Short-form content ideas that match what's trending right now." },
  { icon: FileText, title: "Blog Posts", desc: "Well-structured articles that read naturally and rank on search." },
  { icon: MessageSquare, title: "Social Captions", desc: "Captions that stop the scroll — for Instagram, Twitter, and LinkedIn." },
  { icon: Clock, title: "Done in Seconds", desc: "No more writer's block. Get a solid first draft instantly." },
  { icon: Lightbulb, title: "Fresh Ideas Daily", desc: "Content suggestions based on what people are actually searching for." },
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
          Everything You Need to <span className="gradient-text">Create</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Tools built for creators who'd rather create than sit and brainstorm for hours.
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
