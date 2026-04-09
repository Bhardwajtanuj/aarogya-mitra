@echo off
echo ==========================================
echo  Aarogya Mitra v2.0 - Starting All Services
echo ==========================================

echo [1/3] Starting ML Service...
start "ML Service" cmd /k "cd ml-service && python app.py"

echo [2/3] Starting Backend...
start "Backend" cmd /k "cd backend && node server.js"

echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services launched in separate windows.
echo  Frontend  : http://localhost:5173
echo  Backend   : http://localhost:5000
echo  ML Service: http://localhost:5001
echo.
pause
