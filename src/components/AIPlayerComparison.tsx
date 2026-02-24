import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Plus, X, Zap, ScanLine, Trophy, Shield, Target, Heart, Crown, Star, Swords, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlayerStats {
  attack: number;
  defense: number;
  consistency: number;
  pressure: number;
  fitness: number;
  leadership: number;
  experience: number;
  technique: number;
}

interface PlayerData {
  name: string;
  sport: string;
  role: string;
  stats: PlayerStats;
  strengths: string[];
  weaknesses: string[];
}

interface ComparisonResult {
  players: PlayerData[];
  verdict: string;
  headToHead: string;
}

const statIcons: Record<string, typeof Brain> = {
  attack: Target,
  defense: Shield,
  consistency: Star,
  pressure: Zap,
  fitness: Heart,
  leadership: Crown,
  experience: Trophy,
  technique: Swords,
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

    // Progress animation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      if (progress > 90) { clearInterval(interval); return; }
      setScanProgress(progress);
    }, 50);

    try {
      const { data, error } = await supabase.functions.invoke("compare-players", {
        body: { players: names.filter(n => n.trim().length >= 2) },
      });

      clearInterval(interval);

      if (error) {
        toast.error("Comparison failed. Please try again.");
        console.error(error);
        setScanning(false);
        return;
      }

      // Finish progress
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

  const getMax = (key: keyof PlayerStats) => {
    if (!result) return 0;
    return Math.max(...result.players.map(p => p.stats[key]));
  };

  const statKeys = ["attack", "defense", "consistency", "pressure", "fitness", "leadership", "experience", "technique"] as const;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 mt-6">
      <div className="flex items-center gap-2 mb-5">
        <Brain className="w-5 h-5 text-primary icon-glow" />
        <h2 className="text-lg font-display font-bold text-foreground">AI Player Comparison</h2>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold ml-1">Powered by Gemini</span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Enter any real player names from any sport and AI will compare them across all metrics.</p>

      {/* Name Inputs */}
      <div className="flex flex-wrap gap-3 mb-4">
        {names.map((name, i) => (
          <div key={i} className="flex-1 min-w-[160px] relative">
            <Input
              value={name}
              onChange={e => updateName(i, e.target.value)}
              placeholder={`Player ${i + 1} name...`}
              className="text-sm h-10 bg-secondary/50 border-border/30 pr-8"
              onKeyDown={e => e.key === "Enter" && runComparison()}
            />
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

      {/* Compare Button */}
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
              <motion.div key={name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: [0.3, 1, 0.3], x: 0 }} transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }} className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                <ScanLine className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-xs text-foreground font-medium">{name}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Player Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.players.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.sport} • {p.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.strengths.map(s => (
                      <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                    ))}
                    {p.weaknesses.map(w => (
                      <span key={w} className="text-[9px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">{w}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stat Bars */}
            <div className="space-y-4">
              {statKeys.map((key) => {
                const Icon = statIcons[key] || Brain;
                const max = getMax(key);
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold capitalize">
                      <Icon className="w-3 h-3 text-primary" />
                      {key}
                    </div>
                    {result.players.map((p, i) => {
                      const val = p.stats[key];
                      const pct = max > 0 ? (val / max) * 100 : 0;
                      const isMax = val === max;
                      return (
                        <div key={p.name} className="flex items-center gap-3">
                          <span className="text-[10px] text-foreground font-medium w-24 truncate">{p.name}</span>
                          <div className="flex-1 h-5 bg-secondary/50 rounded-full overflow-hidden relative">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }} className={`h-full rounded-full ${isMax ? "bg-primary shadow-[0_0_10px_hsl(75_100%_50%/0.4)]" : "bg-muted-foreground/30"}`} />
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

            {/* Verdict */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">AI Verdict</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{result.verdict}</p>
              <p className="text-xs text-foreground font-medium mt-2">{result.headToHead}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIPlayerComparison;
