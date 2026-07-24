import { motion } from "framer-motion";
import { Wand2, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: Wand2,
    n: "01",
    title: "Describe your idea",
    desc: "Tell TrendNova what you want to create — a topic, a niche, or just a rough thought.",
  },
  {
    icon: Sparkles,
    n: "02",
    title: "Pick a format",
    desc: "Choose from 16 formats — scripts, captions, blogs, ads, thumbnails, and more.",
  },
  {
    icon: Download,
    n: "03",
    title: "Refine & ship",
    desc: "Edit tone, length, and audience. Copy, download, or repurpose across every platform.",
  },
];

const HowItWorks = () => (
  <section id="demo" className="section-padding relative">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground mb-5">
          How it works
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
          Three steps. <span className="gradient-text-primary">Zero friction.</span>
        </h2>
        <p className="text-muted-foreground">
          From a blank page to shippable content in under a minute.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5 relative">
        <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="glass-card p-8 relative"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display text-3xl font-semibold text-muted-foreground/40 tabular-nums">{s.n}</span>
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
