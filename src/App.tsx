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
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex gap-1 border-b border-slate-700 mb-6 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors ${
                active === t.id
                  ? 'bg-slate-800 text-white border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <main>
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
