import React from 'react'

export default function Header() {
  return (
    <header className="bg-void border-b border-edge">
      {/* Thin amber accent line at very top */}
      <div className="h-px bg-gradient-to-r from-gold via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-mono tracking-[0.25em] text-gold/70 uppercase">
              Ethereum Foundation
            </span>
            <span className="text-edge">·</span>
            <span className="text-[9px] font-mono tracking-[0.25em] text-dim uppercase">
              Treasury Intelligence
            </span>
          </div>
          <h1 className="font-display text-xl font-700 text-bright tracking-tight leading-none">
            DeFi Exposure Dashboard
          </h1>
          <p className="font-mono text-[11px] text-dim mt-1.5 tracking-wide">
            KelpDAO / LayerZero rsETH Exploit · 18 April 2026 · $292M stolen
          </p>
        </div>

        <div className="flex items-center gap-6 flex-shrink-0 pt-0.5">
          {/* Exploit status */}
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-crim animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.2em] text-crim uppercase">
                Exploit Active
              </span>
            </div>
            <div className="font-mono text-[9px] tracking-widest text-dim uppercase">
              Largest DeFi Hack of 2026
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-edge" />

          {/* EF status */}
          <div className="text-right">
            <div className="font-mono text-[9px] tracking-[0.18em] text-dim uppercase mb-1">EF Direct Exposure</div>
            <div className="font-mono text-lg font-medium text-jade glow-jade">$0</div>
          </div>
        </div>
      </div>
    </header>
  )
}
