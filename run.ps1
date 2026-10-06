Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Launching InfraSight - AI Infrastructure Monitor" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectRoot\backend'; python -m uvicorn app.main:app --reload --port 8000"

Write-Host "[2/2] Starting Vite Frontend on http://localhost:5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  All services launched!" -ForegroundColor Green
Write-Host "   * Citizen Portal:    http://localhost:5173/report" -ForegroundColor White
Write-Host "   * Admin Dashboard:   http://localhost:5173/admin" -ForegroundColor White
Write-Host "   * API Documentation: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Green
