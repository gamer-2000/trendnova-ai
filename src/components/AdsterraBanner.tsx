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

    // Avoid double injection
    if (document.querySelector(`script[src="${ADSTERRA_SRC}"]`)) return;

    const script = document.createElement("script");
    script.src = ADSTERRA_SRC;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);
  }, [isPremium, loading]);

  if (isPremium) return null;
  return <div id={CONTAINER_ID} />;
};

export default AdsterraBanner;
