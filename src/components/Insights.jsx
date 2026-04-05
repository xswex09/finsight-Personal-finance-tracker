// src/components/Insights.jsx
import useStore from '../store/useStore'

const CAT_COLORS = {
  Housing: '#2563eb', Food: '#d97706', Transport: '#7c3aed',
  Shopping: '#dc2626', Health: '#0d9488',
}

function fmt(n) { return '$' + Math.round(n).toLocaleString() }

function InsightCard({ iconBg, iconTc, icon, label, value, valueColor, note }) {
  return (
    <div className="
      bg-white dark:bg-[#161b27]
      border border-black/[0.07] dark:border-white/[0.06]
      rounded-xl p-[13px] lg:p-[16px]
      flex gap-[11px] items-start
      transition-transform duration-200 hover:-translate-y-[2px]
    ">
      <div
        className="w-[32px] h-[32px] rounded-[9px] flex items-center justify-center text-[14px] flex-shrink-0"
        style={{ background: iconBg, color: iconTc }}
      >
        {icon}
      </div>
      <div>
        <div className="text-[10px] lg:text-[11px] text-[#9ca3af] dark:text-[#4b5568] mb-[2px]">{label}</div>
        <div className="text-[14px] lg:text-[16px] font-medium mb-[2px]" style={{ color: valueColor || '#0f1320' }}>{value}</div>
        <div className="text-[10px] lg:text-[11px] text-[#9ca3af] dark:text-[#4b5568]">{note}</div>
      </div>
    </div>
  )
}

function CategoryBar({ cat, pct }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-[11px] lg:text-[12px] text-[#6b7280] dark:text-[#8892a4] w-[64px] lg:w-[72px] flex-shrink-0">{cat}</div>
      <div className="flex-1 h-[4px] lg:h-[5px] bg-[#f0f1f6] dark:bg-[#1e2538] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: CAT_COLORS[cat] || '#9ca3af' }}
        />
      </div>
      <div className="text-[10px] text-[#9ca3af] dark:text-[#4b5568] w-[26px] text-right">{pct}%</div>
    </div>
  )
}

export default function Insights({ sectionRef }) {
  const transactions = useStore(s => s.transactions)
  const getPeriodTx  = useStore(s => s.getPeriodTx)
  const getStats     = useStore(s => s.getStats)

  const periodTx   = getPeriodTx()
  const st         = getStats(periodTx)

  const cats = {}
  transactions.filter(t => t.type === 'expense')
    .forEach(t => { cats[t.cat] = (cats[t.cat] || 0) + t.amt })
  const sortedCats = Object.entries(cats).sort((a, b) => b[1] - a[1])
  const totalSpend = sortedCats.reduce((s, [, v]) => s + v, 0) || 1

  const topCat     = sortedCats[0]?.[0] || '—'
  const topCatAmt  = sortedCats[0]?.[1] || 0
  const net        = st.income - st.expense
  const isPositive = net >= 0
  const monthlyNote = st.savings > 40 ? 'Excellent savings rate' : st.savings > 20 ? 'Good — keep it up' : 'Room to improve'
  const expCount   = periodTx.filter(t => t.type === 'expense').length
  const incCount   = periodTx.filter(t => t.type === 'income').length

  return (
    <section ref={sectionRef} id="insights" className="pt-5">

      <div className="flex items-baseline justify-between mb-[10px] lg:mb-[14px]">
        <div>
          <div className="text-[13px] lg:text-[15px] font-medium text-[#0f1320] dark:text-[#e8ecf4]">Insights</div>
          <div className="text-[10px] lg:text-[11px] text-[#9ca3af] dark:text-[#4b5568]">What your data tells you</div>
        </div>
      </div>

      {/*
        mobile:  stacked cards
        desktop: 3 column grid
      */}
      <div className="
        grid gap-2 lg:gap-3 mb-2 lg:mb-3
        grid-cols-1
        lg:grid-cols-3
      ">
        <InsightCard
          iconBg="#fef2f2" iconTc="#7f1d1d" icon="↑"
          label="Top spending category"
          value={topCat}
          note={topCatAmt > 0 ? `${fmt(topCatAmt)} this period` : 'No expenses yet'}
        />
        <InsightCard
          iconBg="#f0fdf4" iconTc="#14532d" icon="↗"
          label="Net savings"
          value={`${isPositive ? '+' : ''}${fmt(net)}`}
          valueColor={isPositive ? '#16a34a' : '#dc2626'}
          note={isPositive ? `Surplus — ${monthlyNote}` : 'Deficit this period'}
        />
        <InsightCard
          iconBg="#eff4ff" iconTc="#1e40af" icon="◎"
          label="Total transactions"
          value={periodTx.length}
          note={`${expCount} expense${expCount !== 1 ? 's' : ''} · ${incCount} income`}
        />
      </div>

      {/* category breakdown */}
      <div className="
        bg-white dark:bg-[#161b27]
        border border-black/[0.07] dark:border-white/[0.06]
        rounded-xl p-[14px] lg:p-[18px]
        transition-transform duration-200 hover:-translate-y-[2px]
      ">
        <div className="text-[12px] lg:text-[13px] font-medium text-[#0f1320] dark:text-[#e8ecf4] mb-[14px]">
          Category breakdown
        </div>
        {sortedCats.length === 0 ? (
          <div className="text-center py-4 text-[11px] text-[#9ca3af]">No expense data yet</div>
        ) : (
          <div className="flex flex-col gap-[9px] lg:gap-[11px]">
            {sortedCats.map(([cat, amt]) => (
              <CategoryBar key={cat} cat={cat} pct={Math.round(amt / totalSpend * 100)} />
            ))}
          </div>
        )}

        {sortedCats.length > 0 && (
          <div className="mt-[14px] pt-[12px] border-t border-black/[0.06] dark:border-white/[0.04]">
            <div className="text-[10px] text-[#9ca3af] dark:text-[#4b5568] mb-[2px]">Monthly observation</div>
            <div className="text-[11px] lg:text-[12px] text-[#0f1320] dark:text-[#e8ecf4]">
              {topCat !== '—'
                ? `${topCat} is your biggest expense at ${Math.round(topCatAmt / totalSpend * 100)}% of total spending.`
                : 'Add some transactions to see your spending patterns.'
              }
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="text-center pt-[14px] pb-[6px] text-[10px] lg:text-[11px] text-[#9ca3af] dark:text-[#4b5568] border-t border-black/[0.06] dark:border-white/[0.04] mt-4">
        finsight · data stored locally · {transactions.length} total transactions
      </div>

    </section>
  )
}