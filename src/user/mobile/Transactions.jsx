import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Search, ArrowDownLeft, ArrowUpRight, ArrowLeftRight,
  Sparkles, AlertCircle, Download, ChevronDown, Check, Tag, Filter,
} from 'lucide-react'
import TransactionModal from '../../components/internalUI/TransactionModal'
import useTransactions from '../../hooks/useTransactions'
import { fmtDate } from '../../utils/format'

const STATUS_META = {
  successful: { label: 'Successful', bg: 'var(--c-success-bg)',   fg: 'var(--c-success)' },
  processing: { label: 'Processing', bg: 'var(--c-warn-bg)',      fg: 'var(--c-warn)' },
  pending:    { label: 'Pending',    bg: 'var(--c-warn-bg)',      fg: 'var(--c-warn)' },
  failed:     { label: 'Failed',     bg: 'var(--c-danger-soft)',  fg: 'var(--c-danger)' },
  refund:     { label: 'Refund',     bg: 'var(--c-accent-soft)',  fg: 'var(--c-accent)' },
  reverse:    { label: 'Reversed',   bg: 'var(--c-surface-soft)', fg: 'var(--c-text-muted)' },
}

const STATUS_OPTIONS = ['All', ...Object.keys(STATUS_META)]
const PAGE_SIZE = 100

