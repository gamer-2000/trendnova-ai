import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Arjun M.", role: "YouTuber · 240K subs", text: "I used to spend 3 hours on a script. Now I get a solid draft in minutes and just tweak it. My channel grew 40% in a month.", rating: 5 },
  { name: "Priya S.", role: "Instagram Creator", text: "The captions actually sound like me, not a robot. My engagement rate doubled since I started using TrendNova.", rating: 5 },
  { name: "Rahul K.", role: "SEO Blogger", text: "I publish 5x more posts now. The writing quality is honestly better than what I'd write on a bad day.", rating: 5 },
  { name: "Meera V.", role: "Agency Owner", text: "We run 12 client accounts on TrendNova. It replaced two junior copywriters and pays for itself weekly.", rating: 5 },
  { name: "Karan T.", role: "DTC Founder", text: "Product descriptions and ad copy in one place. Our meta ads CTR is up 2.1x since switching.", rating: 5 },
  { name: "Sana R.", role: "Newsletter Writer", text: "The tone controls are what sold me. I write in my voice, faster. No AI-mush.", rating: 5 },
];

const Testimonials = () => (
  <section id="testimonials" className="section-padding">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground mb-5">
          Testimonials
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
          Loved by <span className="gradient-text-primary">real creators</span>
        </h2>
        <p className="text-muted-foreground">
          Not paid reviews. Just people shipping better content.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 3) * 0.1 }}
            className="glass-card-hover p-6"
          >
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, si) => (
                <Star key={si} className={`h-4 w-4 ${si < t.rating ? "text-primary fill-primary" : "text-muted"}`} />
              ))}
            </div>
            <p className="text-foreground text-[15px] leading-relaxed mb-6">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent" />
              <div>
                <div className="font-semibold text-sm text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
