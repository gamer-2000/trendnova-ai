import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, PenTool, ShieldCheck, Lock, CreditCard } from "lucide-react";

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center section-padding pt-32 overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/4 rounded-full blur-[100px]" />
    </div>

    <div className="max-w-4xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 text-sm text-muted-foreground">
          <PenTool className="h-4 w-4 text-primary" />
          Your content writing assistant
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6"
      >
        Write <span className="gradient-text">Better Content</span>
        <br />
        in Minutes
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
      >
        Scripts, captions, blog posts, video ideas — all written in your voice.
        Stop staring at a blank page.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link to="/try">
          <Button variant="hero" size="lg" className="gap-2">
            Try It Free <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/signup">
          <Button variant="glass" size="lg">
            Create Account
          </Button>
        </Link>
        <a href="#features">
          <Button variant="glass" size="lg">
            See How It Works
          </Button>
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
      >
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-green-400" /> HTTPS Secured
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5 text-green-400" /> No credit card required
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-green-400" /> GDPR friendly
        </span>
        <span className="inline-flex items-center gap-1.5">
          <PenTool className="h-3.5 w-3.5 text-green-400" /> Google verified
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-16 glass-card p-1 rounded-2xl"
      >
        <div className="bg-card rounded-xl p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "Scripts Written", value: "10K+" },
              { label: "Video Ideas", value: "25K+" },
              { label: "Blog Posts", value: "15K+" },
              { label: "Happy Creators", value: "5K+" },
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
