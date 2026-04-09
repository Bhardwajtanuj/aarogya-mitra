#!/bin/bash
echo "=========================================="
echo " Aarogya Mitra v2.0 - Starting Services"
echo "=========================================="

# Start ML service
echo "[1/3] Starting ML Service on :5001..."
cd ml-service && python app.py &
ML_PID=$!
cd ..

sleep 2

# Start backend
echo "[2/3] Starting Backend on :5000..."
cd backend && node server.js &
BACKEND_PID=$!
cd ..

sleep 2

# Start frontend
echo "[3/3] Starting Frontend on :5173..."
cd frontend && npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ All services running!"
echo "  Frontend  : http://localhost:5173"
echo "  Backend   : http://localhost:5000"
echo "  ML Service: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop all services"
wait $ML_PID $BACKEND_PID $FRONTEND_PID
