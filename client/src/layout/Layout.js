// /client/src/layout/Layout.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import FloatingChatbot from "../components/FloatingChatbot";
import Header from "../components/Header";
import styles from "./Layout.module.css";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.toggle("dark", savedTheme === "dark");
    setIsDark(savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className={styles.appWrapper}>
      <Sidebar isOpen={!isCollapsed} toggleSidebar={toggleSidebar} />

      <div className={styles.contentArea}>
        <Header toggleSidebar={toggleSidebar} toggleTheme={toggleTheme} isDark={isDark} />

        <main className={styles.main}>
          {/* ✅ Replaced problematic backgroundLayer div with inline styles */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "url('/background.jpg') center/cover no-repeat",
              filter: "blur(0px)",
              zIndex: 0,
              opacity: 0.6,
              pointerEvents: "none",
            }}
          ></div>

          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
          </div>
        </main>

        <Footer />
      </div>

      <FloatingChatbot />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--card-bg)",
            color: "var(--text)",
            fontSize: "0.95rem",
          },
        }}
      />
    </div>
  );
};

export default Layout;
