import React, { useState } from 'react'
import Header from './components/Header'
import PortfolioOverview from './components/PortfolioOverview'
import DeFiBreakdown from './components/DeFiBreakdown'
import HackSummary from './components/HackSummary'
import ScenarioAnalysis from './components/ScenarioAnalysis'
import EFExposure from './components/EFExposure'

type TabId = 'overview' | 'defi' | 'hack' | 'scenarios' | 'exposure'

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'overview',  label: 'EF Portfolio' },
  { id: 'defi',      label: 'DeFi Positions' },
  { id: 'hack',      label: 'Hack Summary' },
  { id: 'scenarios', label: 'Aave Scenarios' },
  { id: 'exposure',  label: 'EF Exposure' },
]

export default function App() {
  const [active, setActive] = useState<TabId>('overview')

  return (
    <div className="min-h-screen bg-parchment text-near-black">
      <Header />
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex gap-0 border-b border-cream mt-0 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`relative px-5 py-3.5 text-[11px] font-sans font-medium tracking-[0.1em] uppercase whitespace-nowrap transition-colors duration-150 ${
                active === t.id
                  ? 'text-brand border-b-2 border-brand'
                  : 'text-stone hover:text-charcoal border-b-2 border-transparent'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <main className="py-7">
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
