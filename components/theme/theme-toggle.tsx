"use client";

import React from "react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "daily-habit-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const nextTheme: Theme = saved === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }

  const nextLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button className="theme-toggle" type="button" aria-label={nextLabel} aria-pressed={theme === "light"} onClick={toggleTheme}>
      <span aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span>
      <span className="theme-toggle-label">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
