import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { efTreasury, type DefiPosition, type ProtocolStatus } from '../data'

const fmt = (n: number) => `$${(n / 1e6).toFixed(1)}M`
const fmtETH = (n: number) => `${n.toLocaleString()} ETH`

const STATUS: Record<ProtocolStatus, { bg: string; text: string; border: string; dot: string }> = {
  safe:    { bg: 'bg-[#061510]', text: 'text-jade',  border: 'border-jade/25',  dot: 'bg-jade' },
  warning: { bg: 'bg-[#1A1000]', text: 'text-amber', border: 'border-amber/25', dot: 'bg-amber' },
  minor:   { bg: 'bg-[#1A0E00]', text: 'text-gold',  border: 'border-gold/25',  dot: 'bg-gold' },
}

function StatusBadge({ status, label }: { status: ProtocolStatus; label: string }) {
  const s = STATUS[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[9px] font-mono tracking-[0.12em] uppercase border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1 h-1 rounded-full ${s.dot}`} />
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
    <div className="bg-ink border border-rim rounded-sm p-3 text-[11px] shadow-2xl">
      <p className="font-display font-600 text-bright mb-1.5">{d.protocol}</p>
      <p className="font-mono text-pale">{fmt(d.usd)}</p>
      <p className="font-mono text-gold">{fmtETH(d.eth)}</p>
    </div>
  )
}

export default function DeFiBreakdown() {
  const positions = efTreasury.defiPositions

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {positions.map(p => (
          <div key={p.protocol} className="bg-panel border border-edge rounded-sm p-5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: p.color }} />
            <div className="flex justify-between items-start mb-4 pl-1">
              <span className="font-display font-600 text-bright text-base">{p.protocol}</span>
              <StatusBadge status={p.status} label={p.statusLabel} />
            </div>
            <div className="font-mono text-2xl font-medium text-bright mb-0.5 pl-1">{fmt(p.usd)}</div>
            <div className="font-mono text-[11px] text-gold mb-4 pl-1">{fmtETH(p.eth)}</div>
            <div className="w-full bg-edge rounded-full h-1 mb-1 ml-1">
              <div className="h-1 rounded-full" style={{ width: `${p.pctOfDefi}%`, backgroundColor: p.color }} />
            </div>
            <div className="font-mono text-[10px] text-dim pl-1">{p.pctOfDefi}% of DeFi allocation</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-panel border border-edge rounded-sm p-6">
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-5">USD Deployed by Protocol</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[...positions]} barSize={44}>
              <XAxis dataKey="protocol" tick={{ fill: '#68688A', fontSize: 12, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v: number) => `$${(v / 1e6).toFixed(0)}M`}
                tick={{ fill: '#44445E', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200,148,42,0.04)' }} />
              <Bar dataKey="usd" radius={[2, 2, 0, 0]}>
                {positions.map(p => <Cell key={p.protocol} fill={p.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-panel border border-edge rounded-sm p-6">
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-5">Risk Assessment</div>
          <div className="space-y-5">
            {positions.map(p => (
              <div key={p.protocol} className="flex gap-3">
                <div className="w-px flex-shrink-0 self-stretch rounded-full" style={{ backgroundColor: p.color }} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-pale text-sm font-medium">{p.protocol}</span>
                    <StatusBadge status={p.status} label={p.statusLabel} />
                  </div>
                  <p className="font-mono text-[10px] text-dim leading-relaxed">{p.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-edge font-mono text-[10px] text-dim space-y-1.5">
            <div><span className="text-soft">Total DeFi deployed:</span> 20,000 ETH (~$50M)</div>
            <div><span className="text-soft">% of treasury:</span> 6.1% — deliberately modest sizing</div>
          </div>
        </div>
      </div>
    </div>
  )
}
