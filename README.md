# Aarogya Mitra - e-Healthcare Management System

![Healthcare](https://img.shields.io/badge/Healthcare-Management-blue)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![ML](https://img.shields.io/badge/ML-Flask-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

A comprehensive full-stack e-Healthcare Management System built with MERN stack and integrated Machine Learning for disease prediction.

## 🌟 Features

### Patient Module
- ✅ User registration and JWT-based authentication
- ✅ Profile management with medical history
- ✅ Browse and select doctors by specialization
- ✅ Book appointments with preferred time slots
- ✅ View appointment status (Pending/Accepted/Rejected)
- ✅ Upload and manage medical reports (Cloudinary integration)
- ✅ AI-powered Heart Disease prediction

### Doctor Module
- ✅ Doctor registration and profile management
- ✅ View all appointments with filtering
- ✅ Accept/Reject patient appointments
- ✅ View patient details and medical reports
- ✅ Add consultation notes
- ✅ Dashboard with appointment statistics

### Admin Module
- ✅ Admin dashboard with system overview
- ✅ View all patients and doctors
- ✅ Monitor all appointments
- ✅ System-wide statistics and analytics

### ML Integration
- ✅ Heart Disease Prediction using Random Forest
- ✅ Flask API for ML model serving
- ✅ Prediction history tracking
- ✅ Risk level assessment (Low/Medium/High)

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Cloud storage for images/reports
- **Multer** - File upload handling

### ML Service
- **Flask** - Python web framework
- **scikit-learn** - Machine learning library
- **pandas** - Data manipulation
- **NumPy** - Numerical computing
- **joblib** - Model serialization

## 📁 Project Structure

```
aarogya-mitra/
├── backend/                    # Node.js + Express API
│   ├── config/                # Database and Cloudinary config
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   ├── middleware/            # Auth middleware
│   ├── validators/            # Zod validation schemas
│   └── server.js              # Entry point
│
├── frontend/                  # React + Vite application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React context (Auth)
│   │   ├── pages/            # Page components
│   │   │   ├── patient/     # Patient pages
│   │   │   ├── doctor/      # Doctor pages
│   │   │   └── admin/       # Admin pages
│   │   ├── utils/           # API utilities
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── index.html
│
└── ml-service/               # Flask ML API
    ├── model/               # ML model files
    │   ├── train_model.py  # Model training script
    │   ├── predict.py      # Prediction logic
    │   ├── heart_disease_model.pkl
    │   └── scaler.pkl
    ├── data/               # Training data
    └── app.py              # Flask server
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for file uploads)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd aarogya-mitra
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your MongoDB URI, JWT secret, and Cloudinary credentials
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
```

#### 4. ML Service Setup
```bash
cd ml-service
pip install -r requirements.txt

# Train the ML model
cd model
python train_model.py
cd ..
```

### Configuration

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aarogya-mitra
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ML_SERVICE_URL=http://localhost:5001
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

You need to run all three services simultaneously:

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

#### Terminal 3 - ML Service
```bash
cd ml-service
python app.py
# ML API runs on http://localhost:5001
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Patient Endpoints
- `GET /api/patient/profile` - Get patient profile
- `PUT /api/patient/profile` - Update patient profile
- `POST /api/patient/upload-report` - Upload medical report
- `GET /api/patient/reports` - Get all reports
- `GET /api/patient/appointments` - Get patient appointments

### Doctor Endpoints
- `GET /api/doctor/profile` - Get doctor profile
- `PUT /api/doctor/profile` - Update doctor profile
- `GET /api/doctor/appointments` - Get doctor appointments
- `PUT /api/doctor/appointments/:id/status` - Update appointment status

### Admin Endpoints
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/patients` - Get all patients
- `GET /api/admin/doctors` - Get all doctors
- `GET /api/admin/appointments` - Get all appointments

### Appointment Endpoints
- `GET /api/appointments/doctors` - Get all doctors
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### ML Prediction Endpoints
- `POST /api/predictions/heart-disease` - Predict heart disease
- `GET /api/predictions/history` - Get prediction history

## 🎨 UI Features

- **Modern Design** - Clean, professional healthcare-themed interface
- **Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Animations** - Smooth transitions and micro-interactions
- **Dark/Light Mode** - Comfortable viewing experience
- **Accessibility** - WCAG compliant components

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with Zod
- Protected API routes
- Secure file uploads

## 🧪 Testing

### Test User Credentials

You can create test users through the registration page or use MongoDB to insert test data:

**Admin User:**
```javascript
{
  name: "Admin User",
  email: "admin@aarogya.com",
  password: "admin123",
  role: "admin"
}
```

**Doctor User:**
```javascript
{
  name: "Dr. John Smith",
  email: "doctor@aarogya.com",
  password: "doctor123",
  role: "doctor",
  specialization: "Cardiologist",
  qualification: "MBBS, MD",
  experience: 10,
  consultationFee: 500
}
```

**Patient User:**
```javascript
{
  name: "Jane Doe",
  email: "patient@aarogya.com",
  password: "patient123",
  role: "patient",
  bloodGroup: "O+"
}
```

## 📊 ML Model Details

### Heart Disease Prediction
- **Algorithm**: Random Forest Classifier
- **Features**: 13 clinical parameters
- **Accuracy**: ~85% on test data
- **Output**: Prediction (Positive/Negative), Probability, Risk Level

### Input Parameters:
1. Age
2. Sex (0=Female, 1=Male)
3. Chest Pain Type (0-3)
4. Resting Blood Pressure
5. Cholesterol
6. Fasting Blood Sugar > 120 (0/1)
7. Resting ECG (0-2)
8. Maximum Heart Rate
9. Exercise Induced Angina (0/1)
10. ST Depression
11. Slope (0-2)
12. Number of Major Vessels (0-4)
13. Thalassemia (0-3)

## 🚧 Future Enhancements

- [ ] Real-time chat between doctor and patient
- [ ] Video consultation integration
- [ ] Payment gateway integration
- [ ] Email/SMS notifications
- [ ] Prescription management
- [ ] Multiple ML models (Diabetes, Thyroid)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Appointment reminders
- [ ] Medical history timeline

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created as an MVP for e-Healthcare Management System

## 📞 Support

For support, email support@aarogya.com or create an issue in the repository.

---

**Note**: This is an MVP (Minimum Viable Product) and is intended for educational and demonstration purposes. For production use, additional security measures, testing, and compliance with healthcare regulations (HIPAA, etc.) would be required.
