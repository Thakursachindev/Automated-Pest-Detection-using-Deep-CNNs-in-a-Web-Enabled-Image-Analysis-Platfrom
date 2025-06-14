import React, { useState, useRef } from "react";
import axios from "axios";
import styles from "./ResNet.module.css";
import { useTranslation } from "react-i18next";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import toast from "react-hot-toast";

const YOLOWebcam = () => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const [detected, setDetected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setWebcamStream(stream);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Webcam error:", err);
      toast.error(t("Could not access webcam"));
    }
  };

  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    const video = videoRef.current;

    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvasRef.current.toBlob(async (blob) => {
      const file = new File([blob], "snapshot.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("image", file);

      try {
        setLoading(true);
        const res = await axios.post("http://localhost:5000/api/predict/yolo/webcam", formData);
        const { image, detected } = res.data;

        setPreview(`data:image/jpeg;base64,${image}`);
        setDetected(detected);
      } catch (err) {
        console.error("YOLO prediction error:", err);
        toast.error(t("Detection failed"));
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  return (
    <AnimatedPageWrapper>
    <div className={styles.container}>
      <h2 className={styles.heading}>🎥 {t("Real-Time Webcam Detection")}</h2>

      <button className={styles.button} onClick={startWebcam}>
        🎬 {t("Start Camera")}
      </button>

      {webcamStream && (
        <>
          <div className={styles.videoContainer}>
            <video ref={videoRef} autoPlay muted className={styles.video} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>

          <button className={styles.button} onClick={captureAndDetect}>
            📸 {t("Capture Photo")}
          </button>
        </>
      )}

      {loading && <p style={{ fontStyle: "italic" }}>{t("Classifying...")}</p>}

      {preview && (
        <div className={styles.result}>
          <h3>🪲 {t("Detection Result")}</h3>
          <img src={preview} alt="Detection" className={styles.preview} />
          <p>
            {t("Detected")}: {detected.join(", ") || t("None")}
          </p>
        </div>
      )}
    </div>
    </AnimatedPageWrapper>
  );
};

export default YOLOWebcam;
