import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Plus, X, Zap, ScanLine, Trophy, Shield, Target, Heart, Crown, Star, Swords, Dumbbell, TrendingUp, Eye, Wind, Flame, Activity, Users, Award, Sparkles, BarChart3, Gauge, RotateCcw } from "lucide-react";
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
  careerHighlights: { totalMatches: number; wins: number; winRate: number; trophies: number; personalAwards: number; peakRating: number; currentForm: number };
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

const DashboardAICompare = () => {
  const [names, setNames] = useState<string[]>(["", ""]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const addSlot = () => { if (names.length < 4) setNames([...names, ""]); };
  const removeSlot = (i: number) => { if (names.length > 2) setNames(names.filter((_, idx) => idx !== i)); setResult(null); };
  const updateName = (i: number, v: string) => { const n = [...names]; n[i] = v; setNames(n); };

  const canCompare = names.filter(n => n.trim().length >= 2).length >= 2;

  const reset = () => { setNames(["", ""]); setResult(null); setScanProgress(0); };

  const runComparison = async () => {
    if (!canCompare) return;
    setScanning(true); setScanProgress(0); setResult(null);
    let progress = 0;
    const interval = setInterval(() => { progress += 1; if (progress > 90) { clearInterval(interval); return; } setScanProgress(progress); }, 60);
    try {
      const { data, error } = await supabase.functions.invoke("compare-players", { body: { players: names.filter(n => n.trim().length >= 2) } });
      clearInterval(interval);
      if (error) { toast.error("Comparison failed."); setScanning(false); return; }
      setScanProgress(100);
      await new Promise(r => setTimeout(r, 400));
      setResult(data as ComparisonResult);
    } catch (e) { clearInterval(interval); toast.error("Something went wrong."); console.error(e); } finally { setScanning(false); }
  };

  const radarData = result ? Object.keys(result.players[0]?.coreStats || {}).map(key => {
    const entry: Record<string, string | number> = { attr: key.charAt(0).toUpperCase() + key.slice(1) };
    result.players.forEach((p, i) => { entry[`P${i}`] = p.coreStats[key] || 0; });
    return entry;
  }) : [];

  const seasonData = result ? (() => {
    const allYears = new Set<string>();
    result.players.forEach(p => p.seasonPerformance?.forEach(s => allYears.add(s.year)));
    return Array.from(allYears).sort().map(year => {
      const entry: Record<string, string | number> = { year };
      result.players.forEach((p, i) => { const f = p.seasonPerformance?.find(s => s.year === year); entry[`P${i}`] = f?.rating || 0; });
      return entry;
    });
  })() : [];

  const getStatMax = (stats: Record<string, number>[], key: string) => Math.max(...stats.map(s => s[key] || 0));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5 mb-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary icon-glow" />
          <h3 className="text-sm font-display font-bold text-foreground">AI Player Comparison</h3>
          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">LIVE</span>
        </div>
        {result && (
          <button onClick={reset} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/5">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Input Row */}
      <div className="flex flex-wrap gap-2 mb-3">
        {names.map((name, i) => (
          <div key={i} className="flex-1 min-w-[120px] relative">
            <Input value={name} onChange={e => updateName(i, e.target.value)} placeholder={`Player ${i + 1}...`}
              className="text-xs h-8 bg-secondary/50 border-border/30 pr-7" onKeyDown={e => e.key === "Enter" && runComparison()} />
            {names.length > 2 && (
              <button onClick={() => removeSlot(i)} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}
        {names.length < 4 && (
          <button onClick={addSlot} className="flex items-center justify-center w-8 h-8 rounded-lg border border-dashed border-border/30 hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors">
            <Plus className="w-3 h-3" />
          </button>
        )}
        <Button onClick={runComparison} disabled={!canCompare || scanning} size="sm" className="h-8 px-4 bg-primary text-primary-foreground text-xs font-semibold">
          <Brain className="w-3 h-3 mr-1" /> {scanning ? `${scanProgress}%` : "Compare"}
        </Button>
      </div>

      {/* Scanning */}
      <AnimatePresence>
        {scanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-4 space-y-2">
            <div className="relative h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: `${scanProgress}%` }} />
              <motion.div className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent" animate={{ x: ["-64px", "400px"] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
            </div>
            <div className="flex items-center justify-center gap-2 py-2">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Zap className="w-4 h-4 text-primary" /></motion.div>
              <p className="text-[10px] text-muted-foreground">Analyzing with Gemini AI... <span className="text-primary font-bold">{scanProgress}%</span></p>
            </div>
            {names.filter(n => n.trim()).map((name, i) => (
              <motion.div key={name + i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: [0.3, 1, 0.3], x: 0 }} transition={{ delay: i * 0.15, duration: 1.2, repeat: Infinity }}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-primary/5 border border-primary/10">
                <ScanLine className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-[10px] text-foreground font-medium">{name}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== RESULTS ===== */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">

            {/* Player Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.players.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-xl bg-secondary/30 border border-border/30 relative overflow-hidden">
                  <div className="absolute top-1.5 right-2 text-xl font-black" style={{ color: PLAYER_COLORS[i], opacity: 0.12 }}>#{i + 1}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2" style={{ borderColor: PLAYER_COLORS[i], color: PLAYER_COLORS[i], backgroundColor: `${PLAYER_COLORS[i]}15` }}>
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{p.name}</p>
                      <p className="text-[9px] text-muted-foreground">{p.sport} • {p.role} • {p.nationality}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${PLAYER_COLORS[i]}15` }}>
                      <Gauge className="w-2.5 h-2.5" style={{ color: PLAYER_COLORS[i] }} />
                      <span className="text-sm font-black" style={{ color: PLAYER_COLORS[i] }}>{p.overallScore}</span>
                    </div>
                  </div>
                  {p.careerHighlights && (
                    <div className="grid grid-cols-4 gap-1 mb-2">
                      {[{ l: "Matches", v: p.careerHighlights.totalMatches }, { l: "Win%", v: `${p.careerHighlights.winRate}%` }, { l: "Trophies", v: p.careerHighlights.trophies }, { l: "Awards", v: p.careerHighlights.personalAwards }].map(item => (
                        <div key={item.l} className="text-center p-1 rounded bg-background/50">
                          <p className="text-[10px] font-bold text-foreground">{item.v}</p>
                          <p className="text-[7px] text-muted-foreground">{item.l}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {p.sportSpecificStats && (
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      {Object.entries(p.sportSpecificStats).map(([label, value]) => (
                        <div key={label} className="flex justify-between px-1.5 py-0.5 rounded bg-background/30 text-[9px]">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="text-foreground font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {p.strengths?.map(s => <span key={s} className="text-[8px] px-1 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{s}</span>)}
                    {p.weaknesses?.map(w => <span key={w} className="text-[8px] px-1 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">{w}</span>)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Radar Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="p-4 rounded-xl bg-secondary/20 border border-border/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <BarChart3 className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-semibold text-foreground">Core Stats Radar</span>
                </div>
                <div className="flex flex-wrap gap-3 mb-1">
                  {result.players.map((p, i) => <span key={p.name} className="text-[9px] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PLAYER_COLORS[i] }} />{p.name}</span>)}
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="attr" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
                      {result.players.map((_, i) => <Radar key={i} dataKey={`P${i}`} stroke={PLAYER_COLORS[i]} fill={PLAYER_COLORS[i]} fillOpacity={0.08 + i * 0.03} strokeWidth={2} />)}
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Season Performance */}
              {seasonData.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="p-4 rounded-xl bg-secondary/20 border border-border/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-semibold text-foreground">Season Performance</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-1">
                    {result.players.map((p, i) => <span key={p.name} className="text-[9px] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PLAYER_COLORS[i] }} />{p.name}</span>)}
                  </div>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={seasonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
                        <YAxis domain={[50, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 10 }} />
                        {result.players.map((_, i) => <Line key={i} type="monotone" dataKey={`P${i}`} stroke={PLAYER_COLORS[i]} strokeWidth={2} dot={{ fill: PLAYER_COLORS[i], r: 2 }} />)}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Core Stats Bars */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="p-4 rounded-xl bg-secondary/20 border border-border/20">
              <div className="flex items-center gap-1.5 mb-3">
                <Target className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-semibold text-foreground">Core Stats</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {Object.keys(result.players[0]?.coreStats || {}).map((key) => {
                  const Icon = coreStatIcons[key] || Brain;
                  const max = getStatMax(result.players.map(p => p.coreStats), key);
                  return (
                    <div key={key} className="space-y-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold capitalize">
                        <Icon className="w-2.5 h-2.5 text-primary" />{key}
                        {result.categoryWinners?.[key] && <span className="ml-auto text-[8px] text-primary">👑 {result.categoryWinners[key]}</span>}
                      </div>
                      {result.players.map((p, i) => {
                        const val = p.coreStats[key] || 0; const pct = max > 0 ? (val / max) * 100 : 0; const isMax = val === max;
                        return (
                          <div key={p.name} className="flex items-center gap-1.5">
                            <span className="text-[9px] text-foreground font-medium w-20 truncate">{p.name}</span>
                            <div className="flex-1 h-3.5 bg-secondary/50 rounded-full overflow-hidden relative">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, delay: i * 0.05 }}
                                className="h-full rounded-full" style={{ backgroundColor: isMax ? PLAYER_COLORS[i] : `${PLAYER_COLORS[i]}40`, boxShadow: isMax ? `0 0 8px ${PLAYER_COLORS[i]}60` : "none" }} />
                              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-foreground">{val}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Skill Breakdown */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="p-4 rounded-xl bg-secondary/20 border border-border/20">
              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-semibold text-foreground">Skill Breakdown</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {Object.keys(result.players[0]?.skillBreakdown || {}).map((key) => {
                  const Icon = skillIcons[key] || Brain;
                  const max = getStatMax(result.players.map(p => p.skillBreakdown), key);
                  const label = key.replace(/([A-Z])/g, " $1").trim();
                  return (
                    <div key={key} className="space-y-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold capitalize">
                        <Icon className="w-2.5 h-2.5 text-primary" />{label}
                      </div>
                      {result.players.map((p, i) => {
                        const val = p.skillBreakdown?.[key] || 0; const pct = max > 0 ? (val / max) * 100 : 0; const isMax = val === max;
                        return (
                          <div key={p.name} className="flex items-center gap-1.5">
                            <span className="text-[9px] text-foreground font-medium w-20 truncate">{p.name}</span>
                            <div className="flex-1 h-3.5 bg-secondary/50 rounded-full overflow-hidden relative">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, delay: i * 0.05 }}
                                className="h-full rounded-full" style={{ backgroundColor: isMax ? PLAYER_COLORS[i] : `${PLAYER_COLORS[i]}40`, boxShadow: isMax ? `0 0 8px ${PLAYER_COLORS[i]}60` : "none" }} />
                              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-foreground">{val}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Category Winners */}
            {result.categoryWinners && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="p-4 rounded-xl bg-secondary/20 border border-border/20">
                <div className="flex items-center gap-1.5 mb-2">
                  <Award className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-semibold text-foreground">Category Winners</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {Object.entries(result.categoryWinners).map(([cat, winner]) => (
                    <div key={cat} className="text-center p-1.5 rounded-lg bg-background/50 border border-border/20">
                      <p className="text-[8px] text-muted-foreground capitalize mb-0.5">{cat.replace(/([A-Z])/g, " $1").trim()}</p>
                      <p className="text-[9px] font-bold text-primary truncate">👑 {winner}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Final Verdict */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }} className="p-5 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Dumbbell className="w-4 h-4 text-primary icon-glow" />
                <span className="text-xs font-bold text-foreground">Final Verdict</span>
              </div>
              <div className="flex justify-center gap-6 mb-4">
                {result.players.map((p, i) => {
                  const best = Math.max(...result.players.map(pl => pl.overallScore));
                  const isBest = p.overallScore === best;
                  return (
                    <motion.div key={p.name} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.12, type: "spring" }} className="flex flex-col items-center gap-1.5">
                      <div className="relative w-16 h-16">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
                          <motion.circle cx="40" cy="40" r="34" fill="none" stroke={PLAYER_COLORS[i]} strokeWidth="6" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 34}`} initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - p.overallScore / 100) }}
                            transition={{ duration: 1.5, delay: 0.6 + i * 0.12 }}
                            style={{ filter: isBest ? `drop-shadow(0 0 6px ${PLAYER_COLORS[i]})` : "none" }} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-black" style={{ color: PLAYER_COLORS[i] }}>{p.overallScore}</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-semibold text-foreground text-center">{p.name}</p>
                      {isBest && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">🏆 WINNER</span>}
                    </motion.div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed mb-1.5">{result.verdict}</p>
              <p className="text-[10px] text-foreground font-medium mb-1.5">{result.headToHead}</p>
              {result.funFact && <p className="text-[9px] text-primary/80 italic">💡 {result.funFact}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardAICompare;
