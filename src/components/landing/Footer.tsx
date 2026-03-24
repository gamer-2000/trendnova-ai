import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/30 py-8 px-4">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-display font-semibold text-foreground">TrendNova</span>
      </div>
      <p className="text-sm text-muted-foreground">© 2026 TrendNova. All Rights Reserved.</p>
    </div>
  </footer>
);

export default Footer;
