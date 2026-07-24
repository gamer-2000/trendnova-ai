import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    tagline: "Try TrendNova with zero risk.",
    features: ["2 generations per day", "YouTube scripts only", "Standard quality", "Community support"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹100",
    period: "/month",
    tagline: "For creators shipping every week.",
    features: ["20 generations per day", "All content formats", "Higher quality output", "History & saved drafts", "Priority support"],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Premium",
    price: "₹500",
    period: "/month",
    tagline: "For agencies and power users.",
    features: ["Unlimited generations", "AI video generation", "Ad-free experience", "Fastest response times", "Advanced content styles", "1-on-1 support"],
    cta: "Go Premium",
    popular: false,
  },
];

const Pricing = () => (
  <section id="pricing" className="section-padding">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground mb-5">
          Pricing
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
          Simple, <span className="gradient-text-primary">fair</span> pricing
        </h2>
        <p className="text-muted-foreground">
          Start free. Upgrade when you're ready. Cancel anytime.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative glass-card p-8 flex flex-col ${
              plan.popular ? "border-primary/50 shadow-[0_20px_60px_-20px_hsl(180_90%_50%/0.3)]" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-button px-3 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Most Popular
              </div>
            )}
            <h3 className="font-display font-semibold text-lg text-foreground">{plan.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
            <div className="mt-6 mb-6 flex items-baseline gap-1">
              <span className="font-display text-5xl font-semibold text-foreground tracking-tight">{plan.price}</span>
              <span className="text-muted-foreground text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup">
              <Button className={`w-full rounded-full h-11 ${plan.popular ? "gradient-button" : ""}`} variant={plan.popular ? "default" : "outline"}>
                {plan.cta}
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
