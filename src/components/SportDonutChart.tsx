import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Cricket", value: 35, color: "hsl(75, 100%, 50%)" },
  { name: "Football", value: 28, color: "hsl(142, 70%, 45%)" },
  { name: "Hockey", value: 18, color: "hsl(180, 80%, 50%)" },
  { name: "Badminton", value: 19, color: "hsl(45, 90%, 55%)" },
];

const SportDonutChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="glass-card-glow p-6"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Top Sport Categories Performance</h3>

      <div className="flex items-center gap-6">
        <div className="relative w-48 h-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold neon-text">87.5</p>
            <p className="text-[10px] text-muted-foreground">Strategy Rating</p>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SportDonutChart;
