import { Link } from "react-router-dom";
import { Sparkles, MessagesSquare, Mail, ShieldCheck } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/40 pt-16 pb-10 px-4 relative overflow-hidden">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold text-foreground">TrendNova</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            One AI workspace for creators and brands. Ship content across every platform, faster.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm mb-4">Product</h4>
          <div className="flex flex-col gap-2.5">
            <a href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <Link to="/try" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Try Free</Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm mb-4">Company</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <a href="/#transparency" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Transparency</a>
            <a href="https://discord.gg/P36rMNgnZV" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-[#5865F2] transition-colors inline-flex items-center gap-1.5">
              <MessagesSquare className="h-3.5 w-3.5" /> Discord
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm mb-4">Legal</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">© 2026 TrendNova. Crafted for creators worldwide.</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Privacy first</span>
          <a href="mailto:trendnova0001@gmail.com" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Mail className="h-3.5 w-3.5 text-primary" /> trendnova0001@gmail.com
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
