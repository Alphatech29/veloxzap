import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gift, History, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import useGiftCards, { countryLabel } from '../../hooks/useGiftCards'
import BottomSheet from '../../components/internalUI/BottomSheet'

function formatNGN(n) {
  return '₦' + Number(n).toLocaleString('en-NG')
}

function StatusBadge({ status }) {
  const map = {
    pending:    { label: 'Pending',    cls: 'bg-[var(--c-warn-bg)] text-[var(--c-warn)]' },
    processing: { label: 'Processing', cls: 'bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]' },
    paid:       { label: 'Paid',       cls: 'bg-[var(--c-success-bg)] text-[var(--c-success)]' },
    failed:     { label: 'Failed',     cls: 'bg-[var(--c-danger-soft)] text-[var(--c-danger)]' },
    completed:  { label: 'Completed',  cls: 'bg-[var(--c-success-bg)] text-[var(--c-success)]' },
  }
  const s = map[status] || map.pending
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold ${s.cls}`}>
      {s.label}
    </span>
  )
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className={`flex items-center justify-between gap-2 px-3.5 py-2.5 ${highlight ? 'bg-[rgba(16,185,129,0.06)]' : ''}`}>
      <span className="text-[10.5px] text-[var(--c-text-muted)]">{label}</span>
      <span className={`text-right tabular-nums ${highlight ? 'text-[15px] font-black text-brand-accent' : 'text-[11.5px] font-semibold text-[var(--c-text)]'}`}>
        {value}
      </span>
    </div>
  )
}

function TradeDetailSheet({ trade, brands, open, onClose }) {
  const b = brands.find(x => x.id === trade?.brandId)
  return (
    <BottomSheet open={open} onClose={onClose} maxHeight="90vh">
      {trade && (
        <div className="px-5 pt-2" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 28px)' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-[var(--c-border)] overflow-hidden p-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] shrink-0">
              {b?.logo ? <img src={b.logo} alt={trade.brandName} className="w-full h-full object-contain" /> : <Gift size={18} className="text-[var(--c-text-muted)]" />}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] uppercase tracking-[1.1px] font-bold text-brand-accent m-0">{trade.subCategoryName}</p>
              <p className="text-[16px] font-bold text-[var(--c-text)] m-0 leading-tight truncate">{trade.brandName}</p>
            </div>
            <StatusBadge status={trade.status} />
          </div>

          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border)] mb-4">
            <span className="text-[9px] uppercase tracking-[0.8px] font-bold text-[var(--c-text-muted)]">Reference</span>
            <span className="text-[10.5px] font-mono font-semibold text-[var(--c-text)] tracking-tight select-all">{trade.reference}</span>
          </div>

          <div className="rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)] bg-[var(--c-surface-soft)]">
            <DetailRow label="Card type"    value={trade.cardType === 'physical' ? 'Physical card' : 'E-code'} />
            <DetailRow label="Country"      value={countryLabel(trade.countryId)} />
            <DetailRow label="Denomination" value={`${trade.currency}${trade.denomination}`} />
            <DetailRow label="Rate"         value={`${formatNGN(trade.rate)} / ${trade.currency}1`} />
            <DetailRow label="Gross payout" value={formatNGN(trade.receiveAmount)} />
            <DetailRow label="Fee deducted" value={`− ${formatNGN(trade.fee)}`} />
            <DetailRow label="You receive"  value={formatNGN(trade.finalAmount)} highlight />
          </div>

          {trade.cardType === 'physical' && trade.cardImages.length > 0 && (
            <div className="mt-4">
              <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">Card images</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {trade.cardImages.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[var(--c-border)]">
                    <img src={`${import.meta.env.VITE_API_BASE_URL}/uploads/images/${img}`} alt={`Card ${i + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute top-1.5 left-1.5 inline-flex items-center justify-center w-5 h-5 rounded-md bg-black/55 text-white text-[9px] font-black">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {trade.cardType === 'ecode' && trade.cardEcodes.length > 0 && (
            <div className="mt-4">
              <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">
                E-code{trade.cardEcodes.length > 1 ? 's' : ''}
              </p>
              <div className="flex flex-col gap-1.5">
                {trade.cardEcodes.map((code, i) => (
                  <div key={i} className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)]">
                    {trade.cardEcodes.length > 1 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9px] font-black text-brand-accent shrink-0">
                        {i + 1}
                      </span>
                    )}
                    <p className="text-[13px] font-mono font-semibold text-[var(--c-text)] m-0 break-all select-all">{code}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[10px] text-[var(--c-text-muted)] text-center mt-4">{trade.createdAt}</p>
        </div>
      )}
    </BottomSheet>
  )
}

