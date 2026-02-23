import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap, Brain, Users, Trophy, Target, BarChart3, Shield, Swords,
  ArrowRight, Star, TrendingUp, Activity, ChevronRight, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip
} from "recharts";

const stats = [
  { label: "Active Strategists", value: "12,400+", icon: Users },
  { label: "AI Models Trained", value: "94.2%", icon: Brain },
  { label: "Strategies Simulated", value: "2.4M+", icon: Target },
  { label: "Tournaments Hosted", value: "1,850+", icon: Trophy },
];

const features = [
  { icon: Brain, title: "AI-Powered Analytics", desc: "Deep learning models analyze player form, terrain impact, and synergy to give you a strategic edge." },
  { icon: Swords, title: "Strategy Arena", desc: "Compete in real-time strategy contests against other analysts. Earn XP, badges, and climb the ranks." },
  { icon: Users, title: "Smart Team Builder", desc: "Drag-and-drop team construction with live synergy scoring, budget tracking, and AI risk analysis." },
  { icon: BarChart3, title: "Cross-Sport Battles", desc: "Compare athletes across sports using our proprietary Dominance Index and Pressure Performance metrics." },
  { icon: Shield, title: "Terrain Intelligence", desc: "Venue-specific analytics including pitch behavior, weather impact, and historical performance data." },
  { icon: Activity, title: "Live Performance Graphs", desc: "Track strategy growth, team momentum, and consistency trends with beautiful real-time visualizations." },
];

const testimonials = [
  { name: "Arjun Mehta", role: "Cricket Analyst", text: "This platform transformed how I build squads. The AI suggestions are incredibly accurate.", rating: 5 },
  { name: "Sarah Chen", role: "Football Strategist", text: "The cross-sport comparison tool is unlike anything I've ever used. Absolute game-changer.", rating: 5 },
  { name: "Marcus Williams", role: "Multi-Sport Pro", text: "Strategy Arena contests keep me coming back daily. The competitive edge is addictive.", rating: 5 },
];

const growthData = [
  { month: "Jan", users: 4200, strategies: 12000 }, { month: "Feb", users: 5100, strategies: 18000 },
  { month: "Mar", users: 6300, strategies: 24000 }, { month: "Apr", users: 7800, strategies: 32000 },
  { month: "May", users: 9200, strategies: 41000 }, { month: "Jun", users: 10500, strategies: 52000 },
  { month: "Jul", users: 11800, strategies: 64000 }, { month: "Aug", users: 12400, strategies: 78000 },
];

const sportDistribution = [
  { name: "Cricket", value: 38, color: "hsl(75, 100%, 50%)" },
  { name: "Football", value: 28, color: "hsl(142, 70%, 45%)" },
  { name: "Hockey", value: 18, color: "hsl(180, 80%, 50%)" },
  { name: "Badminton", value: 16, color: "hsl(45, 90%, 55%)" },
];

const weeklyActivity = [
  { day: "Mon", contests: 85 }, { day: "Tue", contests: 92 },
  { day: "Wed", contests: 78 }, { day: "Thu", contests: 110 },
  { day: "Fri", contests: 125 }, { day: "Sat", contests: 140 },
  { day: "Sun", contests: 130 },
];

