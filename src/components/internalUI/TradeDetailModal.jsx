import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, X } from 'lucide-react'
import { countryLabel } from '../../hooks/useGiftCards'

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

export default function TradeDetailModal({ trade, brands, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const b = brands.find(x => x.id === trade.brandId)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[6px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
      >
        <div
          className="pointer-events-auto max-w-3xl h-[90vh] flex flex-col rounded-[20px] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(201,162,39,0.15)]"
          style={{ background: 'var(--c-surface)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative overflow-hidden flex items-center gap-3 px-5 py-4 border-b border-[var(--c-border)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,162,39,0.08)] via-transparent to-transparent pointer-events-none" />
            <span className="relative inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-[var(--c-border)] overflow-hidden p-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] shrink-0">
              {b?.logo ? <img src={b.logo} alt={trade.brandName} className="w-full h-full object-contain" /> : <Gift size={18} className="text-[var(--c-text-muted)]" />}
            </span>
            <div className="relative flex-1 min-w-0">
              <p className="text-[9px] uppercase tracking-[1.1px] font-bold text-brand-accent m-0">{trade.subCategoryName}</p>
              <p className="text-[15px] font-bold text-[var(--c-text)] m-0 truncate">{trade.brandName}</p>
            </div>
            <div className="relative flex items-center gap-2 shrink-0">
              <StatusBadge status={trade.status} />
              <button type="button" onClick={onClose}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] transition active:scale-90">
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Reference */}
          <div className="flex items-center justify-between gap-2 mx-5 mt-4 px-3 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border)]">
            <span className="text-[9px] uppercase tracking-[0.8px] font-bold text-[var(--c-text-muted)]">Reference</span>
            <span className="text-[11px] font-mono font-semibold text-[var(--c-text)] tracking-tight select-all">{trade.reference}</span>
          </div>

          {/* Breakdown */}
          <div className="mx-5 mt-3 rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)]">
            {[
              { label: 'Card type',    value: trade.cardType === 'physical' ? 'Physical card' : 'E-code' },
              { label: 'Country',      value: countryLabel(trade.countryId) },
              { label: 'Denomination', value: `${trade.currency}${trade.denomination}` },
              { label: 'Rate',         value: `${formatNGN(trade.rate)} / ${trade.currency}1` },
              { label: 'Gross payout', value: formatNGN(trade.receiveAmount) },
              { label: 'Fee deducted', value: `− ${formatNGN(trade.fee)}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                <span className="text-[11px] text-[var(--c-text-muted)]">{label}</span>
                <span className="text-[11.5px] font-semibold tabular-nums text-[var(--c-text)]">{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-2 px-3.5 py-3 bg-[rgba(16,185,129,0.06)]">
              <span className="text-[11.5px] font-bold text-[var(--c-text)]">You receive</span>
              <span className="text-[17px] font-black tabular-nums text-brand-accent">{formatNGN(trade.finalAmount)}</span>
            </div>
          </div>

          {/* Card images */}
          {trade.cardType === 'physical' && trade.cardImages.length > 0 && (
            <div className="mx-5 mt-3">
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

          {/* E-code */}
          {trade.cardType === 'ecode' && trade.cardEcode && (
            <div className="mx-5 mt-3">
              <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">E-code</p>
              <div className="px-3.5 py-3 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)]">
                <p className="text-[13px] font-mono font-semibold text-[var(--c-text)] m-0 break-all select-all">{trade.cardEcode}</p>
              </div>
            </div>
          )}

          <p className="text-[10px] text-[var(--c-text-muted)] text-center py-4">{trade.createdAt}</p>
        </div>
      </motion.div>
    </>
  )
}
