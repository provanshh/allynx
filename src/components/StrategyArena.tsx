import { motion } from "framer-motion";
import { Swords, Users, Zap, Crown } from "lucide-react";
import { sendTelegramNotification } from "@/lib/telegram";
import { toast } from "sonner";

const contests = [
  { name: "Cricket Masters Cup", type: "Free", participants: 128, reward: "Gold Badge + 500 XP", status: "Live" },
  { name: "Football Tactics League", type: "Premium", participants: 64, reward: "Diamond Badge + 1200 XP", status: "Starting Soon" },
  { name: "Multi-Sport Showdown", type: "Free", participants: 256, reward: "300 XP", status: "Live" },
];

const StrategyArena = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-primary icon-glow" />
          <h3 className="text-sm font-semibold text-foreground">Live Strategy Arena</h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 animate-pulse-glow">
          LIVE
        </span>
      </div>

      <div className="space-y-3">
        {contests.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{c.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${c.type === "Premium" ? "bg-primary/15 text-primary" : "bg-neon-green/15 text-neon-green"}`}>
                  {c.type}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" /> {c.participants}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Crown className="w-3 h-3" /> {c.reward}
                </span>
              </div>
            </div>
            <button onClick={() => {
              toast.success(`Joined ${c.name}!`);
              sendTelegramNotification(`🏟️ <b>Arena Join</b>\nJoined <b>${c.name}</b> (${c.type})\n👥 ${c.participants} players · 🏆 ${c.reward}`);
            }} className="text-[10px] font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(75_100%_50%/0.3)] transition-shadow flex-shrink-0 ml-3">
              Join
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StrategyArena;
