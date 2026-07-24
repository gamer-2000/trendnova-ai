import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Is TrendNova really free to start?", a: "Yes. The Free plan gives you 2 YouTube script generations per day with no credit card required. Upgrade only when you need more." },
  { q: "What kind of content can I generate?", a: "Scripts, captions, blog posts, ads, emails, hashtags, thumbnail prompts, video ideas, product descriptions, and more — 16 formats across every major platform." },
  { q: "Does the content sound AI-generated?", a: "No. TrendNova is tuned to sound human, avoiding common AI clichés. You control tone, length, and audience for every piece." },
  { q: "Do I own what I create?", a: "100%. Everything you generate is yours to use commercially — no attribution needed." },
  { q: "How is Discord used?", a: "Discord is our community hub for support, announcements, feature requests, and connecting with other creators. It's not a content platform." },
  { q: "Can I cancel anytime?", a: "Yes. There are no contracts. Upgrades are handled manually via email so you're never auto-charged." },
];

const FAQ = () => (
  <section className="section-padding">
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground mb-5">
          FAQ
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
          Questions, <span className="gradient-text-primary">answered</span>
        </h2>
      </motion.div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem
            key={f.q}
            value={`item-${i}`}
            className="glass-card border-border/40 px-5 data-[state=open]:border-primary/40 transition-colors"
          >
            <AccordionTrigger className="text-left text-foreground hover:no-underline font-medium">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQ;
