import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { efTreasury, type DefiPosition, type ProtocolStatus } from '../data'

const fmt = (n: number) => `$${(n / 1e6).toFixed(1)}M`
const fmtETH = (n: number) => `${n.toLocaleString()} ETH`

const STATUS_STYLES: Record<ProtocolStatus, { bg: string; text: string; border: string }> = {
  safe:    { bg: 'bg-green-900/30',  text: 'text-green-400',  border: 'border-green-800/60' },
  warning: { bg: 'bg-yellow-900/30', text: 'text-yellow-400', border: 'border-yellow-800/60' },
  minor:   { bg: 'bg-orange-900/30', text: 'text-orange-400', border: 'border-orange-800/60' },
}

interface StatusBadgeProps {
  status: ProtocolStatus
  label: string
}

function StatusBadge({ status, label }: StatusBadgeProps) {
  const s = STATUS_STYLES[status]
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
      {label}
    </span>
  )
}

interface TooltipEntry {
  payload: DefiPosition
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm shadow-xl">
      <p className="text-white font-semibold mb-1">{d.protocol}</p>
      <p className="text-slate-300">{fmt(d.usd)}</p>
      <p className="text-blue-400">{fmtETH(d.eth)}</p>
    </div>
  )
}

export default function DeFiBreakdown() {
  const positions = efTreasury.defiPositions

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {positions.map(p => (
          <div key={p.protocol} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex justify-between items-start mb-3">
              <span className="text-white font-semibold">{p.protocol}</span>
              <StatusBadge status={p.status} label={p.statusLabel} />
            </div>
            <div className="text-2xl font-bold text-white mb-0.5">{fmt(p.usd)}</div>
            <div className="text-blue-400 text-sm mb-3">{fmtETH(p.eth)}</div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mb-1">
              <div className="h-1.5 rounded-full" style={{ width: `${p.pctOfDefi}%`, backgroundColor: p.color }} />
            </div>
            <div className="text-slate-500 text-xs">{p.pctOfDefi}% of DeFi allocation</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-white font-semibold mb-4">ETH Deployed by Protocol</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[...positions]} barSize={48}>
              <XAxis dataKey="protocol" tick={{ fill: '#94a3b8', fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v: number) => `${(v / 1e6).toFixed(0)}M`}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="usd" radius={[4, 4, 0, 0]}>
                {positions.map(p => <Cell key={p.protocol} fill={p.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-white font-semibold mb-4">Protocol Risk Assessment</h2>
          <div className="space-y-4">
            {positions.map(p => (
              <div key={p.protocol} className="flex gap-3">
                <div className="w-1 flex-shrink-0 rounded-full self-stretch" style={{ backgroundColor: p.color }} />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-slate-200 text-sm font-medium">{p.protocol}</span>
                    <StatusBadge status={p.status} label={p.statusLabel} />
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{p.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-700 text-xs text-slate-500">
            <p className="mb-1">
              <span className="text-slate-300 font-medium">Total DeFi deployed:</span> 20,000 ETH (~$50M)
            </p>
            <p>
              <span className="text-slate-300 font-medium">% of total treasury:</span> 6.1% — EF deliberately sized this as a modest allocation
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
