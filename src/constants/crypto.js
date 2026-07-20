const ICON_BASE = 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color'


export const COINS = [
  {
    asset: 'BTC',
    symbol: 'BTC',
    name: 'Bitcoin',
    network: null,
    icon: `${ICON_BASE}/btc.png`,
    decimals: 8,
  },
  {
    asset: 'USDT_TRC20',
    symbol: 'USDT',
    name: 'Tether(USDT)',
    network: 'TRC20 · Tron',
    icon: `${ICON_BASE}/usdt.png`,
    decimals: 2,
  },
  {
    asset: 'USDC_SOL',
    symbol: 'USDC',
    name: 'USDC',
    network: 'Solana',
    icon: `${ICON_BASE}/usdc.png`,
    decimals: 2,
  },
]

const BALANCE_FIELD = {
  BTC: 'btc_balance',
  USDT_TRC20: 'usdt_trc20_balance',
  USDC_SOL: 'usdc_sol_balance',
}

// Market tab shows major coins for price browsing, independent of which
// assets VeloxZap actually custodies deposits for (see COINS above).
export const MARKET_COINS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: `${ICON_BASE}/btc.png` },
  { symbol: 'ETH', name: 'Ethereum', icon: `${ICON_BASE}/eth.png` },
  { symbol: 'BNB', name: 'BNB', icon: `${ICON_BASE}/bnb.png` },
  { symbol: 'USDT', name: 'Tether(USDT)', icon: `${ICON_BASE}/usdt.png` },
  { symbol: 'USDC', name: 'USDC', icon: `${ICON_BASE}/usdc.png` },
]

export function getCoinBySymbol(symbol) {
  return COINS.find(c => c.symbol.toLowerCase() === String(symbol).toLowerCase()) || null
}

export function getMarketCoinBySymbol(symbol) {
  return MARKET_COINS.find(c => c.symbol.toLowerCase() === String(symbol).toLowerCase()) || null
}

// valueUSD is only ever computed from a live rate — no static fallback price,
// so a coin's value is `null` (not a stale/misleading number) until the live
// market rate has actually loaded.
export function buildCoins(balances, rates) {
  return COINS.map(coin => {
    const amount = Number(balances?.[BALANCE_FIELD[coin.asset]]) || 0
    const priceUSD = rates?.[coin.symbol]?.priceUSD ?? null
    const valueUSD = priceUSD != null ? amount * priceUSD : null
    return { ...coin, amount, priceUSD, valueUSD }
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
