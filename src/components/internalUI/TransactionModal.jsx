import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ArrowDownLeft, ArrowUpRight, Check, Clock, AlertCircle,
  Copy, Download, Share2, RotateCw, ShieldCheck, Sparkles,
  Receipt, Wallet, Building2, CreditCard, Smartphone, Wifi,
  ArrowLeftRight, Gift, RefreshCw,
} from 'lucide-react'

const STATUS_META = {
  completed: { label: 'Completed', icon: Check,       bg: 'var(--c-success-bg)',  fg: 'var(--c-success)' },
  pending:   { label: 'Pending',   icon: Clock,       bg: 'var(--c-warn-bg)',     fg: 'var(--c-warn)' },
  failed:    { label: 'Failed',    icon: AlertCircle, bg: 'var(--c-danger-soft)', fg: 'var(--c-danger)' },
}

const CATEGORY_ICONS = {
  Deposit:      Building2,
  Income:       Wallet,
  Bills:        Receipt,
  Airtime:      Smartphone,
  Data:         Wifi,
  Card:         CreditCard,
  Swap:         ArrowLeftRight,
  Refund:       RotateCw,
  Subscription: RefreshCw,
  Transfer:     ArrowUpRight,
  Withdrawal:   ArrowUpRight,
  Rewards:      Gift,
}

function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function buildDetails(tx) {
  if (!tx) return null
  const fee = tx.kind === 'out' ? Math.min(50, Math.round(tx.amount * 0.001)) : 0
  const balanceAfter = tx.kind === 'in'
    ? 1284750.45
    : 1284750.45 - tx.amount - fee
  const channel =
    tx.category === 'Deposit'                          ? 'Bank transfer · Wema'
    : tx.category === 'Card'                           ? 'Virtual card · NGN'
    : tx.category === 'Swap'                           ? 'Crypto wallet'
    : tx.category === 'Withdrawal'                     ? 'Wema · 8234567890'
    :                                                    'Wallet · NGN'
  const counterparty = tx.title.includes('·')
    ? tx.title.split('·').slice(1).join('·').trim()
    : tx.title

  return { fee, balanceAfter, channel, counterparty }
}

export default function TransactionModal({ tx, onClose }) {
  const open = !!tx

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  return (
    <AnimatePresence>
      {open && <Body tx={tx} onClose={onClose} />}
    </AnimatePresence>
  )
}