const heatmapData: number[][] = [
  [12, 18, 22, 30, 35, 45, 40],
  [20, 28, 35, 42, 50, 55, 48],
  [35, 45, 55, 60, 68, 72, 65],
  [50, 58, 65, 75, 82, 88, 80],
  [65, 72, 80, 90, 95, 98, 92],
  [55, 60, 70, 78, 85, 90, 82],
];
const heatmapHours = ["6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"];
const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getHeatColor = (v: number) => {
  if (v > 85) return "bg-primary/90";
  if (v > 70) return "bg-primary/60";
  if (v > 50) return "bg-primary/35";
  if (v > 30) return "bg-primary/20";
  return "bg-primary/8";
};

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
};

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden transition-colors duration-300">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/30 backdrop-blur-xl bg-background/60 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center neon-border">
              <Zap className="w-4 h-4 text-primary icon-glow" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">AI Sports League</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#insights" className="hover:text-foreground transition-colors">Insights</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => navigate("/dashboard")} className="bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(75_100%_50%/0.3)] text-xs h-9 px-4">
              Launch Dashboard <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, hsl(75 100% 50%), transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, hsl(142 70% 45%), transparent 70%)" }} />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-primary font-medium">AI-Powered Sports Intelligence Platform</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6">
            From Emotional Debate to{" "}<span className="neon-text">Intelligent Strategy.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Build smarter teams. Analyze deeper. Compete with intelligence. The world's most advanced AI sports strategy simulation platform.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => navigate("/dashboard")} size="lg"
              className="bg-primary text-primary-foreground text-sm h-12 px-8 hover:shadow-[0_0_40px_hsl(75_100%_50%/0.4)] transition-shadow">
              Enter the Arena <Swords className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-border/50 text-foreground text-sm h-12 px-8 hover:bg-secondary/50">
              Watch Demo <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 px-6 border-y border-border/20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <AnimatedSection key={s.label}>
              <motion.div whileHover={{ y: -6, boxShadow: "0 0 30px -8px hsl(75 100% 50% / 0.2)" }} transition={{ type: "spring", stiffness: 300 }}
                className="glass-card p-6 text-center cursor-default">
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
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">Advanced tools built for serious sports strategists who rely on data, not luck.</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <AnimatedSection key={f.title}>
                <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}
                  className="glass-card p-6 h-full group cursor-default hover:shadow-[0_0_50px_-10px_hsl(75_100%_50%/0.15)] transition-shadow duration-300">
                  <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}
                    className="kpi-icon-bg mb-4 group-hover:shadow-[0_0_25px_hsl(75_100%_50%/0.25)] transition-shadow">
                    <f.icon className="w-5 h-5 text-primary" />
                  </motion.div>
                  <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Data Insights & Charts */}
      <section id="insights" className="py-24 px-6 border-t border-border/20">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Platform <span className="neon-text">Insights</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">Real-time data powering the next generation of sports strategy intelligence.</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Growth Chart */}
            <AnimatedSection>
              <motion.div whileHover={{ y: -4 }} className="glass-card p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary icon-glow" />
                  <h3 className="text-sm font-semibold text-foreground">Platform Growth</h3>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="landingGrad1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(75, 100%, 50%)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(75, 100%, 50%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="landingGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(180, 80%, 50%)" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="hsl(180, 80%, 50%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(120, 5%, 55%)", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(120, 5%, 55%)", fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "hsl(120, 8%, 8%)", border: "1px solid hsl(120, 6%, 16%)", borderRadius: 8, fontSize: 11, color: "hsl(60, 10%, 95%)" }} />
                      <Area type="monotone" dataKey="users" stroke="hsl(75, 100%, 50%)" strokeWidth={2} fill="url(#landingGrad1)" name="Users" />
                      <Area type="monotone" dataKey="strategies" stroke="hsl(180, 80%, 50%)" strokeWidth={1.5} fill="url(#landingGrad2)" name="Strategies" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-3">
                  <span className="text-[10px] flex items-center gap-1.5 text-muted-foreground"><span className="w-2 h-2 rounded-full bg-primary" />Users</span>
                  <span className="text-[10px] flex items-center gap-1.5 text-muted-foreground"><span className="w-2 h-2 rounded-full bg-neon-cyan" />Strategies</span>
                </div>
              </motion.div>
            </AnimatedSection>

            {/* Sport Distribution + Weekly */}
            <div className="grid grid-rows-2 gap-6">
              <AnimatedSection>
                <motion.div whileHover={{ y: -4 }} className="glass-card p-6 flex items-center gap-6">
                  <div className="relative w-36 h-36 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={sportDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" strokeWidth={0}>
                          {sportDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-lg font-bold neon-text">4</p>
                      <p className="text-[8px] text-muted-foreground">Sports</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Sport Distribution</h3>
                    <div className="space-y-2">
                      {sportDistribution.map(s => (
                        <div key={s.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="text-[11px] text-muted-foreground">{s.name}</span>
                          </div>
                          <span className="text-[11px] font-semibold text-foreground">{s.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>

              <AnimatedSection>
                <motion.div whileHover={{ y: -4 }} className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Weekly Contest Activity</h3>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyActivity}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(120, 5%, 55%)", fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: "hsl(120, 8%, 8%)", border: "1px solid hsl(120, 6%, 16%)", borderRadius: 8, fontSize: 11, color: "hsl(60, 10%, 95%)" }} />
                        <Bar dataKey="contests" fill="hsl(75, 100%, 50%)" radius={[4, 4, 0, 0]} opacity={0.8} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </AnimatedSection>
            </div>
          </div>

          {/* Heatmap */}
          <AnimatedSection>
            <motion.div whileHover={{ y: -4 }} className="glass-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-4 h-4 text-primary icon-glow" />
                <h3 className="text-sm font-semibold text-foreground">User Activity Heatmap</h3>
                <span className="text-[10px] text-muted-foreground ml-auto">Peak hours across the week</span>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[500px]">
                  <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-1.5 mb-1.5">
                    <div />
                    {heatmapDays.map(d => (
                      <div key={d} className="text-center text-[10px] text-muted-foreground font-medium">{d}</div>
                    ))}
                  </div>
                  {heatmapData.map((row, ri) => (
                    <div key={ri} className="grid grid-cols-[60px_repeat(7,1fr)] gap-1.5 mb-1.5">
                      <div className="text-[10px] text-muted-foreground flex items-center">{heatmapHours[ri]}</div>
                      {row.map((val, ci) => (
                        <motion.div
                          key={ci}
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: (ri * 7 + ci) * 0.015, duration: 0.3 }}
                          whileHover={{ scale: 1.15, zIndex: 10 }}
                          className={`h-9 rounded-lg ${getHeatColor(val)} cursor-default flex items-center justify-center transition-colors`}
                          title={`${heatmapDays[ci]} ${heatmapHours[ri]}: ${val}% activity`}
                        >
                          <span className="text-[9px] font-semibold text-foreground opacity-70">{val}</span>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <span className="text-[9px] text-muted-foreground">Low</span>
                    {["bg-primary/8", "bg-primary/20", "bg-primary/35", "bg-primary/60", "bg-primary/90"].map((c, i) => (
                      <div key={i} className={`w-5 h-3 rounded ${c}`} />
                    ))}
                    <span className="text-[9px] text-muted-foreground">High</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
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
            {testimonials.map((t) => (
              <AnimatedSection key={t.name}>
                <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}
                  className="glass-card p-6 cursor-default hover:shadow-[0_0_40px_-10px_hsl(75_100%_50%/0.12)] transition-shadow">
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
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <AnimatedSection>
          <motion.div whileHover={{ scale: 1.01 }} className="max-w-4xl mx-auto text-center glass-card-glow p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, hsl(75 100% 50%), transparent 70%)" }} />
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-4 relative">
              Ready to Build Your <span className="neon-text">Empire?</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto relative">Join thousands of AI-powered strategists dominating the sports analytics arena.</p>
            <Button onClick={() => navigate("/dashboard")} size="lg"
              className="bg-primary text-primary-foreground text-sm h-12 px-10 hover:shadow-[0_0_40px_hsl(75_100%_50%/0.4)] transition-shadow relative">
              Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
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
