import { createRoot } from "react-dom/client";
import { applyTheme, getInitialTheme } from "./components/ThemeToggle";
import App from "./App.tsx";
import "./index.css";

// Apply saved theme before render to prevent flash
applyTheme(getInitialTheme());

createRoot(document.getElementById("root")!).render(<App />);
