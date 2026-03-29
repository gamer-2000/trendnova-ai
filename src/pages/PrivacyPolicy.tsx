import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link to="/">
        <Button variant="ghost" size="sm" className="mb-8 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </Link>
      <h1 className="text-3xl font-display font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: March 29, 2026</p>

      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
          <p>We collect information you provide directly, including your email address and account credentials when you sign up. We also collect usage data such as content generation history and feature interactions.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>We use your information to provide and improve TrendNova's services, process your requests, send important updates, and maintain account security.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Data Storage & Security</h2>
          <p>Your data is stored securely using industry-standard encryption. We use Lovable Cloud for backend infrastructure, ensuring your data is protected with enterprise-grade security measures.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Third-Party Services</h2>
          <p>We use third-party services including Google AdSense for advertising and AI providers for content generation. These services may collect anonymized usage data as described in their respective privacy policies.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
          <p>We use cookies and local storage to maintain your session, remember preferences (such as "Remember Me"), and serve relevant advertisements.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at aaru44968@gmail.com.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Contact</h2>
          <p>For questions about this Privacy Policy, contact us at <span className="text-primary">aaru44968@gmail.com</span>.</p>
        </section>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
