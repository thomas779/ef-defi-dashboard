import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { efTreasury, type DefiPosition, type ProtocolStatus } from '../data'

const fmt = (n: number) => `$${(n / 1e6).toFixed(1)}M`
const fmtETH = (n: number) => `${n.toLocaleString()} ETH`

const STATUS: Record<ProtocolStatus, { bg: string; text: string; border: string; dot: string }> = {
  safe:    { bg: 'bg-success-faint', text: 'text-success', border: 'border-success/30', dot: 'bg-success' },
  warning: { bg: 'bg-warn-faint',    text: 'text-warn',    border: 'border-warn/30',    dot: 'bg-warn' },
  minor:   { bg: 'bg-brand-faint',   text: 'text-brand',   border: 'border-brand/30',   dot: 'bg-brand' },
}

function StatusBadge({ status, label }: { status: ProtocolStatus; label: string }) {
  const s = STATUS[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-sans font-medium border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  )
}

interface TooltipEntry { payload: DefiPosition }
interface CustomTooltipProps { active?: boolean; payload?: TooltipEntry[] }

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-ivory border border-cream rounded-lg p-3 text-[12px] shadow-whisper">
      <p className="font-serif font-medium text-near-black mb-1">{d.protocol}</p>
      <p className="font-mono text-charcoal">{fmt(d.usd)}</p>
      <p className="font-mono text-[11px] text-brand">{fmtETH(d.eth)}</p>
    </div>
  )
}

export default function DeFiBreakdown() {
  const positions = efTreasury.defiPositions

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {positions.map(p => (
          <div key={p.protocol} className="bg-ivory border border-cream rounded-lg p-5 relative overflow-hidden shadow-whisper">
            <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full" style={{ backgroundColor: p.color }} />
            <div className="flex justify-between items-start mb-4 pl-4">
              <span className="font-serif text-base font-medium text-near-black">{p.protocol}</span>
              <StatusBadge status={p.status} label={p.statusLabel} />
            </div>
            <div className="font-serif text-2xl font-medium text-near-black mb-0.5 pl-4">{fmt(p.usd)}</div>
            <div className="font-mono text-[11px] mb-4 pl-4" style={{ color: p.color }}>{fmtETH(p.eth)}</div>
            <div className="w-full bg-sand rounded-full h-1 mb-1.5 ml-4" style={{ width: 'calc(100% - 1rem)' }}>
              <div className="h-1 rounded-full" style={{ width: `${p.pctOfDefi}%`, backgroundColor: p.color }} />
            </div>
            <div className="font-sans text-[11px] text-stone pl-4">{p.pctOfDefi}% of DeFi allocation</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
          <div className="brand-bar pl-3 mb-6">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">USD Deployed by Protocol</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[...positions]} barSize={52}>
              <XAxis dataKey="protocol" tick={{ fill: '#87867f', fontSize: 12, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v: number) => `$${(v / 1e6).toFixed(0)}M`}
                tick={{ fill: '#b0aea5', fontSize: 11, fontFamily: 'Inter' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(27,54,93,0.04)' }} />
              <Bar dataKey="usd" radius={[3, 3, 0, 0]}>
                {positions.map(p => <Cell key={p.protocol} fill={p.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
          <div className="brand-bar pl-3 mb-6">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Risk Assessment</div>
          </div>
          <div className="space-y-5">
            {positions.map(p => (
              <div key={p.protocol} className="flex gap-3">
                <div className="w-[2.5px] flex-shrink-0 self-stretch rounded-full" style={{ backgroundColor: p.color }} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-sans text-sm font-medium text-charcoal">{p.protocol}</span>
                    <StatusBadge status={p.status} label={p.statusLabel} />
                  </div>
                  <p className="font-sans text-[12px] text-olive leading-relaxed">{p.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-cream font-sans text-[12px] text-olive space-y-1.5">
            <div><span className="text-charcoal font-medium">Total DeFi deployed:</span> 20,000 ETH (~$50M)</div>
            <div><span className="text-charcoal font-medium">% of treasury:</span> 6.1% — deliberately modest sizing</div>
          </div>
        </div>
      </div>
    </div>
  )
}
