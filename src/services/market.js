export const COINGECKO_IDS = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  USDC: 'usd-coin',
}

export async function getMarketRates() {
  const ids = Object.values(COINGECKO_IDS).join(',')
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
  )
  if (!res.ok) throw new Error('Failed to fetch market rates')
  const data = await res.json()

  return Object.fromEntries(
    Object.entries(COINGECKO_IDS).map(([symbol, id]) => [
      symbol,
      {
        priceUSD: data[id]?.usd ?? null,
        change24h: data[id]?.usd_24h_change ?? null,
      },
    ])
  )
}

export async function getMarketOverview(symbol) {
  const id = COINGECKO_IDS[symbol]
  if (!id) return null

  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&price_change_percentage=24h`
  )
  if (!res.ok) throw new Error('Failed to fetch market overview')
  const [data] = await res.json()
  if (!data) return null

  return {
    priceUSD: data.current_price,
    change24h: data.price_change_percentage_24h,
    marketCap: data.market_cap,
    volume24h: data.total_volume,
    high24h: data.high_24h,
    low24h: data.low_24h,
    ath: data.ath,
    athChangePercent: data.ath_change_percentage,
  }
}

export async function getMarketChart(symbol, days = 1) {
  const id = COINGECKO_IDS[symbol]
  if (!id) return []

  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  )
  if (!res.ok) throw new Error('Failed to fetch market chart')
  const data = await res.json()

  return (data.prices || []).map(([timestamp, price]) => ({ timestamp, price }))
}
