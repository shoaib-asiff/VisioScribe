# 🧠 VisioScribe - AI Image Caption Generator

An end-to-end AI-powered application that generates human-like captions for images using deep learning. This project integrates a **React frontend**, **Node.js/Express backend**, and a **Machine Learning model** for image captioning, along with **Cloudinary** for image storage and **MongoDB Atlas** for data persistence.

---

## 🚀 Features

* 📸 Upload images and generate captions instantly
* 🤖 Deep learning-based image captioning model
* 🌐 RESTful API integration
* ☁️ Cloudinary image storage
* 🗄️ MongoDB Atlas database integration
* 🔄 Airflow-based scheduled model training (MLOps)
* 🐳 Docker containerization support
* ⚡ Scalable deployment-ready architecture

---

## 🏗️ Project Architecture

```
Frontend (React)
       ↓
Backend (Node.js + Express)
       ↓
ML Model (Caption Generator)
       ↓
Cloudinary + MongoDB Atlas
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Axios
* Tailwind CSS / CSS

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Machine Learning

* Python
* TensorFlow / PyTorch
* CNN + RNN / Transformer-based models

### DevOps & Tools

* Docker
* Apache Airflow
* AWS (ECR, ECS, S3, etc.)
* Git & GitHub

---

## 📂 Folder Structure

```
visioscribe/
│
├── frontend/            # React frontend
├── Backend/             # Node.js backend
├── Model/               # ML model code
├── dag/             # Airflow DAGs
├── docker-compose.yml              # Docker configs
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://dagshub.com/shoaib-asiff/VisioScribe.git
cd VisioScribe
```

### For Manual Run

### 2️⃣ Setup Backend

```bash
cd Backend
npm install
npm run dev
```

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4️⃣ Setup ML-Model
```bash
cd Model
python -m venv venv
venv\Scripts\activate (For Windows)
pip install -r requirements.txt
python captiongenerator_model.py
```

### For Auto Run
```bash
docker compose up
```

### 5️⃣ Setup Environment Variables

Create a `.env` file in backend:

```
PORT=
MONGOATLASURL=
CORS_ORIGIN=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL=
PASS=your-app-password-from-google-account-setting
REDIS_NAME=
REDIS_PASS=
REDIS_HOST=
REDIS_PORT=
MODEL_API=
OPEN_ROUTER_API_KEY=
SITE_NAME=
OPEN_ROUTER_MODEL=
```
---

Create `.env` file in frontend:
```bash
VITE_API_BASE_URL=url/
BACKEND_URL=your-url/api/
```
---

Create `.env` file in Model/Model_Trainer:
```bash
BATCH_SIZE=4
NUM_EPOCHS=5
LEARNING_RATE=0.0001

# DagsHub Configuration
DAGSHUB_REPO_OWNER=shoaib-asiff
DAGSHUB_REPO_NAME=VisioScribe
DAGSHUB_TOKEN=
DATASET_CSV_PATH=dataset.csv

# MLflow Configuration
MLFLOW_TRACKING_URI=https://dagshub.com/shoaib-asiff/VisioScribe.mlflowhttps://dagshub.com/shoaib-asiff/VisioScribe.mlflow
OPEN_ROUTER_API_KEY=
MODEL_NAME=visioscribe-blip
```
---

Create `.env` file in Model/Caption-Generator-Model:
```bash
PORT=
# DagsHub Configuration
DAGSHUB_REPO_OWNER=shoaib-asiff
DAGSHUB_REPO_NAME=VisioScribe
DAGSHUB_TOKEN=

# MLflow Configuration
MLFLOW_TRACKING_URI=https://dagshub.com/shoaib-asiff/VisioScribe.mlflow

DATASET_CSV_PATH=dataset.csv

OPEN_ROUTER_API_KEY=
MODEL_NAME=cvisioscribe-blip
```
---




## 🤖 How It Works

1. User uploads an image via the frontend
2. Image is sent to backend API
3. Backend uploads image to Cloudinary
4. ML model processes the image
5. Caption is generated and returned
6. Data is stored in MongoDB

---

## 📊 Model Details

This project uses a hybrid AI pipeline combining vision-language models and LLMs:

### 🖼️ Caption Generation Model

* **BLIP (Bootstrapping Language-Image Pretraining)** for image captioning
* Extracts visual features and generates initial captions

### 🧠 LLM Enhancement Layer

* **Meta LLM (via OpenRouter API)**

  * Refines and improves generated captions
  * Makes captions more human-like and context-aware

### 🔄 Data Feedback & Retraining Pipeline

* **NVIDIA LLM (via OpenRouter API)**

  * Analyzes stored captions and user interactions
  * Helps generate improved training data
  * Feeds updated data into retraining pipeline

### ⚙️ MLOps Integration

* **Apache Airflow** is used to:

  * Schedule periodic retraining jobs
  * Automate data pipeline updates
  * Maintain model performance over time

### 🔗 LLM Gateway

* Both Meta and NVIDIA LLMs are accessed through:

  * **OpenRouter API** for unified LLM integration

---

## 🧪 Future Improvements
