Write-Host "Starting Aarogya Mitra Services..."

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev" -WindowStyle Normal

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal

# Start ML Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ml-service'; python app.py" -WindowStyle Normal

Write-Host "All services launched."
