import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, LabelList,
} from 'recharts'
import { aaveScenarios, aaveDAOTreasury, type AaveScenario, type AaveChain } from '../data'

type ScenarioKey = keyof typeof aaveScenarios

const fmt = (n: number) => n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : `$${(n / 1e6).toFixed(1)}M`

interface ChainTooltipEntry { payload: AaveChain }
interface CustomTooltipProps { active?: boolean; payload?: ChainTooltipEntry[] }

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-ivory border border-cream rounded-lg p-3 text-[12px] shadow-whisper">
      <p className="font-serif font-medium text-near-black mb-1">{d.chain}</p>
      <p className="font-mono text-charcoal">{fmt(d.badDebt)} bad debt</p>
      <p className="font-sans text-[11px] text-stone">{d.shortfall.toFixed(2)}% reserve shortfall</p>
    </div>
  )
}

interface ScenarioCardProps {
  scenario: AaveScenario
  selected: boolean
  onSelect: () => void
}

function ScenarioCard({ scenario, selected, onSelect }: ScenarioCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`flex-1 text-left rounded-lg p-5 border-2 transition-all duration-200 relative overflow-hidden bg-ivory shadow-whisper ${
        selected ? '' : 'opacity-70 hover:opacity-90'
      }`}
      style={{ borderColor: selected ? scenario.color : '#e8e5da' }}
    >
      {selected && (
        <div className="absolute left-0 top-0 bottom-0 w-[2.5px]" style={{ backgroundColor: scenario.color }} />
      )}
      <div className="flex items-start justify-between mb-3 pl-1">
        <div>
          <div className="text-[10px] font-sans font-medium tracking-[0.14em] uppercase mb-1" style={{ color: scenario.color }}>
            {scenario.name}
          </div>
          <div className="font-serif text-lg font-medium text-near-black leading-tight">{scenario.subtitle}</div>
        </div>
        {selected && (
          <span
            className="font-sans text-[10px] font-medium px-2 py-0.5 rounded"
            style={{ color: scenario.color, backgroundColor: scenario.color + '18' }}
          >
            Active
          </span>
        )}
      </div>
      <div className="font-serif text-3xl font-medium mb-0.5 pl-1" style={{ color: scenario.color }}>
        {fmt(scenario.totalBadDebt)}
      </div>
      <div className="font-sans text-[11px] text-stone mb-4 pl-1">total bad debt</div>
      <p className="font-sans text-[12px] text-olive leading-relaxed pl-1">{scenario.description}</p>
      <div className="mt-4 pt-3 border-t border-cream flex items-center gap-2 pl-1">
        {scenario.umbrellaActivated ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="font-sans text-[11px] text-success">Umbrella activates — {fmt(scenario.umbrellaAmount)} covered</span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            <span className="font-sans text-[11px] text-error">Umbrella inactive — L2 reserves not covered</span>
          </>
        )}
      </div>
    </button>
  )
}

