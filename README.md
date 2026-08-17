# ApexFinance — Personal Finance & Budget Dashboard 🚀

> **A powerful, 100% private, offline-first personal finance dashboard built with pure Vanilla JavaScript, HTML5, and CSS3.**  
> Upload your bank CSV statement (or manually log transactions) to instantly clean, auto-categorize, and analyze your financial health with executive Chart.js visualizations, category budgeting, and smart insights.

![ApexFinance Hero Banner](hero_illustration.jpg)

---

## 📊 Project Overview

**ApexFinance** is a complete client-side personal finance management platform featuring a beautifully designed landing page (`index.html`) and a feature-rich analytics dashboard (`dashboard.html`). All financial data stays strictly in your browser's `localStorage` — no backend servers, no cloud uploads, no tracking.

### ✨ Two-Page Application Structure

| Page | File | Purpose |
|------|------|---------|
| **Landing Page** | `index.html` | Marketing hero, feature showcase, FAQ, and dashboard entry point |
| **Finance Dashboard** | `dashboard.html` | CSV import, analytics, budgeting, transaction management |

---

## 🏗️ Architecture & Engine Design

The application is organized into **9 modular systems** in pure Vanilla JavaScript (ES6+):

```
app.js (≈2000 lines)
├── 1. State & Storage Management
│   ├── localStorage persistence (transactions, budgets, theme)
│   └── Centralized State object with reactive refresh
│
├── 2. Auto-Categorization Engine
│   ├── 8 predefined categories + keyword rules map
│   └── Bidirectional category ↔ type synchronization
│
├── 3. CSV Parser & Column Mapper
│   ├── PapaParse integration
│   ├── Smart header auto-detection
│   ├── Custom column mapping modal (with live preview)
│   └── Deduplication algorithm
│
├── 4. Filtering, Sorting & Pagination
│   ├── 6 date presets + custom date range
│   ├── Live search (description + category)
│   ├── 5 sortable table columns
│   └── Configurable pagination (15/30/50/100 per page)
│
├── 5. Metrics Calculation Engine
│   ├── Total Income / Expenses / Net Savings / Savings Rate
│   └── Dynamic color coding for negative savings
│
├── 6. Chart.js Visualizations (4 interactive charts)
│   ├── Monthly Cash Flow Trend — Area Line Chart
│   ├── Spending by Category — Doughnut Chart
│   ├── Income vs Expenses — Grouped Bar Chart
│   └── Category Spend Over Time — Stacked Bar Chart
│
├── 7. Category Budgeting System
│   ├── Monthly budget limits per expense category
│   └── Color-coded progress indicators (🟢 Safe / 🟡 Warning / 🔴 Over)
│
├── 8. Smart Financial Insights Engine
│   ├── Recurring subscription detection
│   ├── Category spend surge alerts
│   └── Month-end expenditure forecasting
│
└── 9. UI / UX & Theme System
    ├── Dark/Light theme toggle with persistence
    ├── Toast notifications system
    ├── Drag & drop CSV upload
    ├── Modal dialogs (Add/Edit TX, Manage Budgets, CSV Mapping)
    └── Silent context menu & DevTools protection
```

---

## 🌟 Key Features

### 1. ⚡ Instant Bank CSV Upload & Smart Header Mapping
- **Universal CSV Parser**: Powered by **PapaParse**, upload any bank statement or CSV file from any country.
- **Auto-Detection Engine**: Automatically detects date, description, amount, credit/debit, and category headers using keyword heuristics.
- **Custom Column Mapper Modal**: Easily map custom column names for any bank format with a live 3-row preview table.
- **Smart Type Detection Rules**:
  - ✨ Smart AI Auto-Detect (Recommended)
  - Negative Numbers = Expense, Positive = Income
  - Positive Numbers = Expense (Unless Salary/Income Keyword)
  - Use explicit Type / CR-DR Column
- **Append or Replace**: Choose whether imported data replaces or appends to existing transactions.
- **Automatic Deduplication**: Prevents duplicate imports using composite keys (date + description + amount + type).

