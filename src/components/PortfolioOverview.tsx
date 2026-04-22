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
}

function MetricCard({ label, value, sub, valueClass = 'text-white' }: MetricCardProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-2xl font-bold ${valueClass}`}>{value}</div>
      {sub && <div className="text-slate-500 text-xs mt-0.5">{sub}</div>}
    </div>
  )
}

interface TooltipEntry {
  payload: TreasuryAllocation
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl text-sm">
      <p className="text-white font-semibold mb-1">{d.name}</p>
      <p className="text-slate-200">{fmt(d.value)}</p>
      <p className="text-slate-400">{d.pct.toFixed(1)}% of treasury</p>
      {d.eth && <p className="text-blue-400">{fmtETH(d.eth)}</p>}
    </div>
  )
}

export default function PortfolioOverview() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Treasury"    value="$820M" sub="as of Q1 2026" />
        <MetricCard label="ETH Holdings"      value="$735M" sub="294,000 ETH"          valueClass="text-blue-400" />
        <MetricCard label="DeFi Deployed"     value="$50M"  sub="6.1% of treasury"     valueClass="text-yellow-400" />
        <MetricCard label="Direct rsETH Held" value="$0"    sub="No direct hack exposure" valueClass="text-green-400" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-white font-semibold mb-1">Treasury Allocation</h2>
          <p className="text-slate-500 text-xs mb-4">Hover segments for detail</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={efTreasury.allocations}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={120}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, i: number) => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {efTreasury.allocations.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={hovered === null || hovered === i ? 1 : 0.4}
                    stroke={hovered === i ? '#fff' : 'transparent'}
                    strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(v: string) => <span className="text-slate-300 text-sm">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-white font-semibold mb-4">Breakdown</h2>
          <div className="space-y-4">
            {efTreasury.allocations.map((a, i) => (
              <div
                key={a.name}
                className={`transition-opacity ${hovered !== null && hovered !== i ? 'opacity-40' : 'opacity-100'}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className="flex items-center gap-2 text-slate-200 text-sm font-medium">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: a.color }} />
                    {a.name}
                  </span>
                  <span className="text-white text-sm font-semibold">{fmt(a.value)}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${a.pct}%`, backgroundColor: a.color }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-0.5 text-slate-500">
                  <span>{a.pct.toFixed(1)}%</span>
                  <span>{fmtETH(a.eth)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <h3 className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-2">Context</h3>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>• EF committed up to 50,000 ETH to DeFi as part of its June 2025 treasury policy overhaul ("DeFiPunk" framework)</li>
              <li>• Solo staking of 70,000 ETH began February 2026 — separate sleeve, not exposed to lending protocol risk</li>
              <li>• Annual opex target: 15% of treasury (~$123M) with a 2.5-year fiat runway</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
