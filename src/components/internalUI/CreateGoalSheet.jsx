import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomSheet, { SheetRow } from './BottomSheet'
import CalendarPicker from './CalendarPicker'
import {
  ChevronLeft, Target, Check, Loader2, ShieldCheck,
  Flag, Sparkles,
  Plane, Laptop, Car, GraduationCap, Home, Shield, Heart, Briefcase, Gift,
} from 'lucide-react'

const TEAL        = '#34d399'
const TEAL_BG     = 'rgba(52,211,153,0.1)'
const TEAL_BORDER = 'rgba(52,211,153,0.28)'

function fmtN(n) { return '₦' + Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 }) }
function fmtDate(d) {
  if (!d) return null
  const date = /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + 'T00:00:00') : new Date(d)
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const CATEGORIES = [
  { id: 'travel',      label: 'Travel',      Icon: Plane },
  { id: 'electronics', label: 'Electronics', Icon: Laptop },
  { id: 'vehicle',     label: 'Vehicle',     Icon: Car },
  { id: 'education',   label: 'Education',   Icon: GraduationCap },
  { id: 'home',        label: 'Home',        Icon: Home },
  { id: 'emergency',   label: 'Emergency',   Icon: Shield },
  { id: 'health',      label: 'Health',      Icon: Heart },
  { id: 'business',    label: 'Business',    Icon: Briefcase },
  { id: 'gift',        label: 'Gift',        Icon: Gift },
  { id: 'other',       label: 'Other',       Icon: Sparkles },
]

export function calcPeriods(startDate, maturityDate, frequency) {
  if (!startDate || !maturityDate) return null
  const s = new Date(startDate)
  const m = new Date(maturityDate)
  if (m <= s) return null
  const days = Math.ceil((m - s) / (1000 * 60 * 60 * 24))
  if (frequency === 'daily')  return days
  if (frequency === 'weekly') return Math.ceil(days / 7)
  const months = (m.getFullYear() - s.getFullYear()) * 12 + (m.getMonth() - s.getMonth())
  return months > 0 ? months : null
}

