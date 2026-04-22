export const ETH_PRICE = 2500 as const

export type ProtocolStatus = 'safe' | 'warning' | 'minor'
export type ImpactLevel = 'Critical' | 'Medium' | 'Low' | 'None'

export interface TreasuryAllocation {
  name: string
  value: number
  eth: number | null
  color: string
  pct: number
}

export interface DefiPosition {
  protocol: string
  eth: number
  usd: number
  pctOfDefi: number
  status: ProtocolStatus
  statusLabel: string
  color: string
  note: string
}

export interface HackTimelineEvent {
  time: string
  event: string
}

export interface AffectedProtocol {
  name: string
  impact: ImpactLevel
  badDebt: string
  color: string
}

export interface AaveChain {
  chain: string
  reserve: string
  badDebt: number
  shortfall: number
  color: string
}

export interface AaveScenario {
  id: number
  name: string
  subtitle: string
  description: string
  totalBadDebt: number
  color: string
  umbrellaActivated: boolean
  umbrellaAmount: number
  netAfterUmbrella: number
  chains: AaveChain[]
  rsETHHaircut?: number
  rsETHHaircutL2?: number
  rsETHHaircutMainnet?: number
}

export interface ExposureProtocol {
  protocol: string
  deployed: number
  minLossPct: number
  maxLossPct: number
  defaultPct: number
  locked: boolean
  status: ProtocolStatus
  color: string
  reason: string
}

export const efTreasury = {
  totalAssets: 820_000_000,
  ethValue: 735_000_000,
  nonEthValue: 85_000_000,
  totalEth: 294_000,

  allocations: [
    { name: 'Liquid ETH',    value: 510_000_000, eth: 204_000, color: '#627EEA', pct: 62.2 },
    { name: 'Staked ETH',    value: 175_000_000, eth:  70_000, color: '#8B5CF6', pct: 21.3 },
    { name: 'DeFi Deployed', value:  50_000_000, eth:  20_000, color: '#F59E0B', pct:  6.1 },
    { name: 'Fiat & Other',  value:  85_000_000, eth:    null, color: '#64748B', pct: 10.4 },
  ] satisfies TreasuryAllocation[],

  defiPositions: [
    {
      protocol:   'Spark',
      eth:         10_000,
      usd:         25_000_000,
      pctOfDefi:   50,
      status:      'safe' as const,
      statusLabel: 'Protected',
      color:       '#10B981',
      note:        'Proactively delisted rsETH in January 2026 — zero direct exposure to the hack',
    },
    {
      protocol:   'Morpho',
      eth:          5_800,
      usd:         14_500_000,
      pctOfDefi:   29,
      status:      'warning' as const,
      statusLabel: 'At Risk',
      color:       '#F59E0B',
      note:        'rsETH markets frozen post-hack; EF ETH supply vaults may absorb a pro-rata share of bad debt',
    },
    {
      protocol:   'Compound',
      eth:          4_200,
      usd:         10_500_000,
      pctOfDefi:   21,
      status:      'minor' as const,
      statusLabel: 'Minor Risk',
      color:       '#F97316',
      note:        'Affected but far less severely than Aave; isolated market architecture limits contagion',
    },
  ] satisfies DefiPosition[],
} as const

export const hackData = {
  date:                 '18 April 2026',
  protocol:             'KelpDAO / LayerZero Bridge',
  totalStolenUSD:       292_000_000,
  rsETHMinted:          116_500,
  pctCirculatingSupply: 18,
  attacker:             'Lazarus Group — TraderTraitor subunit (North Korea)',
  defiTVLDrop:          13_200_000_000,
  aaveTVLDrop:           6_000_000_000,
  arbFrozenUSD:            71_000_000,

  mechanism: [
    'Attacker identified that KelpDAO used a 1-of-1 validator configuration on its LayerZero bridge — meaning a single verifier approval is enough to execute any cross-chain message.',
    "Two RPC nodes used by LayerZero's DVN (Decentralised Verifier Network) were compromised, likely via supply-chain attack attributed to North Korea's TraderTraitor unit.",
    "Fraudulent cross-chain messages instructed the bridge to mint 116,500 rsETH on Ethereum mainnet with zero backing — roughly 18% of the token's entire circulating supply.",
    'The unbacked rsETH was immediately deposited as collateral on Aave, Morpho, Compound, and other lending protocols to borrow ~$190M in real ETH/WETH before alarms sounded.',
  ],

  timeline: [
    { time: 'Apr 18 ~14:00 UTC', event: 'Two LayerZero DVN RPC nodes silently compromised' },
    { time: 'Apr 18 ~14:46 UTC', event: '116,500 rsETH minted without backing via forged bridge messages' },
    { time: 'Apr 18 ~15:32 UTC', event: 'Unbacked rsETH posted as collateral; ~$190M ETH/WETH drained from lending protocols' },
    { time: 'Apr 18 ~16:00 UTC', event: 'KelpDAO detects anomaly; emergency pause of core contracts triggered' },
    { time: 'Apr 18 ~16:15 UTC', event: 'Aave, SparkLend, Fluid, and Upshift freeze all rsETH markets' },
    { time: 'Apr 19',            event: 'Whales pull $6B+ from Aave; ETH/USDT/USDC pools hit 100% utilisation' },
    { time: 'Apr 20',            event: 'Aave incident report published: $124M–$230M bad-debt scenarios' },
    { time: 'Apr 21',            event: 'Arbitrum Security Council freezes 30,766 ETH (~$71M) linked to exploit' },
  ] satisfies HackTimelineEvent[],

  affectedProtocols: [
    { name: 'Aave',     impact: 'Critical' as const, badDebt: '$124M–$230M',         color: '#EF4444' },
    { name: 'Morpho',   impact: 'Medium'   as const, badDebt: 'Under assessment',     color: '#F59E0B' },
    { name: 'Compound', impact: 'Medium'   as const, badDebt: 'Under assessment',     color: '#F59E0B' },
    { name: 'Fluid',    impact: 'Medium'   as const, badDebt: 'Under assessment',     color: '#F59E0B' },
    { name: 'Euler',    impact: 'Low'      as const, badDebt: 'Minimal',              color: '#94A3B8' },
    { name: 'Spark',    impact: 'None'     as const, badDebt: '$0 — delisted rsETH Jan 2026', color: '#10B981' },
  ] satisfies AffectedProtocol[],
}

