import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Platforms from "@/components/landing/Platforms";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Community from "@/components/landing/Community";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import Transparency from "@/components/Transparency";

const Index = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Navbar />
    <main>
      <Hero />
      <Platforms />
      <Stats />
      <Features />
      <HowItWorks />
      <Community />
      <Pricing />
      <Testimonials />
      <Transparency />
      <FAQ />
      <CTA />
    </main>
    <Footer />
  </div>
);

export default Index;
