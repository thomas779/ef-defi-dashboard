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
  valueClass?: string
  glowClass?: string
  accent?: string
}

function MetricCard({ label, value, sub, valueClass = 'text-bright', glowClass, accent }: MetricCardProps) {
  return (
    <div className="bg-panel border border-edge rounded-sm p-5 relative overflow-hidden">
      {accent && <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: accent }} />}
      <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-3 pl-1">{label}</div>
      <div className={`text-3xl font-mono font-medium pl-1 ${valueClass} ${glowClass ?? ''}`}>{value}</div>
      {sub && <div className="text-[10px] font-mono text-dim mt-1 pl-1">{sub}</div>}
    </div>
  )
}

interface TooltipEntry { payload: TreasuryAllocation }
interface CustomTooltipProps { active?: boolean; payload?: TooltipEntry[] }

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-ink border border-rim rounded-sm p-3 text-[11px] shadow-2xl">
      <p className="font-display font-600 text-bright mb-1.5">{d.name}</p>
      <p className="font-mono text-pale">{fmt(d.value)}</p>
      <p className="font-mono text-dim">{d.pct.toFixed(1)}% of treasury</p>
      {d.eth && <p className="font-mono text-gold mt-0.5">{fmtETH(d.eth)}</p>}
    </div>
  )
}

export default function PortfolioOverview() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Treasury"    value="$820M" sub="as of Q1 2026"           accent="#C8942A" />
        <MetricCard label="ETH Holdings"      value="$735M" sub="294,000 ETH"              accent="#C8942A" valueClass="text-gold" glowClass="glow-gold" />
        <MetricCard label="DeFi Deployed"     value="$50M"  sub="6.1% of treasury"         accent="#4A8EC4" valueClass="text-steel" />
        <MetricCard label="Direct rsETH Held" value="$0"    sub="No direct hack exposure"  accent="#0DD88A" valueClass="text-jade" glowClass="glow-jade" />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Pie chart */}
        <div className="bg-panel border border-edge rounded-sm p-6">
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-1">Treasury Allocation</div>
          <div className="text-[10px] font-mono text-dim/60 mb-4">hover segments for detail</div>
          <ResponsiveContainer width="100%" height={290}>
            <PieChart>
              <Pie
                data={efTreasury.allocations}
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={118}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(_, i: number) => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {efTreasury.allocations.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={hovered === null || hovered === i ? 1 : 0.25}
                    stroke={hovered === i ? entry.color : '#18182A'}
                    strokeWidth={hovered === i ? 2 : 1}
                    style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(v: string) => (
                  <span className="font-mono text-[10px] text-soft tracking-wide">{v}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown table */}
        <div className="bg-panel border border-edge rounded-sm p-6">
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-5">Breakdown</div>
          <div className="space-y-5">
            {efTreasury.allocations.map((a, i) => (
              <div
                key={a.name}
                className="transition-opacity duration-150"
                style={{ opacity: hovered !== null && hovered !== i ? 0.3 : 1 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="flex items-center gap-2 text-soft text-sm">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: a.color }} />
                    {a.name}
                  </span>
                  <span className="font-mono text-sm text-bright">{fmt(a.value)}</span>
                </div>
                <div className="w-full bg-edge rounded-full h-1">
                  <div
                    className="h-1 rounded-full transition-all duration-300"
                    style={{ width: `${a.pct}%`, backgroundColor: a.color }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono mt-1 text-dim">
                  <span>{a.pct.toFixed(1)}%</span>
                  <span>{fmtETH(a.eth)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-edge">
            <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-3">Context</div>
            <ul className="space-y-2 text-[11px] font-mono text-dim leading-relaxed">
              <li className="flex gap-2"><span className="text-gold/40">—</span>EF committed up to 50,000 ETH to DeFi as part of its June 2025 "DeFiPunk" treasury overhaul</li>
              <li className="flex gap-2"><span className="text-gold/40">—</span>Solo staking of 70,000 ETH started February 2026; separate sleeve, not lending-protocol risk</li>
              <li className="flex gap-2"><span className="text-gold/40">—</span>Annual opex target: 15% of treasury (~$123M) with 2.5-year fiat runway</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
