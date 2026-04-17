import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const ADSTERRA_SRC =
  "https://pl29139443.profitablecpmratenetwork.com/0da7465b3493468241e537e90cfa76b7/invoke.js";
const CONTAINER_ID = "container-0da7465b3493468241e537e90cfa76b7";

const AdsterraBanner = () => {
  const { profile, loading } = useAuth();
  const isPremium = profile?.plan === "premium";

  useEffect(() => {
    if (loading) return;
    if (isPremium) return;

    if (document.querySelector(`script[src="${ADSTERRA_SRC}"]`)) return;

    const script = document.createElement("script");
    script.src = ADSTERRA_SRC;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);
  }, [isPremium, loading]);

  if (isPremium) return null;

  // Render at the bottom of the page in normal flow (not fixed/overlay)
  // so it never interrupts the user experience mid-content.
  return (
    <div className="w-full flex justify-center px-4 py-4 border-t border-border/20 bg-background">
      <div id={CONTAINER_ID} className="max-w-7xl w-full" />
    </div>
  );
};

export default AdsterraBanner;