const STATUSES = ['All', 'processing', 'completed',  'failed']
const STATUS_LABELS = { All: 'All', processing: 'Processing', completed: 'Completed', failed: 'Failed' }

export default function MobileTradeHistory() {
  const navigate = useNavigate()
  const { brands, recentTrades, recentLoading } = useGiftCards()
  const [selectedTrade, setSelectedTrade] = useState(null)
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? recentTrades : recentTrades.filter(t => t.status === filter)

  return (
    <div className="flex flex-col pb-28">

      {/* Header */}
      <div className="flex items-center gap-3 -mt-1 mb-3">
        <button type="button" onClick={() => navigate('/user/trade-cards')}
          className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] active:scale-95 transition shrink-0">
          <ChevronLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[9.5px] uppercase tracking-[1.2px] font-bold text-brand-accent m-0 inline-flex items-center gap-1">
            <History size={9} /> Gift cards
          </p>
          <h1 className="text-[17px] font-bold tracking-[-0.3px] text-[var(--c-text)] m-0 leading-tight">Trade history</h1>
        </div>
        {!recentLoading && (
          <span className="text-[10px] font-bold text-[var(--c-text-muted)] bg-[var(--c-surface)] border border-[var(--c-border)] px-2 py-0.5 rounded-full tabular-nums shrink-0">
            {recentTrades.length}
          </span>
        )}
      </div>

      {/* Status filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
        {STATUSES.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={[
              'shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold transition whitespace-nowrap',
              filter === s
                ? 'bg-brand-accent text-brand-primary'
                : 'bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text-muted)]',
            ].join(' ')}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
        {recentLoading ? (
          <ul className="list-none m-0 p-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className={`flex items-center gap-2.5 px-3.5 py-3 ${i > 0 ? 'border-t border-[var(--c-border)]' : ''}`}>
                <div className="w-9 h-9 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] animate-pulse shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-2.5 w-28 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
                  <div className="h-2 w-16 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="h-3 w-14 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
                  <div className="h-3.5 w-12 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
                </div>
              </li>
            ))}
          </ul>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)]">
              <History size={18} />
            </span>
            <p className="text-[11px] text-[var(--c-text-muted)] m-0 text-center">
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
                    className="w-full flex items-center gap-2.5 px-3.5 py-3 text-left active:bg-[var(--c-surface-soft)] transition-colors">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[var(--c-border)] overflow-hidden p-1.5 shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                      {b?.logo ? <img src={b.logo} alt={b.name} className="w-full h-full object-contain" /> : <Gift size={14} className="text-[var(--c-text-muted)]" />}
                    </span>
                    <div className="flex-1 min-w-0 leading-tight">
                      <p className="text-[12px] font-semibold text-[var(--c-text)] m-0 truncate">
                        {t.brandName} <span className="text-[var(--c-text-muted)] font-normal">· {countryLabel(t.countryId)}</span>
                      </p>
                      <div className="flex items-center mt-0.5">

                        <span className="text-[var(--c-border-soft)] select-none">·</span>
                        <span className="text-[9px] text-[var(--c-text-muted)]">{t.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[12.5px] font-black tabular-nums text-brand-accent">{t.currency}{t.denomination}</span>
                      <StatusBadge status={t.status} />
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <TradeDetailSheet
        trade={selectedTrade}
        brands={brands}
        open={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
      />
    </div>
  )
}
