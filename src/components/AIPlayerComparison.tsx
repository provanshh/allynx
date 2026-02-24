import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Plus, X, Zap, ScanLine, Trophy, Shield, Target, Heart, Crown, Star, Swords, Dumbbell, TrendingUp, Eye, Wind, Flame, Activity, Users, Award, Sparkles, BarChart3, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const PLAYER_COLORS = ["hsl(75, 100%, 50%)", "hsl(180, 80%, 50%)", "hsl(280, 80%, 60%)", "hsl(30, 90%, 55%)"];

interface PlayerData {
  name: string;
  sport: string;
  role: string;
  nationality: string;
  age: number;
  careerYears: string;
  coreStats: Record<string, number>;
  skillBreakdown: Record<string, number>;
  careerHighlights: {
    totalMatches: number;
    wins: number;
    winRate: number;
    trophies: number;
    personalAwards: number;
    peakRating: number;
    currentForm: number;
  };
  seasonPerformance: { year: string; rating: number }[];
  strengths: string[];
  weaknesses: string[];
  overallScore: number;
  sportSpecificStats: Record<string, string>;
}

interface ComparisonResult {
  players: PlayerData[];
  categoryWinners: Record<string, string>;
  verdict: string;
  headToHead: string;
  funFact: string;
}

const coreStatIcons: Record<string, typeof Brain> = {
  attack: Target, defense: Shield, consistency: Star, pressure: Zap,
  fitness: Heart, leadership: Crown, experience: Trophy, technique: Swords,
};

const skillIcons: Record<string, typeof Brain> = {
  speed: Wind, agility: Activity, power: Flame, accuracy: Target,
  vision: Eye, stamina: Heart, mentalToughness: Brain, clutchFactor: Zap,
  adaptability: TrendingUp, teamwork: Users,
};