export default function ScenarioAnalysis() {
  const [selected, setSelected] = useState<ScenarioKey>('s1')
  const scenario = aaveScenarios[selected]

  const haircut = scenario.id === 1
    ? `${scenario.rsETHHaircut}% uniform (all chains)`
    : `${scenario.rsETHHaircutL2}% L2-only · mainnet 0%`

  const treasuryRows = [
    { label: 'Total DAO treasury',      value: '$181M',                                          color: 'text-near-black' },
    { label: 'ETH-correlated holdings', value: '$62M',                                           color: 'text-brand' },
    { label: 'AAVE tokens',             value: '$54M',                                           color: 'text-charcoal' },
    { label: 'Stablecoins',             value: '$52M',                                           color: 'text-success' },
    { label: 'Umbrella WETH module',    value: `$${(aaveDAOTreasury.umbrellaWETH / 1e6).toFixed(2)}M`, color: 'text-warn' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <ScenarioCard scenario={aaveScenarios.s1} selected={selected === 's1'} onSelect={() => setSelected('s1')} />
        <ScenarioCard scenario={aaveScenarios.s2} selected={selected === 's2'} onSelect={() => setSelected('s2')} />
      </div>

      <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
        <div className="flex items-center justify-between mb-6">
          <div className="brand-bar pl-3">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Bad Debt by Chain — {scenario.subtitle}</div>
          </div>
          <div className="font-sans text-[11px] text-stone">
            Haircut: <span className="font-medium" style={{ color: scenario.color }}>{haircut}</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={scenario.chains} barSize={52} margin={{ top: 24, right: 10, left: 10, bottom: 0 }}>
            <XAxis dataKey="chain" tick={{ fill: '#87867f', fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v: number) => `$${(v / 1e6).toFixed(0)}M`}
              tick={{ fill: '#b0aea5', fontSize: 11, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(27,54,93,0.04)' }} />
            <Bar dataKey="badDebt" radius={[3, 3, 0, 0]}>
              {scenario.chains.map(c => <Cell key={c.chain} fill={c.color} />)}
              <LabelList
                dataKey="badDebt"
                position="top"
                formatter={(v: number) => fmt(v)}
                style={{ fill: '#87867f', fontSize: 10, fontFamily: 'Inter' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
          <div className="brand-bar pl-3 mb-5">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Chain-by-Chain Breakdown</div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream">
                <th className="text-left pb-2.5 font-sans text-[10px] font-medium tracking-[0.12em] text-stone uppercase">Chain</th>
                <th className="text-right pb-2.5 font-sans text-[10px] font-medium tracking-[0.12em] text-stone uppercase">Reserve</th>
                <th className="text-right pb-2.5 font-sans text-[10px] font-medium tracking-[0.12em] text-stone uppercase">Bad Debt</th>
                <th className="text-right pb-2.5 font-sans text-[10px] font-medium tracking-[0.12em] text-stone uppercase">Shortfall</th>
              </tr>
            </thead>
            <tbody>
              {scenario.chains.map((c, i) => (
                <tr key={c.chain} className={i < scenario.chains.length - 1 ? 'border-b border-cream' : ''}>
                  <td className="py-3">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="font-sans text-sm text-charcoal">{c.chain}</span>
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono text-[11px] text-stone">{c.reserve}</td>
                  <td className="py-3 text-right font-serif text-sm font-medium text-near-black">{fmt(c.badDebt)}</td>
                  <td className="py-3 text-right font-mono text-[11px]">
                    <span className={c.shortfall > 20 ? 'text-error' : c.shortfall > 5 ? 'text-warn' : 'text-charcoal'}>
                      {c.shortfall.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-warm-border">
                <td className="pt-3 font-sans text-[11px] font-medium text-stone uppercase tracking-[0.1em]" colSpan={2}>Total</td>
                <td className="pt-3 text-right font-serif text-lg font-medium" style={{ color: scenario.color }}>
                  {fmt(scenario.totalBadDebt)}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
            <div className="brand-bar pl-3 mb-4">
              <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Aave DAO Treasury Coverage</div>
            </div>
            <div className="space-y-0">
              {treasuryRows.map((r, i) => (
                <div key={r.label} className={`flex justify-between py-2.5 ${i < treasuryRows.length - 1 ? 'border-b border-cream' : ''}`}>
                  <span className="font-sans text-[12px] text-olive">{r.label}</span>
                  <span className={`font-serif text-[13px] font-medium ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-lg p-5 border-2"
            style={{ borderColor: scenario.color + '40', backgroundColor: scenario.color + '08' }}
          >
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase mb-4">Net Position After Coverage</div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-baseline">
                <span className="font-sans text-[12px] text-olive">Total bad debt</span>
                <span className="font-serif text-sm font-medium text-near-black">{fmt(scenario.totalBadDebt)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-sans text-[12px] text-olive">Umbrella coverage</span>
                <span className={`font-serif text-sm font-medium ${scenario.umbrellaActivated ? 'text-success' : 'text-error'}`}>
                  {scenario.umbrellaActivated ? `-${fmt(scenario.umbrellaAmount)}` : '$0 (inactive)'}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-warm-border">
                <span className="font-sans text-[11px] font-medium text-stone uppercase tracking-[0.1em]">Net residual</span>
                <span className="font-serif text-2xl font-medium" style={{ color: scenario.color }}>
                  {fmt(scenario.netAfterUmbrella)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-parchment border border-cream rounded-lg p-4 font-sans text-[12px] text-olive leading-relaxed">
            <span className="font-medium text-charcoal">Resolution dependency:</span> The outcome hinges entirely on how KelpDAO distributes losses across rsETH holders. Scenario 1 spreads pain globally and lets Umbrella partially offset damage; Scenario 2 concentrates damage on L2 reserves where Umbrella provides no coverage.
          </div>
        </div>
      </div>
    </div>
  )
}
