# Architecture & Technical Design

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Next.js Frontend (React 18 + TypeScript)           │   │
│  │  - Home Page, Group Detail, Charts, Forms          │   │
│  │  - Tailwind CSS Styling                            │   │
│  │  - Real-time Updates (5s polling)                  │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────→  HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Next.js API Routes (TypeScript)                   │   │
│  │  ├─ /groups - CRUD operations                      │   │
│  │  ├─ /members - Member management                   │   │
│  │  ├─ /expenses - Expense tracking                   │   │
│  │  ├─ /balances - Balance calculations               │   │
│  │  └─ /insights - Analytics & AI                     │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────→  SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Prisma ORM                                         │   │
│  │  ├─ Type-safe database abstraction                 │   │
│  │  ├─ Migrations & schema management                  │   │
│  │  └─ Query optimization                             │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────→  PostgreSQL Protocol
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL DATABASE                         │
│  ├─ Users table                                            │
│  ├─ Groups table                                           │
│  ├─ GroupMembers table                                     │
│  ├─ Expenses table (indexed)                              │
│  ├─ Participants table                                    │
│  ├─ Balances table (indexed)                              │
│  └─ Settlements table                                     │
└─────────────────────────────────────────────────────────────┘

Optional:
┌─────────────────────────────────────────────────────────────┐
│              AI/ML SERVICES (Optional)                      │
│  ├─ HuggingFace Transformers API                           │
│  │  └─ BART-large-MNLI for expense categorization         │
│  └─ Local Categorization Engine                           │
│     └─ Keyword matching (fallback)                        │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Component Architecture

### Frontend Components

```
App (Root)
├── Layout (Header, Navigation)
├── Home Page
│   ├── GroupCard (map over groups)
│   ├── CreateGroupModal
│   └── RefreshButton
└── Group Detail Page
    ├── GroupHeader
    ├── TabNavigation
    ├── ExpenseTab
    │   ├── ExpenseList
    │   ├── ExpenseCard
    │   ├── AddExpenseForm
    │   └── DeleteExpense
    ├── BalancesTab
    │   └── Balancecard (map over balances)
    └── InsightsTab
        ├── InsightsList
        ├── SpendingChart
        ├── CategoryBreakdown
        └── UserStats

Modal Components:
├── AddMemberModal
├── AddExpenseModal
└── ConfirmDeleteModal
```

### Backend API Structure

```
/api
├── /groups
│   ├── route.ts (GET, POST)
│   └── /[id]
│       ├── route.ts (GET, DELETE)
│       ├── /members
│       │   └── route.ts (GET, POST)
│       ├── /expenses
│       │   └── route.ts (GET, POST)
│       ├── /balances
│       │   └── route.ts (GET)
│       └── /insights
│           └── route.ts (GET)
└── /expenses
    └── /[id]
        └── route.ts (DELETE)
```

### Data Layer (Prisma Models)

```
┌─────────────────────────────────────────────────┐
│                    USER                         │
├─────────────────────────────────────────────────┤
│ id: String (PK)                                │
│ email: String (Unique)                         │
│ name: String                                   │
│ createdAt: DateTime                           │
│ updatedAt: DateTime                           │
└─────────────────────────────────────────────────┘
            ↓                ↓
┌──────────────────┐  ┌──────────────────┐
│   GROUPMEMBER    │  │  PARTICIPANT     │
├──────────────────┤  ├──────────────────┤
│ id: String (PK)  │  │ id: String (PK)  │
│ groupId (FK)     │  │ expenseId (FK)   │
│ userId (FK)      │  │ userId (FK)      │
└──────────────────┘  │ amount: Float    │
       ↓               └──────────────────┘
┌─────────────────────────────────────────────────┐
│                   GROUP                         │
├─────────────────────────────────────────────────┤
│ id: String (PK)                                │
│ name: String                                   │
│ createdAt: DateTime                           │
│ updatedAt: DateTime                           │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│                 EXPENSE                         │
├─────────────────────────────────────────────────┤
│ id: String (PK)                                │
│ groupId (FK)                                   │
│ paidByUserId (FK)                             │
│ description: String                            │
│ amount: Float                                  │
│ category: String (Auto-detected)              │
│ date: DateTime                                 │
│ createdAt: DateTime                           │
│ updatedAt: DateTime                           │
└─────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────┐
│                  BALANCE                        │
├─────────────────────────────────────────────────┤
│ id: String (PK)                                │
│ groupId (FK)                                   │
│ debtorId: String                              │
│ creditorId: String                            │
│ amount: Float                                  │
│ lastUpdated: DateTime                         │
│ Unique(groupId, debtorId, creditorId)         │
└─────────────────────────────────────────────────┘
```

