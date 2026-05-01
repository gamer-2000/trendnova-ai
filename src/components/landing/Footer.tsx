import { Link } from "react-router-dom";
import { PenTool, ShieldCheck, Lock, BadgeCheck } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/30 py-10 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <PenTool className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold text-foreground">TrendNova</span>
          </div>
          <p className="text-sm text-muted-foreground">A writing tool for creators, marketers, and anyone who needs content fast.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm mb-3">Pages</h4>
          <div className="flex flex-col gap-2">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <a href="/#transparency" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Transparency</a>
            <Link to="/try" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Try Free</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm mb-3">Legal</h4>
          <div className="flex flex-col gap-2">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border/20 pt-6 flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-green-400" /> SSL Encrypted</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-green-400" /> Privacy First</span>
          <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-green-400" /> Real Email Support</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2026 TrendNova. All Rights Reserved. Contact: trendnova0001@gmail.com</p>
      </div>
    </div>
  </footer>
);

export default Footer;
