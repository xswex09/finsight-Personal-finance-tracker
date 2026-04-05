// src/components/Transactions.jsx
// src/components/Transactions.jsx
import { useState } from 'react'
import useStore from '../store/useStore'

const CATEGORIES = ['Food', 'Housing', 'Transport', 'Shopping', 'Health', 'Income']

const CAT_STYLE = {
  Income:    { icon: '↑', bg: '#f0fdf4', tc: '#14532d' },
  Housing:   { icon: '⌂', bg: '#eff4ff', tc: '#1e40af' },
  Food:      { icon: '◉', bg: '#fffbeb', tc: '#78350f' },
  Transport: { icon: '→', bg: '#f5f3ff', tc: '#4c1d95' },
  Shopping:  { icon: '◈', bg: '#fef2f2', tc: '#7f1d1d' },
  Health:    { icon: '+', bg: '#f0fdfa', tc: '#134e4a' },
}

const EMPTY_FORM = { desc: '', amt: '', cat: 'Food', type: 'expense', date: '2026-04-03' }
const PREVIEW_COUNT = 5

function fmt(n) { return '$' + Math.round(n).toLocaleString() }

function InlineForm({ initial = EMPTY_FORM, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }
  function handleSave() {
    if (!form.desc.trim() || !form.amt || !form.date) return
    onSave({ ...form, amt: parseFloat(form.amt) })
  }

  return (
    <div className="bg-[#f8f9fc] dark:bg-[#1e2538] border border-[#2563eb]/20 rounded-xl p-3 mb-2">
      <div className="flex gap-2 mb-2">
        <input
          autoFocus
          className="flex-1 px-[10px] py-[7px] rounded-lg text-[11px] bg-white dark:bg-[#161b27] border border-black/[0.08] dark:border-white/[0.06] text-[#0f1320] dark:text-[#e8ecf4] outline-none placeholder-[#9ca3af]"
          placeholder="Description…"
          value={form.desc}
          onChange={e => set('desc', e.target.value)}
        />
        <input
          type="number"
          className="w-[72px] px-[10px] py-[7px] rounded-lg text-[11px] bg-white dark:bg-[#161b27] border border-black/[0.08] dark:border-white/[0.06] text-[#0f1320] dark:text-[#e8ecf4] outline-none"
          placeholder="$0"
          value={form.amt}
          onChange={e => set('amt', e.target.value)}
        />
      </div>
      <div className="flex gap-2 mb-2">
        <select
          className="flex-1 px-[10px] py-[7px] rounded-lg text-[11px] bg-white dark:bg-[#161b27] border border-black/[0.08] dark:border-white/[0.06] text-[#0f1320] dark:text-[#e8ecf4] outline-none"
          value={form.cat}
          onChange={e => set('cat', e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          className="flex-1 px-[10px] py-[7px] rounded-lg text-[11px] bg-white dark:bg-[#161b27] border border-black/[0.08] dark:border-white/[0.06] text-[#0f1320] dark:text-[#e8ecf4] outline-none"
          value={form.type}
          onChange={e => set('type', e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          className="flex-1 px-[10px] py-[7px] rounded-lg text-[11px] bg-white dark:bg-[#161b27] border border-black/[0.08] dark:border-white/[0.06] text-[#0f1320] dark:text-[#e8ecf4] outline-none"
          value={form.date}
          onChange={e => set('date', e.target.value)}
        />
        <button
          onClick={onCancel}
          className="w-[30px] h-[30px] rounded-lg text-[12px] bg-white dark:bg-[#161b27] border border-black/[0.08] dark:border-white/[0.06] text-[#9ca3af] flex items-center justify-center"
        >✕</button>
        <button
          onClick={handleSave}
          className="w-[30px] h-[30px] rounded-lg text-[12px] bg-[#2563eb] text-white flex items-center justify-center"
        >✓</button>
      </div>
    </div>
  )
}

export default function Transactions({ sectionRef }) {
  const role              = useStore(s => s.role)
  const transactions      = useStore(s => s.transactions)
  const search            = useStore(s => s.search)
  const setSearch         = useStore(s => s.setSearch)
  const typeFilter        = useStore(s => s.typeFilter)
  const setTypeFilter     = useStore(s => s.setTypeFilter)
  const catFilter         = useStore(s => s.catFilter)
  const setCatFilter      = useStore(s => s.setCatFilter)
  const addTransaction    = useStore(s => s.addTransaction)
  const editTransaction   = useStore(s => s.editTransaction)
  const deleteTransaction = useStore(s => s.deleteTransaction)

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId,   setEditingId]   = useState(null)
  const [showAll,     setShowAll]     = useState(false)

  const isAdmin = role === 'admin'

  const filtered = transactions.filter(t => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false
    if (catFilter  !== 'all' && t.cat  !== catFilter)  return false
    if (search && !t.desc.toLowerCase().includes(search.toLowerCase()) &&
        !t.cat.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const visible   = showAll ? filtered : filtered.slice(0, PREVIEW_COUNT)
  const moreCount = filtered.length - PREVIEW_COUNT

  function handleAdd(payload)  { addTransaction(payload);              setShowAddForm(false) }
  function handleEdit(payload) { editTransaction(editingId, payload);  setEditingId(null)    }
  function openEdit(tx)        { setShowAddForm(false); setEditingId(tx.id) }
  function openAdd()           { setEditingId(null);    setShowAddForm(true) }

  const badge = (cat) => {
    const colors = {
      Income: 'bg-[#f0fdf4] text-[#14532d]', Housing: 'bg-[#eff4ff] text-[#1e40af]',
      Food: 'bg-[#fffbeb] text-[#78350f]', Transport: 'bg-[#f5f3ff] text-[#4c1d95]',
      Shopping: 'bg-[#fef2f2] text-[#7f1d1d]', Health: 'bg-[#f0fdfa] text-[#134e4a]',
    }
    return (
      <span className={`px-[8px] py-[2px] rounded-full text-[10px] font-medium ${colors[cat] || 'bg-gray-100 text-gray-600'}`}>
        {cat}
      </span>
    )
  }

  return (
    <section ref={sectionRef} id="transactions" className="pt-5">

      <div className="flex items-baseline justify-between mb-[10px] lg:mb-[14px]">
        <div>
          <div className="text-[13px] lg:text-[15px] font-medium text-[#0f1320] dark:text-[#e8ecf4]">Transactions</div>
          <div className="text-[10px] lg:text-[11px] text-[#9ca3af] dark:text-[#4b5568]">All your activity</div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#161b27] border border-black/[0.07] dark:border-white/[0.06] rounded-xl p-[14px] lg:p-[18px]">

        {/* panel top */}
        <div className="flex items-center justify-between mb-[10px]">
          <div className="flex items-baseline gap-[5px]">
            <span className="text-[12px] lg:text-[13px] font-medium text-[#0f1320] dark:text-[#e8ecf4]">
              All transactions
            </span>
            <span className="text-[10px] text-[#9ca3af] dark:text-[#4b5568]">
              {filtered.length} records
            </span>
          </div>
          {isAdmin && (
            <button
              onClick={showAddForm ? () => setShowAddForm(false) : openAdd}
              className={`
                px-[10px] py-[5px] rounded-lg text-[10px] lg:text-[11px] font-medium border-none transition-all
                ${showAddForm
                  ? 'bg-[#f0f1f6] dark:bg-[#1e2538] text-[#6b7280] dark:text-[#8892a4]'
                  : 'bg-[#2563eb] text-white'
                }
              `}
            >
              {showAddForm ? '✕ Cancel' : '+ Add'}
            </button>
          )}
        </div>

        {/* search + filters */}
        <div className="flex gap-[6px] mb-[10px]">
          <input
            className="flex-1 px-[10px] py-[6px] rounded-lg text-[10px] lg:text-[11px] bg-[#f0f1f6] dark:bg-[#1e2538] border border-black/[0.09] dark:border-white/[0.06] text-[#0f1320] dark:text-[#e8ecf4] outline-none placeholder-[#9ca3af]"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="px-[8px] py-[6px] rounded-lg text-[10px] lg:text-[11px] bg-[#f0f1f6] dark:bg-[#1e2538] border border-black/[0.09] dark:border-white/[0.06] text-[#0f1320] dark:text-[#e8ecf4] outline-none"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            className="px-[8px] py-[6px] rounded-lg text-[10px] lg:text-[11px] bg-[#f0f1f6] dark:bg-[#1e2538] border border-black/[0.09] dark:border-white/[0.06] text-[#0f1320] dark:text-[#e8ecf4] outline-none"
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
          >
            <option value="all">All cats</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* inline add form */}
        {showAddForm && (
          <div className="mb-1">
            <div className="text-[10px] text-[#2563eb] font-medium mb-[6px] px-1">New transaction</div>
            <InlineForm isNew onSave={handleAdd} onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        {/* ── MOBILE list ── */}
        <div className="flex flex-col lg:hidden">
          {visible.length === 0 && !showAddForm ? (
            <div className="text-center py-6 text-[11px] text-[#9ca3af]">
              No transactions match your filters.
            </div>
          ) : (
            visible.map((tx, i) => {
              const style = CAT_STYLE[tx.cat] || CAT_STYLE.Food
              const isInc = tx.type === 'income'
              const isLast = i === visible.length - 1 && moreCount <= 0

              if (editingId === tx.id) {
                return (
                  <div key={tx.id} className={`py-[6px] ${!isLast ? 'border-b border-black/[0.06] dark:border-white/[0.04]' : ''}`}>
                    <div className="text-[10px] text-[#2563eb] font-medium mb-[6px] px-1">Editing — {tx.desc}</div>
                    <InlineForm
                      initial={{ desc: tx.desc, amt: tx.amt, cat: tx.cat, type: tx.type, date: tx.date }}
                      onSave={handleEdit}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                )
              }

              return (
                <div
                  key={tx.id}
                  className={`flex items-center gap-[10px] py-[9px] ${!isLast ? 'border-b border-black/[0.06] dark:border-white/[0.04]' : ''}`}
                >
                  <div
                    className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[13px] flex-shrink-0"
                    style={{ background: style.bg, color: style.tc }}
                  >
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-[#0f1320] dark:text-[#e8ecf4] truncate">{tx.desc}</div>
                    <div className="text-[10px] text-[#9ca3af] dark:text-[#4b5568] mt-[1px]">{tx.date} · {tx.cat}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-[12px] font-medium" style={{ color: isInc ? '#16a34a' : '#dc2626' }}>
                      {isInc ? '+' : '-'}{fmt(tx.amt)}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(tx)} className="w-[22px] h-[22px] rounded-md text-[10px] bg-[#eff4ff] text-[#1e40af] flex items-center justify-center">✎</button>
                        <button onClick={() => deleteTransaction(tx.id)} className="w-[22px] h-[22px] rounded-md text-[10px] bg-[#fef2f2] text-[#dc2626] flex items-center justify-center">✕</button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
          {filtered.length > PREVIEW_COUNT && (
            <button onClick={() => setShowAll(s => !s)} className="text-center pt-[8px] text-[10px] text-[#9ca3af] w-full">
              {showAll ? '↑ Show less' : `+ ${moreCount} more transaction${moreCount !== 1 ? 's' : ''}`}
            </button>
          )}
        </div>

        {/* ── DESKTOP table ── */}
        <div className="hidden lg:block overflow-x-auto">
          {filtered.length === 0 && !showAddForm ? (
            <div className="text-center py-8 text-[12px] text-[#9ca3af]">No transactions match your filters.</div>
          ) : (
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-black/[0.06] dark:border-white/[0.04]">
                  {['Date', 'Description', 'Category', 'Type', 'Amount', isAdmin ? 'Actions' : ''].map(h => (
                    <th key={h} className="text-left py-[8px] px-[10px] text-[11px] font-medium text-[#9ca3af] dark:text-[#4b5568]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => {
                  const isInc = tx.type === 'income'

                  if (editingId === tx.id) {
                    return (
                      <tr key={tx.id}>
                        <td colSpan={isAdmin ? 6 : 5} className="py-2 px-2">
                          <InlineForm
                            initial={{ desc: tx.desc, amt: tx.amt, cat: tx.cat, type: tx.type, date: tx.date }}
                            onSave={handleEdit}
                            onCancel={() => setEditingId(null)}
                          />
                        </td>
                      </tr>
                    )
                  }

                  return (
                    <tr
                      key={tx.id}
                      className="border-b border-black/[0.05] dark:border-white/[0.03] hover:bg-[#f8f9fc] dark:hover:bg-[#1e2538] transition-colors"
                    >
                      <td className="py-[10px] px-[10px] text-[#9ca3af] dark:text-[#4b5568] text-[11px]">{tx.date}</td>
                      <td className="py-[10px] px-[10px] font-medium text-[#0f1320] dark:text-[#e8ecf4]">{tx.desc}</td>
                      <td className="py-[10px] px-[10px]">{badge(tx.cat)}</td>
                      <td className="py-[10px] px-[10px] text-[#9ca3af] dark:text-[#4b5568] capitalize">{tx.type}</td>
                      <td className={`py-[10px] px-[10px] font-medium ${isInc ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                        {isInc ? '+' : '-'}{fmt(tx.amt)}
                      </td>
                      {isAdmin && (
                        <td className="py-[10px] px-[10px]">
                          <div className="flex gap-1">
                            <button onClick={() => openEdit(tx)} className="px-[8px] py-[3px] rounded-md text-[10px] bg-[#eff4ff] text-[#1e40af] hover:bg-[#dbeafe] transition-colors">Edit</button>
                            <button onClick={() => deleteTransaction(tx.id)} className="px-[8px] py-[3px] rounded-md text-[10px] bg-[#fef2f2] text-[#dc2626] hover:bg-[#fee2e2] transition-colors">Delete</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </section>
  )
}