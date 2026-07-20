import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Wallet, ShieldCheck, Sparkles, Info, ArrowDownLeft } from 'lucide-react'
import useCrypto from '../../../hooks/useCrypto'
import useMarketRates from '../../../hooks/useMarketRates'
import { buildCoins, formatCoinAmount, formatUSD } from '../../../constants/crypto'

const HERO_BG = `radial-gradient(700px 300px at 110% -10%, rgba(201,162,39,0.28), transparent 60%),
  radial-gradient(400px 300px at -5% 110%, rgba(232,197,71,0.14), transparent 60%),
  linear-gradient(145deg, rgba(16,36,80,0.99), rgba(8,24,56,1))`

export default function DesktopWallet() {
  const { balances, loading } = useCrypto()
  const { rates, loading: ratesLoading } = useMarketRates()
  const [hidden, setHidden] = useState(() => localStorage.getItem('vzap_hide_crypto_balance') === '1')

  const assetsLoading = loading || ratesLoading
  const coins = useMemo(() => buildCoins(balances, rates), [balances, rates])
  const totalUSD = useMemo(() => coins.reduce((sum, c) => sum + (c.valueUSD ?? 0), 0), [coins])

  function toggleHide() {
    setHidden(h => {
      localStorage.setItem('vzap_hide_crypto_balance', h ? '0' : '1')
      return !h
    })
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1320px] mx-auto pb-10">

      {/* Page header */}
      <header className="flex items-center justify-between gap-3 flex-wrap pt-1">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Assest balances
          </h1>
        </div>
      </header>

      {/* Total assets hero */}
      <article
        className="relative overflow-hidden rounded-2xl border border-[rgba(201,162,39,0.25)] shadow-[0_20px_56px_-20px_rgba(2,7,23,0.65)]"
        style={{ background: HERO_BG }}
      >
        <span aria-hidden className="pointer-events-none absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full bg-brand-accent/[0.14] blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 left-1/4 w-[200px] h-[200px] rounded-full bg-brand-accent/[0.07] blur-3xl" />

        <div className="relative flex flex-col gap-6 p-6 min-[860px]:p-8">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/[0.12] text-[9.5px] uppercase tracking-[1px] text-white/75 font-bold">
              <ShieldCheck size={11} className="text-brand-accent" /> Total assets
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/[0.12] text-[9.5px] uppercase tracking-[1px] text-white/60 font-bold">
              <Info size={10} /> Indicative rates
            </span>
          </div>

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
            <Link to="/user/deposit"
              className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[12px] font-bold border border-[rgba(232,197,71,0.5)] shadow-[0_4px_16px_rgba(201,162,39,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(201,162,39,0.45)] transition">
              <ArrowDownLeft size={13} strokeWidth={2.5} /> Deposit
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-between gap-2 px-6 py-2.5 border-t border-white/[0.06] bg-white/[0.015]">
          <span className="inline-flex items-center gap-1.5 text-[10px] text-white/40">
            <ShieldCheck size={11} className="text-brand-accent" /> Vault secured · 256-bit encryption
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

      {/* Coin list */}
      <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
        <header className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-[var(--c-border)]">
          <div>
            <h2 className="text-[13px] font-bold m-0 text-[var(--c-text)] tracking-[-0.15px]"> Assets</h2>
          </div>
        </header>

        {assetsLoading ? (
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
        )}
      </article>
    </div>
  )
}