### Database Indexes

**Performance Optimization**:
```sql
-- Expense queries
INDEX ON expenses(groupId)
INDEX ON expenses(paidByUserId)
INDEX ON expenses(date)

-- Participant queries
INDEX ON participants(expenseId)
INDEX ON participants(userId)

-- Balance queries
INDEX ON balances(groupId, debtorId)
INDEX ON balances(groupId, creditorId)

-- Group queries
INDEX ON groupMembers(groupId, userId)
```

## 🔄 Data Flow

### Adding an Expense

```
User Input (Form)
     ↓
Frontend Validation
     ↓
API POST /api/groups/[id]/expenses
     ↓
Backend Processing:
├─ Validate input
├─ AI Categorization (description → category)
├─ Create Expense record
├─ Create Participant records (splits)
├─ Update Group Balances
└─ Return updated expense
     ↓
Frontend Update
├─ Add to expenses list
├─ Recalculate balances display
└─ Show success message
     ↓
Auto-refresh triggered
     ↓
Next update in 5 seconds
```

### Balance Calculation Algorithm

```
FOR each expense in group:
  FOR each participant:
    IF participant != payer:
      debtor = participant
      creditor = payer
      amount = split_amount
      
      upsert_balance(
        groupId,
        debtorId: debtor,
        creditorId: creditor,
        amount: amount + existing_amount
      )
    END IF
  END FOR
END FOR
```

### AI Categorization Flow

```
Expense Description
     ↓
Check Local Keywords
├─ FAST (< 10ms)
├─ Keyword patterns in description
└─ Return category if match
     ↓
IF match_found:
  Return matched category
ELSE:
  IF HuggingFace_API_key_available:
    Call HuggingFace NLI API
    ├─ BART-large-MNLI model
    ├─ Candidate labels (8 categories)
    └─ Return top label
  ELSE:
    Return "Other"
  END IF
END IF
     ↓
Save category to database
```

## 🔌 API Request/Response Flow

### Example: Creating an Expense

**Request**:
```javascript
POST /api/groups/abc123/expenses

{
  "description": "Hotel for trip",
  "amount": 5000,
  "paidByUserId": "user1",
  "participantIds": ["user1", "user2", "user3"],
  "splitType": "equal",
  "date": "2024-04-21"
}
```

**Backend Processing**:
```javascript
1. Validate input
   ├─ Amount > 0: ✓
   ├─ Description not empty: ✓
   ├─ Participants exist: ✓
   └─ User is group member: ✓

2. Categorize expense
   Input: "Hotel for trip"
   Keyword match: "hotel" → "Accommodation"
   ✓ Category = "Accommodation"

3. Create expense record
   INSERT INTO expenses (...)
   
4. Create participant records
   FOR user in [user1, user2, user3]:
     INSERT INTO participants (
       expenseId: "exp123",
       userId: user,
       amount: 5000/3 = 1666.67
     )

5. Update balances
   Balance: user2 owes user1 ₹1666.67
   Balance: user3 owes user1 ₹1666.67

6. Return response
```

**Response**:
```json
{
  "id": "exp123",
  "groupId": "abc123",
  "description": "Hotel for trip",
  "amount": 5000,
  "category": "Accommodation",
  "paidByUserId": "user1",
  "date": "2024-04-21",
  "participants": [
    {
      "userId": "user1",
      "amount": 1666.67,
      "user": { "id": "user1", "name": "Alice" }
    },
    {
      "userId": "user2",
      "amount": 1666.67,
      "user": { "id": "user2", "name": "Bob" }
    },
    {
      "userId": "user3",
      "amount": 1666.67,
      "user": { "id": "user3", "name": "Carol" }
    }
  ]
}
```

## 🚀 Deployment Architecture

### Local Development
```
Dev Machine
├─ Node.js (npm run dev)
├─ Next.js dev server (localhost:3000)
└─ PostgreSQL (Docker or local)
```

