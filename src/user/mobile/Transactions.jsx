import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Search, ArrowDownLeft, ArrowUpRight,
  TrendingUp, Sparkles, AlertCircle, Download,
} from 'lucide-react'
import TransactionModal from '../../components/internalUI/TransactionModal'

const TRANSACTIONS = [
  { id: 't1',  kind: 'in',  title: 'Funding · Paystack',     category: 'Deposit',      meta: '09:42',   day: 'Today',     amount: 250000, status: 'completed' },
  { id: 't2',  kind: 'out', title: 'MTN Airtime · 0803…',    category: 'Airtime',      meta: '08:11',   day: 'Today',     amount: 2000,   status: 'completed' },
  { id: 't3',  kind: 'in',  title: 'Salary · Acme Corp',     category: 'Income',       meta: '07:30',   day: 'Today',     amount: 380000, status: 'completed' },
  { id: 't4',  kind: 'out', title: 'DSTV Compact',           category: 'Bills',        meta: '14:20',   day: 'Yesterday', amount: 14500,  status: 'completed' },
  { id: 't5',  kind: 'in',  title: 'USDT → NGN swap',        category: 'Swap',         meta: '11:05',   day: 'Yesterday', amount: 87420,  status: 'completed' },
  { id: 't6',  kind: 'out', title: 'Ikeja Electric',         category: 'Bills',        meta: 'May 6',   day: 'This week', amount: 9800,   status: 'completed' },
  { id: 't7',  kind: 'out', title: 'Card top-up',            category: 'Card',         meta: 'May 5',   day: 'This week', amount: 50000,  status: 'failed' },
  { id: 't8',  kind: 'in',  title: 'Refund · Konga',         category: 'Refund',       meta: 'May 4',   day: 'This week', amount: 12500,  status: 'completed' },
  { id: 't9',  kind: 'out', title: 'Spotify Premium',        category: 'Subscription', meta: 'May 1',   day: 'Earlier',   amount: 1300,   status: 'completed' },
  { id: 't10', kind: 'in',  title: 'P2P from Ada Obi',       category: 'Transfer',     meta: 'Apr 28',  day: 'Earlier',   amount: 45000,  status: 'completed' },
]

const CATEGORIES = ['All', ...Array.from(new Set(TRANSACTIONS.map(t => t.category)))]

function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatShortNGN(n) {
  return '₦' + n.toLocaleString('en-NG')
}

function countFor(category) {
  if (category === 'All') return TRANSACTIONS.length
  return TRANSACTIONS.filter(t => t.category === category).length
}

