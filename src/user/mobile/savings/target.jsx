import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BottomSheet, { SheetRow } from '../../../components/internalUI/BottomSheet'
import { useAlert } from '../../../components/ui/Alert'
import { useSavingsOverview } from '../../../hooks/useSavings'
import { setScheduleStatus } from '../../../lib/savings'
import {
  ChevronLeft, Target, Plus, Check, Loader2, ShieldCheck,
  ArrowUpRight, Pause, Play, Flag, Percent, Coins, Zap, X,
} from 'lucide-react'

function fmt(n) { return Number(n || 0).toLocaleString('en-NG') }
function fmtN(n) { return '₦' + fmt(Math.round(n || 0)) }

const TEAL = '#34d399'
const TEAL_BG = 'rgba(52,211,153,0.1)'
const TEAL_BORDER = 'rgba(52,211,153,0.28)'

/* ── Circle ring ─────────────────────────────────────────── */

function CircleRing({ pct = 0, size = 72, stroke = 7 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const done = pct >= 100
  const color = done ? '#C9A227' : TEAL
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
        {done
          ? <Check size={16} strokeWidth={3} style={{ color: '#C9A227' }} />
          : <>
              <span className="text-[12px] font-black leading-none tabular-nums" style={{ color }}>{pct}%</span>
              <span className="text-[7px] font-bold text-[var(--c-text-faint)] mt-0.5">done</span>
            </>
        }
      </div>
    </div>
  )
}

/* ── Mapper ───────────────────────────────────────────────── */

function mapGoal(a) {
  const principal = Number(a.principal || 0)
  const goal = a.goal_amount != null ? Number(a.goal_amount) : null
  const progress = goal > 0 ? Math.min(100, Math.round((principal / goal) * 100)) : 0
  const remaining = goal != null ? Math.max(0, goal - principal) : null
  return {
    id: a.id,
    name: a.name || 'Target savings',
    principal,
    goal,
    progress,
    remaining,
    interestEarned: Number(a.total_interest_earned || 0),
    apy: Number(a.apy_at_creation ?? 0),
    status: a.status,
    isCompleted: a.status === 'completed' || progress >= 100,
    frequency: a.frequency || null,
    scheduleStatus: a.schedule_status || null,
  }
}

/* ── Create goal sheet ────────────────────────────────────── */

