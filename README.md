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