export const aaveScenarios: Record<'s1' | 's2', AaveScenario> = {
  s1: {
    id:               1,
    name:             'Scenario 1',
    subtitle:         'Uniform Socialization',
    description:      '15.12% haircut applied uniformly to ALL rsETH holders across every chain. Losses shared globally. Umbrella Safety Module activates on Ethereum Core.',
    totalBadDebt:     123_700_000,
    rsETHHaircut:     15.12,
    color:            '#F59E0B',
    umbrellaActivated: true,
    umbrellaAmount:    54_060_000,
    netAfterUmbrella:  69_640_000,
    chains: [
      { chain: 'Ethereum Core', reserve: 'WETH',   badDebt: 91_800_000, shortfall:  1.54, color: '#627EEA' },
      { chain: 'Mantle',        reserve: 'WETH',   badDebt: 10_400_000, shortfall:  9.54, color: '#64748B' },
      { chain: 'Arbitrum',      reserve: 'WETH',   badDebt: 10_300_000, shortfall:  3.11, color: '#3B82F6' },
      { chain: 'Base',          reserve: 'WETH',   badDebt:  6_100_000, shortfall:  3.00, color: '#10B981' },
      { chain: 'Ethereum',      reserve: 'wstETH', badDebt:  3_100_000, shortfall:  0.10, color: '#8B5CF6' },
    ],
  },
  s2: {
    id:                 2,
    name:               'Scenario 2',
    subtitle:           'L2-Isolated Losses',
    description:        '73.54% haircut on L2 rsETH only. Ethereum mainnet rsETH is unaffected. Umbrella does NOT activate — it only covers Ethereum Core reserves.',
    totalBadDebt:       230_100_000,
    rsETHHaircutL2:      73.54,
    rsETHHaircutMainnet:  0,
    color:              '#EF4444',
    umbrellaActivated:  false,
    umbrellaAmount:     0,
    netAfterUmbrella:   230_100_000,
    chains: [
      { chain: 'Arbitrum', reserve: 'WETH', badDebt: 88_400_000, shortfall: 26.67, color: '#3B82F6' },
      { chain: 'Mantle',   reserve: 'WETH', badDebt: 77_700_000, shortfall: 71.45, color: '#64748B' },
      { chain: 'Base',     reserve: 'WETH', badDebt: 47_500_000, shortfall: 23.28, color: '#10B981' },
      { chain: 'Ink',      reserve: 'WETH', badDebt: 13_900_000, shortfall: 18.00, color: '#F97316' },
    ],
  },
}

export const aaveDAOTreasury = {
  total:          181_000_000,
  ethCorrelated:   62_000_000,
  aaveTokens:      54_000_000,
  stablecoins:     52_000_000,
  umbrellaWETH:    54_060_000,
}

export const efExposure = {
  directRsETH: 0,
  protocols: [
    {
      protocol:    'Spark',
      deployed:    25_000_000,
      minLossPct:  0,
      maxLossPct:  0,
      defaultPct:  0,
      locked:      true,
      status:      'safe' as const,
      color:       '#10B981',
      reason:      'Spark delisted rsETH in January 2026, three months before the hack. Zero exposure.',
    },
    {
      protocol:    'Morpho',
      deployed:    14_500_000,
      minLossPct:  0,
      maxLossPct:  10,
      defaultPct:  3.5,
      locked:      false,
      status:      'warning' as const,
      color:       '#F59E0B',
      reason:      "EF's ETH supply in Morpho WETH vaults may absorb a pro-rata share of rsETH-collateralised bad debt. Isolated markets cap the damage.",
    },
    {
      protocol:    'Compound',
      deployed:    10_500_000,
      minLossPct:  0,
      maxLossPct:  2,
      defaultPct:  0.5,
      locked:      false,
      status:      'minor' as const,
      color:       '#F97316',
      reason:      'Compound was affected but to a much lesser degree than Aave. Risk parameters likely contained most of the rsETH bad debt.',
    },
  ] satisfies ExposureProtocol[],
}
