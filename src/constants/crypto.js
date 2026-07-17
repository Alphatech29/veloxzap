const ICON_BASE = 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color'


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
    asset: 'USDT_TRC20',
    symbol: 'USDT',
    name: 'Tether(USDT)',
    network: 'TRC20 · Tron',
    icon: `${ICON_BASE}/usdt.png`,
    priceUSD: 1,
    decimals: 2,
  },
  {
    asset: 'USDC_SOL',
    symbol: 'USDC',
    name: 'USDC',
    network: 'Solana',
    icon: `${ICON_BASE}/usdc.png`,
    priceUSD: 1,
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

export function buildCoins(balances, rates) {
  return COINS.map(coin => {
    const amount = Number(balances?.[BALANCE_FIELD[coin.asset]]) || 0
    const livePrice = rates?.[coin.symbol]?.priceUSD
    const priceUSD = livePrice != null ? livePrice : coin.priceUSD
    return { ...coin, amount, priceUSD, valueUSD: amount * priceUSD }
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
