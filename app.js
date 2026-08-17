/**
 * APEXFINANCE — PERSONAL FINANCE & BUDGET DASHBOARD
 * Engine & Architecture (Vanilla JS ES6+)
 * 
 * Modules:
 *  1. State & Storage Management
 *  2. Categorization Rules & Sanitization
 *  3. CSV Parser & Cleaning Engine
 *  4. Filtering & Metrics Calculation
 *  5. Visualizations (Chart.js Controller)
 *  6. Category Budgeting & Progress
 *  7. Financial Insights 
 *  8. Table Rendering & Pagination
 *  9. Theme Toggle & UI Interactivity
 */

'use strict';

/* ---------------------------------------------------------------------------
   1. GLOBAL STATE & CONSTANTS
   -------------------------------------------------------------------------- */

const STORAGE_KEYS = {
  TRANSACTIONS: 'apex_finance_transactions',
  BUDGETS: 'apex_finance_budgets',
  THEME: 'apex_finance_theme'
};

// Default Keyword -> Category Rules Map
const CATEGORY_RULES = {
  'Income': ['SALARY', 'PAYROLL', 'BONUS', 'FREELANCE', 'DIVIDEND', 'INTEREST', 'STIPEND', 'DEPOSIT', 'TRANSFER IN', 'JOB', 'CREDIT', 'INCOME', 'WAGES', 'EARNINGS', 'REFUND', 'REIMBURSEMENT', 'ACH CREDIT', 'CREDIT MEMO', 'PAYMENT RECEIVED', 'PAYMENT FROM', 'SECOND WORK', 'DEBT RETURN', 'CASHBACK', 'DEPOSIT INTEREST', 'GIFT'],
  'Transport': ['PUBLIC TRANSPORT', 'TAXI', 'UBER', 'LYFT', 'CHEVRON', 'SHELL', 'GAS STATION', 'SUBWAY', 'PARKING', 'TRANSIT', 'AUTO', 'FUEL'],
  'Groceries': ['WHOLEFDS', 'WHOLE FOODS', 'GROCERY', 'TRADER JOE', 'TARGET', 'SAFEWAY', 'ALDI', 'COSTCO', 'SUPERMARKET', 'MARKET', 'MART'],
  'Subscriptions': ['NETFLIX', 'SPOTIFY', 'HULU', 'DISNEY', 'APPLE.COM', 'PRIME', 'HBOMAX', 'YOUTUBE', 'PATREON', 'NYTIMES'],
  'Dining Out': ['STARBUCKS', 'CHIPOTLE', 'RESTAURANT', 'DINER', 'COFFEE', 'CAFE', 'BURGER', 'PIZZA', 'BAKERY', 'BAR', 'DOORDASH', 'UBER EATS'],
  'Utilities': ['UTILITIES', 'PACIFIC GAS', 'ELECTRIC', 'WATER', 'POWER', 'COMCAST', 'AT&T', 'VERIZON', 'INTERNET', 'WASTE', 'BILL'],
  'Shopping': ['AMAZON', 'NIKE', 'APPLE STORE', 'ELECTRONICS', 'ZARA', 'CLOTHING', 'EBAY', 'WALMART', 'DEPARTMENT', 'STORE'],
  'Fitness': ['GYM', 'FITNESS', 'PELETON', 'CROSSFIT', 'YOGA', 'SPORT']
};

const DEFAULT_CATEGORIES = [
  'Groceries', 'Transport', 'Subscriptions', 'Dining Out',
  'Utilities', 'Shopping', 'Fitness', 'Health', 'Leisure', 'Food', 'Public transport',
  'Cafe', 'Taxi', 'Gifts', 'Clothes', 'Job', 'Second work', 'Debt return / Borrowed money',
  'Gift', 'Cashback', 'Deposit interest', 'Income', 'Uncategorized'
];

const DEFAULT_BUDGETS = {
  'Groceries': 500,
  'Dining Out': 250,
  'Transport': 150,
  'Subscriptions': 60,
  'Shopping': 200,
  'Utilities': 200,
  'Fitness': 80
};

// Application State
const State = {
  transactions: [],
  filteredTransactions: [],
  categoryBudgets: { ...DEFAULT_BUDGETS },
  theme: 'dark',
  filters: {
    search: '',
    datePreset: 'all',
    startDate: '',
    endDate: '',
    category: 'all',
    type: 'all'
  },
  sort: {
    column: 'date',
    direction: 'desc'
  },
  pagination: {
    currentPage: 1,
    pageSize: 30
  },
  charts: {
    trend: null,
    doughnut: null,
    incomeVsExpense: null,
    stackedCategory: null
  }
};

/* ==========================================================================
   2. INITIALIZATION & DOM CONTENT LOADED
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  loadStoredData();
  setupEventListeners();
  setupDragAndDrop();
  disableInspectElement();
  refreshDashboard();

  // Hide preloader smoothly after initialization
  setTimeout(() => {
    const loader = document.getElementById('app-preloader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.4s ease';
      setTimeout(() => loader.remove(), 400);
    }
  }, 350);
});

function disableInspectElement() {
  // Prevent Right-Click Context Menu silently
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Prevent DevTools Keyboard Shortcuts silently (F12, Ctrl+Shift+I/J/C, Ctrl+U)
  document.addEventListener('keydown', (e) => {
    const isF12 = e.key === 'F12' || e.keyCode === 123;
    const isInspectCombo = e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key);
    const isViewSourceCombo = e.ctrlKey && (e.key === 'U' || e.key === 'u');

    if (isF12 || isInspectCombo || isViewSourceCombo) {
      e.preventDefault();
      return false;
    }
  });
}

function initIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

/* ==========================================================================
   3. STORAGE & PERSISTENCE
   ========================================================================== */

function loadStoredData() {
  // Load Theme
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  setTheme(savedTheme);

  // Load Budgets
  const savedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
  if (savedBudgets) {
    try {
      State.categoryBudgets = JSON.parse(savedBudgets);
    } catch (e) {
      console.error('Error parsing stored budgets', e);
    }
  }

  // Load Transactions
  const savedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  if (savedTx) {
    try {
      const parsed = JSON.parse(savedTx);
      State.transactions = parsed.map(tx => ({
        ...tx,
        dateObj: new Date(tx.date)
      }));
    } catch (e) {
      console.error('Error parsing stored transactions', e);
    }
  }
}

