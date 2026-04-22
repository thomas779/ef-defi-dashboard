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

interface ChartDatum {
  protocol: string
  loss: number
  color: string
}

interface TooltipEntry { payload: ChartDatum }
interface CustomTooltipProps { active?: boolean; payload?: TooltipEntry[] }

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-ink border border-rim rounded-sm p-3 text-[11px] shadow-2xl">
      <p className="font-display font-600 text-bright mb-1.5">{d.protocol}</p>
      <p className="font-mono text-pale">{fmt(d.loss)} est. loss</p>
    </div>
  )
}

function RiskMeter({ pct, max = 1 }: { pct: number; max?: number }) {
  const fill = Math.min((pct / max) * 100, 100)
  const color = pct === 0 ? '#0DD88A' : pct < 0.1 ? '#D4850A' : '#E03030'
  return (
    <div className="w-full bg-edge rounded-full h-1">
      <div
        className="h-1 rounded-full transition-all duration-300"
        style={{ width: `${fill}%`, backgroundColor: color }}
      />
    </div>
  )
}

interface ComputedProtocol extends ExposureProtocol {
  estimatedLoss: number
}

const PROTECTION_ITEMS = [
  {
    title: 'No direct rsETH holdings',
    desc: "EF treasury policy requires battle-tested, immutable protocols — KelpDAO didn't meet the bar.",
  },
  {
    title: "Spark's proactive risk management",
    desc: 'Spark delisted rsETH as collateral in January 2026, three months before the exploit, shielding EF\'s largest DeFi position ($25M).',
  },
  {
    title: 'Supply-side ETH, not rsETH collateral',
    desc: "EF's Morpho and Compound positions are ETH/WETH supply. Exposure depends on whether those vaults absorbed rsETH-backed bad debt.",
  },
  {
    title: 'Conservative 6.1% DeFi allocation',
    desc: 'Even a total DeFi sleeve loss ($50M) would reduce EF treasury by only 6.1% — within stated risk tolerance.',
  },
]

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
    color: p.color,
  }))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-panel border border-jade/30 rounded-sm p-5 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-jade" />
          <div className="text-[9px] font-mono tracking-[0.22em] text-jade/70 uppercase mb-3 pl-1">Direct rsETH Exposure</div>
          <div className="text-3xl font-mono font-medium text-jade glow-jade pl-1">$0</div>
          <div className="font-mono text-[10px] text-dim mt-1 pl-1">EF held no rsETH</div>
        </div>
        <div className="bg-panel border border-edge rounded-sm p-5 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-steel" />
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-3 pl-1">DeFi Deployed</div>
          <div className="text-3xl font-mono font-medium text-bright pl-1">$50M</div>
          <div className="font-mono text-[10px] text-dim mt-1 pl-1">6.1% of $820M treasury</div>
        </div>
        <div className="bg-panel border border-edge rounded-sm p-5 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-amber" />
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-3 pl-1">Estimated Indirect Loss</div>
          <div className="text-3xl font-mono font-medium text-amber pl-1">{fmt(totalLoss)}</div>
          <div className="font-mono text-[10px] text-dim mt-1 pl-1">per slider settings</div>
        </div>
        <div className="bg-panel border border-edge rounded-sm p-5 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gold" />
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-3 pl-1">Treasury Impact</div>
          <div className="text-3xl font-mono font-medium text-bright pl-1">{fmtPct(treasuryImpactPct)}</div>
          <div className="font-mono text-[10px] text-dim mt-1 pl-1">of $820M total</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-panel border border-edge rounded-sm p-6">
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-1">Indirect Exposure Estimator</div>
          <div className="font-mono text-[10px] text-dim/60 mb-5">
            adjust loss % per protocol to model rsETH bad-debt propagation
          </div>

          <div className="space-y-6">
            {efExposure.protocols.map(p => (
              <div key={p.protocol}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="font-sans text-sm text-pale font-medium">{p.protocol}</span>
                    {p.locked && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-[#061510] text-jade border border-jade/25 text-[9px] font-mono tracking-[0.1em] uppercase">
                        <span className="w-1 h-1 rounded-full bg-jade" />
                        Protected
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm text-bright">
                      {p.locked ? '$0' : fmt((p.deployed * lossPct[p.protocol]) / 100)}
                    </span>
                    <span className="font-mono text-[10px] text-dim ml-1.5">
                      ({p.locked ? '0.0' : lossPct[p.protocol].toFixed(1)}%)
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
                  className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                  style={{ accentColor: p.color }}
                />
                <div className="flex justify-between font-mono text-[10px] text-dim/60 mt-0.5">
                  <span>0%</span>
                  <span>max {p.maxLossPct}%</span>
                </div>
                <p className="font-mono text-[10px] text-dim mt-2 leading-relaxed">{p.reason}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-edge">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="font-mono text-[10px] text-soft uppercase tracking-[0.15em]">Total estimated loss</span>
              <span className="font-mono text-lg font-medium text-amber">{fmt(totalLoss)}</span>
            </div>
            <div className="flex justify-between items-baseline mb-3">
              <span className="font-mono text-[10px] text-dim">Treasury impact</span>
              <span className="font-mono text-[11px] text-soft">{fmtPct(treasuryImpactPct)}</span>
            </div>
            <RiskMeter pct={treasuryImpactPct} max={1} />
            <div className="font-mono text-[10px] text-dim/60 mt-1">Scale: 0% → 1% of treasury</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-panel border border-edge rounded-sm p-6">
            <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-4">Estimated Loss by Protocol</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={52}>
                <XAxis dataKey="protocol" tick={{ fill: '#68688A', fontSize: 12, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(v: number) =>
                    v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${(v / 1e3).toFixed(0)}K`
                  }
                  tick={{ fill: '#44445E', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200,148,42,0.04)' }} />
                <Bar dataKey="loss" radius={[2, 2, 0, 0]}>
                  {chartData.map(d => <Cell key={d.protocol} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-panel border border-edge rounded-sm p-6">
            <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-4">Why EF Was Relatively Protected</div>
            <div className="space-y-0">
              {PROTECTION_ITEMS.map((item, i) => (
                <div key={item.title} className={`flex gap-3 py-3.5 ${i < PROTECTION_ITEMS.length - 1 ? 'border-b border-edge' : ''}`}>
                  <div className="flex-shrink-0 w-px bg-jade/40 self-stretch rounded-full" />
                  <div>
                    <p className="text-pale text-[13px] font-medium mb-0.5">{item.title}</p>
                    <p className="font-mono text-[10px] text-dim leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-panel border border-edge rounded-sm p-4 font-mono text-[10px] text-dim leading-relaxed">
            <span className="text-soft">Disclaimer:</span> All indirect exposure figures are estimates. Without on-chain forensics of each protocol's vault configuration and rsETH utilisation at time of exploit, exact EF losses cannot be determined. Figures will be revised as Morpho and Compound incident reports are published.
          </div>
        </div>
      </div>
    </div>
  )
}