function Body({ tx, onClose }) {
  const isIn = tx.kind === 'in'
  const status = STATUS_META[tx.status] || STATUS_META.completed
  const StatusIcon = status.icon
  const CategoryIcon = CATEGORY_ICONS[tx.category] || Receipt
  const details = buildDetails(tx)
  const [copied, setCopied] = useState(null)

  function copy(key, value) {
    if (navigator.clipboard) navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="absolute inset-0 bg-[var(--c-scrim)] backdrop-blur-[3px] border-0 cursor-default"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Transaction details"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="relative max-w-3xl max-h-[calc(100vh-32px)] overflow-y-auto rounded-2xl bg-[var(--c-menu-bg)] border border-[var(--c-border)] shadow-[0_30px_60px_-20px_rgba(2,7,23,0.55)]"
      >
        <header
          className="relative overflow-hidden px-5 pt-5 pb-4 border-b border-[var(--c-border)]"
          style={{
            background: isIn
              ? `radial-gradient(420px 200px at 100% 0%, rgba(91,208,160,0.18), transparent 65%)`
              : `radial-gradient(420px 200px at 100% 0%, rgba(201,162,39,0.22), transparent 65%)`,
          }}
        >
          <div className="relative flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={[
                  'inline-flex items-center justify-center w-11 h-11 rounded-xl shrink-0',
                  isIn
                    ? 'bg-[var(--c-success-bg)] text-[var(--c-success)]'
                    : 'bg-[var(--c-warn-bg)] text-[var(--c-warn)]',
                ].join(' ')}
              >
                {isIn ? <ArrowDownLeft size={18} strokeWidth={2.4} /> : <ArrowUpRight size={18} strokeWidth={2.4} />}
              </span>
              <div className="min-w-0 leading-tight">
                <p className="text-[10px] uppercase tracking-[1.2px] font-bold text-[var(--c-text-muted)] m-0">
                  {isIn ? 'Money in' : 'Money out'}
                </p>
                <p className="text-[13px] font-bold text-[var(--c-text)] m-0 mt-0.5 truncate">
                  {tx.title}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-border)] active:scale-95 transition shrink-0"
            >
              <X size={14} />
            </button>
          </div>

          <div className="relative mt-4 flex items-baseline gap-2 flex-wrap">
            <span
              className={[
                'text-[28px] sm:text-[32px] font-black tabular-nums tracking-[-0.6px] leading-none break-all',
                isIn ? 'text-[var(--c-success)]' : 'text-[var(--c-text)]',
              ].join(' ')}
            >
              {isIn ? '+' : '-'}{formatNGN(tx.amount)}
            </span>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-[0.8px] whitespace-nowrap"
              style={{ background: status.bg, color: status.fg }}
            >
              <StatusIcon size={9} strokeWidth={3} />
              {status.label}
            </span>
          </div>

          <p className="relative text-[11px] text-[var(--c-text-muted)] m-0 mt-2 inline-flex items-center gap-1">
            <Sparkles size={10} className="text-brand-accent shrink-0" />
            {tx.day} · {tx.meta}
          </p>
        </header>

        <div className="p-5 flex flex-col gap-2.5">
          <DetailRow
            label="Reference"
            value={`#${tx.id.toUpperCase()}`}
            mono
            copied={copied === 'ref'}
            onCopy={() => copy('ref', tx.id.toUpperCase())}
          />
          <DetailRow
            label="Category"
            value={tx.category}
            leadingIcon={CategoryIcon}
          />
          <DetailRow label="Channel" value={details.channel} />
          <DetailRow label={isIn ? 'From' : 'To'} value={details.counterparty} />
          {details.fee > 0 && (
            <DetailRow label="Fee" value={formatNGN(details.fee)} muted />
          )}
          <div className="border-t border-dashed border-[var(--c-border)] my-1" />
          <DetailRow
            label="Balance after"
            value={formatNGN(details.balanceAfter)}
            bold
          />
        </div>

        <div className="px-5 pb-3">
          <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] p-3 flex items-start gap-2.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
              <ShieldCheck size={12} />
            </span>
            <div className="leading-snug min-w-0">
              <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">
                Verified by VeloxZap
              </p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Receipt is legally binding and stored for 7 years.
              </p>
            </div>
          </div>
        </div>

        <footer className="grid grid-cols-3 gap-2 px-5 pb-5 pt-2 border-t border-[var(--c-border)]">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] text-[11px] font-bold hover:border-[var(--c-accent-border)] hover:text-brand-accent active:scale-[0.98] transition"
          >
            <Download size={12} strokeWidth={2.6} /> Receipt
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] text-[11px] font-bold hover:border-[var(--c-accent-border)] hover:text-brand-accent active:scale-[0.98] transition"
          >
            <Share2 size={12} strokeWidth={2.6} /> Share
          </button>
          {tx.kind === 'out' ? (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[11px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.28)] hover:-translate-y-px active:scale-[0.98] transition"
            >
              <RotateCw size={12} strokeWidth={2.6} /> Repeat
            </button>
          ) : (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] text-[11px] font-bold hover:border-[var(--c-danger-border)] hover:text-[var(--c-danger)] active:scale-[0.98] transition"
            >
              <AlertCircle size={12} strokeWidth={2.6} /> Report
            </button>
          )}
        </footer>
      </motion.div>
    </div>
  )
}

function DetailRow({ label, value, mono, bold, muted, leadingIcon: LeadingIcon, onCopy, copied }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 min-h-[28px]">
      <span className="text-[10.5px] uppercase tracking-[1.05px] text-[var(--c-text-muted)] font-bold shrink-0">
        {label}
      </span>
      <span
        className={[
          'inline-flex items-center justify-end gap-1.5 min-w-0 text-right',
          mono ? 'font-mono text-[12px] tabular-nums' : 'text-[12px]',
          bold ? 'font-bold text-[var(--c-text)]' : '',
          muted ? 'text-[var(--c-text-muted)]' : '',
          !bold && !muted ? 'font-semibold text-[var(--c-text)]' : '',
        ].join(' ')}
      >
        {LeadingIcon && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
            <LeadingIcon size={11} strokeWidth={2.4} />
          </span>
        )}
        <span className="truncate">{value}</span>
      </span>
      {onCopy ? (
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Copy ${label}`}
          className={[
            'inline-flex items-center justify-center w-7 h-7 rounded-md transition shrink-0',
            copied
              ? 'bg-[var(--c-success-bg)] text-[var(--c-success)]'
              : 'text-[var(--c-text-muted)] hover:text-brand-accent hover:bg-[var(--c-surface-soft)]',
          ].join(' ')}
        >
          {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={11} />}
        </button>
      ) : (
        <span className="w-0" />
      )}
    </div>
  )
}