function saveTransactions() {
  const serializable = State.transactions.map(({ dateObj, ...rest }) => rest);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(serializable));
}

function saveBudgets() {
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(State.categoryBudgets));
}

/* ==========================================================================
   4. DATA CLEANING & AUTO-CATEGORIZATION ENGINE
   ========================================================================== */

function autoCategorize(description, rawCategory = '') {
  if (rawCategory && DEFAULT_CATEGORIES.includes(rawCategory)) {
    return rawCategory;
  }

  const descUpper = (description || '').toUpperCase();

  for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some(kw => descUpper.includes(kw))) {
      return category;
    }
  }

  return 'Uncategorized';
}

function parseFlexibleDate(dateRaw) {
  if (!dateRaw) return new Date();

  if (dateRaw instanceof Date) return dateRaw;

  let str = dateRaw.toString().trim();

  // Try standard ISO / JS Date
  let d = new Date(str);
  if (!isNaN(d.getTime())) return d;

  // Try DD/MM/YYYY or MM/DD/YYYY
  const parts = str.split(/[/.-]/);
  if (parts.length === 3) {
    let p1 = parseInt(parts[0], 10);
    let p2 = parseInt(parts[1], 10);
    let p3 = parseInt(parts[2], 10);

    // If 4-digit year is last
    if (p3 > 1000) {
      // Check if p1 > 12 -> DD/MM/YYYY
      if (p1 > 12) {
        d = new Date(p3, p2 - 1, p1);
      } else {
        d = new Date(p3, p1 - 1, p2);
      }
      if (!isNaN(d.getTime())) return d;
    }
    // If 4-digit year is first (YYYY/MM/DD)
    if (p1 > 1000) {
      d = new Date(p1, p2 - 1, p3);
      if (!isNaN(d.getTime())) return d;
    }
  }

  return new Date(); // fallback to today if unparseable
}

function determineTransactionType({ amountRaw, descRaw, typeColRaw, creditRaw, debitRaw, typeRule = 'auto', category = '' }) {
  const descUpper = (descRaw || '').toUpperCase();

  // 1. FIRST PRIORITY: Explicit Income Keywords & Income Category
  const incomeKeywords = [
    'SALARY', 'PAYROLL', 'BONUS', 'FREELANCE', 'DIVIDEND', 'INTEREST',
    'STIPEND', 'DEPOSIT', 'JOB', 'INCOME', 'REFUND', 'ACH CREDIT',
    'REIMBURSEMENT', 'TRANSFER IN', 'PAYMENT RECEIVED', 'PAYMENT FROM',
    'CREDIT MEMO', 'EARNINGS', 'WAGES', 'CREDIT'
  ];
  if (category === 'Income' || incomeKeywords.some(kw => descUpper.includes(kw))) {
    return 'income';
  }

  // 2. Explicit Type or CR/DR Column
  if (typeColRaw) {
    const tUpper = typeColRaw.toString().toUpperCase().trim();
    if (['CR', 'CREDIT', 'INCOME', 'DEPOSIT', 'REFUND', 'INTEREST'].some(k => tUpper.includes(k))) {
      return 'income';
    }
    if (['DR', 'DEBIT', 'EXPENSE', 'PURCHASE', 'PAYMENT', 'WITHDRAWAL', 'FEE', 'OUTFLOW'].some(k => tUpper.includes(k))) {
      return 'expense';
    }
  }

  // 3. Explicit Credit / Debit columns mapping
  if (creditRaw !== undefined && creditRaw !== '' && creditRaw !== null) {
    const cVal = parseFloat(creditRaw.toString().replace(/[^0-9.-]/g, ''));
    if (!isNaN(cVal) && cVal > 0) return 'income';
  }
  if (debitRaw !== undefined && debitRaw !== '' && debitRaw !== null) {
    const dVal = parseFloat(debitRaw.toString().replace(/[^0-9.-]/g, ''));
    if (!isNaN(dVal) && dVal > 0) return 'expense';
  }

  // 4. Raw Amount Sign (Negative or Parentheses = Expense)
  const amtStr = (amountRaw || '').toString().trim();
  if (amtStr.startsWith('-') || (amtStr.startsWith('(') && amtStr.endsWith(')'))) {
    return 'expense';
  }

  // 5. Explicit User Override Rules
  if (typeRule === 'positive_expense') {
    return 'expense';
  }
  if (typeRule === 'negative_expense') {
    return 'income';
  }

  // 6. Known Expense Keyword Safety Match
  const expenseKeywords = [
    'WHOLEFDS', 'GROCERY', 'NETFLIX', 'SPOTIFY', 'UBER', 'LYFT', 'CHEVRON',
    'SHELL', 'STARBUCKS', 'CHIPOTLE', 'AMAZON', 'TARGET', 'STORE', 'CAFE',
    'REST', 'BILL', 'UTILITY', 'ATM', 'PURCHASE', 'GAS', 'MARKET', 'SHOP'
  ];
  if (expenseKeywords.some(kw => descUpper.includes(kw))) {
    return 'expense';
  }

  // Default Fallback
  const numVal = parseFloat(amtStr.replace(/[^0-9.-]/g, ''));
  return (!isNaN(numVal) && numVal < 0) ? 'expense' : 'income';
}

