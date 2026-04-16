import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdBanner = ({ slot, format = "auto", className = "" }: AdBannerProps) => {
  const { profile } = useAuth();
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  // Hide ads for premium users
  if (profile?.plan === "premium") return null;

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      console.log("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`ad-container overflow-hidden ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2106219445008712"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
