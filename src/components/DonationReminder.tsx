import { useState, useEffect } from "react";
import { Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "trendnova_donate_last_shown";
const INTERVAL_DAYS = 3;

const DonationReminder = () => {
  const [visible, setVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!lastShown || now - parseInt(lastShown) > INTERVAL_DAYS * 86400000) {
      // Show after 30s so it doesn't interrupt initial experience
      const timer = setTimeout(() => setVisible(true), 30000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const openDonate = () => {
    dismiss();
    setDialogOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-6 right-6 z-50 glass-card p-4 max-w-xs border-border/30 shadow-lg"
          >
            <button onClick={dismiss} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3 pr-4">
              <Heart className="h-5 w-5 text-pink-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Enjoying TrendNova?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  If you find it helpful, consider supporting us with a small donation 💛
                </p>
                <Button variant="ghost" size="sm" className="mt-2 text-xs text-pink-400 hover:text-pink-300 p-0 h-auto" onClick={openDonate}>
                  Support Us →
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-card border-border/30">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-400" /> Support TrendNova
            </DialogTitle>
            <DialogDescription>
              Thank you for considering a donation! Send to:
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

export default DonationReminder;
