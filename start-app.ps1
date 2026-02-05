$PSScriptRoot = Split-Path $MyInvocation.MyCommand.Path -Parent
Set-Location $PSScriptRoot

Write-Host "🏥 Starting Aarogya Mitra Orchestrator..." -ForegroundColor Cyan

# 1. Check for MongoDB (Required for Backend)
Write-Host "`n🔍 Checking for MongoDB..." -ForegroundColor Yellow
$mongoConnection = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet
if (-not $mongoConnection) {
    Write-Host "⚠️  Warning: MongoDB does not appear to be running on port 27017." -ForegroundColor DarkYellow
    Write-Host "The Backend service may fail to start. Please start MongoDB if needed.`n" -ForegroundColor DarkYellow
} else {
    Write-Host "✅ MongoDB is reachable." -ForegroundColor Green
}

# 2. Start ML Service
Write-Host "🤖 Starting ML Service (Port 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ml-service'; python app.py" -WindowStyle Normal

# 3. Start Backend
Write-Host "⚙️  Starting Backend API (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev" -WindowStyle Normal

# 4. Start Frontend
Write-Host "💻 Starting Frontend Dashboard (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal

Write-Host "`n🚀 All services are launching!" -ForegroundColor Green
Write-Host "Opening browser in 5 seconds..." -ForegroundColor Cyan
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"

Write-Host "`n✨ Happy coding!" -ForegroundColor Cyan
