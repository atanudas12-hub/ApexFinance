# ApexFinance — Personal Finance & Budget Dashboard 🚀

> **A powerful, 100% private, offline-first personal finance dashboard built with pure Vanilla JavaScript, HTML5, and CSS3.**  
> Upload your bank CSV statement (or manually log transactions) to instantly clean, auto-categorize, and analyze your financial health with executive Chart.js visualizations, category budgeting, and smart insights.

![ApexFinance Hero Banner](hero_illustration.jpg)

---

## 🌟 Key Features

### 1. ⚡ Instant Bank CSV Upload & Smart Header Mapping
- **Universal CSV Parser**: Powered by **PapaParse**, upload any bank statement or CSV file.
- **Auto-Detection Engine**: Automatically detects date, description, amount, credit/debit, and category headers.
- **Custom Column Mapper Modal**: Easily map custom column names for any bank format with a live 3-row preview table.

### 2. 🧠 Smart Income & Expense Auto-Classifier
- **Rule-Based Engine**: Keyword classification engine automatically tags salary, groceries, transport, dining out, utilities, health, and shopping.
- **Positive-Amount CSV Support**: Intelligently categorizes positive-only bank statement rows containing `JOB`, `CREDIT`, `INCOME`, `SECOND WORK`, `CASHBACK`, `GIFT`, or `DEPOSIT INTEREST` as **Income** instead of Expense.
- **Bi-Directional Sync**: Updating a transaction's category dynamically syncs its type, and clicking any type badge toggles `Income` ↔ `Expense` live.

### 3. 📊 Interactive Chart.js Visualizations
- **Monthly Cash Flow Trend**: Smooth area line chart tracking spending patterns.
- **Spending by Category**: Interactive doughnut chart displaying category proportions.
- **Income vs. Expenses**: Grouped bar chart comparing monthly inflow against outflow.
- **Category Spend Over Time**: Stacked bar chart highlighting spending dynamics per month.

### 4. 🎯 Category Monthly Budgeting
- **Target Spending Caps**: Set monthly limit caps for expense categories (Groceries, Transport, Dining Out, Utilities, Shopping, Fitness, etc.).
- **Real-Time Progress Indicators**: Color-coded progress bars:
  - 🟢 **< 80%**: Safe budget health
  - 🟡 **80% - 100%**: Approaching limit
  - 🔴 **> 100%**: Over-budget warning

### 5. 💡 Smart Financial Insights Engine
- **Recurring Subscription Detector**: Flags repeating monthly services (Netflix, Spotify, Gym).
- **Spend Surge Alerts**: Warns when spending in any category surges significantly above average.
- **Projected Month-End Forecast**: Estimates month-end expenditure based on current burn rate.

### 6. 🔍 Search, Filter & Pagination Engine
- Filter transactions by **Timeframe** (This Month, Last Month, 3 Months, Year-to-Date, All Time, Custom Range).
- Live **Search Bar** for payees, merchants, accounts, and descriptions.
- Dynamic **Sorting** by Date, Description, Category, Type, or Amount.
- **Export Filtered Data**: One-click CSV export of filtered transaction views.

### 7. 🔒 100% Private, Offline-First & Silent Security
- **Local Persistence**: Stores your data exclusively in your browser's `localStorage`. No server uploads or external tracking.
- **Silent DevTools Protection**: Context menus and inspect element shortcuts are handled cleanly and silently for privacy.

---

## 🛠️ Technology Stack

- **Core**: Vanilla JavaScript (ES6+), Semantic HTML5, Vanilla CSS3 (Custom Variables Design Tokens)
- **Design Aesthetic**: Executive Dark/Light mode theme, glassmorphism, responsive grid system, Plus Jakarta Sans & JetBrains Mono typography
- **CDN Libraries**:
  - [PapaParse 5.4.1](https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js) — High-performance CSV parsing
  - [Chart.js 4.4.1](https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js) — Responsive interactive charts
  - [Lucide Icons](https://unpkg.com/lucide@latest) — Modern UI iconography

---

## 🚀 Getting Started

ApexFinance runs **entirely in the browser** with zero Node.js build steps, npm installs, or backend server dependencies!

### Option 1: Direct Browser Launch
1. Clone or download this repository:
   ```bash
   git clone https://github.com/atanudas12-hub/ApexFinance.git
   ```
2. Open `index.html` directly in any web browser (Chrome, Firefox, Edge, Safari).

### Option 2: Local HTTP Server
Run a lightweight HTTP server using Python:
```bash
# Python 3.x
python -m http.server 8080
```
Open `http://localhost:8080` in your browser.

---

## 📁 Repository Structure

```
ApexFinance/
├── index.html              # Main application single-page structure & modals
├── style.css               # Design system, CSS variables, dark/light themes & glassmorphism
├── app.js                  # Core engine, CSV parser, state manager & Chart.js controllers
├── hero_illustration.jpg   # 3D fintech hero illustration asset
└── README.md               # Documentation & usage guide
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
