import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/30 py-10 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold text-foreground">TrendNova</span>
          </div>
          <p className="text-sm text-muted-foreground">AI-powered content generation for creators, marketers, and businesses.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm mb-3">Pages</h4>
          <div className="flex flex-col gap-2">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
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
      <div className="border-t border-border/20 pt-6 text-center">
        <p className="text-sm text-muted-foreground">© 2026 TrendNova. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
