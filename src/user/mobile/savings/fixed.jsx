import { useMemo, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BottomSheet, { SheetRow } from '../../../components/internalUI/BottomSheet'
import { useAlert } from '../../../components/ui/Alert'
import { useSavingsOverview, useSavingsWithdrawals, useSavingsPlanLedger } from '../../../hooks/useSavings'
import { fmtDate } from '../../../utils/format'
import {
  ChevronDown, Lock, Plus, Check, Loader2, ShieldCheck,
  ArrowUpRight, ArrowDownLeft, Clock, Calendar, Percent, Coins, X,
  AlertTriangle, Zap, TrendingUp, History, Receipt, Sparkles,
} from 'lucide-react'
import MobilePageHeader from '../../../components/partials/MobilePageHeader'

function fmt(n) { return Number(n || 0).toLocaleString('en-NG') }
function fmtN(n) { return '₦' + fmt(Math.round(n || 0)) }

const LOCK = '#C9A227'
const LOCK_BG = 'rgba(201,162,39,0.1)'
const LOCK_BORDER = 'rgba(201,162,39,0.28)'
const MATURE = '#34d399'

/* ── Circle ring ─────────────────────────────── */

function CircleRing({ pct = 0, isMature = false, size = 72, stroke = 7 }) {
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
          ? <Check size={16} strokeWidth={3} style={{ color: MATURE }} />
          : <>
              <span className="text-[12px] font-black leading-none tabular-nums" style={{ color }}>{pct}%</span>
              <span className="text-[7px] font-bold text-[var(--c-text-faint)] mt-0.5">elapsed</span>
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
  const paidOut = principal > 0 ? principal : Number(a.approved_net_payout || 0)

  let progress = 0, daysLeft = null, daysTotal = null
  let isMature = false, maturityDate = null, projectedInterest = 0

  if (a.start_date && a.maturity_date) {
    const start = new Date(a.start_date).getTime()
    const end = new Date(a.maturity_date).getTime()
    const now = Date.now()
    daysTotal = a.lock_duration_days != null ? Number(a.lock_duration_days) : Math.round((end - start) / 86400000)
    daysLeft = Math.max(0, Math.ceil((end - now) / 86400000))
    progress = end > start ? Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100))) : 0
    isMature = (daysLeft === 0 || a.status === 'matured') && a.status !== 'completed'
    maturityDate = fmtDate(a.maturity_date)
    projectedInterest = principal * (apy / 100) * (daysTotal / 365)
  }

  return {
    id: a.id,
    name: a.name || 'Fixed savings',
    principal, interestEarned, apy, paidOut,
    progress, daysLeft, daysTotal, isMature,
    maturityDate, projectedInterest,
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
        className="w-full h-[48px] pl-2 pr-3 rounded-xl text-[12.5px] font-bold text-[var(--c-text)] outline-none border transition flex items-center justify-between gap-2 active:scale-[0.99]"
        style={{ background: 'var(--c-surface-soft)', borderColor: open ? 'var(--c-accent-border-strong)' : 'var(--c-border)' }}
      >
        <span className="inline-flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ background: LOCK_BG, color: LOCK }}>
            <Clock size={14} strokeWidth={2.2} />
          </span>
          <span className="truncate">
            {activeTier ? `${activeTier.label} · ${activeTier.minDays}–${activeTier.maxDays} days` : 'Select duration'}
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
                    <span className="text-[10px] font-semibold text-[var(--c-text-muted)]">{tier.minDays}–{tier.maxDays} days</span>
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
        className="w-full h-[48px] pl-2 pr-3 rounded-xl text-[12.5px] font-bold text-[var(--c-text)] outline-none border transition flex items-center justify-between gap-2 active:scale-[0.99]"
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

/* ── Create lock sheet ─────────────────────── */

function CreateLockSheet({ open, product, onClose, onSubmit, submitting, success }) {
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
  const maturityDate = numDays > 0 ? fmtDate(new Date(now + numDays * 86400000)) : null

  function handleTierSelect(tier) {
    setSelTier(tier)
    if (lockDays != null && (lockDays < tier.minDays || lockDays > tier.maxDays)) setLockDays(null)
  }

  function submit() {
    if (!valid || submitting) return
    onSubmit({ name: name.trim(), amount: numAmount, lockDays: numDays, apy, tier: activeTier?.label })
  }

  function handleClose() {
    if (!submitting) onClose()
  }

  return (
    <BottomSheet open={open} onClose={handleClose} label="New fixed" title={product?.name || 'Fixed Savings'} maxHeight="92vh">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center px-5 py-8"
          >
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ background: 'var(--c-success-bg)', color: 'var(--c-success)' }}
            >
              <Check size={28} strokeWidth={2.6} />
            </motion.span>
            <h3 className="text-[17px] font-black text-[var(--c-text)] m-0 tracking-[-0.3px]">Plan fixed</h3>
            <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 leading-relaxed max-w-[260px]">
              {fmtN(success.principal)} fixed in{' '}
              <span className="font-semibold text-[var(--c-text)]">{success.name}</span>
              {' '}for {success.lockDays} days
            </p>

            <div className="w-full mt-5 rounded-2xl border border-[var(--c-border-soft)] overflow-hidden divide-y divide-[var(--c-border-soft)]" style={{ background: 'var(--c-surface-soft)' }}>
              <SheetRow label="Plan name"      value={success.name} />
              <SheetRow label="Amount fixed"   value={fmtN(success.principal)} bold />
              <SheetRow label="Duration"       value={`${success.lockDays} days`} />
              <SheetRow label="Rate"           value={`${success.apy}% p.a.`} />
              <SheetRow label="Matures on"     value={success.maturityDate} />
              <SheetRow label="Proj. interest" value={fmtN(success.projectedInterest)} accent />
            </div>

            <button
              type="button" onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 w-full h-[46px] rounded-xl font-bold text-[13px] mt-5 transition active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
            >
              Done
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="px-5 pt-2 pb-8 flex flex-col gap-4"
          >
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
                  className="w-full h-[48px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
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
                className="h-[48px] px-4 rounded-xl text-[13px] font-semibold text-[var(--c-text)] outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
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
              className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-xl font-bold text-[13.5px] mt-1 transition active:scale-[0.99] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
            >
              {submitting
                ? <><Loader2 size={15} className="animate-spin" /> Fixing…</>
                : <><Lock size={15} strokeWidth={2.2} /> Fix & earn {apy > 0 ? `${apy}%` : ''}</>
              }
            </button>
            <p className="inline-flex items-center gap-1.5 text-[10px] text-[var(--c-text-faint)] justify-center m-0">
              <ShieldCheck size={11} className="text-brand-accent" /> Amount debited from your wallet
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </BottomSheet>
  )
}

