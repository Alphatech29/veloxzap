import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAlert } from '../../../components/ui/Alert'
import { useSavingsOverview, useSavingsAccount } from '../../../hooks/useSavings'
import { topUpAccount } from '../../../lib/savings'
import {
  Wallet, Plus, Check, X, Loader2, ShieldCheck, TrendingUp,
  ArrowUpRight, ArrowDownLeft, Coins, ChevronLeft,
  Sparkles, AlertTriangle, Receipt, History,
  Repeat, Pause, Play, Pencil,
} from 'lucide-react'

function fmt(n) { return Number(n || 0).toLocaleString('en-NG') }
function fmtN(n) { return '₦' + fmt(Math.round(n || 0)) }
function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}
function fmtDateTime(d) {
  return new Date(d).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const FLEX = '#60a5fa'
const FLEX_BG = 'rgba(96,165,250,0.1)'
const FLEX_BORDER = 'rgba(96,165,250,0.28)'

const DEBIT_TIME_OPTIONS = [
  { value: '06:00', label: '6:00 AM' },
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '21:00', label: '9:00 PM' },
  { value: '22:00', label: '10:00 PM' },
]
function fmtDebitTime(t) {
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}
const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]
const FREQUENCY_LABEL = Object.fromEntries(FREQUENCY_OPTIONS.map(o => [o.value, o.label]))

/* ── Mapper ────────────────────────────────── */

function mapFlexible(a) {
  const principal = Number(a.principal || 0)
  const interestEarned = Number(a.total_interest_earned || 0)
  const apy = Number(a.apy_at_creation ?? 0)
  const dailyRate = apy > 0 ? (apy / 365).toFixed(4) : null
  const dailyEarning = principal > 0 && apy > 0 ? (principal * apy) / 100 / 365 : 0
  const openedDate = a.created_at ? fmtDate(a.created_at) : null
  const daysActive = a.created_at
    ? Math.max(0, Math.floor((Date.now() - new Date(a.created_at).getTime()) / 86400000))
    : null

  return {
    id: a.id,
    name: a.name || 'Flexible savings',
    principal, interestEarned, apy, dailyRate, dailyEarning,
    openedDate, daysActive,
    status: a.status,
    frequency: a.schedule_frequency || null,
    debitTime: a.schedule_debit_time || null,
    scheduleStatus: a.schedule_status || null,
    nextDebitDate: a.schedule_next_debit_date || null,
    topupAmount: a.schedule_contribution_amount != null ? Number(a.schedule_contribution_amount) : null,
  }
}

/* ── Create modal ──────────────────────────── */

