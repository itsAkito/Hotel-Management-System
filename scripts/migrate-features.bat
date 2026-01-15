@echo off
REM Migration Helper Script for Hotel Management System (Windows)

echo.
echo 🏨 Hotel Management System - Database Migration Helper
echo.
echo ========================================================
echo.

echo 📋 This script will:
echo   1. Run database migration
echo   2. Generate Prisma client
echo.

set /p CONTINUE="Continue? (y/n): "
if /i not "%CONTINUE%"=="y" (
    echo Migration cancelled.
    exit /b 0
)

echo.
echo ⏳ Running migration...
echo.

REM Step 1: Generate Prisma Client
echo 1️⃣  Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to generate Prisma client
    exit /b 1
)
echo ✅ Prisma client generated

echo.

REM Step 2: Run migration
echo 2️⃣  Running database migration...
call npx prisma migrate dev --name "add_reservation_management_features"
if %ERRORLEVEL% neq 0 (
    echo ❌ Migration failed
    echo.
    echo 🔧 Troubleshooting tips:
    echo   - Check your DATABASE_URL in .env.local
    echo   - Ensure PostgreSQL is running
    echo   - Try: npx prisma migrate reset (warning: clears all data^)
    exit /b 1
)
echo ✅ Migration completed

echo.
echo ========================================================
echo ✅ Migration completed successfully!
echo.
echo 📍 Next steps:
echo   1. Start your server: npm run dev
echo   2. Visit: http://localhost:3000/management-dashboard
echo   3. Test the new features
echo.
echo 📚 Documentation:
echo   - IMPLEMENTATION_GUIDE.md - Setup instructions
echo   - RESERVATION_MANAGEMENT_GUIDE.md - Feature details
echo   - FEATURE_SUMMARY.md - Overview
echo.
pause