### 2. 🧠 Smart Income & Expense Auto-Classifier
- **Rule-Based Engine**: Keyword classification engine automatically tags transactions across 8 default categories:
  - **Income**: Salary, Payroll, Bonus, Freelance, Dividend, Interest, Stipend, Deposit, Refund, Reimbursement, Cashback, Gift
  - **Transport**: Uber, Lyft, Taxi, Chevron, Shell, Gas, Subway, Parking, Transit
  - **Groceries**: Whole Foods, Trader Joe's, Target, Safeway, Aldi, Costco, Supermarket
  - **Subscriptions**: Netflix, Spotify, Hulu, Disney+, Apple, Prime, HBO Max, YouTube, Patreon
  - **Dining Out**: Starbucks, Chipotle, Restaurants, Coffee, Cafe, Burgers, Pizza, DoorDash, Uber Eats
  - **Utilities**: Electric, Water, Power, Comcast, AT&T, Verizon, Internet, Bills
  - **Shopping**: Amazon, Nike, Apple Store, Electronics, Zara, Clothing, eBay, Walmart
  - **Fitness**: Gym, Fitness, Peloton, CrossFit, Yoga, Sports
- **Positive-Amount CSV Support**: Intelligently categorizes positive-only bank statement rows containing `JOB`, `CREDIT`, `INCOME`, `SECOND WORK`, `CASHBACK`, `GIFT`, or `DEPOSIT INTEREST` as **Income** instead of Expense.
- **Bi-Directional Sync**: Updating a transaction's category dynamically syncs its type, and clicking any type badge toggles `Income` ↔ `Expense` live.
- **Flexible Date Parser**: Handles ISO 8601, DD/MM/YYYY, MM/DD/YYYY, YYYY/MM/DD formats automatically.

### 3. 📊 Interactive Chart.js Visualizations
- **Monthly Cash Flow Trend**: Smooth gradient area line chart tracking spending patterns with animated tooltips.
- **Spending by Category**: Interactive doughnut chart displaying category proportions with custom color palette.
- **Income vs. Expenses**: Grouped bar chart comparing monthly inflow against outflow side-by-side.
- **Category Spend Over Time**: Stacked bar chart highlighting spending dynamics per category across months.

### 4. 🎯 Category Monthly Budgeting
- **Target Spending Caps**: Set monthly limit caps for expense categories (Groceries, Transport, Dining Out, Utilities, Shopping, Fitness, etc.).
- **Real-Time Progress Indicators**: Color-coded progress bars:
  - 🟢 **< 80%**: Safe budget health (green)
  - 🟡 **80% - 100%**: Approaching limit (amber/yellow)
  - 🔴 **> 100%**: Over-budget warning (red)
- **Manage Budgets Modal**: Dedicated modal UI to set all category limits at once.

### 5. 💡 Smart Financial Insights Engine
- **Recurring Subscription Detector**: Flags repeating monthly services (Netflix, Spotify, Gym, etc.) using pattern matching.
- **Spend Surge Alerts**: Warns when spending in any category surges significantly above historical averages.
- **Projected Month-End Forecast**: Estimates month-end expenditure based on current daily burn rate.
- **Top Spending Categories**: Automatically surfaces your highest-spend categories.

### 6. 🔍 Search, Filter & Pagination Engine
- **Timeframe Filters**: This Month, Last Month, Last 30 Days, Year to Date (YTD), All Time, and Custom Range.
- **Live Search Bar**: Instant fuzzy search across payees, merchants, descriptions, and categories.
- **Dynamic Sorting**: Click any column header (Date, Description, Category, Type, Amount) to sort ascending/descending.
- **Category Filter**: Narrow to a specific expense/income category.
- **Type Filter**: All / Expenses Only / Income Only.
- **Export Filtered Data**: One-click CSV export of the currently filtered transaction view.
- **Configurable Pagination**: 15 / 30 / 50 / 100 transactions per page with page navigation.

### 7. 🔒 100% Private, Offline-First & Silent Security
- **Local Persistence**: Stores your data exclusively in your browser's `localStorage` using 3 namespaced keys:
  - `apex_finance_transactions` — All transaction records
  - `apex_finance_budgets` — Category budget limits
  - `apex_finance_theme` — User's theme preference
