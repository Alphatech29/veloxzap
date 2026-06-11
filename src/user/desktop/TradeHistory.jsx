import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Gift, History, ChevronRight, Sparkles } from 'lucide-react'
import useGiftCards, { countryLabel } from '../../hooks/useGiftCards'
import TradeDetailModal from '../../components/internalUI/TradeDetailModal'

function formatNGN(n) {
  return '₦' + Number(n).toLocaleString('en-NG')
}

function StatusBadge({ status }) {
  const map = {
    pending:    { label: 'Pending',    cls: 'bg-[var(--c-warn-bg)] text-[var(--c-warn)]' },
    processing: { label: 'Processing', cls: 'bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]' },
    paid:       { label: 'Paid',       cls: 'bg-[var(--c-success-bg)] text-[var(--c-success)]' },
    failed:     { label: 'Failed',     cls: 'bg-[var(--c-danger-bg,#3a1a1a)] text-[var(--c-danger,#f87171)]' },
    completed:  { label: 'Completed',  cls: 'bg-[var(--c-success-bg)] text-[var(--c-success)]' },
  }
  const s = map[status] || map.pending
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold ${s.cls}`}>
      {s.label}
    </span>
  )
}

const STATUSES = ['All','processing', 'completed', 'failed']
const STATUS_LABELS = { All: 'All', processing: 'Processing', completed: 'Completed', failed: 'Failed' }

export default function DesktopTradeHistory() {
  const { brands, recentTrades, recentLoading } = useGiftCards()
  const [selectedTrade, setSelectedTrade] = useState(null)
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? recentTrades : recentTrades.filter(t => t.status === filter)

  return (
    <div className="flex flex-col gap-4 max-w-[860px] mx-auto pb-8">

      {/* Header */}
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
            <Sparkles size={10} /> Gift cards
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">Trade history</h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            All your gift card trades
          </p>
        </div>
        {!recentLoading && (
          <span className="text-[11px] font-bold text-[var(--c-text-muted)] bg-[var(--c-surface)] border border-[var(--c-border)] px-3 py-1 rounded-full tabular-nums">
            {recentTrades.length} total
          </span>
        )}
      </header>

      {/* Status filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={[
              'inline-flex items-center px-3 py-1 rounded-full text-[10.5px] font-bold transition',
              filter === s
                ? 'bg-brand-accent text-brand-primary'
                : 'bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text-muted)] hover:border-[var(--c-accent-border)] hover:text-brand-accent',
            ].join(' ')}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-2 border-b border-[var(--c-border)] bg-[var(--c-surface-soft)]">
          <span className="w-8" />
          <span className="text-[9px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)]">Brand</span>
          <span className="text-[9px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] text-right">Amount traded</span>
          <span className="text-[9px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] text-right">You received</span>
          <span className="text-[9px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] text-right">Status</span>
        </div>

        {recentLoading ? (
          <ul className="list-none m-0 p-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className={`grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-3 ${i > 0 ? 'border-t border-[var(--c-border)]' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-[var(--c-surface-soft)] animate-pulse" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-2.5 w-32 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
                  <div className="h-2 w-20 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
                </div>
                <div className="h-3 w-16 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
                <div className="h-3 w-20 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
                <div className="h-4 w-14 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
              </li>
            ))}
          </ul>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)]">
              <History size={20} />
            </span>
            <p className="text-[12px] text-[var(--c-text-muted)] m-0">
              {filter === 'All' ? 'No trades yet.' : `No ${STATUS_LABELS[filter].toLowerCase()} trades.`}
            </p>
          </div>
        ) : (
          <ul className="list-none m-0 p-0">
            {filtered.map((t, i) => {
              const b = brands.find(x => x.id === t.brandId)
              return (
                <li key={t.id ?? i} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                  <button type="button" onClick={() => setSelectedTrade(t)}
                    className="w-full grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-4 py-3 text-left hover:bg-[var(--c-surface-soft)] transition-colors group">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-[var(--c-border)] overflow-hidden p-1 shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                      {b?.logo ? <img src={b.logo} alt={b.name} className="w-full h-full object-contain" /> : <Gift size={13} className="text-[var(--c-text-muted)]" />}
                    </span>
                    <div className="min-w-0 leading-tight">
                      <p className="text-[12px] font-semibold text-[var(--c-text)] m-0 truncate">
                        {t.brandName} <span className="text-[var(--c-text-muted)] font-normal">· {countryLabel(t.countryId)}</span>
                      </p>
                      <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 mt-0.5">{t.createdAt}</p>
                    </div>

                    <span className="text-[12px] font-black tabular-nums text-brand-accent text-right">
                     {t.currency}{t.denomination}
                    </span>
                    <div className="flex items-center gap-2 justify-end">
                      <StatusBadge status={t.status} />
                      <ChevronRight size={12} className="text-[var(--c-text-faint)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <AnimatePresence>
        {selectedTrade && (
          <TradeDetailModal
            trade={selectedTrade}
            brands={brands}
            onClose={() => setSelectedTrade(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