function formatNGN(n) {
  return '₦' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function csvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

function exportCsv(rows) {
  const header = ['Date', 'Category', 'Description', 'Reference', 'Type', 'Status', 'Amount']
  const lines = rows.map(t => [
    t.createdAt ? new Date(t.createdAt).toLocaleString('en-NG') : '',
    t.category,
    t.title,
    t.reference,
    t.kind === 'in' ? 'Credit' : t.kind === 'internal' ? 'Internal' : 'Debit',
    STATUS_META[t.status]?.label ?? t.status,
    t.total,
  ])
  const csv = [header, ...lines].map(row => row.map(csvCell).join(',')).join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `veloxzap-transactions-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function MobileTransactions() {
  const navigate = useNavigate()
  const { transactions, loading } = useTransactions({ recentLimit: Infinity })
  const [filter,        setFilter]        = useState('All')
  const [status,        setStatus]        = useState('All')
  const [activeTx,      setActiveTx]      = useState(null)
  const [categoryOpen,  setCategoryOpen]  = useState(false)
  const [statusOpen,    setStatusOpen]    = useState(false)
  const [visibleCount,  setVisibleCount]  = useState(PAGE_SIZE)
  const sentinelRef = useRef(null)

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(transactions.map(t => t.category)))],
    [transactions]
  )

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      if (filter !== 'All' && tx.category !== filter) return false
      if (status !== 'All' && tx.status !== status) return false
      return true
    })
  }, [transactions, filter, status])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filter, status])

  const visibleTx = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const hasMore = visibleCount < filtered.length

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisibleCount(v => Math.min(v + PAGE_SIZE, filtered.length))
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, filtered.length])

  const days = Array.from(new Set(visibleTx.map(t => t.day)))

  return (
    <div className="flex flex-col gap-1">
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
          onClick={() => exportCsv(filtered)}
          disabled={filtered.length === 0}
          aria-label="Export statement"
          className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] hover:border-[var(--c-accent-border)] hover:text-brand-accent active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none"
        >
          <Download size={14} />
        </button>
      </div>

      <div>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mb-2 mt-1">
          Transactions
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Category dropdown */}
        <div className="relative flex-1 min-w-0">
          <button
            type="button"
            onClick={() => { setCategoryOpen(v => !v); setStatusOpen(false) }}
            className={[
              'w-full inline-flex items-center gap-1.5 pl-3 pr-2.5 py-2 rounded-xl text-[11.5px] font-semibold transition',
              filter !== 'All'
                ? 'bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent'
                : 'bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text)]',
            ].join(' ')}
          >
            <Tag size={12} className={filter !== 'All' ? 'text-brand-accent shrink-0' : 'text-[var(--c-text-muted)] shrink-0'} />
            <span className="flex-1 min-w-0 truncate text-left">{filter === 'All' ? 'All categories' : filter}</span>
            <ChevronDown size={12} className={`shrink-0 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {categoryOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 z-20 mt-1.5 max-h-64 overflow-y-auto rounded-2xl bg-[var(--c-menu-bg)] border border-[var(--c-border)] shadow-[0_20px_60px_-20px_rgba(2,7,23,0.55)] p-1.5"
              >
                {categories.map(cat => {
                  const active = filter === cat
                  const count = cat === 'All' ? transactions.length : transactions.filter(t => t.category === cat).length
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { setFilter(cat); setCategoryOpen(false) }}
                      className={[
                        'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-[12px] font-semibold transition',
                        active ? 'bg-[var(--c-accent-soft)] text-brand-accent' : 'text-[var(--c-text)] active:bg-[var(--c-surface-soft)]',
                      ].join(' ')}
                    >
                      <span className="flex-1 min-w-0 truncate">{cat === 'All' ? 'All categories' : cat}</span>
                      <span className="text-[10px] font-bold text-[var(--c-text-faint)] shrink-0">{count}</span>
                      {active && <Check size={13} strokeWidth={2.6} className="text-brand-accent shrink-0" />}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status dropdown */}
        <div className="relative flex-1 min-w-0">
          <button
            type="button"
            onClick={() => { setStatusOpen(v => !v); setCategoryOpen(false) }}
            className={[
              'w-full inline-flex items-center gap-1.5 pl-3 pr-2.5 py-2 rounded-xl text-[11.5px] font-semibold transition',
              status !== 'All'
                ? 'bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent'
                : 'bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text)]',
            ].join(' ')}
          >
            {status === 'All' ? (
              <Filter size={12} className="text-[var(--c-text-muted)] shrink-0" />
            ) : (
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_META[status].fg }} />
            )}
            <span className="flex-1 min-w-0 truncate text-left">{status === 'All' ? 'All statuses' : STATUS_META[status].label}</span>
            <ChevronDown size={12} className={`shrink-0 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {statusOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 z-20 mt-1.5 max-h-64 overflow-y-auto rounded-2xl bg-[var(--c-menu-bg)] border border-[var(--c-border)] shadow-[0_20px_60px_-20px_rgba(2,7,23,0.55)] p-1.5"
              >
                {STATUS_OPTIONS.map(s => {
                  const active = status === s
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setStatus(s); setStatusOpen(false) }}
                      className={[
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-[12px] font-semibold transition',
                        active ? 'bg-[var(--c-accent-soft)] text-brand-accent' : 'text-[var(--c-text)] active:bg-[var(--c-surface-soft)]',
                      ].join(' ')}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: s === 'All' ? 'var(--c-text-faint)' : STATUS_META[s].fg }}
                      />
                      <span className="flex-1 min-w-0 truncate">{s === 'All' ? 'All statuses' : STATUS_META[s].label}</span>
                      {active && <Check size={13} strokeWidth={2.6} className="text-brand-accent shrink-0" />}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
          <ul className="m-0 list-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className={`flex items-center gap-2.5 px-3 py-2 ${i > 0 ? 'border-t border-[var(--c-border)]' : ''}`}>
                <span aria-hidden className="w-9 h-9 rounded-[10px] bg-[var(--c-surface-soft)] animate-pulse shrink-0" />
                <div className="flex-1 flex flex-col gap-1">
                  <span aria-hidden className="h-3 w-3/5 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                  <span aria-hidden className="h-2.5 w-2/5 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                </div>
                <span aria-hidden className="h-3 w-16 rounded bg-[var(--c-surface-soft)] animate-pulse" />
              </li>
            ))}
          </ul>
        </div>
      ) : filtered.length > 0 ? (
        <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
          {days.map((day, di) => {
            const items = visibleTx.filter(r => r.day === day)
            return (
              <div key={day} className={di > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                <p className="text-[9px] uppercase tracking-[1.2px] font-semibold text-[var(--c-text-muted)] m-0 px-3 pt-2 pb-1">
                  {day}
                </p>
                <ul className="m-0 list-none">
                  {items.map(tx => {
                    const s = STATUS_META[tx.status] ?? STATUS_META.successful
                    return (
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
                                  : tx.kind === 'internal'
                                    ? 'text-[var(--c-text-muted)] bg-[var(--c-surface-soft)]'
                                    : 'text-[var(--c-warn)] bg-[var(--c-warn-bg)]',
                            ].join(' ')}
                          >
                            {tx.status === 'failed'
                              ? <AlertCircle size={13} strokeWidth={2.4} />
                              : tx.kind === 'in'
                                ? <ArrowDownLeft size={13} strokeWidth={2.6} />
                                : tx.kind === 'internal'
                                  ? <ArrowLeftRight size={13} strokeWidth={2.6} />
                                  : <ArrowUpRight size={13} strokeWidth={2.6} />}
                          </span>
                          <div className="flex flex-col min-w-0 leading-tight">
                            <span className="text-[12.5px] font-semibold text-[var(--c-text)] truncate">
                              {tx.description || tx.title}
                            </span>
                            <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5 truncate inline-flex items-center gap-1.5">
                              <span>{fmtDate(tx.createdAt)}</span>
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={[
                                'text-[12.5px] font-bold tabular-nums whitespace-nowrap',
                                tx.kind === 'in' ? 'text-[var(--c-success)]' : 'text-[var(--c-text)]',
                              ].join(' ')}
                            >
                              {tx.kind === 'in' ? '+' : tx.kind === 'internal' ? '' : '-'}
                              {formatNGN(tx.total)}
                            </span>
                            <span
                              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8.5px] font-bold"
                              style={{ background: s.bg, color: s.fg }}
                            >
                              {s.label}
                            </span>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState onClear={() => { setFilter('All'); setStatus('All') }} />
      )}

      {hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center py-3">
          <span className="text-[10.5px] font-semibold text-[var(--c-text-faint)]">Loading more…</span>
        </div>
      )}

      <TransactionModal tx={activeTx} onClose={() => setActiveTx(null)} />
    </div>
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
