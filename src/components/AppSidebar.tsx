import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, Brain, Swords, Gavel, Mountain,
  GitCompare, Trophy, User, Settings, Zap
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Users, label: "Team Builder", id: "team-builder" },
  { icon: Brain, label: "AI Compare", id: "ai-compare" },
  { icon: Swords, label: "Strategy Arena", id: "arena" },
  { icon: Gavel, label: "Auction Mode", id: "auction" },
  { icon: Mountain, label: "Terrain Mode", id: "terrain" },
  { icon: GitCompare, label: "Cross-Sport Battle", id: "cross-sport" },
  { icon: Trophy, label: "Leaderboard", id: "leaderboard" },
  { icon: User, label: "Profile", id: "profile" },
  { icon: Settings, label: "Settings", id: "settings" },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

const AppSidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <motion.aside
      initial={{ x: -80 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-screen w-[72px] flex flex-col items-center py-6 z-50 border-r border-border/30"
      style={{
        background: "linear-gradient(180deg, hsl(120 10% 5%) 0%, hsl(120 8% 3%) 100%)",
      }}
    >
      <div className="mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center neon-border">
          <Zap className="w-5 h-5 text-primary icon-glow" />
        </div>
      </div>

      <nav className="flex-1 flex flex-col items-center gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Tooltip key={item.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, hsl(75 100% 50% / 0.12), hsl(75 100% 50% / 0.04))",
                        border: "1px solid hsl(75 100% 50% / 0.25)",
                        boxShadow: "0 0 20px -5px hsl(75 100% 50% / 0.3)",
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <item.icon className={`w-5 h-5 relative z-10 ${isActive ? "icon-glow" : ""}`} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="glass-card border-border/50 text-foreground">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default AppSidebar;
