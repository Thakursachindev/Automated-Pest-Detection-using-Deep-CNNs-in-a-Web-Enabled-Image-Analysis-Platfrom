// /client/src/components/ThemeToggle.js
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

const ThemeToggle = () => {
  const { t } = useTranslation();

  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      title={darkMode ? t("Switch to Light Mode") : t("Switch to Dark Mode")}
      style={{
        background: "none",
        border: "none",
        color: "var(--text)",
        cursor: "pointer",
        fontSize: "1.2rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginTop: "1rem",
      }}
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      {darkMode ? t("Light Mode") : t("Dark Mode")}
    </button>
  );
};

export default ThemeToggle;
