import React, { useState } from 'react'
import Header from './components/Header'
import PortfolioOverview from './components/PortfolioOverview'
import DeFiBreakdown from './components/DeFiBreakdown'
import HackSummary from './components/HackSummary'
import ScenarioAnalysis from './components/ScenarioAnalysis'
import EFExposure from './components/EFExposure'

type TabId = 'overview' | 'defi' | 'hack' | 'scenarios' | 'exposure'

const TABS: Array<{ id: TabId; label: string; shortLabel: string }> = [
  { id: 'overview',  label: 'EF Portfolio',    shortLabel: '01' },
  { id: 'defi',      label: 'DeFi Positions',  shortLabel: '02' },
  { id: 'hack',      label: 'Hack Summary',    shortLabel: '03' },
  { id: 'scenarios', label: 'Aave Scenarios',  shortLabel: '04' },
  { id: 'exposure',  label: 'EF Exposure',     shortLabel: '05' },
]

export default function App() {
  const [active, setActive] = useState<TabId>('overview')

  return (
    <div className="min-h-screen bg-void text-pale">
      <Header />
      <div className="max-w-7xl mx-auto px-6">
        {/* Tab bar */}
        <nav className="flex gap-0 border-b border-edge mt-0 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`group relative px-5 py-3.5 text-[11px] font-mono tracking-[0.18em] uppercase whitespace-nowrap transition-all duration-200 ${
                active === t.id
                  ? 'text-gold border-b border-gold'
                  : 'text-muted hover:text-soft border-b border-transparent'
              }`}
            >
              <span className="text-[9px] mr-1.5 opacity-40">{t.shortLabel}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <main className="py-6">
          {active === 'overview'  && <PortfolioOverview />}
          {active === 'defi'      && <DeFiBreakdown />}
          {active === 'hack'      && <HackSummary />}
          {active === 'scenarios' && <ScenarioAnalysis />}
          {active === 'exposure'  && <EFExposure />}
        </main>
      </div>
    </div>
  )
}
