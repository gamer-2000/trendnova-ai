import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AntiAdBlock = () => {
  const { profile } = useAuth();
  const [adBlocked, setAdBlocked] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Skip detection for premium users
    if (profile?.plan === "premium") return;

    const detectAdBlock = async () => {
      try {
        await fetch(
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
          { method: "HEAD", mode: "no-cors" }
        );
        setAdBlocked(false);
      } catch {
        setAdBlocked(true);
      }
    };

    setTimeout(() => {
      const testAd = document.createElement("div");
      testAd.innerHTML = "&nbsp;";
      testAd.className = "adsbox ad-banner textads banner-ads";
      testAd.style.position = "absolute";
      testAd.style.left = "-9999px";
      document.body.appendChild(testAd);

      setTimeout(() => {
        if (testAd.offsetHeight === 0 || testAd.clientHeight === 0) {
          setAdBlocked(true);
        }
        document.body.removeChild(testAd);
      }, 100);
    }, 1000);

    detectAdBlock();
  }, [profile?.plan]);

  if (profile?.plan === "premium" || !adBlocked || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md mx-4 shadow-2xl text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Ad Blocker Detected
        </h2>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          We rely on ads to keep TrendNova free. Please consider disabling your
          ad blocker to support us — we promise our ads aren't annoying.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            I've Disabled It — Reload
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="w-full py-2.5 px-4 rounded-lg border border-border text-muted-foreground font-medium text-sm hover:bg-secondary transition-colors"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default AntiAdBlock;
