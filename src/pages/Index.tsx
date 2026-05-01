import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";
import AdBanner from "@/components/AdBanner";
import TrustBadges from "@/components/TrustBadges";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <TrustBadges />
    <Features />
    <Pricing />
    <Testimonials />
    <div className="max-w-7xl mx-auto px-4 py-6">
      <AdBanner slot="3456789012" format="horizontal" />
    </div>
    <Footer />
  </div>
);

export default Index;
