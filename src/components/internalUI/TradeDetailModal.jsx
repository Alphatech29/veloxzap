import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { Gift, X, GripVertical, Copy, Check } from 'lucide-react'
import { countryLabel } from '../../hooks/useGiftCards'
import { TRADE_STATUS } from '../../constants/status'

function formatNGN(n) {
  return '₦' + Number(n).toLocaleString('en-NG')
}

function StatusBadge({ status }) {
  const s = TRADE_STATUS[status] || TRADE_STATUS.pending
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold ${s.cls}`}>
      {s.label}
    </span>
  )
}

export default function TradeDetailModal({ trade, brands, onClose }) {
  const dragControls = useDragControls()
  const constraintsRef = useRef(null)
  const [copiedValue, setCopiedValue] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function startDrag(e) {
    if (e.target.closest('button')) return
    dragControls.start(e)
  }

  function copyValue(value) {
    if (navigator.clipboard) navigator.clipboard.writeText(value)
    setCopiedValue(value)
    setTimeout(() => setCopiedValue(null), 1500)
  }

  const b = brands.find(x => x.id === trade.brandId)
  const hasQty = trade.cardQty > 1

  const rows = [
    { label: 'Card type',    value: trade.cardType === 'physical' ? 'Physical card' : 'E-code' },
    ...(hasQty ? [{ label: 'Quantity', value: `${trade.cardQty} cards` }] : []),
    { label: 'Country',      value: countryLabel(trade.countryId) },
    { label: 'Denomination', value: `${trade.currency}${trade.denomination}${hasQty ? ` × ${trade.cardQty}` : ''}` },
    { label: 'Rate',         value: `${formatNGN(trade.rate)} / ${trade.currency}1` },
    { label: 'Gross payout', value: formatNGN(trade.receiveAmount) },
    { label: 'Fee deducted', value: `− ${formatNGN(trade.fee)}` },
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[6px]"
        onClick={onClose}
      />
      <div
        ref={constraintsRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
      >
        <motion.div
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={constraintsRef}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
          className="pointer-events-auto w-[640px] max-w-[92vw] h-[90vh] flex flex-col rounded-[20px] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(201,162,39,0.15)]"
          style={{ background: 'var(--c-surface)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header — drag handle */}
          <div
            onPointerDown={startDrag}
            title="Drag to move"
            className="relative overflow-hidden flex items-center gap-3 px-5 py-4 border-b border-[var(--c-border)] cursor-grab active:cursor-grabbing touch-none select-none"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,162,39,0.08)] via-transparent to-transparent pointer-events-none" />
            <GripVertical size={14} className="relative text-[var(--c-text-faint)] shrink-0" />
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

          {/* Scrollable body */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* Reference */}
            <div className="flex items-center justify-between gap-2 mx-5 mt-4 px-3 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border)]">
              <span className="text-[9px] uppercase tracking-[0.8px] font-bold text-[var(--c-text-muted)]">Reference</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[11px] font-mono font-semibold text-[var(--c-text)] tracking-tight select-all">{trade.reference}</span>
                <button
                  type="button"
                  onClick={() => copyValue(trade.reference)}
                  aria-label="Copy reference"
                  className="inline-flex items-center justify-center w-5 h-5 rounded shrink-0 text-[var(--c-text-muted)] hover:text-brand-accent transition"
                >
                  {copiedValue === trade.reference ? <Check size={11} className="text-[var(--c-success)]" /> : <Copy size={11} />}
                </button>
              </span>
            </div>

            {/* Breakdown */}
            <div className="mx-5 mt-3 rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)]">
              {rows.map(({ label, value }) => (
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

            {/* Rejection reason */}
            {trade.status === 'failed' && trade.rejectNote && (
              <div className="mx-5 mt-3 px-3.5 py-3 rounded-xl bg-[var(--c-danger-soft)] border border-[rgba(248,113,113,0.25)]">
                <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-danger)] mb-1 m-0">Rejection reason</p>
                <p className="text-[12px] text-[var(--c-text)] m-0 leading-snug">{trade.rejectNote}</p>
              </div>
            )}

            {/* Card images */}
            {trade.cardType === 'physical' && trade.cardImages.length > 0 && (
              <div className="mx-5 mt-3">
                <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">
                  Card image{trade.cardImages.length > 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {trade.cardImages.map((img, i) => {
                    const url = `${import.meta.env.VITE_API_BASE_URL}/uploads/images/${img}`
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPreviewImage(url)}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-soft)]"
                      >
                        <img src={url} alt={`Card ${i + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute top-1.5 left-1.5 inline-flex items-center justify-center w-5 h-5 rounded-md bg-black/55 text-white text-[9px] font-black">{i + 1}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* E-code */}
            {trade.cardType === 'ecode' && trade.cardEcodes.length > 0 && (
              <div className="mx-5 mt-3">
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
                      <p className="text-[13px] font-mono font-semibold text-[var(--c-text)] m-0 break-all select-all flex-1">{code}</p>
                      <button
                        type="button"
                        onClick={() => copyValue(code)}
                        aria-label="Copy e-code"
                        className="inline-flex items-center justify-center w-5 h-5 rounded shrink-0 text-[var(--c-text-muted)] hover:text-brand-accent transition"
                      >
                        {copiedValue === code ? <Check size={11} className="text-[var(--c-success)]" /> : <Copy size={11} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[10px] text-[var(--c-text-muted)] text-center py-4">{trade.createdAt}</p>
          </div>
        </motion.div>
      </div>

      {/* Image lightbox */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewImage(null)}
          >
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
              src={previewImage}
              alt="Card preview"
              className="max-w-full max-h-full rounded-xl object-contain shadow-[0_32px_100px_rgba(0,0,0,0.55)]"
              onClick={e => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              aria-label="Close preview"
              className="absolute top-5 right-5 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition active:scale-90"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