function autoDetectCSVColumns(headers) {
  const normHeaders = headers.map(h => ({ original: h, lower: h.toLowerCase().trim() }));

  const dateKeywords = ['date', 'dt', 'time', 'posted', 'created', 'trans_date'];
  const descKeywords = ['description', 'desc', 'payee', 'merchant', 'memo', 'details', 'narrative', 'name', 'text', 'transaction'];
  const amountKeywords = ['amount', 'amt', 'value', 'total', 'sum', 'price'];
  const debitKeywords = ['debit', 'outflow', 'withdrawal'];
  const creditKeywords = ['credit', 'inflow', 'deposit'];
  const catKeywords = ['category', 'cat', 'class'];
  const typeKeywords = ['type', 'cr/dr', 'cr_dr', 'trans_type', 'transaction_type', 'code'];

  const findBestKey = (keywords) => {
    for (const kw of keywords) {
      const match = normHeaders.find(h => h.lower === kw || h.lower.includes(kw));
      if (match) return match.original;
    }
    return '';
  };

  const dateKey = findBestKey(dateKeywords) || headers[0] || '';
  const descKey = findBestKey(descKeywords) || (headers.length > 1 ? headers[1] : '');
  const amountKey = findBestKey(amountKeywords) || findBestKey(debitKeywords) || (headers.length > 2 ? headers[2] : '');
  const creditKey = findBestKey(creditKeywords);
  const categoryKey = findBestKey(catKeywords);
  const typeKey = findBestKey(typeKeywords);

  return { dateKey, descKey, amountKey, creditKey, categoryKey, typeKey };
}

function cleanTransactionRow(row, mapping = null) {
  let dateRaw = '';
  let descRaw = '';
  let amountRaw = '';
  let creditRaw = '';
  let categoryRaw = '';
  let typeColRaw = '';
  let typeRule = 'auto';

  if (mapping) {
    dateRaw = row[mapping.dateKey] || '';
    descRaw = row[mapping.descKey] || '';
    amountRaw = row[mapping.amountKey] || '';
    creditRaw = mapping.creditKey ? row[mapping.creditKey] : '';
    categoryRaw = mapping.categoryKey ? row[mapping.categoryKey] : '';
    typeColRaw = mapping.typeKey ? row[mapping.typeKey] : '';
    typeRule = mapping.typeRule || 'auto';
  } else {
    // Fallback key search
    dateRaw = row.date || row.Date || row.DATE || row.date_time || row.Date_Time || row['Transaction Date'] || row['Posting Date'] || '';
    descRaw = row.description || row.Description || row.DESCRIPTION || row.Payee || row.Merchant || row.Details || row.account || row.tags || '';
    amountRaw = row.amount || row.Amount || row.AMOUNT || row.Value || row.Total || '';
    categoryRaw = row.category || row.Category || row.CATEGORY || '';
    typeColRaw = row.type || row.Type || row.TYPE || row['CR/DR'] || '';

    if (!amountRaw) {
      const debit = parseFloat((row.Debit || row.debit || '').toString().replace(/[^0-9.-]/g, ''));
      const credit = parseFloat((row.Credit || row.credit || '').toString().replace(/[^0-9.-]/g, ''));
      if (!isNaN(credit) && credit > 0) amountRaw = credit;
      else if (!isNaN(debit) && debit > 0) amountRaw = -debit;
    }
  }

  // Format clean Description if empty or matching column name
  let descFormatted = (descRaw || '').trim();
  if (!descFormatted || descFormatted.startsWith('acct_') || descFormatted.startsWith('tag_')) {
    if (categoryRaw && row.account) {
      descFormatted = `${categoryRaw} (${row.account})`;
    } else if (categoryRaw) {
      descFormatted = categoryRaw;
    } else if (row.account) {
      descFormatted = `Account ${row.account}`;
    } else {
      descFormatted = 'Bank Transaction';
    }
  }

  // Auto Categorization
  let category = autoCategorize(descFormatted, categoryRaw);

  // Determine Type (Income vs Expense) via Smart Classifier
  let type = determineTransactionType({
    amountRaw,
    descRaw: descFormatted,
    typeColRaw,
    creditRaw,
    debitRaw: amountRaw,
    typeRule,
    category
  });

  // Keep Category & Type in perfect sync
  if (type === 'income' && (category === 'Uncategorized' || !category)) {
    category = 'Income';
  } else if (category === 'Income') {
    type = 'income';
  }

  // Extract Clean Numeric Amount
  let amount = 0;
  if (typeof amountRaw === 'number') {
    amount = Math.abs(amountRaw);
  } else if (typeof amountRaw === 'string') {
    let cleanStr = amountRaw.trim();
    if (cleanStr.startsWith('(') && cleanStr.endsWith(')')) {
      cleanStr = cleanStr.substring(1, cleanStr.length - 1);
    }
    cleanStr = cleanStr.replace(/[^0-9.-]/g, '');
    amount = Math.abs(parseFloat(cleanStr) || 0);
  }

  // Parse Date
  const dateObj = parseFlexibleDate(dateRaw);
  const formattedDate = dateObj.toISOString().split('T')[0];

  return {
    id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    date: formattedDate,
    dateObj: dateObj,
    description: descFormatted,
    amount: amount,
    type: type,
    category: category
  };
}

function deduplicateTransactions(newTransactions) {
  const existingKeys = new Set(
    State.transactions.map(t => `${t.date}_${t.description.toLowerCase()}_${t.amount}_${t.type}`)
  );

  const unique = [];
  let duplicatesCount = 0;

  newTransactions.forEach(tx => {
    const key = `${tx.date}_${tx.description.toLowerCase()}_${tx.amount}_${tx.type}`;
    if (!existingKeys.has(key)) {
      existingKeys.add(key);
      unique.push(tx);
    } else {
      duplicatesCount++;
    }
  });

  return { unique, duplicatesCount };
}

/* ==========================================================================
   5. CSV PARSING & MAPPING ENGINE
   ========================================================================== */

let pendingCSVData = null;

function handleCSVParse(file) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      if (!results.data || results.data.length === 0) {
        showToast('Failed to parse CSV file or file is empty.', 'error');
        return;
      }

      const headers = results.meta.fields || Object.keys(results.data[0] || {});
      if (headers.length === 0) {
        showToast('No columns found in CSV file.', 'error');
        return;
      }

      pendingCSVData = {
        fileName: file.name,
        rows: results.data,
        headers: headers
      };

      // Show Mapping Modal
      openCSVMappingModal(headers, results.data.slice(0, 3));
    },
    error: function (err) {
      showToast('CSV Parsing Error: ' + err.message, 'error');
    }
  });
}

