import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
      return controls.stop;
    }
  }, [inView, to, mv]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
};

const stats = [
  { value: 120000, suffix: "+", label: "Pieces generated" },
  { value: 5200, suffix: "+", label: "Active creators" },
  { value: 16, suffix: "", label: "Content formats" },
  { value: 2, suffix: ".4s", label: "Avg. generation" },
];

const Stats = () => (
  <section className="section-padding">
    <div className="max-w-7xl mx-auto">
      <div className="glass-card p-8 sm:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 relative overflow-hidden noise">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center relative"
          >
            <div className="font-display text-4xl sm:text-5xl font-semibold gradient-text-primary">
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <div className="text-sm text-muted-foreground mt-2">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
