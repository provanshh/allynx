import { motion } from "framer-motion";

const HeroBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl p-6 mb-6"
      style={{
        background: "linear-gradient(135deg, hsl(120 15% 8%) 0%, hsl(75 20% 6%) 50%, hsl(120 10% 5%) 100%)",
        border: "1px solid hsl(75 100% 50% / 0.1)",
      }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(75 100% 50%), transparent 70%)" }}
      />
      <h1 className="text-xl md:text-2xl font-display font-bold text-foreground mb-1">
        From Emotional Debate to <span className="neon-text">Intelligent Strategy.</span>
      </h1>
      <p className="text-xs md:text-sm text-muted-foreground max-w-lg">
        Build smarter teams. Analyze deeper. Compete with intelligence.
      </p>
    </motion.div>
  );
};

export default HeroBanner;
