import React, { useState } from 'react'
import { hackData, type ImpactLevel } from '../data'

const fmt = (n: number) => n >= 1e9 ? `$${(n / 1e9).toFixed(1)}B` : `$${(n / 1e6).toFixed(0)}M`

const IMPACT_STYLES: Record<ImpactLevel, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-red-900/30',    text: 'text-red-400',    border: 'border-red-800/50' },
  Medium:   { bg: 'bg-yellow-900/30', text: 'text-yellow-400', border: 'border-yellow-800/50' },
  Low:      { bg: 'bg-slate-700/50',  text: 'text-slate-400',  border: 'border-slate-600' },
  None:     { bg: 'bg-green-900/30',  text: 'text-green-400',  border: 'border-green-800/50' },
}

function ImpactBadge({ impact }: { impact: ImpactLevel }) {
  const s = IMPACT_STYLES[impact]
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${s.bg} ${s.text} ${s.border}`}>
      {impact}
    </span>
  )
}

export default function HackSummary() {
  const [mechExpanded, setMechExpanded] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-950/40 rounded-lg p-4 border border-red-800/50">
          <div className="text-red-400 text-xs uppercase tracking-wide font-medium mb-1">Stolen</div>
          <div className="text-red-300 text-2xl font-bold">$292M</div>
          <div className="text-red-500 text-xs">116,500 rsETH (18% of supply)</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-1">DeFi TVL Wiped</div>
          <div className="text-white text-2xl font-bold">{fmt(hackData.defiTVLDrop)}</div>
          <div className="text-slate-500 text-xs">across all protocols</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-1">Aave TVL Drop</div>
          <div className="text-white text-2xl font-bold">{fmt(hackData.aaveTVLDrop)}</div>
          <div className="text-slate-500 text-xs">in 24 hours post-exploit</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-1">Arbitrum Frozen</div>
          <div className="text-white text-2xl font-bold">{fmt(hackData.arbFrozenUSD)}</div>
          <div className="text-slate-500 text-xs">by Arbitrum Security Council</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-white font-semibold mb-4">Timeline</h2>
          <div className="relative">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-700" />
            <div className="space-y-4">
              {hackData.timeline.map((item, i) => (
                <div key={i} className="flex gap-4 pl-6 relative">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center">
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-red-400' : i < 4 ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-mono mb-0.5">{item.time}</div>
                    <div className="text-slate-200 text-sm">{item.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">Attack Mechanism</h2>
              <button
                onClick={() => setMechExpanded(e => !e)}
                className="text-blue-400 text-xs hover:text-blue-300"
              >
                {mechExpanded ? 'Show less' : 'Show all steps'}
              </button>
            </div>
            <div className="space-y-3">
              {(mechExpanded ? hackData.mechanism : hackData.mechanism.slice(0, 2)).map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-700 text-slate-400 text-xs flex items-center justify-center font-mono">
                    {i + 1}
                  </span>
                  <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-red-950/30 border border-red-800/40 rounded-lg">
              <p className="text-red-300 text-xs font-medium">Root cause: 1/1 validator config</p>
              <p className="text-red-400/70 text-xs mt-0.5">
                A single verifier node is enough to approve any cross-chain message. No second check — one compromise = full bridge control.
              </p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-white font-semibold mb-3">Attribution</h2>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-900/40 border border-red-800/50 flex items-center justify-center flex-shrink-0">
                <span className="text-red-400 text-sm">⚠</span>
              </div>
              <div>
                <p className="text-slate-200 text-sm font-medium">Lazarus Group — TraderTraitor subunit</p>
                <p className="text-slate-400 text-xs mt-0.5">North Korea (DPRK) state-sponsored threat actor</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              LayerZero attributed the attack with preliminary confidence. The TraderTraitor unit is known for targeting
              DeFi infrastructure, developer tooling, and RPC node operators via sophisticated supply-chain compromises.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-white font-semibold mb-3">Affected Protocols</h2>
            <div className="space-y-2">
              {hackData.affectedProtocols.map(p => (
                <div key={p.name} className="flex items-center justify-between py-1.5 border-b border-slate-700/50 last:border-0">
                  <span className="text-slate-200 text-sm">{p.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs">{p.badDebt}</span>
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
