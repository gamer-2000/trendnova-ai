import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessagesSquare } from "lucide-react";
import tnLogo from "@/assets/tn-logo.png";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnnouncementBar from "@/components/AnnouncementBar";

const links = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-border/40"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={tnLogo} alt="TrendNova logo" className="h-7 w-auto" />
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">TrendNova</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 rounded-full border border-border/40 bg-card/30 backdrop-blur-md px-1.5 py-1.5">
            {links.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-secondary/60 transition-colors">
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-secondary/60 transition-colors">
                  {l.label}
                </a>
              )
            )}
            <a
              href="https://discord.gg/P36rMNgnZV"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-secondary/60 transition-colors inline-flex items-center gap-1.5"
            >
              <MessagesSquare className="h-3.5 w-3.5" /> Discord
            </a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-full">Login</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gradient-button rounded-full px-4">Start Free</Button>
            </Link>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/40 bg-background/90 backdrop-blur-xl"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {links.map((l) =>
                  l.to ? (
                    <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="text-muted-foreground py-2.5 px-2 rounded-lg hover:bg-secondary/60">{l.label}</Link>
                  ) : (
                    <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-muted-foreground py-2.5 px-2 rounded-lg hover:bg-secondary/60">{l.label}</a>
                  )
                )}
                <a href="https://discord.gg/P36rMNgnZV" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="text-muted-foreground py-2.5 px-2 rounded-lg hover:bg-secondary/60 inline-flex items-center gap-2">
                  <MessagesSquare className="h-4 w-4" /> Discord
                </a>
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1"><Button variant="outline" className="w-full rounded-full">Login</Button></Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="flex-1"><Button className="w-full gradient-button rounded-full">Start Free</Button></Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnnouncementBar />
    </>
  );
};

export default Navbar;
