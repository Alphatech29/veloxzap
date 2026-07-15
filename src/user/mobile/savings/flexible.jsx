import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BottomSheet, { SheetRow } from '../../../components/internalUI/BottomSheet'
import { useAlert } from '../../../components/ui/Alert'
import { useSavingsOverview, useSavingsAccount, useSavingsLedger, useSavingsWithdrawals } from '../../../hooks/useSavings'
import { topUpAccount } from '../../../services/savings'
import { fmtDate, fmtDateOnly } from '../../../utils/format'
import { DEBIT_TIME_OPTIONS, fmtDebitTime, FREQUENCY_OPTIONS } from '../../../utils/savingsSchedule'
import {
  ChevronDown, Wallet, Plus, Check, Loader2, ShieldCheck,
  ArrowUpRight, ArrowDownLeft, Coins, X,
  Sparkles, TrendingUp,
  Repeat, Pause, Play, Pencil, Clock, Settings,
  History, Receipt, AlertTriangle,
} from 'lucide-react'
import MobilePageHeader from '../../../components/partials/MobilePageHeader'

function fmt(n) { return Number(n || 0).toLocaleString('en-NG') }
function fmtN(n) { return '₦' + fmt(Math.round(n || 0)) }

const FLEX = '#60a5fa'
const FLEX_BG = 'rgba(96,165,250,0.1)'
const FLEX_BORDER = 'rgba(96,165,250,0.28)'

const FREQUENCY_LABEL = Object.fromEntries(FREQUENCY_OPTIONS.map(o => [o.value, o.label]))

/* ── Mapper ────────────────────────────────── */

function mapFlexible(a) {
  const principal = Number(a.principal || 0)
  const interestEarned = Number(a.total_interest_earned || 0)
  const accruedInterest = Number(a.accrued_interest || 0)
  const apy = Number(a.apy_at_creation ?? 0)
  const dailyEarning = principal > 0 && apy > 0 ? (principal * apy) / 100 / 365 : 0
  const openedDate = a.created_at ? fmtDate(a.created_at) : null
  const daysActive = a.created_at
    ? Math.max(0, Math.floor((Date.now() - new Date(a.created_at).getTime()) / 86400000))
    : null

  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const nextWithdrawalDate = a.next_withdrawal_date || null
  const withdrawalEligible = !nextWithdrawalDate || nextWithdrawalDate <= todayStr

  return {
    id: a.id,
    name: a.name || 'Flexible savings',
    principal, interestEarned, accruedInterest, apy, dailyEarning,
    openedDate, daysActive,
    status: a.status,
    frequency: a.schedule_frequency || null,
    debitTime: a.schedule_debit_time || null,
    scheduleStatus: a.schedule_status || null,
    nextDebitDate: a.schedule_next_debit_date || null,
    topupAmount: a.schedule_contribution_amount != null ? Number(a.schedule_contribution_amount) : null,
    nextWithdrawalDate,
    withdrawalEligible,
  }
}

/* ── Time of day dropdown ──────────────────── */

function TimeOfDaySelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const ref = useRef(null)
  const selected = DEBIT_TIME_OPTIONS.find(o => o.value === value) || DEBIT_TIME_OPTIONS[0]

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
      const panelHeight = Math.min(224, DEBIT_TIME_OPTIONS.length * 40) + 6
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
        className="w-full h-[48px] pl-2 pr-4 rounded-xl text-[13px] font-bold text-[var(--c-text)] outline-none border transition flex items-center justify-between gap-2 active:scale-[0.99]"
        style={{ background: 'var(--c-surface-soft)', borderColor: open ? 'var(--c-accent-border-strong)' : 'var(--c-border)' }}
      >
        <span className="inline-flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ background: FLEX_BG, color: FLEX }}>
            <Clock size={14} strokeWidth={2.2} />
          </span>
          {selected.label}
        </span>
        <ChevronDown
          size={15} strokeWidth={2.4}
          className="transition-transform duration-200 shrink-0"
          style={{ color: FLEX, transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
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
            className={`absolute left-0 right-0 z-30 rounded-xl border overflow-hidden max-h-[224px] overflow-y-auto ${dropUp ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]'}`}
            style={{ background: 'var(--c-surface)', borderColor: FLEX_BORDER, boxShadow: '0 16px 40px -12px rgba(2,7,23,0.45)' }}
          >
            {DEBIT_TIME_OPTIONS.map(opt => {
              const active = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-[12.5px] font-bold transition"
                  style={active ? { background: FLEX_BG, color: FLEX } : { color: 'var(--c-text)' }}
                >
                  {opt.label}
                  {active && <Check size={14} strokeWidth={2.6} style={{ color: FLEX }} />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Auto top-up details row ──────────────────────────── */

function AutoTopupDetailsRow({ activePlan, scheduling, onPauseResume, onEdit }) {
  return (
    <div className="relative flex items-center justify-between gap-2 px-4 py-3 border-t border-white/[0.07] flex-wrap">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0 border" style={{ background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}>
          <Repeat size={13} strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-white m-0 truncate">
            {fmtN(activePlan.topupAmount)} · {FREQUENCY_LABEL[activePlan.frequency]} · {fmtDebitTime(activePlan.debitTime)}
          </p>
          <p className="text-[9px] text-white/50 m-0 mt-0.5">
            {activePlan.scheduleStatus === 'active'
              ? `Next top-up ${fmtDateOnly(activePlan.nextDebitDate)}`
              : 'Auto top-up paused'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className="px-2 py-1 rounded-full text-[8.5px] font-bold uppercase tracking-[0.6px] border"
          style={activePlan.scheduleStatus === 'active'
            ? { background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }
            : { background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
        >
          {activePlan.scheduleStatus === 'active' ? 'Active' : 'Paused'}
        </span>
        <button
          type="button" onClick={onPauseResume} disabled={scheduling}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/15 text-white bg-white/5 transition active:scale-95 disabled:opacity-60"
          title={activePlan.scheduleStatus === 'active' ? 'Pause auto top-up' : 'Resume auto top-up'}
        >
          {scheduling
            ? <Loader2 size={12} className="animate-spin" />
            : activePlan.scheduleStatus === 'active' ? <Pause size={12} strokeWidth={2.5} /> : <Play size={12} strokeWidth={2.5} />}
        </button>
        <button
          type="button" onClick={onEdit}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/15 text-white bg-white/5 transition active:scale-95"
          title="Edit schedule"
        >
          <Pencil size={12} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

/* ── Create sheet ──────────────────────────── */

function CreateSheet({ open, product, onClose, onSubmit, submitting, success }) {
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

  function handleClose() {
    if (submitting) return
    setAmount('')
    setAutoTopup(false)
    setTopupAmount('')
    setFrequency('monthly')
    setDebitTime('08:00')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={handleClose} label="New plan" title={product?.name || 'Flexible Savings'} maxHeight="88vh">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 flex flex-col items-center text-center py-8">
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ background: 'var(--c-success-bg)', color: 'var(--c-success)' }}
            >
              <Check size={28} strokeWidth={2.6} />
            </motion.span>
            <h3 className="text-[17px] font-black text-[var(--c-text)] m-0 tracking-[-0.3px]">Plan created</h3>
            <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 leading-relaxed max-w-[260px]">
              {fmtN(success.principal)} saved in{' '}
              <span className="font-semibold text-[var(--c-text)]">{success.name}</span>
              {' '}— earning daily interest
            </p>
            <div className="w-full mt-5 rounded-2xl border border-[var(--c-border-soft)] overflow-hidden divide-y divide-[var(--c-border-soft)]" style={{ background: 'var(--c-surface-soft)' }}>
              <SheetRow label="Plan name"      value={success.name} />
              <SheetRow label="Balance"        value={fmtN(success.principal)} bold />
              <SheetRow label="Rate"           value={`${success.apy}% p.a.`} />
              <SheetRow label="Daily earnings" value={`~${fmtN(success.dailyEarning)}`} accent />
              {success.schedule && (
                <SheetRow
                  label="Auto top-up"
                  value={`${fmtN(success.schedule.amount)} · ${FREQUENCY_LABEL[success.schedule.frequency]} · ${fmtDebitTime(success.schedule.debitTime)}`}
                />
              )}
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
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-2 pb-8 flex flex-col gap-4">
            <p className="text-[12px] text-[var(--c-text-muted)] m-0 leading-relaxed">
              {product?.desc || 'Save flexibly with no lock-in. Withdraw anytime, interest credited daily.'}
            </p>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Opening deposit</span>
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
                        <TimeOfDaySelect value={debitTime} onChange={setDebitTime} />
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
              type="button" onClick={submit} disabled={!valid || !scheduleValid || submitting}
              className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-xl font-bold text-[13.5px] mt-1 transition active:scale-[0.99] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
            >
              {submitting
                ? <><Loader2 size={15} className="animate-spin" /> Creating…</>
                : <><Wallet size={15} strokeWidth={2.2} /> Start saving</>
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

/* ── Top-up sheet ──────────────────────────── */

function TopUpSheet({ open, plan, onClose, onSuccess, minDeposit }) {
  const { alert } = useAlert()
  const [amount, setAmount] = useState('')
  const [topping, setTopping] = useState(false)

  const n = s => Number(s.replace(/[^0-9.]/g, '')) || 0
  const numAmount = n(amount)
  const valid = numAmount >= (minDeposit || 1000)

  async function handleTopUp() {
    if (!valid || topping) return
    setTopping(true)
    const r = await topUpAccount(plan.id, { amount: numAmount })
    setTopping(false)
    if (r.success) {
      alert({ type: 'success', title: 'Top-up successful', message: `${fmtN(numAmount)} added to ${plan.name}` })
      setAmount('')
      onClose()
      onSuccess?.()
    } else {
      alert({ type: 'error', title: 'Top-up failed', message: r.message || 'Could not process top-up.' })
    }
  }

  return (
    <BottomSheet open={open} onClose={() => { if (!topping) { setAmount(''); onClose() } }} label="Top up" title={plan?.name || 'Add funds'} maxHeight="60vh">
      <div className="px-5 pt-2 pb-8 flex flex-col gap-4">
        <p className="text-[12px] text-[var(--c-text-muted)] m-0">Add more funds to your {plan?.name || '---'} plan.</p>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Amount to add</span>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--c-text-muted)]">₦</span>
            <input
              type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-[48px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
              style={{ background: 'var(--c-surface-soft)' }}
              autoFocus
            />
          </div>
          <span className="text-[10px] text-[var(--c-text-faint)]">Minimum {fmtN(minDeposit || 1000)}</span>
        </label>

        <button
          type="button" onClick={handleTopUp} disabled={!valid || topping}
          className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-xl font-bold text-[13.5px] transition active:scale-[0.99] disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
        >
          {topping
            ? <><Loader2 size={15} className="animate-spin" /> Adding…</>
            : <><ArrowDownLeft size={15} strokeWidth={2.2} /> Add funds</>
          }
        </button>
      </div>
    </BottomSheet>
  )
}

/* ── Withdraw sheet ────────────────────────── */

function WithdrawSheet({ open, plan, onClose, onConfirm, withdrawing }) {
  return (
    <BottomSheet open={open} onClose={() => !withdrawing && onClose()} label="Withdraw" title={plan?.name || 'Flexible savings'} maxHeight="60vh">
      <div className="px-5 pt-2 pb-8 flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl border" style={{ background: FLEX_BG, borderColor: FLEX_BORDER }}>
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0" style={{ background: 'rgba(96,165,250,0.15)', color: FLEX }}>
            <Wallet size={18} strokeWidth={2} />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-[1px] font-bold m-0" style={{ color: FLEX }}>Available balance</p>
            <p className="text-[18px] font-black text-[var(--c-text)] m-0 tabular-nums tracking-[-0.4px]">{fmtN(plan?.principal)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--c-border-soft)] overflow-hidden divide-y divide-[var(--c-border-soft)]" style={{ background: 'var(--c-surface-soft)' }}>
          <SheetRow label="interest" value={fmtN(plan?.accruedInterest)} accent />
          <SheetRow label="Status" value="Pending approval" muted />
        </div>

        <button
          type="button" onClick={onConfirm} disabled={withdrawing}
          className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-xl font-bold text-[13.5px] transition active:scale-[0.99] disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
        >
          {withdrawing
            ? <><Loader2 size={15} className="animate-spin" /> Processing…</>
            : <><ArrowUpRight size={15} strokeWidth={2.2} /> Confirm withdrawal</>
          }
        </button>
        <p className="inline-flex items-center gap-1.5 text-[10px] text-[var(--c-text-faint)] justify-center m-0">
          <ShieldCheck size={11} className="text-brand-accent" /> Funds returned to your wallet
        </p>
      </div>
    </BottomSheet>
  )
}

/* ── Edit schedule sheet ───────────────────── */

function EditScheduleSheet({ open, plan, onClose, onSubmit, submitting }) {
  const isNew = !plan?.scheduleStatus
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState('monthly')
  const [debitTime, setDebitTime] = useState('08:00')

  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setAmount(String(plan?.topupAmount || ''))
      setFrequency(plan?.frequency || 'monthly')
      setDebitTime(plan?.debitTime ? plan.debitTime.slice(0, 5) : '08:00')
    }
  }

  const n = s => Number(s.replace(/[^0-9.]/g, '')) || 0
  const numAmount = n(amount)
  const valid = numAmount > 0

  function submit() {
    if (!valid || submitting) return
    onSubmit({ contribution_amount: numAmount, frequency, debit_time: debitTime })
  }

  return (
    <BottomSheet
      open={open}
      onClose={() => !submitting && onClose()}
      label={isNew ? 'Set up auto top-up' : 'Edit schedule'}
      title={plan?.name || 'Auto top-up'}
      maxHeight="80vh"
    >
      <div className="px-5 pt-2 pb-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Auto-Top-up amount</span>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--c-text-muted)]">₦</span>
            <input
              type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-[48px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
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
                className="h-[40px] rounded-lg text-[11px] font-bold border transition"
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
          <TimeOfDaySelect value={debitTime} onChange={setDebitTime} />
        </label>

        <button
          type="button" onClick={submit} disabled={!valid || submitting}
          className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-xl font-bold text-[13.5px] transition active:scale-[0.99] disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
        >
          {submitting
            ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
            : <><Check size={15} strokeWidth={2.2} /> {isNew ? 'Enable auto top-up' : 'Save changes'}</>
          }
        </button>
      </div>
    </BottomSheet>
  )
}

/* ── Transaction history ───────────────────── */

const LEDGER_META = {
  deposit:         { label: 'Initial deposit',          icon: ArrowDownLeft, sign: '+' },
  top_up:          { label: 'Top-up',                   icon: ArrowDownLeft, sign: '+' },
  interest_credit: { label: 'Interest credited',        icon: Sparkles,      sign: '+' },
  maturity_payout: { label: 'Maturity payout',          icon: Check,         sign: '+' },
  withdrawal:      { label: 'Withdrawal',               icon: ArrowUpRight,  sign: '-' },
  auto_debit:      { label: 'Auto-debit',               icon: ArrowUpRight,  sign: '-' },
  auto_topup:      { label: 'Auto save',              icon: ArrowDownLeft, sign: '+' },
  penalty:         { label: 'Early withdrawal penalty', icon: AlertTriangle, sign: '-' },
}

function LedgerRow({ entry }) {
  const meta = LEDGER_META[entry.type] || { label: entry.type, icon: Coins, sign: '' }
  const Icon = meta.icon
  const isCredit = meta.sign === '+'

  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span
        className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0 border"
        style={{
          background: isCredit ? FLEX_BG : 'var(--c-surface-soft)',
          borderColor: isCredit ? FLEX_BORDER : 'var(--c-border-soft)',
          color: isCredit ? FLEX : 'var(--c-text-muted)',
        }}
      >
        <Icon size={14} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-bold text-[var(--c-text)] m-0 truncate">{entry.description || meta.label}</p>
        <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">{fmtDate(entry.created_at)}</p>
      </div>
      <span className="text-[12.5px] font-black tabular-nums shrink-0" style={{ color: isCredit ? FLEX : 'var(--c-text)' }}>
        {meta.sign}{fmtN(entry.amount)}
      </span>
    </div>
  )
}

/* ── Page ──────────────────────────────────── */

export default function MobileFlexibleSavings() {
  const navigate = useNavigate()
  const { alert } = useAlert()
  const { plans: rawProducts, investments, creating, create, refresh } = useSavingsOverview()

  const [showSheet, setShowSheet]     = useState(false)
  const [topUpPlan, setTopUpPlan]     = useState(null)
  const [withdrawPlan, setWithdrawPlan] = useState(null)
  const [editSchedulePlan, setEditSchedulePlan] = useState(null)
  const [success, setSuccess]         = useState(null)
  const [withdrawing, setWithdrawing] = useState(false)
  const [showAutoTopupInfo, setShowAutoTopupInfo] = useState(false)

  const flexPlans = useMemo(() =>
    investments.filter(a => (a.product_type || a.type) === 'flexible').map(mapFlexible),
    [investments]
  )

  const activePlan = flexPlans[0] || null
  const { pauseSchedule, resumeSchedule, updateSchedule, createSchedule, scheduling, withdraw } = useSavingsAccount(activePlan?.id)
  const { ledger, loading: ledgerLoading, refresh: refreshLedger } = useSavingsLedger('flexible')
  const { withdrawals: pendingWithdrawals } = useSavingsWithdrawals('pending')

  const hasPendingWithdrawal = useMemo(
    () => pendingWithdrawals.some(w => w.plan_id === activePlan?.id),
    [pendingWithdrawals, activePlan]
  )
  const withdrawDisabled = activePlan?.status === 'completed' || hasPendingWithdrawal

  const flexProduct = useMemo(() => {
    const p = rawProducts.find(r => r.type === 'flexible')
    if (!p) return null
    return { id: p.id, type: p.type, name: p.name, desc: p.description, apy: p.annualRate, minDeposit: p.minDeposit }
  }, [rawProducts])

  const totalBalance  = useMemo(() => flexPlans.reduce((s, p) => s + p.principal, 0), [flexPlans])
  const totalAccrued  = useMemo(() => flexPlans.reduce((s, p) => s + p.accruedInterest, 0), [flexPlans])
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

  async function handlePauseResume(plan) {
    if (!plan) return
    const r = plan.scheduleStatus === 'active' ? await pauseSchedule() : await resumeSchedule()
    if (r.success) {
      refresh()
    } else {
      alert({ type: 'error', title: 'Action failed', message: r.message || 'Could not update schedule status.' })
    }
  }

  async function handleUpdateSchedule(payload) {
    const isNew = !activePlan?.scheduleStatus
    const r = isNew ? await createSchedule(payload) : await updateSchedule(payload)
    if (r.success) {
      alert({
        type: 'success',
        title: isNew ? 'Auto top-up enabled' : 'Schedule updated',
        message: isNew ? 'Your auto top-up schedule has been set up.' : 'Your auto top-up schedule has been updated.',
      })
      setEditSchedulePlan(null)
      refresh()
    } else {
      alert({
        type: 'error',
        title: isNew ? 'Setup failed' : 'Update failed',
        message: r.message || (isNew ? 'Could not set up auto top-up. Please try again.' : 'Could not update schedule. Please try again.'),
      })
    }
  }

  async function handleWithdraw() {
    if (!withdrawPlan) return
    setWithdrawing(true)
    const r = await withdraw({ amount_requested: withdrawPlan.principal + withdrawPlan.interestEarned })
    setWithdrawing(false)
    if (r.success) {
      setWithdrawPlan(null)
      alert({ type: 'success', title: 'Withdrawal requested', message: 'Your withdrawal request is now being processed.' })
      refreshLedger()
    } else {
      alert({ type: 'error', title: 'Withdrawal failed', message: r.message || 'Could not process withdrawal. Please try again.' })
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--c-bg)' }}>

      <MobilePageHeader
        title={flexProduct?.name || 'Flexible Savings'}
        onBack={() => navigate('/user/savings')}
      />

      <div className="flex flex-col gap-4 py-4 pb-24">

        {/* Hero */}
        <article
          className="relative overflow-hidden rounded-[22px] border shadow-[0_16px_40px_-12px_rgba(2,7,23,0.55)]"
          style={{ background: 'linear-gradient(140deg,#0d2657 0%,#091a3a 60%,#040e24 100%)', borderColor: FLEX_BORDER }}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(96,165,250,0.14)' }} />
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.6),transparent)' }} />

          <div className="relative p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[1.4px] font-bold" style={{ color: FLEX }}>
                <Wallet size={8} /> {flexProduct?.name} balance
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {flexProduct && (
                  <span className="px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.6px]" style={{ background: FLEX_BG, border: `1px solid ${FLEX_BORDER}`, color: FLEX }}>
                    {flexProduct.apy}% APY
                  </span>
                )}
                {activePlan?.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => activePlan.scheduleStatus ? setShowAutoTopupInfo(v => !v) : setEditSchedulePlan(activePlan)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg border transition active:scale-95"
                    style={showAutoTopupInfo && activePlan.scheduleStatus
                      ? { background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }
                      : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
                    title={activePlan.scheduleStatus ? 'Auto top-up details' : 'Set up auto top-up'}
                  >
                    <Settings size={12} strokeWidth={2.5} className={`transition-transform duration-300 ${showAutoTopupInfo && activePlan.scheduleStatus ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] text-white/50 m-0">Total saved</p>
                <span className="text-[26px] font-black tracking-[-1px] text-white leading-none tabular-nums block mt-0.5">{fmtN(totalBalance)}</span>
              </div>
              <div className="flex items-end gap-3 shrink-0">

                <div className="text-right pb-0.5">
                  <p className="text-[10px] text-white/50 m-0">Interest</p>
                  <span className="text-[15px] font-black tabular-nums block mt-0.5" style={{ color: FLEX }}>+{fmtN(totalAccrued)}</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-white/45 m-0 mt-2">
              {activeCount} active · ~{fmtN(totalDaily)} / day
            </p>
          </div>

          {activePlan?.nextWithdrawalDate && activePlan?.status !== 'completed' && (
            <div className="relative flex items-center justify-between gap-2 px-4 py-3 border-t border-white/[0.07] flex-wrap">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0 border"
                  style={activePlan.withdrawalEligible
                    ? { background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }
                    : { background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}
                >
                  {activePlan.withdrawalEligible ? <ShieldCheck size={13} strokeWidth={2.2} /> : <Clock size={13} strokeWidth={2.2} />}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white m-0 truncate">
                    {activePlan.withdrawalEligible ? 'Fee-free withdrawal available' : 'Next fee-free withdrawal'}
                  </p>
                  <p className="text-[9px] text-white/50 m-0 mt-0.5">
                    {activePlan.withdrawalEligible
                      ? 'Withdraw now without an early fee'
                      : `Early fee applies until ${fmtDateOnly(activePlan.nextWithdrawalDate)}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {activePlan?.scheduleStatus && showAutoTopupInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <AutoTopupDetailsRow
                  activePlan={activePlan}
                  scheduling={scheduling}
                  onPauseResume={() => handlePauseResume(activePlan)}
                  onEdit={() => setEditSchedulePlan(activePlan)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {activePlan && activePlan.status !== 'completed' && (
            <div className="relative flex items-center gap-2 px-4 py-3.5 border-t border-white/[0.07]">
              <button
                type="button" onClick={() => setTopUpPlan(activePlan)} disabled={hasPendingWithdrawal}
                title={hasPendingWithdrawal ? 'A withdrawal request is already pending for this plan' : undefined}
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl font-bold text-[11px] border transition active:scale-95 disabled:opacity-60"
                style={{ background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}
              >
                <ArrowDownLeft size={12} strokeWidth={2.5} /> Top up
              </button>
              <button
                type="button" onClick={() => setWithdrawPlan(activePlan)} disabled={withdrawDisabled}
                title={hasPendingWithdrawal ? 'A withdrawal request is already pending for this plan' : undefined}
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl font-bold text-[11px] border border-white/15 text-white bg-white/5 transition active:scale-95 disabled:opacity-60"
              >
                <ArrowUpRight size={12} strokeWidth={2.5} /> {hasPendingWithdrawal ? 'Withdrawal pending' : 'Withdraw'}
              </button>
            </div>
          )}
        </article>

        {/* Empty state */}
        {(flexPlans.length === 0 || activePlan?.status === 'completed') && (
          <div className="flex flex-col items-center text-center pt-6 pb-6 px-4 rounded-2xl border border-[var(--c-border)]" style={{ background: 'var(--c-surface)' }}>

            {/* Icon visual */}
            <div className="relative mb-3">
              <div className="absolute inset-0 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(96,165,250,0.14)', transform: 'scale(1.5)' }} />
              <span
                className="relative inline-flex items-center justify-center w-16 h-16 rounded-[22px] border-2"
                style={{ background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}
              >
                <Wallet size={28} strokeWidth={1.6} />
              </span>
              <span
                className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 rounded-full border-2"
                style={{ background: 'var(--c-surface)', borderColor: 'var(--c-surface)' }}
              >
                <span className="inline-flex items-center justify-center w-full h-full rounded-full" style={{ background: 'rgba(96,165,250,0.18)', color: FLEX }}>
                  <Sparkles size={10} strokeWidth={2.4} />
                </span>
              </span>
            </div>

            <h3 className="text-[15px] font-black text-[var(--c-text)] m-0 tracking-[-0.3px]">
              {flexPlans.length === 0 ? 'No plans yet' : `Start a new ${flexProduct?.name || 'plan'}`}
            </h3>
            <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-1 max-w-[210px] leading-relaxed">
              {flexPlans.length === 0
                ? 'No lock-in — top up or withdraw anytime, with daily interest.'
                : 'Your plan has completed. Open a new one to keep earning daily interest.'}
            </p>

            {/* Daily interest preview */}
            <div
              className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border mt-4 w-full"
              style={{ background: FLEX_BG, borderColor: FLEX_BORDER }}
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0" style={{ background: 'rgba(96,165,250,0.15)', color: FLEX }}>
                <TrendingUp size={16} strokeWidth={2} />
              </span>
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-[1px] font-bold m-0" style={{ color: FLEX }}>
                  {flexProduct ? `${flexProduct.apy}% p.a.` : 'Daily interest'}
                </p>
                <p className="text-[12px] font-black text-[var(--c-text)] m-0 mt-0.5">
                  Interest credited every single day
                </p>
              </div>
            </div>

            {/* Feature rows */}
            <div className="w-full mt-2.5 rounded-xl border border-[var(--c-border-soft)] overflow-hidden" style={{ background: 'var(--c-surface-soft)' }}>
              {[
                { icon: ArrowDownLeft, label: 'Top up anytime',        sub: 'Add funds whenever you want' },
                { icon: ArrowUpRight,  label: 'Withdraw anytime',      sub: 'Pending approval, fee-free after 30 days' },
                { icon: Repeat,        label: 'Auto top-up',           sub: 'Schedule recurring deposits' },
              ].map(({ icon: Icon, label, sub }, i) => (
                <div key={label} className={`flex items-center gap-2.5 px-3.5 py-2.5 ${i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}`}>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ background: FLEX_BG, color: FLEX }}>
                    <Icon size={13} strokeWidth={2.2} />
                  </span>
                  <div className="text-left">
                    <p className="text-[12px] font-bold text-[var(--c-text)] m-0">{label}</p>
                    <p className="text-[10px] text-[var(--c-text-muted)] m-0">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => { setShowSheet(true); setSuccess(null) }}
              className="inline-flex items-center justify-center gap-2 w-full h-[46px] rounded-xl font-bold text-[13px] mt-4 transition active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 10px 28px -8px rgba(201,162,39,0.55)' }}
            >
              <Plus size={14} strokeWidth={2.6} /> {flexPlans.length === 0 ? 'Start saving now' : 'Start saving now'}
            </button>
          </div>
        )}

        {/* Transaction history */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2 className="inline-flex items-center gap-1.5 text-[13px] font-black m-0 text-[var(--c-text)] tracking-[-0.2px]">
              <History size={13} style={{ color: FLEX }} /> Transaction history
            </h2>
          </div>

          {!activePlan ? (
            <div className="flex flex-col items-center text-center py-12 px-4 rounded-[18px] border border-[var(--c-border)]" style={{ background: 'var(--c-surface)' }}>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3 border" style={{ background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}>
                <Receipt size={20} strokeWidth={1.8} />
              </span>
              <h3 className="text-[13px] font-black text-[var(--c-text)] m-0">No transactions yet</h3>
              <p className="text-[11.5px] text-[var(--c-text-muted)] m-0 mt-1.5 max-w-[260px] leading-relaxed">
                Open a flexible plan to start saving — your deposits, withdrawals and interest will show up here.
              </p>
            </div>
          ) : ledgerLoading ? (
            <div className="flex items-center justify-center py-12 rounded-[18px] border border-[var(--c-border)]" style={{ background: 'var(--c-surface)' }}>
              <Loader2 size={18} className="animate-spin text-[var(--c-text-muted)]" />
            </div>
          ) : ledger.length === 0 ? (
            <div className="flex flex-col items-center text-center py-12 px-4 rounded-[18px] border border-[var(--c-border)]" style={{ background: 'var(--c-surface)' }}>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3 border" style={{ background: FLEX_BG, borderColor: FLEX_BORDER, color: FLEX }}>
                <Receipt size={20} strokeWidth={1.8} />
              </span>
              <h3 className="text-[13px] font-black text-[var(--c-text)] m-0">No activity yet</h3>
              <p className="text-[11.5px] text-[var(--c-text-muted)] m-0 mt-1.5 max-w-[260px] leading-relaxed">
                Deposits, withdrawals and interest for your flexible plans will appear here.
              </p>
            </div>
          ) : (
            <div className="rounded-[18px] border border-[var(--c-border)] divide-y divide-[var(--c-border-soft)] overflow-hidden" style={{ background: 'var(--c-surface)' }}>
              {ledger.map(entry => <LedgerRow key={entry.id} entry={entry} />)}
            </div>
          )}
        </section>
      </div>

      {/* Sheets */}
      <CreateSheet
        open={showSheet}
        product={flexProduct}
        onClose={() => { setShowSheet(false); setSuccess(null) }}
        onSubmit={handleCreate}
        submitting={creating}
        success={success}
      />
      <TopUpSheet
        open={topUpPlan !== null}
        plan={topUpPlan}
        onClose={() => setTopUpPlan(null)}
        onSuccess={refreshLedger}
        minDeposit={flexProduct?.minDeposit || 1000}
      />
      <WithdrawSheet
        open={withdrawPlan !== null}
        plan={withdrawPlan}
        onClose={() => setWithdrawPlan(null)}
        onConfirm={handleWithdraw}
        withdrawing={withdrawing}
      />
      <EditScheduleSheet
        open={editSchedulePlan !== null}
        plan={editSchedulePlan}
        onClose={() => setEditSchedulePlan(null)}
        onSubmit={handleUpdateSchedule}
        submitting={scheduling}
      />
    </div>
  )
}
