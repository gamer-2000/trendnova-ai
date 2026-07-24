import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => (
  <section className="section-padding">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative glass-card p-10 sm:p-16 text-center overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
            Stop staring at a <span className="gradient-text-primary">blank page</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of creators shipping better content, faster. Your first draft is 30 seconds away.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/signup">
              <Button size="lg" className="gradient-button rounded-full h-12 px-6 gap-2">
                Start Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/try">
              <Button size="lg" variant="outline" className="rounded-full h-12 px-6 border-border/60 bg-card/40 backdrop-blur-md">
                Try without signup
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTA;
