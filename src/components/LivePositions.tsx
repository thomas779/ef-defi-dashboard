import React from 'react'
import { efTreasury, EF_ADDRESS, type ProtocolStatus } from '../data'

const STATUS_STYLE: Record<ProtocolStatus, { bg: string; text: string; border: string; dot: string }> = {
  safe:    { bg: 'bg-success-faint', text: 'text-success', border: 'border-success/30', dot: 'bg-success' },
  warning: { bg: 'bg-warn-faint',    text: 'text-warn',    border: 'border-warn/30',    dot: 'bg-warn' },
  minor:   { bg: 'bg-brand-faint',   text: 'text-brand',   border: 'border-brand/30',   dot: 'bg-brand' },
}

function ExternalLinkIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="inline-block ml-0.5 opacity-40">
      <path d="M5.5 1H9M9 1V4.5M9 1L4.5 5.5M2 3H1V9H7V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const fmt = (n: number) => {
  const abs = Math.abs(n)
  const sign = n < 0 ? '−' : ''
  return abs >= 1e6 ? `${sign}$${(abs / 1e6).toFixed(2)}M` : `${sign}$${(abs / 1e3).toFixed(0)}K`
}

export default function LivePositions() {
  const positions = efTreasury.defiPositions
  const totalSupplied = positions.filter(p => p.action === 'supply').reduce((s, p) => s + p.usd, 0)

  return (
    <div className="space-y-5">
      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-ivory border border-cream rounded-lg p-5 shadow-whisper relative overflow-hidden">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-warn" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase mb-2">Total DeFi Supplied</div>
            <div className="font-mono text-2xl font-medium text-near-black">{fmt(totalSupplied)}</div>
            <div className="font-sans text-[11px] text-stone mt-1">across Aave V3 + Morpho</div>
          </div>
        </div>
        <div className="bg-warn-faint border border-warn/25 rounded-lg p-5 shadow-whisper relative overflow-hidden">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-warn" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-warn/70 uppercase mb-2">Primary Exposure</div>
            <div className="font-mono text-2xl font-medium text-warn">{fmt(efTreasury.aaveWETH * 2392)}</div>
            <div className="font-sans text-[11px] text-warn/70 mt-1">Aave V3 WETH · {efTreasury.aaveWETH.toLocaleString()} WETH</div>
          </div>
        </div>
        <div className="bg-success-faint border border-success/25 rounded-lg p-5 shadow-whisper relative overflow-hidden">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-success" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-success/70 uppercase mb-2">Direct rsETH Held</div>
            <div className="font-mono text-2xl font-medium text-success">$0</div>
            <div className="font-sans text-[11px] text-success/60 mt-1">EF never held rsETH</div>
          </div>
        </div>
      </div>

      {/* Position cards */}
      <div className="space-y-3">
        {positions.map(p => {
          const s = STATUS_STYLE[p.status]
          return (
            <div key={p.protocol} className="bg-ivory border border-cream rounded-lg shadow-whisper relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[2.5px] rounded-l-lg" style={{ backgroundColor: p.color }} />
              <div className="pl-6 pr-5 py-5">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-sans text-sm font-medium text-near-black">{p.protocol}</span>
                      <span className="font-mono text-[11px] text-stone">{p.asset}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-sans font-medium border ${s.bg} ${s.text} ${s.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {p.statusLabel}
                      </span>
                    </div>
                    <p className="font-sans text-[12px] text-olive leading-relaxed max-w-xl">{p.note}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <a href={p.explorerHref} target="_blank" rel="noopener noreferrer"
                        className="font-sans text-[11px] text-brand hover:text-brand-light transition-colors">
                        Block explorer <ExternalLinkIcon />
                      </a>
                      <a href={p.protocolHref} target="_blank" rel="noopener noreferrer"
                        className="font-sans text-[11px] text-brand hover:text-brand-light transition-colors">
                        Protocol app <ExternalLinkIcon />
                      </a>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`font-mono text-xl font-medium ${p.action === 'borrow' ? 'text-error' : 'text-near-black'}`}>
                      {fmt(p.usd)}
                    </div>
                    <div className="font-sans text-[10px] text-stone mt-0.5 uppercase tracking-wide">
                      {p.action === 'borrow' ? 'borrowed' : 'supplied'}
                    </div>
                    {p.action === 'supply' && p.pctOfDefi > 0 && (
                      <div className="mt-2 w-28 ml-auto">
                        <div className="w-full bg-sand rounded-full h-1">
                          <div className="h-1 rounded-full" style={{ width: `${p.pctOfDefi}%`, backgroundColor: p.color }} />
                        </div>
                        <div className="font-sans text-[10px] text-stone mt-0.5 text-right">{p.pctOfDefi}% of supplied</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* On-chain resources */}
      <div className="bg-ivory border border-cream rounded-lg p-5 shadow-whisper">
        <div className="brand-bar pl-3 mb-4">
          <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">On-Chain Resources</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: 'EF Main Wallet',
              sub: EF_ADDRESS.slice(0, 6) + '…' + EF_ADDRESS.slice(-4),
              href: `https://etherscan.io/address/${EF_ADDRESS}`,
              source: 'Etherscan',
            },
            {
              label: 'EF Arkham Profile',
              sub: '$312.7M tracked · 14 addresses',
              href: 'https://intel.arkm.com/explorer/entity/ethereum-foundation',
              source: 'Arkham Intel',
            },
            {
              label: 'EF Aave Position',
              sub: '21,271 aEthWETH · $50.86M',
              href: `https://app.aave.com`,
              source: 'Aave App',
            },
            {
              label: 'EF Treasury Activity',
              sub: 'Spending & transfers',
              href: 'https://dune.com/fergmolina/ethereum-foundation-spending',
              source: 'Dune Analytics',
            },
          ].map(r => (
            <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer"
              className="block p-3 bg-parchment border border-cream rounded-lg hover:border-brand/30 hover:bg-brand-faint transition-colors group">
              <div className="font-sans text-[11px] font-medium text-charcoal group-hover:text-brand mb-0.5">{r.label}</div>
              <div className="font-mono text-[10px] text-stone mb-1">{r.sub}</div>
              <div className="font-sans text-[10px] text-silver">{r.source} <ExternalLinkIcon /></div>
            </a>
          ))}
        </div>
      </div>

      <div className="font-sans text-[11px] text-silver leading-relaxed">
        Source: Arkham Intel, 22 Apr 2026. EF entity tracks 14 addresses ($312.7M). Full treasury including validator
        keys is larger. Aave position ({efTreasury.aaveWETH.toLocaleString()} aEthWETH) confirmed on-chain;
        Morpho position ({efTreasury.morphoSteakWETH.toLocaleString()} STEAKETH) from Steakhouse WETH vault.
        Compound shows EF as a borrower ($221K WETH), not a supplier.
      </div>
    </div>
  )
}