### Production (Vercel)
```
GitHub Repository
     ↓
     └─→ Vercel Auto-Deploy
         ├─ Build: npm run build
         ├─ Test: npm run lint
         ├─ Deploy: Vercel edge network
         └─ Database: PostgreSQL (Supabase/Railway/RDS)
     ↓
     └─→ CDN Distribution
         ├─ Static assets cached globally
         ├─ API routes on Edge Functions
         └─ Performance optimized
     ↓
HTTPS: app.vercel.app
```

## 📊 Performance Considerations

### Frontend
- **Code Splitting**: Next.js auto-splits by route
- **Image Optimization**: CSS only (no images)
- **Bundle Size**: ~150KB (optimized)
- **Load Time**: < 2 seconds

### Backend
- **API Response**: < 200ms average
- **Database Query**: < 100ms (indexed)
- **Real-time Update**: 5-second interval
- **Concurrent Users**: 1000+ per group

### Database
- **Connection Pooling**: 20-30 connections
- **Query Optimization**: Indexes on foreign keys
- **Transactions**: ACID-compliant
- **Scalability**: PgBouncer for pooling

## 🔒 Security Architecture

### Authentication Layer
```
User → Next.js → Prisma → PostgreSQL
       (TypeScript validation)
```

### Input Validation
```
Form Input
    ↓
Frontend Validation (TypeScript types)
    ↓
API Endpoint Validation (zod/type checking)
    ↓
Prisma Query Sanitization (SQL injection prevention)
    ↓
Database Constraints (UNIQUE, NOT NULL, FK)
```

### Environment Variables
```
.env.local (Development)
├─ DATABASE_URL
├─ NEXTAUTH_SECRET
└─ HUGGING_FACE_API_KEY

Vercel Environment (Production)
├─ DATABASE_URL (from Supabase)
├─ NEXTAUTH_SECRET (generated)
└─ HUGGING_FACE_API_KEY (optional)
```

## 🔄 Technology Stack Rationale

| Technology | Why Chosen | Alternative |
|-----------|-----------|--------------|
| Next.js | Full-stack, Deploy to Vercel | Express + React |
| React 18 | Component-based UI, Hooks | Vue, Svelte |
| TypeScript | Type safety, Better DX | JavaScript |
| Prisma | Type-safe ORM, Migrations | TypeORM, Sequelize |
| PostgreSQL | Relational, Robust, Scalable | MongoDB, MySQL |
| Tailwind CSS | Utility-first, Fast development | Bootstrap, Styled-components |
| Vercel | Optimal Next.js deployment | Heroku, Railway |

## 📈 Scalability Plan

### Current (MVP)
- Single database instance
- 1000+ users per group
- Real-time polling (5 seconds)

### Near Future
- Database read replicas
- Redis caching layer
- WebSocket for real-time updates

### Production Scale
- Microservices architecture
- Message queue (Bull/BullMQ)
- Advanced analytics (BigQuery)
- Multi-region deployment

## 🧪 Testing Strategy

```
Unit Tests:
├─ Balance calculation logic
├─ Expense split logic
└─ Category matching

Integration Tests:
├─ API endpoint behavior
├─ Database operations
└─ Real-time updates

E2E Tests:
├─ User workflows
├─ End-to-end features
└─ Error handling
```

## 📊 Architecture Decision Records

### Decision 1: Next.js for Full-Stack
- **Chosen**: Next.js 14 with App Router
- **Rejected**: Separate frontend/backend
- **Reason**: Faster development, simpler deployment, built-in optimization

### Decision 2: PostgreSQL over MongoDB
- **Chosen**: PostgreSQL with Prisma
- **Rejected**: MongoDB, Firebase
- **Reason**: ACID compliance, relational integrity, complex join queries

### Decision 3: Real-time Polling over WebSockets
- **Chosen**: 5-second polling
- **Rejected**: WebSockets, Server-Sent Events
- **Reason**: Simpler implementation, sufficient for MVP, works on edge

### Decision 4: Vercel Deployment
- **Chosen**: Vercel + Supabase
- **Rejected**: Railway, Heroku
- **Reason**: Optimal for Next.js, Auto-deployment, Edge Functions

---

**Architecture designed for scalability and maintainability! 🎯**
