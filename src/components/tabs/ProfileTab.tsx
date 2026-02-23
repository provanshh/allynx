import { motion } from "framer-motion";
import { User, Trophy, Star, TrendingUp, Calendar, Target, Shield, Award } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const historyData = [
  { month: "Sep", score: 5200 }, { month: "Oct", score: 5800 }, { month: "Nov", score: 6400 },
  { month: "Dec", score: 7100 }, { month: "Jan", score: 7800 }, { month: "Feb", score: 8420 },
];

const achievements = [
  { name: "First Victory", desc: "Won your first contest", icon: Trophy, earned: true },
  { name: "Streak Master", desc: "5 wins in a row", icon: Target, earned: true },
  { name: "AI Whisperer", desc: "Used AI suggestions 50 times", icon: Star, earned: true },
  { name: "Diamond Mind", desc: "Reach Diamond tier", icon: Award, earned: false },
];

const ProfileTab = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-xl font-display font-bold text-foreground">Profile</h2>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Info */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card-glow p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30 mx-auto mb-4">
          <span className="text-2xl font-bold text-primary">AK</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Alex Kumar</h3>
        <p className="text-xs text-muted-foreground mb-4">Member since Jan 2025</p>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Rank", value: "#42", icon: Trophy },
            { label: "Tier", value: "Gold", icon: Star },
            { label: "XP", value: "8,420", icon: TrendingUp },
            { label: "Contests", value: "156", icon: Calendar },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-xl bg-secondary/50 text-center">
              <s.icon className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-sm font-bold text-foreground">{s.value}</p>
              <p className="text-[9px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Score History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 glass-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Score History</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="profileGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(75, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(75, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(120, 5%, 55%)", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(120, 5%, 55%)", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(120, 8%, 8%)", border: "1px solid hsl(120, 6%, 16%)", borderRadius: 8, fontSize: 11, color: "hsl(60, 10%, 95%)" }} />
              <Area type="monotone" dataKey="score" stroke="hsl(75, 100%, 50%)" strokeWidth={2} fill="url(#profileGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>

    {/* Achievements */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-4 h-4 text-primary icon-glow" />
        <h3 className="text-sm font-semibold text-foreground">Achievements</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((a, i) => (
          <motion.div key={a.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.05 }}
            className={`p-4 rounded-xl text-center border ${a.earned ? "bg-primary/5 border-primary/20" : "bg-secondary/30 border-border/20 opacity-50"}`}>
            <a.icon className={`w-6 h-6 mx-auto mb-2 ${a.earned ? "text-primary icon-glow" : "text-muted-foreground"}`} />
            <p className="text-xs font-semibold text-foreground">{a.name}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{a.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default ProfileTab;
