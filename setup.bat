@echo off
REM Setup script for Kisan Sahayk - Full application setup (Windows)

echo.
echo ==========================================
echo Kisan Sahayk - Complete Setup Script
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

REM Setup Backend
echo.
echo Setting up Backend...
echo.

if not exist "backend" (
    echo [X] Backend folder not found!
    pause
    exit /b 1
)

cd backend

if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo.
    echo [WARNING] Please configure backend\.env with your MongoDB URI
)

echo Installing backend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [X] Backend setup failed!
    cd ..
    pause
    exit /b 1
)

echo [OK] Backend dependencies installed

cd ..

REM Setup Frontend
echo.
echo Setting up Frontend...
echo.

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo [OK] Frontend .env configured
)

echo Installing frontend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [X] Frontend setup failed!
    pause
    exit /b 1
)

echo [OK] Frontend dependencies installed

echo.
echo ==========================================
echo [OK] Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. In one terminal, run: cd backend ^& npm run dev
echo 3. In another terminal, run: npm run dev
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:4000
echo.
pause
