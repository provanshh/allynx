import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, Plus, X, Trophy, Coins, Star, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeaderboardEntry {
  name: string;
  score: number;
  gold: number;
  reputation: number;
  date: string;
}

interface CompareSlot {
  player: LeaderboardEntry | null;
}

const statConfig = [
  { key: "score", label: "Score", icon: Trophy, color: "text-primary" },
  { key: "gold", label: "Gold", icon: Coins, color: "text-yellow-400" },
  { key: "reputation", label: "Reputation", icon: Star, color: "text-blue-400" },
] as const;

const PlayerComparison = ({ leaderboard }: { leaderboard: LeaderboardEntry[] }) => {
  const [slots, setSlots] = useState<CompareSlot[]>([{ player: null }, { player: null }]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const availablePlayers = leaderboard.filter(
    (p) => !slots.some((s) => s.player?.name === p.name)
  );

  const addPlayer = (index: number, player: LeaderboardEntry) => {
    const updated = [...slots];
    updated[index] = { player };
    setSlots(updated);
    setShowResults(false);
  };

  const removePlayer = (index: number) => {
    const updated = [...slots];
    updated[index] = { player: null };
    setSlots(updated);
    setShowResults(false);
  };

  const addSlot = () => {
    if (slots.length < 3) {
      setSlots([...slots, { player: null }]);
    }
  };

  const filledSlots = slots.filter((s) => s.player !== null);

  const runComparison = useCallback(() => {
    if (filledSlots.length < 2) return;
    setScanning(true);
    setScanProgress(0);
    setShowResults(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setScanning(false);
          setShowResults(true);
        }, 300);
      }
    }, 30);
  }, [filledSlots.length]);

  const getMax = (key: "score" | "gold" | "reputation") => {
    return Math.max(...filledSlots.map((s) => s.player![key]));
  };

  if (leaderboard.length < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6 mt-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-primary icon-glow" />
        <h2 className="text-lg font-display font-bold text-foreground">Player Comparison</h2>
      </div>

      {/* Player Slots */}
      <div className="flex flex-wrap gap-3 mb-5">
        {slots.map((slot, i) => (
          <div
            key={i}
            className="flex-1 min-w-[140px] p-3 rounded-xl border border-border/30 bg-secondary/30"
          >
            {slot.player ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                    {slot.player.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground truncate max-w-[80px]">
                      {slot.player.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground">Score: {slot.player.score}</p>
                  </div>
                </div>
                <button
                  onClick={() => removePlayer(i)}
                  className="p-1 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground font-medium">Slot {i + 1}</p>
                <select
                  className="w-full text-xs bg-background/50 border border-border/30 rounded-lg p-1.5 text-foreground"
                  value=""
                  onChange={(e) => {
                    const player = leaderboard.find((p) => p.name === e.target.value);
                    if (player) addPlayer(i, player);
                  }}
                >
                  <option value="">Select player...</option>
                  {availablePlayers.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} ({p.score})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}

        {slots.length < 3 && (
          <button
            onClick={addSlot}
            className="flex items-center justify-center w-10 min-h-[60px] rounded-xl border border-dashed border-border/30 hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Compare Button */}
      <Button
        onClick={runComparison}
        disabled={filledSlots.length < 2 || scanning}
        className="w-full mb-5 bg-primary text-primary-foreground h-10 text-sm font-semibold hover:shadow-[0_0_30px_hsl(75_100%_50%/0.3)] transition-shadow disabled:opacity-40"
      >
        <ScanLine className="w-4 h-4 mr-2" />
        {scanning ? "Scanning..." : "Compare Players"}
      </Button>

      {/* Scanning Animation */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-5 space-y-3"
          >
            <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                style={{ width: `${scanProgress}%` }}
              />
              <motion.div
                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                animate={{ x: ["-80px", "400px"] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Zap className="w-5 h-5 text-primary" />
              </motion.div>
              <p className="text-xs text-muted-foreground font-medium">
                Analyzing player stats...{" "}
                <span className="text-primary font-bold">{scanProgress}%</span>
              </p>
            </div>

            {/* Scanning Lines Effect */}
            {filledSlots.map((slot, i) => (
              <motion.div
                key={slot.player!.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: [0.3, 1, 0.3], x: 0 }}
                transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10"
              >
                <ScanLine className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-xs text-foreground font-medium">{slot.player!.name}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {statConfig.map((stat) => {
              const max = getMax(stat.key);
              return (
                <div key={stat.key} className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                    <stat.icon className={`w-3 h-3 ${stat.color}`} />
                    {stat.label}
                  </div>
                  {filledSlots.map((slot, i) => {
                    const value = slot.player![stat.key];
                    const pct = max > 0 ? (value / max) * 100 : 0;
                    const isMax = value === max;
                    return (
                      <div key={slot.player!.name} className="flex items-center gap-3">
                        <span className="text-[10px] text-foreground font-medium w-20 truncate">
                          {slot.player!.name}
                        </span>
                        <div className="flex-1 h-5 bg-secondary/50 rounded-full overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              isMax
                                ? "bg-primary shadow-[0_0_10px_hsl(75_100%_50%/0.4)]"
                                : "bg-muted-foreground/30"
                            }`}
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-foreground">
                            {value}
                          </span>
                        </div>
                        {isMax && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-[9px] font-bold text-primary"
                          >
                            BEST
                          </motion.span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PlayerComparison;
