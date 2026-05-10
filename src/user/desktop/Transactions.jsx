import { useMemo, useState } from 'react'
import {
  Sparkles, Search, ArrowDownLeft, ArrowUpRight, TrendingUp,
  Download, Filter, Check, Clock, AlertCircle, X, ChevronLeft, ChevronRight,
  Calendar, Receipt,
} from 'lucide-react'
import TransactionModal from '../../components/internalUI/TransactionModal'

const TRANSACTIONS = [
  { id: 't1',  kind: 'in',  title: 'Funding · Paystack',     category: 'Deposit',      meta: '09:42',   day: 'Today',     amount: 250000, status: 'completed' },
  { id: 't2',  kind: 'out', title: 'MTN Airtime · 0803…',    category: 'Airtime',      meta: '08:11',   day: 'Today',     amount: 2000,   status: 'completed' },
  { id: 't3',  kind: 'in',  title: 'Salary · Acme Corp',     category: 'Income',       meta: '07:30',   day: 'Today',     amount: 380000, status: 'completed' },
  { id: 't4',  kind: 'out', title: 'DSTV Compact',           category: 'Bills',        meta: '14:20',   day: 'Yesterday', amount: 14500,  status: 'completed' },
  { id: 't5',  kind: 'in',  title: 'USDT → NGN swap',        category: 'Swap',         meta: '11:05',   day: 'Yesterday', amount: 87420,  status: 'completed' },
  { id: 't6',  kind: 'out', title: 'Ikeja Electric',         category: 'Bills',        meta: 'May 6',   day: 'This week', amount: 9800,   status: 'completed' },
  { id: 't7',  kind: 'out', title: 'Card top-up · USD',      category: 'Card',         meta: 'May 5',   day: 'This week', amount: 50000,  status: 'failed' },
  { id: 't8',  kind: 'in',  title: 'Refund · Konga',         category: 'Refund',       meta: 'May 4',   day: 'This week', amount: 12500,  status: 'completed' },
  { id: 't9',  kind: 'out', title: 'Spotify Premium',        category: 'Subscription', meta: 'May 1',   day: 'Earlier',   amount: 1300,   status: 'completed' },
  { id: 't10', kind: 'in',  title: 'P2P from Ada Obi',       category: 'Transfer',     meta: 'Apr 28',  day: 'Earlier',   amount: 45000,  status: 'completed' },
  { id: 't11', kind: 'out', title: 'Glo Data · 1.5GB',       category: 'Data',         meta: 'Apr 26',  day: 'Earlier',   amount: 1000,   status: 'completed' },
  { id: 't12', kind: 'out', title: 'BTC withdrawal',         category: 'Withdrawal',   meta: 'Apr 24',  day: 'Earlier',   amount: 75000,  status: 'pending' },
  { id: 't13', kind: 'in',  title: 'Cashback · Rewards',     category: 'Rewards',      meta: 'Apr 22',  day: 'Earlier',   amount: 1860,   status: 'completed' },
  { id: 't14', kind: 'out', title: 'Spectranet 100GB',       category: 'Bills',        meta: 'Apr 20',  day: 'Earlier',   amount: 22000,  status: 'completed' },
]

const TYPE_TABS = [
  { id: 'all', label: 'All' },
  { id: 'in',  label: 'Income' },
  { id: 'out', label: 'Expense' },
]

const CATEGORIES = ['All', ...Array.from(new Set(TRANSACTIONS.map(t => t.category)))]

const STATUS_META = {
  completed: { label: 'Completed', icon: Check,        bg: 'var(--c-success-bg)', fg: 'var(--c-success)' },
  pending:   { label: 'Pending',   icon: Clock,        bg: 'var(--c-warn-bg)',    fg: 'var(--c-warn)' },
  failed:    { label: 'Failed',    icon: AlertCircle,  bg: 'var(--c-danger-soft)', fg: 'var(--c-danger)' },
}

function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatShort(n) {
  return '₦' + n.toLocaleString('en-NG')
}

const PAGE_SIZE = 8

