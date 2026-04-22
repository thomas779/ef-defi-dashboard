import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, LabelList,
} from 'recharts'
import { aaveScenarios, type AaveScenario, type AaveChain } from '../data'

type ScenarioKey = keyof typeof aaveScenarios

const fmt = (n: number) => n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : `$${(n / 1e6).toFixed(1)}M`

interface ChainTooltipEntry {
  payload: AaveChain
}

interface CustomTooltipProps {
  active?: boolean
  payload?: ChainTooltipEntry[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm shadow-xl">
      <p className="text-white font-semibold">{d.chain}</p>
      <p className="text-slate-300">{fmt(d.badDebt)} bad debt</p>
      <p className="text-slate-400">{d.shortfall.toFixed(2)}% reserve shortfall</p>
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
      className="flex-1 text-left rounded-xl p-5 border-2 transition-all"
      style={
        selected
          ? { borderColor: scenario.color, backgroundColor: '#1e293b' }
          : { borderColor: '#334155', backgroundColor: 'rgba(30,41,59,0.5)' }
      }
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: scenario.color }}>
            {scenario.name}
          </span>
          <h3 className="text-white font-bold text-lg">{scenario.subtitle}</h3>
        </div>
        {selected && (
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
            style={{ backgroundColor: scenario.color }}
          >
            ✓
          </span>
        )}
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: scenario.color }}>
        {fmt(scenario.totalBadDebt)}
      </div>
      <div className="text-slate-400 text-xs mb-3">total bad debt</div>
      <p className="text-slate-400 text-xs leading-relaxed">{scenario.description}</p>
      <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-2">
        {scenario.umbrellaActivated ? (
          <>
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-green-400 text-xs">Umbrella activates — {fmt(scenario.umbrellaAmount)} covered</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-red-400 text-xs">Umbrella does NOT activate (L2 reserves not covered)</span>
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
    ? `${scenario.rsETHHaircut}% (all chains)`
    : `${scenario.rsETHHaircutL2}% (L2 only)`

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <ScenarioCard
          scenario={aaveScenarios.s1}
          selected={selected === 's1'}
          onSelect={() => setSelected('s1')}
        />
        <ScenarioCard
          scenario={aaveScenarios.s2}
          selected={selected === 's2'}
          onSelect={() => setSelected('s2')}
        />
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Bad Debt by Chain — {scenario.subtitle}</h2>
          <span className="text-xs text-slate-400">
            Haircut:{' '}
            <span className="font-semibold" style={{ color: scenario.color }}>{haircut}</span>
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={scenario.chains} barSize={52} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
            <XAxis dataKey="chain" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v: number) => `$${(v / 1e6).toFixed(0)}M`}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="badDebt" radius={[4, 4, 0, 0]}>
              {scenario.chains.map(c => <Cell key={c.chain} fill={c.color} />)}
              <LabelList
                dataKey="badDebt"
                position="top"
                formatter={(v: number) => fmt(v)}
                style={{ fill: '#94a3b8', fontSize: 11 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-white font-semibold mb-4">Chain-by-Chain Breakdown</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs uppercase border-b border-slate-700">
                <th className="text-left pb-2 font-medium">Chain</th>
                <th className="text-right pb-2 font-medium">Reserve</th>
                <th className="text-right pb-2 font-medium">Bad Debt</th>
                <th className="text-right pb-2 font-medium">Shortfall</th>
              </tr>
            </thead>
            <tbody>
              {scenario.chains.map(c => (
                <tr key={c.chain} className="border-b border-slate-700/50 last:border-0">
                  <td className="py-2.5">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-slate-200">{c.chain}</span>
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-slate-400">{c.reserve}</td>
                  <td className="py-2.5 text-right text-white font-medium">{fmt(c.badDebt)}</td>
                  <td className="py-2.5 text-right">
                    <span className={`font-medium ${c.shortfall > 20 ? 'text-red-400' : c.shortfall > 5 ? 'text-yellow-400' : 'text-slate-300'}`}>
                      {c.shortfall.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-600">
                <td className="pt-3 text-slate-300 font-semibold" colSpan={2}>Total</td>
                <td className="pt-3 text-right font-bold" style={{ color: scenario.color }}>
                  {fmt(scenario.totalBadDebt)}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
            <h3 className="text-white font-semibold mb-3">Aave DAO Treasury Coverage</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Total DAO treasury',      value: '$181M',   color: 'text-white' },
                { label: 'ETH-correlated holdings', value: '$62M',    color: 'text-blue-400' },
                { label: 'AAVE tokens',              value: '$54M',    color: 'text-purple-400' },
                { label: 'Stablecoins',              value: '$52M',    color: 'text-green-400' },
                { label: 'Umbrella WETH module',     value: '$54.06M', color: 'text-yellow-400' },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-1 border-b border-slate-700/40 last:border-0">
                  <span className="text-slate-400">{r.label}</span>
                  <span className={`font-medium ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-lg p-5 border ${selected === 's1' ? 'bg-yellow-950/20 border-yellow-800/40' : 'bg-red-950/20 border-red-800/40'}`}>
            <h3 className="text-white font-semibold mb-2">Net Position After Coverage</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Total bad debt</span>
                <span className="text-white font-medium">{fmt(scenario.totalBadDebt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Umbrella coverage</span>
                <span className={scenario.umbrellaActivated ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                  {scenario.umbrellaActivated ? `-${fmt(scenario.umbrellaAmount)}` : '$0 (not activated)'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span className="text-slate-300 font-semibold">Net residual</span>
                <span className="font-bold text-lg" style={{ color: scenario.color }}>
                  {fmt(scenario.netAfterUmbrella)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-xs text-slate-400 leading-relaxed">
            <span className="text-slate-300 font-medium">Resolution dependency:</span> The outcome hinges entirely on
            how KelpDAO distributes losses across rsETH holders. Scenario 1 spreads pain globally and lets Umbrella
            partially offset damage; Scenario 2 concentrates damage on L2 reserves where Umbrella provides no coverage.
          </div>
        </div>
      </div>
    </div>
  )
}
