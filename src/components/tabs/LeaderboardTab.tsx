import { motion } from "framer-motion";
import { Trophy, Search, Medal, Crown, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";

const leaders = [
  { rank: 1, name: "StrategyKing_99", score: 9842, winRate: 78.3, dominance: 94.2, tier: "Diamond" },
  { rank: 2, name: "AITactics_Pro", score: 9651, winRate: 75.1, dominance: 91.8, tier: "Diamond" },
  { rank: 3, name: "BrainStorm_X", score: 9488, winRate: 73.9, dominance: 89.5, tier: "Diamond" },
  { rank: 4, name: "Alex Kumar", score: 8420, winRate: 68.2, dominance: 82.1, tier: "Gold" },
  { rank: 5, name: "DataDriven_21", score: 8210, winRate: 66.5, dominance: 80.4, tier: "Gold" },
  { rank: 6, name: "TacticMaster", score: 7980, winRate: 64.1, dominance: 78.9, tier: "Gold" },
  { rank: 7, name: "SportGenius", score: 7650, winRate: 61.8, dominance: 76.2, tier: "Silver" },
  { rank: 8, name: "ProAnalyst_7", score: 7420, winRate: 59.4, dominance: 74.1, tier: "Silver" },
  { rank: 9, name: "SmartPlay_11", score: 7200, winRate: 57.8, dominance: 72.8, tier: "Silver" },
  { rank: 10, name: "GameChanger_X", score: 6980, winRate: 55.2, dominance: 70.5, tier: "Bronze" },
];

const tierColors: Record<string, string> = {
  Diamond: "text-neon-cyan",
  Gold: "text-primary",
  Silver: "text-muted-foreground",
  Bronze: "text-destructive",
};

const LeaderboardTab = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h2 className="text-xl font-display font-bold text-foreground">Global Leaderboard</h2>
        <p className="text-xs text-muted-foreground mt-1">Top strategists ranked by performance</p>
      </div>
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input placeholder="Search players..." className="pl-9 h-9 text-xs bg-secondary/50 border-border/30" />
      </div>
    </motion.div>

    {/* Top 3 Podium */}
    <div className="grid grid-cols-3 gap-4">
      {leaders.slice(0, 3).map((l, i) => (
        <motion.div key={l.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="glass-card-glow p-5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" style={{ boxShadow: "0 0 15px hsl(75 100% 50% / 0.5)" }} />
          {i === 0 && <Crown className="w-5 h-5 text-primary mx-auto mb-2 icon-glow" />}
          {i > 0 && <Medal className="w-5 h-5 text-muted-foreground mx-auto mb-2" />}
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary border border-primary/20 mx-auto mb-2">
            {l.name.slice(0, 2)}
          </div>
          <p className="text-xs font-semibold text-foreground">{l.name}</p>
          <p className="text-lg font-bold neon-text mt-1">{l.score.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Win Rate: {l.winRate}%</p>
        </motion.div>
      ))}
    </div>

    {/* Full Table */}
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-5">
      <div className="grid grid-cols-[50px_1fr_90px_80px_70px_70px] gap-2 text-[10px] text-muted-foreground pb-3 border-b border-border/30 font-semibold">
        <span>Rank</span><span>Player</span><span className="text-right">Score</span>
        <span className="text-right">Win%</span><span className="text-right">Dom.</span><span className="text-right">Tier</span>
      </div>
      {leaders.map((l, i) => (
        <motion.div key={l.rank} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.03 }}
          className={`grid grid-cols-[50px_1fr_90px_80px_70px_70px] gap-2 items-center py-3 text-xs border-b border-border/10 ${
            l.name === "Alex Kumar" ? "bg-primary/5 rounded-lg px-2" : ""
          }`}>
          <span className={l.rank <= 3 ? "font-bold neon-text" : "text-muted-foreground font-semibold"}>#{l.rank}</span>
          <span className={`font-medium ${l.name === "Alex Kumar" ? "text-primary" : "text-foreground"}`}>{l.name}</span>
          <span className="text-right font-semibold text-foreground">{l.score.toLocaleString()}</span>
          <span className="text-right text-muted-foreground">{l.winRate}%</span>
          <span className="text-right text-muted-foreground">{l.dominance}</span>
          <span className={`text-right font-semibold ${tierColors[l.tier]}`}>{l.tier}</span>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

export default LeaderboardTab;
