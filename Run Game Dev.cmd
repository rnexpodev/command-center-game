@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul 2>&1
title Command Center Game - Dev Server

echo.
echo  ===================================
echo   Command Center Game - Dev Server
echo  ===================================
echo.

set "TARGET_PORT=5180"

:: Check if port is in use
set "BUSY_PID="
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":%TARGET_PORT% " ^| findstr "LISTENING"') do (
    set "BUSY_PID=%%a"
)

if not defined BUSY_PID goto :port_free

:: Port is busy — show process info and options
echo  [!] Port %TARGET_PORT% is already in use:
echo.
for /f "tokens=1" %%n in ('tasklist /FI "PID eq %BUSY_PID%" /FO TABLE /NH 2^>nul') do (
    echo       Process: %%n  (PID %BUSY_PID%)
)
echo.
echo  What would you like to do?
echo.
echo    [1] Kill the existing process and use port %TARGET_PORT%
echo    [2] Run on the next available port
echo    [3] Cancel
echo.
set /p "CHOICE=  Your choice (1/2/3): "

if "!CHOICE!"=="1" (
    taskkill /PID %BUSY_PID% /F >nul 2>&1
    echo.
    echo  [OK] Process %BUSY_PID% killed
    echo.
    goto :port_free
)

if "!CHOICE!"=="2" (
    echo.
    :: Find next available port
    for /l %%p in (5181,1,5199) do (
        netstat -ano 2>nul | findstr ":%%p " | findstr "LISTENING" >nul 2>&1
        if errorlevel 1 (
            set "TARGET_PORT=%%p"
            echo  [OK] Using port %%p instead
            echo.
            goto :port_free
        )
    )
    echo  [!] No free ports found in range 5181-5199
    pause
    exit /b 1
)

echo.
echo  [!] Cancelled
pause
exit /b 0

:port_free

:: Install dependencies
echo  [1/3] Installing dependencies...
call npm install >nul 2>&1
echo  [OK] Dependencies installed

:: Clean build cache
echo  [2/3] Cleaning build cache...
if exist "dist" rmdir /s /q "dist" >nul 2>&1
if exist ".vite" rmdir /s /q ".vite" >nul 2>&1
echo  [OK] Cache cleaned

:: Start dev server
echo  [3/3] Starting dev server...
echo.
echo  Game will open at: http://localhost:%TARGET_PORT%
echo.

:: Open browser after 3 seconds
start /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:%TARGET_PORT%"

:: Start Vite dev server
call npx vite --port %TARGET_PORT%

pause
