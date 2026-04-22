import React, { useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { efTreasury, type TreasuryAllocation } from '../data'

const fmt = (n: number) => n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : `$${(n / 1e6).toFixed(0)}M`
const fmtETH = (n: number | null) => n ? `${n.toLocaleString()} ETH` : '—'

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  valueColor?: string
  accentColor?: string
}

function MetricCard({ label, value, sub, valueColor = '#1B365D', accentColor = '#1B365D' }: MetricCardProps) {
  return (
    <div className="bg-ivory border border-cream rounded-lg p-5 relative overflow-hidden shadow-whisper">
      <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full" style={{ backgroundColor: accentColor }} />
      <div className="pl-4">
        <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase mb-3">{label}</div>
        <div className="font-serif text-2xl font-medium leading-none" style={{ color: valueColor }}>{value}</div>
        {sub && <div className="font-sans text-[11px] text-stone mt-1.5">{sub}</div>}
      </div>
    </div>
  )
}

interface TooltipEntry { payload: TreasuryAllocation }
interface CustomTooltipProps { active?: boolean; payload?: TooltipEntry[] }

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-ivory border border-cream rounded-lg p-3 text-[12px] shadow-whisper">
      <p className="font-serif font-medium text-near-black mb-1">{d.name}</p>
      <p className="font-mono text-charcoal">{fmt(d.value)}</p>
      <p className="font-sans text-stone text-[11px]">{d.pct.toFixed(1)}% of treasury</p>
      {d.eth && <p className="font-mono text-brand text-[11px] mt-0.5">{fmtETH(d.eth)}</p>}
    </div>
  )
}

export default function PortfolioOverview() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Treasury"    value="$820M"  sub="as of Q1 2026"           accentColor="#1B365D" />
        <MetricCard label="ETH Holdings"      value="$735M"  sub="294,000 ETH"              accentColor="#2D5A8A" valueColor="#2D5A8A" />
        <MetricCard label="DeFi Deployed"     value="$50M"   sub="6.1% of treasury"         accentColor="#8B5E2A" valueColor="#8B5E2A" />
        <MetricCard label="Direct rsETH Held" value="$0"     sub="No direct hack exposure"  accentColor="#2A6B4A" valueColor="#2A6B4A" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
          <div className="brand-bar pl-3 mb-1">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Treasury Allocation</div>
          </div>
          <div className="font-sans text-[11px] text-silver mb-5 pl-3">hover segments for detail</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={efTreasury.allocations}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={115}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(_, i: number) => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {efTreasury.allocations.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={hovered === null || hovered === i ? 1 : 0.2}
                    stroke={hovered === i ? entry.color : '#e8e5da'}
                    strokeWidth={hovered === i ? 2 : 1}
                    style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(v: string) => (
                  <span className="font-sans text-[11px] text-olive">{v}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
          <div className="brand-bar pl-3 mb-6">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Breakdown</div>
          </div>
          <div className="space-y-5">
            {efTreasury.allocations.map((a, i) => (
              <div
                key={a.name}
                className="transition-opacity duration-150"
                style={{ opacity: hovered !== null && hovered !== i ? 0.3 : 1 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex justify-between items-baseline mb-2">
                  <span className="flex items-center gap-2 font-sans text-sm text-charcoal">
                    <span className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                    {a.name}
                  </span>
                  <span className="font-serif text-sm font-medium text-near-black">{fmt(a.value)}</span>
                </div>
                <div className="w-full bg-sand rounded-full h-1">
                  <div
                    className="h-1 rounded-full transition-all duration-300"
                    style={{ width: `${a.pct}%`, backgroundColor: a.color }}
                  />
                </div>
                <div className="flex justify-between font-sans text-[11px] mt-1 text-stone">
                  <span>{a.pct.toFixed(1)}%</span>
                  <span className="font-mono text-[10px]">{fmtETH(a.eth)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-cream">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase mb-3">Context</div>
            <ul className="space-y-2.5 font-sans text-[12px] text-olive leading-relaxed">
              <li className="flex gap-2.5">
                <span className="text-brand mt-0.5 flex-shrink-0">–</span>
                EF committed up to 50,000 ETH to DeFi as part of its June 2025 "DeFiPunk" treasury overhaul
              </li>
              <li className="flex gap-2.5">
                <span className="text-brand mt-0.5 flex-shrink-0">–</span>
                Solo staking of 70,000 ETH started February 2026; separate sleeve, not lending-protocol risk
              </li>
              <li className="flex gap-2.5">
                <span className="text-brand mt-0.5 flex-shrink-0">–</span>
                Annual opex target: 15% of treasury (~$123M) with 2.5-year fiat runway
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
