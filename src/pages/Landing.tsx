import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap, Brain, Users, Trophy, Target, BarChart3, Shield, Swords,
  ArrowRight, Star, TrendingUp, Activity, ChevronRight, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Active Strategists", value: "12,400+", icon: Users },
  { label: "AI Models Trained", value: "94.2%", icon: Brain },
  { label: "Strategies Simulated", value: "2.4M+", icon: Target },
  { label: "Tournaments Hosted", value: "1,850+", icon: Trophy },
];

const features = [
  {
    icon: Brain, title: "AI-Powered Analytics",
    desc: "Deep learning models analyze player form, terrain impact, and synergy to give you a strategic edge.",
  },
  {
    icon: Swords, title: "Strategy Arena",
    desc: "Compete in real-time strategy contests against other analysts. Earn XP, badges, and climb the ranks.",
  },
  {
    icon: Users, title: "Smart Team Builder",
    desc: "Drag-and-drop team construction with live synergy scoring, budget tracking, and AI risk analysis.",
  },
  {
    icon: BarChart3, title: "Cross-Sport Battles",
    desc: "Compare athletes across sports using our proprietary Dominance Index and Pressure Performance metrics.",
  },
  {
    icon: Shield, title: "Terrain Intelligence",
    desc: "Venue-specific analytics including pitch behavior, weather impact, and historical performance data.",
  },
  {
    icon: Activity, title: "Live Performance Graphs",
    desc: "Track strategy growth, team momentum, and consistency trends with beautiful real-time visualizations.",
  },
];

const testimonials = [
  { name: "Arjun Mehta", role: "Cricket Analyst", text: "This platform transformed how I build squads. The AI suggestions are incredibly accurate.", rating: 5 },
  { name: "Sarah Chen", role: "Football Strategist", text: "The cross-sport comparison tool is unlike anything I've ever used. Absolute game-changer.", rating: 5 },
  { name: "Marcus Williams", role: "Multi-Sport Pro", text: "Strategy Arena contests keep me coming back daily. The competitive edge is addictive.", rating: 5 },
];

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/30 backdrop-blur-xl bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center neon-border">
              <Zap className="w-4 h-4 text-primary icon-glow" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">AI Sports League</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Stats</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
          </div>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(75_100%_50%/0.3)] text-xs h-9 px-4"
          >
            Launch Dashboard <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, hsl(75 100% 50%), transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsl(142 70% 45%), transparent 70%)" }} />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-primary font-medium">AI-Powered Sports Intelligence Platform</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6"
          >
            From Emotional Debate to{" "}
            <span className="neon-text">Intelligent Strategy.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Build smarter teams. Analyze deeper. Compete with intelligence.
            The world's most advanced AI sports strategy simulation platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => navigate("/dashboard")}
              size="lg"
              className="bg-primary text-primary-foreground text-sm h-12 px-8 hover:shadow-[0_0_40px_hsl(75_100%_50%/0.4)] transition-shadow"
            >
              Enter the Arena <Swords className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border/50 text-foreground text-sm h-12 px-8 hover:bg-secondary/50"
            >
              Watch Demo <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 px-6 border-y border-border/20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <AnimatedSection key={s.label}>
              <motion.div
                whileHover={{ y: -4 }}
                className="glass-card p-6 text-center"
              >
                <s.icon className="w-6 h-6 text-primary mx-auto mb-3 icon-glow" />
                <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Everything You Need to <span className="neon-text">Dominate</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Advanced tools built for serious sports strategists who rely on data, not luck.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <AnimatedSection key={f.title}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 0 40px -10px hsl(75 100% 50% / 0.15)" }}
                  className="glass-card p-6 h-full group cursor-default"
                >
                  <div className="kpi-icon-bg mb-4 group-hover:shadow-[0_0_20px_hsl(75_100%_50%/0.2)] transition-shadow">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 border-t border-border/20">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Trusted by <span className="neon-text">Strategists</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name}>
                <div className="glass-card p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">"{t.text}"</p>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center glass-card-glow p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, hsl(75 100% 50%), transparent 70%)" }} />
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-4 relative">
              Ready to Build Your <span className="neon-text">Empire?</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto relative">
              Join thousands of AI-powered strategists dominating the sports analytics arena.
            </p>
            <Button
              onClick={() => navigate("/dashboard")}
              size="lg"
              className="bg-primary text-primary-foreground text-sm h-12 px-10 hover:shadow-[0_0_40px_hsl(75_100%_50%/0.4)] transition-shadow relative"
            >
              Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">AI Sports Strategy League © 2026</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
