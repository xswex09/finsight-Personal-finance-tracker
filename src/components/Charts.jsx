// src/components/Charts.jsx
// src/components/Charts.jsx
// src/components/Charts.jsx
import { useRef, useEffect, useState } from 'react'
import useStore   from '../store/useStore'
import BarChart   from './charts/BarChart'
import DonutChart from './charts/DonutChart'

const PERIODS = ['1W', '1M', '3M', '1Y']

const CAT_COLORS = {
  Housing:   '#2563eb',
  Food:      '#d97706',
  Transport: '#7c3aed',
  Shopping:  '#dc2626',
  Health:    '#0d9488',
}

export default function Charts({ sectionRef }) {
  const period      = useStore(s => s.period)
  const setPeriod   = useStore(s => s.setPeriod)
  const getPeriodTx = useStore(s => s.getPeriodTx)

  const txs = getPeriodTx()

  // category spending for donut + legend
  const cats = {}
  txs
    .filter(t => t.type === 'expense')
    .forEach(t => { cats[t.cat] = (cats[t.cat] || 0) + t.amt })
  const catEntries = Object.entries(cats).sort((a, b) => b[1] - a[1])
  const total      = catEntries.reduce((s, [, v]) => s + v, 0) || 1

  // measure bar panel width so the chart fills it fully
  const barPanelRef        = useRef(null)
  const [barWidth, setBarWidth] = useState(311)

  useEffect(() => {
    if (!barPanelRef.current) return
    const padding = 32 // 16px left + 16px right panel padding

    const update = (width) => setBarWidth(Math.max(width - padding, 100))
    update(barPanelRef.current.clientWidth)

    const ro = new ResizeObserver(entries => {
      update(entries[0].contentRect.width)
    })
    ro.observe(barPanelRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="charts" className="pt-5">

      {/* section header */}
      <div className="mb-[10px] lg:mb-[14px]">
        <div className="text-[13px] lg:text-[15px] font-medium text-[#0f1320] dark:text-[#e8ecf4]">
          Charts
        </div>
        <div className="text-[10px] lg:text-[11px] text-[#9ca3af] dark:text-[#4b5568]">
          Trends and spending patterns
        </div>
      </div>

      {/* panels row — stacked on mobile, side by side on desktop */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4">

        {/* ── Bar chart panel ── */}
        <div
          ref={barPanelRef}
          className="
            flex-1 flex flex-col
            bg-white dark:bg-[#161b27]
            border border-black/[0.07] dark:border-white/[0.06]
            rounded-xl p-[14px] lg:p-[18px]
            transition-transform duration-200 ease-out hover:-translate-y-[2px]
          "
        >
          {/* panel header */}
          <div className="flex items-start justify-between mb-[10px]">
            <div>
              <div className="text-[12px] lg:text-[13px] font-medium text-[#0f1320] dark:text-[#e8ecf4]">
                Income vs expenses
              </div>
              <div className="text-[10px] text-[#9ca3af] dark:text-[#4b5568] mt-[2px]">
                Balance trend
              </div>
            </div>

            {/* period toggle */}
            <div className="flex gap-[3px] bg-[#f0f1f6] dark:bg-[#1e2538] rounded-[7px] p-[2px]">
              {PERIODS.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`
                    px-[8px] py-[3px] rounded-[5px] text-[9px] lg:text-[10px]
                    border-none transition-all duration-150
                    ${period === p
                      ? 'bg-white dark:bg-[#161b27] text-[#2563eb] dark:text-[#60a5fa] font-medium'
                      : 'bg-transparent text-[#9ca3af] dark:text-[#4b5568] hover:text-[#6b7280]'
                    }
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* legend */}
          <div className="flex gap-[12px] mb-[10px]">
            {[['#16a34a', 'Income'], ['#dc2626', 'Expenses']].map(([color, label]) => (
              <div key={label} className="flex items-center gap-[5px]">
                <span
                  className="w-[7px] h-[7px] rounded-[2px] flex-shrink-0"
                  style={{ background: color }}
                />
                <span className="text-[10px] lg:text-[11px] text-[#9ca3af] dark:text-[#4b5568]">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* chart — fills full measured width */}
          <div className="flex-1 w-full">
            <BarChart period={period} width={barWidth} />
          </div>
        </div>

        {/* ── Donut chart panel ── */}
        <div className="
          lg:w-[280px] lg:flex-shrink-0
          flex flex-col
          bg-white dark:bg-[#161b27]
          border border-black/[0.07] dark:border-white/[0.06]
          rounded-xl p-[14px] lg:p-[18px]
          transition-transform duration-200 ease-out hover:-translate-y-[2px]
        ">
          {/* panel header */}
          <div className="mb-[12px]">
            <div className="text-[12px] lg:text-[13px] font-medium text-[#0f1320] dark:text-[#e8ecf4]">
              Spending breakdown
            </div>
            <div className="text-[10px] text-[#9ca3af] dark:text-[#4b5568] mt-[2px]">
              By category
            </div>
          </div>

          {/* donut + legend — vertically centered on desktop */}
          <div className="flex items-center gap-4 flex-1">

            {/* donut — 86px mobile, 120px desktop */}
            <div className="flex-shrink-0">
              <div className="lg:hidden">
                <DonutChart transactions={txs} size={86} />
              </div>
              <div className="hidden lg:block">
                <DonutChart transactions={txs} size={120} />
              </div>
            </div>

            {/* legend */}
            <div className="flex flex-col gap-[7px] lg:gap-[10px] flex-1 min-w-0">
              {catEntries.length === 0 ? (
                <span className="text-[11px] text-[#9ca3af] dark:text-[#4b5568]">
                  No expense data yet
                </span>
              ) : (
                catEntries.slice(0, 5).map(([cat, amt]) => (
                  <div key={cat} className="flex items-center gap-[7px]">
                    <span
                      className="w-[8px] h-[8px] lg:w-[9px] lg:h-[9px] rounded-[2px] flex-shrink-0"
                      style={{ background: CAT_COLORS[cat] || '#9ca3af' }}
                    />
                    <span className="text-[11px] lg:text-[12px] text-[#6b7280] dark:text-[#8892a4] flex-1 truncate">
                      {cat}
                    </span>
                    <span className="text-[11px] lg:text-[12px] font-medium text-[#0f1320] dark:text-[#e8ecf4] shrink-0">
                      {Math.round(amt / total * 100)}%
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}