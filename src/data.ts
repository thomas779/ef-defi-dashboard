export const ETH_PRICE = 2392 as const  // live price per Arkham

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
  asset: string
  balanceETH: number | null
  usd: number
  pctOfDefi: number
  status: ProtocolStatus
  statusLabel: string
  color: string
  note: string
  action: 'supply' | 'borrow'
  explorerHref: string
  protocolHref: string
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

export const EF_ADDRESS = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'

// Source: Arkham Intel, 22 Apr 2026
// https://intel.arkm.com/explorer/entity/ethereum-foundation
export const efTreasury = {
  // Arkham shows 14 tracked addresses = $312.7M; full treasury including validators larger
  totalTrackedAssets: 312_708_826,
  ethHeld: 102_610,      // liquid ETH across tracked addresses
  aaveWETH: 21_271,      // aEthWETH supplied to Aave V3
  aaveUSDS: 2_017_687,   // aEthUSDS supplied to Aave V3 (USD value ~$2M)
  morphoSteakWETH: 994,  // STEAKETH in Morpho Steakhouse vault
  compoundBorrow: 92.79, // WETH borrowed from Compound V3 (EF is a borrower)

  defiPositions: [
    {
      protocol:    'Aave V3',
      asset:       'WETH',
      balanceETH:  21_271,
      usd:         50_863_145,
      pctOfDefi:   94,
      status:      'warning' as const,
      statusLabel: 'At Risk',
      color:       '#8B5E2A',
      note:        'EF supplies 21,271 WETH ($50.86M) to Aave V3 on Ethereum mainnet. This is directly in the protocol with $91.8M of rsETH bad debt on Ethereum Core (Scenario 1). Under Scenario 2, all bad debt is on L2s and this position is unaffected.',
      action:      'supply' as const,
      explorerHref: `https://etherscan.io/address/${EF_ADDRESS}`,
      protocolHref: 'https://app.aave.com',
    },
    {
      protocol:    'Morpho',
      asset:       'Steakhouse WETH',
      balanceETH:  994,
      usd:         2_396_394,
      pctOfDefi:   4.5,
      status:      'minor' as const,
      statusLabel: 'Minor Risk',
      color:       '#1B365D',
      note:        'EF holds 994 STEAKETH (~$2.4M) in the Morpho Steakhouse WETH vault. Morpho\'s rsETH bad debt is under assessment; exposure is limited relative to the Aave position.',
      action:      'supply' as const,
      explorerHref: `https://app.morpho.org/address/${EF_ADDRESS}`,
      protocolHref: 'https://app.morpho.org',
    },
    {
      protocol:    'Compound V3',
      asset:       'WETH (borrow)',
      balanceETH:  -93,
      usd:         -221_871,
      pctOfDefi:   0,
      status:      'safe' as const,
      statusLabel: 'Borrower',
      color:       '#87867f',
      note:        'EF is borrowing 92.79 WETH ($221K) from Compound V3 — not supplying. As a borrower, EF is not exposed to bad-debt socialisation in this market.',
      action:      'borrow' as const,
      explorerHref: `https://etherscan.io/address/${EF_ADDRESS}`,
      protocolHref: 'https://app.compound.finance',
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

  timeline: [
    { time: 'Apr 18 ~14:00 UTC', event: 'Two LayerZero DVN RPC nodes silently compromised' },
    { time: 'Apr 18 ~14:46 UTC', event: '116,500 rsETH minted without backing via forged bridge messages' },
    { time: 'Apr 18 ~15:32 UTC', event: 'Unbacked rsETH posted as collateral; ~$190M ETH/WETH drained from Aave' },
    { time: 'Apr 18 ~16:00 UTC', event: 'KelpDAO detects anomaly; emergency pause triggered' },
    { time: 'Apr 18 ~16:15 UTC', event: 'Aave, SparkLend, Fluid, and Upshift freeze all rsETH markets' },
    { time: 'Apr 19',            event: 'Whales pull $6B+ from Aave; ETH/USDT/USDC pools hit 100% utilisation' },
    { time: 'Apr 20',            event: 'Aave incident report: $124M–$230M bad-debt scenarios published' },
    { time: 'Apr 21',            event: 'Arbitrum Security Council freezes 30,766 ETH (~$71M) linked to exploit' },
  ] satisfies HackTimelineEvent[],
}

// Aave V3 Ethereum Core WETH reserve size (pre-hack estimate for haircut calculation)
// Used to compute EF's pro-rata share of socialised losses
export const AAVE_ETH_CORE_WETH_RESERVE = 1_200_000_000  // ~$1.2B estimate

export const aaveScenarios: Record<'s1' | 's2', AaveScenario> = {
  s1: {
    id:               1,
    name:             'Scenario 1',
    subtitle:         'Uniform Socialization',
    description:      '15.12% haircut applied uniformly to ALL rsETH holders across every chain. Losses shared globally. Umbrella Safety Module activates on Ethereum Core.',
    totalBadDebt:     123_700_000,
    rsETHHaircut:     15.12,
    color:            '#8B5E2A',
    umbrellaActivated: true,
    umbrellaAmount:    54_060_000,
    netAfterUmbrella:  69_640_000,
    chains: [
      { chain: 'Ethereum Core', reserve: 'WETH',   badDebt: 91_800_000, shortfall:  1.54, color: '#1B365D' },
      { chain: 'Mantle',        reserve: 'WETH',   badDebt: 10_400_000, shortfall:  9.54, color: '#87867f' },
      { chain: 'Arbitrum',      reserve: 'WETH',   badDebt: 10_300_000, shortfall:  3.11, color: '#2D5A8A' },
      { chain: 'Base',          reserve: 'WETH',   badDebt:  6_100_000, shortfall:  3.00, color: '#4A7AAA' },
      { chain: 'Ethereum',      reserve: 'wstETH', badDebt:  3_100_000, shortfall:  0.10, color: '#3A5A80' },
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
    color:              '#b53333',
    umbrellaActivated:  false,
    umbrellaAmount:     0,
    netAfterUmbrella:   230_100_000,
    chains: [
      { chain: 'Arbitrum', reserve: 'WETH', badDebt: 88_400_000, shortfall: 26.67, color: '#2D5A8A' },
      { chain: 'Mantle',   reserve: 'WETH', badDebt: 77_700_000, shortfall: 71.45, color: '#87867f' },
      { chain: 'Base',     reserve: 'WETH', badDebt: 47_500_000, shortfall: 23.28, color: '#4A7AAA' },
      { chain: 'Ink',      reserve: 'WETH', badDebt: 13_900_000, shortfall: 18.00, color: '#8B5E2A' },
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