export default function CreateGoalSheet({ open, product, onClose, onSubmit, submitting, success }) {
  const today = new Date().toISOString().split('T')[0]

  const [step, setStep]                 = useState(1)
  const [name, setName]                 = useState('')
  const [category, setCategory]         = useState('')
  const [goalAmt, setGoalAmt]           = useState('')
  const [frequency, setFrequency]       = useState('monthly')
  const [startDate, setStartDate]       = useState(today)
  const [maturityDate, setMaturityDate] = useState('')
  const [preferredAmt, setPreferredAmt] = useState('')

  const numGoal      = Number(goalAmt.replace(/[^0-9.]/g, '')) || 0
  const numPreferred = Number(preferredAmt.replace(/[^0-9.]/g, '')) || 0
  const apy          = product?.apy || 0

  const periods         = calcPeriods(startDate, maturityDate, frequency)
  const amountPerPeriod = periods && numGoal > 0 ? Math.ceil(numGoal / periods) : null
  const periodLabel     = frequency === 'daily' ? 'day' : frequency === 'weekly' ? 'week' : 'month'

  useEffect(() => {
    if (amountPerPeriod) setPreferredAmt(String(amountPerPeriod))
  }, [amountPerPeriod])

  const step1Valid = name.trim().length > 1 && !!category && numGoal >= 1000
  const step2Valid = !!startDate && !!maturityDate && !!periods && numPreferred >= 100

  function submit() {
    if (!step1Valid || !step2Valid || submitting) return
    onSubmit({
      name: name.trim(), category,
      amount: numPreferred, goal: numGoal, apy,
      contribution: numPreferred,
      frequency,
      startDate:    startDate || null,
      maturityDate: maturityDate || null,
    })
  }

  function handleClose() {
    if (!submitting) { setStep(1); onClose() }
  }

  const sheetLabel = success ? 'Goal created' : `Step ${step} of 2`
  const sheetTitle = success
    ? (product?.name || 'Target Savings')
    : step === 1 ? 'Goal details' : 'Schedule & dates'

  return (
    <BottomSheet open={open} onClose={handleClose} label={sheetLabel} title={sheetTitle} maxHeight="94vh">
      {/* Step indicator */}
      {!success && (
        <div className="flex gap-1.5 px-5 pt-1 pb-3">
          {[1, 2].map(s => (
            <div
              key={s}
              className="h-[3px] flex-1 rounded-full transition-all duration-300"
              style={{ background: s <= step ? TEAL : 'var(--c-border)' }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ── Success ── */}
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
            <h3 className="text-[17px] font-black text-[var(--c-text)] m-0 tracking-[-0.3px]">Goal created!</h3>
            <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 leading-relaxed max-w-[260px]">
              Saving {fmtN(success.principal)}/{success.frequency || 'period'} toward{' '}
              <span className="font-semibold text-[var(--c-text)]">{success.name}</span>
            </p>
            <div className="w-full mt-5 rounded-2xl border border-[var(--c-border-soft)] overflow-hidden" style={{ background: 'var(--c-surface-soft)' }}>
              {[
                { label: 'Goal name',   value: success.name },
                success.category     ? { label: 'Category',   value: success.category }     : null,
                { label: 'Target',      value: fmtN(success.goal) },
                { label: 'Per period',  value: fmtN(success.principal) },
                success.frequency    ? { label: 'Frequency',  value: success.frequency }    : null,
                success.startDate    ? { label: 'Start date', value: success.startDate }    : null,
                success.maturityDate ? { label: 'Matures on', value: success.maturityDate } : null,
                { label: 'Rate',        value: `${success.apy}% p.a.` },
              ].filter(Boolean).map(r => (
                <SheetRow key={r.label} label={r.label} value={r.value} />
              ))}
            </div>
            <button
              type="button" onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-xl font-bold text-[13.5px] mt-5 transition active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
            >
              Done
            </button>
          </motion.div>

        ) : step === 1 ? (
          /* ── Step 1 ── */
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
            className="px-5 pb-10 flex flex-col gap-4"
          >
            <p className="text-[12px] text-[var(--c-text-muted)] m-0 leading-relaxed">
              {product?.desc || 'Save consistently toward a specific goal with automated contributions.'}
            </p>

            {/* Name */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Target name</span>
              <input
                type="text" value={name}
                onChange={e => { const v = e.target.value; setName(v.length ? v[0].toUpperCase() + v.slice(1) : v) }}
                placeholder="e.g. Dream Car, MacBook, Trip to Dubai"
                className="h-[48px] px-4 rounded-xl text-[13px] font-semibold text-[var(--c-text)] outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                style={{ background: 'var(--c-surface-soft)' }}
              />
            </label>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Category</span>
              <div className="grid grid-cols-5 gap-2">
                {CATEGORIES.map(({ id, label, Icon }) => {
                  const active = category === id
                  return (
                    <button
                      key={id} type="button" onClick={() => setCategory(id)}
                      className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 rounded-xl border transition"
                      style={active
                        ? { background: TEAL_BG, borderColor: TEAL_BORDER, color: TEAL }
                        : { background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)', color: 'var(--c-text-muted)' }}
                    >
                      <Icon size={14} strokeWidth={2} />
                      <span className="text-[8.5px] font-bold leading-none">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Goal amount */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Target amount</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--c-text-muted)]">₦</span>
                <input
                  type="text" inputMode="decimal" value={goalAmt} onChange={e => setGoalAmt(e.target.value)}
                  placeholder="1,000,000"
                  className="w-full h-[48px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                  style={{ background: 'var(--c-surface-soft)' }}
                />
              </div>
              <span className="text-[10px] text-[var(--c-text-faint)]">Minimum ₦1,000</span>
            </label>

            <button
              type="button" onClick={() => setStep(2)} disabled={!step1Valid}
              className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-xl font-bold text-[13.5px] mt-1 transition active:scale-[0.99] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
            >
              Continue
            </button>
          </motion.div>

        ) : (
          /* ── Step 2 ── */
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.18 }}
            className="px-5 pb-10 flex flex-col gap-4"
          >
            {/* Back + summary chip */}
            <div className="flex items-center gap-3">
              <button
                type="button" onClick={() => setStep(1)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-xl shrink-0 border border-[var(--c-border)] bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] active:scale-90 transition"
              >
                <ChevronLeft size={15} />
              </button>
              <div
                className="flex-1 flex items-center justify-between gap-2 px-3 py-2 rounded-xl border"
                style={{ background: TEAL_BG, borderColor: TEAL_BORDER }}
              >
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-[1px] font-bold m-0" style={{ color: TEAL }}>{category}</p>
                  <p className="text-[12px] font-black text-[var(--c-text)] m-0 truncate">{name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[9px] text-[var(--c-text-muted)] m-0">Target</p>
                  <p className="text-[12px] font-black text-[var(--c-text)] tabular-nums m-0">{fmtN(numGoal)}</p>
                </div>
              </div>
            </div>

            {/* Frequency */}
            <div className="flex flex-col gap-2">
              <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Frequency</span>
              <div className="grid grid-cols-3 gap-2">
                {['daily', 'weekly', 'monthly'].map(f => (
                  <button
                    key={f} type="button" onClick={() => setFrequency(f)}
                    className="h-[40px] rounded-xl text-[12px] font-bold border transition capitalize"
                    style={frequency === f
                      ? { background: TEAL_BG, borderColor: TEAL_BORDER, color: TEAL }
                      : { background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)', color: 'var(--c-text-muted)' }}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <CalendarPicker value={startDate}    onChange={setStartDate}    label="Start date" />
            <CalendarPicker value={maturityDate} onChange={setMaturityDate} label="Maturity date" />

            {/* Preferred amount */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Preferred amount to save</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--c-text-muted)]">₦</span>
                <input
                  type="text" inputMode="decimal" value={preferredAmt} onChange={e => setPreferredAmt(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-[48px] pl-8 pr-20 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-accent-border-strong)] focus:border-[var(--c-accent-border-strong)] transition"
                  style={{ background: 'var(--c-surface-soft)' }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[var(--c-text-muted)]">
                  / {periodLabel}
                </span>
              </div>
              <AnimatePresence>
                {periods && (
                  <motion.span
                    key={periods}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[10px] text-[var(--c-text-faint)] flex items-center gap-1"
                  >
                    <Flag size={9} style={{ color: TEAL }} />
                    Suggested {fmtN(amountPerPeriod)} · {periods} {periodLabel}{periods !== 1 ? 's' : ''} to reach {fmtN(numGoal)}
                  </motion.span>
                )}
              </AnimatePresence>
            </label>

            <button
              type="button" onClick={submit} disabled={!step2Valid || submitting}
              className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-xl font-bold text-[13.5px] mt-1 transition active:scale-[0.99] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
            >
              {submitting
                ? <><Loader2 size={15} className="animate-spin" /> Creating goal…</>
                : <><Target size={15} strokeWidth={2.2} /> Create goal</>
              }
            </button>
            <p className="inline-flex items-center gap-1.5 text-[10px] text-[var(--c-text-faint)] justify-center m-0">
              <ShieldCheck size={11} className="text-brand-accent" /> First contribution debited from your wallet balance
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </BottomSheet>
  )
}
