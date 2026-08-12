import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, EyeOff, ShieldCheck, Sparkles, Info, ArrowDownLeft, ChevronRight,
  TrendingUp, TrendingDown, ReceiptText, Newspaper, X,
} from 'lucide-react'
import useCrypto from '../../../hooks/useCrypto'
import useMarketRates from '../../../hooks/useMarketRates'
import useBlockchainNews from '../../../hooks/useBlockchainNews'
import { buildCoins, formatCoinAmount, formatUSD, MARKET_COINS } from '../../../constants/crypto'

const HERO_BG = `radial-gradient(700px 300px at 110% -10%, rgba(201,162,39,0.28), transparent 60%),
  radial-gradient(400px 300px at -5% 110%, rgba(232,197,71,0.14), transparent 60%),
  linear-gradient(145deg, rgba(16,36,80,0.99), rgba(8,24,56,1))`

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

function DepositPickerModal({ coins, onSelect, onClose }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[6px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose a coin to deposit"
          className="pointer-events-auto w-full max-w-[420px] max-h-[70vh] flex flex-col rounded-[20px] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(201,162,39,0.15)]"
          style={{ background: 'var(--c-surface)' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,162,39,0.1)] via-transparent to-transparent pointer-events-none" />
            <div className="relative flex items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="inline-flex items-center gap-1 text-[9.5px] uppercase tracking-[1.3px] font-bold text-brand-accent m-0">
                  <ArrowDownLeft size={9} /> Deposit
                </p>
                <h2 className="text-[16px] font-bold tracking-[-0.3px] text-[var(--c-text)] m-0 mt-0.5">Choose a coin</h2>
              </div>
              <button type="button" onClick={onClose} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] active:scale-90 transition shrink-0">
                <X size={14} />
              </button>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--c-border)] to-transparent" />
          </div>

          <ul className="m-0 list-none p-3 pb-4 flex flex-col gap-1 overflow-y-auto">
            {coins.map(coin => (
              <li key={coin.asset}>
                <button
                  type="button"
                  onClick={() => onSelect(coin)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[var(--c-surface-soft)] transition"
                >
                  <img src={coin.icon} alt={coin.symbol} className="w-9 h-9 rounded-full shrink-0" />
                  <div className="flex flex-col min-w-0 leading-tight flex-1">
                    <span className="text-[13px] font-semibold text-[var(--c-text)] truncate">{coin.name}</span>
                    {coin.network && <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5">{coin.network}</span>}
                  </div>
                  <ChevronRight size={14} className="text-[var(--c-text-faint)] shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </>
  )
}

export default function DesktopWallet() {
  const navigate = useNavigate()
  const { balances, loading } = useCrypto()
  const { rates, loading: ratesLoading } = useMarketRates()
  const { articles: news, loading: newsLoading } = useBlockchainNews()
  const [hidden, setHidden] = useState(() => localStorage.getItem('vzap_hide_crypto_balance') === '1')
  const [tab, setTab] = useState('market')
  const [depositPickerOpen, setDepositPickerOpen] = useState(false)

  const assetsLoading = loading || ratesLoading
  const coins = useMemo(() => buildCoins(balances, rates), [balances, rates])
  const totalUSD = useMemo(() => coins.reduce((sum, c) => sum + (c.valueUSD ?? 0), 0), [coins])
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

  function handleSelectDepositCoin(coin) {
    setDepositPickerOpen(false)
    navigate(`/user/wallet/coin/${coin.symbol.toLowerCase()}`)
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1320px] mx-auto pb-10">

      {/* Page header */}
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
            <Sparkles size={10} /> Crypto wallet
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Asset balances
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('/user/wallet/history')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent hover:border-[var(--c-accent-border-strong)] transition"
        >
          <ReceiptText size={10} /> Deposit history
        </button>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">

          {/* Total assets hero */}
          <article
            className="relative overflow-hidden rounded-2xl border border-[rgba(201,162,39,0.25)] shadow-[0_20px_56px_-20px_rgba(2,7,23,0.65)]"
            style={{ background: HERO_BG }}
          >
            <span aria-hidden className="pointer-events-none absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full bg-brand-accent/[0.14] blur-3xl" />
            <span aria-hidden className="pointer-events-none absolute bottom-0 left-1/4 w-[200px] h-[200px] rounded-full bg-brand-accent/[0.07] blur-3xl" />

            <div className="relative flex flex-col gap-6 p-6 min-[860px]:p-8">


              <div className="flex items-end gap-3">
                {assetsLoading ? (
                  <span aria-hidden className="inline-block w-[220px] h-[44px] rounded-lg bg-white/[0.07] animate-pulse" />
                ) : (
                  <span className="text-[42px] font-black tracking-[-1.2px] text-white leading-none tabular-nums">
                    {hidden ? '$ ••••••' : formatUSD(totalUSD)}
                  </span>
                )}
                <button type="button" onClick={toggleHide}
                  aria-label={hidden ? 'Show balance' : 'Hide balance'}
                  className="inline-flex items-center justify-center w-8 h-8 mb-0.5 rounded-lg bg-white/[0.08] border border-white/[0.14] text-white/80 hover:bg-white/[0.14] hover:text-white transition shrink-0">
                  {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button
                  type="button"
                  onClick={() => setDepositPickerOpen(true)}
                  className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[12px] font-bold border border-[rgba(232,197,71,0.5)] shadow-[0_4px_16px_rgba(201,162,39,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(201,162,39,0.45)] transition">
                   Deposit
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-between gap-2 px-6 py-2.5 border-t border-white/[0.06] bg-white/[0.015]">
              <span className="inline-flex items-center gap-1.5 text-[10px] text-white/40">
                <ShieldCheck size={11} className="text-brand-accent" /> Vault secured
              </span>
              {loading ? (
                <span aria-hidden className="inline-block w-24 h-2.5 rounded bg-white/[0.08] animate-pulse" />
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] text-white/40">
                  <Sparkles size={10} className="text-brand-accent" /> {coins.length} coins tracked
                </span>
              )}
            </div>
          </article>

          {/* Tabs */}
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border)]">
              <button
                type="button"
                onClick={() => setTab('market')}
                className={[
                  'px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition',
                  tab === 'market' ? 'bg-[var(--c-surface)] text-[var(--c-text)] shadow-sm' : 'text-[var(--c-text-muted)]',
                ].join(' ')}
              >
                Market
              </button>
              <button
                type="button"
                onClick={() => setTab('assets')}
                className={[
                  'px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition',
                  tab === 'assets' ? 'bg-[var(--c-surface)] text-[var(--c-text)] shadow-sm' : 'text-[var(--c-text-muted)]',
                ].join(' ')}
              >
                Assets
              </button>
            </div>

            {tab === 'market' && (
              <span className="inline-flex items-center gap-1 text-[10px] text-[var(--c-text-faint)]">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--c-success)] animate-ping opacity-60" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[var(--c-success)]" />
                </span>
                Live
              </span>
            )}
          </div>

          {/* Coin / market list */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
            {tab === 'assets' ? (
              assetsLoading ? (
                <ul className="m-0 list-none p-0">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className={`flex items-center gap-3 px-5 py-3.5 ${i > 0 ? 'border-t border-[var(--c-border)]' : ''}`}>
                      <span aria-hidden className="w-9 h-9 rounded-full bg-[var(--c-surface-soft)] animate-pulse shrink-0" />
                      <div className="flex-1 flex flex-col gap-1.5">
                        <span aria-hidden className="h-3 w-2/5 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                        <span aria-hidden className="h-2.5 w-1/4 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                      </div>
                      <span aria-hidden className="h-3 w-20 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="m-0 list-none p-0">
                  {coins.map((coin, i) => (
                    <li key={coin.asset}
                      className={[
                        'grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3.5',
                        i > 0 ? 'border-t border-[var(--c-border)]' : '',
                      ].join(' ')}>

                      <img src={coin.icon} alt={coin.symbol} className="w-9 h-9 rounded-full shrink-0" />

                      <div className="flex flex-col min-w-0 leading-tight">
                        <span className="text-[13px] font-semibold text-[var(--c-text)] truncate">
                          {coin.name} <span className="text-[var(--c-text-muted)] font-medium">({coin.symbol})</span>
                        </span>
                        {coin.network && (
                          <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5">{coin.network}</span>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[13px] font-bold tabular-nums text-[var(--c-text)] whitespace-nowrap">
                          {hidden ? '••••••' : `${formatCoinAmount(coin.amount, coin.decimals)} ${coin.symbol}`}
                        </span>
                        <span className="text-[11px] tabular-nums text-[var(--c-text-muted)] font-medium whitespace-nowrap">
                          {hidden ? '••••' : coin.valueUSD != null ? formatUSD(coin.valueUSD) : '—'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              ratesLoading ? (
                <ul className="m-0 list-none p-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <li key={i} className={`flex items-center gap-3 px-5 py-3.5 ${i > 0 ? 'border-t border-[var(--c-border)]' : ''}`}>
                      <span aria-hidden className="w-9 h-9 rounded-full bg-[var(--c-surface-soft)] animate-pulse shrink-0" />
                      <div className="flex-1 flex flex-col gap-1.5">
                        <span aria-hidden className="h-3 w-2/5 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                      </div>
                      <span aria-hidden className="h-3 w-20 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="m-0 list-none p-0">
                  {MARKET_COINS.map((coin, i) => {
                    const rate = rates[coin.symbol]
                    const change = rate?.change24h
                    const positive = typeof change === 'number' && change >= 0
                    return (
                      <li key={coin.symbol} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                        <button
                          type="button"
                          onClick={() => navigate(`/user/wallet/market/${coin.symbol.toLowerCase()}`)}
                          className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3.5 text-left hover:bg-[var(--c-surface-soft)] transition"
                        >
                          <img src={coin.icon} alt={coin.symbol} className="w-9 h-9 rounded-full shrink-0" />

                          <div className="flex flex-col min-w-0 leading-tight">
                            <span className="text-[13px] font-semibold text-[var(--c-text)] truncate">{coin.symbol}</span>
                            <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5 truncate">{coin.name}</span>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[13px] font-bold tabular-nums text-[var(--c-text)] whitespace-nowrap">
                              {rate?.priceUSD != null ? formatUSD(rate.priceUSD) : '—'}
                            </span>
                            {typeof change === 'number' && (
                              <span className={[
                                'inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums whitespace-nowrap',
                                positive ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]',
                              ].join(' ')}>
                                {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
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
          </article>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)]">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)]">
                Blockchain news
              </h3>
            </header>

            {newsLoading ? (
              <ul className="m-0 list-none">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className={`flex items-center gap-2.5 px-3.5 py-2.5 ${i > 0 ? 'border-t border-[var(--c-border)]' : ''}`}>
                    <span aria-hidden className="w-12 h-12 rounded-lg bg-[var(--c-surface-soft)] animate-pulse shrink-0" />
                    <div className="flex-1 flex flex-col gap-1.5">
                      <span aria-hidden className="h-2.5 w-full rounded bg-[var(--c-surface-soft)] animate-pulse" />
                      <span aria-hidden className="h-2.5 w-3/5 rounded bg-[var(--c-surface-soft)] animate-pulse" />
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
                {news.slice(0, 6).map((article, i) => (
                  <li key={article.id || article.url} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                    <button
                      type="button"
                      onClick={() => navigate(`/user/wallet/news/${article.id || i}`, { state: { article } })}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left hover:bg-[var(--c-surface-soft)] transition"
                    >
                      {article.image ? (
                        <img src={article.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      ) : (
                        <span aria-hidden className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[var(--c-surface-soft)] text-[var(--c-text-faint)] shrink-0">
                          <Newspaper size={15} />
                        </span>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <p className="text-[11px] font-semibold text-[var(--c-text)] leading-snug m-0 line-clamp-2">
                          {article.title}
                        </p>
                        <span className="text-[9.5px] text-[var(--c-text-muted)]">
                          {article.source}{article.publishedAt ? ` · ${timeAgo(article.publishedAt)}` : ''}
                        </span>
                      </div>
                      <ChevronRight size={13} className="text-[var(--c-text-faint)] shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="rounded-xl border border-[var(--c-border-soft)] bg-[var(--c-surface-soft)] p-3 flex items-start gap-2.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
              <ShieldCheck size={13} />
            </span>
            <div className="leading-snug">
              <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">Funds credited automatically</p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Deposits are confirmed on-chain and reflected in your balance without manual review.
              </p>
            </div>
          </article>
        </div>
      </section>

      <AnimatePresence>
        {depositPickerOpen && (
          <DepositPickerModal
            coins={depositCoins}
            onSelect={handleSelectDepositCoin}
            onClose={() => setDepositPickerOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
