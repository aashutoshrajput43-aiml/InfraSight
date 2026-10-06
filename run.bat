@echo off
title InfraSight Launcher
echo ========================================================
echo   Launching InfraSight - AI Infrastructure Monitor
echo ========================================================
echo.

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000...
start "InfraSight Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload --port 8000"

echo [2/2] Starting Vite Frontend on http://localhost:5173...
start "InfraSight Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo  All services launched!
echo   * Citizen Portal:    http://localhost:5173/report
echo   * Admin Dashboard:   http://localhost:5173/admin
echo   * API Documentation: http://127.0.0.1:8000/docs
echo ========================================================
echo.
pause
