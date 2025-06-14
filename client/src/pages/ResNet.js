import React, { useState, useRef } from "react";
import axios from "axios";
import styles from "./ResNet.module.css";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import toast from "react-hot-toast";
import { Bug } from "lucide-react";
import { useTranslation } from "react-i18next";

const ResNet = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const { t } = useTranslation();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setPrediction("");
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/predict/resnet", formData);
      const { prediction, confidence } = res.data;

      const denylist = [
        "lycorma delicatula",
        "cicadellidae",
        "erythroneura apicalis",
      ];

      if (confidence < 0.5 || denylist.includes(prediction.toLowerCase())) {
        setPrediction(t("❌ No confident pest class detected"));
      } else {
        setPrediction(
          `${t("✅ Predicted Pest")}: ${prediction}`
        );
      }
    } catch (err) {
      console.error("Prediction error:", err);
      toast.error(t("Something went wrong while predicting."));
    } finally {
      setLoading(false);
    }
  };

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

  const captureFromWebcam = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    const video = videoRef.current;

    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvasRef.current.toBlob((blob) => {
      const file = new File([blob], "snapshot.jpg", {
        type: "image/jpeg",
      });
      setSelectedImage(file);
      setPreview(URL.createObjectURL(blob));
      setPrediction("");
    }, "image/jpeg");
  };

  return (
    <AnimatedPageWrapper>
      <div className={styles.container}>
        <h2 className={styles.heading}>🧠 {t("ResNet50 Image Classification")}</h2>

        <div className={styles.card}>
          <div className={styles.actions}>
            <label className={styles.uploadLabel}>
              📁 {t("Upload Image")}
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>

            <button className={styles.button} onClick={startWebcam}>
              🎥 {t("Start Camera")}
            </button>

            {webcamStream && (
              <button className={styles.button} onClick={captureFromWebcam}>
                📸 {t("Capture Photo")}
              </button>
            )}
          </div>

          {webcamStream && (
            <div className={styles.videoWrapper}>
              <video ref={videoRef} className={styles.video} autoPlay muted playsInline />
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
          )}

          {preview && (
            <img src={preview} alt={t("Captured Image")} className={styles.preview} />
          )}

          <button
            className={styles.predictButton}
            onClick={handleSubmit}
            disabled={!selectedImage || loading}
          >
            {loading ? `🔍 ${t("Classifying...")}` : `✅ ${t("Classify Pest")}`}
          </button>

          {prediction && (
            <div className={styles.result}>
              <h3><Bug size={20} style={{ marginRight: "0.4rem" }} />{t("Predicted Class")}:</h3>
              <p>{prediction}</p>
            </div>
          )}
        </div>
      </div>
    </AnimatedPageWrapper>
  );
};

export default ResNet;
