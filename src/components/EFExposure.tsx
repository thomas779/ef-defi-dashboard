import React, { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
} from 'recharts'
import { efExposure, efTreasury, type ExposureProtocol } from '../data'

const fmt = (n: number): string => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}
const fmtPct = (n: number) => `${n.toFixed(3)}%`

const STATUS_COLORS: Record<ExposureProtocol['status'], string> = {
  safe:    '#10B981',
  warning: '#F59E0B',
  minor:   '#F97316',
}

interface ChartDatum {
  protocol: string
  loss: number
  color: string
}

function RiskMeter({ pct, max = 1 }: { pct: number; max?: number }) {
  const fill = Math.min((pct / max) * 100, 100)
  const color = pct === 0 ? '#10B981' : pct < 0.1 ? '#F59E0B' : '#EF4444'
  return (
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all duration-300"
        style={{ width: `${fill}%`, backgroundColor: color }}
      />
    </div>
  )
}

interface ComputedProtocol extends ExposureProtocol {
  estimatedLoss: number
}

export default function EFExposure() {
  const [lossPct, setLossPct] = useState<Record<string, number>>(() =>
    Object.fromEntries(efExposure.protocols.map(p => [p.protocol, p.defaultPct]))
  )

  const computed = useMemo<ComputedProtocol[]>(() =>
    efExposure.protocols.map(p => ({
      ...p,
      estimatedLoss: p.locked ? 0 : (p.deployed * lossPct[p.protocol]) / 100,
    })),
    [lossPct]
  )

  const totalLoss = computed.reduce((s, p) => s + p.estimatedLoss, 0)
  const treasuryImpactPct = (totalLoss / efTreasury.totalAssets) * 100

  const chartData: ChartDatum[] = computed.map(p => ({
    protocol: p.protocol,
    loss: p.estimatedLoss,
    color: STATUS_COLORS[p.status],
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-950/30 rounded-lg p-4 border border-green-800/50">
          <div className="text-green-400 text-xs uppercase tracking-wide font-medium mb-1">Direct rsETH Exposure</div>
          <div className="text-green-300 text-2xl font-bold">$0</div>
          <div className="text-green-600 text-xs">EF held no rsETH</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-1">DeFi Deployed (total)</div>
          <div className="text-white text-2xl font-bold">$50M</div>
          <div className="text-slate-500 text-xs">6.1% of $820M treasury</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-1">Estimated Indirect Loss</div>
          <div className="text-yellow-400 text-2xl font-bold">{fmt(totalLoss)}</div>
          <div className="text-slate-500 text-xs">based on slider settings</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-1">Treasury Impact</div>
          <div className="text-white text-2xl font-bold">{fmtPct(treasuryImpactPct)}</div>
          <div className="text-slate-500 text-xs">of $820M total</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-white font-semibold mb-1">Indirect Exposure Estimator</h2>
          <p className="text-slate-500 text-xs mb-5">
            Adjust the estimated loss percentage for each protocol to model how rsETH bad debt propagates through their vault architecture.
          </p>

          <div className="space-y-6">
            {efExposure.protocols.map(p => (
              <div key={p.protocol}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[p.status] }} />
                    <span className="text-slate-200 text-sm font-medium">{p.protocol}</span>
                    {p.locked && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-green-900/40 text-green-400 border border-green-800/40">
                        Protected
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-white text-sm font-semibold">
                      {p.locked ? '$0' : fmt((p.deployed * lossPct[p.protocol]) / 100)}
                    </span>
                    <span className="text-slate-500 text-xs ml-1">
                      ({p.locked ? '0' : lossPct[p.protocol].toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={p.maxLossPct}
                  step={0.1}
                  value={p.locked ? 0 : lossPct[p.protocol]}
                  disabled={p.locked}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLossPct(prev => ({ ...prev, [p.protocol]: parseFloat(e.target.value) }))
                  }
                  className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ accentColor: STATUS_COLORS[p.status] }}
                />
                <div className="flex justify-between text-xs text-slate-600 mt-0.5">
                  <span>0%</span>
                  <span>max {p.maxLossPct}%</span>
                </div>
                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{p.reason}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 font-semibold">Total estimated loss</span>
              <span className="text-yellow-400 font-bold text-lg">{fmt(totalLoss)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-400 text-sm">Treasury impact</span>
              <span className="text-slate-300 text-sm font-medium">{fmtPct(treasuryImpactPct)}</span>
            </div>
            <RiskMeter pct={treasuryImpactPct} max={1} />
            <p className="text-slate-600 text-xs mt-1">Scale: 0% → 1% of treasury</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-white font-semibold mb-4">Estimated Loss by Protocol</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={52}>
                <XAxis dataKey="protocol" tick={{ fill: '#94a3b8', fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(v: number) =>
                    v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${(v / 1e3).toFixed(0)}K`
                  }
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v: number) => [fmt(v), 'Est. loss']}
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#f1f5f9', fontWeight: 600 }}
                />
                <Bar dataKey="loss" radius={[4, 4, 0, 0]}>
                  {chartData.map(d => <Cell key={d.protocol} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-white font-semibold mb-4">Why EF Was Relatively Protected</h2>
            <div className="space-y-3">
              {[
                {
                  title: 'No direct rsETH holdings',
                  desc: 'EF treasury policy requires "battle-tested, immutable" protocols — KelpDAO did not meet the bar.',
                },
                {
                  title: "Spark's proactive risk management",
                  desc: "Spark delisted rsETH as collateral in January 2026, three months before the exploit. EF's largest DeFi position ($25M) was shielded.",
                },
                {
                  title: 'Supply-side ETH, not rsETH collateral',
                  desc: "EF's Morpho and Compound positions are ETH/WETH supply. Exposure depends on whether those vaults absorbed rsETH-backed bad debt.",
                },
                {
                  title: 'Conservative 6.1% DeFi allocation',
                  desc: 'Even a total DeFi sleeve loss ($50M) would reduce EF treasury by only 6.1% — within its stated risk tolerance.',
                },
              ].map(item => (
                <div key={item.title} className="flex gap-3 p-3 rounded-lg bg-green-900/20">
                  <span className="font-bold text-green-400 mt-0.5">✓</span>
                  <div>
                    <p className="text-slate-200 text-sm font-medium">{item.title}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-xs text-slate-400 leading-relaxed">
            <span className="text-slate-300 font-medium">Disclaimer: </span>
            All indirect exposure figures are estimates. Without on-chain forensics of each protocol's specific vault
            configuration and rsETH utilisation at time of exploit, exact EF losses cannot be determined. Figures will
            be revised as Morpho and Compound incident reports are published.
          </div>
        </div>
      </div>
    </div>
  )
}
