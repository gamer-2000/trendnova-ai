import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";
import AdBanner from "@/components/AdBanner";
import FestivalBanner from "@/components/FestivalBanner";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <FestivalBanner />
    <Hero />
    <div className="max-w-7xl mx-auto px-4 py-4">
      <AdBanner slot="1234567890" format="horizontal" />
    </div>
    <Features />
    <div className="max-w-7xl mx-auto px-4 py-4">
      <AdBanner slot="2345678901" format="horizontal" />
    </div>
    <Pricing />
    <Testimonials />
    <div className="max-w-7xl mx-auto px-4 py-4">
      <AdBanner slot="3456789012" format="horizontal" />
    </div>
    <Footer />
  </div>
);

export default Index;