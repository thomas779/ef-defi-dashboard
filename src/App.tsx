import React, { useState } from 'react'
import Header from './components/Header'
import LivePositions from './components/LivePositions'
import AaveScenarios from './components/AaveScenarios'

type TabId = 'positions' | 'scenarios'

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'positions',  label: 'EF Live Positions' },
  { id: 'scenarios',  label: 'Aave Scenarios & EF Loss' },
]

export default function App() {
  const [active, setActive] = useState<TabId>('positions')

  return (
    <div className="min-h-screen bg-parchment text-near-black">
      <Header />
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex gap-0 border-b border-cream overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-6 py-3.5 text-[11px] font-sans font-medium tracking-[0.1em] uppercase whitespace-nowrap transition-colors duration-150 ${
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
          {active === 'positions'  && <LivePositions />}
          {active === 'scenarios'  && <AaveScenarios />}
        </main>
      </div>
    </div>
  )
}
