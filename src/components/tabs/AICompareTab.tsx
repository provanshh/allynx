import { motion } from "framer-motion";
import { Brain, TrendingUp, Dumbbell, Apple, Gauge } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const playerA = { name: "Virat Kohli", role: "Batsman", stats: { attack: 94, defense: 72, consistency: 91, pressure: 88, fitness: 85, leadership: 96 } };
const playerB = { name: "Kane Williamson", role: "Batsman", stats: { attack: 82, defense: 88, consistency: 93, pressure: 80, fitness: 78, leadership: 90 } };

const radarData = Object.keys(playerA.stats).map(key => ({
  attr: key.charAt(0).toUpperCase() + key.slice(1),
  A: playerA.stats[key as keyof typeof playerA.stats],
  B: playerB.stats[key as keyof typeof playerB.stats],
}));

const weaknesses = [
  { attr: "Spin Defense", current: 62, target: 80, drill: "Net sessions vs spin — 3x/week" },
  { attr: "Death Over SR", current: 118, target: 150, drill: "Power hitting drills — 4x/week" },
  { attr: "Running Between", current: 70, target: 85, drill: "Agility ladder + sprint training" },
];

const AICompareTab = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-xl font-display font-bold text-foreground">AI Compare & Improve</h2>
      <p className="text-xs text-muted-foreground mt-1">Head-to-head analysis with AI-driven improvement plans</p>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar Chart */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card-glow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-primary icon-glow" />
          <h3 className="text-sm font-semibold text-foreground">Attribute Comparison</h3>
        </div>
        <div className="flex justify-center gap-6 mb-2">
          <span className="text-[10px] flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" />{playerA.name}</span>
          <span className="text-[10px] flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-cyan" />{playerB.name}</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(120, 6%, 16%)" />
              <PolarAngleAxis dataKey="attr" tick={{ fill: "hsl(120, 5%, 55%)", fontSize: 10 }} />
              <Radar name={playerA.name} dataKey="A" stroke="hsl(75, 100%, 50%)" fill="hsl(75, 100%, 50%)" fillOpacity={0.15} strokeWidth={2} />
              <Radar name={playerB.name} dataKey="B" stroke="hsl(180, 80%, 50%)" fill="hsl(180, 80%, 50%)" fillOpacity={0.1} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Side by Side Stats */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Head-to-Head Breakdown</h3>
        <div className="space-y-4">
          {radarData.map((d, i) => (
            <div key={d.attr}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-semibold text-primary">{d.A}</span>
                <span className="text-[10px] text-muted-foreground">{d.attr}</span>
                <span className="text-xs font-semibold text-neon-cyan">{d.B}</span>
              </div>
              <div className="flex h-1.5 gap-1">
                <motion.div initial={{ width: 0 }} animate={{ width: `${d.A}%` }} transition={{ delay: 0.4 + i * 0.05, duration: 0.8 }}
                  className="h-full rounded-full bg-primary" style={{ boxShadow: "0 0 8px hsl(75 100% 50% / 0.4)" }} />
                <motion.div initial={{ width: 0 }} animate={{ width: `${d.B}%` }} transition={{ delay: 0.4 + i * 0.05, duration: 0.8 }}
                  className="h-full rounded-full bg-neon-cyan" style={{ boxShadow: "0 0 8px hsl(180 80% 50% / 0.4)" }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* AI Improvement Panel */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Dumbbell className="w-4 h-4 text-neon-green" />
        <h3 className="text-sm font-semibold text-foreground">AI Improvement Plan — {playerA.name}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {weaknesses.map((w, i) => (
          <motion.div key={w.attr} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
            className="p-4 rounded-xl bg-secondary/30 border border-border/30">
            <p className="text-xs font-semibold text-foreground mb-2">{w.attr}</p>
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>Current: <span className="text-destructive font-semibold">{w.current}</span></span>
              <span>Target: <span className="text-neon-green font-semibold">{w.target}</span></span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-secondary mb-2">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(w.current / w.target) * 100}%` }} transition={{ delay: 0.7, duration: 1 }}
                className="h-full rounded-full bg-primary" />
            </div>
            <div className="flex items-start gap-1.5 mt-2">
              <Gauge className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-muted-foreground">{w.drill}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default AICompareTab;
