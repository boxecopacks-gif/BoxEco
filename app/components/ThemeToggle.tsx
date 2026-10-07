"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // storage blocked: the theme just won't be remembered
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Switch between dark and light theme"
      className="ml-auto rounded-lg border border-white/40 px-3 py-1 text-sm hover:bg-white/10"
    >
      {dark ? "Light mode" : "Dark mode"}
    </button>
  );
}