export default function MobileTransactions() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [activeTx, setActiveTx] = useState(null)

  const filtered = useMemo(() => {
    if (filter === 'All') return TRANSACTIONS
    return TRANSACTIONS.filter(tx => tx.category === filter)
  }, [filter])

  const totalIn = TRANSACTIONS
    .filter(t => t.kind === 'in' && t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0)
  const totalOut = TRANSACTIONS
    .filter(t => t.kind === 'out' && t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0)

  const days = Array.from(new Set(filtered.map(t => t.day)))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between -mt-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <button
          type="button"
          aria-label="Export statement"
          className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] hover:border-[var(--c-accent-border)] hover:text-brand-accent active:scale-95 transition"
        >
          <Download size={14} />
        </button>
      </div>

      <div>
        <p className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
          <Sparkles size={11} /> Activity
        </p>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
          Transactions
        </h1>
        <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1 leading-snug">
          {filtered.length} of {TRANSACTIONS.length} · last 30 days
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SummaryCard tone="success" label="Money in" value={formatShortNGN(totalIn)} delta="+18.2%" />
        <SummaryCard tone="warn" label="Money out" value={formatShortNGN(totalOut)} delta="-4.7%" />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map(cat => {
          const active = filter === cat
          const count = countFor(cat)
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={[
                'shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-semibold tracking-[0.1px] transition',
                active
                  ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_12px_rgba(201,162,39,0.3)]'
                  : 'bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text-muted)] active:scale-95',
              ].join(' ')}
            >
              {cat}
              <span
                className={[
                  'inline-flex items-center justify-center min-w-[18px] h-[16px] px-1 rounded-full text-[9px] font-bold',
                  active
                    ? 'bg-[rgba(10,31,68,0.22)] text-brand-primary'
                    : 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)]',
                ].join(' ')}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
          {days.map((day, di) => {
            const items = filtered.filter(r => r.day === day)
            return (
              <div key={day} className={di > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                <p className="text-[9px] uppercase tracking-[1.2px] font-semibold text-[var(--c-text-muted)] m-0 px-3 pt-2 pb-1">
                  {day}
                </p>
                <ul className="m-0 list-none">
                  {items.map(tx => (
                    <li key={tx.id}>
                      <button
                        type="button"
                        onClick={() => setActiveTx(tx)}
                        className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-2.5 px-3 py-2 text-left active:bg-[var(--c-surface-soft)] transition"
                      >
                        <span
                          className={[
                            'inline-flex items-center justify-center w-9 h-9 rounded-[10px]',
                            tx.status === 'failed'
                              ? 'text-[var(--c-danger)] bg-[var(--c-danger-soft)]'
                              : tx.kind === 'in'
                                ? 'text-[var(--c-success)] bg-[var(--c-success-bg)]'
                                : 'text-[var(--c-warn)] bg-[var(--c-warn-bg)]',
                          ].join(' ')}
                        >
                          {tx.status === 'failed'
                            ? <AlertCircle size={13} strokeWidth={2.4} />
                            : tx.kind === 'in'
                              ? <ArrowDownLeft size={13} strokeWidth={2.6} />
                              : <ArrowUpRight size={13} strokeWidth={2.6} />}
                        </span>
                        <div className="flex flex-col min-w-0 leading-tight">
                          <span className="text-[12.5px] font-semibold text-[var(--c-text)] truncate">
                            {tx.title}
                          </span>
                          <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5 truncate inline-flex items-center gap-1.5">
                            <span>{tx.category}</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-[var(--c-text-faint)] shrink-0" />
                            <span>{tx.meta}</span>
                            {tx.status === 'failed' && (
                              <>
                                <span className="w-0.5 h-0.5 rounded-full bg-[var(--c-text-faint)] shrink-0" />
                                <span className="text-[var(--c-danger)] font-bold uppercase tracking-[0.4px]">Failed</span>
                              </>
                            )}
                          </span>
                        </div>
                        <span
                          className={[
                            'text-[12.5px] font-bold tabular-nums whitespace-nowrap',
                            tx.status === 'failed'
                              ? 'text-[var(--c-text-faint)] line-through'
                              : tx.kind === 'in'
                                ? 'text-[var(--c-success)]'
                                : 'text-[var(--c-text)]',
                          ].join(' ')}
                        >
                          {tx.kind === 'in' ? '+' : '-'}
                          {formatNGN(tx.amount)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState onClear={() => setFilter('All')} />
      )}

      <TransactionModal tx={activeTx} onClose={() => setActiveTx(null)} />
    </div>
  )
}

function SummaryCard({ tone, label, value, delta }) {
  const isSuccess = tone === 'success'
  return (
    <article className="relative overflow-hidden p-3 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
      <span
        aria-hidden
        className={[
          'pointer-events-none absolute -top-5 -right-5 w-16 h-16 rounded-full blur-xl',
          isSuccess ? 'bg-[var(--c-success-bg)]' : 'bg-[var(--c-warn-bg)]',
        ].join(' ')}
      />
      <div className="relative flex items-center justify-between gap-2">
        <span
          className={[
            'inline-flex items-center justify-center w-7 h-7 rounded-[9px]',
            isSuccess
              ? 'bg-[var(--c-success-bg)] text-[var(--c-success)]'
              : 'bg-[var(--c-warn-bg)] text-[var(--c-warn)]',
          ].join(' ')}
        >
          {isSuccess
            ? <ArrowDownLeft size={13} strokeWidth={2.4} />
            : <ArrowUpRight size={13} strokeWidth={2.4} />}
        </span>
        <span
          className={[
            'inline-flex items-center gap-0.5 text-[10px] font-bold whitespace-nowrap',
            isSuccess ? 'text-[var(--c-success)]' : 'text-[var(--c-danger)]',
          ].join(' ')}
        >
          <TrendingUp
            size={9}
            strokeWidth={2.6}
            className={isSuccess ? '' : 'rotate-180'}
          />
          {delta}
        </span>
      </div>
      <div className="relative mt-2.5">
        <p className="text-[9.5px] uppercase tracking-[1.1px] font-semibold text-[var(--c-text-muted)] m-0">
          {label}
        </p>
        <p className="text-[14px] font-bold tracking-[-0.2px] text-[var(--c-text)] m-0 mt-0.5 tabular-nums truncate">
          {value}
        </p>
      </div>
    </article>
  )
}

function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-10 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
      <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent">
        <Search size={20} />
      </span>
      <h4 className="mt-4 mb-1 text-[14px] font-semibold tracking-[-0.2px] text-[var(--c-text)]">
        Nothing here yet
      </h4>
      <p className="m-0 max-w-[260px] text-[11.5px] leading-[1.55] text-[var(--c-text-muted)]">
        No transactions match this category.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[12px] font-semibold text-brand-primary bg-gradient-to-br from-brand-accent to-brand-gold-soft border border-[rgba(232,197,71,0.55)] active:scale-95 transition"
      >
        Show all
      </button>
    </div>
  )
}