function openCSVMappingModal(headers, previewRows) {
  const modal = document.getElementById('modal-csv-mapping');
  const thead = document.getElementById('csv-preview-thead');
  const tbody = document.getElementById('csv-preview-tbody');

  // Build Preview Table Header
  thead.innerHTML = `<tr>${headers.map(h => `<th>${escapeHTML(h)}</th>`).join('')}</tr>`;

  // Build Preview Table Body
  tbody.innerHTML = previewRows.map(row =>
    `<tr>${headers.map(h => `<td>${escapeHTML(row[h] || '')}</td>`).join('')}</tr>`
  ).join('');

  // Auto-detect columns
  const detected = autoDetectCSVColumns(headers);

  // Populate Dropdowns
  const buildOptions = (selectedKey, includeEmpty = false, emptyLabel = 'None') => {
    let opts = includeEmpty ? `<option value="">${emptyLabel}</option>` : '';
    headers.forEach(h => {
      const isSel = h === selectedKey ? 'selected' : '';
      opts += `<option value="${escapeHTML(h)}" ${isSel}>${escapeHTML(h)}</option>`;
    });
    return opts;
  };

  document.getElementById('map-col-date').innerHTML = buildOptions(detected.dateKey);
  document.getElementById('map-col-desc').innerHTML = buildOptions(detected.descKey);
  document.getElementById('map-col-amount').innerHTML = buildOptions(detected.amountKey);
  document.getElementById('map-col-credit').innerHTML = buildOptions(detected.creditKey, true, 'None (Single Amount column)');
  document.getElementById('map-col-category').innerHTML = buildOptions(detected.categoryKey, true, 'Auto-categorize with Smart Rules');
  document.getElementById('map-col-type').innerHTML = buildOptions(detected.typeKey, true, 'None (Auto-detect from Sign & Keywords)');

  modal.classList.remove('hidden');
}

/* ==========================================================================
   6. FILTERING & SORTING ENGINE
   ========================================================================== */

function applyFilters() {
  const { search, datePreset, startDate, endDate, category, type } = State.filters;
  const now = new Date();

  State.filteredTransactions = State.transactions.filter(tx => {
    // 1. Search Query Filter
    if (search) {
      const q = search.toLowerCase();
      const matchDesc = tx.description.toLowerCase().includes(q);
      const matchCat = tx.category.toLowerCase().includes(q);
      if (!matchDesc && !matchCat) return false;
    }

    // 2. Type Filter
    if (type !== 'all' && tx.type !== type) return false;

    // 3. Category Filter
    if (category !== 'all' && tx.category !== category) return false;

    // 4. Date Filter Presets
    const txDate = tx.dateObj;
    if (datePreset === 'this-month') {
      if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return false;
    } else if (datePreset === 'last-month') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      if (txDate.getMonth() !== lastMonth.getMonth() || txDate.getFullYear() !== lastMonth.getFullYear()) return false;
    } else if (datePreset === 'last-30') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      if (txDate < thirtyDaysAgo) return false;
    } else if (datePreset === 'ytd') {
      if (txDate.getFullYear() !== now.getFullYear()) return false;
    } else if (datePreset === 'custom') {
      if (startDate && txDate < new Date(startDate)) return false;
      if (endDate && txDate > new Date(endDate + 'T23:59:59')) return false;
    }

    return true;
  });

  // Apply Sorting
  const { column, direction } = State.sort;
  const mult = direction === 'asc' ? 1 : -1;

  State.filteredTransactions.sort((a, b) => {
    if (column === 'date') return (a.dateObj - b.dateObj) * mult;
    if (column === 'amount') return (a.amount - b.amount) * mult;
    if (column === 'description') return a.description.localeCompare(b.description) * mult;
    if (column === 'category') return a.category.localeCompare(b.category) * mult;
    if (column === 'type') return a.type.localeCompare(b.type) * mult;
    return 0;
  });
}

/* ==========================================================================
   7. DASHBOARD METRICS CALCULATION
   ========================================================================== */

function calculateMetrics() {
  let totalIncome = 0;
  let totalExpenses = 0;
  let incomeTxCount = 0;
  let expenseTxCount = 0;

  State.filteredTransactions.forEach(tx => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
      incomeTxCount++;
    } else {
      totalExpenses += tx.amount;
      expenseTxCount++;
    }
  });

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Render to Summary Cards
  document.getElementById('val-income').textContent = formatCurrency(totalIncome);
  document.getElementById('val-expenses').textContent = formatCurrency(totalExpenses);
  document.getElementById('val-savings').textContent = formatCurrency(netSavings);
  document.getElementById('val-rate').textContent = (savingsRate >= 0 ? savingsRate.toFixed(1) : '0.0') + '%';

  document.getElementById('sub-income-tx').textContent = `${incomeTxCount} transactions`;
  document.getElementById('sub-expense-tx').textContent = `${expenseTxCount} transactions`;

  const fillRate = Math.max(0, Math.min(100, savingsRate));
  document.getElementById('fill-savings-rate').style.width = `${fillRate}%`;

  // Dynamic Net Savings Color
  const savingsCardVal = document.getElementById('val-savings');
  if (netSavings < 0) {
    savingsCardVal.style.color = 'var(--expense)';
  } else {
    savingsCardVal.style.color = 'var(--text-main)';
  }
}

/* ==========================================================================
   8. CHART.JS VISUALIZATIONS
   ========================================================================== */

function renderCharts() {
  const isDark = State.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1f2937' : '#e2e8f0';

  Chart.defaults.color = textColor;
  Chart.defaults.font.family = 'Plus Jakarta Sans, sans-serif';

  renderSpendingTrendChart(gridColor);
  renderCategoryDoughnutChart();
  renderIncomeVsExpenseChart(gridColor);
  renderCategoryStackedChart(gridColor);
}

function renderSpendingTrendChart(gridColor) {
  const ctx = document.getElementById('chart-spending-trend').getContext('2d');

  // Group expense transactions by month YYYY-MM
  const monthlyData = {};
  State.filteredTransactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      const monthKey = tx.date.substring(0, 7); // YYYY-MM
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + tx.amount;
    });

  const sortedMonths = Object.keys(monthlyData).sort();
  const labels = sortedMonths.map(formatMonthLabel);
  const dataValues = sortedMonths.map(m => monthlyData[m]);

  if (State.charts.trend) State.charts.trend.destroy();

  const gradient = ctx.createLinearGradient(0, 0, 0, 250);
  gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

  State.charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Monthly Expense ($)',
        data: dataValues,
        borderColor: '#6366f1',
        backgroundColor: gradient,
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#6366f1',
        pointRadius: 4,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => ` Spending: ${formatCurrency(context.raw)}`
          }
        }
      },
      scales: {
        x: { grid: { color: gridColor } },
        y: {
          grid: { color: gridColor },
          ticks: { callback: value => '$' + value }
        }
      }
    }
  });
}

