@echo off
chcp 65001 >nul 2>&1
title Command Center Game - Dev Server

echo.
echo  ===================================
echo   Command Center Game - Dev Server
echo  ===================================
echo.

:: Check if port 5180 is in use
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5180 " ^| findstr "LISTENING"') do (
    echo  [!] Port 5180 is in use by PID %%a
    tasklist /FI "PID eq %%a" /FO TABLE /NH 2>nul
    echo.
    set /p KILL="  Kill process? (y/n): "
    if /i "!KILL!"=="y" (
        taskkill /PID %%a /F >nul 2>&1
        echo  [OK] Process killed
    ) else (
        echo  [!] Cancelled
        pause
        exit /b
    )
)

:: Install dependencies
echo  [1/3] Installing dependencies...
call npm install >nul 2>&1
echo  [OK] Dependencies installed

:: Clean build cache
echo  [2/3] Cleaning build cache...
if exist ".next" rmdir /s /q ".next" >nul 2>&1
if exist "dist" rmdir /s /q "dist" >nul 2>&1
echo  [OK] Cache cleaned

:: Start dev server
echo  [3/3] Starting dev server...
echo.
echo  Game will open at: http://localhost:5180
echo.

:: Open browser after 3 seconds
start /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5180"

:: Start Vite dev server
call npx vite --port 5180

pause
