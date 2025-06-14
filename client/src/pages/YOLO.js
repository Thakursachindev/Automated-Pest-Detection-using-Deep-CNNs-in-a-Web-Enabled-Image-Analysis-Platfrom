// /client/src/pages/YOLO.js
import React, { useState } from "react";
import axios from "axios";
import styles from "./ResNet.module.css";
import { useTranslation } from "react-i18next";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import toast from "react-hot-toast";

const YOLO = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [detectedClasses, setDetectedClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setOutputImage(null);
    setDetectedClasses([]);
  };

  const handleYOLODetect = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/predict/yolo", formData);
      const { image, detected } = res.data;

      setOutputImage(`data:image/jpeg;base64,${image}`);
      setDetectedClasses(detected);
    } catch (err) {
      console.error("YOLO detection error:", err);
      toast.error("Something went wrong during YOLO detection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPageWrapper>
      <div className={styles.container}>
        <h2 className={styles.heading}>🎯 {t("YOLOv8 Pest Detection")}</h2>

        {/* ✅ Custom File Input */}
        <label className={styles.uploadLabel}>
          {t("Choose File")}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </label>

        <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
          {selectedImage ? selectedImage.name : t("No file selected")}
        </p>

        {preview && (
          <>
            <h4 style={{ marginTop: "1rem" }}>📷 {t("Uploaded Image")}:</h4>
            <img src={preview} alt="preview" className={styles.preview} />
          </>
        )}

        <button
          onClick={handleYOLODetect}
          disabled={!selectedImage || loading}
          className={styles.predictButton}
        >
          {loading ? t("Detecting...") : t("Detect Pest")}
        </button>

        {outputImage && (
          <>
            <h4 style={{ marginTop: "2rem" }}>✅ {t("YOLO Detection Result")}:</h4>
            <img src={outputImage} alt="result" className={styles.preview} />
          </>
        )}

        {detectedClasses.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <h4>🐛 {t("Detected Pests")}:</h4>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {detectedClasses.map((cls, i) => (
                <li key={i}>• {cls}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AnimatedPageWrapper>
  );
};

export default YOLO;
