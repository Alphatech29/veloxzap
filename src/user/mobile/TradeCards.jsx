import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Gift, Check, ShieldCheck, X, Loader2,
  Plus, Trash2, AlertCircle, TrendingUp, Hash, ImageIcon, Upload, ChevronDown,
  Search, Lock, Tag, History,
} from 'lucide-react'
import useGiftCards, { DENOMINATIONS, countryLabel, countryCode } from '../../hooks/useGiftCards'
import { useAlert } from '../../components/ui/Alert'
import BottomSheet from '../../components/internalUI/BottomSheet'
import MobilePageHeader from '../../components/partials/MobilePageHeader'
import { TRADE_STATUS } from '../../constants/status'

function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG')
}

function StatusBadge({ status }) {
  const s = TRADE_STATUS[status] || TRADE_STATUS.pending
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold ${s.cls}`}>
      {s.label}
    </span>
  )
}

function FieldLabel({ children, aside }) {
  return (
    <div className="flex items-center justify-between mb-2 px-0.5">
      <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">{children}</p>
      {aside && <span className="text-[9.5px] text-[var(--c-text-muted)]">{aside}</span>}
    </div>
  )
}

function ImageSlot({ index, file, onFiles, onRemove }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!file) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  return (
    <div className="relative">
      <input ref={inputRef} type="file" accept="image/png,image/jpeg" multiple className="hidden"
        onChange={e => {
          const allowed = Array.from(e.target.files).filter(f => /\.(png|jpe?g)$/i.test(f.name))
          if (allowed.length) onFiles(allowed)
          e.target.value = ''
        }} />
      {file ? (
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-[var(--c-accent-border)]">
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute top-1.5 left-1.5 inline-flex items-center justify-center w-5 h-5 rounded-md bg-brand-accent text-brand-primary text-[9px] font-black">{index + 1}</span>
          <button type="button" onClick={onRemove} className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/60 text-white active:scale-90 transition">
            <X size={11} />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full aspect-[4/3] rounded-xl flex flex-col items-center justify-center gap-1.5 bg-[var(--c-surface)] border border-dashed border-[var(--c-border)] active:scale-[0.97] transition">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent">
            <Upload size={13} />
          </span>
          <span className="text-[9.5px] font-semibold text-[var(--c-text-muted)] leading-tight px-1">Card {index + 1}</span>
        </button>
      )}
    </div>
  )
}

/* ── Rates bottom sheet ─────────────────────────────────────── */
function RatesSheet({ open, brands, brandsLoading, onClose }) {
  const [query, setQuery] = useState('')

  const filtered = brands.filter(b =>
    b.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <BottomSheet open={open} onClose={onClose} maxHeight="88vh">
        {/* Header */}
        <div className="relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,162,39,0.1)] via-transparent to-transparent pointer-events-none" />
          <div className="relative flex items-center justify-between gap-3 px-5 pt-3 pb-3">
            <div>
              <p className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[1.3px] font-bold text-brand-accent m-0">
                <Tag size={8} /> Card rates
              </p>
              <h2 className="text-[17px] font-bold tracking-[-0.3px] text-[var(--c-text)] m-0 mt-0.5">Rate list</h2>
              <p className="text-[10.5px] text-[var(--c-text-muted)] m-0">NGN payout per card unit</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
            >
              <X size={14} />
            </button>
          </div>

          {/* Search */}
          <div className="px-5 pb-3">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition">
              <Search size={14} className="text-[var(--c-text-muted)] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search brands…"
                className="flex-1 bg-transparent border-0 outline-none text-[13px] font-medium text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                style={{ boxShadow: 'none' }}
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.12 }}
                    type="button"
                    onClick={() => setQuery('')}
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--c-border)] text-[var(--c-text-muted)] transition"
                  >
                    <X size={10} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--c-border)] to-transparent" />
        </div>

        {/* Rate list */}
        <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-1.5">
          {brandsLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-[var(--c-border)] shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-3 w-28 rounded-full bg-[var(--c-border)]" />
                  <div className="h-2.5 w-14 rounded-full bg-[var(--c-border)]" />
                </div>
                <div className="h-4 w-16 rounded-full bg-[var(--c-border)]" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)]">
                <Search size={20} />
              </span>
              <p className="text-[12px] text-[var(--c-text-muted)] m-0">No brands match <strong>"{query}"</strong></p>
            </div>
          ) : (
            filtered.flatMap(brand =>
              brand.sub_categories
                .filter(s => s.status === 1)
                .map(sc => (
                  <div
                    key={`${brand.id}-${sc.country}-${sc.card_type}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]"
                  >
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[var(--c-border)] p-1.5 shadow-sm shrink-0">
                      <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                    </span>
                    <div className="flex-1 min-w-0 leading-tight">
                      <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0 truncate">
                        {brand.name}
                        <span className="text-[var(--c-text-muted)] font-semibold"> · {countryLabel(sc.country)}</span>
                      </p>
                      <span className={[
                        'inline-flex items-center mt-0.5 px-1.5 py-[1px] rounded-full text-[9px] font-bold uppercase tracking-[0.6px]',
                        sc.card_type === 'ecode'
                          ? 'bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]'
                          : 'bg-[var(--c-surface)] text-[var(--c-text-muted)] border border-[var(--c-border)]',
                      ].join(' ')}>
                        {sc.card_type === 'ecode' ? 'E-code' : 'Physical'}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[14px] font-black tabular-nums text-brand-accent m-0">
                        ₦{Number(sc.rate).toLocaleString('en-NG')}
                      </p>
                      <p className="text-[9.5px] text-[var(--c-text-muted)] m-0">per {sc.currency}1</p>
                    </div>
                  </div>
                ))
            )
          )}
        </div>

        <div className="shrink-0 px-5 py-2.5 border-t border-[var(--c-border)] bg-[var(--c-surface-soft)] flex items-center justify-center gap-1.5">
          <ShieldCheck size={10} className="text-brand-accent" />
          <span className="text-[10px] text-[var(--c-text-muted)]">Rates update in real time · subject to change</span>
        </div>
    </BottomSheet>
  )
}

