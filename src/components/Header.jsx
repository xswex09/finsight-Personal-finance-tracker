// src/components/Header.jsx
const SECTIONS = ['overview', 'charts', 'transactions', 'insights']

export default function Header({
  role, setRole, theme, toggleTheme,
  activeSection, onNavClick, onExport
}) {
  return (
    <header className="
      sticky top-0 z-50
      bg-white dark:bg-[#161b27]
      border-b border-black/[0.07] dark:border-white/[0.06]
      transition-colors duration-200
    ">
      {/*
        Mobile:  two stacked rows (brand row + actions row)
        Desktop: single row with brand left, nav center, actions right
      */}
      <div className="
        mx-auto w-full px-4
        sm:max-w-2xl sm:px-6
        lg:max-w-5xl lg:px-8 lg:flex lg:items-center lg:justify-between lg:h-[56px]
        xl:max-w-6xl xl:px-10
      ">

        {/* ── MOBILE: Row 1 — brand ── */}
        {/* ── DESKTOP: left side — brand ── */}
        <div className="pt-4 pb-0 lg:pt-0 lg:pb-0 lg:flex-shrink-0">
          <div className="
            text-[16px] font-medium tracking-[-0.4px]
            text-[#0f1320] dark:text-[#e8ecf4]
            lg:text-[18px]
          ">
            fin<span className="text-[#2563eb] dark:text-[#60a5fa]">sight</span>
          </div>
          {/* subtitle — visible mobile + tablet, hidden desktop */}
          <div className="
            text-[10px] text-[#9ca3af] dark:text-[#4b5568] mt-[2px]
            lg:hidden
          ">
            Personal finance tracker · Apr 2026
          </div>
        </div>

        {/* ── DESKTOP ONLY: center nav ── */}
        <nav className="
          hidden lg:flex items-center gap-[3px]
          bg-[#f4f5f9] dark:bg-[#1e2538]
          rounded-xl px-[3px] py-[3px]
        ">
          {SECTIONS.map(sec => (
            <button
              key={sec}
              onClick={() => onNavClick(sec)}
              className={`
                px-[14px] py-[6px] rounded-lg text-[12px] border-none
                transition-all duration-200
                ${activeSection === sec
                  ? 'bg-white dark:bg-[#161b27] text-[#2563eb] dark:text-[#60a5fa] font-medium shadow-sm'
                  : 'bg-transparent text-[#9ca3af] dark:text-[#4b5568] hover:text-[#6b7280] dark:hover:text-[#8892a4]'
                }
              `}
            >
              {sec.charAt(0).toUpperCase() + sec.slice(1)}
            </button>
          ))}
        </nav>

        {/* ── MOBILE: Row 2 — role + actions ── */}
        {/* ── DESKTOP: right side — role + actions ── */}
        <div className="
          flex items-center justify-between
          pt-[10px] pb-[10px]
          lg:pt-0 lg:pb-0 lg:gap-[10px] lg:flex-shrink-0
        ">
          {/* role switcher */}
          <div className="
            flex items-center gap-[5px] px-[10px] py-[5px]
            bg-[#f0f1f6] dark:bg-[#1e2538]
            border border-black/10 dark:border-white/[0.08]
            rounded-lg
          ">
            <span className="text-[10px] text-[#9ca3af] dark:text-[#4b5568]">
              Role:
            </span>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="
                text-[11px] font-medium
                text-[#0f1320] dark:text-[#e8ecf4]
                bg-transparent border-none outline-none cursor-pointer
              "
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {/* theme + export */}
          <div className="flex items-center gap-[7px]">
            <button
              onClick={toggleTheme}
              className="
                w-[30px] h-[30px] lg:w-[34px] lg:h-[34px]
                flex items-center justify-center rounded-lg
                bg-[#f0f1f6] dark:bg-[#1e2538]
                border border-black/[0.08] dark:border-white/[0.06]
                text-[13px] text-[#6b7280] dark:text-[#8892a4]
                transition-colors duration-200
              "
            >
              {theme === 'light' ? '◑' : '○'}
            </button>
            <button
              onClick={onExport}
              className="
                px-[11px] py-[6px] lg:px-[14px] lg:py-[7px]
                rounded-lg
                text-[11px] lg:text-[12px] font-medium
                bg-[#2563eb] text-white border-none
                transition-opacity duration-200 hover:opacity-90
              "
            >
              ↓ Export
            </button>
          </div>
        </div>

      </div>

      {/* ── MOBILE + TABLET anchor nav — hidden on desktop (uses center nav above) ── */}
      <nav className="
        flex items-center justify-center gap-[4px]
        px-3 py-[9px]
        bg-white dark:bg-[#161b27]
        border-t border-black/[0.06] dark:border-white/[0.04]
        lg:hidden
      ">
        {SECTIONS.map(sec => (
          <button
            key={sec}
            onClick={() => onNavClick(sec)}
            className={`
              px-[11px] py-[4px] rounded-full text-[10px] border
              transition-all duration-200
              ${activeSection === sec
                ? 'bg-[#eff4ff] dark:bg-[#1e3a5f] border-black/[0.11] dark:border-[#60a5fa]/20 text-[#2563eb] dark:text-[#60a5fa] font-medium'
                : 'bg-transparent border-transparent text-[#9ca3af] dark:text-[#4b5568]'
              }
            `}
          >
            {sec.charAt(0).toUpperCase() + sec.slice(1)}
          </button>
        ))}
      </nav>

    </header>
  )
}