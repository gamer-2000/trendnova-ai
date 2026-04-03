import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Wand2, TrendingUp } from "lucide-react";

const DashboardHome = () => {
  const { profile } = useAuth();

  const maxUsage = profile?.plan === "premium" ? "∞" : profile?.plan === "pro" ? "20" : "5";

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm mb-8">Welcome back! Here's your overview.</p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Today's Usage", value: `${profile?.daily_usage_count ?? 0} / ${maxUsage}`, icon: Wand2 },
          { label: "Current Plan", value: (profile?.plan ?? "free").toUpperCase(), icon: TrendingUp },
          { label: "Balance", value: `₹${profile?.balance ?? 0}`, icon: Zap },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{card.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