function CreateModal({ product, onClose, onSubmit, submitting, success }) {
  const [amount, setAmount] = useState('')
  const [autoTopup, setAutoTopup] = useState(false)
  const [topupAmount, setTopupAmount] = useState('')
  const [frequency, setFrequency] = useState('monthly')
  const [debitTime, setDebitTime] = useState('08:00')

  const n = s => Number(s.replace(/[^0-9.]/g, '')) || 0
  const numAmount = n(amount)
  const numTopup = n(topupAmount)
  const minDeposit = product?.minDeposit || 1000
  const valid = numAmount >= minDeposit
  const scheduleValid = !autoTopup || numTopup > 0
  const apy = product?.apy || 0
  const dailyEarning = valid ? (numAmount * apy) / 100 / 365 : 0
  const monthlyEarning = dailyEarning * 30
  const yearlyEarning = valid ? (numAmount * apy) / 100 : 0
  const planName = product?.name || 'Flexible savings'

  function submit() {
    if (!valid || !scheduleValid || submitting) return
    onSubmit({
      name: planName,
      amount: numAmount,
      ...(autoTopup && numTopup > 0 ? { contribution_amount: numTopup, frequency, debit_time: debitTime } : {}),
    })
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
          className="relative w-full max-w-[420px] max-h-[88vh] overflow-y-auto rounded-[24px] border border-[var(--c-border)] pointer-events-auto"
          style={{ background: 'var(--c-surface)', boxShadow: '0 32px 80px -16px rgba(2,7,23,0.5)' }}
        >
          <div
            className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-5 border-b border-[var(--c-border-soft)]"
            style={{ background: 'var(--c-surface)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl shrink-0 border" style={{ background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}>
                <Wallet size={18} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="text-[9.5px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">New plan</p>
                <h2 className="text-[16px] font-black text-[var(--c-text)] m-0 truncate tracking-[-0.3px]">{product?.name || 'Flexible Savings'}</h2>
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
                <h3 className="text-[17px] font-black text-[var(--c-text)] m-0 tracking-[-0.3px]">Plan created</h3>
                <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 max-w-[280px] leading-relaxed">
                  {fmtN(success.principal)} saved in{' '}
                  <span className="font-semibold text-[var(--c-text)]">{success.name}</span>
                  {' '}— earning daily interest
                </p>
                <div className="w-full mt-6 rounded-2xl border border-[var(--c-border-soft)] overflow-hidden" style={{ background: 'var(--c-surface-soft)' }}>
                  {[
                    { label: 'Plan name',      value: success.name },
                    { label: 'Opening balance', value: fmtN(success.principal) },
                    { label: 'Rate',           value: `${success.apy}% p.a.` },
                    { label: 'Daily earnings', value: `~${fmtN(success.dailyEarning)}`, highlight: true },
                    ...(success.schedule
                      ? [{ label: 'Auto top-up', value: `${fmtN(success.schedule.amount)} · ${FREQUENCY_LABEL[success.schedule.frequency]} · ${fmtDebitTime(success.schedule.debitTime)}` }]
                      : []),
                  ].map((r, i) => (
                    <div key={r.label} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}`}>
                      <span className="text-[11px] text-[var(--c-text-muted)] font-medium">{r.label}</span>
                      <span className="text-[12.5px] font-bold tabular-nums" style={{ color: r.highlight ? FLEX : 'var(--c-text)' }}>{r.value}</span>
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
                  {product?.desc || 'Save flexibly with no lock-in period. Withdraw anytime, interest credited daily.'}
                </p>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Opening deposit</span>
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

                <div className="rounded-xl border p-3" style={{ background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)' }}>
                  <button
                    type="button" onClick={() => setAutoTopup(v => !v)}
                    className="flex items-center justify-between w-full gap-3"
                  >
                    <span className="flex items-center gap-2 text-left">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ background: FLEX_BG, color: FLEX }}>
                        <Repeat size={14} strokeWidth={2.2} />
                      </span>
                      <span>
                        <span className="block text-[12px] font-bold text-[var(--c-text)]">Set up automatic top-ups</span>
                        <span className="block text-[10px] text-[var(--c-text-muted)] mt-0.5">Recurring deposits from your wallet</span>
                      </span>
                    </span>
                    <span
                      className="relative inline-flex items-center w-10 h-6 rounded-full transition shrink-0"
                      style={{ background: autoTopup ? FLEX : 'var(--c-border)' }}
                    >
                      <span
                        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                        style={{ transform: autoTopup ? 'translateX(16px)' : 'translateX(0)' }}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {autoTopup && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-3 pt-3 mt-3 border-t border-[var(--c-border-soft)]">
                          <label className="flex flex-col gap-1.5">
                            <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Top-up amount</span>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--c-text-muted)]">₦</span>
                              <input
                                type="text" inputMode="decimal" value={topupAmount} onChange={e => setTopupAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full h-[44px] pl-8 pr-4 rounded-xl text-[13.5px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                                style={{ background: 'var(--c-surface)' }}
                              />
                            </div>
                          </label>

                          <label className="flex flex-col gap-1.5">
                            <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Frequency</span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {FREQUENCY_OPTIONS.map(opt => (
                                <button
                                  key={opt.value} type="button" onClick={() => setFrequency(opt.value)}
                                  className="h-[36px] rounded-lg text-[11px] font-bold border transition"
                                  style={frequency === opt.value
                                    ? { background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }
                                    : { background: 'var(--c-surface)', borderColor: 'var(--c-border)', color: 'var(--c-text-muted)' }}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </label>

                          <label className="flex flex-col gap-1.5">
                            <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Time of day</span>
                            <select
                              value={debitTime} onChange={e => setDebitTime(e.target.value)}
                              className="w-full h-[44px] px-4 rounded-xl text-[13px] font-bold text-[var(--c-text)] outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition appearance-none"
                              style={{ background: 'var(--c-surface)' }}
                            >
                              {DEBIT_TIME_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {dailyEarning > 0 && (
                  <div className="rounded-xl border p-2.5" style={{ background: FLEX_BG, borderColor: FLEX_BORDER }}>
                    <p className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[1px] font-bold m-0 mb-1.5" style={{ color: FLEX }}>
                      <Sparkles size={10} strokeWidth={2.2} /> Estimated interest
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: 'Daily',   value: dailyEarning },
                        { label: 'Monthly', value: monthlyEarning },
                        { label: 'Yearly',  value: yearlyEarning },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex flex-col gap-0.5 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(96,165,250,0.12)' }}>
                          <span className="text-[8px] uppercase tracking-[0.6px] font-bold text-[var(--c-text-faint)]">{label}</span>
                          <span className="text-[11px] font-black tabular-nums text-[var(--c-text)] leading-tight">~{fmtN(value)}</span>
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
                    ? <><Loader2 size={15} className="animate-spin" /> Creating…</>
                    : <><Wallet size={15} strokeWidth={2.2} /> Start saving</>
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

/* ── Top-up modal ──────────────────────────── */

function TopUpModal({ plan, minDeposit, onClose, onSubmit, submitting }) {
  const [amount, setAmount] = useState('')

  const n = s => Number(s.replace(/[^0-9.]/g, '')) || 0
  const numAmount = n(amount)
  const valid = numAmount >= (minDeposit || 1000)

  function submit() {
    if (!valid || submitting) return
    onSubmit(numAmount)
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
          className="relative w-full max-w-[380px] rounded-[24px] border border-[var(--c-border)] pointer-events-auto"
          style={{ background: 'var(--c-surface)', boxShadow: '0 32px 80px -16px rgba(2,7,23,0.5)' }}
        >
          <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-[var(--c-border-soft)]">
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl shrink-0 border" style={{ background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}>
                <ArrowDownLeft size={18} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="text-[9.5px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">Top up</p>
                <h2 className="text-[16px] font-black text-[var(--c-text)] m-0 truncate tracking-[-0.3px]">{plan?.name}</h2>
              </div>
            </div>
            {!submitting && (
              <button type="button" onClick={onClose} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="px-6 py-5 flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Amount</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--c-text-muted)]">₦</span>
                <input
                  type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0.00" autoFocus
                  className="w-full h-[46px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                  style={{ background: 'var(--c-surface-soft)' }}
                />
              </div>
              <span className="text-[10px] text-[var(--c-text-faint)]">Minimum {fmtN(minDeposit)}</span>
            </label>

            <button
              type="button" onClick={submit} disabled={!valid || submitting}
              className="inline-flex items-center justify-center gap-2 w-full h-[48px] rounded-xl font-bold text-[13.5px] transition hover:-translate-y-px active:scale-[0.99] disabled:opacity-50 disabled:hover:translate-y-0"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
            >
              {submitting
                ? <><Loader2 size={15} className="animate-spin" /> Processing…</>
                : <><ArrowDownLeft size={15} strokeWidth={2.2} /> Add funds</>
              }
            </button>
            <p className="inline-flex items-center gap-1.5 text-[10px] text-[var(--c-text-faint)] justify-center m-0">
              <ShieldCheck size={11} className="text-brand-accent" /> Amount debited from your wallet balance
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}

/* ── Edit schedule modal ───────────────────── */

function EditScheduleModal({ plan, onClose, onSubmit, submitting }) {
  const [amount, setAmount] = useState(String(plan?.topupAmount || ''))
  const [frequency, setFrequency] = useState(plan?.frequency || 'monthly')
  const [debitTime, setDebitTime] = useState(plan?.debitTime ? plan.debitTime.slice(0, 5) : '08:00')

  const n = s => Number(s.replace(/[^0-9.]/g, '')) || 0
  const numAmount = n(amount)
  const valid = numAmount > 0

  function submit() {
    if (!valid || submitting) return
    onSubmit({ contribution_amount: numAmount, frequency, debit_time: debitTime })
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
          className="relative w-full max-w-[380px] rounded-[24px] border border-[var(--c-border)] pointer-events-auto"
          style={{ background: 'var(--c-surface)', boxShadow: '0 32px 80px -16px rgba(2,7,23,0.5)' }}
        >
          <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-[var(--c-border-soft)]">
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl shrink-0 border" style={{ background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}>
                <Repeat size={18} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="text-[9.5px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">Edit schedule</p>
                <h2 className="text-[16px] font-black text-[var(--c-text)] m-0 truncate tracking-[-0.3px]">{plan?.name}</h2>
              </div>
            </div>
            {!submitting && (
              <button type="button" onClick={onClose} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="px-6 py-5 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Top-up amount</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--c-text-muted)]">₦</span>
                <input
                  type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0.00" autoFocus
                  className="w-full h-[46px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                  style={{ background: 'var(--c-surface-soft)' }}
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Frequency</span>
              <div className="grid grid-cols-3 gap-1.5">
                {FREQUENCY_OPTIONS.map(opt => (
                  <button
                    key={opt.value} type="button" onClick={() => setFrequency(opt.value)}
                    className="h-[38px] rounded-lg text-[11px] font-bold border transition"
                    style={frequency === opt.value
                      ? { background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }
                      : { background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)', color: 'var(--c-text-muted)' }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Time of day</span>
              <select
                value={debitTime} onChange={e => setDebitTime(e.target.value)}
                className="w-full h-[46px] px-4 rounded-xl text-[13px] font-bold text-[var(--c-text)] outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition appearance-none"
                style={{ background: 'var(--c-surface-soft)' }}
              >
                {DEBIT_TIME_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>

            <button
              type="button" onClick={submit} disabled={!valid || submitting}
              className="inline-flex items-center justify-center gap-2 w-full h-[48px] rounded-xl font-bold text-[13.5px] transition hover:-translate-y-px active:scale-[0.99] disabled:opacity-50 disabled:hover:translate-y-0"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
            >
              {submitting
                ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
                : <><Check size={15} strokeWidth={2.2} /> Save changes</>
              }
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

/* ── Transaction history ───────────────────── */

const LEDGER_META = {
  deposit:         { label: 'Initial deposit',          icon: ArrowDownLeft, sign: '+' },
  top_up:          { label: 'Manuel Top-up',                   icon: ArrowDownLeft, sign: '+' },
  interest_credit: { label: 'Interest credited',        icon: Sparkles,      sign: '+' },
  withdrawal:      { label: 'Withdrawal',               icon: ArrowUpRight,  sign: '-' },
  auto_topup:      { label: 'Auto top-up',              icon: ArrowDownLeft, sign: '+' },
  penalty:         { label: 'Early withdrawal penalty', icon: AlertTriangle, sign: '-' },
}

function LedgerRow({ entry }) {
  const meta = LEDGER_META[entry.type] || { label: entry.type, icon: Coins, sign: '' }
  const Icon = meta.icon
  const isCredit = meta.sign === '+'

  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <span
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0 border"
        style={{
          background: isCredit ? FLEX_BG : 'var(--c-surface-soft)',
          borderColor: isCredit ? FLEX_BORDER : 'var(--c-border-soft)',
          color: isCredit ? FLEX : 'var(--c-text-muted)',
        }}
      >
        <Icon size={15} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0 truncate">{entry.description || meta.label}</p>
        <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">{fmtDateTime(entry.created_at)}</p>
      </div>
      <span className="text-[13px] font-black tabular-nums shrink-0" style={{ color: isCredit ? FLEX : 'var(--c-text)' }}>
        {meta.sign}{fmtN(entry.amount)}
      </span>
    </div>
  )
}

/* ── Page ──────────────────────────────────── */

export default function DesktopFlexibleSavings() {
  const { alert, confirm } = useAlert()
  const { plans: rawProducts, investments, creating, create, withdraw, refresh } = useSavingsOverview()

  const [showModal, setShowModal]       = useState(false)
  const [success, setSuccess]           = useState(null)
  const [withdrawingId, setWithdrawingId] = useState(null)
  const [topUpOpen, setTopUpOpen]       = useState(false)
  const [topping, setTopping]           = useState(false)
  const [editScheduleOpen, setEditScheduleOpen] = useState(false)

  const flexPlans = useMemo(() =>
    investments.filter(a => (a.product_type || a.type) === 'flexible').map(mapFlexible),
    [investments]
  )

  const flexProduct = useMemo(() => {
    const p = rawProducts.find(r => r.type === 'flexible')
    if (!p) return null
    return { id: p.id, type: p.type, name: p.name, desc: p.description, apy: p.annualRate, minDeposit: p.minDeposit }
  }, [rawProducts])

  const activePlan = flexPlans[0] || null
  const { ledger, ledgerLoading, refreshLedger, pauseSchedule, resumeSchedule, updateSchedule, scheduling } = useSavingsAccount(activePlan?.id)

  const totalBalance  = useMemo(() => flexPlans.reduce((s, p) => s + p.principal, 0), [flexPlans])
  const totalInterest = useMemo(() => flexPlans.reduce((s, p) => s + p.interestEarned, 0), [flexPlans])
  const totalDaily    = useMemo(() => flexPlans.reduce((s, p) => s + p.dailyEarning, 0), [flexPlans])
  const activeCount   = flexPlans.filter(p => p.status === 'active').length

  async function handleCreate(payload) {
    if (!flexProduct) return
    const hasSchedule = !!payload.contribution_amount
    const r = await create({
      product_id: flexProduct.id,
      name: payload.name,
      initial_amount: payload.amount,
      ...(hasSchedule ? {
        contribution_amount: payload.contribution_amount,
        frequency: payload.frequency,
        debit_time: payload.debit_time,
      } : {}),
    })
    if (r.success) {
      const apy = flexProduct.apy || 0
      setSuccess({
        name: payload.name,
        principal: payload.amount,
        apy,
        dailyEarning: (payload.amount * apy) / 100 / 365,
        ...(hasSchedule ? {
          schedule: { amount: payload.contribution_amount, frequency: payload.frequency, debitTime: payload.debit_time },
        } : {}),
      })
      alert({ type: 'success', title: 'Plan created', message: `${payload.name} is now earning daily interest` })
    } else {
      alert({ type: 'error', title: 'Could not create plan', message: r.message || 'Something went wrong.' })
    }
  }

  async function handlePauseResume() {
    if (!activePlan) return
    const r = activePlan.scheduleStatus === 'active' ? await pauseSchedule() : await resumeSchedule()
    if (r.success) {
      refresh()
    } else {
      alert({ type: 'error', title: 'Action failed', message: r.message || 'Could not update schedule status.' })
    }
  }

  async function handleUpdateSchedule(payload) {
    const r = await updateSchedule(payload)
    if (r.success) {
      alert({ type: 'success', title: 'Schedule updated', message: 'Your auto top-up schedule has been updated.' })
      setEditScheduleOpen(false)
      refresh()
    } else {
      alert({ type: 'error', title: 'Update failed', message: r.message || 'Could not update schedule. Please try again.' })
    }
  }

  async function handleWithdraw(id) {
    setWithdrawingId(id)
    const r = await withdraw(id)
    setWithdrawingId(null)
    if (r.success) {
      alert({ type: 'success', title: 'Withdrawal requested', message: 'Your request is pending admin approval.' })
      refreshLedger()
    } else {
      alert({ type: 'error', title: 'Withdrawal failed', message: 'Could not process withdrawal. Please try again.' })
    }
  }

  async function handleWithdrawClick() {
    if (!activePlan) return
    const ok = await confirm({
      type: 'warning',
      title: 'Withdraw funds?',
      message: `${fmtN(activePlan.principal)} will be withdrawn from "${activePlan.name}". This requires admin approval.`,
      confirmLabel: 'Withdraw',
      danger: true,
    })
    if (!ok) return
    handleWithdraw(activePlan.id)
  }

  async function handleTopUp(amount) {
    if (!activePlan) return
    setTopping(true)
    const r = await topUpAccount(activePlan.id, { amount })
    setTopping(false)
    if (r.success) {
      alert({ type: 'success', title: 'Top-up successful', message: `${fmtN(amount)} added to ${activePlan.name}` })
      setTopUpOpen(false)
      refresh()
      refreshLedger()
    } else {
      alert({ type: 'error', title: 'Top-up failed', message: 'Could not process top-up. Please try again.' })
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
            <Wallet size={10} /> Flexible savings
          </p>
          <h1 className="text-[22px] font-black tracking-[-0.5px] text-[var(--c-text)] m-0 mt-1">Your flexible plans</h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Earn {flexProduct ? `${flexProduct.apy}%` : 'daily'} interest · withdraw anytime · no lock-in
          </p>
        </div>
      </header>

      {/* Hero */}
      <article
        className="relative overflow-hidden rounded-[24px] border shadow-[0_24px_60px_-20px_rgba(2,7,23,0.6)]"
        style={{ background: 'linear-gradient(140deg,#0d2657 0%,#091a3a 55%,#040e24 100%)', borderColor: FLEX_BORDER }}
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(96,165,250,0.14)' }} />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(96,165,250,0.08)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(96,165,250,0.2) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.6),transparent)' }} />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-[1.5px] font-bold" style={{ color: FLEX }}>
              <Wallet size={9} /> Total flexible balance
            </span>
            {flexProduct && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.6px]" style={{ background: FLEX_BG, border: `1px solid ${FLEX_BORDER}`, color: FLEX }}>
                {flexProduct.apy}% APY
              </span>
            )}
          </div>

          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] text-white/50 m-0">Total saved</p>
              <span className="text-[32px] font-black tracking-[-1.5px] text-white leading-none tabular-nums block mt-0.5">{fmtN(totalBalance)}</span>
            </div>
            <div className="text-right pb-0.5">
              <p className="text-[11px] text-white/50 m-0">Interest earned</p>
              <span className="text-[18px] font-black tabular-nums block mt-0.5" style={{ color: FLEX }}>+{fmtN(totalInterest)}</span>
            </div>
          </div>

          <p className="text-[11px] text-white/50 m-0 mt-3">
            {activeCount} active plan{activeCount !== 1 ? 's' : ''} · earning ~{fmtN(totalDaily)} / day
          </p>
        </div>

        {activePlan?.scheduleStatus && (
          <div className="relative flex items-center justify-between gap-3 px-5 py-3.5 border-t border-white/[0.07] flex-wrap">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0 border" style={{ background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}>
                <Repeat size={14} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="text-[11.5px] font-bold text-white m-0 truncate">
                  {fmtN(activePlan.topupAmount)} · {FREQUENCY_LABEL[activePlan.frequency]} · {fmtDebitTime(activePlan.debitTime)}
                </p>
                <p className="text-[10px] text-white/50 m-0 mt-0.5">
                  {activePlan.scheduleStatus === 'active'
                    ? `Next top-up ${fmtDate(activePlan.nextDebitDate)}`
                    : 'Auto top-up paused'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className="px-2.5 py-1 rounded-full text-[9.5px] font-bold uppercase tracking-[0.6px] border"
                style={activePlan.scheduleStatus === 'active'
                  ? { background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }
                  : { background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
              >
                {activePlan.scheduleStatus === 'active' ? 'Active' : 'Paused'}
              </span>
              <button
                type="button" onClick={handlePauseResume} disabled={scheduling}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/15 text-white bg-white/5 transition hover:bg-white/10 active:scale-95 disabled:opacity-60"
                title={activePlan.scheduleStatus === 'active' ? 'Pause auto top-up' : 'Resume auto top-up'}
              >
                {scheduling
                  ? <Loader2 size={12} className="animate-spin" />
                  : activePlan.scheduleStatus === 'active' ? <Pause size={12} strokeWidth={2.5} /> : <Play size={12} strokeWidth={2.5} />}
              </button>
              <button
                type="button" onClick={() => setEditScheduleOpen(true)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/15 text-white bg-white/5 transition hover:bg-white/10 active:scale-95"
                title="Edit schedule"
              >
                <Pencil size={12} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {activePlan && (
          <div className="relative flex items-center gap-2.5 px-5 py-4 border-t border-white/[0.07]">
            <button
              type="button" onClick={() => setTopUpOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl font-bold text-[11.5px] border transition active:scale-95"
              style={{ background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}
            >
              <ArrowDownLeft size={12} strokeWidth={2.5} /> Top up
            </button>
            <button
              type="button" onClick={handleWithdrawClick} disabled={withdrawingId === activePlan.id}
              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl font-bold text-[11.5px] border border-white/15 text-white bg-white/5 transition hover:bg-white/10 active:scale-95 disabled:opacity-60"
            >
              {withdrawingId === activePlan.id ? <Loader2 size={12} className="animate-spin" /> : <><ArrowUpRight size={12} strokeWidth={2.5} /> Withdraw</>}
            </button>
          </div>
        )}
      </article>

      {/* Get started */}
      {flexPlans.length === 0 && (
        <section
          className="flex items-center justify-between gap-4 flex-wrap p-5 rounded-[20px] border border-[var(--c-border)]"
          style={{ background: 'var(--c-surface)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl shrink-0 border" style={{ background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}>
              <Wallet size={20} strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <h3 className="text-[14px] font-black text-[var(--c-text)] m-0 tracking-[-0.2px]">Start your first flexible plan</h3>
              <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
                No lock-in — top up or withdraw anytime, with daily interest.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setShowModal(true); setSuccess(null) }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[12.5px] transition hover:-translate-y-px active:scale-[0.98] shrink-0"
            style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
          >
            <Plus size={14} strokeWidth={2.6} /> New plan
          </button>
        </section>
      )}

      {/* Transaction history */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h2 className="inline-flex items-center gap-2 text-[14px] font-black m-0 text-[var(--c-text)] tracking-[-0.2px]">
            <History size={14} style={{ color: FLEX }} /> Transaction history
          </h2>
        </div>

        {!activePlan ? (
          <div className="flex flex-col items-center text-center py-16 px-4 rounded-[20px] border border-[var(--c-border)]" style={{ background: 'var(--c-surface)' }}>
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 border" style={{ background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}>
              <Receipt size={24} strokeWidth={1.8} />
            </span>
            <h3 className="text-[14px] font-black text-[var(--c-text)] m-0">No transactions yet</h3>
            <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1.5 max-w-[280px] leading-relaxed">
              Open a flexible plan to start saving — your deposits, withdrawals and interest will show up here.
            </p>
          </div>
        ) : ledgerLoading ? (
          <div className="flex items-center justify-center py-16 rounded-[20px] border border-[var(--c-border)]" style={{ background: 'var(--c-surface)' }}>
            <Loader2 size={20} className="animate-spin text-[var(--c-text-muted)]" />
          </div>
        ) : ledger.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16 px-4 rounded-[20px] border border-[var(--c-border)]" style={{ background: 'var(--c-surface)' }}>
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 border" style={{ background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}>
              <Receipt size={24} strokeWidth={1.8} />
            </span>
            <h3 className="text-[14px] font-black text-[var(--c-text)] m-0">No activity yet</h3>
            <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1.5 max-w-[280px] leading-relaxed">
              Deposits, withdrawals and interest for {activePlan.name} will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-[20px] border border-[var(--c-border)] divide-y divide-[var(--c-border-soft)] overflow-hidden" style={{ background: 'var(--c-surface)' }}>
            {ledger.map(entry => <LedgerRow key={entry.id} entry={entry} />)}
          </div>
        )}
      </section>

      {/* Modals */}
      <AnimatePresence>
        {showModal && flexProduct && (
          <CreateModal
            product={flexProduct}
            onClose={() => { setShowModal(false); setSuccess(null) }}
            onSubmit={handleCreate}
            submitting={creating}
            success={success}
          />
        )}
        {topUpOpen && activePlan && (
          <TopUpModal
            plan={activePlan}
            minDeposit={flexProduct?.minDeposit || 1000}
            onClose={() => setTopUpOpen(false)}
            onSubmit={handleTopUp}
            submitting={topping}
          />
        )}
        {editScheduleOpen && activePlan && (
          <EditScheduleModal
            plan={activePlan}
            onClose={() => setEditScheduleOpen(false)}
            onSubmit={handleUpdateSchedule}
            submitting={scheduling}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