function renderCategoryDoughnutChart() {
  const ctx = document.getElementById('chart-category-doughnut').getContext('2d');

  const categoryTotals = {};
  State.filteredTransactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    });

  const categories = Object.keys(categoryTotals);
  const dataValues = categories.map(c => categoryTotals[c]);

  const palette = [
    '#6366f1', '#10b981', '#f43f5e', '#3b82f6',
    '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'
  ];

  if (State.charts.doughnut) State.charts.doughnut.destroy();

  State.charts.doughnut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{
        data: dataValues,
        backgroundColor: palette.slice(0, categories.length),
        borderWidth: 2,
        borderColor: State.theme === 'dark' ? '#111827' : '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 12, font: { size: 11 } }
        },
        tooltip: {
          callbacks: {
            label: context => ` ${context.label}: ${formatCurrency(context.raw)}`
          }
        }
      },
      cutout: '70%'
    }
  });
}

function renderIncomeVsExpenseChart(gridColor) {
  const ctx = document.getElementById('chart-income-vs-expense').getContext('2d');

  const monthsMap = {};
  State.filteredTransactions.forEach(tx => {
    const monthKey = tx.date.substring(0, 7);
    if (!monthsMap[monthKey]) monthsMap[monthKey] = { income: 0, expense: 0 };
    if (tx.type === 'income') monthsMap[monthKey].income += tx.amount;
    else monthsMap[monthKey].expense += tx.amount;
  });

  const sortedMonths = Object.keys(monthsMap).sort();
  const labels = sortedMonths.map(formatMonthLabel);
  const incomeData = sortedMonths.map(m => monthsMap[m].income);
  const expenseData = sortedMonths.map(m => monthsMap[m].expense);

  if (State.charts.incomeVsExpense) State.charts.incomeVsExpense.destroy();

  State.charts.incomeVsExpense = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: '#10b981',
          borderRadius: 6
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: '#f43f5e',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: context => ` ${context.dataset.label}: ${formatCurrency(context.raw)}`
          }
        }
      },
      scales: {
        x: { grid: { color: gridColor } },
        y: {
          grid: { color: gridColor },
          ticks: { callback: val => '$' + val }
        }
      }
    }
  });
}

function renderCategoryStackedChart(gridColor) {
  const ctx = document.getElementById('chart-category-stacked').getContext('2d');

  const monthsSet = new Set();
  const categoryMonthMap = {};

  State.filteredTransactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      const mKey = tx.date.substring(0, 7);
      monthsSet.add(mKey);
      if (!categoryMonthMap[tx.category]) categoryMonthMap[tx.category] = {};
      categoryMonthMap[tx.category][mKey] = (categoryMonthMap[tx.category][mKey] || 0) + tx.amount;
    });

  const sortedMonths = Array.from(monthsSet).sort();
  const labels = sortedMonths.map(formatMonthLabel);
  const categories = Object.keys(categoryMonthMap);

  const palette = [
    '#6366f1', '#10b981', '#f43f5e', '#3b82f6',
    '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'
  ];

  const datasets = categories.map((cat, i) => ({
    label: cat,
    data: sortedMonths.map(m => categoryMonthMap[cat][m] || 0),
    backgroundColor: palette[i % palette.length],
    borderRadius: 4
  }));

  if (State.charts.stackedCategory) State.charts.stackedCategory.destroy();

  State.charts.stackedCategory = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true, grid: { color: gridColor } },
        y: { stacked: true, grid: { color: gridColor }, ticks: { callback: val => '$' + val } }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: context => ` ${context.dataset.label}: ${formatCurrency(context.raw)}`
          }
        }
      }
    }
  });
}

/* ==========================================================================
   9. CATEGORY BUDGETING ENGINE
   ========================================================================== */

function renderBudgets() {
  const container = document.getElementById('budget-progress-list');
  container.innerHTML = '';

  // Calculate actual spending per category in current filtered set (or current month)
  const categorySpent = {};
  State.filteredTransactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      categorySpent[tx.category] = (categorySpent[tx.category] || 0) + tx.amount;
    });

  const expenseCategories = Object.keys(State.categoryBudgets);

  if (expenseCategories.length === 0) {
    container.innerHTML = '<p class="text-muted" style="font-size:0.85rem">No budget limits configured.</p>';
    return;
  }

  expenseCategories.forEach(cat => {
    const budget = State.categoryBudgets[cat] || 0;
    const spent = categorySpent[cat] || 0;
    const percent = budget > 0 ? (spent / budget) * 100 : 0;

    let barStatusClass = 'normal';
    if (percent >= 100) barStatusClass = 'exceeded';
    else if (percent >= 80) barStatusClass = 'warning';

    const itemEl = document.createElement('div');
    itemEl.className = 'budget-item';
    itemEl.innerHTML = `
      <div class="budget-item-header">
        <span>${cat}</span>
        <span>${formatCurrency(spent)} / ${formatCurrency(budget)} (${percent.toFixed(0)}%)</span>
      </div>
      <div class="budget-bar-track">
        <div class="budget-bar-fill ${barStatusClass}" style="width: ${Math.min(100, percent)}%"></div>
      </div>
    `;
    container.appendChild(itemEl);
  });
}

/* ==========================================================================
   10. FINANCIAL INSIGHTS ENGINE (RULE-BASED)
   ========================================================================== */

