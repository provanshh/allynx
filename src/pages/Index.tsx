import { useState } from "react";
import { Target, Users, Brain, BarChart3, Crown } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import HeroBanner from "@/components/HeroBanner";
import KPICard from "@/components/KPICard";
import SportDonutChart from "@/components/SportDonutChart";
import PerformanceGraph from "@/components/PerformanceGraph";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import ProfileCard from "@/components/ProfileCard";
import StrategyArena from "@/components/StrategyArena";
import LeaderboardPreview from "@/components/LeaderboardPreview";
import TeamBuilderTab from "@/components/tabs/TeamBuilderTab";
import AICompareTab from "@/components/tabs/AICompareTab";
import FullArenaTab from "@/components/tabs/FullArenaTab";
import AuctionTab from "@/components/tabs/AuctionTab";
import TerrainTab from "@/components/tabs/TerrainTab";
import CrossSportTab from "@/components/tabs/CrossSportTab";
import LeaderboardTab from "@/components/tabs/LeaderboardTab";
import ProfileTab from "@/components/tabs/ProfileTab";
import SettingsTab from "@/components/tabs/SettingsTab";

const kpis = [
  { title: "Total Strategy Score", value: "9,247", change: 4.5, icon: Target },
  { title: "Active Teams Built", value: "12", change: 2.1, icon: Users },
  { title: "AI Accuracy Index", value: "94.2%", change: 1.8, icon: Brain },
  { title: "Weekly Rank", value: "#42", change: -3.2, icon: BarChart3 },
  { title: "Dominance Score", value: "87.5", change: 5.6, icon: Crown },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTabContent = () => {
    switch (activeTab) {
      case "team-builder":
        return <TeamBuilderTab />;
      case "ai-compare":
        return <AICompareTab />;
      case "arena":
        return <FullArenaTab />;
      case "auction":
        return <AuctionTab />;
      case "terrain":
        return <TerrainTab />;
      case "cross-sport":
        return <CrossSportTab />;
      case "leaderboard":
        return <LeaderboardTab />;
      case "profile":
        return <ProfileTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return (
          <>
            <HeroBanner />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {kpis.map((kpi, i) => (
                <KPICard key={kpi.title} {...kpi} delay={i * 0.1} />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SportDonutChart />
                  <PerformanceGraph />
                </div>
                <StrategyArena />
                <LeaderboardPreview />
              </div>
              <div className="space-y-6">
                <ProfileCard />
                <AIInsightsPanel />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="ml-[72px] p-6 max-w-[1600px]">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default Index;
