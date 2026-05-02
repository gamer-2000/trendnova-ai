import { ShieldCheck, Lock, CreditCard, Users, BadgeCheck, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const badges = [
  { icon: Lock, label: "Secured by HTTPS", sub: "256-bit SSL encryption" },
  { icon: CreditCard, label: "No Card Required", sub: "Free forever plan" },
  { icon: ShieldCheck, label: "GDPR Compliant", sub: "Your data is yours" },
  { icon: BadgeCheck, label: "Real Support", sub: "Email us anytime" },
  { icon: Users, label: "Growing Community", sub: "Creators worldwide" },
  { icon: Globe, label: "Enterprise Hosting", sub: "Powered by Vercel" },
];

const TrustBadges = () => (
  <section className="py-12 px-4 border-y border-border/20 bg-card/30">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Trusted &amp; Secure
        </p>
        <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground">
          Why creators trust TrendNova
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="glass-card p-4 rounded-xl flex flex-col items-center text-center gap-2 hover:border-primary/40 transition-colors"
          >
            <Icon className="h-6 w-6 text-primary" />
            <div>
              <div className="text-xs font-semibold text-foreground">{label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-6">
        🔒 We never sell your data. We never ask for payment details on the free plan.
        Read our <Link to="/privacy" className="text-primary underline">Privacy Policy</Link> and{" "}
        <Link to="/terms" className="text-primary underline">Terms</Link>.
      </p>
    </div>
  </section>
);

export default TrustBadges;
