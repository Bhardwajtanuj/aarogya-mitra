
# 🏥 Aarogya Mitra: Intelligent e-Healthcare Ecosystem

![MERN](https://img.shields.io/badge/Stack-MERN-green)
![ML](https://img.shields.io/badge/AI-ML%20Microservice-orange)
![Realtime](https://img.shields.io/badge/Realtime-Socket.IO-blue)
![Security](https://img.shields.io/badge/Security-Enterprise-red)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

---

## 🚀 Overview

**Aarogya Mitra** is a **production-grade, full-stack e-Healthcare Management System** designed to digitally transform patient-doctor interactions.

It integrates:
- ⚡ MERN Stack (Frontend + Backend)
- 🤖 Multi-Disease Machine Learning Engine
- 🔔 Real-time Notifications (Socket.IO)
- 🔐 Enterprise-level Security

---

## 🧠 Key Highlights

- 🏥 Complete Healthcare Ecosystem (Patient, Doctor, Admin)
- 🤖 AI-based Disease Prediction (Heart, Diabetes, Thyroid)
- 📡 Real-time Notifications using WebSockets
- 📊 Prediction Analytics Dashboard
- 📅 Doctor Availability Calendar
- 🔐 Secure JWT Authentication + Role-Based Access
- ⚡ Rate Limiting + Helmet Security

---

## 🏗️ Architecture

```mermaid
graph TD
    UI[React Frontend] --> API[Node.js Backend]
    API --> DB[(MongoDB)]
    API --> ML[Flask ML Service]
    API --> Socket[Socket.IO Server]
    Socket --> UI
````

---

## 👨‍⚕️ Feature Modules

### 👤 Patient Module

* Smart Registration & Login (JWT secured)
* Book / Cancel Appointments
* Upload Medical Reports (Cloudinary)
* AI Disease Prediction (3 models)
* Prediction History with Charts
* Real-time Notifications

---

### 🩺 Doctor Module

* Appointment Management Dashboard
* Add Clinical Notes
* Status Updates (Accepted / Completed)
* Availability Calendar (Monthly View)
* Real-time Patient Notifications

---

### 🛡️ Admin Module

* Manage Users (Patients / Doctors)
* Monitor Appointments
* System Analytics Dashboard

---

## 🤖 AI / ML System

### Supported Diseases:

| Disease          | Algorithm         | Accuracy |
| ---------------- | ----------------- | -------- |
| ❤️ Heart Disease | Random Forest     | ~92%     |
| 🩸 Diabetes      | Gradient Boosting | High     |
| 🧬 Thyroid       | Random Forest     | High     |

### Features:

* Instant Prediction API
* Risk Levels: Low / Medium / High
* Probability + Confidence Score
* Prediction History Tracking

---

## 🔔 Real-Time Notification System

* Built using **Socket.IO**
* Instant alerts for:

  * Appointment updates
  * Doctor notes
  * Prediction results
* Notification Bell UI with unread count
* MongoDB-based persistence

---

## 📅 Doctor Availability Calendar

* Monthly interactive calendar
* Visual appointment indicators
* Editable time slots
* Fully custom React implementation (no libraries)

---

## 📊 Prediction Analytics

* Last 20 predictions tracking
* Disease-wise filtering
* Visual bar charts (CSS-based)
* Risk distribution visualization

---

## 🔐 Security Architecture

* JWT Authentication (7-day expiry)
* Role-Based Access Control (RBAC)
* Helmet.js (HTTP security headers)
* Rate Limiting:

  * Global → 200 req / 10 min
  * Auth → 20 req / 10 min
  * Prediction → 30 req / 10 min
* Password hashing (bcrypt)

---

## 🛠️ Tech Stack

### Frontend

* React 18 + Vite
* Tailwind CSS
* Axios
* Socket.IO Client

### Backend

* Node.js + Express
* MongoDB + Mongoose
* JWT Authentication
* Zod Validation
* Socket.IO

### ML Service

* Python + Flask
* Scikit-Learn
* Pandas + NumPy

### DevOps

* Docker + Docker Compose
* Cloudinary (Media Storage)

---

## 📁 Project Structure

```
aarogya-mitra/
├── backend/
├── frontend/
├── ml-service/
├── docker-compose.yml
├── start-app.bat
└── start-app.ps1
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Bhardwajtanuj/aarogya-mitra.git
cd aarogya-mitra
```

---

### 2️⃣ Run with Docker (Recommended)

```bash
docker-compose up --build
```

---

### 3️⃣ Local Development

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### ML Service

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

---

## 🌐 API Endpoints (Core)

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Appointments

* `POST /api/appointments/book`
* `PUT /api/appointments/:id/cancel`

### Predictions

* `POST /api/predictions/heart-disease`
* `POST /api/predictions/diabetes`
* `POST /api/predictions/thyroid`

### Notifications

* `GET /api/notifications`
* `PATCH /api/notifications/read-all`

---

## ⚡ One-Click Launch (Windows)

> Simply run:

```
start-app.bat
```

✔ Opens Backend, Frontend & ML service
✔ Launches browser automatically

---

## 📈 Future Enhancements

* 🧠 Deep Learning Models
* 📱 Mobile App (React Native)
* 🧾 E-Prescription System
* 🌍 Multi-language Support
* ☁️ Cloud Deployment (AWS/GCP)

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, open an issue first.

---



---

## 👨‍💻 Author

**Tanuj Bhardwaj**
🎓 B.Tech CSE (2026)

---

## ⭐ Support

If you like this project:

👉 Star ⭐ the repository
👉 Share with others
👉 Contribute 🚀

---

