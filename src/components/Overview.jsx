// src/components/Overview.jsx
// src/components/Overview.jsx
import useStore from '../store/useStore'

const CARDS = [
  { key: 'balance', label: 'Total balance', icon: '$',  iconBg: '#eff4ff', iconTc: '#1e40af', change: '+2.4% this month', trend: 'up'   },
  { key: 'income',  label: 'Income',         icon: '↑',  iconBg: '#f0fdf4', iconTc: '#14532d', change: '+5.1% vs last',   trend: 'up'   },
  { key: 'expense', label: 'Expenses',        icon: '↓',  iconBg: '#fef2f2', iconTc: '#7f1d1d', change: '+12% vs last',    trend: 'down' },
  { key: 'savings', label: 'Savings rate',    icon: '%',  iconBg: '#f0fdfa', iconTc: '#134e4a', change: 'On track',        trend: 'up'   },
]

function fmt(n) {
  return '$' + Math.round(n).toLocaleString()
}

function StatCard({ config, value }) {
  const isUp = config.trend === 'up'
  return (
    <div className="
      bg-white dark:bg-[#161b27]
      border border-black/[0.07] dark:border-white/[0.06]
      rounded-xl p-[13px] lg:p-[18px]
      transition-transform duration-200 ease-out
      hover:-translate-y-[3px] cursor-pointer
    ">
      <div className="flex items-center justify-between mb-[9px] lg:mb-[12px]">
        <span className="
          text-[10px] lg:text-[11px]
          text-[#9ca3af] dark:text-[#4b5568]
          tracking-[0.2px]
        ">
          {config.label}
        </span>
        <div
          className="w-[26px] h-[26px] lg:w-[32px] lg:h-[32px] rounded-[7px] lg:rounded-[9px] flex items-center justify-center text-[12px] lg:text-[14px] font-medium"
          style={{ background: config.iconBg, color: config.iconTc }}
        >
          {config.icon}
        </div>
      </div>
      <div className="
        text-[19px] lg:text-[24px] font-medium
        text-[#0f1320] dark:text-[#e8ecf4]
        tracking-[-0.5px] mb-[5px]
      ">
        {config.key === 'savings' ? value + '%' : fmt(value)}
      </div>
      <div className={`
        flex items-center gap-[3px]
        text-[10px] lg:text-[11px]
        ${isUp ? 'text-[#16a34a]' : 'text-[#dc2626]'}
      `}>
        <span className={`
          w-[4px] h-[4px] rounded-full flex-shrink-0
          ${isUp ? 'bg-[#16a34a]' : 'bg-[#dc2626]'}
        `} />
        {config.change}
      </div>
    </div>
  )
}

export default function Overview({ sectionRef }) {
  const getPeriodTx = useStore(s => s.getPeriodTx)
  const getStats    = useStore(s => s.getStats)
  const st          = getStats(getPeriodTx())

  const values = {
    balance: st.balance,
    income:  st.income,
    expense: st.expense,
    savings: st.savings,
  }

  return (
    <section ref={sectionRef} id="overview" className="pt-5">
      <div className="flex items-baseline justify-between mb-[10px] lg:mb-[14px]">
        <div>
          <div className="
            text-[13px] lg:text-[15px] font-medium
            text-[#0f1320] dark:text-[#e8ecf4]
          ">
            Overview
          </div>
          <div className="text-[10px] lg:text-[11px] text-[#9ca3af] dark:text-[#4b5568]">
            Your financial snapshot
          </div>
        </div>
      </div>

      {/*
        mobile:  2 columns
        desktop: 4 columns
      */}
      <div className="
        grid gap-2 lg:gap-3
        grid-cols-2
        lg:grid-cols-4
      ">
        {CARDS.map(card => (
          <StatCard key={card.key} config={card} value={values[card.key]} />
        ))}
      </div>
    </section>
  )
}