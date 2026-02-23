import { motion } from "framer-motion";
import { Users, Star, Shield, AlertTriangle, TrendingUp, Coins, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const players = [
  { name: "Virat Kohli", role: "Batsman", form: 92, risk: 12, value: 12, img: "VK" },
  { name: "Jasprit Bumrah", role: "Bowler", form: 88, risk: 8, value: 11, img: "JB" },
  { name: "Kane Williamson", role: "Batsman", form: 85, risk: 15, value: 10, img: "KW" },
  { name: "Rashid Khan", role: "All-Rounder", form: 90, risk: 10, value: 9.5, img: "RK" },
  { name: "Pat Cummins", role: "Bowler", form: 86, risk: 14, value: 10.5, img: "PC" },
  { name: "Jos Buttler", role: "Wicket-Keeper", form: 82, risk: 18, value: 9, img: "JBu" },
  { name: "Shakib Al Hasan", role: "All-Rounder", form: 78, risk: 20, value: 8, img: "SA" },
  { name: "Trent Boult", role: "Bowler", form: 84, risk: 11, value: 9, img: "TB" },
];

const selectedTeam = [
  { name: "Virat Kohli", role: "Batsman", value: 12 },
  { name: "Jasprit Bumrah", role: "Bowler", value: 11 },
  { name: "Rashid Khan", role: "All-Rounder", value: 9.5 },
];

const TeamBuilderTab = () => {
  const budgetUsed = selectedTeam.reduce((a, p) => a + p.value, 0);
  const totalBudget = 100;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Team Builder</h2>
          <p className="text-xs text-muted-foreground mt-1">Build your dream squad with AI-assisted selections</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">{budgetUsed} / {totalBudget} Credits</span>
          </div>
        </div>
      </motion.div>

      {/* Budget Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-4">
        <div className="flex justify-between mb-2">
          <span className="text-xs text-muted-foreground">Budget Used</span>
          <span className="text-xs font-semibold text-primary">{((budgetUsed / totalBudget) * 100).toFixed(0)}%</span>
        </div>
        <Progress value={(budgetUsed / totalBudget) * 100} className="h-2" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Team */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card-glow p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-primary icon-glow" />
            <h3 className="text-sm font-semibold text-foreground">Selected Squad ({selectedTeam.length}/11)</h3>
          </div>
          <div className="space-y-3">
            {selectedTeam.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                    {p.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.role}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-primary">{p.value}cr</span>
              </motion.div>
            ))}
            {selectedTeam.length < 11 && (
              <div className="border-2 border-dashed border-border/30 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Drag players here to add</p>
              </div>
            )}
          </div>

          {/* Synergy Score */}
          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/15">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground">Live Synergy Score</span>
            </div>
            <div className="text-2xl font-bold neon-text">76.4</div>
          </div>
        </motion.div>

        {/* Player Pool */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-neon-green" />
            <h3 className="text-sm font-semibold text-foreground">Available Players</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {players.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.04 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-grab group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                  {p.img}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
                    <span className="text-[10px] font-semibold text-primary">{p.value}cr</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{p.role}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-neon-green flex items-center gap-0.5"><TrendingUp className="w-2.5 h-2.5" /> {p.form}</span>
                    <span className="text-[10px] text-destructive flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5" /> {p.risk}%</span>
                    <span className="text-[10px] text-primary flex items-center gap-0.5"><Star className="w-2.5 h-2.5" /> AI Pick</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamBuilderTab;
