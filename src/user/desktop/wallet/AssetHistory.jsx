import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import useCryptoDeposits from '../../../hooks/useCryptoDeposits'
import { COINS } from '../../../constants/crypto'
import { CRYPTO_DEPOSIT_STATUS } from '../../../constants/status'
import { fmtDate } from '../../../utils/format'

function coinFor(asset) {
  return COINS.find(c => c.asset === asset) || null
}

function formatAmount(deposit) {
  const coin = coinFor(deposit.asset)
  const decimals = coin?.decimals ?? 8
  return Number(deposit.amount).toLocaleString('en-US', { maximumFractionDigits: decimals })
}

export default function DesktopAssetHistory() {
  const navigate = useNavigate()
  const { deposits, loading, loadingMore, hasMore, loadMore } = useCryptoDeposits()

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
            <Sparkles size={10} /> Crypto wallet
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">Deposit history</h1>
        </div>
      </header>

      <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
        {loading ? (
          <ul className="m-0 list-none p-0">
            {Array.from({ length: 6 }).map((_, i) => (
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
        ) : deposits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-[12.5px] text-[var(--c-text-faint)] m-0">No deposits yet</p>
          </div>
        ) : (
          <ul className="m-0 list-none p-0">
            {deposits.map((deposit, i) => {
              const coin = coinFor(deposit.asset)
              const statusMeta = CRYPTO_DEPOSIT_STATUS[deposit.status] || CRYPTO_DEPOSIT_STATUS.pending
              return (
                <li key={deposit.id} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                  <button
                    type="button"
                    onClick={() => navigate(`/user/wallet/history/${deposit.id}`, { state: { deposit } })}
                    className="w-full grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-5 py-3.5 text-left hover:bg-[var(--c-surface-soft)] transition"
                  >
                    {coin ? (
                      <img src={coin.icon} alt={coin.symbol} className="w-9 h-9 rounded-full shrink-0" />
                    ) : (
                      <span aria-hidden className="w-9 h-9 rounded-full bg-[var(--c-surface-soft)] shrink-0" />
                    )}
                    <div className="flex flex-col min-w-0 leading-tight">
                      <span className="text-[13px] font-semibold text-[var(--c-text)] truncate">
                        {coin?.name || deposit.asset}
                      </span>
                      <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5">
                        {fmtDate(deposit.created_at)}
                      </span>
                    </div>
                    <span className="text-[13px] font-bold tabular-nums text-[var(--c-text)] whitespace-nowrap">
                      {formatAmount(deposit)} {coin?.symbol || deposit.asset}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold justify-self-end ${statusMeta.cls}`}>
                      {statusMeta.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </article>

      {hasMore && (
        <button
          type="button"
          onClick={() => loadMore()}
          disabled={loadingMore}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)] hover:border-[var(--c-accent-border)] transition disabled:opacity-60 self-center"
        >
          {loadingMore ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  )
}
