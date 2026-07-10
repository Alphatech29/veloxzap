import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Gift, Check, ShieldCheck, X, Loader2,
  Receipt, Clock, Plus, Trash2, AlertCircle,
  Hash, ImageIcon, Upload, TrendingUp, ChevronDown, Search, Lock, Tag, ChevronRight,
} from 'lucide-react'
import useGiftCards, { DENOMINATIONS, countryLabel, countryCode } from '../../hooks/useGiftCards'
import { useAlert } from '../../components/ui/Alert'
import TradeDetailModal from '../../components/internalUI/TradeDetailModal'
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

function SummaryRow({ label, value, bold, accent }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[10.5px] text-[var(--c-text-muted)]">{label}</span>
      <span className={[
        'whitespace-nowrap text-right text-[11.5px]',
        bold   ? 'font-bold text-[var(--c-text)]' : '',
        accent ? 'font-bold text-brand-accent'     : '',
        !bold && !accent ? 'font-semibold text-[var(--c-text)]' : '',
      ].join(' ')}>
        {value}
      </span>
    </div>
  )
}

function FormDivider() {
  return <div className="border-t border-[var(--c-border)]" />
}

function FieldLabel({ children, aside }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">{children}</p>
      {aside && <span className="text-[10px] font-bold text-brand-accent">{aside}</span>}
    </div>
  )
}

const ALLOWED_IMG = /\.(png|jpe?g)$/i

function ImageSlot({ index, file, onFiles, onRemove }) {
  const inputRef = useRef(null)
  const [drag, setDrag]       = useState(false)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!file) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function handleDrop(e) {
    e.preventDefault(); setDrag(false)
    const files = Array.from(e.dataTransfer.files).filter(f => ALLOWED_IMG.test(f.name))
    if (files.length) onFiles(files)
  }

  return (
    <div className="relative">
      <input ref={inputRef} type="file" accept="image/png,image/jpeg" multiple className="hidden"
        onChange={e => {
          const files = Array.from(e.target.files).filter(f => ALLOWED_IMG.test(f.name))
          if (files.length) onFiles(files)
          e.target.value = ''
        }} />
      {file ? (
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-[var(--c-accent-border)]">
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute top-1.5 left-1.5 inline-flex items-center justify-center w-5 h-5 rounded-md bg-brand-accent text-brand-primary text-[9px] font-black">{index + 1}</span>
          <button type="button" onClick={onRemove} className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/60 text-white hover:bg-black/80 transition">
            <X size={11} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          className={[
            'w-full aspect-[4/3] rounded-xl flex flex-col items-center justify-center gap-1.5 transition border',
            drag
              ? 'bg-[var(--c-accent-soft)] border-[var(--c-accent-border-strong)] border-dashed'
              : 'bg-[var(--c-surface-soft)] border-dashed border-[var(--c-border)] hover:border-[var(--c-accent-border)] hover:bg-[var(--c-accent-soft)]',
          ].join(' ')}
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent">
            <Upload size={13} />
          </span>
          <span className="text-[9.5px] font-semibold text-[var(--c-text-muted)] leading-tight px-1">Card {index + 1}</span>
        </button>
      )}
    </div>
  )
}

