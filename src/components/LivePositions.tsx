import React from 'react'
import { efTreasury, type ProtocolStatus } from '../data'

const EF_ADDRESS = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'

const STATUS_STYLE: Record<ProtocolStatus, { bg: string; text: string; border: string; dot: string }> = {
  safe:    { bg: 'bg-success-faint', text: 'text-success', border: 'border-success/30', dot: 'bg-success' },
  warning: { bg: 'bg-warn-faint',    text: 'text-warn',    border: 'border-warn/30',    dot: 'bg-warn' },
  minor:   { bg: 'bg-brand-faint',   text: 'text-brand',   border: 'border-brand/30',   dot: 'bg-brand' },
}

interface ExternalLink {
  label: string
  href: string
  note?: string
}

const PROTOCOL_LINKS: Record<string, ExternalLink[]> = {
  Spark: [
    { label: 'SparkLend', href: 'https://app.spark.fi', note: 'Position dashboard' },
    { label: 'Etherscan', href: `https://etherscan.io/address/${EF_ADDRESS}`, note: 'EF wallet' },
  ],
  Morpho: [
    { label: 'Morpho App', href: `https://app.morpho.org/address/${EF_ADDRESS}`, note: 'EF positions' },
    { label: 'Etherscan', href: `https://etherscan.io/address/${EF_ADDRESS}`, note: 'EF wallet' },
  ],
  Compound: [
    { label: 'Compound', href: 'https://app.compound.finance', note: 'Markets' },
    { label: 'Etherscan', href: `https://etherscan.io/address/${EF_ADDRESS}`, note: 'EF wallet' },
  ],
}

function ExternalLinkIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="inline-block ml-0.5 opacity-50">
      <path d="M5.5 1H9M9 1V4.5M9 1L4.5 5.5M2 3H1V9H7V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const fmt = (n: number) => `$${(n / 1e6).toFixed(1)}M`
const fmtETH = (n: number) => `${n.toLocaleString()} ETH`

export default function LivePositions() {
  const positions = efTreasury.defiPositions

  return (
    <div className="space-y-6">
      {/* Top summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-ivory border border-cream rounded-lg p-5 shadow-whisper relative overflow-hidden">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-brand" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase mb-2">Total DeFi Deployed</div>
            <div className="font-mono text-2xl font-medium text-brand">$50M</div>
            <div className="font-sans text-[11px] text-stone mt-1">6.1% of $820M treasury</div>
          </div>
        </div>
        <div className="bg-success-faint border border-success/25 rounded-lg p-5 shadow-whisper relative overflow-hidden">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-success" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-success/70 uppercase mb-2">Direct rsETH Held</div>
            <div className="font-mono text-2xl font-medium text-success">$0</div>
            <div className="font-sans text-[11px] text-success/60 mt-1">No direct hack exposure</div>
          </div>
        </div>
        <div className="bg-ivory border border-cream rounded-lg p-5 shadow-whisper relative overflow-hidden">
          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full bg-warn" />
          <div className="pl-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase mb-2">Indirect Exposure</div>
            <div className="font-mono text-2xl font-medium text-warn">$25M</div>
            <div className="font-sans text-[11px] text-stone mt-1">Morpho + Compound at-risk sleeve</div>
          </div>
        </div>
      </div>

      {/* Protocol position cards */}
      <div className="space-y-4">
        {positions.map(p => {
          const s = STATUS_STYLE[p.status]
          const links = PROTOCOL_LINKS[p.protocol] ?? []
          return (
            <div key={p.protocol} className="bg-ivory border border-cream rounded-lg shadow-whisper relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[2.5px] rounded-l-lg" style={{ backgroundColor: p.color }} />
              <div className="pl-6 pr-5 py-5">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-sans text-base font-medium text-near-black">{p.protocol}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-sans font-medium border ${s.bg} ${s.text} ${s.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {p.statusLabel}
                      </span>
                    </div>
                    <p className="font-sans text-[12px] text-olive leading-relaxed max-w-xl">{p.note}</p>

                    {/* Links */}
                    <div className="flex items-center gap-4 mt-3">
                      {links.map(l => (
                        <a
                          key={l.label}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-[11px] text-brand hover:text-brand-light transition-colors"
                        >
                          {l.label}
                          <ExternalLinkIcon />
                          {l.note && <span className="text-stone ml-1">({l.note})</span>}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-mono text-xl font-medium text-near-black">{fmt(p.usd)}</div>
                    <div className="font-mono text-[11px] mt-0.5" style={{ color: p.color }}>{fmtETH(p.eth)}</div>
                    <div className="mt-2">
                      <div className="w-32 bg-sand rounded-full h-1 ml-auto">
                        <div className="h-1 rounded-full" style={{ width: `${p.pctOfDefi}%`, backgroundColor: p.color }} />
                      </div>
                      <div className="font-sans text-[10px] text-stone mt-0.5 text-right">{p.pctOfDefi}% of DeFi sleeve</div>
                    </div>
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
              label: 'EF Wallet',
              sublabel: EF_ADDRESS.slice(0, 6) + '…' + EF_ADDRESS.slice(-4),
              href: `https://etherscan.io/address/${EF_ADDRESS}`,
              source: 'Etherscan',
            },
            {
              label: 'EF Portfolio',
              sublabel: 'Holdings & positions',
              href: `https://platform.arkm.com/address/${EF_ADDRESS}`,
              source: 'Arkham',
            },
            {
              label: 'EF Treasury Activity',
              sublabel: 'Spending & transfers',
              href: 'https://dune.com/fergmolina/ethereum-foundation-spending',
              source: 'Dune Analytics',
            },
            {
              label: 'EF Morpho Positions',
              sublabel: 'WETH vault supply',
              href: `https://app.morpho.org/address/${EF_ADDRESS}`,
              source: 'Morpho App',
            },
          ].map(r => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-parchment border border-cream rounded-lg hover:border-brand/30 hover:bg-brand-faint transition-colors group"
            >
              <div className="font-sans text-[11px] font-medium text-charcoal group-hover:text-brand mb-0.5">{r.label}</div>
              <div className="font-mono text-[10px] text-stone mb-1">{r.sublabel}</div>
              <div className="font-sans text-[10px] text-silver">{r.source} <ExternalLinkIcon /></div>
            </a>
          ))}
        </div>
      </div>

      <div className="font-sans text-[11px] text-silver leading-relaxed">
        Position sizes are estimates based on EF's public DeFi deployment announcements. Real-time balances vary with yield accrual. The EF deployed 3,400 ETH into Morpho vaults in March 2026; full position trace available via the Etherscan link above.
      </div>
    </div>
  )
}