- **Zero Server Communication**: No data is sent to any server — all parsing, calculation, and storage happens locally.
- **Complete Offline Support**: Once the page is loaded (and CDN libraries are cached), it works fully offline.
- **Silent DevTools Protection**: Right-click context menus and common DevTools keyboard shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U) are handled cleanly and silently.

### 8. 🎨 Premium UI / UX Design System
- **Dual Theme Support**: Dark (default) and Light themes with smooth transitions, persisted across sessions.
- **Glassmorphism Aesthetic**: Frosted glass cards with backdrop blur, ambient background glow orbs.
- **Executive Typography**: Plus Jakarta Sans (UI) + JetBrains Mono (tabular figures) via Google Fonts.
- **Lucide Icons**: Modern, consistent iconography throughout the interface.
- **Toast Notification System**: Non-intrusive success/error/info messages with auto-dismiss.
- **Drag & Drop CSV Upload**: Full-page drag-drop overlay with visual feedback.
- **Modal Dialogs**:
  - Add / Edit Transaction (date, description, amount, type, category)
  - Manage Category Budgets
  - CSV Column Mapping (with preview table)
- **Empty State UI**: Beautiful onboarding state with clear CTA when no data exists.
- **Fully Responsive**: Grid-based layout that adapts to all screen sizes from mobile to desktop.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Core Logic** | Vanilla JavaScript (ES6+) | State management, CSV parsing, chart controllers, engines |
| **Markup** | Semantic HTML5 | Page structure, forms, modals, accessibility |
| **Styling** | Vanilla CSS3 (CSS Custom Properties) | Design tokens, themes, responsive grid, glassmorphism |
| **Typography** | Google Fonts (Plus Jakarta Sans + JetBrains Mono) | Executive, modern font pairing |
| **Icons** | Lucide Icons (unpkg CDN) | 1200+ consistent vector icons |
| **CSV Parsing** | PapaParse 5.4.1 (CDN) | High-performance, fault-tolerant CSV parsing |
| **Charts** | Chart.js 4.4.1 (CDN) | 4 types of responsive interactive visualizations |
| **Storage** | Browser localStorage | Namespaced, offline-first data persistence |

---

## 🚀 Getting Started

ApexFinance runs **entirely in the browser** with zero Node.js build steps, npm installs, or backend server dependencies!

### Option 1: Direct Browser Launch
1. Clone or download this repository:
   ```bash
   git clone https://github.com/atanudas12-hub/ApexFinance.git
   ```
2. Open `index.html` directly in any modern web browser (Chrome, Firefox, Edge, Safari 14+).

### Option 2: Local HTTP Server (Recommended)
Some browsers restrict `localStorage` or CDN access on `file://` protocol. Run a lightweight HTTP server:

**Using Python (pre-installed on most systems):**
```bash
# Python 3.x
python -m http.server 8080
```

**Using Node.js (npx):**
```bash
npx serve .
```

