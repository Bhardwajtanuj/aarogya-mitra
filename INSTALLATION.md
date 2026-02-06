# Aarogya Mitra - Installation & Setup Instructions

## ⚠️ Prerequisites Not Found

Your system is missing some required software. Here's what you need:

### ✅ Installed
- Python 3.12.10 ✓

### ❌ Not Installed
- Node.js (Required for Backend and Frontend)
- MongoDB (Required for Database)

## 📥 Installation Steps

### 1. Install Node.js

**Download and Install:**
1. Visit: https://nodejs.org/
2. Download the **LTS version** (recommended)
3. Run the installer
4. Follow the installation wizard
5. Restart your terminal/PowerShell

**Verify Installation:**
```bash
node --version
npm --version
```

### 2. Install MongoDB

**Option A: MongoDB Community Edition (Local)**
1. Visit: https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server
3. Install with default settings
4. MongoDB will run as a Windows service

**Option B: MongoDB Atlas (Cloud - Recommended for beginners)**
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update `backend/.env` with your connection string

### 3. Get Cloudinary Credentials

1. Visit: https://cloudinary.com/users/register/free
2. Create a free account
3. Go to Dashboard
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret
5. Update `backend/.env` with these credentials

## 🚀 After Installing Prerequisites

Once you have Node.js, MongoDB, and Cloudinary credentials:

### Step 1: Install Backend Dependencies
```bash
cd "d:\resume\resume projects\aarogya-mitra\backend"
npm install
```

### Step 2: Configure Backend Environment
Edit `backend/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/aarogya-mitra
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aarogya-mitra

JWT_SECRET=aarogya_mitra_secret_2025
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
ML_SERVICE_URL=http://localhost:5001
```

### Step 3: Install Frontend Dependencies
```bash
cd "d:\resume\resume projects\aarogya-mitra\frontend"
npm install
```

### Step 4: Install ML Service Dependencies
```bash
cd "d:\resume\resume projects\aarogya-mitra\ml-service"
pip install -r requirements.txt
```

### Step 5: Train ML Model
```bash
cd "d:\resume\resume projects\aarogya-mitra\ml-service\model"
python train_model.py
```

### Step 6: Run All Services

**Option A: One-Click Launch (Recommended for Windows)**
1.  **Ensure MongoDB is running.**
2.  Navigate to the root directory.
3.  Double-click **`start-app.bat`**.
✅ All services will launch in separate windows and the browser will open automatically.

**Option B: Manual Launch (3 separate sessions)**

**Terminal 1 - Backend:**
```bash
cd "d:\resume\resume projects\aarogya-mitra\backend"
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd "d:\resume\resume projects\aarogya-mitra\frontend"
npm run dev
```

**Terminal 3 - ML Service:**
```bash
cd "d:\resume\resume projects\aarogya-mitra\ml-service"
python app.py
```

### Step 7: Access Application
Open browser: http://localhost:5173

## 🎯 Quick Installation Script

After installing Node.js and MongoDB, you can use this script:

**Windows PowerShell:**
```powershell
# Navigate to project
cd "d:\resume\resume projects\aarogya-mitra"

# Install backend
cd backend
npm install
cd ..

# Install frontend
cd frontend
npm install
cd ..

# Install ML service
cd ml-service
pip install -r requirements.txt
cd model
python train_model.py
cd ..\..

Write-Host "✅ Installation complete!"
Write-Host "📝 Next: Configure backend/.env with your credentials"
Write-Host "🚀 Then run all 3 services in separate terminals"
```

## 📋 Checklist

Before running the application:

- [ ] Node.js installed (check with `node --version`)
- [ ] npm installed (check with `npm --version`)
- [ ] MongoDB installed or Atlas account created
- [ ] Cloudinary account created
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] ML dependencies installed (`pip install -r requirements.txt`)
- [ ] ML model trained (`python train_model.py`)
- [ ] Environment variables configured in `backend/.env`

## 🐛 Troubleshooting

### "node is not recognized"
- Node.js is not installed or not in PATH
- Install Node.js from nodejs.org
- Restart terminal after installation

### "MongoDB connection failed"
- MongoDB service not running (if local)
- Check connection string in `.env`
- For Atlas: verify IP whitelist and credentials

### "Module not found" errors
- Run `npm install` in the respective directory
- For Python: `pip install -r requirements.txt`

### Port already in use
- Close other applications using ports 5000, 5001, or 5173
- Or change ports in configuration files

## 📞 Need Help?

1. Check if all prerequisites are installed
2. Verify environment variables in `backend/.env`
3. Ensure all dependencies are installed
4. Check console for specific error messages

## 🎉 What You'll Get

Once everything is set up:
- ✅ Full-stack healthcare management system
- ✅ Patient, Doctor, and Admin portals
- ✅ Appointment booking system
- ✅ Medical report uploads
- ✅ AI-powered health predictions
- ✅ Modern, responsive UI

---

**Current Status**: Waiting for Node.js and MongoDB installation
**Next Step**: Install Node.js from https://nodejs.org/