export default function DesktopTransactions() {
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [activeTx, setActiveTx] = useState(null)

  const filtered = useMemo(() => {
    return TRANSACTIONS.filter(tx => {
      if (type !== 'all' && tx.kind !== type) return false
      if (category !== 'All' && tx.category !== category) return false
      if (query && !tx.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [type, category, query])

  const totalIn = TRANSACTIONS
    .filter(t => t.kind === 'in' && t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0)
  const totalOut = TRANSACTIONS
    .filter(t => t.kind === 'out' && t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0)
  const net = totalIn - totalOut
  const count = TRANSACTIONS.length

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const sliced = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function reset() {
    setType('all')
    setCategory('All')
    setQuery('')
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
            <Sparkles size={10} /> Activity
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Transactions
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Every credit and debit across your VeloxZap wallets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text)] text-[11.5px] font-semibold hover:border-[var(--c-accent-border)] transition"
          >
            <Calendar size={12} /> May 2026
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[11.5px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_4px_12px_-4px_rgba(201,162,39,0.4)] hover:-translate-y-px transition"
          >
            <Download size={12} strokeWidth={2.6} /> Export
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 min-[640px]:grid-cols-4 gap-3">
        <Kpi
          icon={ArrowDownLeft}
          label="Total in"
          value={formatShort(totalIn)}
          delta="+18.2%"
          deltaTone="success"
          tint="success"
        />
        <Kpi
          icon={ArrowUpRight}
          label="Total out"
          value={formatShort(totalOut)}
          delta="-4.7%"
          deltaTone="danger"
          tint="warn"
        />
        <Kpi
          icon={TrendingUp}
          label="Net flow"
          value={formatShort(net)}
          delta="positive"
          deltaTone="success"
          tint="accent"
        />
        <Kpi
          icon={Receipt}
          label="Transactions"
          value={count.toString()}
          delta="this period"
          tint="muted"
        />
      </section>

      <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">

        <header className="flex flex-col min-[820px]:flex-row min-[820px]:items-center gap-3 px-4 py-3 border-b border-[var(--c-border)]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-1 min-w-0 max-w-[320px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-text-muted)] pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(1) }}
                placeholder="Search transactions"
                className="w-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] rounded-lg pl-8 pr-8 py-2 text-[12px] font-semibold text-[var(--c-text)] outline-none focus:outline-none focus:ring-0 focus:border-[var(--c-accent-border-strong)] focus:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] placeholder:text-[var(--c-text-faint)] placeholder:font-medium transition"
                style={{ boxShadow: 'none' }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 rounded-full text-[var(--c-text-muted)] hover:text-[var(--c-text)] transition"
                >
                  <X size={11} />
                </button>
              )}
            </div>

            <div className="inline-flex p-0.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
              {TYPE_TABS.map(t => {
                const active = type === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setType(t.id); setPage(1) }}
                    className={[
                      'px-2.5 py-1 rounded-md text-[10.5px] font-bold tracking-[0.2px] transition',
                      active
                        ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_2px_8px_rgba(201,162,39,0.28)]'
                        : 'text-[var(--c-text-muted)] hover:text-[var(--c-text)]',
                    ].join(' ')}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(type !== 'all' || category !== 'All' || query) && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] text-[10.5px] font-semibold hover:text-[var(--c-text)] hover:border-[var(--c-border)] transition"
              >
                <X size={11} /> Reset
              </button>
            )}
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.9px] text-[var(--c-text-muted)] font-semibold">
              <Filter size={10} /> {filtered.length} result{filtered.length === 1 ? '' : 's'}
            </span>
          </div>
        </header>

        <div className="overflow-x-auto">
          <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-[var(--c-border)] bg-[var(--c-surface-soft)]">
            {CATEGORIES.map(c => {
              const active = category === c
              const ct = c === 'All' ? TRANSACTIONS.length : TRANSACTIONS.filter(t => t.category === c).length
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setCategory(c); setPage(1) }}
                  className={[
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold tracking-[0.1px] transition',
                    active
                      ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_2px_8px_rgba(201,162,39,0.28)]'
                      : 'bg-[var(--c-surface)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:border-[var(--c-accent-border)] hover:text-[var(--c-text)]',
                  ].join(' ')}
                >
                  {c}
                  <span className={[
                    'tabular-nums text-[9.5px] font-bold',
                    active ? 'text-brand-primary/70' : 'text-[var(--c-text-faint)]',
                  ].join(' ')}>
                    {ct}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.6fr_1fr] gap-3 px-4 py-2.5 text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] border-b border-[var(--c-border)] bg-[var(--c-surface-soft)] sticky top-0 z-10 min-w-[760px]">
            <span>Description</span>
            <span>Category</span>
            <span>Date</span>
            <span>Status</span>
            <span className="text-right">Amount</span>
          </div>

          {sliced.length === 0 ? (
            <div className="p-10 text-center min-w-[760px]">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] mb-3">
                <Receipt size={18} />
              </span>
              <p className="text-[13px] font-semibold text-[var(--c-text)] m-0">
                No transactions match your filters
              </p>
              <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-1">
                Try clearing filters or expanding your date range.
              </p>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)] text-[11px] font-semibold hover:border-[var(--c-accent-border)] hover:text-brand-accent transition"
              >
                <X size={11} /> Reset filters
              </button>
            </div>
          ) : (
            <ul className="list-none m-0 p-0 min-w-[760px]">
              {sliced.map((tx, i) => {
                const s = STATUS_META[tx.status]
                const Icon = s.icon
                return (
                  <li
                    key={tx.id}
                    onClick={() => setActiveTx(tx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveTx(tx) } }}
                    className={[
                      'grid grid-cols-[1.6fr_0.8fr_0.8fr_0.6fr_1fr] items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--c-surface-soft)] focus:bg-[var(--c-surface-soft)] focus:outline-none transition',
                      i > 0 ? 'border-t border-[var(--c-border)]' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={[
                          'inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0',
                          tx.kind === 'in'
                            ? 'text-[var(--c-success)] bg-[var(--c-success-bg)]'
                            : 'text-[var(--c-warn)] bg-[var(--c-warn-bg)]',
                        ].join(' ')}
                      >
                        {tx.kind === 'in'
                          ? <ArrowDownLeft size={14} strokeWidth={2.4} />
                          : <ArrowUpRight size={14} strokeWidth={2.4} />}
                      </span>
                      <div className="flex flex-col min-w-0 leading-tight">
                        <span className="text-[12px] font-semibold text-[var(--c-text)] truncate">
                          {tx.title}
                        </span>
                        <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5 font-mono tabular-nums">
                          #{tx.id.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center w-fit px-2 py-0.5 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[10px] font-semibold text-[var(--c-text)]">
                      {tx.category}
                    </span>

                    <span className="text-[11px] text-[var(--c-text-muted)] tabular-nums">
                      {tx.day} · {tx.meta}
                    </span>

                    <span
                      className="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-[0.8px]"
                      style={{ background: s.bg, color: s.fg }}
                    >
                      <Icon size={9} strokeWidth={3} />
                      {s.label}
                    </span>

                    <span
                      className={[
                        'text-[12.5px] font-bold tabular-nums whitespace-nowrap text-right',
                        tx.kind === 'in' ? 'text-[var(--c-success)]' : 'text-[var(--c-text)]',
                      ].join(' ')}
                    >
                      {tx.kind === 'in' ? '+' : '-'}{formatNGN(tx.amount)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {filtered.length > 0 && (
          <footer className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[var(--c-border)]">
            <p className="text-[11px] text-[var(--c-text-muted)] m-0">
              Showing <span className="text-[var(--c-text)] font-semibold tabular-nums">
                {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
              </span> of <span className="text-[var(--c-text)] font-semibold tabular-nums">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                aria-label="Previous"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-border)] disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1
                const active = n === safePage
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={[
                      'inline-flex items-center justify-center w-8 h-8 rounded-lg text-[11px] font-bold tabular-nums transition',
                      active
                        ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_2px_8px_rgba(201,162,39,0.28)]'
                        : 'bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-border)]',
                    ].join(' ')}
                  >
                    {n}
                  </button>
                )
              })}
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                aria-label="Next"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-border)] disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
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

function Kpi({ icon: Icon, label, value, delta, deltaTone, tint }) {
  const tintMap = {
    success: 'bg-[var(--c-success-bg)] text-[var(--c-success)]',
    warn:    'bg-[var(--c-warn-bg)] text-[var(--c-warn)]',
    accent:  'bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]',
    muted:   'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)]',
  }
  const deltaMap = {
    success: 'text-[var(--c-success)]',
    danger:  'text-[var(--c-danger)]',
  }
  return (
    <article className="relative overflow-hidden p-3 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={['inline-flex items-center justify-center w-8 h-8 rounded-lg', tintMap[tint] || tintMap.muted].join(' ')}>
          <Icon size={14} strokeWidth={2.4} />
        </span>
        {delta && (
          <span className={['inline-flex items-center gap-0.5 text-[10px] font-bold whitespace-nowrap', deltaMap[deltaTone] || 'text-[var(--c-text-muted)]'].join(' ')}>
            {deltaTone === 'success' && delta.startsWith('+') && <TrendingUp size={9} strokeWidth={2.8} />}
            {deltaTone === 'danger' && <TrendingUp size={9} strokeWidth={2.8} className="rotate-180" />}
            {delta}
          </span>
        )}
      </div>
      <p className="text-[10px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">
        {label}
      </p>
      <p className="text-[16px] font-black text-[var(--c-text)] m-0 mt-0.5 tabular-nums tracking-[-0.3px]">
        {value}
      </p>
    </article>
  )
}
