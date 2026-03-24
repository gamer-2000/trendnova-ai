import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Arjun M.", role: "YouTuber", text: "TrendNova helped me script 3 videos a week. My channel grew 40% in a month!", rating: 5 },
  { name: "Priya S.", role: "Instagram Creator", text: "The captions are fire. My engagement rate doubled since I started using this.", rating: 5 },
  { name: "Rahul K.", role: "Blogger", text: "I publish 5x more blog posts now. The AI quality is surprisingly good for the price.", rating: 4 },
];

const Testimonials = () => (
  <section id="testimonials" className="section-padding">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
          Loved by <span className="gradient-text">Creators</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          See what our users are saying.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-6"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, si) => (
                <Star key={si} className={`h-4 w-4 ${si < t.rating ? "text-primary fill-primary" : "text-muted"}`} />
              ))}
            </div>
            <p className="text-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
            <div>
              <div className="font-semibold text-sm text-foreground">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