function CreateGoalSheet({ open, product, onClose, onSubmit, submitting, success }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [goalAmt, setGoalAmt] = useState('')
  const [contrib, setContrib] = useState('')
  const [frequency, setFrequency] = useState('weekly')

  const n = s => Number(s.replace(/[^0-9.]/g, '')) || 0
  const numAmount  = n(amount)
  const numGoal    = n(goalAmt)
  const numContrib = n(contrib)
  const apy = product?.apy || 0

  const valid = numAmount >= 1000 && name.trim().length > 1 && numGoal > numAmount && numContrib > 0
  const weeksToGoal = numContrib > 0 && numGoal > numAmount
    ? Math.ceil((numGoal - numAmount) / numContrib)
    : null

  function submit() {
    if (!valid || submitting) return
    onSubmit({ name: name.trim(), amount: numAmount, goal: numGoal, contribution: numContrib, frequency, apy })
  }

  function handleClose() {
    if (!submitting) onClose()
  }

  return (
    <BottomSheet open={open} onClose={handleClose} label="New goal" title={product?.name || 'Target Savings'} maxHeight="92vh">
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
            <h3 className="text-[17px] font-black text-[var(--c-text)] m-0 tracking-[-0.3px]">Goal created</h3>
            <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 leading-relaxed max-w-[260px]">
              {fmtN(success.principal)} invested in{' '}
              <span className="font-semibold text-[var(--c-text)]">{success.name}</span>
            </p>

            <div className="w-full mt-5 rounded-2xl border border-[var(--c-border-soft)] overflow-hidden divide-y divide-[var(--c-border-soft)]" style={{ background: 'var(--c-surface-soft)' }}>
              <SheetRow label="Goal name"     value={success.name} />
              <SheetRow label="Starting with" value={fmtN(success.principal)} bold />
              <SheetRow label="Target"        value={fmtN(success.goal)} />
              <SheetRow label="Contribution"  value={success.contrib} />
              <SheetRow label="Rate"          value={`${success.apy}% p.a.`} accent />
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
              {product?.desc || 'Save consistently toward a specific goal with automated contributions.'}
            </p>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Goal name</span>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Dream Car, MacBook, Trip to Dubai"
                className="h-[48px] px-4 rounded-xl text-[13px] font-semibold text-[var(--c-text)] outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                style={{ background: 'var(--c-surface-soft)' }}
              />
            </label>

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
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Starting amount</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--c-text-muted)]">₦</span>
                <input
                  type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-[48px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                  style={{ background: 'var(--c-surface-soft)' }}
                />
              </div>
              <span className="text-[10px] text-[var(--c-text-faint)]">Minimum ₦1,000</span>
            </label>

            <div className="grid grid-cols-[1fr_110px] gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Auto contribution</span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--c-text-muted)]">₦</span>
                  <input
                    type="text" inputMode="decimal" value={contrib} onChange={e => setContrib(e.target.value)}
                    placeholder="20,000"
                    className="w-full h-[48px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                    style={{ background: 'var(--c-surface-soft)' }}
                  />
                </div>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Frequency</span>
                <select
                  value={frequency} onChange={e => setFrequency(e.target.value)}
                  className="h-[48px] px-3 rounded-xl text-[12.5px] font-semibold text-[var(--c-text)] outline-none border border-[var(--c-border)] appearance-none transition focus:border-[var(--c-accent-border-strong)]"
                  style={{ background: 'var(--c-surface-soft)' }}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </label>
            </div>

            {weeksToGoal && (
              <div
                className="flex items-center gap-3 p-3.5 rounded-2xl border"
                style={{ background: TEAL_BG, borderColor: TEAL_BORDER }}
              >
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                  style={{ background: 'rgba(52,211,153,0.15)', color: TEAL }}
                >
                  <Flag size={15} strokeWidth={2.2} />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[1px] font-bold m-0" style={{ color: TEAL }}>
                    Estimated time to goal
                  </p>
                  <p className="text-[14px] font-black text-[var(--c-text)] m-0 mt-0.5 tabular-nums tracking-[-0.3px]">
                    {weeksToGoal} {frequency === 'weekly' ? 'week' : 'month'}{weeksToGoal !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}

            <button
              type="button" onClick={submit} disabled={!valid || submitting}
              className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-xl font-bold text-[13.5px] mt-1 transition active:scale-[0.99] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
            >
              {submitting
                ? <><Loader2 size={15} className="animate-spin" /> Creating goal…</>
                : <><Target size={15} strokeWidth={2.2} /> Create goal</>
              }
            </button>
            <p className="inline-flex items-center gap-1.5 text-[10px] text-[var(--c-text-faint)] justify-center m-0">
              <ShieldCheck size={11} className="text-brand-accent" /> Starting amount debited from your wallet
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </BottomSheet>
  )
}

/* ── Withdraw sheet ───────────────────────────────────────── */

function WithdrawSheet({ open, goal, onClose, onConfirm, withdrawing }) {
  return (
    <BottomSheet open={open} onClose={() => !withdrawing && onClose()} label="Withdraw" title={goal?.name || 'Target savings'} maxHeight="60vh">
      <div className="px-5 pt-2 pb-8 flex flex-col gap-4">
        <div className="rounded-2xl border border-[var(--c-border-soft)] overflow-hidden divide-y divide-[var(--c-border-soft)]" style={{ background: 'var(--c-surface-soft)' }}>
          <SheetRow label="Saved so far"    value={fmtN(goal?.principal)} bold />
          <SheetRow label="Interest earned" value={fmtN(goal?.interestEarned)} accent />
          {goal?.goal != null && <SheetRow label="Target amount" value={fmtN(goal.goal)} muted />}
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

/* ── Goal card ────────────────────────────────────────────── */

function GoalCard({ goal, onWithdraw, scheduling, onPause, onResume }) {
  const isPaused   = goal.scheduleStatus === 'paused'
  const { isCompleted } = goal

  return (
    <div
      className="rounded-[18px] border border-[var(--c-border)] overflow-hidden"
      style={{ background: 'var(--c-surface)' }}
    >
      <div
        className="h-[3px] w-full"
        style={{
          background: isCompleted
            ? 'linear-gradient(90deg,#C9A227,#f0d060)'
            : `linear-gradient(90deg,${TEAL},rgba(52,211,153,0.35))`,
        }}
      />

      <div className="p-4">
        {/* Name + status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3 className="text-[13.5px] font-black text-[var(--c-text)] m-0 truncate tracking-[-0.2px]">{goal.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {isCompleted ? (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[0.8px]"
                  style={{ background: 'rgba(201,162,39,0.12)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)' }}
                >
                  <Check size={7} strokeWidth={3} /> Completed
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[0.8px]"
                  style={{ background: TEAL_BG, color: TEAL, border: `1px solid ${TEAL_BORDER}` }}
                >
                  <Zap size={7} strokeWidth={3} /> Active
                </span>
              )}
              {goal.apy > 0 && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold tabular-nums"
                  style={{ background: 'var(--c-accent-soft)', color: 'var(--c-accent)', border: '1px solid var(--c-accent-border)' }}
                >
                  <Percent size={7} /> {goal.apy}%
                </span>
              )}
              {isPaused && !isCompleted && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold"
                  style={{ background: 'rgba(251,146,60,0.1)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)' }}
                >
                  <Pause size={7} strokeWidth={2.5} /> Paused
                </span>
              )}
            </div>
          </div>
          <CircleRing pct={goal.progress} />
        </div>

        {/* Amount row */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] text-[var(--c-text-muted)] m-0">Saved</p>
            <p className="text-[17px] font-black text-[var(--c-text)] m-0 tabular-nums tracking-[-0.4px] leading-tight">
              {fmtN(goal.principal)}
            </p>
          </div>
          {goal.goal != null && (
            <div className="text-right">
              <p className="text-[10px] text-[var(--c-text-muted)] m-0">Target</p>
              <p className="text-[13px] font-bold text-[var(--c-text-muted)] m-0 tabular-nums">{fmtN(goal.goal)}</p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div
          className="relative w-full h-1.5 rounded-full overflow-hidden mb-1"
          style={{ background: 'var(--c-border-soft)' }}
        >
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${goal.progress}%` }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: isCompleted
                ? 'linear-gradient(90deg,#C9A227,#f0d060)'
                : `linear-gradient(90deg,${TEAL},rgba(52,211,153,0.7))`,
            }}
          />
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-[var(--c-text-faint)]">
            {goal.remaining != null ? `${fmtN(goal.remaining)} to go` : '—'}
          </span>
          <span className="text-[10px] font-semibold" style={{ color: TEAL }}>
            +{fmtN(goal.interestEarned)} earned
          </span>
        </div>

        {/* Actions */}
        {!isCompleted && (
          <div className="flex items-center gap-2 pt-3 border-t border-[var(--c-border-soft)]">
            {goal.frequency && (
              <button
                type="button"
                onClick={() => isPaused ? onResume(goal.id) : onPause(goal.id)}
                disabled={scheduling}
                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl font-bold text-[11px] border transition active:scale-95 disabled:opacity-60"
                style={isPaused
                  ? { background: TEAL_BG, borderColor: TEAL_BORDER, color: TEAL }
                  : { background: 'rgba(251,146,60,0.08)', borderColor: 'rgba(251,146,60,0.25)', color: '#fb923c' }
                }
              >
                {scheduling
                  ? <Loader2 size={11} className="animate-spin" />
                  : isPaused
                    ? <><Play size={10} strokeWidth={2.5} /> Resume</>
                    : <><Pause size={10} strokeWidth={2.5} /> Pause</>
                }
              </button>
            )}
            <button
              type="button"
              onClick={() => onWithdraw(goal)}
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl font-bold text-[11px] border border-[var(--c-border)] text-[var(--c-text-muted)] bg-[var(--c-surface-soft)] transition active:scale-95 ml-auto"
            >
              <ArrowUpRight size={11} strokeWidth={2.5} /> Withdraw
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────── */

export default function MobileTargetSavings() {
  const navigate = useNavigate()
  const { alert } = useAlert()
  const { plans: rawProducts, investments, creating, create, withdraw, refresh } = useSavingsOverview()

  const [showSheet, setShowSheet]       = useState(false)
  const [success, setSuccess]           = useState(null)
  const [schedulingId, setSchedulingId] = useState(null)
  const [withdrawGoal, setWithdrawGoal] = useState(null)
  const [withdrawing, setWithdrawing]   = useState(false)

  const targetGoals = useMemo(() =>
    investments.filter(a => (a.product_type || a.type) === 'target').map(mapGoal),
    [investments]
  )

  const targetProduct = useMemo(() => {
    const p = rawProducts.find(r => r.type === 'target')
    if (!p) return null
    return { id: p.id, type: p.type, name: p.name, apy: p.annualRate, desc: p.description }
  }, [rawProducts])

  const totalSaved    = useMemo(() => targetGoals.reduce((s, g) => s + g.principal, 0), [targetGoals])
  const totalGoal     = useMemo(() => targetGoals.reduce((s, g) => s + (g.goal || 0), 0), [targetGoals])
  const totalInterest = useMemo(() => targetGoals.reduce((s, g) => s + g.interestEarned, 0), [targetGoals])
  const overallPct    = totalGoal > 0 ? Math.min(100, Math.round((totalSaved / totalGoal) * 100)) : 0
  const activeGoals    = targetGoals.filter(g => !g.isCompleted)
  const completedGoals = targetGoals.filter(g => g.isCompleted)

  async function handleCreate(payload) {
    if (!targetProduct) return
    const r = await create({
      product_id: targetProduct.id,
      name: payload.name,
      initial_amount: payload.amount,
      goal_amount: payload.goal,
      contribution_amount: payload.contribution,
      frequency: payload.frequency,
    })
    if (r.success) {
      setSuccess({
        name: payload.name,
        principal: payload.amount,
        goal: payload.goal,
        apy: payload.apy,
        contrib: `${fmtN(payload.contribution)} ${payload.frequency}`,
      })
      alert({ type: 'success', title: 'Goal created', message: `${payload.name} is now active` })
    } else {
      alert({ type: 'error', title: 'Could not create goal', message: r.message || 'Something went wrong.' })
    }
  }

  async function handleWithdraw() {
    if (!withdrawGoal) return
    setWithdrawing(true)
    const r = await withdraw(withdrawGoal.id)
    setWithdrawing(false)
    if (r.success) {
      setWithdrawGoal(null)
      alert({ type: 'success', title: 'Withdrawal requested', message: 'Pending admin approval.' })
    } else {
      alert({ type: 'error', title: 'Withdrawal failed', message: 'Could not process withdrawal. Please try again.' })
    }
  }

  async function handlePause(id) {
    setSchedulingId(id)
    const r = await setScheduleStatus(id, 'pause')
    setSchedulingId(null)
    if (r.success) { refresh(); alert({ type: 'success', title: 'Schedule paused', message: 'Auto-debit paused.' }) }
    else alert({ type: 'error', title: 'Could not pause', message: r.message || 'Failed to pause.' })
  }

  async function handleResume(id) {
    setSchedulingId(id)
    const r = await setScheduleStatus(id, 'resume')
    setSchedulingId(null)
    if (r.success) { refresh(); alert({ type: 'success', title: 'Schedule resumed', message: 'Auto-debit resumed.' }) }
    else alert({ type: 'error', title: 'Could not resume', message: r.message || 'Failed to resume.' })
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--c-bg)' }}>

      {/* Top bar */}
      <div
        className="flex items-center justify-between gap-3  pt-4 pb-3 border-b border-[var(--c-border-soft)] sticky top-0 z-10"
        style={{ background: 'var(--c-bg)' }}
      >
        <button
          type="button" onClick={() => navigate('/user/savings')}
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-soft)] text-[var(--c-text)] active:scale-90 transition"
        >
          <ChevronLeft size={17} />
        </button>
        <div className="text-center flex-1 min-w-0">
          <p className="text-[9px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">Target savings</p>
          <h1 className="text-[15px] font-black text-[var(--c-text)] m-0 tracking-[-0.3px]">Your goals</h1>
        </div>
        <button
          type="button"
          onClick={() => { setShowSheet(true); setSuccess(null) }}
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl transition active:scale-90"
          style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', boxShadow: '0 4px 14px rgba(201,162,39,0.4)' }}
        >
          <Plus size={17} strokeWidth={2.6} />
        </button>
      </div>

      <div className="flex flex-col gap-4 py-4 pb-24">

        {/* Hero */}
        <article
          className="relative overflow-hidden rounded-[22px] border shadow-[0_16px_40px_-12px_rgba(2,7,23,0.55)]"
          style={{ background: 'linear-gradient(140deg,#0d2657 0%,#091a3a 60%,#040e24 100%)', borderColor: TEAL_BORDER }}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(52,211,153,0.14)' }} />
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(52,211,153,0.55),transparent)' }} />

          <div className="relative p-4">
            <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[1.4px] font-bold mb-3" style={{ color: TEAL }}>
              <Target size={8} /> Goal portfolio
            </span>
            <div className="flex items-center gap-4 mb-4">
              <CircleRing pct={overallPct} size={80} stroke={8} />
              <div>
                <p className="text-[10px] text-white/50 m-0">Total saved</p>
                <span className="text-[24px] font-black tracking-[-1px] text-white leading-none tabular-nums block">{fmtN(totalSaved)}</span>
                <p className="text-[10px] text-white/45 m-0 mt-0.5">of {fmtN(totalGoal)} · {overallPct}% done</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Interest', value: fmtN(totalInterest), accent: true },
                { label: 'Active',   value: String(activeGoals.length) },
                { label: 'Done',     value: String(completedGoals.length) },
              ].map(({ label, value, accent }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center py-2.5 rounded-xl"
                  style={{
                    background: accent ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.06)',
                    border: accent ? `1px solid ${TEAL_BORDER}` : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="text-[9px] uppercase tracking-[0.8px] font-bold mb-0.5" style={{ color: accent ? TEAL : 'rgba(255,255,255,0.4)' }}>
                    {label}
                  </span>
                  <span className="text-[13px] font-black tabular-nums" style={{ color: accent ? TEAL : '#fff' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Active goals */}
        {activeGoals.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h2 className="inline-flex items-center gap-1.5 text-[13px] font-black m-0 text-[var(--c-text)] tracking-[-0.2px]">
                <Zap size={13} style={{ color: TEAL }} /> Active goals
              </h2>
              <span className="text-[10px] font-semibold text-[var(--c-text-muted)]">{activeGoals.length}</span>
            </div>
            {activeGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onWithdraw={setWithdrawGoal}
                scheduling={schedulingId === goal.id}
                onPause={handlePause}
                onResume={handleResume}
              />
            ))}
          </section>
        )}

        {/* Completed goals */}
        {completedGoals.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h2 className="inline-flex items-center gap-1.5 text-[13px] font-black m-0 text-[var(--c-text)] tracking-[-0.2px]">
                <Check size={13} style={{ color: '#C9A227' }} /> Completed
              </h2>
              <span className="text-[10px] font-semibold text-[var(--c-text-muted)]">{completedGoals.length}</span>
            </div>
            {completedGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onWithdraw={setWithdrawGoal}
                scheduling={schedulingId === goal.id}
                onPause={handlePause}
                onResume={handleResume}
              />
            ))}
          </section>
        )}

        {/* Empty state */}
        {targetGoals.length === 0 && (
          <div className="flex flex-col items-center text-center pt-8 pb-8 px-4 rounded-[22px] border border-[var(--c-border)]" style={{ background: 'var(--c-surface)' }}>

            {/* Ring visual */}
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(52,211,153,0.12)', transform: 'scale(1.4)' }} />
              <CircleRing pct={0} size={112} stroke={9} />
              <span
                className="absolute -top-1 -right-1 inline-flex items-center justify-center w-7 h-7 rounded-full border-2"
                style={{ background: 'var(--c-surface)', borderColor: 'var(--c-surface)' }}
              >
                <span className="inline-flex items-center justify-center w-full h-full rounded-full" style={{ background: TEAL_BG, color: TEAL }}>
                  <Flag size={12} strokeWidth={2.4} />
                </span>
              </span>
            </div>

            <h3 className="text-[18px] font-black text-[var(--c-text)] m-0 tracking-[-0.4px]">No goals yet</h3>
            <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1.5 max-w-[230px] leading-relaxed">
              Set a goal, choose your contribution amount, and save automatically until you get there.
            </p>

            {/* Example goal chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              {['Dream Car', 'MacBook Pro', 'Trip to Dubai', 'Emergency Fund', 'New Phone'].map(label => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                  style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border-soft)', color: 'var(--c-text-muted)' }}
                >
                  <Flag size={9} strokeWidth={2.2} style={{ color: TEAL }} />
                  {label}
                </span>
              ))}
            </div>

            {/* Feature rows */}
            <div className="w-full mt-5 rounded-2xl border border-[var(--c-border-soft)] overflow-hidden" style={{ background: 'var(--c-surface-soft)' }}>
              {[
                { icon: Zap,   label: 'Automated contributions', sub: 'Auto-debit weekly or monthly' },
                { icon: Flag,  label: 'Visual progress tracking', sub: 'Watch your ring fill up over time' },
                { icon: Coins, label: 'Interest on every naira',  sub: 'Your savings compound daily' },
              ].map(({ icon: Icon, label, sub }, i) => (
                <div key={label} className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}`}>
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0" style={{ background: TEAL_BG, color: TEAL }}>
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
              <Plus size={16} strokeWidth={2.6} /> Create your first goal
            </button>
          </div>
        )}
      </div>

      {/* Bottom sheets */}
      <CreateGoalSheet
        open={showSheet}
        product={targetProduct}
        onClose={() => { setShowSheet(false); setSuccess(null) }}
        onSubmit={handleCreate}
        submitting={creating}
        success={success}
      />
      <WithdrawSheet
        open={withdrawGoal !== null}
        goal={withdrawGoal}
        onClose={() => setWithdrawGoal(null)}
        onConfirm={handleWithdraw}
        withdrawing={withdrawing}
      />
    </div>
  )
}
