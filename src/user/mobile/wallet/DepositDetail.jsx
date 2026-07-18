import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Copy, Check, Clock, ShieldCheck, ExternalLink } from 'lucide-react'
import { COINS } from '../../../constants/crypto'
import { CRYPTO_DEPOSIT_STATUS } from '../../../constants/status'
import { fmtDate } from '../../../utils/format'
import MobilePageHeader from '../../../components/partials/MobilePageHeader'

function coinFor(asset) {
  return COINS.find(c => c.asset === asset) || null
}

const EXPLORER_URL = {
  BTC: (txId) => `https://mempool.space/tx/${txId}`,
  TRON: (txId) => `https://tronscan.org/#/transaction/${txId}`,
  SOL: (txId) => `https://solscan.io/tx/${txId}`,
}

function explorerUrlFor(chain, txId) {
  return EXPLORER_URL[chain]?.(txId) || null
}

export default function MobileDepositDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const [copied, setCopied] = useState(false)

  const deposit = location.state?.deposit

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
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-[12px] text-[var(--c-text-muted)] m-0">
            Open this deposit from your asset history to see its details.
          </p>
          <button
            type="button"
            onClick={() => navigate('/user/wallet/history')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[12px] font-bold border border-[rgba(232,197,71,0.55)] active:scale-[0.98] transition"
          >
            Go to asset history
          </button>
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
                <ShieldCheck size={10} /> Confirmations
              </span>
              <span className="text-[11.5px] font-bold tabular-nums text-[var(--c-text)]">
                {deposit.confirmations} / {deposit.required_confirmations}
              </span>
            </div>
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
              <span className="inline-flex items-center gap-1 text-[10.5px] text-[var(--c-text-muted)] font-medium">
                <Clock size={10} /> Received
              </span>
              <span className="text-[11.5px] font-bold text-[var(--c-text)]">{fmtDate(deposit.created_at)}</span>
            </div>
            {deposit.credited_at && (
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                <span className="text-[10.5px] text-[var(--c-text-muted)] font-medium">Credited</span>
                <span className="text-[11.5px] font-bold text-[var(--c-text)]">{fmtDate(deposit.credited_at)}</span>
              </div>
            )}
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
