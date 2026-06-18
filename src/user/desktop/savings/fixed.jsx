import { useMemo, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAlert } from '../../../components/ui/Alert'
import { useSavingsOverview, useSavingsWithdrawals } from '../../../hooks/useSavings'
import FixedSavingsHistoryModal from '../../../components/internalUI/FixedSavingsHistoryModal'
import { fmtDate } from '../../../utils/format'
import {
  Lock, Plus, Check, X, Loader2, ShieldCheck, TrendingUp,
  ArrowUpRight, Clock, Calendar, Percent, Coins, ChevronLeft, ChevronDown,
  AlertTriangle, Zap, History,
} from 'lucide-react'

function fmt(n) { return Number(n || 0).toLocaleString('en-NG') }
function fmtN(n) { return '₦' + fmt(Math.round(n || 0)) }

const LOCK = '#C9A227'
const LOCK_BG = 'rgba(201,162,39,0.1)'
const LOCK_BORDER = 'rgba(201,162,39,0.28)'
const MATURE = '#34d399'

/* ── Circle ring ─────────────────────────────── */

function CircleRing({ pct = 0, isMature = false, size = 96, stroke = 9 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const color = MATURE
  const offset = circ - (Math.min(100, Math.max(0, pct)) / 100) * circ

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--c-border-soft)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isMature
          ? <Check size={20} strokeWidth={3} style={{ color: MATURE }} />
          : <>
              <span className="text-[14px] font-black leading-none tabular-nums" style={{ color }}>{pct}%</span>
              <span className="text-[8px] font-bold text-[var(--c-text-faint)] mt-0.5">elapsed</span>
            </>
        }
      </div>
    </div>
  )
}

/* ── Mapper ────────────────────────────────── */

function mapLock(a) {
  const principal = Number(a.principal || 0)
  const interestEarned = Number(a.accrued_interest || 0)
  const apy = Number(a.apy_at_creation ?? 0)
  // For completed plans: new records store net_payout in principal; old records
  // (principal = 0 before the fix) fall back to approved_net_payout from the
  // withdrawals table.
  const paidOut = principal > 0 ? principal : Number(a.approved_net_payout || 0)

  let progress = 0, daysLeft = null, daysTotal = null
  let isMature = false, maturityDate = null, startDate = null, projectedInterest = 0

  if (a.start_date && a.maturity_date) {
    const start = new Date(a.start_date).getTime()
    const end = new Date(a.maturity_date).getTime()
    const now = Date.now()
    daysTotal = a.lock_duration_days != null ? Number(a.lock_duration_days) : Math.round((end - start) / 86400000)
    daysLeft = Math.max(0, Math.ceil((end - now) / 86400000))
    progress = end > start ? Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100))) : 0
    isMature = (daysLeft === 0 || a.status === 'matured') && a.status !== 'completed'
    maturityDate = fmtDate(a.maturity_date)
    startDate = fmtDate(a.start_date)
    projectedInterest = principal * (apy / 100) * (daysTotal / 365)
  }

  return {
    id: a.id,
    name: a.name || 'Fixed savings',
    principal, interestEarned, apy, paidOut,
    progress, daysLeft, daysTotal, isMature,
    maturityDate, startDate, projectedInterest,
    status: a.status,
  }
}

/* ── Lock duration select ───────────────────── */

