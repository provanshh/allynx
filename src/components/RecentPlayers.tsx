import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, Coins, Star } from "lucide-react";

interface LeaderboardEntry {
  name: string;
  score: number;
  gold: number;
  reputation: number;
  date: string;
}

const RecentPlayers = () => {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("game-leaderboard");
      if (saved) {
        const parsed: LeaderboardEntry[] = JSON.parse(saved);
        setPlayers(parsed.slice(0, 5));
      }
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  if (players.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Gamepad2 className="w-4 h-4 text-primary icon-glow" />
        <h3 className="text-sm font-semibold text-foreground">Recent Game Players</h3>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-[40px_1fr_70px_60px_60px] gap-2 text-[10px] text-muted-foreground pb-2 border-b border-border/30 font-semibold">
          <span>Rank</span>
          <span>Player</span>
          <span className="text-right">Score</span>
          <span className="text-right">Gold</span>
          <span className="text-right">Fame</span>
        </div>
        {players.map((p, i) => (
          <motion.div
            key={`${p.name}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            className={`grid grid-cols-[40px_1fr_70px_60px_60px] gap-2 items-center py-2.5 text-xs border-b border-border/10 ${
              i < 3 ? "bg-primary/5 rounded-lg px-1" : ""
            }`}
          >
            <span className={i < 3 ? "font-bold neon-text" : "text-muted-foreground font-semibold"}>
              #{i + 1}
            </span>
            <span className="font-medium text-foreground truncate">{p.name}</span>
            <span className="text-right font-semibold text-foreground">{p.score}</span>
            <span className="text-right text-muted-foreground">{p.gold}</span>
            <span className="text-right text-muted-foreground">{p.reputation}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentPlayers;
