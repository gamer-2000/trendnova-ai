import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsOfService = () => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link to="/">
        <Button variant="ghost" size="sm" className="mb-8 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </Link>
      <h1 className="text-3xl font-display font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: March 29, 2026</p>

      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing or using TrendNova, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Service Description</h2>
          <p>TrendNova is an AI-powered content generation platform that helps creators produce titles, descriptions, tags, thumbnails, and other content for social media platforms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Accounts & Plans</h2>
          <p>Users may access limited features as guests (up to 3 generations). Registered users receive a Free plan with 10 daily generations. Pro and Premium plans offer additional features and higher limits. Plan upgrades are handled via email at aaru44968@gmail.com.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Acceptable Use</h2>
          <p>You agree not to misuse the service, attempt to bypass usage limits, reverse-engineer the platform, or use generated content for illegal purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Intellectual Property</h2>
          <p>Content generated through TrendNova is yours to use. However, the platform, its design, and underlying technology remain the property of TrendNova.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
          <p>TrendNova is provided "as is" without warranties. We are not liable for any damages arising from the use of AI-generated content or service interruptions.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms without prior notice.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use of TrendNova after changes constitutes acceptance of the new terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
          <p>For questions, contact us at <span className="text-primary">aaru44968@gmail.com</span>.</p>
        </section>
      </div>
    </div>
  </div>
);

export default TermsOfService;
