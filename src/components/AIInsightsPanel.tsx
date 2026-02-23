import { motion } from "framer-motion";
import { Brain, AlertTriangle, Shield, Zap, Target, Activity, TrendingUp, BarChart3 } from "lucide-react";

const AIInsightsPanel = () => {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="glass-card-glow p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-primary icon-glow" />
          <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: "Weakest Attribute", value: "Spin Defense", icon: AlertTriangle, color: "text-destructive" },
            { label: "Suggested Improvement", value: "Add pace bowler", icon: Target, color: "text-neon-green" },
            { label: "Terrain Compatibility", value: "78%", icon: Shield, color: "text-neon-cyan" },
            { label: "Risk Index", value: "Low", icon: Zap, color: "text-primary" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-2">
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-neon-green" />
          <h3 className="text-sm font-semibold text-foreground">Team Synergy</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: "Role Balance", value: 82, color: "bg-primary" },
            { label: "Adaptability", value: 74, color: "bg-neon-green" },
            { label: "Consistency", value: 91, color: "bg-neon-cyan" },
            { label: "Momentum", value: 67, color: "bg-primary" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-xs font-semibold text-foreground">{item.value}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${item.color}`}
                  style={{ boxShadow: "0 0 8px hsl(75 100% 50% / 0.4)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AIInsightsPanel;
