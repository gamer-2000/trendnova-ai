import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "trendnova_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto glass-card border border-border/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-foreground font-medium mb-1">🍪 Cookie Notice</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We use cookies and similar technologies to improve your experience, serve personalized ads via Google AdSense, and analyze traffic. 
            By clicking "Accept", you consent to our use of cookies. See our{" "}
            <a href="/privacy" className="text-primary underline">Privacy Policy</a> for details.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={decline} className="text-xs">
            Decline
          </Button>
          <Button size="sm" onClick={accept} className="text-xs">
            Accept
          </Button>
        </div>
        <button onClick={decline} className="absolute top-2 right-2 sm:hidden text-muted-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
