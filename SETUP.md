# Aarogya Mitra - Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v18+ installed
- ✅ Python 3.8+ installed
- ✅ MongoDB installed (or MongoDB Atlas account)
- ✅ Cloudinary account created

## Step-by-Step Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Backend Environment
```bash
# Copy the example env file
cp .env.example .env

# Edit .env file with your credentials:
# - MongoDB URI (local or Atlas)
# - JWT secret (any random string)
# - Cloudinary credentials (from your Cloudinary dashboard)
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Install ML Service Dependencies
```bash
cd ../ml-service
pip install -r requirements.txt
```

### 5. Train the ML Model
```bash
cd model
python train_model.py
cd ..
```

This will:
- Create sample training data
- Train the Random Forest model
- Save the model and scaler files

### 6. Start All Services

Open **3 separate terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend API running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend app running on http://localhost:5173

**Terminal 3 - ML Service:**
```bash
cd ml-service
python app.py
```
✅ ML API running on http://localhost:5001

### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Creating Test Users

### Option 1: Through UI
1. Click "Register" on the homepage
2. Fill in the form
3. Select role (Patient or Doctor)
4. Submit

### Option 2: Using MongoDB

Connect to your MongoDB and insert test documents:

**Admin User:**
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@aarogya.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash
  role: "admin",
  createdAt: new Date()
})
```

**Doctor User:**
```javascript
db.users.insertOne({
  name: "Dr. John Smith",
  email: "doctor@aarogya.com",
  password: "$2a$10$YourHashedPasswordHere",
  role: "doctor",
  specialization: "Cardiologist",
  qualification: "MBBS, MD",
  experience: 10,
  consultationFee: 500,
  availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  availableTimeSlots: [
    { startTime: "09:00", endTime: "12:00" },
    { startTime: "14:00", endTime: "17:00" }
  ],
  createdAt: new Date()
})
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check your connection string in `.env`
- For Atlas, ensure IP whitelist is configured

### Cloudinary Upload Error
- Verify credentials in `.env`
- Check Cloudinary dashboard for API limits
- Ensure file size is under 5MB

### ML Service Not Loading
- Check if model files exist in `ml-service/model/`
- Run `python train_model.py` if missing
- Verify Python dependencies are installed

### Port Already in Use
- Backend (5000): Change PORT in backend/.env
- Frontend (5173): Change port in vite.config.js
- ML Service (5001): Change port in ml-service/app.py

## Testing the Application

### 1. Patient Workflow
1. Register as a patient
2. Login with patient credentials
3. Browse available doctors
4. Book an appointment
5. Upload a medical report
6. Use the heart disease prediction tool

### 2. Doctor Workflow
1. Register as a doctor
2. Login with doctor credentials
3. View pending appointments
4. Accept/reject appointments
5. View patient details

### 3. Admin Workflow
1. Create admin user in MongoDB
2. Login with admin credentials
3. View dashboard statistics
4. Manage users (patients/doctors)
5. Monitor all appointments

## Next Steps

- Configure email notifications (optional)
- Set up production database
- Deploy to cloud platform
- Add more ML models
- Implement payment gateway

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all services are running
3. Check environment variables
4. Review the README.md for detailed documentation

Happy coding! 🚀
