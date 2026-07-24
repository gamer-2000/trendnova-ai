import { motion } from "framer-motion";
import { Youtube, Instagram, Facebook, Linkedin, Twitter, Music2, FileText } from "lucide-react";

const platforms = [
  { name: "YouTube", icon: Youtube, color: "text-red-400" },
  { name: "TikTok", icon: Music2, color: "text-pink-400" },
  { name: "Instagram", icon: Instagram, color: "text-fuchsia-400" },
  { name: "Facebook", icon: Facebook, color: "text-blue-400" },
  { name: "X", icon: Twitter, color: "text-foreground" },
  { name: "LinkedIn", icon: Linkedin, color: "text-sky-400" },
  { name: "Blogs", icon: FileText, color: "text-primary" },
];

const Platforms = () => (
  <section className="py-16 px-4 border-y border-border/30 bg-card/20">
    <div className="max-w-7xl mx-auto">
      <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">
        Content built for every major platform
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {platforms.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card-hover p-5 flex flex-col items-center gap-2"
          >
            <p.icon className={`h-6 w-6 ${p.color}`} />
            <span className="text-xs font-medium text-foreground">{p.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Platforms;
