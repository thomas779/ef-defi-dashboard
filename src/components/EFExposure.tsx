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
    <div className="bg-ivory border border-cream rounded-lg p-3 text-[12px] shadow-whisper">
      <p className="font-serif font-medium text-near-black mb-1">{d.protocol}</p>
      <p className="font-mono text-charcoal">{fmt(d.loss)} est. loss</p>
    </div>
  )
}

function RiskMeter({ pct, max = 1 }: { pct: number; max?: number }) {
  const fill = Math.min((pct / max) * 100, 100)
  const color = pct === 0 ? '#2A6B4A' : pct < 0.1 ? '#8B5E2A' : '#b53333'
  return (
    <div className="w-full bg-sand rounded-full h-1.5">
      <div
        className="h-1.5 rounded-full transition-all duration-300"
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-success-faint border border-success/25 rounded-lg p-5 relative overflow-hidden shadow-whisper">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-success" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-success/70 uppercase mb-2">Direct rsETH Exposure</div>
            <div className="font-serif text-2xl font-medium text-success">$0</div>
            <div className="font-sans text-[11px] text-success/60 mt-1">EF held no rsETH</div>
          </div>
        </div>
        <div className="bg-ivory border border-cream rounded-lg p-5 relative overflow-hidden shadow-whisper">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-brand" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase mb-2">DeFi Deployed</div>
            <div className="font-serif text-2xl font-medium text-near-black">$50M</div>
            <div className="font-sans text-[11px] text-stone mt-1">6.1% of $820M treasury</div>
          </div>
        </div>
        <div className="bg-warn-faint border border-warn/25 rounded-lg p-5 relative overflow-hidden shadow-whisper">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-warn" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-warn/70 uppercase mb-2">Estimated Indirect Loss</div>
            <div className="font-serif text-2xl font-medium text-warn">{fmt(totalLoss)}</div>
            <div className="font-sans text-[11px] text-warn/60 mt-1">per slider settings</div>
          </div>
        </div>
        <div className="bg-ivory border border-cream rounded-lg p-5 relative overflow-hidden shadow-whisper">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-brand-light" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase mb-2">Treasury Impact</div>
            <div className="font-serif text-2xl font-medium text-near-black">{fmtPct(treasuryImpactPct)}</div>
            <div className="font-sans text-[11px] text-stone mt-1">of $820M total</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
          <div className="brand-bar pl-3 mb-1">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Indirect Exposure Estimator</div>
          </div>
          <p className="font-sans text-[12px] text-silver mb-6 pl-3">
            Adjust the estimated loss % per protocol to model rsETH bad-debt propagation.
          </p>

          <div className="space-y-7">
            {efExposure.protocols.map(p => (
              <div key={p.protocol}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="font-sans text-sm font-medium text-charcoal">{p.protocol}</span>
                    {p.locked && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-success-faint text-success border border-success/25 text-[10px] font-sans font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-success" />
                        Protected
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-sm font-medium text-near-black">
                      {p.locked ? '$0' : fmt((p.deployed * lossPct[p.protocol]) / 100)}
                    </span>
                    <span className="font-sans text-[11px] text-stone ml-1.5">
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
                <div className="flex justify-between font-sans text-[10px] text-silver mt-0.5">
                  <span>0%</span>
                  <span>max {p.maxLossPct}%</span>
                </div>
                <p className="font-sans text-[12px] text-olive mt-2 leading-relaxed">{p.reason}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-cream">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="font-sans text-[11px] font-medium text-stone uppercase tracking-[0.1em]">Total estimated loss</span>
              <span className="font-serif text-lg font-medium text-warn">{fmt(totalLoss)}</span>
            </div>
            <div className="flex justify-between items-baseline mb-3">
              <span className="font-sans text-[12px] text-stone">Treasury impact</span>
              <span className="font-mono text-[12px] text-charcoal">{fmtPct(treasuryImpactPct)}</span>
            </div>
            <RiskMeter pct={treasuryImpactPct} max={1} />
            <div className="font-sans text-[11px] text-silver mt-1.5">Scale: 0% → 1% of treasury</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
            <div className="brand-bar pl-3 mb-5">
              <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Estimated Loss by Protocol</div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={52}>
                <XAxis dataKey="protocol" tick={{ fill: '#87867f', fontSize: 12, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(v: number) =>
                    v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${(v / 1e3).toFixed(0)}K`
                  }
                  tick={{ fill: '#b0aea5', fontSize: 11, fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(27,54,93,0.04)' }} />
                <Bar dataKey="loss" radius={[3, 3, 0, 0]}>
                  {chartData.map(d => <Cell key={d.protocol} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
            <div className="brand-bar pl-3 mb-5">
              <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Why EF Was Relatively Protected</div>
            </div>
            <div className="space-y-0">
              {PROTECTION_ITEMS.map((item, i) => (
                <div key={item.title} className={`flex gap-3 py-3.5 ${i < PROTECTION_ITEMS.length - 1 ? 'border-b border-cream' : ''}`}>
                  <div className="flex-shrink-0 w-[2px] bg-success/40 self-stretch rounded-full" />
                  <div>
                    <p className="font-sans text-[13px] font-medium text-charcoal mb-0.5">{item.title}</p>
                    <p className="font-sans text-[12px] text-olive leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-parchment border border-cream rounded-lg p-4 font-sans text-[12px] text-olive leading-relaxed">
            <span className="font-medium text-charcoal">Disclaimer:</span> All indirect exposure figures are estimates. Without on-chain forensics of each protocol's vault configuration and rsETH utilisation at time of exploit, exact EF losses cannot be determined. Figures will be revised as Morpho and Compound incident reports are published.
          </div>
        </div>
      </div>
    </div>
  )
}
