# finsight — Personal Finance Tracker

A clean, responsive personal finance dashboard built with React, Vite, Tailwind CSS, and visx. Track your income, expenses, and spending patterns across all screen sizes with full dark mode support.

---

## Live Demo

[https://finsight-personal-finance-tracker.netlify.app](https://finsight-personal-finance-tracker.netlify.app)

---

## Screenshots

| Mobile | Desktop |
|--------|---------|
| Single column scroll layout | Full-width dashboard with 4-column cards |
| Card list transactions | Sortable table transactions |
| Stacked charts | Side-by-side charts |

---

## Features

### Core

- **Dashboard Overview** — Summary cards showing Total Balance, Income, Expenses, and Savings Rate, all computed live from transaction data
- **Charts** — Income vs Expenses bar chart and Spending Breakdown donut chart, both powered by visx SVG rendering
- **Transactions** — Searchable, filterable transaction list with inline add and edit forms — no modal needed
- **Insights** — Top spending category, net savings, monthly observation, and category breakdown bars
- **Role-based UI** — Switch between Admin (can add, edit, delete) and Viewer (read-only) using the role dropdown in the header
- **Scroll navigation** — Sticky top nav with smooth scroll to each section and an active link scroll spy
- **Export CSV** — Download all transactions as a CSV file directly from the browser

### Optional enhancements implemented

- **Dark mode** — Full dark theme toggled via the header button, persisted across sessions
- **Data persistence** — All transactions and preferences saved to localStorage via Zustand persist middleware
- **Animations** — Card hover lift effect, smooth scroll between sections, category bar fill transitions
- **Advanced filtering** — Filter by type (income/expense), category, and free-text search — all combinable simultaneously
- **Responsive design** — Fully adapted layout across mobile (375px), tablet (768px), and desktop (1024px+)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Charts | visx (shape, scale, axis, grid, group, responsive) |
| State management | Zustand with persist middleware |
| Language | JavaScript (JSX) |
| Deploy | Netlify |

---

## Project Structure

```
src/
├── store/
│   └── useStore.js           # Zustand store — all global state
├── components/
│   ├── charts/
│   │   ├── BarChart.jsx      # visx grouped bar chart
│   │   └── DonutChart.jsx    # visx donut chart
│   ├── Header.jsx            # Sticky nav with scroll spy + role + theme + export
│   ├── Overview.jsx          # Summary stat cards
│   ├── Charts.jsx            # Bar chart + donut chart panels
│   ├── Transactions.jsx      # Transaction list/table with inline forms
│   └── Insights.jsx          # Insight cards + category breakdown bars
├── App.jsx                   # Root layout, refs, scroll logic, export handler
├── main.jsx                  # React entry point
└── index.css                 # Tailwind directives
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# clone the repo
git clone https://github.com/xswex09/finsight-Personal-finance-tracker.git
cd finsight-Personal-finance-tracker

# install dependencies
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required because visx peer dependencies declare React 16–18 support but work correctly with React 19.

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Output is generated in the `dist/` folder.

### Preview production build

```bash
npm run preview
```

---

## Deployment

This project is configured for zero-config deployment on Netlify, Vercel, and Render.

The `.npmrc` file at the root sets `legacy-peer-deps=true` automatically so deployment platforms resolve the visx/React peer dependency without any manual build command changes.

```
# .npmrc
legacy-peer-deps=true
```

For Netlify — connect your GitHub repo and set:
- Build command: `npm run build`
- Publish directory: `dist`

---

## State Management Approach

All application state lives in a single Zustand store (`src/store/useStore.js`). Zustand's `persist` middleware serialises the store to `localStorage` under the key `finsight-store` on every state change, so data survives page refreshes automatically.

The store holds:

- `transactions` — array of all transaction objects
- `role` — `'admin'` or `'viewer'`
- `theme` — `'light'` or `'dark'`
- `period` — active period filter (`'1W'`, `'1M'`, `'3M'`, `'1Y'`)
- `search`, `typeFilter`, `catFilter` — active filter values
- `getPeriodTx()` — derived selector, returns transactions filtered to the active period
- `getStats(txs)` — derived selector, computes income, expense, balance, and savings rate from any tx array
- CRUD actions — `addTransaction`, `editTransaction`, `deleteTransaction`

Components subscribe only to the slices they need, so unrelated state changes never cause unnecessary re-renders.

---

## Role-Based UI

The role switcher in the header simulates two access levels entirely on the frontend — no backend or authentication required.

| Feature | Admin | Viewer |
|---------|-------|--------|
| View all sections | ✅ | ✅ |
| Add transaction | ✅ | ❌ |
| Edit transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |
| Export CSV | ✅ | ✅ |
| Switch theme | ✅ | ✅ |

Switching roles takes effect immediately — the Add button and edit/delete actions appear and disappear without any page reload.

---

## Responsive Layout

| Breakpoint | Cards | Charts | Transactions | Insights |
|------------|-------|--------|-------------|----------|
| Mobile `< 640px` | 2 column | Stacked | Card list | 1 column stack |
| Tablet `640px–1024px` | 2 column | Stacked | Card list | 1 column stack |
| Desktop `≥ 1024px` | 4 column | Side by side | Full table | 3 column grid |

The navigation bar also adapts — on mobile it renders as anchor pills below the header, on desktop it becomes a pill tab group centred in the header row.

---

## Charts

Both charts use **visx** — Airbnb's low-level SVG visualisation library for React.

**Bar chart** (`BarChart.jsx`) — grouped bars showing income vs expenses per month. The chart width is measured dynamically using a `ResizeObserver` so it fills the panel at any screen size. Period data (1W / 1M / 3M / 1Y) is defined as static lookup tables mapped to the active period in the Zustand store.

**Donut chart** (`DonutChart.jsx`) — spending breakdown by category. Category spending is computed live from the filtered transactions. An empty state (grey ring) is shown when there are no expense transactions.

---

## Data

The app ships with 12 seed transactions covering November 2025 through April 2026 across six categories: Income, Housing, Food, Transport, Shopping, and Health.

All data is stored in the browser's localStorage. Clearing site data in DevTools resets the app to its seed state.

Transaction schema:

```js
{
  id:   number,    // Date.now() for new entries
  date: string,    // 'YYYY-MM-DD'
  desc: string,    // description
  cat:  string,    // 'Food' | 'Housing' | 'Transport' | 'Shopping' | 'Health' | 'Income'
  type: string,    // 'income' | 'expense'
  amt:  number,    // positive number
}
```

---

## Design Decisions

**Single scrollable page over tabbed navigation** — all four sections (Overview, Charts, Transactions, Insights) live on one continuous page. The nav links are anchor shortcuts that smooth-scroll to the relevant section. A scroll spy using `IntersectionObserver` highlights the active link automatically as the user scrolls. This approach avoids routing complexity, keeps all data visible and reactive, and feels natural on mobile.

**Inline editing over a modal** — adding and editing transactions happens directly within the transaction list. A new entry form appears above the list when Add is tapped, and editing a row transforms it into an editable form in place. This keeps the user's context — they can see surrounding transactions while editing — and removes the z-index and overlay complexity of a modal.

**visx over Chart.js** — visx produces true SVG output instead of canvas, which scales crisp on retina displays and integrates cleanly with React's component model. The `ResizeObserver`-driven width makes the bar chart fully fluid without needing wrapper hacks.

**Zustand over Context or Redux** — Zustand's minimal API (no providers, no boilerplate, built-in persist) is well suited to a dashboard of this scope. The store is a single file and every component subscribes to only the slice it needs.

---

## Known Limitations

- Period filter (1W / 1M / 3M / 1Y) drives the bar chart and overview cards but uses static trend data for the bar chart history rather than computing it from real transactions
- No authentication — role switching is a frontend simulation only
- No backend — all data lives in localStorage and resets if the user clears browser data

---

## Assignment Context

Built as a frontend developer internship assignment for evaluating UI design, component architecture, state management, responsiveness, and attention to detail.

**Evaluation criteria addressed:**

| Criterion | Implementation |
|-----------|---------------|
| Design and creativity | Custom visx charts, hover effects, section colour coding, dark mode |
| Responsiveness | Tailwind breakpoints across mobile, tablet, desktop |
| Functionality | All core features plus all optional enhancements |
| User experience | Inline editing, scroll spy nav, empty states, smooth transitions |
| Technical quality | Zustand store, component modularity, ResizeObserver for charts |
| State management | Zustand persist — transactions, filters, role, theme all persisted |
| Documentation | This README |
| Attention to detail | Dark variants on every element, export memory cleanup, peer dep fix |

---

## Author

**Swetha Madhanmohan**
Frontend Developer Intern Candidate
[xswexmadhanmohan@gmail.com](mailto:xswexmadhanmohan@gmail.com)
[github.com/xswex09](https://github.com/xswex09)
