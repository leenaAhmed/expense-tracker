#  Expense Tracker Lite

A modern, responsive expense tracking web application built with **Angular 20**, featuring currency conversion, pagination, and offline-first architecture.

![Angular](https://img.shields.io/badge/Angular-20-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)


## 📸 Screenshots

![Dashboard](./assets/Screenshot1.png)
![Add Expense](./assets/Screenshot2.png)
![Login](./assets/Screenshot3.png)

## Features

### Core Functionality
- **User Authentication** - Simple email/password login
- **Dashboard** - Overview of balance, income, and expenses
- **Add Expenses** - Category selection, amount, date, and receipt upload
- **Currency Conversion** - Real-time exchange rates from Open Exchange Rates API
- **Pagination** - Load more functionality with 10 items per page
- **Date Filters** - This Month, Last 7 Days, Last 30 Days, This Year
- **Offline Support** - LocalStorage persistence
- **Responsive Design** - Mobile-first, works on all devices

### Technical Highlights
-  **Standalone Components** - Modern Angular architecture
-  **Tailwind CSS** - Utility-first styling matching Dribbble design
-  **Unit Tests** - Comprehensive Jasmine/Karma tests
-  **Lazy Loading** - Route-based code splitting
-  **Type Safety** - Strict TypeScript configuration

---

##  Architecture

### Project Structure

```
expense-tracker/
├── src/
│   ├── app/
│   │   ├── core/                      # Singleton services & models
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts      # Route protection
│   │   │   ├── models/
│   │   │   │   └── expense.model.ts   # Data types & enums
│   │   │   └── services/
│   │   │       ├── storage.service.ts # LocalStorage wrapper
│   │   │       ├── currency.service.ts # Exchange rate API
│   │   │       └── expense.service.ts # Business logic
│   │   ├── features/                  # Feature modules
│   │   │   ├── auth/
│   │   │   │   ├── login.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── dashboard/
│   │   │   │   └── dashboard.ts
│   │   │   └── expenses/
│   │   │       └── add-expense.ts
│   │   ├── shared/
    │   │   ├── components/
    │   │   │   ├── navigation.ts (standalone)
    │   │   │   └── expenses-summary.ts (standalone)

│   │   ├── app.routes.ts              # Route configuration
│   │   ├── app.config.ts              # App providers
│   │   └── app.ts           # Root component
│   ├── styles.scss                     # Global Tailwind styles
│   └── main.ts                         # Bootstrap
├── tailwind.config.js
├── angular.json
├── package.json
└── README.md
```

### Design Patterns

1. **Service Layer Pattern** - Business logic separated from UI
2. **Observer Pattern** - RxJS for reactive state management
3. **Guard Pattern** - Route protection with functional guards
4. **Repository Pattern** - StorageService abstracts data persistence

---

## 🌐 API Integration

### Currency Conversion API

**Endpoint:** `https://open.er-api.com/v6/latest/USD`

**Implementation Details:**
-  No API key required
-  Response caching (1 hour TTL)
-  Graceful error handling with fallback
-  Conversion formula: `amountInUSD = amount / exchangeRate`

**Example Response:**
```json
{
  "result": "success",
  "base_code": "USD",
  "rates": {
    "EUR": 0.85,
    "GBP": 0.73,
    "EGP": 48.50
  }
}
```

**Caching Strategy:**
```typescript
private cache = new Map<string, { rate: number; timestamp: number }>();
private CACHE_DURATION = 3600000; // 1 hour

// Check cache before API call
if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
  return of(amount / cached.rate);
}
```

---

## 📄 Pagination Strategy

### Client-Side Pagination

**Approach:** All filtering and pagination done in-memory

**Rationale:**
-  No backend required for MVP
-  Instant filtering with no network delay
-  Simpler implementation
-  Works offline

 

**Trade-offs:**
-  **Pros:** Fast, offline-capable, simple
-  **Cons:** All data loaded upfront (not scalable for 10,000+ expenses)
-  **Future:** Switch to server-side pagination when backend exists

---

##  UI/UX Implementation

### Design Matching

**Source:** [Dribbble - Expense Tracker App](https://dribbble.com/shots/expense-tracker)



**Key UI Components:**
1. **Gradient Header** - Blue rounded card with backdrop blur
2. **Category Icons** - Grid layout with emoji icons
3. **FAB Button** - Floating action button with shadow
4. **Bottom Navigation** - Fixed navigation bar



##  Testing

### Test Coverage

**Services:**
-  ExpenseService (10 tests)


### Running Tests

```bash
# Run all tests
ng test

# Run with coverage
ng test --code-coverage

```

 

##  Getting Started

### Prerequisites

```bash
Node.js: >= 19.x
npm: >= .x
Angular CLI: >= 20.x
```

### Installation

```bash
# Clone repository
git clone https://github.com/leenaAhmed/expense-tracker.git
cd expense-tracker

# Install dependencies
npm install

# Start development server
ng serve

# Open browser
open http://localhost:4200
```

### Build for Production

```bash
# Production build
ng build --configuration production

# Output location
dist/expense-tracker/
```

---

##  Data Persistence

### LocalStorage Schema

```typescript
// Storage Keys
expense_tracker_expenses: Expense[]
expense_tracker_income: number
expense_tracker_current_user: User

// Example Expense Object
{
  "id": "1699123456789-abc123",
  "category": "Groceries",
  "categoryIcon": "shopping-cart",
  "amount": 100,
  "currency": "EUR",
  "amountInUSD": 117.65,
  "date": "2024-11-05T10:30:00.000Z",
  "receipt": "data:image/png;base64...",
  "frequency": "Manually",
  "createdAt": "2024-11-05T10:30:00.000Z"
}
```


##  Trade-offs & Assumptions

### Trade-offs Made

1. **Client-Side Pagination**
   -  Simpler, no backend needed
   -  Doesn't scale to thousands of expenses
 
2. **LocalStorage vs IndexedDB**
   -  Simpler API, synchronous
   -  5-10MB storage limit
   -  Can upgrade to IndexedDB if needed

3. **Mock Login**
   -  Quick MVP, no backend required
   -  No real authentication
   -  Ready for JWT integration


### Assumptions

-  Users manage personal expenses (single-user)
-  Average 100-500 expenses per user
-  USD as base currency for reporting
-  Modern browser with ES2020+ support
-  Decent internet for currency API (optional)

---

##  Known Issues

### Current Limitations

1. **No Backend**
   - Data lost on browser cache clear
   - No cross-device sync
   - **Solution:** Implement Firebase/Supabase backend

2. **Currency API Rate Limit**
   - Free tier: ~1500 requests/month
   - **Solution:** Implement request throttling

3. **No Export Feature**
   - Can't download reports yet
 
4. **Limited Category Customization**
   - Fixed 7 categories
   - **Solution:** Add custom category creation

---

##  Future Enhancements

### Phase 2 Features

- [ ] **Charts** - Expense breakdown by category (Chart.js)
- [ ] **Budget Goals** - Set monthly budgets with alerts
- [ ] **Recurring Expenses** - Auto-add monthly bills
- [ ] **CSV Export** - Download expense reports
- [ ] **Dark Mode** - Toggle theme preference
- [ ] **Multi-Currency Display** - Show in user's preferred currency
- [ ] **Search & Filter** - Advanced expense search
- [ ] **Receipt OCR** - Extract data from images

### Infrastructure

- [ ] **CI/CD Pipeline** - GitHub Actions for testing
- [ ] **PWA** - Service worker for offline mode
- [ ] **Backend API** - NestJS/Express with PostgreSQL
- [ ] **Docker** - Containerization for deployment
- [ ] **Analytics** - Track user behavior (privacy-first)

---

##  Dependencies

---

##  Acknowledgments

- Design inspiration from [Dribbble](https://dribbble.com)
- Currency data from [Open Exchange Rates](https://open.er-api.com)
- Icons from [Lucide Icons](https://lucide.dev)

---