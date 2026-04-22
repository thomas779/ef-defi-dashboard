import React, { useState } from 'react'
import { hackData, type ImpactLevel } from '../data'

const fmt = (n: number) => n >= 1e9 ? `$${(n / 1e9).toFixed(1)}B` : `$${(n / 1e6).toFixed(0)}M`

const IMPACT: Record<ImpactLevel, { bg: string; text: string; border: string; dot: string }> = {
  Critical: { bg: 'bg-error-faint', text: 'text-error', border: 'border-error/30', dot: 'bg-error' },
  Medium:   { bg: 'bg-warn-faint',  text: 'text-warn',  border: 'border-warn/30',  dot: 'bg-warn' },
  Low:      { bg: 'bg-parchment',   text: 'text-stone',  border: 'border-cream',    dot: 'bg-silver' },
  None:     { bg: 'bg-success-faint', text: 'text-success', border: 'border-success/30', dot: 'bg-success' },
}

function ImpactBadge({ impact }: { impact: ImpactLevel }) {
  const s = IMPACT[impact]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-sans font-medium border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {impact}
    </span>
  )
}

const TIMELINE_SEVERITY = ['error', 'error', 'error', 'warn', 'warn', 'brand', 'brand', 'success'] as const
const SEVERITY_COLORS: Record<string, string> = {
  error:   '#b53333',
  warn:    '#8B5E2A',
  brand:   '#1B365D',
  success: '#2A6B4A',
}

export default function HackSummary() {
  const [mechExpanded, setMechExpanded] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-error-faint border border-error/25 rounded-lg p-5 relative overflow-hidden shadow-whisper">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-error" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-error/70 uppercase mb-2">Stolen</div>
            <div className="font-serif text-2xl font-medium text-error">$292M</div>
            <div className="font-sans text-[11px] text-error/60 mt-1">116,500 rsETH · 18% of supply</div>
          </div>
        </div>
        <div className="bg-ivory border border-cream rounded-lg p-5 relative overflow-hidden shadow-whisper">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-warn" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase mb-2">DeFi TVL Wiped</div>
            <div className="font-serif text-2xl font-medium text-near-black">{fmt(hackData.defiTVLDrop)}</div>
            <div className="font-sans text-[11px] text-stone mt-1">across all protocols</div>
          </div>
        </div>
        <div className="bg-ivory border border-cream rounded-lg p-5 relative overflow-hidden shadow-whisper">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-brand" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase mb-2">Aave TVL Drop</div>
            <div className="font-serif text-2xl font-medium text-near-black">{fmt(hackData.aaveTVLDrop)}</div>
            <div className="font-sans text-[11px] text-stone mt-1">in 24 h post-exploit</div>
          </div>
        </div>
        <div className="bg-ivory border border-cream rounded-lg p-5 relative overflow-hidden shadow-whisper">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-brand-light" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase mb-2">Arbitrum Frozen</div>
            <div className="font-serif text-2xl font-medium text-near-black">{fmt(hackData.arbFrozenUSD)}</div>
            <div className="font-sans text-[11px] text-stone mt-1">Arbitrum Security Council</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
          <div className="brand-bar pl-3 mb-6">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Exploit Timeline</div>
          </div>
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-cream" />
            <div className="space-y-5">
              {hackData.timeline.map((item, i) => {
                const color = SEVERITY_COLORS[TIMELINE_SEVERITY[i] ?? 'brand']
                return (
                  <div key={i} className="flex gap-4 pl-6 relative">
                    <div
                      className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center bg-ivory"
                      style={{ borderColor: color + '50' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-stone mb-0.5">{item.time}</div>
                      <div className="font-sans text-[13px] text-charcoal leading-snug">{item.event}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
            <div className="flex items-center justify-between mb-4">
              <div className="brand-bar pl-3">
                <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Attack Vector</div>
              </div>
              <button
                onClick={() => setMechExpanded(e => !e)}
                className="font-sans text-[11px] text-brand hover:text-brand-light transition-colors"
              >
                {mechExpanded ? 'Show less' : 'Show all'}
              </button>
            </div>
            <div className="space-y-4">
              {(mechExpanded ? hackData.mechanism : hackData.mechanism.slice(0, 2)).map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="flex-shrink-0 font-mono text-[11px] text-stone w-5 pt-0.5">{i + 1}.</span>
                  <p className="font-sans text-[13px] text-charcoal leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-error-faint border border-error/20 rounded-lg">
              <p className="font-sans text-[11px] font-medium text-error">Root cause: 1/1 validator config</p>
              <p className="font-sans text-[11px] text-error/70 mt-0.5 leading-relaxed">
                A single verifier approval sufficed for any cross-chain message. One node compromise = full bridge control.
              </p>
            </div>
          </div>

          <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
            <div className="brand-bar pl-3 mb-4">
              <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Attribution</div>
            </div>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-error-faint border border-error/20 flex items-center justify-center flex-shrink-0">
                <span className="font-sans text-[11px] font-medium text-error">NK</span>
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-near-black">Lazarus Group — TraderTraitor subunit</p>
                <p className="font-sans text-[11px] text-stone mt-0.5">DPRK state-sponsored · supply-chain TTPs</p>
              </div>
            </div>
            <p className="font-sans text-[12px] text-olive leading-relaxed">
              TraderTraitor targets DeFi infrastructure, RPC node operators, and developer tooling via sophisticated supply-chain compromise.
            </p>
          </div>

          <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
            <div className="brand-bar pl-3 mb-4">
              <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Affected Protocols</div>
            </div>
            <div className="space-y-0">
              {hackData.affectedProtocols.map((p, i) => (
                <div
                  key={p.name}
                  className={`flex items-center justify-between py-2.5 ${i < hackData.affectedProtocols.length - 1 ? 'border-b border-cream' : ''}`}
                >
                  <span className="font-sans text-sm text-charcoal">{p.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-[11px] text-stone">{p.badDebt}</span>
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
