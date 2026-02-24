import { motion } from "framer-motion";
import { Swords, Users, Crown, Zap, Clock, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { sendTelegramNotification } from "@/lib/telegram";
import { toast } from "sonner";

const contests = [
  { name: "Cricket Masters Cup", type: "Free", participants: 128, max: 256, reward: "Gold Badge + 500 XP", status: "Live", timeLeft: "2h 15m" },
  { name: "Football Tactics League", type: "Premium", participants: 64, max: 64, reward: "Diamond Badge + 1200 XP", status: "Starting Soon", timeLeft: "45m" },
  { name: "Multi-Sport Showdown", type: "Free", participants: 256, max: 512, reward: "300 XP", status: "Live", timeLeft: "5h 30m" },
  { name: "Hockey Strategy Clash", type: "Free", participants: 89, max: 128, reward: "Silver Badge + 200 XP", status: "Live", timeLeft: "1h 45m" },
  { name: "AI Prediction Challenge", type: "Premium", participants: 32, max: 64, reward: "1500 XP + Sponsored Prize", status: "Upcoming", timeLeft: "3h" },
  { name: "Badminton Blitz", type: "Free", participants: 45, max: 64, reward: "250 XP", status: "Live", timeLeft: "55m" },
];

const myContests = [
  { name: "Cricket Masters Cup", rank: 12, score: 847, status: "In Progress" },
  { name: "Multi-Sport Showdown", rank: 34, score: 623, status: "In Progress" },
];

const FullArenaTab = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-display font-bold text-foreground">Strategy Arena</h2>
        <p className="text-xs text-muted-foreground mt-1">Compete in skill-based strategy contests</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 animate-pulse-glow font-semibold">
          {contests.filter(c => c.status === "Live").length} LIVE NOW
        </span>
      </div>
    </motion.div>

    <Tabs defaultValue="all" className="w-full">
      <TabsList className="bg-secondary/50 border border-border/30">
        <TabsTrigger value="all" className="text-xs">All Contests</TabsTrigger>
        <TabsTrigger value="live" className="text-xs">Live</TabsTrigger>
        <TabsTrigger value="my" className="text-xs">My Contests</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-4 space-y-3">
        {contests.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex items-center justify-between hover:bg-card/80 transition-colors">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="kpi-icon-bg flex-shrink-0">
                <Swords className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                    c.status === "Live" ? "bg-neon-green/10 text-neon-green" : c.status === "Starting Soon" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                  }`}>{c.status}</span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${c.type === "Premium" ? "bg-primary/15 text-primary" : "bg-neon-green/10 text-neon-green"}`}>
                    {c.type}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{c.participants}/{c.max}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Crown className="w-3 h-3" />{c.reward}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{c.timeLeft}</span>
                </div>
              </div>
            </div>
            <Button size="sm" className="h-8 text-xs bg-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(75_100%_50%/0.3)] ml-4" onClick={() => {
              toast.success(`Joined ${c.name}!`);
              sendTelegramNotification(`🏟️ <b>Contest Joined</b>\n📋 <b>${c.name}</b> (${c.type})\n👥 ${c.participants}/${c.max} · ⏱️ ${c.timeLeft} left\n🏆 ${c.reward}`);
            }}>
              Join Contest
            </Button>
          </motion.div>
        ))}
      </TabsContent>

      <TabsContent value="live" className="mt-4 space-y-3">
        {contests.filter(c => c.status === "Live").map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Swords className="w-4 h-4 text-neon-green icon-glow" />
              <div>
                <p className="text-xs font-semibold text-foreground">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.participants}/{c.max} · {c.timeLeft} left</p>
              </div>
            </div>
            <Button size="sm" className="h-7 text-[10px] bg-primary text-primary-foreground" onClick={() => {
              toast.success(`Joined ${c.name}!`);
              sendTelegramNotification(`🔴 <b>Live Contest Joined</b>\n📋 <b>${c.name}</b>\n👥 ${c.participants}/${c.max} · ⏱️ ${c.timeLeft} left`);
            }}>Join</Button>
          </motion.div>
        ))}
      </TabsContent>

      <TabsContent value="my" className="mt-4 space-y-3">
        {myContests.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className="glass-card-glow p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-primary icon-glow" />
              <div>
                <p className="text-xs font-semibold text-foreground">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">Rank #{c.rank} · Score: {c.score}</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-neon-green/10 text-neon-green">{c.status}</span>
          </motion.div>
        ))}
      </TabsContent>
    </Tabs>
  </div>
);

export default FullArenaTab;