function renderInsights() {
  const container = document.getElementById('insights-container');
  container.innerHTML = '';
  const insights = [];

  const expenses = State.transactions.filter(t => t.type === 'expense');

  // Rule 1: Subscription Detection (Same desc + similar amount across >=2 months)
  const descGroup = {};
  expenses.forEach(t => {
    const key = t.description.toLowerCase();
    if (!descGroup[key]) descGroup[key] = [];
    descGroup[key].push(t);
  });

  const detectedSubscriptions = [];
  Object.keys(descGroup).forEach(desc => {
    const txs = descGroup[desc];
    if (txs.length >= 2) {
      const months = new Set(txs.map(t => t.date.substring(0, 7)));
      if (months.size >= 2) {
        const avgAmt = txs.reduce((sum, t) => sum + t.amount, 0) / txs.length;
        detectedSubscriptions.push({ desc: txs[0].description, avgAmt });
      }
    }
  });

  if (detectedSubscriptions.length > 0) {
    const listStr = detectedSubscriptions.slice(0, 3).map(s => `<strong>${s.desc}</strong> (${formatCurrency(s.avgAmt)}/mo)`).join(', ');
    insights.push({
      type: 'info',
      icon: 'repeat',
      title: 'Recurring Subscriptions Detected',
      message: `Identified ${detectedSubscriptions.length} recurring monthly bills: ${listStr}.`
    });
  }

  // Rule 2: Month-End Spend Projection
  const now = new Date();
  const currentMonthKey = now.toISOString().substring(0, 7);
  const currentMonthExpenses = expenses.filter(t => t.date.substring(0, 7) === currentMonthKey);
  const spentSoFar = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysPassed = Math.max(1, now.getDate());

  if (spentSoFar > 0) {
    const projectedTotal = (spentSoFar / daysPassed) * daysInMonth;
    insights.push({
      type: 'success',
      icon: 'trending-up',
      title: 'Current Month Forecast',
      message: `Spent ${formatCurrency(spentSoFar)} across ${daysPassed} days. Projected total for ${formatMonthLabel(currentMonthKey)}: <strong>${formatCurrency(projectedTotal)}</strong>.`
    });
  }

  // Rule 3: Category Spike Alert (>50% above 3-month average)
  const categoryMonthly = {};
  expenses.forEach(t => {
    const mKey = t.date.substring(0, 7);
    if (!categoryMonthly[t.category]) categoryMonthly[t.category] = {};
    categoryMonthly[t.category][mKey] = (categoryMonthly[t.category][mKey] || 0) + t.amount;
  });

  Object.keys(categoryMonthly).forEach(cat => {
    const months = Object.keys(categoryMonthly[cat]).sort();
    if (months.length >= 2) {
      const latestMonth = months[months.length - 1];
      const latestSpend = categoryMonthly[cat][latestMonth];
      const prevMonths = months.slice(0, months.length - 1);
      const prevAvg = prevMonths.reduce((sum, m) => sum + categoryMonthly[cat][m], 0) / prevMonths.length;

      if (prevAvg > 50 && latestSpend > prevAvg * 1.5) {
        const surgePercent = (((latestSpend - prevAvg) / prevAvg) * 100).toFixed(0);
        insights.push({
          type: 'warning',
          icon: 'alert-triangle',
          title: `Category Spend Surge: ${cat}`,
          message: `${cat} spend in ${formatMonthLabel(latestMonth)} is ${surgePercent}% higher than historical average.`
        });
      }
    }
  });

  if (insights.length === 0) {
    container.innerHTML = '<p class="text-muted" style="font-size:0.85rem">No abnormal spending patterns detected.</p>';
    return;
  }

  insights.forEach(item => {
    const card = document.createElement('div');
    card.className = `insight-card ${item.type}`;
    card.innerHTML = `
      <i data-lucide="${item.icon}" class="insight-icon"></i>
      <div class="insight-text">
        <strong>${item.title}</strong>
        ${item.message}
      </div>
    `;
    container.appendChild(card);
  });

  initIcons();
}

/* ==========================================================================
   11. TRANSACTION TABLE & PAGINATION
   ========================================================================== */

