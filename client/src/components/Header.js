// /client/src/components/Header.js
import React from "react";
import styles from "./Header.module.css";
import { Menu, Bug } from "lucide-react";
import { useTranslation } from "react-i18next";

const Header = ({ toggleSidebar, toggleTheme, isDark }) => {
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      <h1 className={styles.title}>
        <Bug size={20} style={{ marginRight: "0.4rem" }} /> {t("Smart Pest Vision AI")}
      </h1>

      <button className={styles.themeBtn} onClick={toggleTheme}>
        {isDark ? "🌙 " + t("Dark") : "☀️ " + t("Light")}
      </button>
    </header>
  );
};

export default Header;
