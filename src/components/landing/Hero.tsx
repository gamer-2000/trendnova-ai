import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center section-padding pt-32 overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />
    </div>

    <div className="max-w-5xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 text-sm text-muted-foreground">
          <Zap className="h-4 w-4 text-primary" />
          AI-Powered Content Generation
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6"
      >
        Create{" "}
        <span className="gradient-text">Viral Content</span>
        <br />
        with AI
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
      >
        Generate YouTube scripts, TikTok ideas, blog posts, and social captions
        in seconds. Powered by cutting-edge AI.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link to="/signup">
          <Button variant="hero" size="lg" className="gap-2">
            Start Free <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <a href="#features">
          <Button variant="glass" size="lg">
            See Features
          </Button>
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-16 glass-card p-1 rounded-2xl animate-glow-pulse"
      >
        <div className="bg-card rounded-xl p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "YouTube Scripts", value: "10K+" },
              { label: "TikTok Ideas", value: "25K+" },
              { label: "Blog Posts", value: "15K+" },
              { label: "Happy Users", value: "5K+" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
