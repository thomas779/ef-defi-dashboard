import React, { useState } from 'react'
import { aaveScenarios, AAVE_ETH_CORE_WETH_RESERVE, efTreasury } from '../data'

const fmt = (n: number) => n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : `$${(n / 1e3).toFixed(0)}K`
const fmtBig = (n: number) => n >= 1e9 ? `$${(n / 1e9).toFixed(1)}B` : `$${(n / 1e6).toFixed(0)}M`

// EF's Aave position: 21,271 WETH = $50.86M (source: Arkham Intel 22 Apr 2026)
const EF_AAVE_WETH_USD  = efTreasury.aaveWETH * 2392   // ~$50.86M
const EF_MORPHO_USD     = efTreasury.morphoSteakWETH * 2410  // ~$2.4M (STEAKETH price)

export default function AaveScenarios() {
  // Adjustable: how much of Ethereum Core residual bad debt gets socialised across WETH suppliers
  const [wethReserveB, setWethReserveB] = useState(1.2)  // total Aave ETH Core WETH reserve (billions)

  const s1 = aaveScenarios.s1
  const s2 = aaveScenarios.s2

  // S1: Ethereum Core has $91.8M bad debt; Umbrella covers $54M → $37.8M residual socialised across WETH suppliers
  const s1EthCoreResidual  = 91_800_000 - 54_060_000   // = $37.74M
  const wethReserve        = wethReserveB * 1e9
  const s1HaircutPct       = (s1EthCoreResidual / wethReserve) * 100
  const s1AaveLoss         = EF_AAVE_WETH_USD * (s1HaircutPct / 100)
  const s1MorphoLoss       = EF_MORPHO_USD * 0.02   // rough 2% on the tiny Morpho position
  const s1Total            = s1AaveLoss + s1MorphoLoss
  const s1TreasuryPct      = (s1Total / 312_708_826) * 100

  // S2: All bad debt is on L2s (Arbitrum, Mantle, Base, Ink). Ethereum mainnet WETH reserve = 0 bad debt.
  const s2Total       = 0
  const s2TreasuryPct = 0

  return (
    <div className="space-y-6">
      {/* Framing */}
      <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
        <div className="brand-bar pl-3 mb-3">
          <h2 className="font-serif text-lg font-medium text-near-black">EF's Aave Loss: Two Paths</h2>
        </div>
        <p className="font-sans text-[13px] text-olive leading-relaxed pl-3 max-w-3xl">
          EF supplies <span className="font-medium text-charcoal">21,271 WETH ($50.86M) into Aave V3 on Ethereum mainnet</span>{' '}
          — confirmed on-chain via Arkham. Aave has published two bad-debt scenarios. The critical question for EF:{' '}
          does any bad debt land on the Ethereum Core WETH reserve (where EF supplies), or is it all
          confined to L2 chains?
        </p>
      </div>

      {/* Scenario comparison */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* S1 */}
        <div className="bg-ivory border-2 border-warn/40 rounded-lg shadow-whisper overflow-hidden">
          <div className="bg-warn-faint border-b border-warn/20 px-6 py-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-warn/70 uppercase mb-1">Scenario 1</div>
            <div className="font-serif text-lg font-medium text-near-black">Uniform Socialization</div>
            <div className="font-sans text-[12px] text-warn mt-1">
              EF takes a haircut as an Aave WETH supplier
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            <div className="font-sans text-[12px] text-olive leading-relaxed">
              15.12% rsETH haircut applied globally. Ethereum Core bears $91.8M of the bad debt.
              Umbrella Safety Module covers $54M — leaving <span className="font-medium text-charcoal">$37.8M to be
              socialised across Ethereum Core WETH suppliers.</span> EF's $50.86M is a fraction of that reserve.
            </div>

            {/* WETH reserve slider */}
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="font-sans text-[11px] text-charcoal">Aave ETH Core WETH reserve (estimate)</span>
                <span className="font-mono text-sm font-medium text-charcoal">${wethReserveB.toFixed(1)}B</span>
              </div>
              <input
                type="range" min={0.5} max={3} step={0.1} value={wethReserveB}
                onChange={e => setWethReserveB(parseFloat(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: '#8B5E2A' }}
              />
              <div className="flex justify-between font-sans text-[10px] text-silver mt-0.5">
                <span>$0.5B</span>
                <span className="text-stone">Pre-hack reserve size (uncertain — adjust to model)</span>
                <span>$3B</span>
              </div>
            </div>

            {/* Loss breakdown */}
            <div className="space-y-0 border border-cream rounded-lg overflow-hidden">
              {[
                {
                  label:    'EF Aave WETH supply',
                  position: `$50.86M × ${s1HaircutPct.toFixed(2)}% haircut`,
                  loss:     s1AaveLoss,
                  main:     true,
                },
                {
                  label:    'EF Morpho Steakhouse WETH',
                  position: '$2.4M · rough 2% estimate',
                  loss:     s1MorphoLoss,
                  main:     false,
                },
                {
                  label:    'Compound V3',
                  position: 'EF is a borrower, not a supplier — no socialisation exposure',
                  loss:     0,
                  main:     false,
                },
              ].map((r, i) => (
                <div key={r.label} className={`flex justify-between items-start gap-4 px-4 py-3 ${i < 2 ? 'border-b border-cream' : ''}`}>
                  <div>
                    <div className="font-sans text-[12px] font-medium text-charcoal">{r.label}</div>
                    <div className="font-sans text-[11px] text-stone">{r.position}</div>
                  </div>
                  <div className={`font-mono text-sm font-medium flex-shrink-0 ${r.loss > 0 ? 'text-warn' : 'text-success'}`}>
                    {r.loss > 0 ? fmt(r.loss) : '$0'}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-warn-faint border border-warn/25 rounded-lg p-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-sans text-[11px] font-medium text-stone uppercase tracking-[0.1em]">EF estimated loss</span>
                <span className="font-mono text-2xl font-medium text-warn">{fmt(s1Total)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-sans text-[11px] text-stone">
                  Aave haircut on mainnet: {s1HaircutPct.toFixed(2)}% of supplied WETH
                </span>
                <span className="font-mono text-[12px] text-charcoal">{s1TreasuryPct.toFixed(3)}% of tracked treasury</span>
              </div>
            </div>
          </div>
        </div>

        {/* S2 */}
        <div className="bg-ivory border-2 border-success/40 rounded-lg shadow-whisper overflow-hidden">
          <div className="bg-success-faint border-b border-success/20 px-6 py-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-success/70 uppercase mb-1">Scenario 2</div>
            <div className="font-serif text-lg font-medium text-near-black">L2-Isolated Losses</div>
            <div className="font-sans text-[12px] text-success mt-1">
              EF's mainnet Aave position is fully insulated
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            <div className="font-sans text-[12px] text-olive leading-relaxed">
              73.54% haircut applies only to L2 rsETH holders. The entire $230.1M bad debt sits on Arbitrum,
              Mantle, Base, and Ink — <span className="font-medium text-charcoal">Ethereum Core WETH reserve has
              $0 bad debt.</span> EF's Aave supply position on mainnet is untouched.
            </div>

            {/* Loss breakdown */}
            <div className="space-y-0 border border-cream rounded-lg overflow-hidden">
              {[
                {
                  label:  'EF Aave WETH supply',
                  reason: 'Ethereum mainnet Aave has no bad debt in S2 — all on L2s',
                  loss:   0,
                },
                {
                  label:  'EF Morpho Steakhouse WETH',
                  reason: 'Morpho\'s mainnet rsETH bad debt unresolved under S2 — exact impact unknown',
                  loss:   null,
                },
                {
                  label:  'Compound V3',
                  reason: 'EF is a borrower — no supplier socialisation risk',
                  loss:   0,
                },
              ].map((r, i) => (
                <div key={r.label} className={`flex justify-between items-start gap-4 px-4 py-3 ${i < 2 ? 'border-b border-cream' : ''}`}>
                  <div>
                    <div className="font-sans text-[12px] font-medium text-charcoal">{r.label}</div>
                    <div className="font-sans text-[11px] text-stone">{r.reason}</div>
                  </div>
                  <div className={`font-mono text-sm font-medium flex-shrink-0 ${r.loss === null ? 'text-warn' : 'text-success'}`}>
                    {r.loss === null ? 'TBD' : '$0'}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-success-faint border border-success/25 rounded-lg p-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-sans text-[11px] font-medium text-stone uppercase tracking-[0.1em]">EF estimated loss (Aave)</span>
                <span className="font-mono text-2xl font-medium text-success">$0</span>
              </div>
              <div className="font-sans text-[11px] text-stone">
                Morpho impact TBD — $2.4M position, pending Morpho DAO's own resolution
              </div>
            </div>

            <div className="bg-parchment border border-cream rounded-lg p-3 font-sans text-[11px] text-olive leading-relaxed">
              <span className="font-medium text-charcoal">Caveat:</span> S2 leaves Ethereum Core mainnet bad debt
              ($91.8M in Aave) unresolved via rsETH haircuts. Aave DAO would need a separate mechanism — potentially
              drawing on the $181M DAO treasury — to cover the residual. This scenario's resolution path is less clear.
            </div>
          </div>
        </div>
      </div>

      {/* Aave chain breakdown context */}
      <div className="bg-ivory border border-cream rounded-lg p-5 shadow-whisper">
        <div className="brand-bar pl-3 mb-4">
          <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Where the Bad Debt Sits</div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="font-sans text-[11px] font-medium text-stone uppercase tracking-[0.1em] mb-3">Scenario 1 — $123.7M total</div>
            <div className="space-y-0">
              {aaveScenarios.s1.chains.map((c, i) => (
                <div key={c.chain} className={`flex justify-between items-center py-2 ${i < aaveScenarios.s1.chains.length - 1 ? 'border-b border-cream' : ''}`}>
                  <span className="flex items-center gap-2 font-sans text-[12px] text-charcoal">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.chain}
                    {c.chain === 'Ethereum Core' && <span className="text-[10px] text-warn font-medium">(EF supplies here)</span>}
                  </span>
                  <span className="font-mono text-[12px] text-near-black">{fmtBig(c.badDebt)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-sans text-[11px] font-medium text-stone uppercase tracking-[0.1em] mb-3">Scenario 2 — $230.1M total (L2s only)</div>
            <div className="space-y-0">
              {aaveScenarios.s2.chains.map((c, i) => (
                <div key={c.chain} className={`flex justify-between items-center py-2 ${i < aaveScenarios.s2.chains.length - 1 ? 'border-b border-cream' : ''}`}>
                  <span className="flex items-center gap-2 font-sans text-[12px] text-charcoal">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.chain}
                  </span>
                  <span className="font-mono text-[12px] text-near-black">{fmtBig(c.badDebt)}</span>
                </div>
              ))}
              <div className="pt-2 font-sans text-[11px] text-success flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                Ethereum mainnet: $0 bad debt — EF's position unaffected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
