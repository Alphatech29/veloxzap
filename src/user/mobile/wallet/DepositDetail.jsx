import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Copy, Check, ExternalLink } from 'lucide-react'
import useCryptoDeposits from '../../../hooks/useCryptoDeposits'
import { COINS } from '../../../constants/crypto'
import { CRYPTO_DEPOSIT_STATUS } from '../../../constants/status'
import { fmtDate } from '../../../utils/format'
import MobilePageHeader from '../../../components/partials/MobilePageHeader'


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

export default function MobileDepositDetail() {
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
    <div className="flex flex-col gap-4">
      <MobilePageHeader title="Deposit details" />

      {!deposit ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 py-2">
            <span aria-hidden className="w-12 h-12 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
            <span aria-hidden className="w-32 h-6 rounded-md bg-[var(--c-surface-soft)] animate-pulse mt-1" />
            <span aria-hidden className="w-16 h-4 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
          </div>
          <div aria-hidden className="h-40 rounded-xl bg-[var(--c-surface-soft)] animate-pulse" />
          <div aria-hidden className="h-24 rounded-xl bg-[var(--c-surface-soft)] animate-pulse" />
          <div aria-hidden className="h-16 rounded-xl bg-[var(--c-surface-soft)] animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-2 py-2">
            {coin ? (
              <img src={coin.icon} alt={coin.symbol} className="w-12 h-12 rounded-full" />
            ) : (
              <span aria-hidden className="w-12 h-12 rounded-full bg-[var(--c-surface-soft)]" />
            )}
            <p className="text-[22px] font-bold tracking-[-0.4px] text-[var(--c-text)] tabular-nums m-0 mt-1">
              {Number(deposit.amount).toLocaleString('en-US', { maximumFractionDigits: coin?.decimals ?? 8 })} {coin?.symbol || deposit.asset}
            </p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold ${statusMeta.cls}`}>
              {statusMeta.label}
            </span>
          </div>

          <div className="rounded-xl border border-[var(--c-border)] divide-y divide-[var(--c-border)] overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
              <span className="text-[10.5px] text-[var(--c-text-muted)] font-medium">Coin</span>
              <span className="text-[11.5px] font-bold text-[var(--c-text)]">{coin?.name || deposit.asset}</span>
            </div>
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
              <span className="text-[10.5px] text-[var(--c-text-muted)] font-medium">Network</span>
              <span className="text-[11.5px] font-bold text-[var(--c-text)]">{deposit.chain}</span>
            </div>
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
              <span className="inline-flex items-center gap-1 text-[10.5px] text-[var(--c-text-muted)] font-medium">
                Confirmations
              </span>
              <span className="text-[11.5px] font-bold tabular-nums text-[var(--c-text)]">
                {deposit.confirmations} / {deposit.required_confirmations}
              </span>
            </div>
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
              <span className="inline-flex items-center gap-1 text-[10.5px] text-[var(--c-text-muted)] font-medium">
                Time
              </span>
              <span className="text-[11.5px] font-bold text-[var(--c-text)]">{fmtDate(deposit.created_at)}</span>
            </div>
          </div>

          <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] p-3.5">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[9px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)]">
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
            <p className="text-[10.5px] font-mono text-[var(--c-text)] break-all m-0">
              {deposit.tx_id}
            </p>
            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-[10.5px] font-bold text-brand-accent active:scale-95 transition"
              >
                <ExternalLink size={11} /> View on explorer
              </a>
            )}
          </div>

          <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] p-3.5">
            <p className="text-[9px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0 mb-1.5">
              Deposit address
            </p>
            <p className="text-[10.5px] font-mono text-[var(--c-text)] break-all m-0">
              {deposit.address}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
