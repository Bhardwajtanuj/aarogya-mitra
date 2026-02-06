# Aarogya Mitra - Quick Start Guide

## 🎯 What You Have

A complete **e-Healthcare Management System MVP** with:
- ✅ Backend API (Node.js + Express + MongoDB)
- ✅ Frontend App (React + Vite + Tailwind CSS)
- ✅ ML Service (Flask + Heart Disease Prediction)
- ✅ Full documentation and setup guides

## 📂 Project Location

```
d:\resume\resume projects\aarogya-mitra\
```

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

**Backend:**
```bash
cd "d:\resume\resume projects\aarogya-mitra\backend"
npm install
```

**Frontend:**
```bash
cd "d:\resume\resume projects\aarogya-mitra\frontend"
npm install
```

**ML Service:**
```bash
cd "d:\resume\resume projects\aarogya-mitra\ml-service"
pip install -r requirements.txt
python model/train_model.py
```

### Step 2: Configure Environment

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/aarogya-mitra
JWT_SECRET=aarogya_mitra_secret_2025
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ML_SERVICE_URL=http://localhost:5001
```

> **Note**: The `.env` file already exists with default values. You only need to add your Cloudinary credentials.

### Step 3: Run All Services

**Option A: One-Click Launch (Recommended for Windows)**
1.  **Ensure MongoDB is running.**
2.  Double-click **`start-app.bat`** in the root directory.
✅ All services will launch in separate windows and the browser will open automatically.

**Option B: Manual Launch (3 separate terminals)**

**Terminal 1 - Backend:**
```bash
cd "d:\resume\resume projects\aarogya-mitra\backend"
npm run dev
```
✅ Backend API: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd "d:\resume\resume projects\aarogya-mitra\frontend"
npm run dev
```
✅ Frontend App: http://localhost:5173

**Terminal 3 - ML Service:**
```bash
cd "d:\resume\resume projects\aarogya-mitra\ml-service"
python app.py
```
✅ ML API: http://localhost:5001

## 🌐 Access the Application

Open your browser: **http://localhost:5173**

## 👥 Create Test Users

### Option 1: Through UI
1. Click "Register" on homepage
2. Fill in details
3. Select role (Patient/Doctor)
4. Submit

### Option 2: Sample Credentials

After registration, you can use:

**Patient:**
- Email: patient@test.com
- Password: patient123

**Doctor:**
- Email: doctor@test.com
- Password: doctor123

**Admin:**
- Create via MongoDB directly (see SETUP.md)

## 📚 Documentation

- **README.md** - Complete project documentation
- **SETUP.md** - Detailed setup instructions
- **walkthrough.md** - Implementation walkthrough

## 🔧 Prerequisites

Before running, ensure you have:
- ✅ Node.js v18+ installed
- ✅ Python 3.8+ installed
- ✅ MongoDB running (or MongoDB Atlas account)
- ✅ Cloudinary account (for file uploads)

## 📊 What to Test

### Patient Features
1. Register and login
2. Browse doctors
3. Book appointment
4. Upload medical report
5. Use heart disease prediction
6. View appointments

### Doctor Features
1. Register and login
2. View appointments
3. Accept/reject appointments
4. View patient details

### Admin Features
1. View dashboard
2. Manage users
3. Monitor appointments

## 🎨 Project Highlights

- **40+ files** created
- **20+ API endpoints**
- **13 React pages**
- **3 user roles**
- **ML integration**
- **Modern UI** with Tailwind CSS
- **Responsive design**
- **JWT authentication**
- **File upload** with Cloudinary

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

**Port Already in Use:**
- Change PORT in respective config files

**ML Model Not Found:**
- Run: `python model/train_model.py`

**Cloudinary Upload Fails:**
- Add your credentials in `.env`
- Get free account at cloudinary.com

## 📞 Need Help?

Check the detailed documentation:
- `README.md` - Full documentation
- `SETUP.md` - Setup guide
- `walkthrough.md` - Implementation details

## 🎉 You're All Set!

Your complete e-Healthcare Management System is ready to run. Follow the 3 steps above to get started!

---

**Project**: Aarogya Mitra - e-Healthcare Management System MVP  
**Stack**: MERN + Flask ML  
**Status**: ✅ Complete and Ready to Deploy
