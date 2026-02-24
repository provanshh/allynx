import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Skull, Clock, MapPin, Users, Coins, Star, Utensils, Heart, Gamepad2, TrendingUp, TrendingDown, Minus, Shield, Swords, Brain, Zap } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

export interface GameSessionData {
  playerName: string;
  endType: 'gameover' | 'victory' | 'exit';
  victoryType: string | null;
  duration: number; // seconds
  finalResources: {
    food: number;
    gold: number;
    reputation: number;
    journeyCount: number;
    progress: number;
    lives: number;
    score: number;
    passengers: { name: string; type: string }[];
    vehicle: string;
  };
  encountersTriggered: number;
  choicesMade: number;
  coinsCollected: number;
  passengersOnboarded: number;
  bulletsShot: number;
  vehicleChanges: number;
  mysteryBoxesOpened: number;
  distanceTraveled: number;
  foodConsumed: number;
  goldSpent: number;
  goldEarned: number;
  damagesTaken: number;
  timestamp: string;
}

interface PostGameAnalysisProps {
  session: GameSessionData;
  onClear: () => void;
}

const PostGameAnalysis = ({ session, onClear }: PostGameAnalysisProps) => {
  const s = session;
  const isVictory = s.endType === 'victory';
  const isExit = s.endType === 'exit';
  const finalScore = s.finalResources.gold + s.finalResources.reputation * 2;

  // Derived behavior metrics (0-100)
  const aggression = Math.min(100, (s.bulletsShot * 3) + (s.damagesTaken * 5));
  const exploration = Math.min(100, (s.encountersTriggered * 8) + (s.mysteryBoxesOpened * 15));
  const resourcefulness = Math.min(100, (s.coinsCollected * 5) + (s.passengersOnboarded * 15) + (s.vehicleChanges * 10));
  const endurance = Math.min(100, Math.floor((s.duration / 300) * 100));
  const strategy = Math.min(100, (s.choicesMade * 10) + (s.finalResources.reputation > 30 ? 20 : 0));
  const survival = isVictory ? 100 : isExit ? Math.min(80, s.finalResources.progress) : Math.min(50, s.finalResources.progress);

  const radarData = [
    { stat: "Aggression", value: aggression },
    { stat: "Exploration", value: exploration },
    { stat: "Resourcefulness", value: resourcefulness },
    { stat: "Endurance", value: endurance },
    { stat: "Strategy", value: strategy },
    { stat: "Survival", value: survival },
  ];

  const barData = [
    { name: "Gold Earned", value: s.goldEarned, fill: "hsl(var(--primary))" },
    { name: "Gold Spent", value: s.goldSpent, fill: "hsl(var(--destructive, 0 84% 60%))" },
    { name: "Food Used", value: Math.round(s.foodConsumed), fill: "hsl(30 80% 55%)" },
    { name: "Coins", value: s.coinsCollected, fill: "hsl(50 90% 55%)" },
    { name: "Encounters", value: s.encountersTriggered, fill: "hsl(200 80% 55%)" },
  ];

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}m ${s}s`;
  };

  const getPlayerArchetype = () => {
    const max = Math.max(aggression, exploration, resourcefulness, strategy, endurance);
    if (max === aggression) return { name: "The Warrior", icon: Swords, desc: "Aggressive and combat-focused playstyle" };
    if (max === exploration) return { name: "The Explorer", icon: MapPin, desc: "Curious and adventure-seeking playstyle" };
    if (max === resourcefulness) return { name: "The Merchant", icon: Coins, desc: "Resource-savvy and economical playstyle" };
    if (max === strategy) return { name: "The Strategist", icon: Brain, desc: "Careful and calculated playstyle" };
    return { name: "The Survivor", icon: Shield, desc: "Resilient and endurance-focused playstyle" };
  };

  const archetype = getPlayerArchetype();
  const ArchetypeIcon = archetype.icon;

  const overallRating = Math.round((aggression + exploration + resourcefulness + endurance + strategy + survival) / 6);

  const getGrade = (val: number) => {
    if (val >= 90) return { grade: "S", color: "text-primary" };
    if (val >= 75) return { grade: "A", color: "text-emerald-400" };
    if (val >= 60) return { grade: "B", color: "text-blue-400" };
    if (val >= 40) return { grade: "C", color: "text-yellow-400" };
    if (val >= 20) return { grade: "D", color: "text-orange-400" };
    return { grade: "F", color: "text-red-400" };
  };

  const overall = getGrade(overallRating);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 mt-8">
      {/* Header */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-3 right-3">
          <button onClick={onClear} className="text-[10px] px-3 py-1 rounded-full border border-border/30 bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors">
            Clear
          </button>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            {isVictory ? <Trophy className="w-7 h-7 text-primary" /> : isExit ? <Gamepad2 className="w-7 h-7 text-muted-foreground" /> : <Skull className="w-7 h-7 text-destructive" />}
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              {isVictory ? "Victory Analysis" : isExit ? "Session Analysis" : "Game Over Analysis"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Player: <span className="text-foreground font-semibold">{s.playerName}</span> • {s.timestamp}
            </p>
          </div>
          <div className="ml-auto text-center">
            <div className={`text-5xl font-black ${overall.color}`}>{overall.grade}</div>
            <div className="text-[10px] text-muted-foreground font-semibold uppercase">Overall</div>
          </div>
        </div>

        {/* Archetype */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/20">
          <ArchetypeIcon className="w-5 h-5 text-primary" />
          <div>
            <span className="text-sm font-bold text-foreground">{archetype.name}</span>
            <span className="text-xs text-muted-foreground ml-2">{archetype.desc}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "Duration", value: formatDuration(s.duration), icon: Clock },
          { label: "Score", value: finalScore.toString(), icon: Trophy },
          { label: "Gold", value: s.finalResources.gold.toString(), icon: Coins },
          { label: "Reputation", value: s.finalResources.reputation.toString(), icon: Star },
          { label: "Regions", value: s.finalResources.journeyCount.toString(), icon: MapPin },
          { label: "Crew", value: s.finalResources.passengers.length.toString(), icon: Users },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-4 text-center">
            <stat.icon className="w-4 h-4 mx-auto mb-1 text-primary" />
            <div className="text-lg font-bold text-foreground">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="glass-card border-border/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Player Behavior Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <PolarAngleAxis dataKey="stat" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Player" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resource Flow Bar Chart */}
        <Card className="glass-card border-border/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Resource Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.2} />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Skill Breakdown */}
      <Card className="glass-card border-border/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Detailed Skill Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {radarData.map((skill) => {
            const g = getGrade(skill.value);
            return (
              <div key={skill.stat} className="flex items-center gap-3">
                <span className="w-28 text-xs font-semibold text-muted-foreground">{skill.stat}</span>
                <div className="flex-1">
                  <Progress value={skill.value} className="h-2" />
                </div>
                <span className="w-10 text-right text-xs font-bold text-foreground">{skill.value}</span>
                <span className={`w-6 text-center text-xs font-black ${g.color}`}>{g.grade}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card className="glass-card border-border/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-primary" /> Session Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: "Encounters", value: s.encountersTriggered, icon: "⚔️" },
              { label: "Choices Made", value: s.choicesMade, icon: "🎯" },
              { label: "Coins Collected", value: s.coinsCollected, icon: "🪙" },
              { label: "Passengers Hired", value: s.passengersOnboarded, icon: "👤" },
              { label: "Bullets Fired", value: s.bulletsShot, icon: "💥" },
              { label: "Vehicle Swaps", value: s.vehicleChanges, icon: "🚗" },
              { label: "Mystery Boxes", value: s.mysteryBoxesOpened, icon: "📦" },
              { label: "Damages Taken", value: s.damagesTaken, icon: "💔" },
              { label: "Food Consumed", value: Math.round(s.foodConsumed), icon: "🥩" },
              { label: "Gold Earned", value: s.goldEarned, icon: "💰" },
              { label: "Gold Spent", value: s.goldSpent, icon: "💸" },
              { label: "Progress", value: `${Math.round(s.finalResources.progress)}%`, icon: "📍" },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-secondary/20 border border-border/10">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <div className="text-sm font-bold text-foreground">{item.value}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">{item.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Final Verdict */}
      <div className="glass-card p-6 text-center">
        <h3 className="text-lg font-display font-bold text-foreground mb-2">Final Verdict</h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {isVictory
            ? `Congratulations ${s.playerName}! You conquered the roads with a ${archetype.name} playstyle. Your ${overallRating >= 70 ? "exceptional" : "solid"} performance across ${s.finalResources.journeyCount} regions earned you a grade of ${overall.grade}.`
            : isExit
            ? `${s.playerName}, you left the journey at ${Math.round(s.finalResources.progress)}% progress. Your ${archetype.name} approach showed ${overallRating >= 50 ? "promise" : "early signs of growth"}. Grade: ${overall.grade}.`
            : `${s.playerName}, the road claimed you at ${Math.round(s.finalResources.progress)}% progress. As ${archetype.name}, you ${overallRating >= 40 ? "put up a good fight" : "have room to improve"}. Grade: ${overall.grade}.`
          }
        </p>
      </div>
    </motion.div>
  );
};

export default PostGameAnalysis;
