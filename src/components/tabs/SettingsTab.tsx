import { motion } from "framer-motion";
import { Settings, Bell, Palette, Shield, Globe, User, Moon, Volume2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const settingGroups = [
  {
    title: "Notifications", icon: Bell,
    items: [
      { label: "Contest Alerts", desc: "Get notified when new contests go live", defaultOn: true },
      { label: "AI Insights", desc: "Receive weekly AI analysis reports", defaultOn: true },
      { label: "Leaderboard Updates", desc: "Notify when your rank changes", defaultOn: false },
      { label: "Team Suggestions", desc: "AI-powered team improvement tips", defaultOn: true },
    ]
  },
  {
    title: "Privacy", icon: Shield,
    items: [
      { label: "Public Profile", desc: "Allow others to view your profile", defaultOn: true },
      { label: "Show Rank", desc: "Display your rank on leaderboard", defaultOn: true },
      { label: "Activity Status", desc: "Show when you're online", defaultOn: false },
    ]
  },
];

const SettingsTab = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-xl font-display font-bold text-foreground">Settings</h2>
      <p className="text-xs text-muted-foreground mt-1">Manage your preferences and account settings</p>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Preferences */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Preferences</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-semibold text-foreground">Dark Mode</p>
                <p className="text-[10px] text-muted-foreground">Always on for this platform</p>
              </div>
            </div>
            <Switch defaultChecked disabled />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-semibold text-foreground">Sound Effects</p>
                <p className="text-[10px] text-muted-foreground">UI interaction sounds</p>
              </div>
            </div>
            <Switch />
          </div>
          <div className="p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs font-semibold text-foreground">Language</p>
            </div>
            <Select defaultValue="en">
              <SelectTrigger className="h-8 text-xs bg-secondary/50 border-border/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Toggle Settings */}
      {settingGroups.map((group, gi) => (
        <motion.div key={group.title} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + gi * 0.1 }}
          className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <group.icon className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
          </div>
          <div className="space-y-3">
            {group.items.map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                <div>
                  <p className="text-xs font-semibold text-foreground">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.defaultOn} />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default SettingsTab;
