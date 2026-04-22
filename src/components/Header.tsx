import React from 'react'

export default function Header() {
  return (
    <header className="bg-ivory border-b border-cream shadow-whisper">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-start justify-between gap-8">
        <div className="brand-bar pl-4">
          <div className="text-[10px] font-sans font-500 tracking-[0.18em] text-stone uppercase mb-1.5">
            Ethereum Foundation · Treasury Intelligence
          </div>
          <h1 className="font-serif text-2xl font-medium text-near-black leading-tight">
            DeFi Exposure Dashboard
          </h1>
          <p className="font-sans text-[12px] text-olive mt-1.5">
            KelpDAO / LayerZero rsETH Exploit · 18 April 2026 · $292M stolen
          </p>
        </div>

        <div className="flex items-center gap-7 flex-shrink-0 pt-1">
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
              <span className="font-sans text-[10px] tracking-[0.15em] text-error font-medium uppercase">
                Exploit Active
              </span>
            </div>
            <div className="font-sans text-[10px] tracking-wide text-stone">
              Largest DeFi hack of 2026
            </div>
          </div>

          <div className="w-px h-9 bg-cream" />

          <div className="text-right">
            <div className="font-sans text-[10px] tracking-[0.12em] text-stone uppercase mb-1">EF Direct Exposure</div>
            <div className="font-serif text-2xl font-medium text-brand">$0</div>
          </div>
        </div>
      </div>
    </header>
  )
}
