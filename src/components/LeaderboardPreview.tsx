import { motion } from "framer-motion";
import { Trophy, TrendingUp, Target, Percent } from "lucide-react";

const leaders = [
  { rank: 1, name: "StrategyKing_99", score: 9842, winRate: 78.3, dominance: 94.2 },
  { rank: 2, name: "AITactics_Pro", score: 9651, winRate: 75.1, dominance: 91.8 },
  { rank: 3, name: "BrainStorm_X", score: 9488, winRate: 73.9, dominance: 89.5 },
  { rank: 4, name: "Alex Kumar", score: 8420, winRate: 68.2, dominance: 82.1 },
  { rank: 5, name: "DataDriven_21", score: 8210, winRate: 66.5, dominance: 80.4 },
  { rank: 6, name: "TacticMaster", score: 7980, winRate: 64.1, dominance: 78.9 },
  { rank: 7, name: "SportGenius", score: 7650, winRate: 61.8, dominance: 76.2 },
];

const LeaderboardPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-primary icon-glow" />
        <h3 className="text-sm font-semibold text-foreground">Leaderboard</h3>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-[40px_1fr_80px_60px_70px] gap-2 text-[10px] text-muted-foreground pb-2 border-b border-border/30">
          <span>Rank</span>
          <span>Player</span>
          <span className="text-right">Score</span>
          <span className="text-right">Win%</span>
          <span className="text-right">Dom.</span>
        </div>
        {leaders.map((l, i) => (
          <motion.div
            key={l.rank}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 + i * 0.05 }}
            className={`grid grid-cols-[40px_1fr_80px_60px_70px] gap-2 items-center py-2 rounded-lg px-1 text-xs ${
              l.rank <= 3 ? "neon-border bg-primary/5" : l.name === "Alex Kumar" ? "bg-secondary/40" : ""
            }`}
          >
            <span className={`font-bold ${l.rank <= 3 ? "neon-text" : "text-muted-foreground"}`}>
              #{l.rank}
            </span>
            <span className={`font-medium truncate ${l.name === "Alex Kumar" ? "text-primary" : "text-foreground"}`}>
              {l.name}
            </span>
            <span className="text-right font-semibold text-foreground">{l.score.toLocaleString()}</span>
            <span className="text-right text-muted-foreground">{l.winRate}%</span>
            <span className="text-right text-muted-foreground">{l.dominance}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LeaderboardPreview;
