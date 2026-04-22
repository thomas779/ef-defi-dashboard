import React, { useState } from 'react'
import { hackData, type ImpactLevel } from '../data'

const fmt = (n: number) => n >= 1e9 ? `$${(n / 1e9).toFixed(1)}B` : `$${(n / 1e6).toFixed(0)}M`

const IMPACT: Record<ImpactLevel, { bg: string; text: string; border: string; dot: string }> = {
  Critical: { bg: 'bg-[#1A0808]', text: 'text-crim',   border: 'border-crim/25',   dot: 'bg-crim' },
  Medium:   { bg: 'bg-[#1A1000]', text: 'text-amber',  border: 'border-amber/25',  dot: 'bg-amber' },
  Low:      { bg: 'bg-[#0C0C14]', text: 'text-muted',  border: 'border-rim',       dot: 'bg-muted' },
  None:     { bg: 'bg-[#061510]', text: 'text-jade',   border: 'border-jade/25',   dot: 'bg-jade' },
}

function ImpactBadge({ impact }: { impact: ImpactLevel }) {
  const s = IMPACT[impact]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[9px] font-mono tracking-[0.12em] uppercase border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1 h-1 rounded-full ${s.dot}`} />
      {impact}
    </span>
  )
}

const TIMELINE_COLORS = ['#E03030', '#E03030', '#D4850A', '#D4850A', '#C8942A', '#4A8EC4', '#4A8EC4', '#0DD88A']

export default function HackSummary() {
  const [mechExpanded, setMechExpanded] = useState(false)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-panel border border-crim/30 rounded-sm p-5 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-crim" />
          <div className="text-[9px] font-mono tracking-[0.22em] text-crim/70 uppercase mb-3 pl-1">Stolen</div>
          <div className="text-3xl font-mono font-medium text-crim glow-crim pl-1">$292M</div>
          <div className="font-mono text-[10px] text-dim mt-1 pl-1">116,500 rsETH · 18% of supply</div>
        </div>
        <div className="bg-panel border border-edge rounded-sm p-5 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-amber" />
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-3 pl-1">DeFi TVL Wiped</div>
          <div className="text-3xl font-mono font-medium text-bright pl-1">{fmt(hackData.defiTVLDrop)}</div>
          <div className="font-mono text-[10px] text-dim mt-1 pl-1">across all protocols</div>
        </div>
        <div className="bg-panel border border-edge rounded-sm p-5 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-steel" />
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-3 pl-1">Aave TVL Drop</div>
          <div className="text-3xl font-mono font-medium text-bright pl-1">{fmt(hackData.aaveTVLDrop)}</div>
          <div className="font-mono text-[10px] text-dim mt-1 pl-1">in 24 h post-exploit</div>
        </div>
        <div className="bg-panel border border-edge rounded-sm p-5 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gold" />
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-3 pl-1">Arbitrum Frozen</div>
          <div className="text-3xl font-mono font-medium text-gold glow-gold pl-1">{fmt(hackData.arbFrozenUSD)}</div>
          <div className="font-mono text-[10px] text-dim mt-1 pl-1">Arbitrum Security Council</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-panel border border-edge rounded-sm p-6">
          <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-5">Exploit Timeline</div>
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-crim via-amber to-jade opacity-30" />
            <div className="space-y-5">
              {hackData.timeline.map((item, i) => (
                <div key={i} className="flex gap-4 pl-6 relative">
                  <div
                    className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center"
                    style={{ borderColor: TIMELINE_COLORS[i] + '60', backgroundColor: TIMELINE_COLORS[i] + '18' }}
                  >
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: TIMELINE_COLORS[i] }} />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-dim mb-0.5">{item.time}</div>
                    <div className="font-sans text-[13px] text-pale leading-snug">{item.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-panel border border-edge rounded-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase">Attack Vector</div>
              <button
                onClick={() => setMechExpanded(e => !e)}
                className="font-mono text-[9px] tracking-[0.15em] uppercase text-steel hover:text-steel/80 transition-colors"
              >
                {mechExpanded ? 'collapse' : 'expand all'}
              </button>
            </div>
            <div className="space-y-4">
              {(mechExpanded ? hackData.mechanism : hackData.mechanism.slice(0, 2)).map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="flex-shrink-0 font-mono text-[9px] text-dim pt-0.5 w-4">{String(i + 1).padStart(2, '0')}</span>
                  <p className="font-sans text-[13px] text-soft leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-[#1A0808] border border-crim/25 rounded-sm">
              <p className="font-mono text-[10px] text-crim uppercase tracking-[0.15em]">Root cause — 1/1 validator config</p>
              <p className="font-mono text-[10px] text-dim mt-1 leading-relaxed">
                A single verifier approval sufficed for any cross-chain message. One node compromise = full bridge control.
              </p>
            </div>
          </div>

          <div className="bg-panel border border-edge rounded-sm p-6">
            <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-4">Attribution</div>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-7 h-7 rounded-sm bg-[#1A0808] border border-crim/25 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-[10px] text-crim">NK</span>
              </div>
              <div>
                <p className="text-pale text-sm font-medium">Lazarus Group — TraderTraitor subunit</p>
                <p className="font-mono text-[10px] text-dim mt-0.5">DPRK state-sponsored · supply-chain TTPs</p>
              </div>
            </div>
            <p className="font-mono text-[10px] text-dim leading-relaxed">
              TraderTraitor is known for targeting DeFi infrastructure, RPC node operators, and developer tooling via sophisticated supply-chain compromise.
            </p>
          </div>

          <div className="bg-panel border border-edge rounded-sm p-6">
            <div className="text-[9px] font-mono tracking-[0.22em] text-dim uppercase mb-4">Affected Protocols</div>
            <div className="space-y-0">
              {hackData.affectedProtocols.map((p, i) => (
                <div
                  key={p.name}
                  className={`flex items-center justify-between py-2.5 ${i < hackData.affectedProtocols.length - 1 ? 'border-b border-edge' : ''}`}
                >
                  <span className="text-pale text-sm">{p.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-dim">{p.badDebt}</span>
                    <ImpactBadge impact={p.impact} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
