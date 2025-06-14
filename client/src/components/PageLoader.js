// /client/src/components/PageLoader.js
import React from "react";
import { motion } from "framer-motion";
import "./PageLoader.css";
import { useTranslation } from "react-i18next";

const PageLoader = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="loader-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="spinner" />
      <p className="loading-text">{t("Loading...")}</p>
    </motion.div>
  );
};

export default PageLoader;
