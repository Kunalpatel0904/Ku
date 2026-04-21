# Quick Start Guide

## Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 12+ or Docker
- Git

## Step 1: Clone Repository
```bash
git clone https://github.com/kunalpatel0904/smart-expense-splitter.git
cd smart-expense-splitter
```

## Step 2: Run Setup Script
### On Windows:
```bash
scripts/setup.bat
```

### On macOS/Linux:
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Or manually:
```bash
npm install
cp .env.example .env.local
```

## Step 3: Configure Database
Edit `.env.local` and set your DATABASE_URL:

### Using Docker (easiest):
```bash
docker run --name expense_db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=expense_splitter -p 5432:5432 -d postgres:15
```

### Or use Docker Compose:
```bash
docker-compose up -d
```

### Or connect to existing PostgreSQL:
```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

## Step 4: Initialize Database
```bash
npx prisma migrate dev --name init
```

## Step 5: Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Start Creating Groups!
1. Click "New Group"
2. Add members
3. Add expenses
4. Track balances in real-time

## Useful Commands

```bash
# View database with Prisma Studio
npx prisma studio

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Run with Docker
docker-compose up

# View Docker logs
docker-compose logs -f
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | ✅ | PostgreSQL connection string |
| NEXTAUTH_SECRET | ✅ | Secret for authentication |
| HUGGING_FACE_API_KEY | ❌ | For AI categorization (optional) |
| NODE_ENV | ❌ | development, production, test |

## Troubleshooting

### Database connection failed
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Verify credentials

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

### Prisma errors
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (careful!)
npx prisma migrate reset
```

### Docker issues
```bash
# Stop all containers
docker-compose down

# Remove volumes
docker-compose down -v

# Rebuild from scratch
docker-compose up --build
```

## Performance Tips
- Enable database connection pooling in production
- Use CDN for static assets
- Enable caching headers
- Optimize database queries with proper indexing

## Need Help?
- Check [GitHub Issues](https://github.com/kunalpatel0904/smart-expense-splitter/issues)
- Email: KunalPatel0904@gmail.com
- Reference the main README.md

---

Happy expense tracking! 💰