function LockDurationSelect({ tiers, activeTier, onSelect }) {
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  function toggle() {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const panelHeight = Math.min(260, tiers.length * 56) + 6
      const spaceBelow = window.innerHeight - rect.bottom
      setDropUp(spaceBelow < panelHeight && rect.top > spaceBelow)
    }
    setOpen(v => !v)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full h-[46px] pl-2 pr-3 rounded-xl text-[12.5px] font-bold text-[var(--c-text)] outline-none border transition flex items-center justify-between gap-2 active:scale-[0.99]"
        style={{ background: 'var(--c-surface-soft)', borderColor: open ? 'var(--c-accent-border-strong)' : 'var(--c-border)' }}
      >
        <span className="inline-flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ background: LOCK_BG, color: LOCK }}>
            <Clock size={14} strokeWidth={2.2} />
          </span>
          <span className="truncate">
            {activeTier ? `${activeTier.minDays}–${activeTier.maxDays} days` : 'Select duration'}
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5 shrink-0">
          {activeTier && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tabular-nums" style={{ background: LOCK_BG, color: LOCK, border: `1px solid ${LOCK_BORDER}` }}>
              <Percent size={9} /> {activeTier.apy}%
            </span>
          )}
          <ChevronDown
            size={15} strokeWidth={2.4}
            className="transition-transform duration-200"
            style={{ color: LOCK, transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            role="listbox"
            className={`absolute left-0 right-0 z-30 rounded-xl border overflow-hidden max-h-[260px] overflow-y-auto ${dropUp ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]'}`}
            style={{ background: 'var(--c-surface)', borderColor: LOCK_BORDER, boxShadow: '0 16px 40px -12px rgba(2,7,23,0.45)' }}
          >
            {tiers.map(tier => {
              const active = activeTier?.id === tier.id
              return (
                <button
                  key={tier.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => { onSelect(tier); setOpen(false) }}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left transition"
                  style={active ? { background: LOCK_BG } : undefined}
                >
                  <span className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold truncate" style={{ color: active ? LOCK : 'var(--c-text)' }}>{tier.label}</span>

                  </span>
                  <span className="inline-flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tabular-nums" style={{ background: active ? 'rgba(201,162,39,0.18)' : 'var(--c-accent-soft)', color: active ? LOCK : 'var(--c-accent)', border: `1px solid ${active ? LOCK_BORDER : 'var(--c-accent-border)'}` }}>
                      <Percent size={9} /> {tier.apy}%
                    </span>
                    {active && <Check size={14} strokeWidth={2.6} style={{ color: LOCK }} />}
                  </span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Lock days select ────────────────────────── */

function LockDaysSelect({ min, max, value, onChange }) {
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const ref = useRef(null)
  const days = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  useEffect(() => {
    if (!open) return
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  function toggle() {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const panelHeight = Math.min(240, days.length * 40) + 6
      const spaceBelow = window.innerHeight - rect.bottom
      setDropUp(spaceBelow < panelHeight && rect.top > spaceBelow)
    }
    setOpen(v => !v)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full h-[46px] pl-2 pr-3 rounded-xl text-[12.5px] font-bold text-[var(--c-text)] outline-none border transition flex items-center justify-between gap-2 active:scale-[0.99]"
        style={{ background: 'var(--c-surface-soft)', borderColor: open ? 'var(--c-accent-border-strong)' : 'var(--c-border)' }}
      >
        <span className="inline-flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ background: LOCK_BG, color: LOCK }}>
            <Calendar size={14} strokeWidth={2.2} />
          </span>
          <span className="truncate tabular-nums" style={value == null ? { color: 'var(--c-text-faint)', fontWeight: 600 } : undefined}>
            {value != null ? `${value} days` : 'Select days'}
          </span>
        </span>
        <ChevronDown
          size={15} strokeWidth={2.4}
          className="transition-transform duration-200 shrink-0"
          style={{ color: LOCK, transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            role="listbox"
            className={`absolute left-0 right-0 z-30 rounded-xl border overflow-hidden max-h-[240px] overflow-y-auto ${dropUp ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]'}`}
            style={{ background: 'var(--c-surface)', borderColor: LOCK_BORDER, boxShadow: '0 16px 40px -12px rgba(2,7,23,0.45)' }}
          >
            {days.map(d => {
              const active = d === value
              return (
                <button
                  key={d}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => { onChange(d); setOpen(false) }}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-[12.5px] font-bold tabular-nums transition"
                  style={active ? { background: LOCK_BG, color: LOCK } : { color: 'var(--c-text)' }}
                >
                  {d} days
                  {active && <Check size={14} strokeWidth={2.6} style={{ color: LOCK }} />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Create lock modal ─────────────────────── */

function CreateLockModal({ product, onClose, onSubmit, submitting, success }) {
  const [name, setName]         = useState('')
  const [amount, setAmount]     = useState('')
  const [lockDays, setLockDays] = useState(null)
  const [selTier, setSelTier]   = useState(null)
  const [now]                   = useState(() => Date.now())

  const tiers = product?.tiers || []
  const activeTier = selTier || tiers[0] || null
  const n = s => Number(s.replace(/[^0-9.]/g, '')) || 0
  const numAmount = n(amount)
  const numDays = lockDays || 0
  const minDeposit = product?.minDeposit || 1000
  const inRange = activeTier ? numDays >= activeTier.minDays && numDays <= activeTier.maxDays : false
  const valid = numAmount >= minDeposit && name.trim().length > 1 && inRange
  const apy = activeTier?.apy || 0
  const projectedInterest = valid ? numAmount * (apy / 100) * (numDays / 365) : 0
  const maturityDate = numDays > 0
    ? fmtDate(new Date(now + numDays * 86400000))
    : null

  function handleTierSelect(tier) {
    setSelTier(tier)
    if (lockDays != null && (lockDays < tier.minDays || lockDays > tier.maxDays)) setLockDays(null)
  }

  function submit() {
    if (!valid || submitting) return
    onSubmit({ name: name.trim(), amount: numAmount, lockDays: numDays, apy, tier: activeTier?.label })
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[6px]"
        onClick={() => !submitting && onClose()}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="relative w-full max-w-[460px] max-h-[88vh] overflow-y-auto rounded-[24px] border border-[var(--c-border)] pointer-events-auto"
          style={{ background: 'var(--c-surface)', boxShadow: '0 32px 80px -16px rgba(2,7,23,0.5)' }}
        >
          <div
            className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-5 border-b border-[var(--c-border-soft)]"
            style={{ background: 'var(--c-surface)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl shrink-0 border" style={{ background: LOCK_BG, borderColor: LOCK_BORDER, color: LOCK }}>
                <Lock size={18} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="text-[9.5px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">New fixed</p>
                <h2 className="text-[16px] font-black text-[var(--c-text)] m-0 truncate tracking-[-0.3px]">{product?.name || 'Fixed Savings'}</h2>
              </div>
            </div>
            {!submitting && (
              <button type="button" onClick={onClose} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0">
                <X size={14} />
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center px-6 py-10">
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                  style={{ background: 'var(--c-success-bg)', color: 'var(--c-success)' }}
                >
                  <Check size={28} strokeWidth={2.6} />
                </motion.span>
                <h3 className="text-[17px] font-black text-[var(--c-text)] m-0 tracking-[-0.3px]">Plan fixed</h3>
                <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 max-w-[280px] leading-relaxed">
                  {fmtN(success.principal)} fixed in <span className="font-semibold text-[var(--c-text)]">{success.name}</span> for {success.lockDays} days
                </p>
                <div className="w-full mt-6 rounded-2xl border border-[var(--c-border-soft)] overflow-hidden" style={{ background: 'var(--c-surface-soft)' }}>
                  {[
                    { label: 'Plan name',      value: success.name },
                    { label: 'Amount fixed',   value: fmtN(success.principal) },
                    { label: 'Duration',       value: `${success.lockDays} days` },
                    { label: 'Rate',           value: `${success.apy}% p.a.` },
                    { label: 'Matures on',     value: success.maturityDate },
                    { label: 'Proj. interest', value: fmtN(success.projectedInterest), gold: true },
                  ].map((r, i) => (
                    <div key={r.label} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}`}>
                      <span className="text-[11px] text-[var(--c-text-muted)] font-medium">{r.label}</span>
                      <span className="text-[12.5px] font-bold tabular-nums" style={{ color: r.gold ? LOCK : 'var(--c-text)' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button" onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 w-full h-[46px] rounded-xl font-bold text-[13px] mt-6 transition hover:-translate-y-px active:scale-[0.99]"
                  style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 py-5 flex flex-col gap-5">
                <p className="text-[12px] text-[var(--c-text-muted)] m-0 leading-relaxed">
                  {product?.desc || 'Fix your money for a fixed term and earn a guaranteed higher rate.'}
                </p>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Amount</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--c-text-muted)]">₦</span>
                    <input
                      type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-[46px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                      style={{ background: 'var(--c-surface-soft)' }}
                    />
                  </div>
                  <span className="text-[10px] text-[var(--c-text-faint)]">Minimum {fmtN(minDeposit)}</span>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Plan name</span>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="e.g. 6-Month Reserve, Rainy Day Fund"
                    className="h-[46px] px-4 rounded-xl text-[13px] font-semibold text-[var(--c-text)] outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                    style={{ background: 'var(--c-surface-soft)' }}
                  />
                </label>

                {tiers.length > 0 && (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Select fixed duration</span>
                    <LockDurationSelect tiers={tiers} activeTier={activeTier} onSelect={handleTierSelect} />
                  </label>
                )}

                {activeTier && (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">
                      Fixed days ({activeTier.minDays}–{activeTier.maxDays})
                    </span>
                    <LockDaysSelect min={activeTier.minDays} max={activeTier.maxDays} value={lockDays} onChange={setLockDays} />
                  </label>
                )}

                {projectedInterest > 0 && maturityDate && (
                  <div className="flex flex-col gap-3 p-4 rounded-2xl border" style={{ background: LOCK_BG, borderColor: LOCK_BORDER }}>
                    <p className="text-[10px] uppercase tracking-[1px] font-bold m-0" style={{ color: LOCK }}>Projected at maturity</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Interest', value: fmtN(projectedInterest) },
                        { label: 'Total',    value: fmtN(numAmount + projectedInterest) },
                        { label: 'Matures',  value: maturityDate },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex flex-col gap-0.5">
                          <span className="text-[9px] uppercase tracking-[0.8px] font-bold text-[var(--c-text-faint)]">{label}</span>
                          <span className="text-[11.5px] font-black text-[var(--c-text)] tabular-nums leading-tight">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button" onClick={submit} disabled={!valid || submitting}
                  className="inline-flex items-center justify-center gap-2 w-full h-[48px] rounded-xl font-bold text-[13.5px] mt-1 transition hover:-translate-y-px active:scale-[0.99] disabled:opacity-50 disabled:hover:translate-y-0"
                  style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
                >
                  {submitting
                    ? <><Loader2 size={15} className="animate-spin" /> Fixing…</>
                    : <><Lock size={15} strokeWidth={2.2} /> Fix & earn {apy > 0 ? `${apy}%` : ''}</>
                  }
                </button>
                <p className="inline-flex items-center gap-1.5 text-[10px] text-[var(--c-text-faint)] justify-center m-0">
                  <ShieldCheck size={11} className="text-brand-accent" /> Amount debited from your wallet balance
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}

/* ── Lock card ─────────────────────────────── */

function LockCard({ lock, onWithdraw, withdrawing, penalty, hasPendingWithdrawal, onHistory }) {
  const [confirming, setConfirming] = useState(false)
  const { isMature } = lock
  const withdrawDisabled = lock.status === 'completed' || hasPendingWithdrawal

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[20px] border border-[var(--c-border)] overflow-hidden"
      style={{ background: 'var(--c-surface)' }}
    >
      <div className="h-1 w-full" style={{ background: isMature ? 'linear-gradient(90deg,#34d399,rgba(52,211,153,0.35))' : `linear-gradient(90deg,${LOCK},rgba(201,162,39,0.35))` }} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-[14px] font-black text-[var(--c-text)] m-0 truncate tracking-[-0.2px] mb-1.5">{lock.name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {isMature ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.8px]" style={{ background: 'rgba(52,211,153,0.12)', color: MATURE, border: '1px solid rgba(52,211,153,0.3)' }}>
                  <Check size={8} strokeWidth={3} /> Matured
                </span>
              ) : lock.status === 'completed' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.8px]" style={{ background: 'rgba(52,211,153,0.06)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.18)' }}>
                  <ArrowUpRight size={8} strokeWidth={3} /> Early withdrawal
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.8px]" style={{ background: LOCK_BG, color: LOCK, border: `1px solid ${LOCK_BORDER}` }}>
                  <Zap size={8} strokeWidth={3} /> Fixed
                </span>
              )}
              {lock.apy > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tabular-nums" style={{ background: 'var(--c-accent-soft)', color: 'var(--c-accent)', border: '1px solid var(--c-accent-border)' }}>
                  <Percent size={8} /> {lock.apy}% p.a.
                </span>
              )}
            </div>
          </div>
          <CircleRing pct={lock.progress} isMature={isMature || lock.status === 'completed'} size={72} stroke={7} />
        </div>

        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <p className="text-[11px] text-[var(--c-text-muted)] m-0">Amount fixed</p>
            <p className="text-[18px] font-black text-[var(--c-text)] m-0 tabular-nums tracking-[-0.5px] leading-tight">{fmtN(lock.principal)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-[var(--c-text-muted)] m-0">Interest earned</p>
            <p className="text-[13px] font-black tabular-nums m-0 leading-tight" style={{ color: LOCK }}>+{fmtN(lock.interestEarned)}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: isMature ? 'Matured on' : lock.status === 'completed' ? 'Completed on' : 'Matures on', value: lock.maturityDate || '—', icon: Calendar },
            { label: 'Fixed days', value: lock.daysTotal != null ? `${lock.daysTotal}days` : '—', icon: Clock },
            { label: lock.status === 'completed' ? 'Paid out' : "You'll receive", value: fmtN(lock.status === 'completed' ? lock.paidOut : lock.principal + (isMature ? lock.interestEarned : lock.projectedInterest)), icon: Coins, gold: true },
          ].map(({ label, value, icon: Icon, gold }) => (
            <div key={label} className="flex flex-col gap-0.5 p-2.5 rounded-xl" style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border-soft)' }}>
              <span className="text-[9.5px] uppercase tracking-[1px] font-bold text-[var(--c-text-faint)] inline-flex items-center gap-1"><Icon size={8} /> {label}</span>
              <span className="text-[11.5px] font-black tabular-nums leading-tight" style={{ color: gold ? LOCK : 'var(--c-text)' }}>{value}</span>
            </div>
          ))}
        </div>

        {!isMature && lock.status !== 'completed' && (
          <>
            <div className="relative w-full h-1.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--c-border-soft)' }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${lock.progress}%` }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: `linear-gradient(90deg,${MATURE},rgba(52,211,153,0.6))` }}
              />
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-[var(--c-text-faint)]">{lock.progress}% of term elapsed</span>
              <span className="text-[10px] font-semibold text-[var(--c-text-muted)] inline-flex items-center gap-1">
                <Clock size={9} /> {lock.daysLeft} day{lock.daysLeft !== 1 ? 's' : ''} left
              </span>
            </div>
          </>
        )}

        <div className="pt-3 border-t border-[var(--c-border-soft)]">
          {confirming ? (
            <div className="flex items-start gap-3 p-3.5 rounded-xl border" style={{ background: 'rgba(251,146,60,0.07)', borderColor: 'rgba(251,146,60,0.25)' }}>
              <AlertTriangle size={15} className="text-[#fb923c] shrink-0 mt-0.5" strokeWidth={2.2} />
              <div className="flex-1 min-w-0">
                <p className="text-[11.5px] font-bold text-[var(--c-text)] m-0">Early withdrawal</p>
                <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5 leading-relaxed">
                  {penalty > 0
                    ? `A ${penalty}% penalty applies. You may receive less than your fixed amount.`
                    : 'Withdrawing before maturity may reduce your earnings.'}
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={() => { setConfirming(false); onWithdraw(lock.id) }}
                    disabled={withdrawing || withdrawDisabled}
                    className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg font-bold text-[11px] border transition active:scale-95"
                    style={{ background: 'rgba(251,146,60,0.12)', borderColor: 'rgba(251,146,60,0.3)', color: '#fb923c' }}
                  >
                    {withdrawing ? <Loader2 size={11} className="animate-spin" /> : 'Confirm'}
                  </button>
                  <button
                    type="button" onClick={() => setConfirming(false)}
                    className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg font-bold text-[11px] border border-[var(--c-border)] text-[var(--c-text-muted)] bg-[var(--c-surface-soft)] transition active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { if (withdrawDisabled) return; isMature ? onWithdraw(lock.id) : setConfirming(true) }}
              disabled={withdrawing || withdrawDisabled}
              title={hasPendingWithdrawal ? 'A withdrawal request is already pending for this plan' : undefined}
              className={[
                'inline-flex items-center gap-1.5 px-4 h-9 rounded-xl font-bold text-[11.5px] border transition active:scale-95 disabled:opacity-60',
                isMature
                  ? 'text-[#34d399] bg-[rgba(52,211,153,0.08)] border-[rgba(52,211,153,0.3)]'
                  : lock.status === 'completed'
                    ? 'text-[#6ee7b7] bg-[rgba(52,211,153,0.06)] border-[rgba(52,211,153,0.18)]'
                    : 'border-[var(--c-border)] text-[var(--c-text-muted)] bg-[var(--c-surface-soft)] ml-auto',
              ].join(' ')}
            >
              {withdrawing
                ? <Loader2 size={12} className="animate-spin" />
                : <><ArrowUpRight size={12} strokeWidth={2.5} /> {lock.status === 'completed' ? 'Withdraw Completed' : hasPendingWithdrawal ? 'Withdrawal pending' : isMature ? 'Withdraw funds' : 'Early withdraw'}</>
              }
            </button>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-[var(--c-border-soft)]">
          <button
            type="button"
            onClick={() => onHistory(lock)}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--c-text-muted)] hover:text-[var(--c-text)] transition"
          >
            <History size={11} /> History
          </button>
        </div>
      </div>
    </motion.article>
  )
}

/* ── Page ──────────────────────────────────── */

export default function DesktopFixedSavings() {
  const { alert } = useAlert()
  const { plans: rawProducts, investments, creating, create, withdraw } = useSavingsOverview()
  const { withdrawals: pendingWithdrawals } = useSavingsWithdrawals('pending')

  const [showModal, setShowModal]     = useState(false)
  const [success, setSuccess]         = useState(null)
  const [withdrawingId, setWithdrawingId] = useState(null)
  const [historyLock, setHistoryLock] = useState(null)

  const fixedLocks = useMemo(() =>
    investments.filter(a => (a.product_type || a.type) === 'fixed').map(mapLock),
    [investments]
  )

  const pendingPlanIds = useMemo(() => new Set(pendingWithdrawals.map(w => w.plan_id)), [pendingWithdrawals])

  const fixedProduct = useMemo(() => {
    const p = rawProducts.find(r => r.type === 'fixed')
    if (!p) return null
    const tiers = Array.isArray(p.lockDurationTiers)
      ? p.lockDurationTiers.map(t => ({
          id: `${t.min_days}-${t.max_days}`,
          label: `${t.min_days}–${t.max_days} days`,
          apy: Number(t.apy),
          minDays: Number(t.min_days),
          maxDays: Number(t.max_days),
        }))
      : []
    return { id: p.id, type: p.type, name: p.name, desc: p.description, tiers, minDeposit: p.minDeposit, penalty: p.earlyWithdrawalPenalty }
  }, [rawProducts])

  const totalLocked   = useMemo(() => fixedLocks.filter(l => l.status !== 'completed').reduce((s, l) => s + l.principal, 0), [fixedLocks])
  const totalInterest = useMemo(() => fixedLocks.reduce((s, l) => s + l.interestEarned, 0), [fixedLocks])
  const totalPayout   = useMemo(() => fixedLocks.filter(l => l.status === 'completed').reduce((s, l) => s + l.paidOut, 0), [fixedLocks])
  const activeLocks   = fixedLocks.filter(l => !l.isMature && l.status !== 'completed')
  const maturedLocks  = fixedLocks.filter(l => l.isMature)
  const maxApy = fixedProduct?.tiers?.length ? Math.max(...fixedProduct.tiers.map(t => t.apy)) : 0
  const nearestMaturity = activeLocks.reduce((min, l) =>
    (min === null || (l.daysLeft !== null && l.daysLeft < min)) ? l.daysLeft : min, null)

  async function handleCreate(payload) {
    if (!fixedProduct) return
    const r = await create({
      product_id: fixedProduct.id,
      name: payload.name,
      initial_amount: payload.amount,
      lock_duration_days: payload.lockDays,
    })
    if (r.success) {
      setSuccess({
        name: payload.name,
        principal: payload.amount,
        lockDays: payload.lockDays,
        apy: payload.apy,
        maturityDate: fmtDate(new Date(Date.now() + payload.lockDays * 86400000)),
        projectedInterest: payload.amount * (payload.apy / 100) * (payload.lockDays / 365),
      })
      alert({ type: 'success', title: 'Plan fixed', message: `${payload.name} fixed for ${payload.lockDays} days at ${payload.apy}% p.a.` })
    } else {
      alert({ type: 'error', title: 'Could not create plan', message: r.message || 'Something went wrong.' })
    }
  }

  async function handleWithdraw(id) {
    setWithdrawingId(id)
    const r = await withdraw(id)
    setWithdrawingId(null)
    if (r.success) {
      alert({ type: 'success', title: 'Withdrawal requested', message: 'Your request is pending admin approval.' })
    } else {
      alert({ type: 'error', title: 'Withdrawal failed', message: r.message || 'Could not process withdrawal.' })
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-[1240px] mx-auto pb-10">

      {/* Header */}
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/user/savings" className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[var(--c-text-muted)] hover:text-[var(--c-text)] transition">
              <ChevronLeft size={12} /> Save & earn
            </Link>
          </div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.4px] text-brand-accent font-bold m-0">
            <Lock size={10} /> Fixed savings
          </p>
          <h1 className="text-[22px] font-black tracking-[-0.5px] text-[var(--c-text)] m-0 mt-1">Your fixed plans</h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Fix funds for a fixed term and earn up to {maxApy > 0 ? `${maxApy}%` : 'a higher rate'} p.a. guaranteed
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowModal(true); setSuccess(null) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[12.5px] transition hover:-translate-y-px active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
        >
          <Plus size={14} strokeWidth={2.6} /> New fixed
        </button>
      </header>

      {/* Hero */}
      <article
        className="relative overflow-hidden rounded-[24px] border shadow-[0_24px_60px_-20px_rgba(2,7,23,0.6)]"
        style={{ background: 'linear-gradient(140deg,#0d2657 0%,#091a3a 55%,#040e24 100%)', borderColor: LOCK_BORDER }}
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.14)' }} />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.08)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: 'radial-gradient(rgba(201,162,39,0.2) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,162,39,0.6),transparent)' }} />

        <div className="relative grid grid-cols-1 min-[860px]:grid-cols-[1.4fr_1fr] gap-0 divide-y min-[860px]:divide-y-0 min-[860px]:divide-x divide-white/[0.07]">
          <div className="p-5">
            <span className="inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[1.5px] font-bold mb-4" style={{ color: LOCK }}>
              <Lock size={9} /> Total fixed portfolio
            </span>
            <p className="text-[11px] text-white/50 m-0">Total fixed</p>
            <span className="text-[32px] font-black tracking-[-1.5px] text-white leading-none tabular-nums block mt-0.5 mb-1">{fmtN(totalLocked)}</span>
            <p className="text-[11px] text-white/50 m-0">
              {activeLocks.length} active fixed ·{' '}
              {nearestMaturity !== null
                ? `nearest matures in ${nearestMaturity} day${nearestMaturity !== 1 ? 's' : ''}`
                : 'no active fixed'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px p-5">
            {[
              { label: 'Interest earned', value: fmtN(totalInterest), accent: true, icon: Coins },
              { label: 'Total payout',    value: fmtN(totalPayout),                  icon: Coins },
              { label: 'Matured',         value: String(maturedLocks.length),        icon: Check },
              { label: 'Max p.a',         value: maxApy > 0 ? `${maxApy}% p.a.` : '—', icon: TrendingUp },
            ].map(({ label, value, accent, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col justify-between p-3 rounded-xl"
                style={{ background: accent ? LOCK_BG : 'rgba(255,255,255,0.04)', border: accent ? `1px solid ${LOCK_BORDER}` : '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold m-0" style={{ color: accent ? LOCK : 'rgba(255,255,255,0.4)' }}>{label}</p>
                  <Icon size={12} style={{ color: accent ? LOCK : 'rgba(255,255,255,0.3)' }} />
                </div>
                <p className="text-[16.5px] font-black tabular-nums tracking-[-0.4px] m-0 mt-1.5 leading-none" style={{ color: accent ? LOCK : '#fff' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* All locks */}
      {fixedLocks.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2 className="inline-flex items-center gap-2 text-[14px] font-black m-0 text-[var(--c-text)] tracking-[-0.2px]">
              <Lock size={14} style={{ color: LOCK }} /> Your fixed
            </h2>
            <span className="text-[10.5px] font-semibold text-[var(--c-text-muted)]">{fixedLocks.length}</span>
          </div>
          <div className="grid grid-cols-1 min-[860px]:grid-cols-2 gap-4">
            {fixedLocks.map(lock => (
              <LockCard key={lock.id} lock={lock} onWithdraw={handleWithdraw} withdrawing={withdrawingId === lock.id} penalty={fixedProduct?.penalty || 0} hasPendingWithdrawal={pendingPlanIds.has(lock.id)} onHistory={setHistoryLock} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {fixedLocks.length === 0 && (
        <div className="flex flex-col items-center text-center py-20 px-4 rounded-[20px] border border-[var(--c-border)]" style={{ background: 'var(--c-surface)' }}>
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-[22px] mb-5 border" style={{ background: LOCK_BG, borderColor: LOCK_BORDER, color: LOCK }}>
            <Lock size={28} strokeWidth={1.8} />
          </span>
          <h3 className="text-[16px] font-black text-[var(--c-text)] m-0 tracking-[-0.2px]">No fixed plans</h3>
          <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 max-w-[320px] leading-relaxed">
            Fix your money for a fixed term to earn up to {maxApy > 0 ? `${maxApy}%` : 'a higher rate'} p.a. — guaranteed.
          </p>
          <button
            type="button"
            onClick={() => { setShowModal(true); setSuccess(null) }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[13px] mt-5 transition hover:-translate-y-px active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
          >
            <Plus size={14} strokeWidth={2.6} /> Create first plan
          </button>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showModal && fixedProduct && (
          <CreateLockModal
            product={fixedProduct}
            onClose={() => { setShowModal(false); setSuccess(null) }}
            onSubmit={handleCreate}
            submitting={creating}
            success={success}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {historyLock && (
          <FixedSavingsHistoryModal lock={historyLock} onClose={() => setHistoryLock(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
