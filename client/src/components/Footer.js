import React from "react";
import styles from "./Footer.module.css";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation(); // ✅ move inside function

  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} {t("Smart Pest Vision AI · All rights reserved.")}
      </p>
    </footer>
  );
};

export default Footer;
