# Deployment Guide

## Quick Deployment to Vercel (Recommended)

### Prerequisites
- GitHub account with repository
- Vercel account (free)
- PostgreSQL database (Supabase, Railway, or AWS RDS)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Create/Select PostgreSQL Database

#### Option A: Supabase (Easiest)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Database settings
4. Format: `postgresql://[user]:[password]@[host]:5432/[database]`

#### Option B: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL plugin
4. Copy DATABASE_URL

#### Option C: AWS RDS
1. Create RDS PostgreSQL instance
2. Get connection string from AWS console

### Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select `smart-expense-splitter` folder
5. Set environment variables:
   ```env
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=your-secret-key-here
   HUGGING_FACE_API_KEY=your-hf-api-key
   ```
6. Click "Deploy"

### Step 4: Run Database Migrations
```bash
# In Vercel terminal or locally
npx prisma migrate deploy
```

### Step 5: Your app is live!
Visit `https://your-project.vercel.app`

## Deployment on Railway

### Step 1: Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository

### Step 2: Add PostgreSQL
1. Click "Add Service" → "Database" → "PostgreSQL"
2. Railway auto-generates DATABASE_URL

### Step 3: Set Environment Variables
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXTAUTH_SECRET=your-secret-key
NODE_ENV=production
```

### Step 4: Deploy
- Railway auto-deploys on push
- Check deployment logs
- Visit your Railway app URL

## Deployment on Netlify

### Step 1: Setup Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select your GitHub repository

### Step 2: Configure Build
```
Build command: npm run build
Publish directory: .next
```

### Step 3: Set Environment Variables
Netlify Dashboard → Site settings → Build & deploy → Environment

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-key
HUGGING_FACE_API_KEY=optional
```

### Step 4: Deploy
- Netlify auto-deploys on push
- Check deploy logs
- Custom domain setup available

## Docker Deployment

### Using Docker Hub
```bash
# Build image
docker build -t username/expense-splitter:1.0 .

# Login to Docker Hub
docker login

# Push image
docker push username/expense-splitter:1.0
```

### Using Cloud Run (Google Cloud)
```bash
# Build image for Cloud Run
docker build -t gcr.io/PROJECT-ID/expense-splitter .

# Push to Google Container Registry
docker push gcr.io/PROJECT-ID/expense-splitter

# Deploy to Cloud Run
gcloud run deploy expense-splitter \
  --image gcr.io/PROJECT-ID/expense-splitter \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL=$DATABASE_URL,NEXTAUTH_SECRET=$SECRET
```

## Environment Variables for Production

### Required
```env
DATABASE_URL=postgresql://[user]:[pass]@[host]:5432/[db]
NEXTAUTH_SECRET=very-long-random-secret-key
NODE_ENV=production
```

### Optional
```env
HUGGING_FACE_API_KEY=hf_xxxxxxxxxxxxx
```

### Generate NEXTAUTH_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database Migration on Production

### First Deploy
```bash
npx prisma migrate deploy
```

### Schema Changes
```bash
# Locally
npx prisma migrate dev --name descriptive_name

# Push to GitHub
git push

# On Vercel, Railway, etc.
npx prisma migrate deploy
```

## Performance Optimization

### 1. Enable Database Connection Pooling

#### Supabase
- Settings → Database → Connection Pooling
- Set to 20-30 connections

#### Railway
- Automatic pooling enabled

### 2. Cache Settings
In `next.config.js`:
```javascript
export const revalidate = 10 // ISR: 10 seconds
```

### 3. Database Indexes
Already configured in Prisma schema for:
- Group lookups
- User queries
- Balance calculations

## Monitoring & Logging

### Vercel
- Logs: Vercel Dashboard → Functions
- Analytics: Vercel Dashboard → Analytics
- Errors: Automatic Sentry integration

### Railway
- Logs: Railway Dashboard → Deployments
- Metrics: Railway Dashboard → Metrics
- Database: Railway Dashboard → PostgreSQL → Logs

### Production Debugging
```bash
# View logs locally
npm run dev

# View production logs
# Vercel: vercel logs --prod
# Railway: railway logs

# Check database status
npx prisma db seed
```

## Scaling Tips

1. **Database**: Use read replicas for high traffic
2. **API**: Enable vercel edge functions for reduced latency
3. **CDN**: Static assets auto-cached by Vercel
4. **Caching**: Implement Redis for session caching
5. **Clustering**: Use Prisma connection pooling

## Rollback Procedures

### Rollback on Vercel
```bash
# See deployment history
vercel list

# Rollback to previous
vercel rollback
```

### Rollback on Railway
1. Railway Dashboard → Deployments
2. Click on previous deployment
3. Click "Redeploy"

## Domain Configuration

### Add Custom Domain on Vercel
1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records
4. Wait for verification (5-30 mins)

### SSL Certificate
- Automatically issued by Let's Encrypt
- Auto-renews 30 days before expiry

## Troubleshooting

### Build fails
```bash
npm run build  # Test locally first
npx prisma generate  # Regenerate client
```

### Database connection timeout
- Increase connection pool size
- Check firewall rules
- Verify credentials

### Out of memory
- Reduce database query limits
- Implement pagination
- Optimize images

### Missing environment variables
- Double-check spelling
- Verify on hosting platform
- Don't quote values in dashboard

## Support
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://railway.app/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs
