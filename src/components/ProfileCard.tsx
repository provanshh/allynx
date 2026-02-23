import { motion } from "framer-motion";
import { Trophy, Star, TrendingUp } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const miniData = [
  { v: 40 }, { v: 55 }, { v: 48 }, { v: 62 }, { v: 58 }, { v: 72 }, { v: 68 }, { v: 80 },
];

const ProfileCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="glass-card-glow p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30">
          <span className="text-lg font-bold text-primary">AK</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Alex Kumar</p>
          <p className="text-[10px] text-muted-foreground">Last active: Today</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Rank", value: "#42", icon: Trophy },
          { label: "Tier", value: "Gold", icon: Star },
          { label: "XP", value: "8,420", icon: TrendingUp },
        ].map((item) => (
          <div key={item.label} className="text-center p-2 rounded-lg bg-secondary/50">
            <item.icon className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
            <p className="text-xs font-bold text-foreground">{item.value}</p>
            <p className="text-[9px] text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={miniData}>
            <defs>
              <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(75, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(75, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="hsl(75, 100%, 50%)" strokeWidth={1.5} fill="url(#miniGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
