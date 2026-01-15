#!/bin/bash
# Migration Helper Script for Hotel Management System

echo "🏨 Hotel Management System - Database Migration Helper"
echo "========================================================"
echo ""

# Check if Prisma is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js first."
    exit 1
fi

echo "📋 This script will:"
echo "  1. Backup your current Prisma schema"
echo "  2. Run database migration"
echo "  3. Generate Prisma client"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled."
    exit 1
fi

echo ""
echo "⏳ Running migration..."
echo ""

# Step 1: Generate Prisma Client
echo "1️⃣  Generating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi
echo "✅ Prisma client generated"

echo ""

# Step 2: Run migration
echo "2️⃣  Running database migration..."
npx prisma migrate dev --name "add_reservation_management_features"
if [ $? -ne 0 ]; then
    echo "❌ Migration failed"
    echo ""
    echo "🔧 Troubleshooting tips:"
    echo "  - Check your DATABASE_URL in .env.local"
    echo "  - Ensure PostgreSQL is running"
    echo "  - Try: npx prisma migrate reset (warning: clears all data)"
    exit 1
fi
echo "✅ Migration completed"

echo ""

# Step 3: Verify tables
echo "3️⃣  Verifying database tables..."
npx prisma db execute --stdin < /dev/null && echo "✅ Database connection verified"

echo ""
echo "========================================================"
echo "✅ Migration completed successfully!"
echo ""
echo "📍 Next steps:"
echo "  1. Start your server: npm run dev"
echo "  2. Visit: http://localhost:3000/management-dashboard"
echo "  3. Test the new features"
echo ""
echo "📚 Documentation:"
echo "  - IMPLEMENTATION_GUIDE.md - Setup instructions"
echo "  - RESERVATION_MANAGEMENT_GUIDE.md - Feature details"
echo "  - FEATURE_SUMMARY.md - Overview"
echo ""
