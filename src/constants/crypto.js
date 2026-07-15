const ICON_BASE = 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color'

// NOTE: priceUSD values are static placeholder rates for display purposes only —
// there is no live price feed wired up yet. Swap for a real quote source later.
export const COINS = [
  {
    asset: 'BTC',
    symbol: 'BTC',
    name: 'Bitcoin',
    network: null,
    icon: `${ICON_BASE}/btc.png`,
    priceUSD: 98_450,
    decimals: 8,
  },
  {
    asset: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum',
    network: null,
    icon: `${ICON_BASE}/eth.png`,
    priceUSD: 3_450,
    decimals: 6,
  },
  {
    asset: 'USDT_ERC20',
    symbol: 'USDT',
    name: 'Tether(USDT)',
    network: 'ERC20 · Ethereum',
    icon: `${ICON_BASE}/usdt.png`,
    priceUSD: 1,
    decimals: 2,
  },
  {
    asset: 'USDT_TRC20',
    symbol: 'USDT',
    name: 'Tether(USDT)',
    network: 'TRC20 · Tron',
    icon: `${ICON_BASE}/usdt.png`,
    priceUSD: 1,
    decimals: 2,
  },
  {
    asset: 'USDC',
    symbol: 'USDC',
    name: 'USDC',
    network: 'ERC20 · Ethereum',
    icon: `${ICON_BASE}/usdc.png`,
    priceUSD: 1,
    decimals: 2,
  },
]

export function getCoinBySymbol(symbol) {
  return COINS.find(c => c.symbol.toLowerCase() === String(symbol).toLowerCase()) || null
}

export function buildCoins(balances) {
  const byAsset = Object.fromEntries((balances || []).map(b => [b.asset, Number(b.balance) || 0]))
  return COINS.map(coin => {
    const amount = byAsset[coin.asset] ?? 0
    return { ...coin, amount, valueUSD: amount * coin.priceUSD }
  })
}

export function formatCoinAmount(amount, decimals = 8) {
  return Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: decimals >= 6 ? 6 : decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatUSD(amount) {
  return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