/* ── Brand picker modal ─────────────────────────────────────── */
function BrandModal({ brands, brandsLoading, selectedId, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const tradeable   = brands.filter(b => b.sub_categories.some(s => s.status === 1))
  const unavailable = brands.filter(b => !b.sub_categories.some(s => s.status === 1))

  const filter = list => query.trim()
    ? list.filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
    : list

  const filteredTradeable   = filter(tradeable)
  const filteredUnavailable = filter(unavailable)
  const isEmpty = filteredTradeable.length === 0 && filteredUnavailable.length === 0

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[6px]"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-[660px] max-h-[82vh] flex flex-col rounded-[20px] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(201,162,39,0.15)]"
          style={{ background: 'var(--c-surface)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="relative overflow-hidden shrink-0">
            {/* gradient wash */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,162,39,0.12)] via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-accent/[0.07] blur-3xl pointer-events-none" />

            <div className="relative flex items-start justify-between gap-4 px-6 py-5">
              <div>
                <p className="inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[1.3px] font-bold text-brand-accent m-0">
                  <Sparkles size={9} /> Gift cards
                </p>
                <h2 className="text-[18px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
                  Select card brand
                </h2>
                <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">
                  {tradeable.length} brands · instant payout
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="relative mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-border-strong)] active:scale-90 transition shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            {/* Search bar */}
            <div className="px-6 pb-4">
              <div className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.12)]"
                style={{
                  background: 'var(--c-surface-soft)',
                  borderColor: 'var(--c-border)',
                }}
              >
                <Search size={14} className="text-[var(--c-text-muted)] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search gift card brands…"
                  className="flex-1 bg-transparent border-0 outline-none text-[13px] font-medium text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                  style={{ boxShadow: 'none' }}
                />
                <AnimatePresence>
                  {query && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.12 }}
                      type="button"
                      onClick={() => setQuery('')}
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--c-border)] text-[var(--c-text-muted)] hover:bg-[var(--c-accent-soft)] hover:text-brand-accent transition"
                    >
                      <X size={10} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-[var(--c-border)] to-transparent" />
          </div>

          {/* ── Brand grid ── */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
            {brandsLoading ? (
              <div>
                <div className="h-3 w-24 rounded-full bg-[var(--c-surface-soft)] animate-pulse mb-4" />
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2.5 py-4 px-2 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-soft)] animate-pulse">
                      <div className="w-12 h-12 rounded-xl bg-[var(--c-border)]" />
                      <div className="h-2.5 w-12 rounded-full bg-[var(--c-border)]" />
                    </div>
                  ))}
                </div>
              </div>
            ) : isEmpty ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)]">
                  <Search size={20} />
                </span>
                <p className="text-[13px] text-[var(--c-text-muted)] m-0">No brands match <strong>"{query}"</strong></p>
              </div>
            ) : (
              <>
                {/* Available brands */}
                {filteredTradeable.length > 0 && (
                  <div>
                    <p className="text-[9px] uppercase tracking-[1.4px] font-bold text-[var(--c-text-faint)] mb-3 m-0">
                      Available · {filteredTradeable.length} brands
                    </p>
                    <div className="grid grid-cols-5 gap-2.5">
                      {filteredTradeable.map(b => {
                        const isSelected = selectedId === b.id
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => onSelect(b.id)}
                            className={[
                              'group relative overflow-hidden flex flex-col items-center gap-2 py-4 px-2 rounded-2xl transition-all duration-150',
                              isSelected
                                ? 'border-2 shadow-[0_4px_20px_rgba(201,162,39,0.25)]'
                                : 'border hover:border-[var(--c-accent-border)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] active:scale-[0.97] active:translate-y-0',
                            ].join(' ')}
                            style={isSelected
                              ? { background: 'rgba(201,162,39,0.08)', borderColor: 'var(--c-accent-border-strong)' }
                              : { background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)' }
                            }
                          >
                            {/* Glow for selected */}
                            {isSelected && (
                              <span aria-hidden className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-12 rounded-full bg-brand-accent/[0.18] blur-xl pointer-events-none" />
                            )}

                            {/* Logo */}
                            <span className={[
                              'relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white overflow-hidden p-2 transition',
                              isSelected
                                ? 'shadow-[0_4px_16px_rgba(201,162,39,0.3),0_0_0_2px_rgba(201,162,39,0.25)]'
                                : 'shadow-[0_2px_8px_rgba(0,0,0,0.1)] group-hover:shadow-[0_4px_14px_rgba(0,0,0,0.15)]',
                            ].join(' ')}>
                              <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
                            </span>

                            {/* Name */}
                            <span className={`text-[10px] font-bold text-center leading-tight line-clamp-2 w-full transition ${isSelected ? 'text-brand-accent' : 'text-[var(--c-text)] group-hover:text-[var(--c-text)]'}`}>
                              {b.name}
                            </span>

                            {/* Selected checkmark */}
                            {isSelected && (
                              <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-accent text-brand-primary shadow-[0_2px_6px_rgba(201,162,39,0.4)]">
                                <Check size={8} strokeWidth={3} />
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Coming soon */}
                {filteredUnavailable.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-[9px] uppercase tracking-[1.4px] font-bold text-[var(--c-text-faint)] m-0">
                        Coming soon · {filteredUnavailable.length} brands
                      </p>
                      <Lock size={9} className="text-[var(--c-text-faint)]" />
                    </div>
                    <div className="grid grid-cols-5 gap-2.5">
                      {filteredUnavailable.map(b => (
                        <div
                          key={b.id}
                          className="relative flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border opacity-40 cursor-not-allowed select-none"
                          style={{ background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)' }}
                        >
                          <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white overflow-hidden p-2 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                            <img src={b.logo} alt={b.name} className="w-full h-full object-contain grayscale" />
                          </span>
                          <span className="text-[10px] font-bold text-[var(--c-text)] text-center leading-tight line-clamp-2 w-full">
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

          {/* ── Footer ── */}
          <div className="shrink-0 px-6 py-3 border-t border-[var(--c-border)] bg-[var(--c-surface-soft)] flex items-center justify-center gap-1.5">
            <ShieldCheck size={10} className="text-brand-accent" />
            <span className="text-[10px] text-[var(--c-text-muted)]">Best rates guaranteed · Verified in minutes</span>
          </div>
        </div>
      </motion.div>
    </>
  )
}

/* ── Rates modal ────────────────────────────────────────────── */
function RatesModal({ brands, brandsLoading, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const filtered = brands.filter(b =>
    b.name.toLowerCase().includes(query.trim().toLowerCase())
  )

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
          className="pointer-events-auto w-full max-w-[680px] max-h-[82vh] flex flex-col rounded-[20px] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(201,162,39,0.15)]"
          style={{ background: 'var(--c-surface)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,162,39,0.12)] via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-accent/[0.07] blur-3xl pointer-events-none" />
            <div className="relative flex items-start justify-between gap-4 px-6 py-5">
              <div>
                <p className="inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[1.3px] font-bold text-brand-accent m-0">
                  <Tag size={9} /> Gift card rates
                </p>
                <h2 className="text-[18px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">Card rate list</h2>
                <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">
                  Current NGN payout rates per card denomination
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-border-strong)] active:scale-90 transition shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 pb-4">
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
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--c-border)] text-[var(--c-text-muted)] hover:bg-[var(--c-accent-soft)] hover:text-brand-accent transition"
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
                    <div className="h-3 w-32 rounded-full bg-[var(--c-border)]" />
                    <div className="h-2.5 w-16 rounded-full bg-[var(--c-border)]" />
                  </div>
                  <div className="h-4 w-20 rounded-full bg-[var(--c-border)]" />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
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
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] hover:border-[var(--c-accent-border)] hover:bg-[var(--c-accent-soft)] transition-colors group"
                    >
                      {/* Logo */}
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[var(--c-border)] p-1.5 shadow-sm shrink-0">
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                      </span>

                      {/* Brand · Country */}
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

                      {/* Rate */}
                      <div className="text-right shrink-0">
                        <p className="text-[14px] font-black tabular-nums text-brand-accent m-0 group-hover:text-brand-accent">
                          ₦{Number(sc.rate).toLocaleString('en-NG')}
                        </p>
                        <p className="text-[9.5px] text-[var(--c-text-muted)] m-0">per {sc.currency}1</p>
                      </div>
                    </div>
                  ))
              )
            )}
          </div>

          <div className="shrink-0 px-6 py-3 border-t border-[var(--c-border)] bg-[var(--c-surface-soft)] flex items-center justify-center gap-1.5">
            <ShieldCheck size={10} className="text-brand-accent" />
            <span className="text-[10px] text-[var(--c-text-muted)]">Rates update in real time · subject to change</span>
          </div>
        </div>
      </motion.div>
    </>
  )
}

/* ── Main component ─────────────────────────────────────────── */
export default function DesktopTradeCards() {
  const { alert } = useAlert()
  const {
    brands, brandsLoading,
    recentTrades, recentLoading,
    submitting, submitError,
    submit, reset,
  } = useGiftCards()

  const [brand, setBrand]            = useState(null)
  const [country, setCountry]        = useState(null)
  const [denomination, setDenom]     = useState(null)
  const [customDenom, setCustomDenom] = useState('')
  const [cardType, setCardType]      = useState(null)
  const [codes, setCodes]            = useState([''])
  const [images, setImages]          = useState([null])
  const [brandModalOpen, setBrandModalOpen] = useState(false)
  const [ratesModalOpen, setRatesModalOpen] = useState(false)
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

  function resetFrom(level) {
    if (level <= 1) { setCountry(null); setDenom(null); setCustomDenom(''); setCardType(null); setCodes(['']); setImages([null]) }
    if (level <= 2) { setDenom(null); setCustomDenom(''); setCardType(null); setCodes(['']); setImages([null]) }
    if (level <= 3) { setCardType(null); setCodes(['']); setImages([null]) }
    if (level <= 4) { setCodes(['']); setImages([null]) }
  }

  function addCode()        { if (codes.length < 5) setCodes(p => [...p, '']) }
  function removeCode(i)    { setCodes(p => p.filter((_, idx) => idx !== i)) }
  function updateCode(i, v) { setCodes(p => p.map((c, idx) => idx === i ? v : c)) }
  function addImage()       { if (images.length < 5) setImages(p => [...p, null]) }
  function setImage(i, f)   { setImages(p => p.map((img, idx) => idx === i ? f : img)) }
  function removeImage(i)   { setImages(p => p.filter((_, idx) => idx !== i)) }

  async function handleSubmit() {
    if (!ready || submitting) return
    reset()
    const payload = { brandId: brand, subCategoryId: activeSubCat.id, denomination, cardType }
    if (cardType === 'ecode') payload.codes = validCodes
    else payload.images = validImages
    const result = await submit(payload)
    if (result.success) {
      alert({ type: 'success', title: 'Trade submitted!', message: result.message || "We'll verify and credit your wallet shortly." })
      setBrand(null); setCountry(null); setDenom(null); setCustomDenom(''); setCardType(null); setCodes(['']); setImages([null])
    } else {
      alert({ type: 'error', title: 'Submission failed', message: result.message })
    }
  }

  const CARD_TYPES = [
    { id: 'ecode',    label: 'E-code',        desc: 'Digital redemption code', Icon: Hash },
    { id: 'physical', label: 'Physical card',  desc: 'Upload a photo',          Icon: ImageIcon },
  ]

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      {/* Header */}
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
            <Sparkles size={10} /> Gift cards
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">Trade gift cards</h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Sell your gift cards instantly · Get paid in Naira
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRatesModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--c-surface)] border border-[var(--c-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)] hover:border-[var(--c-accent-border)] hover:text-brand-accent transition active:scale-95"
          >
            <Tag size={10} /> View rates
          </button>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
            <ShieldCheck size={10} /> Instant payout
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">

        {/* ── Left: unified form ── */}
        <div className="flex flex-col gap-3">

          {/* ── Card details card ── */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden divide-y divide-[var(--c-border)]">

            {/* Brand trigger */}
            <div className="p-4">
              <FieldLabel>Card brand</FieldLabel>
              {brandsLoading ? (
                <div className="h-[62px] rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] animate-pulse" />
              ) : (
                <button
                  type="button"
                  onClick={() => setBrandModalOpen(true)}
                  className={[
                    'group relative w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl border transition-all duration-150 text-left overflow-hidden',
                    selectedBrandData
                      ? 'bg-gradient-to-r from-[rgba(201,162,39,0.07)] to-transparent border-[var(--c-accent-border)] hover:border-[var(--c-accent-border-strong)] hover:shadow-[0_4px_20px_rgba(201,162,39,0.12)]'
                      : 'bg-[var(--c-surface-soft)] border-[var(--c-border)] hover:border-[var(--c-accent-border)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]',
                  ].join(' ')}
                >
                  {/* Ambient glow when selected */}
                  {selectedBrandData && (
                    <span aria-hidden className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-brand-accent/[0.1] blur-2xl pointer-events-none" />
                  )}

                  {selectedBrandData ? (
                    <>
                      <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-[rgba(201,162,39,0.2)] overflow-hidden p-1.5 shadow-[0_3px_10px_rgba(201,162,39,0.2)] shrink-0">
                        <img src={selectedBrandData.logo} alt={selectedBrandData.name} className="w-full h-full object-contain" />
                      </span>
                      <div className="relative flex-1 min-w-0">
                        <p className="text-[9px] uppercase tracking-[1.1px] font-bold text-brand-accent m-0">Selected brand</p>
                        <p className="text-[14px] font-bold text-[var(--c-text)] m-0 mt-0.5 truncate">{selectedBrandData.name}</p>
                      </div>
                      <span className="relative text-[10px] font-bold text-brand-accent bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] px-2 py-0.5 rounded-full shrink-0">
                        Change
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] shrink-0">
                        <Gift size={15} className="text-brand-accent" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">Step 1</p>
                        <p className="text-[14px] font-semibold text-[var(--c-text-faint)] m-0 mt-0.5">Choose a card brand…</p>
                      </div>
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        className="shrink-0"
                      >
                        <ChevronDown size={16} className="text-[var(--c-text-muted)] group-hover:text-brand-accent transition" />
                      </motion.span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Country */}
            <AnimatePresence initial={false}>
              {brand && (
                <motion.div
                  key="country"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-4">
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
                                'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition active:scale-[0.96]',
                                active
                                  ? 'bg-brand-accent text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_2px_8px_rgba(201,162,39,0.28)]'
                                  : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)] hover:border-[var(--c-accent-border)]',
                              ].join(' ')}
                            >

                              {c.label}
                              <span className={`text-[10px] ${active ? 'text-brand-primary/80' : 'text-[var(--c-text-muted)]'}`}>{c.symbol}</span>
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
                <motion.div
                  key="cardtype"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-4">
                    <FieldLabel>Card type</FieldLabel>
                    <div className={`grid gap-2 ${availableCardTypes.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {CARD_TYPES.filter(t => availableCardTypes.includes(t.id)).map(({ id, label, desc, Icon }) => {
                        const active   = cardType === id
                        const typeSub  = activeSubCats.find(sc => sc.country === country && sc.card_type === id)
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => { setCardType(id); resetFrom(4) }}
                            className={[
                              'relative overflow-hidden flex items-center gap-3 px-3 py-3 rounded-xl text-left transition active:scale-[0.98]',
                              active
                                ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border-2 border-[var(--c-accent-border-strong)]'
                                : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                            ].join(' ')}
                          >
                            {active && <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-14 h-14 rounded-full bg-brand-accent/[0.15] blur-xl" />}
                            <span className={[
                              'relative inline-flex items-center justify-center w-8 h-8 rounded-lg border shrink-0',
                              active
                                ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)]'
                                : 'bg-[var(--c-surface)] border-[var(--c-border-soft)] text-[var(--c-text-muted)]',
                            ].join(' ')}>
                              <Icon size={14} strokeWidth={2.2} />
                            </span>
                            <div className="relative flex-1 leading-tight min-w-0">
                              <p className="text-[12px] font-bold text-[var(--c-text)] m-0">{label}</p>
                              <p className="text-[9.5px] text-[var(--c-text-muted)] m-0">{desc}</p>
                              {typeSub && (
                                <p className="inline-flex items-center gap-1 text-[9.5px] font-bold text-brand-accent mt-1 m-0">
                                  <TrendingUp size={9} /> {formatNGN(typeSub.rate)} / {typeSub.currency}1
                                </p>
                              )}
                            </div>
                            {active && (
                              <span className="relative inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-accent text-brand-primary shrink-0">
                                <Check size={8} strokeWidth={3} />
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
                <motion.div
                  key="denom"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-4">
                    <FieldLabel aside={denomination && ngnPayout ? `${countryInfo?.symbol}${denomination} = ${formatNGN(ngnPayout)}` : undefined}>
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
                              'relative overflow-hidden flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-lg transition active:scale-[0.96]',
                              active
                                ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.28)]'
                                : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)] hover:border-[var(--c-accent-border)]',
                            ].join(' ')}
                          >
                            {active && <span aria-hidden className="pointer-events-none absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/20 blur-xl" />}
                            <span className={`relative text-[8px] font-bold uppercase ${active ? 'text-brand-primary/70' : 'text-[var(--c-text-muted)]'}`}>
                              {countryInfo?.symbol || '$'}
                            </span>
                            <span className="relative text-[13px] font-black tabular-nums">{d}</span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-2.5 my-3">
                      <div className="flex-1 h-px bg-[var(--c-border)]" />
                      <span className="text-[9px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-faint)]">or</span>
                      <div className="flex-1 h-px bg-[var(--c-border)]" />
                    </div>

                    {/* Custom amount input */}
                    <div className={[
                      'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition',
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
                          'flex-1 bg-transparent border-0 outline-none focus:outline-none appearance-none text-[13px] font-semibold tabular-nums placeholder:font-normal placeholder:tracking-normal',
                          customDenom ? 'text-brand-accent placeholder:text-brand-accent/40' : 'text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]',
                        ].join(' ')}
                        style={{ boxShadow: 'none' }}
                      />
                      {customDenom && (
                        <button
                          type="button"
                          onClick={() => { setCustomDenom(''); setDenom(null) }}
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-accent/20 text-brand-accent hover:bg-brand-accent/30 transition shrink-0"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </article>

          {/* ── Code / Image input card ── */}
          <AnimatePresence initial={false}>
            {brand && country && cardType && denomination && (
              <motion.article
                key="input-card"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4"
              >
                {cardType === 'ecode' ? (
                  <>
                    <FieldLabel aside={`${codes.length}/5`}>
                      Card e-code{codes.length > 1 ? 's' : ''}
                    </FieldLabel>
                    <div className="flex flex-col gap-2">
                      {codes.map((code, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex-1 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition overflow-hidden">
                            <div className="flex items-center gap-2 px-3 py-2.5">
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9px] font-black text-brand-accent shrink-0">
                                {i + 1}
                              </span>
                              <input
                                type="text"
                                value={code}
                                onChange={e => updateCode(i, e.target.value)}
                                placeholder="Enter card code"
                                className="flex-1 min-w-0 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none appearance-none text-[13px] font-mono font-semibold tracking-[0.5px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-sans placeholder:tracking-normal"
                                style={{ boxShadow: 'none' }}
                              />
                              {code && (
                                <button type="button" onClick={() => updateCode(i, '')} className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[var(--c-text-muted)] hover:text-[var(--c-text)] transition shrink-0">
                                  <X size={11} />
                                </button>
                              )}
                            </div>
                          </div>
                          {codes.length > 1 && (
                            <button type="button" onClick={() => removeCode(i)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] hover:text-[var(--c-danger,#f87171)] transition shrink-0">
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {codes.length < 5 && (
                      <button type="button" onClick={addCode} className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-brand-accent hover:opacity-80 transition">
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
                            files.slice(1, 5 - next.length + 1).forEach(f => next.push(f))
                            return next
                          })}
                          onRemove={() => images.length > 1 ? removeImage(i) : setImage(i, null)}
                        />
                      ))}
                    </div>
                    {images.length < 5 && (
                      <>
                        <input
                          id="bulk-img-add-desktop"
                          type="file"
                          accept="image/png,image/jpeg"
                          multiple
                          className="hidden"
                          onChange={e => {
                            if (!e.target.files.length) return
                            const files = Array.from(e.target.files).filter(f => ALLOWED_IMG.test(f.name))
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
                          onClick={() => document.getElementById('bulk-img-add-desktop').click()}
                          className="mt-2.5 inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-brand-accent hover:opacity-80 transition"
                        >
                          <Plus size={12} strokeWidth={2.5} /> Add more cards
                        </button>
                      </>
                    )}
                    <p className="mt-2 text-[10px] text-[var(--c-text-muted)] leading-snug">
                      Upload clear photos of each card face. You can select multiple at once or drag &amp; drop. PNG, JPG or JPEG only.
                    </p>
                  </>
                )}
              </motion.article>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: summary + recent ── */}
        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">

          {/* Summary */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-accent-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)]">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)]">
                <Receipt size={12} className="text-brand-accent" /> Trade summary
              </h3>
              {selectedBrandData && (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white border border-[var(--c-border)] overflow-hidden p-1">
                  <img src={selectedBrandData.logo} alt="" className="w-full h-full object-contain" />
                </span>
              )}
            </header>

            <div className="p-4 flex flex-col gap-2">
              <SummaryRow label="Brand"        value={selectedBrandData?.name || '—'} />
              <SummaryRow label="Country"      value={countryInfo?.label || '—'} />
              <SummaryRow label="Type"         value={cardType === 'ecode' ? 'E-code' : cardType === 'physical' ? 'Physical' : '—'} />
              <SummaryRow label="Denomination" value={denomination && countryInfo ? `${countryInfo.symbol}${denomination}` : '—'} bold />
              <SummaryRow label={cardType === 'physical' ? 'Images' : 'Codes'} value={`${itemCount} card${itemCount !== 1 ? 's' : ''}`} />
              <div className="border-t border-dashed border-[var(--c-border)] my-0.5" />
              <SummaryRow label="Rate" value={rate ? `${formatNGN(rate)} / ${countryInfo?.symbol}1` : '—'} />

              <div className="flex items-center justify-between mt-0.5 pt-2.5 border-t border-[var(--c-border)]">
                <p className="text-[10px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">You receive</p>
                <div className="text-right">
                  <p className={`text-[16px] font-black tabular-nums tracking-[-0.3px] m-0 ${totalPayout ? 'text-brand-accent' : 'text-[var(--c-text-muted)]'}`}>
                    {totalPayout ? formatNGN(totalPayout) : '₦—'}
                  </p>
                  {totalPayout && itemCount > 1 && ngnPayout && (
                    <p className="text-[9.5px] text-[var(--c-text-muted)] m-0">{itemCount} × {formatNGN(ngnPayout)}</p>
                  )}
                </div>
              </div>

              {submitError && (
                <p className="inline-flex items-start gap-1 text-[10.5px] text-[var(--c-danger)] bg-[var(--c-danger-soft)] rounded-lg px-2.5 py-2 mt-0.5">
                  <AlertCircle size={11} className="shrink-0 mt-0.5" /> {submitError}
                </p>
              )}

              <button
                type="button"
                disabled={!ready || submitting}
                onClick={handleSubmit}
                className={[
                  'relative overflow-hidden inline-flex items-center justify-center gap-2 w-full h-10 rounded-xl text-[12px] font-bold tracking-[0.2px] transition active:scale-[0.99] mt-1.5',
                  ready && !submitting
                    ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_6px_18px_-6px_rgba(201,162,39,0.5)] hover:-translate-y-px'
                    : 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)] cursor-not-allowed',
                ].join(' ')}
              >
                <AnimatePresence mode="wait">
                  {submitting ? (
                    <motion.span key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                        <Loader2 size={14} strokeWidth={2.6} />
                      </motion.span>
                      Submitting…
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-2">
                      <Gift size={14} strokeWidth={2.4} />
                      {!brand           ? 'Select a card brand'
                        : !country      ? 'Select country'
                        : !cardType     ? 'Select card type'
                        : !denomination ? 'Select denomination'
                        : cardType === 'ecode'    && validCodes.length === 0   ? 'Enter card code'
                        : cardType === 'physical' && validImages.length === 0  ? 'Upload card image'
                        : `Trade · ${totalPayout ? formatNGN(totalPayout) : '...'}`}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <p className="inline-flex items-center justify-center gap-1 text-[10px] text-[var(--c-text-muted)] mt-1">
                <ShieldCheck size={9} className="text-brand-accent" />
                Verified · Paid to wallet after verification
              </p>
            </div>
          </article>

          {/* Recent trades */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-[var(--c-border)]">
              <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)]">
                <Clock size={11} className="text-brand-accent" /> Recent trades
              </h3>
              {!recentLoading && recentTrades.length > 0 && (
                <a href="/user/trade-history"
                  className="text-[9.5px] font-bold text-brand-accent hover:underline transition">
                  View all {recentTrades.length}
                </a>
              )}
            </header>
            {recentLoading ? (
              <div className="px-4 py-3 flex items-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                  <Loader2 size={12} className="text-brand-accent" />
                </motion.span>
                <span className="text-[11px] text-[var(--c-text-muted)]">Loading…</span>
              </div>
            ) : recentTrades.length === 0 ? (
              <p className="px-4 py-3 text-[11px] text-[var(--c-text-faint)]">No recent trades yet.</p>
            ) : (
              <ul className="list-none m-0 p-0">
                {recentTrades.slice(0, 5).map((t, i) => {
                  const b = brands.find(x => x.id === t.brandId)
                  const cLabel = countryLabel(t.countryId)
                  return (
                    <li key={t.id ?? i} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                      <button type="button" onClick={() => setSelectedTrade(t)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-[var(--c-surface-soft)] transition-colors group">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-[var(--c-border)] overflow-hidden p-1 shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                          {b?.logo ? <img src={b.logo} alt={b.name} className="w-full h-full object-contain" /> : <Gift size={13} className="text-[var(--c-text-muted)]" />}
                        </span>
                        <div className="flex-1 min-w-0 leading-tight">
                          <p className="text-[11.5px] font-semibold text-[var(--c-text)] m-0 truncate">
                            {t.brandName} <span className="text-[var(--c-text-muted)] font-normal">· {cLabel}</span>
                          </p>
                          <div className="flex items-center  mt-0.5">
                            <span className="text-[var(--c-border-soft)] select-none">·</span>
                            <span className="text-[9px] uppercase tracking-[0.4px] font-semibold text-[var(--c-text-faint)]">
                              {t.cardType === 'physical' ? 'Physical' : 'E-code'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                          <span className="text-[12px] font-black text-brand-accent tabular-nums"> {t.currency}{t.denomination}</span>
                          <StatusBadge status={t.status} />
                        </div>
                        <ChevronRight size={13} className="text-[var(--c-text-faint)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </article>
        </div>
      </section>

      {/* Brand picker modal */}
      <AnimatePresence>
        {brandModalOpen && (
          <BrandModal
            brands={brands}
            brandsLoading={brandsLoading}
            selectedId={brand}
            onSelect={id => { setBrand(id); resetFrom(1); setBrandModalOpen(false) }}
            onClose={() => setBrandModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Rates modal */}
      <AnimatePresence>
        {ratesModalOpen && (
          <RatesModal
            brands={brands}
            brandsLoading={brandsLoading}
            onClose={() => setRatesModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Trade detail modal */}
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
