import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Mail, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link to="/">
        <Button variant="ghost" size="sm" className="mb-8 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-display font-bold">About TrendNova</h1>
      </div>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <p className="text-lg">
            TrendNova is an AI-powered content generation platform designed for creators, marketers, and businesses. 
            We help you create viral-ready content for YouTube, TikTok, Instagram, blogs, and more — in seconds.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" /> Our Mission
          </h2>
          <p>
            We believe every creator deserves access to powerful AI tools. Our mission is to democratize content creation 
            by providing an intuitive, affordable platform that transforms ideas into engaging, trend-optimized content. 
            Whether you're a solo YouTuber or a growing brand, TrendNova helps you stay ahead of the curve.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> What We Offer
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>AI-generated YouTube titles, descriptions, tags, and scripts</li>
            <li>TikTok video ideas and captions</li>
            <li>Blog post outlines and full articles</li>
            <li>Instagram captions and hashtag suggestions</li>
            <li>Custom thumbnail generation (Pro & Premium)</li>
            <li>Tweet and thread generation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" /> Contact Us
          </h2>
          <p>
            Have questions, feedback, or partnership inquiries? We'd love to hear from you.
          </p>
          <div className="glass-card p-4 mt-3 rounded-lg">
            <p className="text-foreground font-semibold">Email: <span className="text-primary select-all">aaru44968@gmail.com</span></p>
          </div>
          <p className="text-sm mt-3">
            We typically respond within 24–48 hours. For urgent matters, please include "URGENT" in your subject line.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default About;
