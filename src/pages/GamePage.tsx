import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Trophy, ArrowLeft, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";
import GameEngine from "@/game/GameEngine";
import PlayerComparison from "@/components/PlayerComparison";
import AIPlayerComparison from "@/components/AIPlayerComparison";
import gamingBgVideo from "@/assets/gaming-bg.mp4";

interface LeaderboardEntry {
  name: string;
  score: number;
  gold: number;
  reputation: number;
  date: string;
}

const GamePage = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isGaming, setIsGaming] = useState(() => document.documentElement.classList.contains("gaming"));

  useEffect(() => {
    const observer = new MutationObserver(() => setIsGaming(document.documentElement.classList.contains("gaming")));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("game-leaderboard");
    if (saved) setLeaderboard(JSON.parse(saved));
  }, []);

  const handleGameEnd = (score: number, gold: number, reputation: number) => {
    const entry: LeaderboardEntry = { name: playerName, score, gold, reputation, date: new Date().toLocaleDateString() };
    const updated = [...leaderboard, entry].sort((a, b) => b.score - a.score).slice(0, 20);
    setLeaderboard(updated);
    localStorage.setItem("game-leaderboard", JSON.stringify(updated));
  };

  const handleExit = () => {
    setGameStarted(false);
  };

  const handleStartGame = () => {
    if (playerName.trim().length >= 2) setGameStarted(true);
  };

  if (gameStarted) {
    return <GameEngine playerName={playerName} onGameEnd={handleGameEnd} onExit={handleExit} />;
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden transition-colors duration-300 relative">
      {isGaming && (
        <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0 opacity-25 pointer-events-none" src={gamingBgVideo} />
      )}

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/30 backdrop-blur-xl bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center neon-border">
              <Zap className="w-4 h-4 text-primary icon-glow" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">AI Sports League</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" onClick={() => navigate("/")} className="text-xs h-9 px-4">
              <ArrowLeft className="w-3 h-3 mr-1" /> Back
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-6 max-w-6xl mx-auto relative z-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Gamepad2 className="w-4 h-4 text-primary" />
            <span className="text-xs text-primary font-medium">Caravan Crossroads</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            Play the <span className="neon-text">Game</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Navigate the treacherous roads, trade with NPCs, build your crew, and reach the Haven!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Name Entry & Start */}
          <div className="space-y-0">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="glass-card p-8 flex flex-col items-center justify-center gap-6">
              <Gamepad2 className="w-12 h-12 text-primary icon-glow" />
              <h2 className="text-2xl font-display font-bold text-foreground">Enter Your Name</h2>
              <p className="text-sm text-muted-foreground text-center">Your name will appear on the leaderboard when the game ends.</p>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                className="max-w-xs text-center text-lg h-12 bg-secondary/50 border-border/30"
                onKeyDown={(e) => e.key === 'Enter' && handleStartGame()}
              />
              <Button
                onClick={handleStartGame}
                disabled={playerName.trim().length < 2}
                size="lg"
                className="bg-primary text-primary-foreground text-lg h-14 px-12 hover:shadow-[0_0_40px_hsl(75_100%_50%/0.4)] transition-shadow disabled:opacity-50"
              >
                <Gamepad2 className="w-5 h-5 mr-2" /> START GAME
              </Button>
              <div className="text-xs text-muted-foreground space-y-1 text-center mt-4">
                <p><strong>Controls:</strong> WASD to move, E to onboard, P to trade, V for hangar</p>
                <p>C to exit/enter vehicle, SPACE to pause, S for settings</p>
              </div>
            </motion.div>

            {/* Player Comparison */}
            <PlayerComparison leaderboard={leaderboard} />
          </div>

          {/* AI Player Comparison - Full Width */}
          <div className="lg:col-span-2">
            <AIPlayerComparison />
          </div>

          {/* Leaderboard */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-8">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-primary icon-glow" />
              <h2 className="text-2xl font-display font-bold text-foreground">Leaderboard</h2>
            </div>
            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No scores yet. Be the first to play!</p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="grid grid-cols-[40px_1fr_70px_60px_60px] gap-2 text-[10px] text-muted-foreground pb-2 border-b border-border/30 font-semibold">
                  <span>Rank</span><span>Player</span><span className="text-right">Score</span><span className="text-right">Gold</span><span className="text-right">Fame</span>
                </div>
                {leaderboard.map((entry, i) => (
                  <div key={i} className={`grid grid-cols-[40px_1fr_70px_60px_60px] gap-2 items-center py-2.5 text-xs border-b border-border/10 ${i < 3 ? 'bg-primary/5 rounded-lg px-1' : ''}`}>
                    <span className={i < 3 ? "font-bold neon-text" : "text-muted-foreground font-semibold"}>#{i + 1}</span>
                    <span className="font-medium text-foreground truncate">{entry.name}</span>
                    <span className="text-right font-semibold text-foreground">{entry.score}</span>
                    <span className="text-right text-muted-foreground">{entry.gold}</span>
                    <span className="text-right text-muted-foreground">{entry.reputation}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
