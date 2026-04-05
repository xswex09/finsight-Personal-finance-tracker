// src/App.jsx
import { useRef, useState, useEffect } from 'react'
import useStore from './store/useStore'
import Header from './components/Header'
import Overview from './components/Overview'
import Charts from './components/Charts'
import Transactions from './components/Transactions'
import Insights from './components/Insights'

export default function App() {
  const role         = useStore(s => s.role)
  const setRole      = useStore(s => s.setRole)
  const theme        = useStore(s => s.theme)
  const toggleTheme  = useStore(s => s.toggleTheme)
  const transactions = useStore(s => s.transactions)

  const [activeSection, setActive] = useState('overview')

  const overviewRef = useRef(null)
  const chartsRef = useRef(null)
  const transactionsRef = useRef(null)
  const insightsRef = useRef(null)

  const sectionRefs = useRef({ overview: overviewRef, charts: chartsRef, transactions: transactionsRef, insights: insightsRef })

  useEffect(() => {
    const root = document.documentElement   // <html>
    root.classList.remove('dark')
    if (theme === 'dark') {
    root.classList.add('dark')
  }
  }, [theme])

  // Scroll spy — highlight active nav link as user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.dataset.section)
        })
      },
      { threshold: 0.25 }
    )
    Object.entries(sectionRefs.current).forEach(([key, ref]) => {
      if (ref.current) {
        ref.current.dataset.section = key
        observer.observe(ref.current)
      }
    })
    return () => observer.disconnect()
  }, [sectionRefs])


  function handleNavClick(sec) {
  const ref = sectionRefs.current[sec]
    if (!ref?.current) return

    ref.current.scrollIntoView({
      behavior: 'smooth',
      block:    'start',
    })
    setActive(sec)
  }

  function handleExport() {
    const rows = [
      'Date,Description,Category,Type,Amount',
      ...transactions.map(t =>
        `${t.date},"${t.desc}",${t.cat},${t.type},${t.amt}`
      ),
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.setAttribute('href', url)
    link.setAttribute('download', 'finsight.csv')
    link.style.display = 'none'

    document.body.appendChild(link)   // must be in DOM for Firefox
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)           // free memory after download
  }

  return (
    
      <div className="min-h-screen bg-[#f4f5f9] dark:bg-[#0d1117]">

        <Header
          role={role}
          setRole={setRole}
          theme={theme}
          toggleTheme={toggleTheme}
          activeSection={activeSection}
          onNavClick={handleNavClick}
          onExport={handleExport}
        />
        

        {/* Sections come here in later steps */}
        <main className="mx-auto px-3 pb-10
        flex flex-col gap-5
        w-full
        sm:max-w-2xl sm:px-6
        lg:max-w-5xl lg:px-8 lg:gap-6
        xl:max-w-6xl xl:px-10">
          <Overview sectionRef={overviewRef} />
          <Charts sectionRef={chartsRef} />
          <Transactions sectionRef={transactionsRef} />
          <Insights sectionRef={insightsRef} />
         
          
        </main>
        

      </div>
  )
}
