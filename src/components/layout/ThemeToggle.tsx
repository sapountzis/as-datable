"use client";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}
const readTheme = () => document.documentElement.classList.contains("dark");
const serverTheme = () => false;
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.classList.toggle("light", !next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* The control also works without persistent storage. */
    }
  }
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