function renderTable() {
  const tbody = document.getElementById('tx-table-body');
  const emptyState = document.getElementById('empty-state');
  const countBadge = document.getElementById('tx-count-badge');

  tbody.innerHTML = '';
  const totalCount = State.filteredTransactions.length;
  countBadge.textContent = `${totalCount} items`;

  if (totalCount === 0) {
    emptyState.classList.remove('hidden');
    updatePaginationControls(0, 0, 0);
    return;
  } else {
    emptyState.classList.add('hidden');
  }

  const { currentPage, pageSize } = State.pagination;
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalCount);

  const pageData = State.filteredTransactions.slice(startIdx, endIdx);

  pageData.forEach(tx => {
    const tr = document.createElement('tr');
    tr.dataset.id = tx.id;

    const isIncome = tx.type === 'income';
    const amountClass = isIncome ? 'income' : 'expense';
    const amountPrefix = isIncome ? '+' : '-';

    // Build Category Select Options
    const categoryOptions = DEFAULT_CATEGORIES.map(c =>
      `<option value="${c}" ${c === tx.category ? 'selected' : ''}>${c}</option>`
    ).join('');

    tr.innerHTML = `
      <td>${tx.date}</td>
      <td><strong>${escapeHTML(tx.description)}</strong></td>
      <td>
        <select class="category-select-pill" onchange="updateTxCategory('${tx.id}', this.value)">
          ${categoryOptions}
        </select>
      </td>
      <td class="text-center">
        <span class="badge-type ${tx.type}" onclick="toggleTxType('${tx.id}')" title="Click to flip between Income and Expense" style="cursor:pointer">${tx.type}</span>
      </td>
      <td class="text-right amount-display ${amountClass}">
        ${amountPrefix}${formatCurrency(tx.amount)}
      </td>
      <td class="text-center">
        <button class="btn btn-ghost btn-sm" onclick="deleteTransaction('${tx.id}')" title="Delete transaction">
          <i data-lucide="trash" style="width:14px;height:14px;color:var(--expense)"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updatePaginationControls(startIdx + 1, endIdx, totalCount);
  initIcons();
}

window.toggleTxType = function (txId) {
  const tx = State.transactions.find(t => t.id === txId);
  if (tx) {
    tx.type = tx.type === 'income' ? 'expense' : 'income';
    if (tx.type === 'income') {
      tx.category = 'Income';
    } else if (tx.category === 'Income') {
      tx.category = 'Uncategorized';
    }
    saveTransactions();
    refreshDashboard();
    showToast(`Transaction type set to ${tx.type.toUpperCase()}`, 'success');
  }
};

function updatePaginationControls(start, end, total) {
  document.getElementById('pag-start').textContent = start;
  document.getElementById('pag-end').textContent = end;
  document.getElementById('pag-total').textContent = total;

  const maxPage = Math.ceil(total / State.pagination.pageSize) || 1;
  document.getElementById('pag-current-page').textContent = `Page ${State.pagination.currentPage} of ${maxPage}`;

  document.getElementById('pag-prev').disabled = State.pagination.currentPage <= 1;
  document.getElementById('pag-next').disabled = State.pagination.currentPage >= maxPage;
}

window.updateTxCategory = function (txId, newCategory) {
  const tx = State.transactions.find(t => t.id === txId);
  if (tx) {
    tx.category = newCategory;
    if (newCategory === 'Income') {
      tx.type = 'income';
    } else if (tx.type === 'income') {
      tx.type = 'expense';
    }
    saveTransactions();
    refreshDashboard();
    showToast(`Category updated to "${newCategory}"`, 'success');
  }
};

window.deleteTransaction = function (txId) {
  State.transactions = State.transactions.filter(t => t.id !== txId);
  saveTransactions();
  refreshDashboard();
  showToast('Transaction deleted', 'success');
};

/* ==========================================================================
   12. REFRESH DASHBOARD CONTROLLER
   ========================================================================== */

function refreshDashboard() {
  updateCategoryDropdownFilter();
  applyFilters();
  calculateMetrics();
  renderCharts();
  renderBudgets();
  renderInsights();
  renderTable();
}

function updateCategoryDropdownFilter() {
  const select = document.getElementById('filter-category');
  const currentVal = select.value;

  select.innerHTML = '<option value="all">All Categories</option>';

  DEFAULT_CATEGORIES.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });

  select.value = currentVal;
}

/* ==========================================================================
   13. EVENT LISTENERS & INTERACTIVITY
   ========================================================================== */

function setupEventListeners() {
  // Theme Toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const nextTheme = State.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });

  // CSV File Inputs (Header, Hero & Empty State)
  ['csv-file-input', 'csv-file-input-hero', 'csv-file-input-empty'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          handleCSVParse(e.target.files[0]);
          e.target.value = '';
        }
      });
    }
  });

  // Filter Event Listeners
  const searchInput = document.getElementById('filter-search');
  const clearSearchBtn = document.getElementById('btn-clear-search');

  searchInput.addEventListener('input', (e) => {
    State.filters.search = e.target.value.trim();
    clearSearchBtn.classList.toggle('hidden', !State.filters.search);
    State.pagination.currentPage = 1;
    refreshDashboard();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    State.filters.search = '';
    clearSearchBtn.classList.add('hidden');
    State.pagination.currentPage = 1;
    refreshDashboard();
  });

  document.getElementById('filter-date-preset').addEventListener('change', (e) => {
    State.filters.datePreset = e.target.value;
    const customGroup = document.getElementById('custom-date-group');
    customGroup.classList.toggle('hidden', e.target.value !== 'custom');
    State.pagination.currentPage = 1;
    refreshDashboard();
  });

  document.getElementById('filter-start-date').addEventListener('change', (e) => {
    State.filters.startDate = e.target.value;
    refreshDashboard();
  });

  document.getElementById('filter-end-date').addEventListener('change', (e) => {
    State.filters.endDate = e.target.value;
    refreshDashboard();
  });

  document.getElementById('filter-category').addEventListener('change', (e) => {
    State.filters.category = e.target.value;
    State.pagination.currentPage = 1;
    refreshDashboard();
  });

  document.getElementById('filter-type').addEventListener('change', (e) => {
    State.filters.type = e.target.value;
    State.pagination.currentPage = 1;
    refreshDashboard();
  });

  document.getElementById('btn-reset-filters').addEventListener('click', () => {
    State.filters = { search: '', datePreset: 'all', startDate: '', endDate: '', category: 'all', type: 'all' };
    document.getElementById('filter-search').value = '';
    document.getElementById('filter-date-preset').value = 'all';
    document.getElementById('filter-category').value = 'all';
    document.getElementById('filter-type').value = 'all';
    document.getElementById('custom-date-group').classList.add('hidden');
    clearSearchBtn.classList.add('hidden');
    State.pagination.currentPage = 1;
    refreshDashboard();
    showToast('Filters reset', 'info');
  });

  // Export CSV
  document.getElementById('btn-export-csv').addEventListener('click', exportFilteredCSV);

  // Clear All Data
  document.getElementById('btn-clear-all').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all transactions?')) {
      State.transactions = [];
      saveTransactions();
      refreshDashboard();
      showToast('All transactions cleared', 'info');
    }
  });

  // Table Sorting Header Clicks
  document.querySelectorAll('.data-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.sort;
      if (State.sort.column === col) {
        State.sort.direction = State.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        State.sort.column = col;
        State.sort.direction = 'desc';
      }
      // Update UI classes
      document.querySelectorAll('.data-table th').forEach(t => t.classList.remove('sorted-asc', 'sorted-desc'));
      th.classList.add(State.sort.direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
      refreshDashboard();
    });
  });

  // Pagination controls
  document.getElementById('pag-prev').addEventListener('click', () => {
    if (State.pagination.currentPage > 1) {
      State.pagination.currentPage--;
      renderTable();
    }
  });

  document.getElementById('pag-next').addEventListener('click', () => {
    const maxPage = Math.ceil(State.filteredTransactions.length / State.pagination.pageSize);
    if (State.pagination.currentPage < maxPage) {
      State.pagination.currentPage++;
      renderTable();
    }
  });

  document.getElementById('pag-size').addEventListener('change', (e) => {
    State.pagination.pageSize = parseInt(e.target.value, 10);
    State.pagination.currentPage = 1;
    renderTable();
  });

  // Modals Setup
  setupModalTx();
  setupModalBudgets();
  setupModalCSVMapping();
}

/* Drag & Drop CSV */
function setupDragAndDrop() {
  const dropZone = document.getElementById('drop-zone');

  window.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('active');
  });

  window.addEventListener('dragleave', (e) => {
    if (e.clientX === 0 && e.clientY === 0) {
      dropZone.classList.remove('active');
    }
  });

  window.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('active');
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        handleCSVParse(file);
      } else {
        showToast('Please drop a valid .csv file', 'error');
      }
    }
  });
}

/* Modals Logic */
function setupModalTx() {
  const modal = document.getElementById('modal-tx');
  const openBtn = document.getElementById('btn-add-tx');
  const closeBtn = document.getElementById('modal-tx-close');
  const cancelBtn = document.getElementById('btn-tx-cancel');
  const form = document.getElementById('form-tx');
  const catSelect = document.getElementById('tx-input-category');

  openBtn.addEventListener('click', () => {
    // Populate category select
    catSelect.innerHTML = DEFAULT_CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');
    document.getElementById('tx-input-date').value = new Date().toISOString().split('T')[0];
    form.reset();
    modal.classList.remove('hidden');
  });

  const closeModal = () => modal.classList.add('hidden');
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('tx-input-date').value;
    const desc = document.getElementById('tx-input-desc').value;
    const amount = parseFloat(document.getElementById('tx-input-amount').value);
    const type = document.getElementById('tx-input-type').value;
    const category = document.getElementById('tx-input-category').value;

    const newTx = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      date,
      dateObj: new Date(date),
      description: desc,
      amount: Math.abs(amount),
      type,
      category
    };

    State.transactions.unshift(newTx);
    saveTransactions();
    refreshDashboard();
    closeModal();
    showToast('Transaction added successfully!', 'success');
  });
}

function setupModalCSVMapping() {
  const modal = document.getElementById('modal-csv-mapping');
  if (!modal) return;

  const closeBtn = document.getElementById('modal-csv-mapping-close') || document.getElementById('modal-csv-close');
  const cancelBtn = document.getElementById('btn-csv-mapping-cancel') || document.getElementById('btn-csv-cancel');
  const confirmBtn = document.getElementById('btn-csv-mapping-confirm') || document.getElementById('btn-csv-confirm');

  const closeModal = () => modal.classList.add('hidden');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
    if (!pendingCSVData) {
      closeModal();
      return;
    }

    const mapping = {
      dateKey: document.getElementById('map-col-date').value,
      descKey: document.getElementById('map-col-desc').value,
      amountKey: document.getElementById('map-col-amount').value,
      creditKey: document.getElementById('map-col-credit').value,
      categoryKey: document.getElementById('map-col-category').value,
      typeKey: document.getElementById('map-col-type').value,
      typeRule: document.getElementById('map-type-rule').value
    };

    if (!mapping.dateKey || !mapping.descKey || !mapping.amountKey) {
      showToast('Please map Date, Description, and Amount columns.', 'error');
      return;
    }

    const parsedRows = pendingCSVData.rows.map(row => cleanTransactionRow(row, mapping));
    const importMode = document.getElementById('import-mode-select').value;

    if (importMode === 'replace') {
      State.transactions = parsedRows;
    } else {
      const { unique } = deduplicateTransactions(parsedRows);
      State.transactions = [...State.transactions, ...unique];
    }

    saveTransactions();

    // Automatically set timeframe filter to All Time so user sees uploaded data right away
    State.filters.datePreset = 'all';
    State.filters.category = 'all';
    State.filters.type = 'all';
    State.filters.search = '';
    document.getElementById('filter-date-preset').value = 'all';
    document.getElementById('filter-category').value = 'all';
    document.getElementById('filter-type').value = 'all';
    document.getElementById('filter-search').value = '';

    refreshDashboard();
    closeModal();

    showToast(`Successfully imported ${parsedRows.length} transactions from ${pendingCSVData.fileName}!`, 'success');
    pendingCSVData = null;
  });
}

function setupModalBudgets() {
  const modal = document.getElementById('modal-budgets');
  const openBtn = document.getElementById('btn-edit-budgets');
  const closeBtn = document.getElementById('modal-budgets-close');
  const cancelBtn = document.getElementById('btn-budgets-cancel');
  const saveBtn = document.getElementById('btn-budgets-save');
  const inputsContainer = document.getElementById('budget-inputs-container');

  openBtn.addEventListener('click', () => {
    inputsContainer.innerHTML = '';
    const expenseCategories = DEFAULT_CATEGORIES.filter(c => c !== 'Income');

    expenseCategories.forEach(cat => {
      const currentVal = State.categoryBudgets[cat] || 0;
      const row = document.createElement('div');
      row.className = 'budget-input-row';
      row.innerHTML = `
        <label>${cat}</label>
        <input type="number" step="10" class="form-input budget-val-input" data-category="${cat}" value="${currentVal}" style="width: 140px">
      `;
      inputsContainer.appendChild(row);
    });

    modal.classList.remove('hidden');
  });

  const closeModal = () => modal.classList.add('hidden');
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  saveBtn.addEventListener('click', () => {
    const inputs = inputsContainer.querySelectorAll('.budget-val-input');
    inputs.forEach(inp => {
      const cat = inp.dataset.category;
      const val = parseFloat(inp.value) || 0;
      State.categoryBudgets[cat] = val;
    });

    saveBudgets();
    refreshDashboard();
    closeModal();
    showToast('Category budgets updated!', 'success');
  });
}

/* Export Filtered CSV */
function exportFilteredCSV() {
  if (State.filteredTransactions.length === 0) {
    showToast('No transactions to export', 'error');
    return;
  }

  const exportData = State.filteredTransactions.map(tx => ({
    Date: tx.date,
    Description: tx.description,
    Category: tx.category,
    Type: tx.type,
    Amount: tx.type === 'expense' ? -tx.amount : tx.amount
  }));

  const csvStr = Papa.unparse(exportData);
  const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `apex_finance_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Exported filtered transactions to CSV!', 'success');
}

/* Helper Utilities */
function setTheme(theme) {
  State.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  if (State.charts.trend) renderCharts(); // Refresh charts grid color
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${escapeHTML(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(val || 0);
}

function formatMonthLabel(mKey) {
  // mKey format: YYYY-MM
  const [year, month] = mKey.split('-');
  const date = new Date(year, parseInt(month, 10) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function escapeHTML(str) {
  return (str || '').replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
