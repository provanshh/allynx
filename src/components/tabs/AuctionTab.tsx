import { motion } from "framer-motion";
import { Gavel, Coins, Users, Brain, Shield, AlertTriangle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { sendTelegramNotification } from "@/lib/telegram";
import { toast } from "sonner";

const purse = { total: 90, spent: 52.5, remaining: 37.5 };
const slots = { total: 25, filled: 14, overseas: { limit: 8, used: 5 } };

const auctionPlayers = [
  { name: "Mitchell Starc", role: "Fast Bowler", base: 2, aiSuggested: 8.5, risk: "Low", overseas: true },
  { name: "Suryakumar Yadav", role: "Batsman", base: 2, aiSuggested: 12, risk: "Medium", overseas: false },
  { name: "Adil Rashid", role: "Spinner", base: 1.5, aiSuggested: 6, risk: "Low", overseas: true },
  { name: "Shubman Gill", role: "Batsman", base: 2, aiSuggested: 10, risk: "Low", overseas: false },
];

const roleNeeds = [
  { role: "Batsmen", have: 5, need: 7 },
  { role: "Bowlers", have: 4, need: 6 },
  { role: "All-Rounders", have: 3, need: 4 },
  { role: "Wicket-Keepers", have: 2, need: 2 },
];

const AuctionTab = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-xl font-display font-bold text-foreground">Auction Mode</h2>
      <p className="text-xs text-muted-foreground mt-1">AI-assisted squad building with smart bid suggestions</p>
    </motion.div>

    {/* Top Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Total Purse", value: `₹${purse.total}Cr`, icon: Coins, accent: "text-primary" },
        { label: "Remaining", value: `₹${purse.remaining}Cr`, icon: Coins, accent: "text-neon-green" },
        { label: "Slots Filled", value: `${slots.filled}/${slots.total}`, icon: Users, accent: "text-neon-cyan" },
        { label: "Overseas", value: `${slots.overseas.used}/${slots.overseas.limit}`, icon: Shield, accent: "text-primary" },
      ].map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="glass-card p-4">
          <s.icon className={`w-5 h-5 ${s.accent} mb-2`} />
          <p className="text-lg font-bold text-foreground">{s.value}</p>
          <p className="text-[10px] text-muted-foreground">{s.label}</p>
        </motion.div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Role Requirements */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Role Requirements</h3>
        <div className="space-y-4">
          {roleNeeds.map(r => (
            <div key={r.role}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">{r.role}</span>
                <span className="text-xs font-semibold text-foreground">{r.have}/{r.need}</span>
              </div>
              <Progress value={(r.have / r.need) * 100} className="h-1.5" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Smart Picks */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2 glass-card-glow p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-primary icon-glow" />
          <h3 className="text-sm font-semibold text-foreground">AI Smart Pick Suggestions</h3>
        </div>
        <div className="space-y-3">
          {auctionPlayers.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.06 }}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                  {p.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">{p.name}</p>
                    {p.overseas && <span className="text-[9px] px-1.5 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan">OS</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{p.role} · Base: ₹{p.base}Cr</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold neon-text">₹{p.aiSuggested}Cr</p>
                  <p className="text-[9px] text-muted-foreground flex items-center gap-0.5 justify-end">
                    <Star className="w-2.5 h-2.5 text-primary" /> AI Bid
                  </p>
                </div>
                <Button size="sm" className="h-7 text-[10px] bg-primary text-primary-foreground" onClick={() => {
                  toast.success(`Bid placed on ${p.name}!`);
                  sendTelegramNotification(`💰 <b>Auction Bid</b>\n🏏 <b>${p.name}</b> (${p.role})\n💵 AI Suggested: ₹${p.aiSuggested}Cr · Base: ₹${p.base}Cr\n⚠️ Risk: ${p.risk}${p.overseas ? " · 🌍 Overseas" : ""}`);
                }}>Bid</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default AuctionTab;
