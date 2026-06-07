import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/20 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">TrendNova</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Pricing</a>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">About</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Contact</Link>
            <Button variant="ghost" size="sm" className="gap-1 text-pink-400 hover:text-pink-300" onClick={() => setDonateOpen(true)}>
              <Heart className="h-4 w-4" /> Donate
            </Button>
            <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link to="/signup"><Button variant="hero" size="sm">Start Free</Button></Link>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/20 bg-card/90 backdrop-blur-xl"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                <a href="#features" className="text-muted-foreground hover:text-foreground py-2" onClick={() => setOpen(false)}>Features</a>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground py-2" onClick={() => setOpen(false)}>Pricing</a>
                <Link to="/about" className="text-muted-foreground hover:text-foreground py-2" onClick={() => setOpen(false)}>About</Link>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground py-2" onClick={() => setOpen(false)}>Contact</Link>
                <Button variant="ghost" className="w-full justify-start gap-2 text-pink-400" onClick={() => { setDonateOpen(true); setOpen(false); }}>
                  <Heart className="h-4 w-4" /> Donate
                </Button>
                <Link to="/login" onClick={() => setOpen(false)}><Button variant="ghost" className="w-full">Log in</Button></Link>
                <Link to="/signup" onClick={() => setOpen(false)}><Button variant="hero" className="w-full">Start Free</Button></Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <Dialog open={donateOpen} onOpenChange={setDonateOpen}>
        <DialogContent className="glass-card border-border/30">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-400" /> Support TrendNova
            </DialogTitle>
            <DialogDescription>
              Love TrendNova? Help us keep building! Send your donation to:
            </DialogDescription>
          </DialogHeader>
          <div className="glass-card p-4 text-center">
            <p className="text-lg font-semibold text-foreground select-all">trendnova0001@gmail.com</p>
            <p className="text-xs text-muted-foreground mt-2">Send via UPI, PayPal, or any payment method to this email</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
