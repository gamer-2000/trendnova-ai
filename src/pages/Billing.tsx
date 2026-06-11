import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  { name: "Free", price: "₹0", features: ["2 generations/day", "YouTube scripts only", "Standard quality AI"] },
  { name: "Pro", price: "₹100/mo", features: ["20 generations/day", "All content types", "Higher quality AI", "Save history"] },
  { name: "Premium", price: "₹500/mo", features: ["Unlimited generations", "Best quality AI", "Priority responses", "Advanced viral content"] },
];

const Billing = () => {
  const { profile } = useAuth();

  const handleUpgrade = (planName: string) => {
    const subject = encodeURIComponent("Upgrade Request - TrendNova");
    const body = encodeURIComponent(
      `Hi TrendNova Team,\n\nI'd like to upgrade my plan.\n\nEmail: ${profile?.email}\nSelected Plan: ${planName}\n\nThank you!`
    );
    const supportEmail = "trendnova0001@gmail.com";
    // Use an anchor click so the browser treats it as a direct user navigation.
    // window.open() to mail.google.com inside an embedded preview / popup gets
    // blocked with "site blocked" — anchor clicks bypass that.
    const gmailUrl = `https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=${supportEmail}&su=${subject}&body=${body}`;
    const a = document.createElement("a");
    a.href = gmailUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Billing</h1>
        <p className="text-muted-foreground text-sm mb-8">Manage your subscription</p>
      </motion.div>

      <div className="glass-card p-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="font-display font-bold text-foreground uppercase">{profile?.plan || "free"}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          To upgrade, click the upgrade button below. This will open your email client with a pre-filled upgrade request.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {plans.map((plan, i) => {
          const isCurrent = plan.name.toLowerCase() === profile?.plan;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-6 ${isCurrent ? "border-primary/40" : ""}`}
            >
              <h3 className="font-display font-semibold text-foreground">{plan.name}</h3>
              <p className="font-display text-2xl font-bold text-foreground mt-2">{plan.price}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3 w-3 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={isCurrent ? "outline" : "hero"}
                className="w-full mt-6"
                disabled={isCurrent}
                onClick={() => handleUpgrade(plan.name)}
              >
                {isCurrent ? "Current Plan" : "Upgrade"}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Billing;
