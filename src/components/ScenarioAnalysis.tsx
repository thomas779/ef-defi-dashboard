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
    <div className="bg-ink border border-rim rounded-sm p-3 text-[11px] shadow-2xl">
      <p className="font-display font-600 text-bright mb-1.5">{d.chain}</p>
      <p className="font-mono text-pale">{fmt(d.badDebt)} bad debt</p>
      <p className="font-mono text-dim">{d.shortfall.toFixed(2)}% reserve shortfall</p>
    </div>
  )
}

interface ScenarioCardProps {
  scenario: AaveScenario
  selected: boolean
  onSelect: () => void
}

function ScenarioCard({ scenario, selected, onSelect }: ScenarioCardProps) {
  const accent = scenario.color
  return (
    <button
      onClick={onSelect}
      className="flex-1 text-left rounded-sm p-5 border transition-all duration-200 relative overflow-hidden"
      style={{
        borderColor: selected ? accent : '#18182A',
        backgroundColor: selected ? `${accent}08` : '#101018',
      }}
    >
      {selected && (
        <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: accent }} />
      )}
      <div className="flex items-start justify-between mb-3 pl-1">
        <div>
          <div className="text-[9px] font-mono tracking-[0.22em] uppercase mb-1" style={{ color: accent }}>
            {scenario.name}
          </div>
          <div className="font-display text-base font-600 text-bright leading-tight">{scenario.subtitle}</div>
        </div>
        {selected && (
          <span
            className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm border"
            style={{ color: accent, borderColor: `${accent}40`, backgroundColor: `${accent}12` }}
          >
            ACTIVE
          </span>
        )}
      </div>
      <div className="text-3xl font-mono font-medium mb-0.5 pl-1" style={{ color: accent }}>
        {fmt(scenario.totalBadDebt)}
      </div>
      <div className="font-mono text-[10px] text-dim mb-4 pl-1">total bad debt</div>
      <p className="font-mono text-[10px] text-dim leading-relaxed pl-1">{scenario.description}</p>
      <div className="mt-4 pt-3 border-t border-edge flex items-center gap-2 pl-1">
        {scenario.umbrellaActivated ? (
          <>
            <span className="w-1 h-1 rounded-full bg-jade" />
            <span className="font-mono text-[10px] text-jade">Umbrella activates — {fmt(scenario.umbrellaAmount)} covered</span>
          </>
        ) : (
          <>
            <span className="w-1 h-1 rounded-full bg-crim" />
            <span className="font-mono text-[10px] text-crim">Umbrella inactive — L2 reserves not covered</span>
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
    { label: 'Total DAO treasury',      value: '$181M', color: 'text-bright' },
    { label: 'ETH-correlated holdings', value: '$62M',  color: 'text-steel' },
    { label: 'AAVE tokens',             value: '$54M',  color: 'text-soft' },
    { label: 'Stablecoins',             value: '$52M',  color: 'text-jade' },
    { label: 'Umbrella WETH module',    value: `$${(aaveDAOTreasury.umbrellaWETH / 1e6).toFixed(2)}M`, color: 'text-gold' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <ScenarioCard scenario={aaveScenarios.s1} selected={selected === 's1'} onSelect={() => setSelected('s1')} />
        <ScenarioCard scenario={aaveScenarios.s2} selected={selected === 's2'} onSelect={() => setSelected('s2')} />
      </div>

      <div className="bg-panel border border-edge rounded-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase">Bad Debt by Chain — {scenario.subtitle}</div>
          <div className="font-mono text-[10px] text-dim">
            haircut: <span className="font-mono" style={{ color: scenario.color }}>{haircut}</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={scenario.chains} barSize={48} margin={{ top: 24, right: 10, left: 10, bottom: 0 }}>
            <XAxis dataKey="chain" tick={{ fill: '#68688A', fontSize: 11, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v: number) => `$${(v / 1e6).toFixed(0)}M`}
              tick={{ fill: '#44445E', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200,148,42,0.04)' }} />
            <Bar dataKey="badDebt" radius={[2, 2, 0, 0]}>
              {scenario.chains.map(c => <Cell key={c.chain} fill={c.color} />)}
              <LabelList
                dataKey="badDebt"
                position="top"
                formatter={(v: number) => fmt(v)}
                style={{ fill: '#68688A', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-panel border border-edge rounded-sm p-6">
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-5">Chain-by-Chain Breakdown</div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-edge">
                <th className="text-left pb-2.5 font-mono text-[9px] tracking-[0.18em] text-dim uppercase">Chain</th>
                <th className="text-right pb-2.5 font-mono text-[9px] tracking-[0.18em] text-dim uppercase">Reserve</th>
                <th className="text-right pb-2.5 font-mono text-[9px] tracking-[0.18em] text-dim uppercase">Bad Debt</th>
                <th className="text-right pb-2.5 font-mono text-[9px] tracking-[0.18em] text-dim uppercase">Shortfall</th>
              </tr>
            </thead>
            <tbody>
              {scenario.chains.map((c, i) => (
                <tr key={c.chain} className={i < scenario.chains.length - 1 ? 'border-b border-edge' : ''}>
                  <td className="py-3">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="font-sans text-sm text-pale">{c.chain}</span>
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono text-[11px] text-dim">{c.reserve}</td>
                  <td className="py-3 text-right font-mono text-sm text-bright">{fmt(c.badDebt)}</td>
                  <td className="py-3 text-right font-mono text-[11px]">
                    <span className={c.shortfall > 20 ? 'text-crim' : c.shortfall > 5 ? 'text-amber' : 'text-soft'}>
                      {c.shortfall.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-rim">
                <td className="pt-3 font-mono text-[10px] text-soft uppercase tracking-[0.15em]" colSpan={2}>Total</td>
                <td className="pt-3 text-right font-mono font-medium text-lg" style={{ color: scenario.color }}>
                  {fmt(scenario.totalBadDebt)}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="bg-panel border border-edge rounded-sm p-6">
            <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-4">Aave DAO Treasury Coverage</div>
            <div className="space-y-0">
              {treasuryRows.map((r, i) => (
                <div key={r.label} className={`flex justify-between py-2.5 ${i < treasuryRows.length - 1 ? 'border-b border-edge' : ''}`}>
                  <span className="font-mono text-[11px] text-dim">{r.label}</span>
                  <span className={`font-mono text-[11px] font-medium ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-sm p-5 border"
            style={{
              borderColor: `${scenario.color}30`,
              backgroundColor: `${scenario.color}08`,
            }}
          >
            <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-4">Net Position After Coverage</div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-[11px] text-dim">Total bad debt</span>
                <span className="font-mono text-sm text-bright">{fmt(scenario.totalBadDebt)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-[11px] text-dim">Umbrella coverage</span>
                <span className={`font-mono text-sm ${scenario.umbrellaActivated ? 'text-jade' : 'text-crim'}`}>
                  {scenario.umbrellaActivated ? `-${fmt(scenario.umbrellaAmount)}` : '$0 (inactive)'}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-edge/60">
                <span className="font-mono text-[10px] text-soft uppercase tracking-[0.15em]">Net residual</span>
                <span className="font-mono text-xl font-medium" style={{ color: scenario.color }}>
                  {fmt(scenario.netAfterUmbrella)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-panel border border-edge rounded-sm p-4 font-mono text-[10px] text-dim leading-relaxed">
            <span className="text-soft">Resolution dependency:</span> The outcome hinges entirely on how KelpDAO
            distributes losses across rsETH holders. Scenario 1 spreads pain globally and lets Umbrella partially
            offset damage; Scenario 2 concentrates damage on L2 reserves where Umbrella provides no coverage.
          </div>
        </div>
      </div>
    </div>
  )
}
