import { motion } from "framer-motion";
import { MessagesSquare, ArrowRight, Users, Rocket, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const perks = [
  { icon: Bell, title: "Early updates", desc: "See what's shipping next before anyone else." },
  { icon: Rocket, title: "Request features", desc: "Vote on the roadmap and pitch what to build." },
  { icon: Users, title: "Real creators", desc: "Swap workflows with people actually shipping." },
];

const Community = () => (
  <section className="section-padding relative">
    <div className="max-w-7xl mx-auto">
      <div className="relative glass-card overflow-hidden p-8 sm:p-12 lg:p-16 noise">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#5865F2]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5865F2]/40 bg-[#5865F2]/10 px-3 py-1 text-xs text-[#a1a8ff] mb-5">
              <MessagesSquare className="h-3.5 w-3.5" /> Community
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
              Join the <span className="gradient-text-primary">TrendNova</span> community
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Get support, early feature access, roadmap updates, and connect with other creators shipping
              real content — all inside our Discord.
            </p>

            <div className="space-y-3 mb-8">
              {perks.map((p) => (
                <div key={p.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary/60 border border-border/40 flex items-center justify-center flex-shrink-0">
                    <p.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <a href="https://discord.gg/P36rMNgnZV" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full h-12 px-6 bg-[#5865F2] hover:bg-[#4752C4] text-white gap-2">
                <MessagesSquare className="h-4 w-4" /> Join Discord <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </motion.div>

          {/* Discord UI mock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-[20px] bg-[#2b2d31] border border-white/5 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-[80px_1fr]">
                <div className="bg-[#1e1f22] p-3 space-y-3 flex flex-col items-center">
                  <div className="w-11 h-11 rounded-2xl bg-[#5865F2] flex items-center justify-center text-white font-bold">TN</div>
                  {["#", "#", "#"].map((_, i) => (
                    <div key={i} className="w-11 h-11 rounded-full bg-white/5" />
                  ))}
                </div>
                <div className="p-4">
                  <div className="text-white/60 text-[10px] uppercase tracking-widest mb-2">Text Channels</div>
                  {["announcements", "general", "showcase", "feature-requests", "support"].map((c, i) => (
                    <div
                      key={c}
                      className={`text-sm px-2 py-1.5 rounded-md ${i === 1 ? "bg-white/10 text-white" : "text-white/50"}`}
                    >
                      # {c}
                    </div>
                  ))}
                  <div className="mt-4 space-y-3">
                    {[
                      { u: "priya", c: "Just shipped 4 reels using TrendNova — engagement 3x'd 🔥" },
                      { u: "arjun_m", c: "The new thumbnail prompts slap. Anyone tried the ad copy yet?" },
                      { u: "team", c: "Video generation is live for Premium — try it out!" },
                    ].map((m, i) => (
                      <div key={i} className="flex gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0" />
                        <div>
                          <div className="text-xs text-white font-semibold">{m.u}</div>
                          <div className="text-xs text-white/70">{m.c}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

export default Community;