/* ── Brand picker bottom sheet ──────────────────────────────── */
function BrandSheet({ open, brands, brandsLoading, selectedId, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  const tradeable   = brands.filter(b => b.sub_categories.some(s => s.status === 1))
  const unavailable = brands.filter(b => !b.sub_categories.some(s => s.status === 1))

  const filter = list => query.trim()
    ? list.filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
    : list

  const filteredTradeable   = filter(tradeable)
  const filteredUnavailable = filter(unavailable)
  const isEmpty = filteredTradeable.length === 0 && filteredUnavailable.length === 0

  return (
    <BottomSheet open={open} onClose={onClose} maxHeight="88vh">
        {/* Header */}
        <div className="relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,162,39,0.1)] via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-brand-accent/[0.07] blur-3xl pointer-events-none" />

          <div className="relative flex items-center justify-between gap-3 px-5 pt-3 pb-3">
            <div>
              <p className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[1.3px] font-bold text-brand-accent m-0">
                <Sparkles size={8} /> Gift cards
              </p>
              <h2 className="text-[17px] font-bold tracking-[-0.3px] text-[var(--c-text)] m-0 mt-0.5">Select brand</h2>
              <p className="text-[10.5px] text-[var(--c-text-muted)] m-0">{tradeable.length} brands · instant payout</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
            >
              <X size={14} />
            </button>
          </div>

          {/* Search */}
          <div className="px-5 pb-3">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition">
              <Search size={14} className="text-[var(--c-text-muted)] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search brands…"
                className="flex-1 bg-transparent border-0 outline-none text-[13px] font-medium text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                style={{ boxShadow: 'none' }}
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.12 }}
                    type="button"
                    onClick={() => setQuery('')}
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--c-border)] text-[var(--c-text-muted)] transition"
                  >
                    <X size={10} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[var(--c-border)] to-transparent" />
        </div>

        {/* Brand grid */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
        >
          {brandsLoading ? (
            <div>
              <div className="h-3 w-24 rounded-full bg-[var(--c-surface-soft)] animate-pulse mb-3" />
              <div className="grid grid-cols-4 gap-2.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-soft)] animate-pulse">
                    <div className="w-11 h-11 rounded-xl bg-[var(--c-border)]" />
                    <div className="h-2.5 w-10 rounded-full bg-[var(--c-border)]" />
                  </div>
                ))}
              </div>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)]">
                <Search size={20} />
              </span>
              <p className="text-[12px] text-[var(--c-text-muted)] m-0">No brands match <strong>"{query}"</strong></p>
            </div>
          ) : (
            <>
              {filteredTradeable.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-[1.4px] font-bold text-[var(--c-text-faint)] mb-3 m-0">
                    Available · {filteredTradeable.length} brands
                  </p>
                  <div className="grid grid-cols-4 gap-2.5">
                    {filteredTradeable.map(b => {
                      const isSelected = selectedId === b.id
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => onSelect(b.id)}
                          className={[
                            'group relative overflow-hidden flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl transition-all active:scale-[0.96]',
                            isSelected
                              ? 'border-2 shadow-[0_4px_16px_rgba(201,162,39,0.22)]'
                              : 'border',
                          ].join(' ')}
                          style={isSelected
                            ? { background: 'rgba(201,162,39,0.08)', borderColor: 'var(--c-accent-border-strong)' }
                            : { background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)' }
                          }
                        >
                          {isSelected && (
                            <span aria-hidden className="absolute -top-5 left-1/2 -translate-x-1/2 w-16 h-10 rounded-full bg-brand-accent/[0.18] blur-xl pointer-events-none" />
                          )}

                          <span className={[
                            'relative inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white overflow-hidden p-2 transition',
                            isSelected
                              ? 'shadow-[0_3px_12px_rgba(201,162,39,0.28),0_0_0_2px_rgba(201,162,39,0.22)]'
                              : 'shadow-[0_2px_6px_rgba(0,0,0,0.09)]',
                          ].join(' ')}>
                            <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
                          </span>

                          <span className={`text-[9.5px] font-bold text-center leading-tight line-clamp-2 w-full transition ${isSelected ? 'text-brand-accent' : 'text-[var(--c-text)]'}`}>
                            {b.name}
                          </span>

                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-brand-accent text-brand-primary">
                              <Check size={7.5} strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {filteredUnavailable.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <p className="text-[9px] uppercase tracking-[1.4px] font-bold text-[var(--c-text-faint)] m-0">
                      Coming soon · {filteredUnavailable.length} brands
                    </p>
                    <Lock size={9} className="text-[var(--c-text-faint)]" />
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {filteredUnavailable.map(b => (
                      <div
                        key={b.id}
                        className="flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl border opacity-35 cursor-not-allowed"
                        style={{ background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)' }}
                      >
                        <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white overflow-hidden p-2 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                          <img src={b.logo} alt={b.name} className="w-full h-full object-contain grayscale" />
                        </span>
                        <span className="text-[9.5px] font-bold text-[var(--c-text)] text-center leading-tight line-clamp-2 w-full">
                          {b.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer trust line */}
        <div className="shrink-0 px-5 py-2.5 border-t border-[var(--c-border)] bg-[var(--c-surface-soft)] flex items-center justify-center gap-1.5">
          <ShieldCheck size={10} className="text-brand-accent" />
          <span className="text-[10px] text-[var(--c-text-muted)]">Best rates · Verified in minutes</span>
        </div>
    </BottomSheet>
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
          {/* Brand header */}
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

          {/* Reference */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border)] mb-4">
            <span className="text-[9px] uppercase tracking-[0.8px] font-bold text-[var(--c-text-muted)]">Reference</span>
            <span className="text-[10.5px] font-mono font-semibold text-[var(--c-text)] tracking-tight select-all">{trade.reference}</span>
          </div>

          {/* Breakdown */}
          <div className="rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)] bg-[var(--c-surface-soft)]">
            <DetailRow label="Card type"    value={trade.cardType === 'physical' ? 'Physical card' : 'E-code'} />
            <DetailRow label="Country"      value={countryLabel(trade.countryId)} />
            <DetailRow label="Denomination" value={`${trade.currency}${trade.denomination}`} />
            <DetailRow label="Rate"         value={`${formatNGN(trade.rate)} / ${trade.currency}1`} />
            <DetailRow label="Gross payout" value={formatNGN(trade.receiveAmount)} />
            <DetailRow label="Fee deducted" value={`− ${formatNGN(trade.fee)}`} />
            <DetailRow label="You receive"  value={formatNGN(trade.finalAmount)} highlight />
          </div>

          {/* Card content */}
          {trade.cardType === 'physical' && trade.cardImages.length > 0 && (
            <div className="mt-4">
              <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">Card images</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {trade.cardImages.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-soft)]">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/uploads/images/${img}`}
                      alt={`Card ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
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

export default function MobileTradeCards() {
  const navigate = useNavigate()
  const { alert } = useAlert()
  const {
    brands, brandsLoading,
    recentTrades, recentLoading,
    submitting, submitError,
    submit, reset,
  } = useGiftCards()

  const [brand, setBrand]         = useState(null)
  const [country, setCountry]     = useState(null)
  const [denomination, setDenom]   = useState(null)
  const [customDenom, setCustomDenom] = useState('')
  const [cardType, setCardType]    = useState(null)
  const [codes, setCodes]         = useState([''])
  const [images, setImages]       = useState([null])
  const [brandSheetOpen, setBrandSheetOpen] = useState(false)
  const [sheetOpen, setSheetOpen]           = useState(false)
  const [ratesSheetOpen, setRatesSheetOpen] = useState(false)
  const [selectedTrade, setSelectedTrade]   = useState(null)

  // ── Derived ───────────────────────────────────────────────────
  const selectedBrandData = brands.find(b => b.id === brand)
  const activeSubCats     = (selectedBrandData?.sub_categories || []).filter(s => s.status === 1)

  const availableCountries = (() => {
    const seen = new Set()
    return activeSubCats
      .filter(sc => { if (seen.has(sc.country)) return false; seen.add(sc.country); return true })
      .map(sc => ({
        id:     sc.country,
        label:  countryLabel(sc.country),
        code:   countryCode(sc.country),
        symbol: sc.currency,
      }))
  })()

  const availableCardTypes = (() => {
    const seen = new Set()
    return activeSubCats
      .filter(sc => sc.country === country && !seen.has(sc.card_type) && seen.add(sc.card_type))
      .map(sc => sc.card_type)
  })()

  const activeSubCat  = activeSubCats.find(sc => sc.country === country && sc.card_type === cardType) || null
  const countryInfo   = availableCountries.find(c => c.id === country)
  const rate          = activeSubCat?.rate || null
  const ngnPayout     = rate && denomination ? Math.round(denomination * rate) : null
  const validCodes    = codes.map(c => c.trim()).filter(Boolean)
  const validImages   = images.filter(Boolean)
  const itemCount     = cardType === 'ecode' ? validCodes.length : validImages.length
  const totalPayout   = ngnPayout && itemCount ? ngnPayout * itemCount : null
  const ready         = brand && country && denomination && cardType &&
    (cardType === 'ecode' ? validCodes.length > 0 : validImages.length > 0)

  const tradeableBrands = brands.filter(b => b.sub_categories.some(s => s.status === 1))

  function resetFrom(level) {
    if (level <= 1) { setCountry(null); setDenom(null); setCustomDenom(''); setCardType(null); setCodes(['']); setImages([null]) }
    if (level <= 2) { setDenom(null); setCustomDenom(''); setCardType(null); setCodes(['']); setImages([null]) }
    if (level <= 3) { setCardType(null); setCodes(['']); setImages([null]) }
    if (level <= 4) { setCodes(['']); setImages([null]) }
  }

  async function handleConfirm() {
    const payload = { brandId: brand, subCategoryId: activeSubCat.id, denomination, cardType }
    if (cardType === 'ecode') payload.codes = validCodes
    else payload.images = validImages
    const result = await submit(payload)
    setSheetOpen(false)
    if (result.success) {
      alert({ type: 'success', title: 'Trade submitted!', message: result.message || "We'll verify and credit your wallet shortly." })
      setBrand(null); setCountry(null); setDenom(null); setCustomDenom(''); setCardType(null); setCodes(['']); setImages([null])
    } else {
      alert({ type: 'error', title: 'Submission failed', message: result.message })
    }
  }

  const CARD_TYPES = [
    { id: 'ecode',    label: 'E-code',       desc: 'Digital code', Icon: Hash },
    { id: 'physical', label: 'Physical card', desc: 'Upload photo', Icon: ImageIcon },
  ]

  return (
    <div className="flex flex-col gap-4 pb-28">

      <MobilePageHeader
        title="Trade gift cards"
        onBack={() => navigate('/user/dashboard')}
        right={
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRatesSheetOpen(true)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--c-surface)] border border-[var(--c-border)] text-[9px] font-bold uppercase tracking-[0.9px] text-[var(--c-text-muted)] active:scale-95 transition"
            >
              <Tag size={9} /> Rates
            </button>
          </div>
        }
      />

      {/* ── Unified form card ── */}
      <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden divide-y divide-[var(--c-border)]">

        {/* Brand — premium trigger */}
        <div className="p-3.5">
          <FieldLabel>Card brand</FieldLabel>
          {brandsLoading ? (
            <div className="h-[58px] rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] animate-pulse" />
          ) : (
            <button
              type="button"
              onClick={() => setBrandSheetOpen(true)}
              className={[
                'group relative w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl border transition-all active:scale-[0.98] text-left overflow-hidden',
                selectedBrandData
                  ? 'bg-gradient-to-r from-[rgba(201,162,39,0.07)] to-transparent border-[var(--c-accent-border)]'
                  : 'bg-[var(--c-surface-soft)] border-[var(--c-border)]',
              ].join(' ')}
            >
              {selectedBrandData && (
                <span aria-hidden className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand-accent/[0.1] blur-2xl pointer-events-none" />
              )}

              {selectedBrandData ? (
                <>
                  <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[rgba(201,162,39,0.2)] overflow-hidden p-1.5 shadow-[0_3px_10px_rgba(201,162,39,0.18)] shrink-0">
                    <img src={selectedBrandData.logo} alt={selectedBrandData.name} className="w-full h-full object-contain" />
                  </span>
                  <div className="relative flex-1 min-w-0">
                    <p className="text-[8.5px] uppercase tracking-[1.1px] font-bold text-brand-accent m-0">Selected brand</p>
                    <p className="text-[13px] font-bold text-[var(--c-text)] m-0 mt-0.5 truncate">{selectedBrandData.name}</p>
                  </div>
                  <span className="relative text-[9.5px] font-bold text-brand-accent bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] px-2 py-0.5 rounded-full shrink-0">
                    Change
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] shrink-0">
                    <Gift size={14} className="text-brand-accent" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">Step 1</p>
                    <p className="text-[13px] font-semibold text-[var(--c-text-faint)] m-0 mt-0.5">Choose a card brand…</p>
                  </div>
                  <ChevronDown size={15} className="text-[var(--c-text-muted)] shrink-0" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Country */}
        <AnimatePresence initial={false}>
          {brand && (
            <motion.div key="country" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }} className="overflow-hidden">
              <div className="p-3.5">
                <FieldLabel>Country</FieldLabel>
                {availableCountries.length === 0 ? (
                  <p className="text-[11px] text-[var(--c-text-muted)]">No rates configured for this brand yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {availableCountries.map(c => {
                      const active = country === c.id
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => { setCountry(c.id); resetFrom(2) }}
                          className={[
                            'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition active:scale-[0.96]',
                            active
                              ? 'bg-brand-accent text-brand-primary border border-[rgba(232,197,71,0.55)]'
                              : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)]',
                          ].join(' ')}
                        >
                          {c.label}
                          <span className={`text-[9.5px] ${active ? 'text-brand-primary/80' : 'text-[var(--c-text-muted)]'}`}>{c.symbol}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card type */}
        <AnimatePresence initial={false}>
          {brand && country && availableCardTypes.length > 0 && (
            <motion.div key="cardtype" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }} className="overflow-hidden">
              <div className="p-3.5">
                <FieldLabel>Card type</FieldLabel>
                <div className={`grid gap-2 ${availableCardTypes.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {CARD_TYPES.filter(t => availableCardTypes.includes(t.id)).map(({ id, label, desc, Icon }) => {
                    const active  = cardType === id
                    const typeSub = activeSubCats.find(sc => sc.country === country && sc.card_type === id)
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => { setCardType(id); resetFrom(4) }}
                        className={[
                          'relative overflow-hidden flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition active:scale-[0.97]',
                          active
                            ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border-2 border-[var(--c-accent-border-strong)]'
                            : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)]',
                        ].join(' ')}
                      >
                        {active && <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-12 h-12 rounded-full bg-brand-accent/[0.15] blur-xl" />}
                        <span className={[
                          'relative inline-flex items-center justify-center w-7 h-7 rounded-lg border shrink-0',
                          active
                            ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)]'
                            : 'bg-[var(--c-surface)] border-[var(--c-border-soft)] text-[var(--c-text-muted)]',
                        ].join(' ')}>
                          <Icon size={13} strokeWidth={2.2} />
                        </span>
                        <div className="relative flex-1 leading-tight min-w-0">
                          <p className="text-[11.5px] font-bold text-[var(--c-text)] m-0">{label}</p>
                          {typeSub && (
                            <p className="inline-flex items-center gap-1 text-[9px] font-bold text-brand-accent mt-0.5 m-0">
                              <TrendingUp size={8} /> {formatNGN(typeSub.rate)}/{typeSub.currency}1
                            </p>
                          )}
                        </div>
                        {active && (
                          <span className="relative inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-brand-accent text-brand-primary shrink-0">
                            <Check size={7.5} strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Denomination */}
        <AnimatePresence initial={false}>
          {brand && country && cardType && (
            <motion.div key="denom" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }} className="overflow-hidden">
              <div className="p-3.5">
                <FieldLabel aside={denomination && ngnPayout ? `= ${formatNGN(ngnPayout)}` : undefined}>
                  Denomination
                </FieldLabel>

                {/* Preset grid */}
                <div className="grid grid-cols-6 gap-1.5">
                  {DENOMINATIONS.map(d => {
                    const active = denomination === d && !customDenom
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => { setDenom(d); setCustomDenom(''); resetFrom(4) }}
                        className={[
                          'relative overflow-hidden flex flex-col items-center justify-center gap-0 py-2.5 rounded-xl transition active:scale-[0.96]',
                          active
                            ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.28)]'
                            : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)]',
                        ].join(' ')}
                      >
                        <span className={`text-[7.5px] font-bold uppercase ${active ? 'text-brand-primary/70' : 'text-[var(--c-text-muted)]'}`}>
                          {countryInfo?.symbol || '$'}
                        </span>
                        <span className="text-[12px] font-black tabular-nums">{d}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-[var(--c-border)]" />
                  <span className="text-[9px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-faint)]">or</span>
                  <div className="flex-1 h-px bg-[var(--c-border)]" />
                </div>

                {/* Custom amount input */}
                <div className={[
                  'flex items-center gap-2.5 px-3 py-3 rounded-xl border transition',
                  customDenom
                    ? 'bg-[var(--c-accent-soft)] border-[var(--c-accent-border-strong)] shadow-[0_0_0_3px_rgba(201,162,39,0.10)]'
                    : 'bg-[var(--c-surface-soft)] border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)]',
                ].join(' ')}>
                  <span className={`text-[13px] font-bold shrink-0 ${customDenom ? 'text-brand-accent' : 'text-[var(--c-text-muted)]'}`}>
                    {countryInfo?.symbol || '$'}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={customDenom}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d]/g, '')
                      setCustomDenom(raw)
                      setDenom(raw ? Number(raw) : null)
                      if (raw) resetFrom(4)
                    }}
                    placeholder="Enter custom amount"
                    className={[
                      'flex-1 bg-transparent border-0 outline-none focus:outline-none appearance-none text-[14px] font-semibold tabular-nums placeholder:font-normal placeholder:tracking-normal',
                      customDenom ? 'text-brand-accent placeholder:text-brand-accent/40' : 'text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]',
                    ].join(' ')}
                    style={{ boxShadow: 'none' }}
                  />
                  {customDenom && (
                    <button
                      type="button"
                      onClick={() => { setCustomDenom(''); setDenom(null) }}
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-accent/20 text-brand-accent active:scale-90 transition shrink-0"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Code / Image input ── */}
      <AnimatePresence initial={false}>
        {brand && country && cardType && denomination && (
          <motion.div key="input" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.2 }}
            className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-3.5">
            {cardType === 'ecode' ? (
              <>
                <FieldLabel aside={`${codes.length}/5`}>Card e-code{codes.length > 1 ? 's' : ''}</FieldLabel>
                <div className="flex flex-col gap-2">
                  {codes.map((code, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition overflow-hidden">
                        <div className="flex items-center gap-2 px-3 py-3">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9px] font-black text-brand-accent shrink-0">
                            {i + 1}
                          </span>
                          <input
                            type="text"
                            value={code}
                            onChange={e => setCodes(p => p.map((c, idx) => idx === i ? e.target.value : c))}
                            placeholder="Enter card code"
                            className="flex-1 min-w-0 bg-transparent border-0 outline-none focus:outline-none appearance-none text-[13px] font-mono font-semibold tracking-[0.4px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-sans placeholder:tracking-normal"
                            style={{ boxShadow: 'none' }}
                          />
                          {code && (
                            <button type="button" onClick={() => setCodes(p => p.map((c, idx) => idx === i ? '' : c))} className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[var(--c-text-muted)] shrink-0">
                              <X size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                      {codes.length > 1 && (
                        <button type="button" onClick={() => setCodes(p => p.filter((_, idx) => idx !== i))} className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] active:scale-95 transition shrink-0">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {codes.length < 5 && (
                  <button type="button" onClick={() => setCodes(p => [...p, ''])} className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-brand-accent active:scale-95 transition">
                    <Plus size={12} strokeWidth={2.5} /> Add another card
                  </button>
                )}
              </>
            ) : (
              <>
                <FieldLabel aside={`${validImages.length}/${images.length} uploaded`}>
                  Card image{images.length > 1 ? 's' : ''}
                </FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((file, i) => (
                    <ImageSlot
                      key={i} index={i} file={file}
                      onFiles={files => setImages(prev => {
                        const next = [...prev]
                        next[i] = files[0]
                        const extras = files.slice(1)
                        const slotsAvail = 5 - next.length
                        extras.slice(0, slotsAvail).forEach(f => next.push(f))
                        return next
                      })}
                      onRemove={() => images.length > 1
                        ? setImages(p => p.filter((_, idx) => idx !== i))
                        : setImages(p => p.map((img, idx) => idx === i ? null : img))}
                    />
                  ))}
                </div>
                {images.length < 5 && (
                  <>
                    <input
                      id="bulk-img-add"
                      type="file"
                      accept="image/png,image/jpeg"
                      multiple
                      className="hidden"
                      onChange={e => {
                        if (!e.target.files.length) return
                        const files = Array.from(e.target.files).filter(f => /\.(png|jpe?g)$/i.test(f.name))
                        if (!files.length) { e.target.value = ''; return }
                        setImages(prev => {
                          const next = [...prev]
                          files.slice(0, 5 - next.length).forEach(f => next.push(f))
                          return next
                        })
                        e.target.value = ''
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('bulk-img-add').click()}
                      className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-brand-accent active:scale-95 transition"
                    >
                      <Plus size={12} strokeWidth={2.5} /> Add more cards
                    </button>
                  </>
                )}
                <p className="mt-2 text-[10px] text-[var(--c-text-muted)] leading-snug">
                  Upload clear photos of each card face. You can select multiple at once. PNG, JPG or JPEG only.
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <div className="px-4 pb-4 pt-2">
        <button
          type="button"
          disabled={!ready || submitting}
          onClick={() => { reset(); setSheetOpen(true) }}
          className={[
            'w-full h-12 rounded-2xl inline-flex items-center justify-center gap-2 text-[13px] font-bold tracking-[0.2px] transition active:scale-[0.98]',
            ready && !submitting
              ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_8px_24px_-8px_rgba(201,162,39,0.55)]'
              : 'bg-[var(--c-surface)] text-[var(--c-text-muted)] border border-[var(--c-border)] cursor-not-allowed',
          ].join(' ')}
        >
          <Gift size={15} strokeWidth={2.4} />
          {!brand            ? 'Select a card brand'
            : !country       ? 'Select country'
            : !cardType      ? 'Select card type'
            : !denomination  ? 'Select denomination'
            : cardType === 'ecode'    && validCodes.length === 0   ? 'Enter card code'
            : cardType === 'physical' && validImages.length === 0  ? 'Upload card image'
            : `Review trade${totalPayout ? ` · ${formatNGN(totalPayout)}` : ''}`}
        </button>
      </div>

      {/* Recent trades */}
      <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 pt-3 pb-2.5 border-b border-[var(--c-border)]">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)]">
              <History size={10} className="text-brand-accent" />
            </span>
            <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">Recent trades</p>
          </div>
          {!recentLoading && recentTrades.length > 0 && (
            <button type="button" onClick={() => navigate('/user/trade-history')}
              className="text-[9px] font-bold text-brand-accent bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] px-2 py-0.5 rounded-full tabular-nums active:scale-95 transition">
              View all {recentTrades.length}
            </button>
          )}
        </div>

        {/* Loading skeleton */}
        {recentLoading ? (
          <ul className="list-none m-0 p-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className={`flex items-center gap-2.5 px-3.5 py-3 ${i > 0 ? 'border-t border-[var(--c-border)]' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border)] animate-pulse shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
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
        ) : recentTrades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 gap-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)]">
              <History size={18} />
            </span>
            <p className="text-[11px] text-[var(--c-text-muted)] m-0 text-center">No trades yet. Submit your first card above.</p>
          </div>
        ) : (
          <ul className="list-none m-0 p-0">
            {recentTrades.slice(0, 5).map((t, i) => {
              const b = brands.find(x => x.id === t.brandId)
              const cLabel = countryLabel(t.countryId)
              return (
                <li key={t.id ?? i} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                  <button type="button" onClick={() => setSelectedTrade(t)}
                    className="w-full flex items-center gap-2.5 px-3.5 py-3 text-left active:bg-[var(--c-surface-soft)] transition-colors">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[var(--c-border)] overflow-hidden p-1.5 shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                      {b?.logo
                        ? <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
                        : <Gift size={14} className="text-[var(--c-text-muted)]" />}
                    </span>
                    <div className="flex-1 min-w-0 leading-tight">
                      <p className="text-[12px] font-semibold text-[var(--c-text)] m-0 truncate">
                        {t.brandName} <span className="text-[var(--c-text-muted)] font-normal">· {cLabel}</span>
                      </p>
                      <div className="flex items-center mt-0.5">
                        <span className="text-[var(--c-border-soft)] select-none">·</span>
                        <span className="text-[9px] uppercase tracking-[0.4px] font-semibold text-[var(--c-text-faint)]">
                          {t.cardType === 'physical' ? 'Physical' : 'E-code'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[12.5px] font-black tabular-nums text-brand-accent">
                        {t.currency}{t.denomination}
                      </span>
                      <StatusBadge status={t.status} />
                    </div>

                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Rates sheet */}
      <RatesSheet
        open={ratesSheetOpen}
        brands={brands}
        brandsLoading={brandsLoading}
        onClose={() => setRatesSheetOpen(false)}
      />

      {/* Brand picker sheet */}
      <BrandSheet
        open={brandSheetOpen}
        brands={brands}
        brandsLoading={brandsLoading}
        selectedId={brand}
        onSelect={id => { setBrand(id); resetFrom(1); setBrandSheetOpen(false) }}
        onClose={() => setBrandSheetOpen(false)}
      />

      {/* Confirm sheet */}
      <BottomSheet open={sheetOpen} onClose={() => !submitting && setSheetOpen(false)} title="Confirm trade" closeOnScrimClick={!submitting}>
        <div className="px-5 pt-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] mb-4">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-[var(--c-border)] overflow-hidden p-1.5 shrink-0">
                    {selectedBrandData?.logo && <img src={selectedBrandData.logo} alt={selectedBrandData.name} className="w-full h-full object-contain" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[var(--c-text)] m-0 truncate">{selectedBrandData?.name}</p>
                    <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">{countryInfo?.label} · {countryInfo?.symbol}{denomination}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] uppercase tracking-[0.8px] font-bold text-[var(--c-text-muted)] m-0">{cardType === 'physical' ? 'Physical' : 'E-code'}</p>
                    <p className="text-[9px] text-[var(--c-text-muted)] m-0">{itemCount} card{itemCount > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[var(--c-text-muted)]">Rate</span>
                    <span className="text-[11.5px] font-semibold text-[var(--c-text)]">{rate ? `${formatNGN(rate)} per ${countryInfo?.symbol}1` : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[var(--c-text-muted)]">Total cards</span>
                    <span className="text-[11.5px] font-semibold text-[var(--c-text)]">{itemCount} × {countryInfo?.symbol}{denomination}</span>
                  </div>
                  <div className="border-t border-dashed border-[var(--c-border)]" />
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[var(--c-text)]">You receive</span>
                    <span className="text-[18px] font-black tabular-nums text-brand-accent tracking-[-0.3px]">{totalPayout ? formatNGN(totalPayout) : '₦—'}</span>
                  </div>
                </div>

                {submitError && (
                  <p className="inline-flex items-start gap-1.5 text-[10.5px] text-[var(--c-danger)] bg-[var(--c-danger-soft)] rounded-xl px-3 py-2 mb-3 w-full">
                    <AlertCircle size={12} className="shrink-0 mt-0.5" /> {submitError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="w-full h-12 rounded-2xl inline-flex items-center justify-center gap-2 text-[13px] font-bold bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_8px_24px_-8px_rgba(201,162,39,0.5)] active:scale-[0.98] transition disabled:opacity-60"
                >
                  {submitting
                    ? <><Loader2 size={15} className="animate-spin" /> Submitting…</>
                    : <><Gift size={15} strokeWidth={2.4} /> Confirm &amp; submit</>}
                </button>

                <p className="inline-flex items-center justify-center gap-1 text-[10px] text-[var(--c-text-muted)] mt-2.5 w-full pb-1">
                  <ShieldCheck size={9} className="text-brand-accent" />
                  Secured · Paid to wallet after verification
                </p>
        </div>
      </BottomSheet>

      {/* Trade detail sheet */}
      <TradeDetailSheet
        trade={selectedTrade}
        brands={brands}
        open={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
      />

    </div>
  )
}
