// /client/src/pages/YOLOVideo.js
import React, { useState } from "react";
import axios from "axios";
import styles from "./ResNet.module.css";
import { useTranslation } from "react-i18next";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import toast from "react-hot-toast";

const YOLOVideo = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showStream, setShowStream] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const formData = new FormData();
    formData.append("video", file);

    try {
      setUploading(true);
      await axios.post("http://localhost:5000/upload-video", formData);
      setShowStream(true); // Trigger MJPEG stream
    } catch (err) {
      console.error("Video upload error:", err);
      toast.error(t("Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatedPageWrapper>
      <div className={styles.container}>
        <h2 className={styles.heading}>📹 {t("Live Pest Detection (YOLOv8)")}</h2>

        {/* ✅ Styled video upload */}
        <label className={styles.uploadLabel}>
          {t("Choose Video")}
          <input type="file" accept="video/*" onChange={handleUpload} hidden />
        </label>

        <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
          {selectedFile ? selectedFile.name : t("No file selected")}
        </p>

        {uploading && <p style={{ fontStyle: "italic", marginTop: "1rem" }}>{t("Uploading...")}</p>}

        {showStream && (
          <div>
            <h4 style={{ marginTop: "1rem" }}>{t("Live Detection Stream")}:</h4>
            <img
              src="http://localhost:5000/video-stream"
              alt="Live Detection Stream"
              style={{
                width: "640px",
                borderRadius: "12px",
                boxShadow: "0 0 12px rgba(0,0,0,0.3)",
                marginTop: "1rem",
                maxWidth: "100%",
              }}
            />
          </div>
        )}
      </div>
    </AnimatedPageWrapper>
  );
};

export default YOLOVideo;
