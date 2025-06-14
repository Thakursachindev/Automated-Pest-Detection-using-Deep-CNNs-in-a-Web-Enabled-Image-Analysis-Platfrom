// /client/src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import styles from "./Sidebar.module.css";
import ThemeToggle from "./ThemeToggle";
import { Bug } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <h2 className={styles.logo}>
          <Bug size={20} style={{ marginRight: "0.4rem", width: "25px" }}  /> {t("Smart Pest Vision")}
        </h2>
        <button onClick={toggleSidebar} className={styles.closeBtn}>❌</button>
      </div>

      <nav className={styles.nav}>
        <Link to="/" className={styles.link}>🧠 {t("ResNet")}</Link>
        <Link to="/yolo" className={styles.link}>🎯 {t("YOLO")}</Link>
        <Link to="/yolo-video" className={styles.link}>📹 {t("YOLO Video")}</Link>
        <Link to="/yolo/webcam" className={styles.link}>🎥 {t("YOLO Webcam")}</Link>
        <Link to="/lookup" className={styles.link}>🔍 {t("Lookup")}</Link>
      </nav>

      <div className={styles.language}>
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebar;
