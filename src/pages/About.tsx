import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Target, Users, Zap, Heart, Mail, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const values = [
  { icon: Target, title: "Human first", desc: "Content that reads like a person wrote it — not a language model." },
  { icon: Zap, title: "Ship fast", desc: "From idea to shippable draft in under a minute, every time." },
  { icon: Heart, title: "Fair pricing", desc: "No dark patterns, no auto-billing. Cancel with a single email." },
  { icon: Users, title: "Creator-led", desc: "Built with creators who ship every day, not for enterprise slide decks." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-10 gap-2 rounded-full">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Button>
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground mb-6">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> About TrendNova
        </div>

        <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-tight mb-6">
          Content creation, <span className="gradient-text-primary">democratized.</span>
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed mb-16 max-w-2xl">
          TrendNova is an AI workspace for creators, marketers, agencies, and brands. Our mission is to make
          world-class content creation available to everyone — regardless of budget, team size, or writing background.
        </p>

        <div className="glass-card p-8 sm:p-10 mb-16">
          <h2 className="font-display text-2xl font-semibold mb-4">Our story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              TrendNova started as a weekend tool to escape the blank-page problem. We were creators tired of
              spending hours on scripts, captions, and thumbnails when the ideas were already in our heads.
            </p>
            <p>
              Today it's a full AI workspace used by thousands of creators, agencies, and small businesses across
              16 content formats — from YouTube scripts and TikTok hooks to blog articles, product descriptions,
              and ad copy.
            </p>
            <p>
              We're a small independent team obsessed with two things: output that doesn't sound like a bot, and
              pricing that respects the people we serve.
            </p>
          </div>
        </div>

        <h2 className="font-display text-3xl font-semibold mb-8">What we stand for</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {values.map((v) => (
            <div key={v.title} className="glass-card p-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 sm:p-10 grid sm:grid-cols-2 gap-6">
          <a href="mailto:trendnova0001@gmail.com" className="flex items-start gap-4 group">
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-foreground group-hover:text-primary transition-colors">Email us</div>
              <div className="text-sm text-muted-foreground">trendnova0001@gmail.com</div>
            </div>
          </a>
          <a href="https://discord.gg/P36rMNgnZV" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
            <div className="w-11 h-11 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-center flex-shrink-0">
              <MessagesSquare className="h-5 w-5 text-[#a1a8ff]" />
            </div>
            <div>
              <div className="font-semibold text-foreground group-hover:text-primary transition-colors">Join Discord</div>
              <div className="text-sm text-muted-foreground">Support, updates, community</div>
            </div>
          </a>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default About;
