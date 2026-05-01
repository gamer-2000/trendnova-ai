import { Check, X, Mail, Code2, Heart } from "lucide-react";

const honest = [
  "We're a small indie project — built and maintained by one creator, not a big company.",
  "TrendNova is currently hosted on Vercel (trendova-ai.vercel.app). A custom domain is on the roadmap.",
  "The Free plan is genuinely free. No credit card. No hidden trial expiring into a charge.",
  "Paid upgrades are handled manually over email — you pay only after we confirm. No auto-billing.",
  "Your generated content belongs to you. We don't resell it or train models on it.",
  "We use Google AdSense to keep the free plan running. You can upgrade to remove ads.",
  "All pages are served over HTTPS. Auth is handled by Supabase (industry-standard).",
];

const neverDo = [
  "Ask for your credit/debit card on the free plan.",
  "Ask for your password outside the login page.",
  "Email you from any address other than trendnova0001@gmail.com.",
  "Sell, share, or leak your personal data to third parties.",
  "Auto-charge you or sign you up for hidden subscriptions.",
];

const Transparency = () => (
  <section id="transparency" className="py-16 px-4">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-primary mb-2">100% Transparent</p>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">
          We have nothing to hide
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          A lot of new tools online turn out to be scams. We get the suspicion. Here's everything
          you should know about TrendNova before you sign up.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Check className="h-5 w-5 text-green-400" /> What's true about us
          </h3>
          <ul className="space-y-3">
            {honest.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <X className="h-5 w-5 text-red-400" /> What we will never do
          </h3>
          <ul className="space-y-3">
            {neverDo.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-xl text-center">
          <Mail className="h-5 w-5 text-primary mx-auto mb-2" />
          <div className="text-sm font-semibold text-foreground">Real human email</div>
          <a href="mailto:trendnova0001@gmail.com" className="text-xs text-primary break-all">
            trendnova0001@gmail.com
          </a>
        </div>
        <div className="glass-card p-5 rounded-xl text-center">
          <Code2 className="h-5 w-5 text-primary mx-auto mb-2" />
          <div className="text-sm font-semibold text-foreground">Open about our stack</div>
          <p className="text-xs text-muted-foreground">React, Supabase, Vercel, Google AdSense</p>
        </div>
        <div className="glass-card p-5 rounded-xl text-center">
          <Heart className="h-5 w-5 text-pink-400 mx-auto mb-2" />
          <div className="text-sm font-semibold text-foreground">Donations are optional</div>
          <p className="text-xs text-muted-foreground">Never required. Never auto-charged.</p>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        Still unsure? Email us first. We'd rather answer 100 questions than have you feel scammed.
      </p>
    </div>
  </section>
);

export default Transparency;
