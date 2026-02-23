import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Gamepad2 } from "lucide-react";

export type ThemeMode = "dark" | "light" | "gaming";

const themes: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
  { mode: "dark", icon: Moon, label: "Dark" },
  { mode: "light", icon: Sun, label: "Light" },
  { mode: "gaming", icon: Gamepad2, label: "Gaming" },
];

export const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem("theme") as ThemeMode | null;
  if (saved && ["dark", "light", "gaming"].includes(saved)) return saved;
  return "dark";
};

export const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.remove("light", "gaming");
  if (mode === "light") root.classList.add("light");
  if (mode === "gaming") root.classList.add("gaming");
  localStorage.setItem("theme", mode);
};

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const cycleTheme = () => {
    const idx = themes.findIndex((t) => t.mode === theme);
    const next = themes[(idx + 1) % themes.length];
    setTheme(next.mode);
  };

  const current = themes.find((t) => t.mode === theme)!;
  const Icon = current.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      onClick={cycleTheme}
      className={`w-9 h-9 rounded-xl flex items-center justify-center border border-border/50 bg-secondary/50 hover:bg-secondary transition-colors ${className}`}
      aria-label={`Theme: ${current.label}`}
      title={`Current: ${current.label} — Click to switch`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          <Icon className="w-4 h-4 text-primary" />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
