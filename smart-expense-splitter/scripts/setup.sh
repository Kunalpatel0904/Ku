#!/bin/bash

echo "🚀 Smart Expense Splitter - Setup Script"
echo "========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm --version) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your database URL"
fi

# Prompt for database setup
echo ""
echo "🗄️  Database Setup"
echo "=================="
echo ""
echo "Choose your option:"
echo "1. Use Docker (requires Docker installation)"
echo "2. Use existing PostgreSQL installation"
echo "3. Skip database setup (setup later)"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "Starting PostgreSQL with Docker..."
        docker run --name expense_splitter_db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=expense_splitter -p 5432:5432 -d postgres:15
        if [ $? -eq 0 ]; then
            echo "✅ PostgreSQL container started"
            sleep 3
            echo ""
            echo "🔄 Running database migrations..."
            npx prisma migrate dev --name init
        else
            echo "⚠️  Could not start PostgreSQL. Make sure Docker is installed and running."
        fi
        ;;
    2)
        echo "⚡ Make sure PostgreSQL is running locally"
        echo ""
        read -p "Enter your DATABASE_URL (or press Enter to use default postgresql://postgres:postgres@localhost:5432/expense_splitter): " db_url
        
        if [ -z "$db_url" ]; then
            db_url="postgresql://postgres:postgres@localhost:5432/expense_splitter"
        fi
        
        echo "DATABASE_URL=$db_url" >> .env.local
        
        echo "🔄 Running database migrations..."
        npx prisma migrate dev --name init
        ;;
    3)
        echo "⏭️  Skipping database setup"
        echo "Run 'npx prisma migrate dev --name init' later when your database is ready"
        ;;
esac

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
