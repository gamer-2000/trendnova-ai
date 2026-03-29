import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/30 py-8 px-4">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-display font-semibold text-foreground">TrendNova</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
      </div>
      <p className="text-sm text-muted-foreground">© 2026 TrendNova. All Rights Reserved.</p>
    </div>
  </footer>
);

export default Footer;