/* ── Withdraw sheet ────────────────────────── */

function WithdrawSheet({ open, lock, penalty, onClose, onConfirm, withdrawing }) {
  const isEarly = lock && !lock.isMature
  return (
    <BottomSheet open={open} onClose={() => !withdrawing && onClose()} label="Withdraw" title={lock?.name || 'Fixed savings'} maxHeight="65vh">
      <div className="px-5 pt-2 pb-8 flex flex-col gap-4">

        {isEarly && (
          <div className="flex items-start gap-3 p-3.5 rounded-2xl border" style={{ background: 'rgba(251,146,60,0.07)', borderColor: 'rgba(251,146,60,0.28)' }}>
            <AlertTriangle size={16} className="text-[#fb923c] shrink-0 mt-0.5" strokeWidth={2.2} />
            <div>
              <p className="text-[12px] font-bold text-[var(--c-text)] m-0">Early withdrawal</p>
              <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5 leading-relaxed">
                {penalty > 0 ? `A ${penalty}% penalty applies to early withdrawals.` : 'Withdrawing early may reduce your earnings.'}
              </p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-[var(--c-border-soft)] overflow-hidden divide-y divide-[var(--c-border-soft)]" style={{ background: 'var(--c-surface-soft)' }}>
          <SheetRow label="Amount fixed"   value={fmtN(lock?.principal)} bold />
          <SheetRow label="Interest earned" value={fmtN(lock?.interestEarned)} accent />
          {lock?.maturityDate && <SheetRow label={lock.isMature ? 'Matured on' : 'Matures on'} value={lock.maturityDate} muted />}
        </div>

        <button
          type="button" onClick={onConfirm} disabled={withdrawing}
          className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-xl font-bold text-[13.5px] transition active:scale-[0.99] disabled:opacity-50"
          style={isEarly
            ? { background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.3)', color: '#fb923c' }
            : { background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }
          }
        >
          {withdrawing
            ? <><Loader2 size={15} className="animate-spin" /> Processing…</>
            : <><ArrowUpRight size={15} strokeWidth={2.2} /> {isEarly ? 'Confirm early withdrawal' : 'Withdraw funds'}</>
          }
        </button>
        <p className="inline-flex items-center gap-1.5 text-[10px] text-[var(--c-text-faint)] justify-center m-0">
          <ShieldCheck size={11} className="text-brand-accent" /> Funds returned to your wallet
        </p>
      </div>
    </BottomSheet>
  )
}

/* ── Ledger ─────────────────────────────────── */

const LEDGER_META = {
  deposit:         { label: 'Initial deposit',          icon: ArrowDownLeft, sign: '+' },
  interest_credit: { label: 'Interest credited',        icon: Sparkles,      sign: '+' },
  maturity_payout: { label: 'Maturity payout',          icon: Coins,         sign: '+' },
  withdrawal:      { label: 'Withdrawal',               icon: ArrowUpRight,  sign: '-' },
  penalty:         { label: 'Early withdrawal penalty', icon: AlertTriangle, sign: '-' },
}

function LedgerRow({ entry }) {
  const meta = LEDGER_META[entry.type] || { label: entry.type, icon: Coins, sign: '' }
  const Icon = meta.icon
  const isCredit = meta.sign === '+'
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5">
      <span
        className="inline-flex items-center justify-center w-7 h-7 rounded-xl shrink-0 border"
        style={{
          background: isCredit ? LOCK_BG : 'var(--c-surface-soft)',
          borderColor: isCredit ? LOCK_BORDER : 'var(--c-border-soft)',
          color: isCredit ? LOCK : 'var(--c-text-muted)',
        }}
      >
        <Icon size={12} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold text-[var(--c-text)] m-0 truncate">{entry.description || meta.label}</p>
        <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 mt-0.5">{fmtDate(entry.created_at)}</p>
      </div>
      <span className="text-[11.5px] font-black tabular-nums shrink-0" style={{ color: isCredit ? LOCK : 'var(--c-text)' }}>
        {meta.sign}{fmtN(entry.amount)}
      </span>
    </div>
  )
}

/* ── Lock card ─────────────────────────────── */

function LockCard({ lock, onWithdraw, hasPendingWithdrawal, onHistory }) {
  const { isMature } = lock
  const withdrawDisabled = lock.status === 'completed' || hasPendingWithdrawal

  return (
    <div className="rounded-[18px] border border-[var(--c-border)] overflow-hidden" style={{ background: 'var(--c-surface)' }}>
      <div className="h-[3px] w-full" style={{ background: isMature ? 'linear-gradient(90deg,#34d399,rgba(52,211,153,0.35))' : `linear-gradient(90deg,${LOCK},rgba(201,162,39,0.35))` }} />

      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="text-[13.5px] font-black text-[var(--c-text)] m-0 truncate tracking-[-0.2px]">{lock.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {isMature ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[0.8px]" style={{ background: 'rgba(52,211,153,0.12)', color: MATURE, border: '1px solid rgba(52,211,153,0.3)' }}>
                  <Check size={7} strokeWidth={3} /> Matured
                </span>
              ) : lock.status === 'completed' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[0.8px]" style={{ background: 'rgba(52,211,153,0.06)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.18)' }}>
                  <ArrowUpRight size={7} strokeWidth={3} /> Early withdrawal
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[0.8px]" style={{ background: LOCK_BG, color: LOCK, border: `1px solid ${LOCK_BORDER}` }}>
                  <Zap size={7} strokeWidth={3} /> Fixed
                </span>
              )}
              {lock.apy > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold tabular-nums" style={{ background: 'var(--c-accent-soft)', color: 'var(--c-accent)', border: '1px solid var(--c-accent-border)' }}>
                  <Percent size={7} /> {lock.apy}%
                </span>
              )}
            </div>
          </div>
          <CircleRing pct={lock.progress} isMature={isMature || lock.status === 'completed'} size={60} stroke={6} />
        </div>

        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] text-[var(--c-text-muted)] m-0">{lock.status === 'completed' ? 'Paid out' : 'Fixed'}</p>
            <p className="text-[16px] font-black text-[var(--c-text)] m-0 tabular-nums tracking-[-0.4px] leading-tight">{fmtN(lock.status === 'completed' ? lock.paidOut : lock.principal)}</p>
          </div>
          {lock.status !== 'completed' && (
            <div className="text-right">
              <p className="text-[10px] text-[var(--c-text-muted)] m-0">Interest</p>
              <p className="text-[12px] font-bold tabular-nums m-0 leading-tight" style={{ color: LOCK }}>+{fmtN(lock.interestEarned)}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5 mb-2">
          {[
            { label: isMature ? 'Matured on' : lock.status === 'completed' ? 'Completed on' : 'Matures on', value: lock.maturityDate || '—', icon: Calendar },
            { label: 'Fixed days', value: lock.daysTotal != null ? `${lock.daysTotal} days` : '—', icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col gap-0.5 p-2 rounded-xl" style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border-soft)' }}>
              <span className="text-[9px] uppercase tracking-[0.8px] font-bold text-[var(--c-text-faint)] inline-flex items-center gap-1"><Icon size={7} /> {label}</span>
              <span className="text-[11px] font-black text-[var(--c-text)] tabular-nums leading-tight">{value}</span>
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
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[var(--c-text-faint)]">{lock.progress}% elapsed</span>
              <span className="text-[10px] font-semibold text-[var(--c-text-muted)] inline-flex items-center gap-1">
                <Clock size={9} /> {lock.daysLeft}d left
              </span>
            </div>
          </>
        )}

        <div className="pt-2.5 border-t border-[var(--c-border-soft)]">
          <button
            type="button"
            onClick={() => onWithdraw(lock)}
            disabled={withdrawDisabled}
            title={hasPendingWithdrawal ? 'A withdrawal request is already pending for this plan' : undefined}
            className={[
              'inline-flex items-center gap-1.5 px-3 h-9 rounded-xl font-bold text-[11px] border transition active:scale-95 disabled:opacity-60',
              isMature
                ? 'text-[#34d399] bg-[rgba(52,211,153,0.08)] border-[rgba(52,211,153,0.3)]'
                : lock.status === 'completed'
                  ? 'text-[#6ee7b7] bg-[rgba(52,211,153,0.06)] border-[rgba(52,211,153,0.18)]'
                  : 'border-[var(--c-border)] text-[var(--c-text-muted)] bg-[var(--c-surface-soft)] ml-auto',
            ].join(' ')}
          >
            <ArrowUpRight size={11} strokeWidth={2.5} /> {lock.status === 'completed' ? 'Withdraw Completed' : hasPendingWithdrawal ? 'Withdrawal pending' : isMature ? 'Withdraw funds' : 'Early withdraw'}
          </button>
        </div>

        <div className="mt-2.5 pt-2.5 border-t border-[var(--c-border-soft)]">
          <button
            type="button"
            onClick={() => onHistory(lock)}
            className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-[var(--c-text-muted)] w-full"
          >
            <History size={10} /> History
            <ChevronDown size={10} className="ml-auto -rotate-90" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Page ──────────────────────────────────── */

export default function MobileFixedSavings() {
  const navigate = useNavigate()
  const { alert } = useAlert()
  const { plans: rawProducts, investments, creating, create, withdraw } = useSavingsOverview()
  const { withdrawals: pendingWithdrawals } = useSavingsWithdrawals('pending')

  const [showSheet, setShowSheet]     = useState(false)
  const [success, setSuccess]         = useState(null)
  const [withdrawLock, setWithdrawLock] = useState(null)
  const [withdrawing, setWithdrawing] = useState(false)
  const [historyLock, setHistoryLock] = useState(null)
  const { ledger: historyLedger, loading: historyLoading } = useSavingsPlanLedger(historyLock?.id)

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
    } else {
      alert({ type: 'error', title: 'Could not create plan', message: r.message || 'Something went wrong.' })
    }
  }

  async function handleWithdraw() {
    if (!withdrawLock) return
    setWithdrawing(true)
    const r = await withdraw(withdrawLock.id)
    setWithdrawing(false)
    if (r.success) {
      setWithdrawLock(null)
    } else {
      alert({ type: 'error', title: 'Withdrawal failed', message: 'Could not process withdrawal. Please try again.' })
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--c-bg)' }}>

      <MobilePageHeader
        title="Fixed plans"
        onBack={() => navigate('/user/savings')}
        right={
          <button
            type="button"
            onClick={() => { setShowSheet(true); setSuccess(null) }}
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl transition active:scale-90"
            style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', boxShadow: '0 4px 14px rgba(201,162,39,0.4)' }}
          >
            <Plus size={17} strokeWidth={2.6} />
          </button>
        }
      />

      <div className="flex flex-col gap-4  py-4 pb-24">

        {/* Hero */}
        <article
          className="relative overflow-hidden rounded-[22px] border shadow-[0_16px_40px_-12px_rgba(2,7,23,0.55)]"
          style={{ background: 'linear-gradient(140deg,#0d2657 0%,#091a3a 60%,#040e24 100%)', borderColor: LOCK_BORDER }}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.14)' }} />
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,162,39,0.6),transparent)' }} />

          <div className="relative p-4">
            <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[1.4px] font-bold mb-3" style={{ color: LOCK }}>
              <Lock size={8} /> Fixed portfolio
            </span>
            <p className="text-[10px] text-white/50 m-0">Total fixed</p>
            <span className="text-[26px] font-black tracking-[-1px] text-white leading-none tabular-nums block mt-0.5 mb-1">{fmtN(totalLocked)}</span>
            <p className="text-[10px] text-white/45 m-0 mb-4">
              {activeLocks.length} active · {maturedLocks.length} matured
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Interest',     value: fmtN(totalInterest), accent: true },
                { label: 'Total payout', value: fmtN(totalPayout) },
                { label: 'Max APY',      value: maxApy > 0 ? `${maxApy}%` : '—' },
              ].map(({ label, value, accent }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center py-2.5 rounded-xl"
                  style={{
                    background: accent ? LOCK_BG : 'rgba(255,255,255,0.06)',
                    border: accent ? `1px solid ${LOCK_BORDER}` : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="text-[9px] uppercase tracking-[0.8px] font-bold mb-0.5" style={{ color: accent ? LOCK : 'rgba(255,255,255,0.4)' }}>{label}</span>
                  <span className="text-[13px] font-black tabular-nums" style={{ color: accent ? LOCK : '#fff' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* All locks */}
        {fixedLocks.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h2 className="inline-flex items-center gap-1.5 text-[13px] font-black m-0 text-[var(--c-text)] tracking-[-0.2px]">
                <Lock size={13} style={{ color: LOCK }} /> Your fixed
              </h2>
              <span className="text-[10px] font-semibold text-[var(--c-text-muted)]">{fixedLocks.length}</span>
            </div>
            {fixedLocks.map(lock => (
              <LockCard key={lock.id} lock={lock} onWithdraw={setWithdrawLock} hasPendingWithdrawal={pendingPlanIds.has(lock.id)} onHistory={setHistoryLock} />
            ))}
          </section>
        )}

        {/* Empty state */}
        {fixedLocks.length === 0 && (
          <div className="flex flex-col items-center text-center pt-8 pb-8 px-4 rounded-[22px] border border-[var(--c-border)]" style={{ background: 'var(--c-surface)' }}>

            {/* Icon visual */}
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.16)', transform: 'scale(1.5)' }} />
              <span
                className="relative inline-flex items-center justify-center w-[100px] h-[100px] rounded-[32px] border-2"
                style={{ background: LOCK_BG, borderColor: LOCK_BORDER, color: LOCK }}
              >
                <Lock size={42} strokeWidth={1.6} />
              </span>
              <span
                className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-7 h-7 rounded-full border-2"
                style={{ background: 'var(--c-surface)', borderColor: 'var(--c-surface)' }}
              >
                <span className="inline-flex items-center justify-center w-full h-full rounded-full" style={{ background: LOCK_BG, color: LOCK }}>
                  <Clock size={12} strokeWidth={2.4} />
                </span>
              </span>
            </div>

            <h3 className="text-[18px] font-black text-[var(--c-text)] m-0 tracking-[-0.4px]">No fixed plans</h3>
            <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1.5 max-w-[230px] leading-relaxed">
              Fix your funds for a fixed term and earn a guaranteed higher rate — the longer you fix, the more you earn.
            </p>

            {/* APY tier chips */}
            {fixedProduct?.tiers?.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                {fixedProduct.tiers.map(tier => (
                  <span
                    key={tier.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                    style={{ background: LOCK_BG, border: `1px solid ${LOCK_BORDER}`, color: LOCK }}
                  >
                    <Percent size={9} strokeWidth={2.5} />
                    {tier.apy}% · {tier.minDays}–{tier.maxDays}d
                  </span>
                ))}
              </div>
            )}
            {maxApy > 0 && !(fixedProduct?.tiers?.length > 0) && (
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border mt-5 w-full"
                style={{ background: LOCK_BG, borderColor: LOCK_BORDER }}
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0" style={{ background: 'rgba(201,162,39,0.15)', color: LOCK }}>
                  <TrendingUp size={18} strokeWidth={2} />
                </span>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-[1px] font-bold m-0" style={{ color: LOCK }}>Up to {maxApy}% p.a.</p>
                  <p className="text-[13px] font-black text-[var(--c-text)] m-0 mt-0.5">Guaranteed fixed rate</p>
                </div>
              </div>
            )}

            {/* Feature rows */}
            <div className="w-full mt-3 rounded-2xl border border-[var(--c-border-soft)] overflow-hidden" style={{ background: 'var(--c-surface-soft)' }}>
              {[
                { icon: TrendingUp, label: 'Higher guaranteed rate',   sub: 'Fixed APY agreed at the start' },
                { icon: Clock,      label: 'Choose your fixed term',   sub: 'Pick any duration within a tier' },
                { icon: Coins,      label: 'Full payout at maturity',  sub: 'Principal + all interest released' },
              ].map(({ icon: Icon, label, sub }, i) => (
                <div key={label} className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}`}>
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0" style={{ background: LOCK_BG, color: LOCK }}>
                    <Icon size={15} strokeWidth={2.2} />
                  </span>
                  <div className="text-left">
                    <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0">{label}</p>
                    <p className="text-[10.5px] text-[var(--c-text-muted)] m-0">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => { setShowSheet(true); setSuccess(null) }}
              className="inline-flex items-center justify-center gap-2 w-full h-[52px] rounded-2xl font-bold text-[14px] mt-5 transition active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 10px 28px -8px rgba(201,162,39,0.55)' }}
            >
              <Plus size={16} strokeWidth={2.6} /> Fix & start earning
            </button>
          </div>
        )}
      </div>

      {/* Bottom sheets */}
      <CreateLockSheet
        open={showSheet}
        product={fixedProduct}
        onClose={() => { setShowSheet(false); setSuccess(null) }}
        onSubmit={handleCreate}
        submitting={creating}
        success={success}
      />
      <WithdrawSheet
        open={withdrawLock !== null}
        lock={withdrawLock}
        penalty={fixedProduct?.penalty || 0}
        onClose={() => setWithdrawLock(null)}
        onConfirm={handleWithdraw}
        withdrawing={withdrawing}
      />
      <BottomSheet open={!!historyLock} onClose={() => setHistoryLock(null)} label="History" title={historyLock?.name || 'Plan history'} maxHeight="75vh">
        {historyLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin text-[var(--c-text-muted)]" />
          </div>
        ) : historyLedger.length === 0 ? (
          <div className="flex flex-col items-center text-center py-10 gap-2.5 px-4">
            <Receipt size={22} className="text-[var(--c-text-faint)]" strokeWidth={1.8} />
            <p className="text-[12.5px] text-[var(--c-text-muted)] m-0">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--c-border-soft)]">
            {historyLedger.map(entry => <LedgerRow key={entry.id} entry={entry} />)}
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
