#  Expense Tracker Lite

A modern, responsive expense tracking web application built with **Angular 18**, featuring currency conversion, pagination, and offline-first architecture.

![Angular](https://img.shields.io/badge/Angular-18-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)


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
- ✅ No API key required
- ✅ Response caching (1 hour TTL)
- ✅ Graceful error handling with fallback
- ✅ Conversion formula: `amountInUSD = amount / exchangeRate`

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
- ✅ No backend required for MVP
- ✅ Instant filtering with no network delay
- ✅ Simpler implementation
- ✅ Works offline

**Implementation:**
```typescript
getFilteredExpenses(filter: DateFilter, page: number, pageSize: number) {
  const filtered = this.applyDateFilter(allExpenses, filter);
  const sorted = filtered.sort((a, b) => b.date - a.date);
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    expenses: sorted.slice(start, end),
    pagination: {
      currentPage: page,
      hasMore: end < sorted.length
    }
  };
}
```

**Trade-offs:**
- ✅ **Pros:** Fast, offline-capable, simple
- ⚠️ **Cons:** All data loaded upfront (not scalable for 10,000+ expenses)
-  **Future:** Switch to server-side pagination when backend exists

---

##  UI/UX Implementation

### Design Matching

**Source:** [Dribbble - Expense Tracker App](https://dribbble.com/shots/expense-tracker)

**Tailwind Color Palette:**
```javascript
colors: {
  primary: '#6C5DD3',      // Purple buttons/accents
  success: '#00D9A5',      // Income indicator
  danger: '#FF6B6B',       // Expense indicator
  warning: '#FFB800',      // Alerts
}
```

**Key UI Components:**
1. **Gradient Header** - Blue rounded card with backdrop blur
2. **Category Icons** - Grid layout with emoji icons
3. **FAB Button** - Floating action button with shadow
4. **Bottom Navigation** - Fixed navigation bar

### Responsive Breakpoints

```scss
// Mobile First
.card { @apply p-4; }

// Tablet (md: 768px)
@media (min-width: 768px) {
  .card { @apply p-6; }
}

// Desktop (lg: 1024px)
@media (min-width: 1024px) {
  .container { @apply max-w-4xl; }
}
```

---

##  Testing

### Test Coverage

**Services:**
- ✅ ExpenseService (10 tests)
- ✅ CurrencyService (7 tests)
- ✅ StorageService (5 tests)

**Components:**
- ✅ DashboardComponent (6 tests)
- ✅ LoginComponent (4 tests)

### Running Tests

```bash
# Run all tests
ng test

# Run with coverage
ng test --code-coverage

# Coverage report location
open coverage/expense-tracker/index.html
```

### Key Test Cases

**1. Currency Conversion:**
```typescript
it('should convert EUR to USD correctly', (done) => {
  service.convertToUSD(85, 'EUR').subscribe(result => {
    expect(result).toBe(100); // 85 / 0.85 = 100
    done();
  });
});
```

**2. Pagination Logic:**
```typescript
it('should paginate results correctly', () => {
  const result = service.getFilteredExpenses(DateFilter.ALL, 1, 10);
  expect(result.expenses.length).toBe(10);
  expect(result.pagination.hasMore).toBe(true);
});
```

**3. Form Validation:**
```typescript
it('should require valid amount', () => {
  component.expenseForm.patchValue({ amount: -10 });
  expect(component.expenseForm.invalid).toBe(true);
});
```

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js: >= 18.x
npm: >= 9.x
Angular CLI: >= 18.x
```

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/expense-tracker.git
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

## 💾 Data Persistence

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

### Data Migration (Future)

```typescript
// If moving to IndexedDB or backend
async migrateLocalStorage() {
  const expenses = localStorage.getItem('expense_tracker_expenses');
  if (expenses) {
    await this.api.bulkUpload(JSON.parse(expenses));
    localStorage.removeItem('expense_tracker_expenses');
  }
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

- ✅ Users manage personal expenses (single-user)
- ✅ Average 100-500 expenses per user
- ✅ USD as base currency for reporting
- ✅ Modern browser with ES2020+ support
- ✅ Decent internet for currency API (optional)

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
   - **Solution:** Add CSV/PDF export (bonus feature)

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

### Core

```json
{
  "@angular/core": "^18.2.0",
  "@angular/common": "^18.2.0",
  "@angular/forms": "^18.2.0",
  "@angular/router": "^18.2.0",
  "rxjs": "^7.8.1",
  "date-fns": "^3.0.0"
}
```

### Dev

```json
{
  "tailwindcss": "^3.4.0",
  "typescript": "~5.4.0",
  "jasmine-core": "~5.1.0",
  "karma": "~6.4.0"
}
```

---


##  License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

##  Acknowledgments

- Design inspiration from [Dribbble](https://dribbble.com)
- Currency data from [Open Exchange Rates](https://open.er-api.com)
- Icons from [Lucide Icons](https://lucide.dev)

---



---

**Built with ❤️ using Angular 18 & Tailwind CSS**