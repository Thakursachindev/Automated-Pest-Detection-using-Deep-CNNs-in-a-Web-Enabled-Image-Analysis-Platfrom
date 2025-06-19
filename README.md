# 🌾 Automated-Pest-Detection-using-Deep-CNNs-in-a-Web-Enabled-Image-Analysis-Platfrom 🔍🐛

An intelligent, multilingual, and real-time web application for automated **pest detection and classification** using deep learning and computer vision. Built with cutting-edge CNN and YOLOv8 models, integrated into a user-friendly interface to support farmers and researchers in precision agriculture.

---

## 🚀 Features

✅ **102-Class Pest Classification** (ResNet-based)  
✅ **YOLOv8 Real-Time Pest Detection** (Image, Video, Webcam)  
✅ **Multilingual Interface** using Google Translate API  
✅ **Dynamic Theme Switching** (Light / Dark Mode)  
✅ **Interactive GPT-Powered Chatbot** for farmer assistance  
✅ **Text-based Pest Info Lookup** (Type any pest class and get full details!)  
✅ **Streamlit Sidebar Model Selector with React and Flask**

---

## 🧠 Deep Learning Models Used

| Task               | Model       | Framework  |
|--------------------|-------------|------------|
| Classification     | ResNet-50   | PyTorch    |
| Object Detection   | YOLOv8      | Ultralytics|

All models trained/tested on the **IP102 v1.1** dataset.

---

## 📊 Technologies & Libraries

- **Backend:** Python, PyTorch, TensorFlow  
- **Frontend:** React
- Backend: ** Flask  
- **Image Processing:** OpenCV, PIL, NumPy  
- **Data Augmentation:** Albumentations  
- **Utilities:** Googletrans, Matplotlib  
- **Model Integration:** YOLOv8, ResNet  
- **Chatbot:** GPT-based (Text-based AI assistant)

---

## 🌐 Web App Functionalities

| Module            | Description |
|------------------|-------------|
| 🐞 Classifier     | Upload an image → Predict pest class (ResNet) |
| 🕵️ Detector       | Detect pests using YOLOv8 (Image / Video / Webcam) |
| 📖 Pest Info      | Enter pest name → Get type, advantages, prevention, chemical formula |
| 🤖 GPT Chatbot    | Ask any pest-related question in any language |
| 🌍 Language Switch | Supports English, Hindi, Tamil, etc. |
| 🎨 Theme Switch   | Toggle between light and dark UI themes |

---

## 📁 Dataset

**[IP102 v1.1](https://github.com/xieziyu/IP102)** — A large-scale benchmark dataset for agricultural pest detection and classification with:
- 75,000+ images
- 102 pest categories
- Labeled bounding boxes and species names

---

## 🛠️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/yourusername/smart-pest-vision-ai.git
cd smart-pest-vision-ai

# Create a virtual environment and activate it
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run the app
streamlit run app.py