**Using PHP:**
```bash
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

---

## 📖 Usage Guide

### Quick 3-Step Workflow
1. **Open Dashboard** → Click "Start Calculating" from the landing page or open `dashboard.html`.
2. **Upload Data** → Click "Upload CSV" (or drag-drop a CSV file), then confirm column mapping.
3. **Analyze** → Explore charts, set budgets, and review insights. Or add transactions manually with "Add Transaction".

### 📄 Supported CSV Formats

ApexFinance works with **any** bank CSV. Here are examples of common formats:

#### Format A: Standard 3-Column (Date, Description, Amount)
```csv
Date,Description,Amount
2026-01-05,Monthly Salary Deposit,5200.00
2026-01-06,Whole Foods Market #123,-87.42
2026-01-07,UBER   TRIP HELP.UBER.COM,-23.15
2026-01-08,NETFLIX.COM,-15.99
2026-01-09,STARBUCKS STORE 01234,-6.75
```

#### Format B: Separate Debit & Credit Columns
```csv
Transaction Date,Merchant,Category,Debit,Credit
01/05/2026,ACME Corp Payroll,Income,,5200.00
01/06/2026,Trader Joe's,Groceries,64.20,
01/07/2026,Spotify USA,Subscriptions,9.99,
01/08/2026,Shell Gas Station,Transport,45.00,
```

#### Format C: With Type / CR-DR Indicator
```csv
Posted_Date,Narrative,Value,CR_DR
2026-01-05,SALARY JAN 2026,5200.00,CR
2026-01-06,AMAZON.COM ORDER #ABC,142.89,DR
2026-01-07,CHEVRON GAS 00456,38.50,DR
```

### Column Mapping Options
When you upload a CSV, the mapping modal lets you configure:
| Field | Required? | Notes |
|-------|-----------|-------|
| **Date Column** | ✅ Yes | Any date format works |
| **Description / Payee Column** | ✅ Yes | Merchant, payee, or memo |
| **Amount / Debit Column** | ✅ Yes | Primary amount value |
| **Credit Column** | ⚪ Optional | Separate credit column if your bank uses one |
| **Category Column** | ⚪ Optional | If your CSV already has categories, use them; otherwise auto-categorize |
| **Type / CR-DR Column** | ⚪ Optional | Explicit CR/DR or Income/Expense indicator |

---

## 📁 Repository Structure

```
ApexFinance/
├── index.html              # Landing page — hero, features, FAQ, CTA (290 lines)
├── dashboard.html          # Main dashboard — analytics, CSV upload, modals (670 lines)
├── style.css               # Complete design system, CSS variables, dark/light themes, glassmorphism
├── app.js                  # Core engine — 9 modules: state, parser, charts, filters, budgeting, insights (~2000 lines)
├── hero_illustration.jpg   # 3D fintech hero banner asset for landing page
└── README.md               # Comprehensive documentation & usage guide
```

---

## 🧩 Default Data Reference

### Default Categories
```
Groceries, Transport, Subscriptions, Dining Out, Utilities,
Shopping, Fitness, Health, Leisure, Food, Public transport,
Cafe, Taxi, Gifts, Clothes, Job, Second work,
Debt return / Borrowed money, Gift, Cashback, Deposit interest,
Income, Uncategorized
```

### Default Monthly Budgets
| Category | Default Limit |
|----------|---------------|
| Groceries | $500 |
| Dining Out | $250 |
| Transport | $150 |
| Subscriptions | $60 |
| Shopping | $200 |
| Utilities | $200 |
| Fitness | $80 |

---

## 🔧 Troubleshooting & FAQ

### ❓ CSV isn't importing correctly?
1. Open the **Column Mapping Modal** and verify each column is assigned correctly.
2. Try different **Income vs Expense Rules** in the dropdown (especially "Negative Numbers = Expense").
3. Check that your date column is parseable — ApexFinance handles most formats.

### ❓ Transactions are showing as the wrong type?
- Click the **Type badge** on any transaction row to toggle Income ↔ Expense instantly.
- Or click **Edit** (⋯ menu) to manually change both category and type.

### ❓ Where is my data stored? Can I back it up?
- All data lives in your browser's `localStorage` on this specific device/browser profile.
- Use the **Export** button on the filter toolbar to save a CSV backup of your filtered (or all) transactions.
- To fully reset: click **Clear All** on the transaction table header.

### ❓ Charts are empty or not showing?
- Ensure you have transactions in the selected date range.
- Change the **Timeframe** filter to "All Time" to see everything.
- Charts update automatically whenever filters, transactions, or budgets change.

### ❓ Theme changes aren't persisting?
- Check that browser storage/cookies aren't being cleared on exit.
- The preference is stored under the `apex_finance_theme` localStorage key.

### ❓ Why is right-click / Inspect Element disabled?
- This is a privacy feature for users who work with sensitive financial data in shared environments.
- The code is fully open-source — you can remove the `disableInspectElement()` call in `app.js:97` if desired.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 🙏 Acknowledgments

Built with precision using:
- [PapaParse](https://www.papaparse.com/) — The powerful, in-browser CSV parser for big boys and girls
- [Chart.js](https://www.chartjs.org/) — Simple yet flexible JavaScript charting
- [Lucide Icons](https://lucide.dev/) — Beautiful, consistent open-source iconography
- Google Fonts — Plus Jakarta Sans & JetBrains Mono typefaces

---

> **Built with precision. Your finances, your privacy. © 2026 ApexFinance.**