const AIPlayerComparison = () => {
  const [names, setNames] = useState<string[]>(["", ""]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const addSlot = () => { if (names.length < 4) setNames([...names, ""]); };
  const removeSlot = (i: number) => { if (names.length > 2) setNames(names.filter((_, idx) => idx !== i)); setResult(null); };
  const updateName = (i: number, v: string) => { const n = [...names]; n[i] = v; setNames(n); setResult(null); };

  const canCompare = names.filter(n => n.trim().length >= 2).length >= 2;

  const runComparison = async () => {
    if (!canCompare) return;
    setScanning(true);
    setScanProgress(0);
    setResult(null);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      if (progress > 90) { clearInterval(interval); return; }
      setScanProgress(progress);
    }, 60);

    try {
      const { data, error } = await supabase.functions.invoke("compare-players", {
        body: { players: names.filter(n => n.trim().length >= 2) },
      });

      clearInterval(interval);
      if (error) { toast.error("Comparison failed. Please try again."); setScanning(false); return; }

      setScanProgress(100);
      await new Promise(r => setTimeout(r, 400));
      setResult(data as ComparisonResult);
    } catch (e) {
      clearInterval(interval);
      toast.error("Something went wrong. Try again.");
      console.error(e);
    } finally {
      setScanning(false);
    }
  };

  // Build radar data from coreStats
  const radarData = result ? Object.keys(result.players[0]?.coreStats || {}).map(key => {
    const entry: Record<string, string | number> = { attr: key.charAt(0).toUpperCase() + key.slice(1) };
    result.players.forEach((p, i) => { entry[`P${i}`] = p.coreStats[key] || 0; });
    return entry;
  }) : [];

  // Build season chart data
  const seasonData = result ? (() => {
    const allYears = new Set<string>();
    result.players.forEach(p => p.seasonPerformance?.forEach(s => allYears.add(s.year)));
    return Array.from(allYears).sort().map(year => {
      const entry: Record<string, string | number> = { year };
      result.players.forEach((p, i) => {
        const found = p.seasonPerformance?.find(s => s.year === year);
        entry[`P${i}`] = found?.rating || 0;
      });
      return entry;
    });
  })() : [];

  const getStatMax = (stats: Record<string, number>[], key: string) => Math.max(...stats.map(s => s[key] || 0));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 mt-6">
      <div className="flex items-center gap-2 mb-5">
        <Brain className="w-5 h-5 text-primary icon-glow" />
        <h2 className="text-lg font-display font-bold text-foreground">AI Player Comparison</h2>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold ml-1">Powered by Gemini</span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Enter any real player names from any sport — AI will compare them across all metrics, skills, career stats, form, and give a final verdict.</p>

      {/* Name Inputs */}
      <div className="flex flex-wrap gap-3 mb-4">
        {names.map((name, i) => (
          <div key={i} className="flex-1 min-w-[160px] relative">
            <Input value={name} onChange={e => updateName(i, e.target.value)} placeholder={`Player ${i + 1} name...`}
              className="text-sm h-10 bg-secondary/50 border-border/30 pr-8" onKeyDown={e => e.key === "Enter" && runComparison()} />
            {names.length > 2 && (
              <button onClick={() => removeSlot(i)} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        {names.length < 4 && (
          <button onClick={addSlot} className="flex items-center justify-center w-10 h-10 rounded-xl border border-dashed border-border/30 hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      <Button onClick={runComparison} disabled={!canCompare || scanning} className="w-full mb-5 bg-primary text-primary-foreground h-10 text-sm font-semibold hover:shadow-[0_0_30px_hsl(75_100%_50%/0.3)] transition-shadow disabled:opacity-40">
        <Brain className="w-4 h-4 mr-2" />
        {scanning ? "AI Analyzing..." : "Compare with AI"}
      </Button>

      {/* Scanning Animation */}
      <AnimatePresence>
        {scanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-5 space-y-3">
            <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: `${scanProgress}%` }} />
              <motion.div className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-primary/40 to-transparent" animate={{ x: ["-80px", "400px"] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} />
            </div>
            <div className="flex items-center justify-center gap-2 py-4">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Zap className="w-5 h-5 text-primary" />
              </motion.div>
              <p className="text-xs text-muted-foreground font-medium">
                Gemini AI scanning player databases... <span className="text-primary font-bold">{scanProgress}%</span>
              </p>
            </div>
            {names.filter(n => n.trim()).map((name, i) => (
              <motion.div key={name + i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: [0.3, 1, 0.3], x: 0 }} transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }} className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                <ScanLine className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-xs text-foreground font-medium">{name}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== RESULTS ===== */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

            {/* ── Player Profile Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.players.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-secondary/30 border border-border/30 relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-2xl font-black" style={{ color: PLAYER_COLORS[i], opacity: 0.15 }}>
                    #{i + 1}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2" style={{ borderColor: PLAYER_COLORS[i], color: PLAYER_COLORS[i], backgroundColor: `${PLAYER_COLORS[i]}15` }}>
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.sport} • {p.role} • {p.nationality}</p>
                      <p className="text-[10px] text-muted-foreground">Age {p.age} • {p.careerYears}</p>
                    </div>
                  </div>
                  {/* Overall Score Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: `${PLAYER_COLORS[i]}15` }}>
                      <Gauge className="w-3 h-3" style={{ color: PLAYER_COLORS[i] }} />
                      <span className="text-lg font-black" style={{ color: PLAYER_COLORS[i] }}>{p.overallScore}</span>
                      <span className="text-[9px] text-muted-foreground">/100</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground font-medium">OVERALL</span>
                  </div>
                  {/* Career Highlights */}
                  {p.careerHighlights && (
                    <div className="grid grid-cols-4 gap-1 mb-3">
                      {[
                        { l: "Matches", v: p.careerHighlights.totalMatches },
                        { l: "Win%", v: `${p.careerHighlights.winRate}%` },
                        { l: "Trophies", v: p.careerHighlights.trophies },
                        { l: "Awards", v: p.careerHighlights.personalAwards },
                      ].map(item => (
                        <div key={item.l} className="text-center p-1.5 rounded-lg bg-background/50">
                          <p className="text-xs font-bold text-foreground">{item.v}</p>
                          <p className="text-[8px] text-muted-foreground">{item.l}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Sport Specific Stats */}
                  {p.sportSpecificStats && (
                    <div className="grid grid-cols-2 gap-1 mb-3">
                      {Object.entries(p.sportSpecificStats).map(([label, value]) => (
                        <div key={label} className="flex justify-between px-2 py-1 rounded bg-background/30 text-[10px]">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="text-foreground font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {p.strengths?.map(s => <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{s}</span>)}
                    {p.weaknesses?.map(w => <span key={w} className="text-[9px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">{w}</span>)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Radar Chart: Core Stats ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="p-5 rounded-xl bg-secondary/20 border border-border/20">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Core Stats Radar</span>
              </div>
              <div className="flex flex-wrap gap-4 mb-2">
                {result.players.map((p, i) => (
                  <span key={p.name} className="text-[10px] flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: PLAYER_COLORS[i] }} />{p.name}</span>
                ))}
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="attr" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    {result.players.map((_, i) => (
                      <Radar key={i} dataKey={`P${i}`} stroke={PLAYER_COLORS[i]} fill={PLAYER_COLORS[i]} fillOpacity={0.08 + i * 0.03} strokeWidth={2} />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* ── Core Stat Bars ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="p-5 rounded-xl bg-secondary/20 border border-border/20">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Core Stats Breakdown</span>
              </div>
              <div className="space-y-3">
                {Object.keys(result.players[0]?.coreStats || {}).map((key) => {
                  const Icon = coreStatIcons[key] || Brain;
                  const max = getStatMax(result.players.map(p => p.coreStats), key);
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold capitalize">
                        <Icon className="w-3 h-3 text-primary" />{key}
                        {result.categoryWinners?.[key] && <span className="ml-auto text-[9px] text-primary">👑 {result.categoryWinners[key]}</span>}
                      </div>
                      {result.players.map((p, i) => {
                        const val = p.coreStats[key] || 0;
                        const pct = max > 0 ? (val / max) * 100 : 0;
                        const isMax = val === max;
                        return (
                          <div key={p.name} className="flex items-center gap-2">
                            <span className="text-[10px] text-foreground font-medium w-24 truncate">{p.name}</span>
                            <div className="flex-1 h-4 bg-secondary/50 rounded-full overflow-hidden relative">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.08 }}
                                className="h-full rounded-full" style={{ backgroundColor: isMax ? PLAYER_COLORS[i] : `${PLAYER_COLORS[i]}40`, boxShadow: isMax ? `0 0 10px ${PLAYER_COLORS[i]}60` : "none" }} />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-foreground">{val}</span>
                            </div>
                            {isMax && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[9px] font-bold text-primary">BEST</motion.span>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* ── Skill Breakdown Bars ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="p-5 rounded-xl bg-secondary/20 border border-border/20">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Skill Breakdown</span>
              </div>
              <div className="space-y-3">
                {Object.keys(result.players[0]?.skillBreakdown || {}).map((key) => {
                  const Icon = skillIcons[key] || Brain;
                  const max = getStatMax(result.players.map(p => p.skillBreakdown), key);
                  const label = key.replace(/([A-Z])/g, " $1").trim();
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold capitalize">
                        <Icon className="w-3 h-3 text-primary" />{label}
                      </div>
                      {result.players.map((p, i) => {
                        const val = p.skillBreakdown?.[key] || 0;
                        const pct = max > 0 ? (val / max) * 100 : 0;
                        const isMax = val === max;
                        return (
                          <div key={p.name} className="flex items-center gap-2">
                            <span className="text-[10px] text-foreground font-medium w-24 truncate">{p.name}</span>
                            <div className="flex-1 h-4 bg-secondary/50 rounded-full overflow-hidden relative">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.08 }}
                                className="h-full rounded-full" style={{ backgroundColor: isMax ? PLAYER_COLORS[i] : `${PLAYER_COLORS[i]}40`, boxShadow: isMax ? `0 0 10px ${PLAYER_COLORS[i]}60` : "none" }} />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-foreground">{val}</span>
                            </div>
                            {isMax && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[9px] font-bold text-primary">BEST</motion.span>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* ── Season Performance Graph ── */}
            {seasonData.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="p-5 rounded-xl bg-secondary/20 border border-border/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Season-by-Season Performance</span>
                </div>
                <div className="flex flex-wrap gap-4 mb-2">
                  {result.players.map((p, i) => (
                    <span key={p.name} className="text-[10px] flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: PLAYER_COLORS[i] }} />{p.name}</span>
                  ))}
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={seasonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <YAxis domain={[50, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                      {result.players.map((_, i) => (
                        <Line key={i} type="monotone" dataKey={`P${i}`} stroke={PLAYER_COLORS[i]} strokeWidth={2} dot={{ fill: PLAYER_COLORS[i], r: 3 }} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* ── Category Winners ── */}
            {result.categoryWinners && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="p-5 rounded-xl bg-secondary/20 border border-border/20">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Category Winners</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {Object.entries(result.categoryWinners).map(([cat, winner]) => (
                    <div key={cat} className="text-center p-2 rounded-lg bg-background/50 border border-border/20">
                      <p className="text-[9px] text-muted-foreground capitalize mb-1">{cat.replace(/([A-Z])/g, " $1").trim()}</p>
                      <p className="text-[10px] font-bold text-primary truncate">👑 {winner}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Final Verdict Scores ── */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="p-6 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-5 h-5 text-primary icon-glow" />
                <span className="text-sm font-bold text-foreground">Final Verdict</span>
              </div>

              {/* Score Circles */}
              <div className="flex justify-center gap-8 mb-5">
                {result.players.map((p, i) => {
                  const best = Math.max(...result.players.map(pl => pl.overallScore));
                  const isBest = p.overallScore === best;
                  return (
                    <motion.div key={p.name} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.15, type: "spring" }}
                      className="flex flex-col items-center gap-2">
                      <div className="relative w-20 h-20">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
                          <motion.circle cx="40" cy="40" r="34" fill="none" stroke={PLAYER_COLORS[i]} strokeWidth="6"
                            strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 34}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - p.overallScore / 100) }}
                            transition={{ duration: 1.5, delay: 0.7 + i * 0.15 }}
                            style={{ filter: isBest ? `drop-shadow(0 0 6px ${PLAYER_COLORS[i]})` : "none" }} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-black" style={{ color: PLAYER_COLORS[i] }}>{p.overallScore}</span>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-foreground text-center">{p.name}</p>
                      {isBest && <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">🏆 WINNER</span>}
                    </motion.div>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-2">{result.verdict}</p>
              <p className="text-xs text-foreground font-medium mb-2">{result.headToHead}</p>
              {result.funFact && (
                <p className="text-[10px] text-primary/80 italic mt-2">💡 {result.funFact}</p>
              )}
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIPlayerComparison;
