// src/store/useStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const SEED_TRANSACTIONS = [
  { id: 1,  date: '2026-04-02', desc: 'Salary deposit',    cat: 'Income',    type: 'income',  amt: 4100 },
  { id: 2,  date: '2026-04-01', desc: 'Rent payment',      cat: 'Housing',   type: 'expense', amt: 1200 },
  { id: 3,  date: '2026-03-30', desc: 'Grocery store',     cat: 'Food',      type: 'expense', amt: 148  },
  { id: 4,  date: '2026-03-29', desc: 'Freelance project', cat: 'Income',    type: 'income',  amt: 800  },
  { id: 5,  date: '2026-03-28', desc: 'Metro card',        cat: 'Transport', type: 'expense', amt: 60   },
  { id: 6,  date: '2026-03-25', desc: 'Amazon order',      cat: 'Shopping',  type: 'expense', amt: 210  },
  { id: 7,  date: '2026-03-22', desc: 'Doctor visit',      cat: 'Health',    type: 'expense', amt: 85   },
  { id: 8,  date: '2026-03-18', desc: 'Supermarket run',   cat: 'Food',      type: 'expense', amt: 122  },
  { id: 9,  date: '2026-03-15', desc: 'Side project',      cat: 'Income',    type: 'income',  amt: 500  },
  { id: 10, date: '2026-03-10', desc: 'Electricity bill',  cat: 'Housing',   type: 'expense', amt: 95   },
  { id: 11, date: '2026-03-05', desc: 'Gym membership',    cat: 'Health',    type: 'expense', amt: 45   },
  { id: 12, date: '2026-02-28', desc: 'Salary deposit',    cat: 'Income',    type: 'income',  amt: 4100 },
]

const useStore = create(
  persist(
    (set, get) => ({
      // data
      transactions: SEED_TRANSACTIONS,

      // role
      role: 'admin',
      setRole: (role) => set({ role }),

      // theme
      theme: 'light',
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: next })
        // also directly apply here as a safety net
        const root = document.documentElement
        root.classList.remove('dark')
        if (next === 'dark') root.classList.add('dark')
      },


      // filters
      period: '1M',
      setPeriod: (period) => set({ period }),
      search: '',
      setSearch: (search) => set({ search }),
      typeFilter: 'all',
      setTypeFilter: (typeFilter) => set({ typeFilter }),
      catFilter: 'all',
      setCatFilter: (catFilter) => set({ catFilter }),

      // transaction actions
      addTransaction: (tx) => set(s => ({
        transactions: [{ ...tx, id: Date.now() }, ...s.transactions]
      })),
      editTransaction: (id, updates) => set(s => ({
        transactions: s.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTransaction: (id) => set(s => ({
        transactions: s.transactions.filter(t => t.id !== id)
      })),

      // derived — filtered transactions by period
      getPeriodTx: () => {
        const { transactions, period } = get()
        const days = { '1W': 7, '1M': 30, '3M': 90, '1Y': 365 }[period] || 30
        const cutoff = new Date(new Date('2026-04-03').getTime() - days * 86400000)
        return transactions.filter(t => new Date(t.date) >= cutoff)
      },

      // derived — stats from a given tx array
      getStats: (txs) => {
        const income  = txs.filter(t => t.type === 'income') .reduce((s, t) => s + t.amt, 0)
        const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amt, 0)
        const balance = 24530 + income - expense
        const savings = income > 0 ? Math.round((income - expense) / income * 100) : 0
        return { income, expense, balance, savings }
      },
    }),
    {
      name: 'finsight-store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const root = document.documentElement
          root.classList.remove('dark')
          if (state.theme === 'dark') root.classList.add('dark')
        }
      },
    }
  )
)

export default useStore