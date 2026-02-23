import { motion } from "framer-motion";
import { Mountain, Cloud, Thermometer, Wind, Droplets, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const venues = [
  { name: "Wankhede Stadium", city: "Mumbai", surface: "Black Soil", pace: 72, spin: 58, bounce: 65, temp: "32°C", humidity: "78%", wind: "12 km/h" },
  { name: "Eden Gardens", city: "Kolkata", surface: "Red Soil", pace: 55, spin: 82, bounce: 48, temp: "28°C", humidity: "85%", wind: "8 km/h" },
  { name: "MCG", city: "Melbourne", surface: "Drop-in", pace: 80, spin: 42, bounce: 78, temp: "24°C", humidity: "55%", wind: "18 km/h" },
];

const historicalData = [
  { year: "2021", batting1st: 285, batting2nd: 248 },
  { year: "2022", batting1st: 310, batting2nd: 265 },
  { year: "2023", batting1st: 295, batting2nd: 272 },
  { year: "2024", batting1st: 320, batting2nd: 290 },
  { year: "2025", batting1st: 305, batting2nd: 278 },
];

const TerrainTab = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-xl font-display font-bold text-foreground">Terrain Intelligence</h2>
      <p className="text-xs text-muted-foreground mt-1">Venue-specific analytics, pitch behavior & weather impact</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {venues.map((v, i) => (
        <motion.div key={v.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="glass-card p-5 hover-lift">
          <div className="flex items-center gap-2 mb-3">
            <Mountain className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs font-semibold text-foreground">{v.name}</p>
              <p className="text-[10px] text-muted-foreground">{v.city} · {v.surface}</p>
            </div>
          </div>

          {/* Pitch behavior bars */}
          <div className="space-y-2 mb-4">
            {[
              { label: "Pace", value: v.pace, color: "bg-primary" },
              { label: "Spin", value: v.spin, color: "bg-neon-green" },
              { label: "Bounce", value: v.bounce, color: "bg-neon-cyan" },
            ].map(b => (
              <div key={b.label}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-[10px] text-muted-foreground">{b.label}</span>
                  <span className="text-[10px] font-semibold text-foreground">{b.value}%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-secondary">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${b.value}%` }} transition={{ delay: 0.5, duration: 0.8 }}
                    className={`h-full rounded-full ${b.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Weather */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Thermometer, value: v.temp, label: "Temp" },
              { icon: Droplets, value: v.humidity, label: "Humidity" },
              { icon: Wind, value: v.wind, label: "Wind" },
            ].map(w => (
              <div key={w.label} className="text-center p-2 rounded-lg bg-secondary/40">
                <w.icon className="w-3 h-3 text-muted-foreground mx-auto mb-0.5" />
                <p className="text-[10px] font-semibold text-foreground">{w.value}</p>
                <p className="text-[9px] text-muted-foreground">{w.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>

    {/* Historical Chart */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Historical Average Scores — Wankhede Stadium</h3>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={historicalData} barGap={4}>
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "hsl(120, 5%, 55%)", fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(120, 5%, 55%)", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(120, 8%, 8%)", border: "1px solid hsl(120, 6%, 16%)", borderRadius: 8, fontSize: 11, color: "hsl(60, 10%, 95%)" }} />
            <Bar dataKey="batting1st" fill="hsl(75, 100%, 50%)" radius={[4, 4, 0, 0]} opacity={0.8} />
            <Bar dataKey="batting2nd" fill="hsl(180, 80%, 50%)" radius={[4, 4, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  </div>
);

export default TerrainTab;
