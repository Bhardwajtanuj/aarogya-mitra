# ⚠️ Node.js Installation Required

## Current Status

❌ **Node.js is NOT installed** on your system.

The full Aarogya Mitra application **cannot run** without Node.js because:
- Backend API requires Node.js
- Frontend React app requires Node.js and npm
- Only ML service is running (Python-based)

---

## 🚀 Quick Installation Guide

### Step 1: Download Node.js

**Official Website**: https://nodejs.org/

**Which Version?**
- Download the **LTS (Long Term Support)** version
- Current LTS: v20.x or v18.x
- File size: ~30 MB

**Direct Download Links:**
- Windows 64-bit: https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi
- Or visit https://nodejs.org/ and click "Download LTS"

### Step 2: Install Node.js

1. **Run the installer** (node-vXX.X.X-x64.msi)
2. Click "Next" through the wizard
3. **Important**: Check "Automatically install necessary tools"
4. Accept the license agreement
5. Choose default installation path
6. Click "Install"
7. Wait for installation to complete (~2-3 minutes)
8. Click "Finish"

### Step 3: Verify Installation

**Open a NEW PowerShell window** and run:
```powershell
node --version
npm --version
```

You should see:
```
v20.10.0 (or similar)
10.2.3 (or similar)
```

---

## 📋 After Installing Node.js

Once Node.js is installed, follow these steps:

### 1. Install Backend Dependencies

```powershell
cd "d:\resume\resume projects\aarogya-mitra\backend"
npm install
```

This will install:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cloudinary
- multer
- zod
- axios
- cors
- dotenv

**Time**: ~2-3 minutes

### 2. Install Frontend Dependencies

```powershell
cd "d:\resume\resume projects\aarogya-mitra\frontend"
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- vite
- tailwindcss
- lucide-react
- zod

**Time**: ~2-3 minutes

### 3. Configure Environment Variables

**Edit** `backend/.env` with your credentials:

```env
# MongoDB (Choose one)
MONGODB_URI=mongodb://localhost:27017/aarogya-mitra
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aarogya-mitra

# JWT Secret (can keep default for testing)
JWT_SECRET=aarogya_mitra_secret_2025
JWT_EXPIRE=7d

# Cloudinary (Get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ML Service (already configured)
ML_SERVICE_URL=http://localhost:5001
```

### 4. Start All Services

**Open 3 PowerShell windows:**

**Window 1 - Backend:**
```powershell
cd "d:\resume\resume projects\aarogya-mitra\backend"
npm run dev
```
✅ Backend will run on http://localhost:5000

**Window 2 - Frontend:**
```powershell
cd "d:\resume\resume projects\aarogya-mitra\frontend"
npm run dev
```
✅ Frontend will run on http://localhost:5173

**Window 3 - ML Service (Already Running):**
```powershell
# Keep the current ML service running
# Or restart it:
cd "d:\resume\resume projects\aarogya-mitra\ml-service"
python app.py
```
✅ ML Service on http://localhost:5001

### 5. Access the Application

**Open your browser:**
```
http://localhost:5173
```

You'll see the full Aarogya Mitra application with:
- Beautiful landing page
- Login/Register pages
- Patient portal
- Doctor portal
- Admin dashboard

---

## 🗄️ MongoDB Setup (Required)

You also need MongoDB. Choose one option:

### Option A: MongoDB Atlas (Cloud - Recommended)

**Easiest for beginners!**

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aarogya-mitra
   ```

**Time**: ~5 minutes

### Option B: MongoDB Community (Local)

1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a Windows service
4. Use in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/aarogya-mitra
   ```

**Time**: ~10 minutes

---

## ☁️ Cloudinary Setup (For File Uploads)

1. Visit: https://cloudinary.com/users/register/free
2. Create free account
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret
5. Update `backend/.env`

**Time**: ~3 minutes

---

## ⏱️ Total Setup Time

| Task | Time |
|------|------|
| Download Node.js | 2 min |
| Install Node.js | 3 min |
| Install backend deps | 3 min |
| Install frontend deps | 3 min |
| Setup MongoDB Atlas | 5 min |
| Setup Cloudinary | 3 min |
| **Total** | **~20 minutes** |

---

## 🎯 What You'll Get

Once everything is running:

### Patient Features
- ✅ Register and login
- ✅ Browse doctors by specialization
- ✅ Book appointments with time slots
- ✅ Upload medical reports
- ✅ Get AI health predictions
- ✅ View appointment history
- ✅ Track appointment status

### Doctor Features
- ✅ Professional profile
- ✅ View patient appointments
- ✅ Accept/reject bookings
- ✅ Access patient records
- ✅ Add consultation notes
- ✅ Dashboard with stats

### Admin Features
- ✅ System dashboard
- ✅ Manage all users
- ✅ Monitor appointments
- ✅ View analytics
- ✅ System control

---

## 🐛 Troubleshooting

### "node is not recognized"
- Node.js not installed or not in PATH
- **Solution**: Install Node.js and restart PowerShell

### "npm install" fails
- Network issue or npm registry down
- **Solution**: Try again or use `npm install --legacy-peer-deps`

### MongoDB connection error
- MongoDB not running or wrong connection string
- **Solution**: Check MongoDB service or Atlas connection string

### Port already in use
- Another app using port 5000 or 5173
- **Solution**: Close other apps or change port in config

---

## 📞 Need Help?

**Before Installation:**
- Read this guide carefully
- Have MongoDB and Cloudinary ready
- Ensure stable internet connection

**During Installation:**
- Follow steps in order
- Wait for each step to complete
- Check for error messages

**After Installation:**
- All three services must be running
- Check console for errors
- Verify URLs are accessible

---

## 🎉 Current Status

| Component | Status | Action Required |
|-----------|--------|-----------------|
| ML Service | 🟢 Running | None |
| Demo Page | 🟢 Working | None |
| Node.js | 🔴 Not Installed | **Install from nodejs.org** |
| Backend | 🔴 Cannot Start | Install Node.js first |
| Frontend | 🔴 Cannot Start | Install Node.js first |
| MongoDB | ❓ Unknown | Setup Atlas or local |
| Cloudinary | ❓ Unknown | Create account |

---

## ⏭️ Next Step

**👉 Install Node.js NOW:**

1. Go to: https://nodejs.org/
2. Download LTS version
3. Run installer
4. Restart PowerShell
5. Come back and run installation commands

**Then you'll have the full application running!**

---

**Note**: The ML service is already running. You just need Node.js to complete the setup and run the full application with all features!
