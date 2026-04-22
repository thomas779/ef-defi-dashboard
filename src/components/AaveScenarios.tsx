import React, { useState } from 'react'
import { efExposure, efTreasury } from '../data'

const fmt = (n: number): string => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}
const fmtBig = (n: number) => n >= 1e9 ? `$${(n / 1e9).toFixed(1)}B` : `$${(n / 1e6).toFixed(0)}M`

export default function AaveScenarios() {
  const [morphoPct, setMorphoPct] = useState(3.5)
  const [compoundPct, setCompoundPct] = useState(0.5)

  const morphoDeployed  = 14_500_000
  const compoundDeployed = 10_500_000

  // Scenario 1: EF absorbs pro-rata bad debt through Morpho WETH vaults
  const s1MorphoLoss   = morphoDeployed * morphoPct / 100
  const s1CompoundLoss = compoundDeployed * compoundPct / 100
  const s1Total        = s1MorphoLoss + s1CompoundLoss
  const s1TreasuryPct  = (s1Total / efTreasury.totalAssets) * 100

  // Scenario 2: losses confined to L2 rsETH holders — EF mainnet WETH unaffected
  const s2Total       = 0
  const s2TreasuryPct = 0

  return (
    <div className="space-y-6">
      {/* Framing */}
      <div className="bg-ivory border border-cream rounded-lg p-6 shadow-whisper">
        <div className="brand-bar pl-3 mb-3">
          <h2 className="font-serif text-lg font-medium text-near-black">How Much Does EF Actually Lose?</h2>
        </div>
        <p className="font-sans text-[13px] text-olive leading-relaxed pl-3 max-w-3xl">
          Aave DAO has published two resolution scenarios for its $124M–$230M rsETH bad debt.
          EF holds <span className="text-charcoal font-medium">$14.5M in Morpho WETH vaults</span> and{' '}
          <span className="text-charcoal font-medium">$10.5M in Compound</span> — neither protocol holds rsETH directly,
          but WETH suppliers may absorb bad debt pro-rata if losses are socialized. The outcome is binary:
          EF loses a few hundred thousand dollars, or nothing at all.
        </p>
      </div>

      {/* Two scenarios side by side */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Scenario 1 */}
        <div className="bg-ivory border-2 border-warn/40 rounded-lg shadow-whisper overflow-hidden">
          <div className="bg-warn-faint border-b border-warn/20 px-6 py-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-warn/70 uppercase mb-1">Scenario 1</div>
            <div className="font-serif text-lg font-medium text-near-black">Uniform Socialization</div>
            <div className="font-sans text-[12px] text-warn mt-1">
              15.12% haircut on ALL rsETH holders · Umbrella activates ($54M covered) · Net residual: $69.6M
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase mb-4">EF's Indirect Loss</div>

            <div className="space-y-4 mb-5">
              {/* Morpho slider */}
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="font-sans text-[12px] text-charcoal">Morpho WETH vault absorption</span>
                  <span className="font-mono text-sm font-medium text-warn">{fmt(s1MorphoLoss)}</span>
                </div>
                <input
                  type="range" min={0} max={10} step={0.1} value={morphoPct}
                  onChange={e => setMorphoPct(parseFloat(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: '#8B5E2A' }}
                />
                <div className="flex justify-between font-sans text-[10px] text-silver mt-0.5">
                  <span>0% (best case)</span>
                  <span className="font-medium text-charcoal">{morphoPct.toFixed(1)}% of $14.5M</span>
                  <span>10% (worst case)</span>
                </div>
              </div>

              {/* Compound slider */}
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="font-sans text-[12px] text-charcoal">Compound market absorption</span>
                  <span className="font-mono text-sm font-medium text-warn">{fmt(s1CompoundLoss)}</span>
                </div>
                <input
                  type="range" min={0} max={2} step={0.1} value={compoundPct}
                  onChange={e => setCompoundPct(parseFloat(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: '#8B5E2A' }}
                />
                <div className="flex justify-between font-sans text-[10px] text-silver mt-0.5">
                  <span>0%</span>
                  <span className="font-medium text-charcoal">{compoundPct.toFixed(1)}% of $10.5M</span>
                  <span>2%</span>
                </div>
              </div>

              {/* Spark */}
              <div className="flex justify-between items-baseline py-2 border-t border-cream">
                <span className="font-sans text-[12px] text-stone">Spark (delisted rsETH Jan 2026)</span>
                <span className="font-mono text-sm font-medium text-success">$0</span>
              </div>
            </div>

            {/* Total */}
            <div className="bg-warn-faint border border-warn/25 rounded-lg p-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-sans text-[11px] font-medium text-stone uppercase tracking-[0.1em]">EF Total Loss</span>
                <span className="font-mono text-2xl font-medium text-warn">{fmt(s1Total)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-sans text-[11px] text-stone">Treasury impact</span>
                <span className="font-mono text-[12px] text-charcoal">{s1TreasuryPct.toFixed(4)}%</span>
              </div>
              <div className="w-full bg-sand rounded-full h-1 mt-2">
                <div
                  className="h-1 rounded-full transition-all duration-200 bg-warn"
                  style={{ width: `${Math.min(s1TreasuryPct * 100, 100)}%` }}
                />
              </div>
              <div className="font-sans text-[10px] text-silver mt-1">Scale: 0% → 1% of treasury</div>
            </div>

            <p className="font-sans text-[11px] text-olive leading-relaxed mt-4">
              A global haircut propagates through Morpho's WETH vault architecture: rsETH borrowers default,
              vault reserves absorb bad debt, and suppliers (including EF) see a pro-rata reduction in withdrawable ETH.
              Compound's isolated market design limits contagion to a smaller fraction.
            </p>
          </div>
        </div>

        {/* Scenario 2 */}
        <div className="bg-ivory border-2 border-success/40 rounded-lg shadow-whisper overflow-hidden">
          <div className="bg-success-faint border-b border-success/20 px-6 py-4">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-success/70 uppercase mb-1">Scenario 2</div>
            <div className="font-serif text-lg font-medium text-near-black">L2-Isolated Losses</div>
            <div className="font-sans text-[12px] text-success mt-1">
              73.54% haircut on L2 rsETH only · Mainnet rsETH: 0% haircut · Umbrella: does not activate
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase mb-4">EF's Indirect Loss</div>

            <div className="space-y-0 mb-5">
              {[
                { protocol: 'Morpho WETH vault', reason: 'EF supplies mainnet WETH · L2 haircut does not touch mainnet reserves', loss: 0 },
                { protocol: 'Compound', reason: 'No L2 exposure in EF\'s Compound position', loss: 0 },
                { protocol: 'Spark', reason: 'Delisted rsETH Jan 2026', loss: 0 },
              ].map((item, i) => (
                <div key={item.protocol} className={`py-3 ${i < 2 ? 'border-b border-cream' : ''}`}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-sans text-[12px] font-medium text-charcoal">{item.protocol}</span>
                    <span className="font-mono text-sm font-medium text-success">$0</span>
                  </div>
                  <p className="font-sans text-[11px] text-olive">{item.reason}</p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-success-faint border border-success/25 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-sans text-[11px] font-medium text-stone uppercase tracking-[0.1em]">EF Total Loss</span>
                <span className="font-mono text-2xl font-medium text-success">$0</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-sans text-[11px] text-stone">Treasury impact</span>
                <span className="font-mono text-[12px] text-success">0.000%</span>
              </div>
              <div className="w-full bg-sand rounded-full h-1 mt-2">
                <div className="h-1 rounded-full bg-success" style={{ width: '0%' }} />
              </div>
              <div className="font-sans text-[10px] text-silver mt-1">Scale: 0% → 1% of treasury</div>
            </div>

            <p className="font-sans text-[11px] text-olive leading-relaxed">
              L2-isolated losses hit only rsETH borrowers on Arbitrum, Mantle, Base, and Ink. EF's positions are
              mainnet WETH supply — structurally insulated from L2 haircuts. Umbrella's non-activation is moot for EF:
              without any bad debt flowing to mainnet reserves, there is nothing to absorb.
            </p>
          </div>
        </div>
      </div>

      {/* Aave-level context */}
      <div className="bg-ivory border border-cream rounded-lg p-5 shadow-whisper">
        <div className="brand-bar pl-3 mb-4">
          <div className="text-[10px] font-sans font-medium tracking-[0.14em] text-stone uppercase">Aave-Level Context</div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              label: 'Scenario 1 bad debt',
              value: '$123.7M',
              sub: 'After $54M Umbrella → $69.6M net',
              color: 'text-warn',
            },
            {
              label: 'Scenario 2 bad debt',
              value: '$230.1M',
              sub: 'Umbrella inactive · full residual',
              color: 'text-error',
            },
            {
              label: 'Aave DAO treasury',
              value: '$181M',
              sub: '$54M Umbrella WETH module on-chain',
              color: 'text-brand',
            },
          ].map(r => (
            <div key={r.label} className="p-4 bg-parchment border border-cream rounded-lg">
              <div className="text-[10px] font-sans font-medium tracking-[0.12em] text-stone uppercase mb-2">{r.label}</div>
              <div className={`font-mono text-xl font-medium ${r.color}`}>{r.value}</div>
              <div className="font-sans text-[11px] text-olive mt-1">{r.sub}</div>
            </div>
          ))}
        </div>
        <p className="font-sans text-[12px] text-silver mt-4 leading-relaxed">
          The resolution depends on KelpDAO's loss-distribution mechanism and Aave DAO governance vote.
          Scenario 1 requires global rsETH holder socialization; Scenario 2 requires on-chain forensics to
          isolate exactly which rsETH was minted on which chain.
        </p>
      </div>
    </div>
  )
}
