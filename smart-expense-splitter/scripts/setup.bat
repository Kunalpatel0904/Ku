@echo off
setlocal enabledelayedexpansion

echo 🚀 Smart Expense Splitter - Setup Script
echo =========================================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% found

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo.
    echo 📝 Creating .env.local file...
    copy .env.example .env.local
    echo ⚠️  Please update .env.local with your database URL
)

REM Prompt for database setup
echo.
echo 🗄️  Database Setup
echo ====================
echo.
echo Choose your option:
echo 1. Use Docker (requires Docker installation)
echo 2. Use existing PostgreSQL installation
echo 3. Skip database setup (setup later)

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Starting PostgreSQL with Docker...
    docker run --name expense_splitter_db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=expense_splitter -p 5432:5432 -d postgres:15
    if %ERRORLEVEL% EQU 0 (
        echo ✅ PostgreSQL container started
        timeout /t 3
        echo.
        echo 🔄 Running database migrations...
        call npx prisma migrate dev --name init
    ) else (
        echo ⚠️  Could not start PostgreSQL. Make sure Docker is installed and running.
    )
) else if "%choice%"=="2" (
    echo ⚡ Make sure PostgreSQL is running locally
    echo.
    set /p db_url="Enter your DATABASE_URL (or press Enter to use default): "
    
    if "!db_url!"=="" (
        set db_url=postgresql://postgres:postgres@localhost:5432/expense_splitter
    )
    
    echo DATABASE_URL=!db_url! >> .env.local
    
    echo 🔄 Running database migrations...
    call npx prisma migrate dev --name init
) else if "%choice%"=="3" (
    echo ⏭️  Skipping database setup
    echo Run 'npx prisma migrate dev --name init' later when your database is ready
)

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Update .env.local with your configuration
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo.
pause
