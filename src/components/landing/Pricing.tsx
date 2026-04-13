import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    features: ["5 writes per day", "All content types", "Standard quality", "Community support"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹50",
    period: "/month",
    features: ["20 writes per day", "Higher quality output", "Save your history", "Priority support"],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Premium",
    price: "₹100",
    period: "/month",
    features: ["Unlimited writes", "Fastest responses", "Advanced content styles", "1-on-1 support"],
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
        className="text-center mb-16"
      >
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
          Simple, <span className="gradient-text">Fair</span> Pricing
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Start free. Upgrade when you need more.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-8 relative ${plan.popular ? "border-primary/40" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-button px-4 py-1 rounded-full text-xs font-semibold">
                Most Popular
              </div>
            )}
            <h3 className="font-display font-semibold text-lg text-foreground">{plan.name}</h3>
            <div className="mt-4 mb-6">
              <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
              <span className="text-muted-foreground text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup">
              <Button
                variant={plan.popular ? "hero" : "outline"}
                className="w-full"
              >
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
