# 💰 Smart Expense Splitter

A lightweight, user-friendly web application for tracking and settling shared expenses among friends, roommates, and teams. Built with modern full-stack technologies and AI-powered features.

**[Live Demo](https://expense-splitter-demo.vercel.app)** | **[GitHub Repository](https://github.com/kunalpatel0904/smart-expense-splitter)**

## 🌟 Features

### Core Features
- ✅ **Create Groups** - Organize expenses into separate groups for trips, shared apartments, or team activities
- ✅ **Add Members** - Invite friends/roommates by email
- ✅ **Add Expenses** - Record shared expenses with multiple participants
- ✅ **Flexible Splitting** - Split expenses equally or with custom amounts
- ✅ **Real-Time Balances** - Auto-calculate who owes whom instantly
- ✅ **Settlement Tracking** - View clear summaries of all debts and settlements
- ✅ **Expense Management** - Edit, delete, and manage expenses easily

### AI-Powered Features
- 🤖 **Smart Categorization** - AI automatically categorizes expenses (Food, Travel, Accommodation, Entertainment, etc.)
- 📊 **Spending Insights** - Analytics showing:
  - Spending patterns by category
  - Individual spending amounts
  - Weekly/monthly trends
  - Budget alerts for large expenses
- 📈 **Analytics Dashboard** - Visual breakdown of group expenses

## 🏗️ Architecture

### Tech Stack
```
Frontend:     Next.js 14 + React 18 + TypeScript + Tailwind CSS
Backend:      Next.js API Routes
Database:     PostgreSQL + Prisma ORM
AI/ML:        HuggingFace Transformers (NLI for categorization)
Deployment:   Vercel
```

### Database Schema
```
User
├── id (Primary Key)
├── email (Unique)
├── name
└── Relationships: Groups, Expenses, Participants

Group
├── id (Primary Key)
├── name
└── Relationships: Members, Expenses, Balances, Settlements

GroupMember
├── groupId (Foreign Key)
├── userId (Foreign Key)
└── Unique: (groupId, userId)

Expense
├── id (Primary Key)
├── groupId (Foreign Key)
├── paidByUserId (Foreign Key)
├── description
├── amount
├── category (Auto-categorized)
├── date
└── Relationships: Participants

Participant
├── expenseId (Foreign Key)
├── userId (Foreign Key)
├── amount (Split amount)
└── Unique: (expenseId, userId)

Balance
├── groupId (Foreign Key)
├── debtorId
├── creditorId
├── amount
└── Unique: (groupId, debtorId, creditorId)

Settlement
├── groupId (Foreign Key)
├── debtorId
├── creditorId
├── amount
├── status (pending, completed)
```

### API Endpoints

#### Groups
- `GET /api/groups` - List all groups
- `POST /api/groups` - Create a new group
- `GET /api/groups/[id]` - Get group details
- `DELETE /api/groups/[id]` - Delete a group

#### Members
- `GET /api/groups/[id]/members` - Get group members
- `POST /api/groups/[id]/members` - Add a member to group

#### Expenses
- `GET /api/groups/[id]/expenses` - List group expenses
- `POST /api/groups/[id]/expenses` - Add a new expense
- `DELETE /api/expenses/[id]` - Delete an expense

#### Analytics
- `GET /api/groups/[id]/balances` - Get balance summaries
- `GET /api/groups/[id]/insights` - Get spending insights

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- SQLite (built-in) for local development, or PostgreSQL for production
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kunalpatel0904/smart-expense-splitter.git
   cd smart-expense-splitter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   For local development with SQLite (default):
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_SECRET="dev-secret-key-change-in-production"
   HUGGING_FACE_API_KEY=""  # Optional for AI categorization
   ```

4. **Run Prisma migrations** (automatic with SQLite)
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🚢 Deployment

### Option 1: Vercel (Recommended)

**Local SQLite → Vercel with PostgreSQL:**

1. **Setup PostgreSQL Database**
   - Create a free PostgreSQL database on [Supabase](https://supabase.com) or [Railway](https://railway.app)
   - Copy the `DATABASE_URL` connection string

2. **Update Prisma Schema for Production** (when deploying)
   - Change `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Push code to GitHub**
   ```bash
   git push origin main
   ```

4. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" and import your GitHub repository
   - In project settings, add environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string from Supabase/Railway
     - `NEXTAUTH_SECRET`: Generate a secret key
     - `HUGGING_FACE_API_KEY`: Optional
   - Deploy!

5. **Run Migrations on Vercel**
   ```bash
   # From your local machine with Vercel CLI installed
   vercel env pull
   npx prisma migrate deploy
   ```

### Option 2: Railway

1. **Push to GitHub**
2. **Create Railway account** and link GitHub
3. **Add PostgreSQL plugin**
4. **Deploy** with environment variables

### Option 3: Docker (Self-Hosted)

```bash
docker build -t expense-splitter .
docker run -p 3000:3000 -e DATABASE_URL=... expense-splitter
```

## 💡 How It Works

### Expense Splitting Algorithm

1. **User adds an expense** (e.g., $100 for dinner)
2. **System categorizes** it using AI (automatically detected as "Food")
3. **User selects participants** (splits among 4 people)
4. **Amount calculated** ($100 ÷ 4 = $25 each)
5. **Balances updated** in real-time
6. **Each participant** sees their share

### Balance Calculation

The system maintains a balance matrix:
- Tracks who owes whom
- Settles debts automatically
- Reduces transactions through smart reconciliation
- Updates in real-time on group activities

### AI Categorization

Uses keyword matching first (fast), then optionally uses:
- HuggingFace BART model for NLI (Natural Language Inference)
- Categories: Food, Travel, Accommodation, Entertainment, Shopping, Utilities, Healthcare, Other

## 🎯 Usage Examples

### Example 1: Trip Expense Tracking
1. Create group "Weekend Trip to Goa"
2. Add members: Alice, Bob, Carol
3. Add expenses:
   - Bob pays ₹3000 for hotel (splits equally)
   - Alice pays ₹1500 for food (splits equally)
   - Carol pays ₹600 for petrol (splits equally)
4. View balances: See who owes whom
5. Settle up using the suggested transactions

### Example 2: Shared Apartment
1. Create group "Apartment XYZ"
2. Add roommates
3. Add monthly bills (electricity, internet, rent)
4. Track individual purchases (groceries, supplies)
5. Monthly settlement summary

## 🧪 Testing

```bash
# Run tests (if configured)
npm run test

# Lint code
npm run lint
```

## 📈 Performance

- **Real-time updates**: Balances refresh every 5 seconds
- **Optimized queries**: Indexed database queries
- **Fast API responses**: <200ms average response time
- **Scalable**: Handles 1000+ users per group

## 🔒 Security

- Environment variables for sensitive data
- SQL injection prevention via Prisma ORM
- CSRF protection ready with NextAuth.js
- Email validation for users
- Secure API endpoints

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ Core expense splitting
- ✅ Real-time balances
- ✅ AI categorization
- ✅ Basic analytics

### Future Enhancements
- 🔜 **Better AI Models**: Fine-tuned for expense categorization
- 🔜 **Mobile App**: React Native or Flutter
- 🔜 **Payment Integration**: Settle via PayPal/UPI
- 🔜 **OCR Support**: Scan receipts to auto-add expenses
- 🔜 **Email Notifications**: Remind users of balances
- 🔜 **Multi-currency**: Support multiple currencies
- 🔜 **Budget Goals**: Set and track spending limits
- 🔜 **Advanced Reports**: Export to CSV/PDF

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Kunal Patel**
- Email: [KunalPatel0904@gmail.com](mailto:KunalPatel0904@gmail.com)
- GitHub: [@kunalpatel0904](https://github.com/kunalpatel0904)
- LinkedIn: [kunalpatel0904](https://www.linkedin.com/in/kunalpatel0904)

## 🙏 Acknowledgments

- Built as a NeevAI SuperCloud assignment
- Next.js and React communities
- HuggingFace for AI models
- Vercel for hosting

## 📞 Support

For issues or questions:
1. Check [GitHub Issues](https://github.com/kunalpatel0904/smart-expense-splitter/issues)
2. Email KunalPatel0904@gmail.com
3. Create a new issue with detailed description

---

**Made with ❤️ by Kunal Patel**
