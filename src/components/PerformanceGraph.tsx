import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const data = [
  { week: "W1", score: 62 },
  { week: "W2", score: 68 },
  { week: "W3", score: 65 },
  { week: "W4", score: 74 },
  { week: "W5", score: 71 },
  { week: "W6", score: 82 },
  { week: "W7", score: 79 },
  { week: "W8", score: 88 },
  { week: "W9", score: 85 },
  { week: "W10", score: 92 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-2 text-xs">
        <p className="text-muted-foreground">{label}</p>
        <p className="font-semibold neon-text">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const PerformanceGraph = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="glass-card p-6"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Strategy Growth Over Time</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(75, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(75, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "hsl(120, 5%, 55%)", fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(120, 5%, 55%)", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="hsl(75, 100%, 50%)"
              strokeWidth={2}
              fill="url(#neonGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PerformanceGraph;
