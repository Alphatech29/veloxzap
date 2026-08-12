import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { ArrowLeft, TrendingUp, TrendingDown, ArrowDownLeft, RotateCcw, Sparkles } from 'lucide-react'
import useMarketDetail from '../../../hooks/useMarketDetail'
import { getCoinBySymbol, getMarketCoinBySymbol, formatUSD } from '../../../constants/crypto'

const RANGES = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '1Y', days: 365 },
]

const CHART_MARGIN = { top: 4, right: 4, bottom: 0, left: 4 }
const MIN_SPAN_FRACTION = 1 / 50

function formatCompactUSD(n) {
  if (n == null) return '—'
  return '$' + Number(n).toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 2 })
}

function formatChartTime(timestamp, days) {
  const d = new Date(timestamp)
  return days <= 1
    ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function clampDomain(lo, hi, [fullLo, fullHi], minSpan) {
  let span = hi - lo
  if (span > fullHi - fullLo) span = fullHi - fullLo
  if (span < minSpan) span = minSpan
  let newLo = lo
  let newHi = newLo + span
  if (newLo < fullLo) { newLo = fullLo; newHi = fullLo + span }
  if (newHi > fullHi) { newHi = fullHi; newLo = fullHi - span }
  return [newLo, newHi]
}

function dist(a, b) {
  return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
}

function midpoint(a, b) {
  return { clientX: (a.clientX + b.clientX) / 2, clientY: (a.clientY + b.clientY) / 2 }
}

export default function DesktopMarketDetail() {
  const navigate = useNavigate()
  const { symbol } = useParams()
  const upperSymbol = (symbol || '').toUpperCase()
  const coin = getMarketCoinBySymbol(upperSymbol)
  const depositCoin = getCoinBySymbol(upperSymbol)
  const [range, setRange] = useState(RANGES[0])

  const { overview, overviewLoading, chart, chartLoading } = useMarketDetail(upperSymbol, range.days)

  const chartData = useMemo(
    () => chart.map(p => ({ ...p, time: formatChartTime(p.timestamp, range.days) })),
    [chart, range.days]
  )

  const fullXDomain = useMemo(() => {
    if (!chartData.length) return null
    return [chartData[0].timestamp, chartData[chartData.length - 1].timestamp]
  }, [chartData])

  const fullYDomain = useMemo(() => {
    if (!chartData.length) return null
    const prices = chartData.map(p => p.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const pad = (max - min) * 0.08 || max * 0.01 || 1
    return [min - pad, max + pad]
  }, [chartData])

  const [viewXDomain, setViewXDomain] = useState(null)
  const [viewYDomain, setViewYDomain] = useState(null)
  const [lastFullXDomain, setLastFullXDomain] = useState(null)

  if (fullXDomain && fullYDomain && (
    !lastFullXDomain || lastFullXDomain[0] !== fullXDomain[0] || lastFullXDomain[1] !== fullXDomain[1]
  )) {
    setLastFullXDomain(fullXDomain)
    setViewXDomain(fullXDomain)
    setViewYDomain(fullYDomain)
  }

  const containerRef = useRef(null)
  const gestureRef = useRef(null)

  const isZoomed = !!(viewXDomain && fullXDomain && viewYDomain && fullYDomain && (
    Math.abs(viewXDomain[0] - fullXDomain[0]) > 1 ||
    Math.abs(viewXDomain[1] - fullXDomain[1]) > 1 ||
    Math.abs(viewYDomain[0] - fullYDomain[0]) > 0.0001 ||
    Math.abs(viewYDomain[1] - fullYDomain[1]) > 0.0001
  ))

  function getPlotRect() {
    const rect = containerRef.current.getBoundingClientRect()
    return {
      left: rect.left + CHART_MARGIN.left,
      top: rect.top + CHART_MARGIN.top,
      width: Math.max(rect.width - CHART_MARGIN.left - CHART_MARGIN.right, 1),
      height: Math.max(rect.height - CHART_MARGIN.top - CHART_MARGIN.bottom, 1),
    }
  }

  function screenToDomain(clientX, clientY, xDomain, yDomain) {
    const plot = getPlotRect()
    const xFrac = Math.min(1, Math.max(0, (clientX - plot.left) / plot.width))
    const yFrac = Math.min(1, Math.max(0, (clientY - plot.top) / plot.height))
    return [
      xDomain[0] + xFrac * (xDomain[1] - xDomain[0]),
      yDomain[1] - yFrac * (yDomain[1] - yDomain[0]),
    ]
  }

  function handleTouchStart(e) {
    if (!viewXDomain || !viewYDomain) return
    if (e.touches.length === 2) {
      const [t0, t1] = e.touches
      const mid = midpoint(t0, t1)
      gestureRef.current = {
        mode: 'pinch',
        startDist: dist(t0, t1),
        startXDomain: viewXDomain,
        startYDomain: viewYDomain,
        centerDomain: screenToDomain(mid.clientX, mid.clientY, viewXDomain, viewYDomain),
      }
    } else if (e.touches.length === 1) {
      gestureRef.current = {
        mode: 'pan',
        lastX: e.touches[0].clientX,
        lastY: e.touches[0].clientY,
      }
    }
  }

  function handleTouchMove(e) {
    const g = gestureRef.current
    if (!g || !fullXDomain || !fullYDomain || !viewXDomain || !viewYDomain) return
    e.preventDefault()

    if (g.mode === 'pinch' && e.touches.length === 2) {
      const [t0, t1] = e.touches
      const newDist = Math.max(dist(t0, t1), 1)
      const scale = g.startDist / newDist
      const startSpanX = g.startXDomain[1] - g.startXDomain[0]
      const startSpanY = g.startYDomain[1] - g.startYDomain[0]
      const spanX = startSpanX * scale
      const spanY = startSpanY * scale
      const fracX = (g.centerDomain[0] - g.startXDomain[0]) / startSpanX
      const fracY = (g.startYDomain[1] - g.centerDomain[1]) / startSpanY
      const newX0 = g.centerDomain[0] - fracX * spanX
      const newY1 = g.centerDomain[1] + fracY * spanY

      const minSpanX = (fullXDomain[1] - fullXDomain[0]) * MIN_SPAN_FRACTION
      const minSpanY = (fullYDomain[1] - fullYDomain[0]) * MIN_SPAN_FRACTION
      const [nx0, nx1] = clampDomain(newX0, newX0 + spanX, fullXDomain, minSpanX)
      const [ny0, ny1] = clampDomain(newY1 - spanY, newY1, fullYDomain, minSpanY)
      setViewXDomain([nx0, nx1])
      setViewYDomain([ny0, ny1])
    } else if (g.mode === 'pan' && e.touches.length === 1) {
      const touch = e.touches[0]
      const plot = getPlotRect()
      const dxPx = touch.clientX - g.lastX
      const dyPx = touch.clientY - g.lastY
      const spanX = viewXDomain[1] - viewXDomain[0]
      const spanY = viewYDomain[1] - viewYDomain[0]
      const dxDomain = -(dxPx / plot.width) * spanX
      const dyDomain = (dyPx / plot.height) * spanY

      const newX0 = viewXDomain[0] + dxDomain
      const newY0 = viewYDomain[0] + dyDomain
      const [nx0, nx1] = clampDomain(newX0, newX0 + spanX, fullXDomain, spanX)
      const [ny0, ny1] = clampDomain(newY0, newY0 + spanY, fullYDomain, spanY)
      setViewXDomain([nx0, nx1])
      setViewYDomain([ny0, ny1])
      gestureRef.current = { ...g, lastX: touch.clientX, lastY: touch.clientY }
    }
  }

  function handleTouchEnd(e) {
    if (e.touches.length === 0) {
      gestureRef.current = null
    } else if (e.touches.length === 1) {
      gestureRef.current = {
        mode: 'pan',
        lastX: e.touches[0].clientX,
        lastY: e.touches[0].clientY,
      }
    }
  }

  function handleMouseDown(e) {
    if (!viewXDomain || !viewYDomain) return
    gestureRef.current = { mode: 'pan', lastX: e.clientX, lastY: e.clientY }
  }

  function handleMouseMove(e) {
    const g = gestureRef.current
    if (!g || g.mode !== 'pan' || e.buttons !== 1 || !fullXDomain || !fullYDomain || !viewXDomain || !viewYDomain) return
    const plot = getPlotRect()
    const dxPx = e.clientX - g.lastX
    const dyPx = e.clientY - g.lastY
    const spanX = viewXDomain[1] - viewXDomain[0]
    const spanY = viewYDomain[1] - viewYDomain[0]
    const dxDomain = -(dxPx / plot.width) * spanX
    const dyDomain = (dyPx / plot.height) * spanY

    const newX0 = viewXDomain[0] + dxDomain
    const newY0 = viewYDomain[0] + dyDomain
    const [nx0, nx1] = clampDomain(newX0, newX0 + spanX, fullXDomain, spanX)
    const [ny0, ny1] = clampDomain(newY0, newY0 + spanY, fullYDomain, spanY)
    setViewXDomain([nx0, nx1])
    setViewYDomain([ny0, ny1])
    gestureRef.current = { ...g, lastX: e.clientX, lastY: e.clientY }
  }

  function handleMouseUp() {
    gestureRef.current = null
  }

  function handleWheel(e) {
    if (!fullXDomain || !fullYDomain || !viewXDomain || !viewYDomain) return
    e.preventDefault()
    const scale = e.deltaY > 0 ? 1.12 : 1 / 1.12
    const centerDomain = screenToDomain(e.clientX, e.clientY, viewXDomain, viewYDomain)
    const spanX = (viewXDomain[1] - viewXDomain[0]) * scale
    const spanY = (viewYDomain[1] - viewYDomain[0]) * scale
    const fracX = (centerDomain[0] - viewXDomain[0]) / (viewXDomain[1] - viewXDomain[0])
    const fracY = (viewYDomain[1] - centerDomain[1]) / (viewYDomain[1] - viewYDomain[0])
    const newX0 = centerDomain[0] - fracX * spanX
    const newY1 = centerDomain[1] + fracY * spanY

    const minSpanX = (fullXDomain[1] - fullXDomain[0]) * MIN_SPAN_FRACTION
    const minSpanY = (fullYDomain[1] - fullYDomain[0]) * MIN_SPAN_FRACTION
    const [nx0, nx1] = clampDomain(newX0, newX0 + spanX, fullXDomain, minSpanX)
    const [ny0, ny1] = clampDomain(newY1 - spanY, newY1, fullYDomain, minSpanY)
    setViewXDomain([nx0, nx1])
    setViewYDomain([ny0, ny1])
  }

  function handleReset() {
    if (fullXDomain) setViewXDomain(fullXDomain)
    if (fullYDomain) setViewYDomain(fullYDomain)
  }

  const change = overview?.change24h
  const positive = typeof change === 'number' && change >= 0

  const chartUp = chartData.length >= 2
    ? chartData[chartData.length - 1].price >= chartData[0].price
    : positive
  const chartColor = chartUp ? 'var(--c-success)' : 'var(--c-danger)'

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/user/wallet')}
          aria-label="Back to wallet"
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-accent-border)] transition shrink-0"
        >
          <ArrowLeft size={15} />
        </button>
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
            <Sparkles size={10} /> Market
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            {coin?.name || upperSymbol}
          </h1>
        </div>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-5">
            <div className="flex items-center gap-3 mb-4">
              {coin && <img src={coin.icon} alt={coin.symbol} className="w-11 h-11 rounded-full shrink-0" />}
              <div className="min-w-0">
                {overviewLoading ? (
                  <div aria-hidden className="w-[140px] h-[28px] rounded-md bg-[var(--c-surface-soft)] animate-pulse" />
                ) : (
                  <div className="text-[26px] font-bold tracking-[-0.5px] text-[var(--c-text)]">
                    {overview?.priceUSD != null ? formatUSD(overview.priceUSD) : '—'}
                  </div>
                )}
                {typeof change === 'number' && (
                  <span className={[
                    'inline-flex items-center gap-1 text-[13px] font-semibold tabular-nums',
                    positive ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]',
                  ].join(' ')}>
                    {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(change).toFixed(2)}% (24h)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[var(--c-text-faint)]">Drag to pan · scroll to zoom</span>
              {isZoomed && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-accent hover:opacity-80 transition"
                >
                  <RotateCcw size={11} /> Reset
                </button>
              )}
            </div>

            <div
              ref={containerRef}
              className="h-[340px] -mx-1 relative touch-none select-none cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              {chartLoading ? (
                <div aria-hidden className="w-full h-full rounded-xl bg-[var(--c-surface-soft)] animate-pulse" />
              ) : chartData.length > 0 && viewXDomain && viewYDomain ? (
                <>
                  <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-32 h-32 overflow-hidden rounded-xl opacity-[0.35]">
                      <img src="/logo-2.png" alt="" className="w-auto" />
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height="100%" className="relative z-10">
                    <AreaChart data={chartData} margin={CHART_MARGIN}>
                      <defs>
                        <linearGradient id="marketChartFillDesktop" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColor} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="timestamp" type="number" domain={viewXDomain} allowDataOverflow hide />
                      <YAxis domain={viewYDomain} allowDataOverflow hide />
                      <Tooltip
                        cursor={{ stroke: chartColor, strokeWidth: 1, strokeDasharray: '4 4' }}
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          const point = payload[0].payload
                          return (
                            <div className="rounded-lg bg-[var(--c-surface)] border border-[var(--c-accent-border)] px-2.5 py-1.5 shadow-[0_6px_18px_rgba(2,7,23,0.35)]">
                              <p className="text-[11px] font-bold text-[var(--c-text)] m-0 tabular-nums">
                                {formatUSD(point.price)}
                              </p>
                              <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 mt-0.5">{point.time}</p>
                            </div>
                          )
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={chartColor}
                        strokeWidth={2}
                        fill="url(#marketChartFillDesktop)"
                        isAnimationActive={false}
                        activeDot={{ r: 5, stroke: '#0A1F44', strokeWidth: 2, fill: chartColor }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[12px] text-[var(--c-text-faint)]">
                  No chart data available
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-3">
              {RANGES.map(r => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setRange(r)}
                  className={[
                    'px-3 py-1.5 rounded-md text-[11px] font-semibold transition',
                    range.label === r.label
                      ? 'bg-[var(--c-surface-soft)] text-[var(--c-text)] border border-[var(--c-accent-border)]'
                      : 'text-[var(--c-text-muted)] hover:text-[var(--c-text)]',
                  ].join(' ')}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </article>

          <div className="grid grid-cols-2 min-[560px]:grid-cols-4 gap-3">
            <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-3.5">
              <p className="text-[9.5px] uppercase tracking-[0.9px] text-[var(--c-text-muted)] m-0">Market cap</p>
              <p className="text-[14px] font-bold text-[var(--c-text)] m-0 mt-1">{formatCompactUSD(overview?.marketCap)}</p>
            </div>
            <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-3.5">
              <p className="text-[9.5px] uppercase tracking-[0.9px] text-[var(--c-text-muted)] m-0">24h volume</p>
              <p className="text-[14px] font-bold text-[var(--c-text)] m-0 mt-1">{formatCompactUSD(overview?.volume24h)}</p>
            </div>
            <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-3.5">
              <p className="text-[9.5px] uppercase tracking-[0.9px] text-[var(--c-text-muted)] m-0">24h high</p>
              <p className="text-[14px] font-bold text-[var(--c-text)] m-0 mt-1">
                {overview?.high24h != null ? formatUSD(overview.high24h) : '—'}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-3.5">
              <p className="text-[9.5px] uppercase tracking-[0.9px] text-[var(--c-text-muted)] m-0">24h low</p>
              <p className="text-[14px] font-bold text-[var(--c-text)] m-0 mt-1">
                {overview?.low24h != null ? formatUSD(overview.low24h) : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">
          {depositCoin && (
            <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-accent-border)] overflow-hidden">
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <img src={depositCoin.icon} alt={depositCoin.symbol} className="w-9 h-9 rounded-full shrink-0" />
                  <div className="leading-tight">
                    <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0">{depositCoin.name}</p>
                    <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">Held in your crypto wallet</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/user/wallet/coin/${depositCoin.symbol.toLowerCase()}`)}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[12.5px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.28)] hover:-translate-y-px transition"
                >
                  <ArrowDownLeft size={14} /> Deposit {depositCoin.symbol}
                </button>
              </div>
            </article>
          )}

          <article className="rounded-xl border border-[var(--c-border-soft)] bg-[var(--c-surface-soft)] p-3.5 flex items-start gap-2.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
              <Sparkles size={13} />
            </span>
            <div className="leading-snug">
              <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">Indicative pricing</p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Prices update in real time and may vary slightly from execution price.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
