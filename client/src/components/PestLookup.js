import React, { useState } from "react";
import axios from "axios";
import styles from "../pages/ResNet.module.css";
import { useTranslation } from "react-i18next";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import toast from "react-hot-toast";
import { Bug } from "lucide-react";


const PestLookup = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");

  const fetchInfo = async () => {
    if (!query.trim()) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/pest-info?name=${query.toLowerCase().trim()}`
      );
      setInfo(res.data);
      setError("");
    } catch {
      setInfo(null);
      toast.error(t("Pest not found. Please check spelling."));
    }
  };

  return (
    <AnimatedPageWrapper>
    <div className={styles.container}>
      <h2 className={styles.heading}>🔍 {t("Pest Info Lookup")}</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Enter pest class name...")}
          className={styles.input}
          style={{
            padding: "0.6rem",
            width: "70%",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            marginRight: "1rem",
          }}
        />
        <button onClick={fetchInfo} className={styles.button}>
          {t("Search")}
        </button>
      </div>

      {info && (
        <div
          style={{
            marginTop: "1.5rem",
            backgroundColor: "var(--card-bg)",
            padding: "1.5rem",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            textAlign: "left",
          }}
        >
          <p><strong><Bug size={20} style={{ marginRight: "0.4rem" }} /> {t("Pest Type")}:</strong> {info["Pest Type"]}</p>
          <p><strong>✅ {t("Advantages")}:</strong> {info.Advantages}</p>
          <p><strong>⚠️ {t("Disadvantages")}:</strong> {info.Disadvantages}</p>
          <p><strong>🛡️ {t("Ways to Prevent")}:</strong> {info["Ways to Prevent"]}</p>
          <p><strong>🧪 {t("Chemical Formula")}:</strong> {info["Chemical Formula"]}</p>
        </div>
      )}
    </div>
    </AnimatedPageWrapper>
  );
};

export default PestLookup;
