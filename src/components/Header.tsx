import React from 'react'

export default function Header() {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">
            EF Treasury — DeFi Exposure Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            KelpDAO / LayerZero rsETH Exploit · April 18, 2026 · $292M stolen
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-900/40 text-red-400 border border-red-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Largest DeFi Exploit of 2026
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/60">
            EF Direct Exposure: $0
          </span>
          <span className="text-slate-500 text-xs">Updated Apr 22, 2026</span>
        </div>
      </div>
    </header>
  )
}
