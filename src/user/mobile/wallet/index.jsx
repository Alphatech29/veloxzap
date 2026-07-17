import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, Sparkles, Info, ArrowDownLeft, ChevronRight, TrendingUp, TrendingDown, ReceiptText, Newspaper } from 'lucide-react'
import useCrypto from '../../../hooks/useCrypto'
import useMarketRates from '../../../hooks/useMarketRates'
import useBlockchainNews from '../../../hooks/useBlockchainNews'
import { buildCoins, formatCoinAmount, formatUSD, MARKET_COINS } from '../../../constants/crypto'
import BottomSheet from '../../../components/internalUI/BottomSheet'

function timeAgo(iso) {
  if (!iso) return ''
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const BALANCE_BG = `radial-gradient(540px 240px at 110% -10%, rgba(201, 162, 39, 0.32), transparent 60%), radial-gradient(360px 180px at -10% 110%, rgba(232, 197, 71, 0.16), transparent 60%), linear-gradient(135deg, rgba(20, 42, 92, 0.95), rgba(10, 31, 68, 1))`

export default function MobileWallet() {
  const navigate = useNavigate()
  const { balances, loading } = useCrypto()
  const { rates, loading: ratesLoading } = useMarketRates()
  const { articles: news, loading: newsLoading } = useBlockchainNews()
  const [hidden, setHidden] = useState(() => localStorage.getItem('vzap_hide_crypto_balance') === '1')
  const [depositSheetOpen, setDepositSheetOpen] = useState(false)
  const [tab, setTab] = useState('market')

  const coins = useMemo(() => buildCoins(balances, rates), [balances, rates])
  const totalUSD = useMemo(() => coins.reduce((sum, c) => sum + c.valueUSD, 0), [coins])
  const depositCoins = useMemo(() => {
    const seen = new Set()
    return coins.filter(coin => {
      if (seen.has(coin.symbol)) return false
      seen.add(coin.symbol)
      return true
    })
  }, [coins])

  function toggleHide() {
    setHidden(h => {
      localStorage.setItem('vzap_hide_crypto_balance', h ? '0' : '1')
      return !h
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <article
        className="relative overflow-hidden px-3.5 py-2 rounded-2xl border border-[rgba(201,162,39,0.32)] text-text shadow-[0_18px_44px_-14px_rgba(2,7,23,0.55)]"
        style={{ background: BALANCE_BG }}
      >
        <span aria-hidden className="absolute -top-12 -right-12 w-[180px] h-[180px] rounded-full bg-brand-accent/15 blur-3xl pointer-events-none" />
        <span aria-hidden className="absolute -bottom-12 -left-10 w-[150px] h-[150px] rounded-full bg-brand-gold-soft/10 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[1.2px] text-brand-accent font-semibold">
              Total assets
            </span>
            <button
              type="button"
              onClick={toggleHide}
              aria-label={hidden ? 'Show balance' : 'Hide balance'}
              className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white/[0.08] border border-white/[0.16] active:scale-95 transition"
            >
              {hidden ? <EyeOff size={11} /> : <Eye size={11} />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/user/wallet/history')}
            aria-label="Asset history"
            className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white/[0.08] border border-white/[0.16] active:scale-95 transition"
          >
            <ReceiptText size={11} />
          </button>
        </div>

        <div className="relative flex items-end justify-between gap-2.5 mt-6 py-2">
          <div className="min-w-0">
            {loading ? (
              <div aria-hidden className="w-[140px] h-[22px] rounded-md bg-white/[0.08] border border-white/[0.10] animate-pulse" />
            ) : (
              <div className="text-[20px] font-bold tracking-[-0.5px] truncate">
                {hidden ? '$••••••' : formatUSD(totalUSD)}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setDepositSheetOpen(true)}
            className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.3)] active:scale-[0.97] transition"
          >

            <span className="text-[11px] font-bold">Deposit</span>
          </button>
        </div>


      </article>

      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border)]">
            <button
              type="button"
              onClick={() => setTab('market')}
              className={[
                'px-3 py-1 rounded-md text-[11px] font-semibold transition',
                tab === 'market' ? 'bg-[var(--c-surface)] text-[var(--c-text)] shadow-sm' : 'text-[var(--c-text-muted)]',
              ].join(' ')}
            >
              Market
            </button>
            <button
              type="button"
              onClick={() => setTab('assets')}
              className={[
                'px-3 py-1 rounded-md text-[11px] font-semibold transition',
                tab === 'assets' ? 'bg-[var(--c-surface)] text-[var(--c-text)] shadow-sm' : 'text-[var(--c-text-muted)]',
              ].join(' ')}
            >
              Assets
            </button>
          </div>

          {tab === 'market' && (
            <span className="inline-flex items-center gap-1 text-[9.5px] text-[var(--c-text-faint)]">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--c-success)] animate-ping opacity-60" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[var(--c-success)]" />
              </span>
              Live
            </span>
          )}
        </div>

        <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
          {tab === 'assets' ? (
            loading ? (
              <ul className="m-0 list-none">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className={`flex items-center gap-2.5 px-3 py-2.5 ${i > 0 ? 'border-t border-[var(--c-border)]' : ''}`}>
                    <span aria-hidden className="w-8 h-8 rounded-full bg-[var(--c-surface-soft)] animate-pulse shrink-0" />
                    <div className="flex-1 flex flex-col gap-1">
                      <span aria-hidden className="h-2.5 w-2/5 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                      <span aria-hidden className="h-2 w-1/4 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                    </div>
                    <span aria-hidden className="h-2.5 w-14 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="m-0 list-none">
                {coins.map((coin, i) => (
                  <li key={coin.asset}
                    className={[
                      'grid grid-cols-[auto_1fr_auto] items-center gap-2.5 px-3 py-2.5',
                      i > 0 ? 'border-t border-[var(--c-border)]' : '',
                    ].join(' ')}>

                    <img src={coin.icon} alt={coin.symbol} className="w-8 h-8 rounded-full shrink-0" />

                    <div className="flex flex-col min-w-0 leading-tight">
                      <span className="text-[12px] font-semibold text-[var(--c-text)] truncate">
                        {coin.name}
                      </span>
                      {coin.network && (
                        <span className="text-[9.5px] text-[var(--c-text-muted)] mt-0.5 truncate">{coin.network}</span>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[11.5px] font-bold tabular-nums text-[var(--c-text)] whitespace-nowrap">
                        {hidden ? '••••••' : `${formatCoinAmount(coin.amount, coin.decimals)} ${coin.symbol}`}
                      </span>
                      <span className="text-[10px] tabular-nums text-[var(--c-text-muted)] font-medium whitespace-nowrap">
                        {hidden ? '••••' : formatUSD(coin.valueUSD)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : (
            ratesLoading ? (
              <ul className="m-0 list-none">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className={`flex items-center gap-2.5 px-3 py-2.5 ${i > 0 ? 'border-t border-[var(--c-border)]' : ''}`}>
                    <span aria-hidden className="w-8 h-8 rounded-full bg-[var(--c-surface-soft)] animate-pulse shrink-0" />
                    <div className="flex-1 flex flex-col gap-1">
                      <span aria-hidden className="h-2.5 w-2/5 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                    </div>
                    <span aria-hidden className="h-2.5 w-14 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="m-0 list-none">
                {MARKET_COINS.map((coin, i) => {
                  const rate = rates[coin.symbol]
                  const change = rate?.change24h
                  const positive = typeof change === 'number' && change >= 0
                  return (
                    <li key={coin.symbol}
                      className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                      <button
                        type="button"
                        onClick={() => navigate(`/user/wallet/market/${coin.symbol.toLowerCase()}`)}
                        className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-2.5 px-3 py-2.5 text-left active:bg-[var(--c-surface-soft)] transition"
                      >
                        <img src={coin.icon} alt={coin.symbol} className="w-8 h-8 rounded-full shrink-0" />

                        <div className="flex flex-col min-w-0 leading-tight">
                          <span className="text-[12px] font-semibold text-[var(--c-text)] truncate">
                            {coin.symbol}
                          </span>
                          <span className="text-[9.5px] text-[var(--c-text-muted)] mt-0.5 truncate">{coin.name}</span>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[11.5px] font-bold tabular-nums text-[var(--c-text)] whitespace-nowrap">
                            {rate?.priceUSD != null ? formatUSD(rate.priceUSD) : '—'}
                          </span>
                          {typeof change === 'number' && (
                            <span className={[
                              'inline-flex items-center gap-0.5 text-[10px] font-semibold tabular-nums whitespace-nowrap',
                              positive ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]',
                            ].join(' ')}>
                              {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                              {Math.abs(change).toFixed(2)}%
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-1.5 mb-2">
          <h2 className="text-[12px] font-semibold m-0 text-[var(--c-text)] tracking-[-0.1px]">Blockchain news</h2>
        </div>

        <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
          {newsLoading ? (
            <ul className="m-0 list-none">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className={`flex items-center gap-2.5 px-3 py-2.5 ${i > 0 ? 'border-t border-[var(--c-border)]' : ''}`}>
                  <span aria-hidden className="w-14 h-14 rounded-lg bg-[var(--c-surface-soft)] animate-pulse shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span aria-hidden className="h-2.5 w-full rounded bg-[var(--c-surface-soft)] animate-pulse" />
                    <span aria-hidden className="h-2.5 w-3/5 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                    <span aria-hidden className="h-2 w-1/4 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                  </div>
                </li>
              ))}
            </ul>
          ) : news.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-1">
              <p className="text-[11.5px] text-[var(--c-text-faint)] m-0">No news available right now</p>
            </div>
          ) : (
            <ul className="m-0 list-none">
              {news.map((article, i) => (
                <li key={article.id || article.url}
                  className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                  <button
                    type="button"
                    onClick={() => navigate(`/user/wallet/news/${article.id || i}`, { state: { article } })}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left active:bg-[var(--c-surface-soft)] transition"
                  >
                    {article.image ? (
                      <img src={article.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                    ) : (
                      <span aria-hidden className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-[var(--c-surface-soft)] text-[var(--c-text-faint)] shrink-0">
                        <Newspaper size={16} />
                      </span>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <p className="text-[11.5px] font-semibold text-[var(--c-text)] leading-snug m-0 line-clamp-2">
                        {article.title}
                      </p>
                      <span className="text-[9.5px] text-[var(--c-text-muted)]">
                        {article.source}{article.publishedAt ? ` · ${timeAgo(article.publishedAt)}` : ''}
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-[var(--c-text-faint)] shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <BottomSheet
        open={depositSheetOpen}
        onClose={() => setDepositSheetOpen(false)}
        label="Deposit"
        title="Choose a coin"
      >
        <ul className="m-0 list-none p-0 pb-2">
          {depositCoins.map((coin, i) => (
            <li key={coin.asset}>
              <button
                type="button"
                onClick={() => {
                  setDepositSheetOpen(false)
                  navigate(`/user/wallet/coin/${coin.symbol.toLowerCase()}`)
                }}
                className={[
                  'w-full grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3 text-left active:bg-[var(--c-surface-soft)] transition',
                  i > 0 ? 'border-t border-[var(--c-border)]' : '',
                ].join(' ')}
              >
                <img src={coin.icon} alt={coin.symbol} className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="text-[13px] font-semibold text-[var(--c-text)] truncate">
                    {coin.name}
                  </span>
                </div>
                <ChevronRight size={14} className="text-[var(--c-text-faint)] shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </div>
  )
}
