# /server/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
from io import BytesIO
import base64
import tempfile
import cv2

from utils import get_label_name
from utils import load_model, preprocess_image, predict
from pest_data import pest_database

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__, static_folder="static")
CORS(app)

resnet_model = load_model("server/resnet50_0.497.pkl", model_type='resnet')
yolo_model = load_model("server/best.pt", model_type='yolo')

@app.route("/api/predict/resnet", methods=["POST"])
def predict_resnet():
    image_file = request.files.get("image")
    if image_file:
        image = Image.open(image_file).convert("RGB")
        tensor = preprocess_image(image, model_type='resnet')
        class_index, confidence = predict(resnet_model, tensor, model_type='resnet')
        # class_name = list(pest_database.keys())[class_index]  # same order used in training
        class_name = get_label_name(class_index)

        return jsonify({
            "prediction": class_name,
            "confidence": confidence
        })
    return jsonify({"error": "No image uploaded"}), 400


@app.route("/api/predict/yolo", methods=["POST"])
def predict_yolo():
    image_file = request.files.get("image")
    if image_file:
        image = Image.open(image_file).convert("RGB")
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp_file:
            image.save(tmp_file.name)
            results = yolo_model(tmp_file.name)
            detected_classes = [results[0].names[int(cls)] for cls in results[0].boxes.cls]
            annotated = results[0].plot()

            _, buffer = cv2.imencode('.jpg', annotated)
            encoded_image = base64.b64encode(buffer).decode('utf-8')
            return jsonify({"detected": detected_classes, "image": encoded_image})
    return jsonify({"error": "No image uploaded"}), 400

from flask import send_file
from flask import Response

@app.route("/api/predict/yolo/video", methods=["POST"])
def predict_yolo_video():
    video = request.files.get("video")
    if not video:
        return "No video uploaded", 400

    # Save uploaded video to temp
    temp_path = os.path.join("temp.mp4")
    with open(temp_path, "wb") as f:
        f.write(video.read())

    def generate():
        cap = cv2.VideoCapture(temp_path)

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            results = yolo_model(frame)
            annotated = results[0].plot()

            _, buffer = cv2.imencode(".jpg", annotated)
            frame_bytes = buffer.tobytes()

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" +
                frame_bytes + b"\r\n"
            )

        cap.release()

    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")


@app.route("/api/pest-info", methods=["GET"])
def pest_info():
    pest_name = request.args.get("name", "").lower().strip()
    if pest_name and pest_name in pest_database:
        return jsonify(pest_database[pest_name])
    return jsonify({"error": "Pest not found"}), 404

@app.route("/api/chat", methods=["POST"])
def gemini_chat():
    user_input = request.json.get("message", "")
    if not user_input:
        return jsonify({"error": "Empty message"}), 400

    model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction = """
You are a smart multilingual chatbot assistant integrated into the Smart Pest Vision AI web application.

This application offers the following features:
- **Pest Classification** using **ResNet50** via image upload or real-time webcam capture.
- **Pest Detection** using **YOLOv8** via:
  - Image upload
  - Webcam (real-time object detection)
  - Video file upload with MJPEG stream playback
- **Multilingual Support** with inline translations for major Indian languages (Hindi, Tamil, Telugu, Bengali, etc.).
- **Dark and Light Theme Switching** with persistent user preference using localStorage.
- **Interactive Sidebar Navigation** (collapsible on desktop, toggleable via hamburger icon on mobile).
- **Floating Chatbot Interface** for real-time help (styled for both themes).
- **Pest Info Lookup** where users can enter a pest class name to get detailed information.
- **Animated Page Transitions** and **UI feedback** through toast notifications for errors and interactions.
- **Custom-styled inputs** for file and video uploads to improve appearance.

As the chatbot:
- Help users understand how to use each feature with step-by-step instructions.
- Answer pest-related queries or redirect users to relevant tools like pest lookup.
- Provide troubleshooting tips for issues like:
  - Webcam not detected
  - File not uploading
  - Translations not appearing
- Use Markdown formatting for clarity:
  - **Bold** key terms
  - `Code formatting` for UI labels or buttons
  - Bullet lists or numbered steps for instructions

Always prioritize clarity, relevance, and helpful tone based on the app context.
"""

)

    chat = model.start_chat(history=[])
    response = chat.send_message(user_input)
    return jsonify({"reply": response.text})

from flask import Response

@app.route("/upload-video", methods=["POST"])
def upload_video():
    video = request.files.get("video")
    if not video:
        return jsonify({"error": "No video uploaded"}), 400

    os.makedirs("uploads", exist_ok=True)
    video_path = os.path.join("uploads", "input.mp4")

    with open(video_path, "wb") as f:
        f.write(video.read())

    return jsonify({"message": "Video uploaded successfully"})

@app.route("/video-stream")
def video_stream():
    video_path = os.path.join("uploads", "input.mp4")

    if not os.path.exists(video_path):
        return "No uploaded video found", 404

    def generate():
        cap = cv2.VideoCapture(video_path)

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            results = yolo_model(frame)
            annotated = results[0].plot()

            _, buffer = cv2.imencode(".jpg", annotated)
            frame_bytes = buffer.tobytes()

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" +
                frame_bytes + b"\r\n"
            )

        cap.release()

    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")

@app.route("/api/predict/yolo/webcam", methods=["POST"])
def predict_yolo_webcam():
    image_file = request.files.get("image")
    if image_file:
        image = Image.open(image_file).convert("RGB")
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp_file:
            image.save(tmp_file.name)
            # ✅ Load yolov8n.pt only for this route
            webcam_model = load_model("server/best.pt", model_type='yolo')
            results = webcam_model(tmp_file.name)
            detected_classes = [results[0].names[int(cls)] for cls in results[0].boxes.cls]
            annotated = results[0].plot()

            _, buffer = cv2.imencode('.jpg', annotated)
            encoded_image = base64.b64encode(buffer).decode('utf-8')
            return jsonify({"detected": detected_classes, "image": encoded_image})
    return jsonify({"error": "No image uploaded"}), 400


if __name__ == "__main__":
    app.run(debug=True)