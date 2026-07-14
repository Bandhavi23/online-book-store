@echo off
setlocal enabledelayedexpansion

echo ============================================
echo Bookstore Backend Restart Script
echo ============================================

echo.
echo Step 1: Killing all Node processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM npm.exe /T 2>nul

echo Step 2: Waiting 3 seconds for cleanup...
timeout /t 3 /nobreak

echo.
echo Step 3: Starting backend on port 3000...
echo.

npm run dev

pause
