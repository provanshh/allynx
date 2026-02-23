import { motion } from "framer-motion";
import { GitCompare, Trophy, Shield, Zap, Clock } from "lucide-react";

const playerA = {
  name: "Virat Kohli", sport: "Cricket",
  metrics: { dominance: 94, consistency: 91, pressure: 88, longevity: 85 },
};
const playerB = {
  name: "Cristiano Ronaldo", sport: "Football",
  metrics: { dominance: 96, consistency: 89, pressure: 92, longevity: 90 },
};

const metricIcons = { dominance: Trophy, consistency: Shield, pressure: Zap, longevity: Clock };

const CrossSportTab = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-xl font-display font-bold text-foreground">Cross-Sport Battle</h2>
      <p className="text-xs text-muted-foreground mt-1">Compare legends across sports with our proprietary metrics</p>
    </motion.div>

    {/* Player Headers */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[playerA, playerB].map((p, idx) => (
        <motion.div key={p.name} initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="glass-card-glow p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary border-2 border-primary/20 mx-auto mb-3">
            {p.name.split(" ").map(n => n[0]).join("")}
          </div>
          <p className="text-sm font-semibold text-foreground">{p.name}</p>
          <p className="text-[10px] text-muted-foreground">{p.sport}</p>
          <p className="text-2xl font-bold neon-text mt-2">
            {(Object.values(p.metrics).reduce((a, b) => a + b, 0) / 4).toFixed(1)}
          </p>
          <p className="text-[10px] text-muted-foreground">Overall Index</p>
        </motion.div>
      ))}
    </div>

    {/* Metric Bars */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <GitCompare className="w-4 h-4 text-primary icon-glow" />
        <h3 className="text-sm font-semibold text-foreground">Metric Comparison</h3>
      </div>
      <div className="space-y-6">
        {(Object.keys(playerA.metrics) as Array<keyof typeof playerA.metrics>).map((key, i) => {
          const Icon = metricIcons[key];
          const a = playerA.metrics[key];
          const b = playerB.metrics[key];
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-primary">{a}</span>
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground capitalize">{key}</span>
                </div>
                <span className="text-xs font-bold text-neon-cyan">{b}</span>
              </div>
              <div className="flex gap-2 h-3">
                <div className="flex-1 flex justify-end">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${a}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                    className="h-full rounded-full bg-primary" style={{ boxShadow: "0 0 10px hsl(75 100% 50% / 0.3)" }} />
                </div>
                <div className="flex-1">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${b}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                    className="h-full rounded-full bg-neon-cyan" style={{ boxShadow: "0 0 10px hsl(180 80% 50% / 0.3)" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  </div>
);

export default CrossSportTab;
