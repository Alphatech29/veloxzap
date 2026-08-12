import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Copy, Check, ExternalLink, Sparkles } from 'lucide-react'
import useCryptoDeposits from '../../../hooks/useCryptoDeposits'
import { COINS } from '../../../constants/crypto'
import { CRYPTO_DEPOSIT_STATUS } from '../../../constants/status'
import { fmtDate } from '../../../utils/format'

const MAX_SEARCH_RESULTS = 400

function coinFor(asset) {
  return COINS.find(c => c.asset === asset) || null
}

const EXPLORER_URL = {
  BTC: (txId) => `https://mempool.space/tx/${txId}`,
  TRON: (txId) => `https://tronscan.org/#/transaction/${txId}`,
  SOL: (txId) => `https://explorer.solana.com/tx/${txId}`,
}

function explorerUrlFor(chain, txId) {
  return EXPLORER_URL[chain]?.(txId) || null
}

export default function DesktopDepositDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const [copied, setCopied] = useState(false)

  const stateDeposit = location.state?.deposit
  const needsSearch = !stateDeposit && !!id

  const { deposits, loading: depositsLoading, loadingMore, hasMore, loadMore } = useCryptoDeposits({ auto: needsSearch })
  const foundDeposit = needsSearch ? deposits.find(d => String(d.id) === String(id)) : null
  const deposit = stateDeposit || foundDeposit

  useEffect(() => {
    if (!needsSearch || foundDeposit) return
    if (depositsLoading || loadingMore) return
    if (!hasMore || deposits.length >= MAX_SEARCH_RESULTS) return
    loadMore()
  }, [needsSearch, foundDeposit, depositsLoading, loadingMore, hasMore, deposits.length, loadMore])

  function handleCopyTxId() {
    if (!deposit) return
    if (navigator.clipboard) navigator.clipboard.writeText(deposit.tx_id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const coin = deposit ? coinFor(deposit.asset) : null
  const statusMeta = deposit ? (CRYPTO_DEPOSIT_STATUS[deposit.status] || CRYPTO_DEPOSIT_STATUS.pending) : null
  const explorerUrl = deposit ? explorerUrlFor(deposit.chain, deposit.tx_id) : null

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/user/wallet/history')}
          aria-label="Back to deposit history"
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-accent-border)] transition shrink-0"
        >
          <ArrowLeft size={15} />
        </button>
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
            <Sparkles size={10} /> Crypto wallet
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">Deposit details</h1>
        </div>
      </header>

      {!deposit ? (
        <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 py-6">
              <span aria-hidden className="w-14 h-14 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
              <span aria-hidden className="w-40 h-7 rounded-md bg-[var(--c-surface-soft)] animate-pulse mt-1" />
              <span aria-hidden className="w-20 h-5 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
            </div>
            <div aria-hidden className="h-40 rounded-xl bg-[var(--c-surface-soft)] animate-pulse" />
          </div>
          <div aria-hidden className="h-40 rounded-xl bg-[var(--c-surface-soft)] animate-pulse" />
        </section>
      ) : (
        <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
          <div className="flex flex-col gap-4">
            <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-5">
              <div className="flex flex-col items-center gap-2 py-2">
                {coin ? (
                  <img src={coin.icon} alt={coin.symbol} className="w-14 h-14 rounded-full" />
                ) : (
                  <span aria-hidden className="w-14 h-14 rounded-full bg-[var(--c-surface-soft)]" />
                )}
                <p className="text-[26px] font-bold tracking-[-0.4px] text-[var(--c-text)] tabular-nums m-0 mt-1">
                  {Number(deposit.amount).toLocaleString('en-US', { maximumFractionDigits: coin?.decimals ?? 8 })} {coin?.symbol || deposit.asset}
                </p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${statusMeta.cls}`}>
                  {statusMeta.label}
                </span>
              </div>
            </article>

            <article className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] divide-y divide-[var(--c-border)] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--c-surface-soft)]">
                <span className="text-[11px] text-[var(--c-text-muted)] font-medium">Coin</span>
                <span className="text-[12.5px] font-bold text-[var(--c-text)]">{coin?.name || deposit.asset}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--c-surface-soft)]">
                <span className="text-[11px] text-[var(--c-text-muted)] font-medium">Network</span>
                <span className="text-[12.5px] font-bold text-[var(--c-text)]">{deposit.chain}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--c-surface-soft)]">
                <span className="text-[11px] text-[var(--c-text-muted)] font-medium">Confirmations</span>
                <span className="text-[12.5px] font-bold tabular-nums text-[var(--c-text)]">
                  {deposit.confirmations} / {deposit.required_confirmations}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--c-surface-soft)]">
                <span className="text-[11px] text-[var(--c-text-muted)] font-medium">Time</span>
                <span className="text-[12.5px] font-bold text-[var(--c-text)]">{fmtDate(deposit.created_at)}</span>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">
            <article className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] p-4">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)]">
                  Transaction hash
                </span>
                <button
                  type="button"
                  onClick={handleCopyTxId}
                  className={[
                    'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-bold active:scale-95 transition shrink-0',
                    copied
                      ? 'bg-[var(--c-success-bg)] text-[var(--c-success)]'
                      : 'bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]',
                  ].join(' ')}
                >
                  {copied ? <><Check size={11} strokeWidth={2.8} /> Copied</> : <><Copy size={11} /> Copy</>}
                </button>
              </div>
              <p className="text-[11px] font-mono text-[var(--c-text)] break-all m-0">
                {deposit.tx_id}
              </p>
              {explorerUrl && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-[10.5px] font-bold text-brand-accent hover:opacity-80 transition"
                >
                  <ExternalLink size={11} /> View on explorer
                </a>
              )}
            </article>

            <article className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] p-4">
              <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0 mb-1.5">
                Deposit address
              </p>
              <p className="text-[11px] font-mono text-[var(--c-text)] break-all m-0">
                {deposit.address}
              </p>
            </article>
          </div>
        </section>
      )}
    </div>
  )
}
