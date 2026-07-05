import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Search, ArrowDownLeft, ArrowUpRight, ArrowLeftRight,
  Download, Filter, X, ChevronLeft, ChevronRight, ChevronDown, Check, Tag,
  Receipt,
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

const COLS      = 'grid-cols-[auto_1fr_0.9fr]'
const PAGE_SIZE = 50
const SKELETON  = 50

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

export default function DesktopTransactions() {
  const { transactions, loading } = useTransactions({ recentLimit: Infinity })

  const [category,     setCategory]     = useState('All')
  const [status,       setStatus]       = useState('All')
  const [query,        setQuery]        = useState('')
  const [page,         setPage]         = useState(1)
  const [activeTx,     setActiveTx]     = useState(null)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [statusOpen,   setStatusOpen]   = useState(false)

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(transactions.map(t => t.category)))],
    [transactions]
  )

  useEffect(() => {
    if (category !== 'All' && !categories.includes(category)) setCategory('All')
  }, [categories, category])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return transactions.filter(tx => {
      if (category !== 'All' && tx.category !== category) return false
      if (status !== 'All' && tx.status !== status) return false
      if (q) {
        const match = [tx.title, tx.description, tx.reference, tx.category]
          .some(v => v?.toLowerCase().includes(q))
        if (!match) return false
      }
      return true
    })
  }, [transactions, category, status, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const sliced     = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function reset() { setCategory('All'); setStatus('All'); setQuery(''); setPage(1) }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      {/* Page header */}
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
            <Sparkles size={10} /> Activity
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">Transactions</h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Every credit and debit across your VeloxZap wallets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportCsv(filtered)}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[11.5px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_4px_12px_-4px_rgba(201,162,39,0.4)] hover:-translate-y-px transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <Download size={12} strokeWidth={2.6} /> Export
          </button>
        </div>
      </header>

      <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">

        {/* Toolbar */}
        <header className="flex flex-col min-[820px]:flex-row min-[820px]:items-center gap-3 px-4 py-3 border-b border-[var(--c-border)]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-1 min-w-0 max-w-[320px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-text-muted)] pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(1) }}
                placeholder="Search description, category or ref"
                className="w-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] rounded-lg pl-8 pr-8 py-2 text-[12px] font-semibold text-[var(--c-text)] outline-none focus:border-[var(--c-accent-border-strong)] focus:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] placeholder:text-[var(--c-text-faint)] placeholder:font-medium transition"
                style={{ boxShadow: 'none' }}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 rounded-full text-[var(--c-text-muted)] hover:text-[var(--c-text)] transition">
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Category dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setCategoryOpen(v => !v); setStatusOpen(false) }}
                className={[
                  'inline-flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-xl text-[11.5px] font-semibold transition',
                  category !== 'All'
                    ? 'bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent shadow-[0_2px_10px_-4px_rgba(201,162,39,0.35)]'
                    : 'bg-[var(--c-surface)] border border-[var(--c-border-soft)] text-[var(--c-text)] hover:border-[var(--c-accent-border)]',
                ].join(' ')}
              >
                <Tag size={12} className={category !== 'All' ? 'text-brand-accent' : 'text-[var(--c-text-muted)]'} />
                {category === 'All' ? 'All categories' : category}
                <ChevronDown size={12} className={`transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {categoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 z-20 mt-1.5 w-56 max-h-72 overflow-y-auto rounded-2xl bg-[var(--c-menu-bg)] border border-[var(--c-border)] shadow-[0_20px_60px_-20px_rgba(2,7,23,0.55)] p-1.5"
                  >
                    {categories.map(c => {
                      const active = category === c
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setCategory(c); setCategoryOpen(false); setPage(1) }}
                          className={[
                            'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-[12px] font-semibold transition',
                            active ? 'bg-[var(--c-accent-soft)] text-brand-accent' : 'text-[var(--c-text)] hover:bg-[var(--c-surface-soft)]',
                          ].join(' ')}
                        >
                          {c === 'All' ? 'All categories' : c}
                          {active && <Check size={13} strokeWidth={2.6} className="text-brand-accent shrink-0" />}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setStatusOpen(v => !v); setCategoryOpen(false) }}
                className={[
                  'inline-flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-xl text-[11.5px] font-semibold transition',
                  status !== 'All'
                    ? 'bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent shadow-[0_2px_10px_-4px_rgba(201,162,39,0.35)]'
                    : 'bg-[var(--c-surface)] border border-[var(--c-border-soft)] text-[var(--c-text)] hover:border-[var(--c-accent-border)]',
                ].join(' ')}
              >
                {status === 'All' ? (
                  <Filter size={12} className="text-[var(--c-text-muted)]" />
                ) : (
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_META[status].fg }} />
                )}
                {status === 'All' ? 'All statuses' : STATUS_META[status].label}
                <ChevronDown size={12} className={`transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {statusOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 z-20 mt-1.5 w-52 max-h-72 overflow-y-auto rounded-2xl bg-[var(--c-menu-bg)] border border-[var(--c-border)] shadow-[0_20px_60px_-20px_rgba(2,7,23,0.55)] p-1.5"
                  >
                    {STATUS_OPTIONS.map(s => {
                      const active = status === s
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => { setStatus(s); setStatusOpen(false); setPage(1) }}
                          className={[
                            'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-[12px] font-semibold transition',
                            active ? 'bg-[var(--c-accent-soft)] text-brand-accent' : 'text-[var(--c-text)] hover:bg-[var(--c-surface-soft)]',
                          ].join(' ')}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: s === 'All' ? 'var(--c-text-faint)' : STATUS_META[s].fg }}
                          />
                          <span className="flex-1">{s === 'All' ? 'All statuses' : STATUS_META[s].label}</span>
                          {active && <Check size={13} strokeWidth={2.6} className="text-brand-accent shrink-0" />}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(category !== 'All' || status !== 'All' || query) && (
              <button type="button" onClick={reset}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] text-[10.5px] font-semibold hover:text-[var(--c-text)] hover:border-[var(--c-border)] transition">
                <X size={11} /> Reset
              </button>
            )}
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.9px] text-[var(--c-text-muted)] font-semibold">
              <Filter size={10} /> {filtered.length} result{filtered.length === 1 ? '' : 's'}
            </span>
          </div>
        </header>

        {/* Table */}
        <div className="overflow-x-auto">

          {/* Column headers */}
          <div className={`grid ${COLS} gap-4 px-4 py-2.5 text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] border-b border-[var(--c-border)] bg-[var(--c-surface-soft)] sticky top-0 z-10 min-w-[620px]`}>
            <span />
            <span>Description</span>
            <span className="text-right">Amount</span>
          </div>

          {/* Loading skeleton */}
          {loading ? (
            <ul className="list-none m-0 p-0 min-w-[620px]">
              {Array.from({ length: SKELETON }).map((_, i) => (
                <li key={i} className={`grid ${COLS} gap-4 items-center px-4 py-3 ${i > 0 ? 'border-t border-[var(--c-border)]' : ''}`}>
                  <span aria-hidden className="w-9 h-9 rounded-lg bg-[var(--c-surface-soft)] animate-pulse" />
                  <div className="flex flex-col gap-1.5">
                    <span aria-hidden className="h-3 w-3/4 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                    <span aria-hidden className="h-2.5 w-1/2 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span aria-hidden className="h-3 w-24 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                    <span aria-hidden className="h-4 w-14 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
                  </div>
                </li>
              ))}
            </ul>

          ) : sliced.length === 0 ? (
            <div className="p-10 text-center min-w-[620px]">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] mb-3">
                <Receipt size={18} />
              </span>
              <p className="text-[13px] font-semibold text-[var(--c-text)] m-0">No transactions match your filters</p>
              <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-1">Try clearing filters or expanding your search.</p>
              <button type="button" onClick={reset}
                className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)] text-[11px] font-semibold hover:border-[var(--c-accent-border)] hover:text-brand-accent transition">
                <X size={11} /> Reset filters
              </button>
            </div>

          ) : (
            <ul className="list-none m-0 p-0 min-w-[620px]">
              {sliced.map((tx, i) => {
                const s = STATUS_META[tx.status] ?? STATUS_META.successful
                return (
                  <li
                    key={tx.id}
                    onClick={() => setActiveTx(tx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveTx(tx) } }}
                    className={[
                      `grid ${COLS} items-center gap-4 px-4 py-3 cursor-pointer hover:bg-[var(--c-surface-soft)] focus:bg-[var(--c-surface-soft)] focus:outline-none transition`,
                      i > 0 ? 'border-t border-[var(--c-border)]' : '',
                    ].join(' ')}
                  >
                    {/* Direction icon */}
                    <span className={['inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0',
                      tx.kind === 'in'
                        ? 'text-[var(--c-success)] bg-[var(--c-success-bg)]'
                        : tx.kind === 'internal'
                          ? 'text-[var(--c-text-muted)] bg-[var(--c-surface-soft)]'
                          : 'text-[var(--c-warn)] bg-[var(--c-warn-bg)]',
                    ].join(' ')}>
                      {tx.kind === 'in'
                        ? <ArrowDownLeft size={14} strokeWidth={2.4} />
                        : tx.kind === 'internal'
                          ? <ArrowLeftRight size={14} strokeWidth={2.4} />
                          : <ArrowUpRight  size={14} strokeWidth={2.4} />}
                    </span>

                    {/* Description */}
                    <div className="flex flex-col min-w-0 leading-tight gap-0.5">
                      <span className="text-[12px] font-semibold text-[var(--c-text)] truncate">
                        {tx.description}
                      </span>
                      <span className="text-[10px] text-[var(--c-text-faint)] truncate">
                        {fmtDate(tx.createdAt)}
                      </span>
                    </div>

                    {/* Amount + status */}
                    <div className="flex flex-col items-end gap-1">
                      <span className={['text-[12.5px] font-bold tabular-nums whitespace-nowrap text-right',
                        tx.kind === 'in' ? 'text-[var(--c-success)]' : 'text-[var(--c-text)]',
                      ].join(' ')}>
                        {tx.kind === 'in' ? '+' : '-'}{formatNGN(tx.total)}
                      </span>
                      <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[9.5px] font-bold"
                        style={{ background: s.bg, color: s.fg }}>
                        {s.label}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Pagination — only when results exceed one page */}
        {!loading && filtered.length > PAGE_SIZE && (
          <footer className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[var(--c-border)]">
            <p className="text-[11px] text-[var(--c-text-muted)] m-0">
              Showing{' '}
              <span className="text-[var(--c-text)] font-semibold tabular-nums">
                {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
              </span>{' '}
              of{' '}
              <span className="text-[var(--c-text)] font-semibold tabular-nums">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button type="button" disabled={safePage === 1} onClick={() => setPage(p => Math.max(1, p - 1))} aria-label="Previous"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-border)] disabled:opacity-40 disabled:cursor-not-allowed transition">
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1
                const active = n === safePage
                return (
                  <button key={n} type="button" onClick={() => setPage(n)}
                    className={['inline-flex items-center justify-center w-8 h-8 rounded-lg text-[11px] font-bold tabular-nums transition',
                      active
                        ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_2px_8px_rgba(201,162,39,0.28)]'
                        : 'bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-border)]',
                    ].join(' ')}>
                    {n}
                  </button>
                )
              })}
              <button type="button" disabled={safePage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} aria-label="Next"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-border)] disabled:opacity-40 disabled:cursor-not-allowed transition">
                <ChevronRight size={13} />
              </button>
            </div>
          </footer>
        )}
      </article>

      <TransactionModal tx={activeTx} onClose={() => setActiveTx(null)} />
    </div>
  )
}
