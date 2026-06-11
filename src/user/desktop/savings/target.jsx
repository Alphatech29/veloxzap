import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAlert } from '../../../components/ui/Alert'
import { useSavingsOverview } from '../../../hooks/useSavings'
import { setScheduleStatus } from '../../../lib/savings'
import {
  Target, Plus, Check, X, Loader2, TrendingUp, ShieldCheck,
  ArrowUpRight, Pause, Play, Flag, Percent, Coins, Zap,
  ChevronLeft,
} from 'lucide-react'
import { Link } from 'react-router-dom'

function fmt(n) { return Number(n || 0).toLocaleString('en-NG') }
function fmtN(n) { return '₦' + fmt(Math.round(n || 0)) }

const TEAL = '#34d399'
const TEAL_BG = 'rgba(52,211,153,0.1)'
const TEAL_BORDER = 'rgba(52,211,153,0.28)'

/* ── Circle ring ─────────────────────────────────────────── */

function CircleRing({ pct = 0, size = 96, stroke = 9 }) {
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
          ? <Check size={20} strokeWidth={3} style={{ color: '#C9A227' }} />
          : <>
              <span className="text-[15px] font-black leading-none tabular-nums" style={{ color }}>{pct}%</span>
              <span className="text-[8px] font-bold text-[var(--c-text-faint)] mt-0.5">done</span>
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

/* ── Create goal modal ────────────────────────────────────── */

function CreateGoalModal({ product, onClose, onSubmit, submitting, success }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [goalAmt, setGoalAmt] = useState('')
  const [contrib, setContrib] = useState('')
  const [frequency, setFrequency] = useState('weekly')

  const n = s => Number(s.replace(/[^0-9.]/g, '')) || 0
  const numAmount = n(amount)
  const numGoal   = n(goalAmt)
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
          className="relative w-full max-w-[440px] max-h-[88vh] overflow-y-auto rounded-[24px] border border-[var(--c-border)] pointer-events-auto"
          style={{ background: 'var(--c-surface)', boxShadow: '0 32px 80px -16px rgba(2,7,23,0.5)' }}
        >
          {/* Header */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-5 border-b border-[var(--c-border-soft)]"
            style={{ background: 'var(--c-surface)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="inline-flex items-center justify-center w-11 h-11 rounded-2xl shrink-0 border"
                style={{ background: TEAL_BG, borderColor: TEAL_BORDER, color: TEAL }}
              >
                <Target size={18} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="text-[9.5px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">New goal</p>
                <h2 className="text-[16px] font-black text-[var(--c-text)] m-0 truncate tracking-[-0.3px]">
                  {product?.name || 'Target Savings'}
                </h2>
              </div>
            </div>
            {!submitting && (
              <button
                type="button" onClick={onClose}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Body */}
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center px-6 py-10"
              >
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                  style={{ background: 'var(--c-success-bg)', color: 'var(--c-success)' }}
                >
                  <Check size={28} strokeWidth={2.6} />
                </motion.span>
                <h3 className="text-[17px] font-black text-[var(--c-text)] m-0 tracking-[-0.3px]">Goal created</h3>
                <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 max-w-[280px] leading-relaxed">
                  {fmtN(success.principal)} invested in{' '}
                  <span className="font-semibold text-[var(--c-text)]">{success.name}</span>
                  {' '}· target {fmtN(success.goal)}
                </p>

                <div
                  className="w-full mt-6 rounded-2xl border border-[var(--c-border-soft)] overflow-hidden"
                  style={{ background: 'var(--c-surface-soft)' }}
                >
                  {[
                    { label: 'Goal name',     value: success.name },
                    { label: 'Starting with', value: fmtN(success.principal) },
                    { label: 'Target',        value: fmtN(success.goal) },
                    { label: 'Contribution',  value: success.contrib },
                    { label: 'Rate',          value: `${success.apy}% p.a.` },
                  ].map((r, i) => (
                    <div
                      key={r.label}
                      className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}`}
                    >
                      <span className="text-[11px] text-[var(--c-text-muted)] font-medium">{r.label}</span>
                      <span className="text-[12.5px] font-bold text-[var(--c-text)] tabular-nums">{r.value}</span>
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
              <motion.div
                key="form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="px-6 py-5 flex flex-col gap-4"
              >
                <p className="text-[12px] text-[var(--c-text-muted)] m-0 leading-relaxed">
                  {product?.desc || 'Save consistently toward a specific goal with automated contributions.'}
                </p>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Goal name</span>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="e.g. Dream Car, MacBook, Trip to Dubai"
                    className="h-[46px] px-4 rounded-xl text-[13px] font-semibold text-[var(--c-text)] outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
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
                      className="w-full h-[46px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
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
                      className="w-full h-[46px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                      style={{ background: 'var(--c-surface-soft)' }}
                    />
                  </div>
                  <span className="text-[10px] text-[var(--c-text-faint)]">Minimum ₦1,000</span>
                </label>

                <div className="grid grid-cols-[1fr_120px] gap-3">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Auto contribution</span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--c-text-muted)]">₦</span>
                      <input
                        type="text" inputMode="decimal" value={contrib} onChange={e => setContrib(e.target.value)}
                        placeholder="20,000"
                        className="w-full h-[46px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                        style={{ background: 'var(--c-surface-soft)' }}
                      />
                    </div>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Frequency</span>
                    <select
                      value={frequency} onChange={e => setFrequency(e.target.value)}
                      className="h-[46px] px-3 rounded-xl text-[12.5px] font-semibold text-[var(--c-text)] outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition appearance-none"
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
                  className="inline-flex items-center justify-center gap-2 w-full h-[48px] rounded-xl font-bold text-[13.5px] mt-1 transition hover:-translate-y-px active:scale-[0.99] disabled:opacity-50 disabled:hover:translate-y-0"
                  style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
                >
                  {submitting
                    ? <><Loader2 size={15} className="animate-spin" /> Creating goal…</>
                    : <><Target size={15} strokeWidth={2.2} /> Create goal</>
                  }
                </button>
                <p className="inline-flex items-center gap-1.5 text-[10px] text-[var(--c-text-faint)] justify-center m-0">
                  <ShieldCheck size={11} className="text-brand-accent" /> Starting amount debited from your wallet balance
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}

/* ── Goal card ────────────────────────────────────────────── */

function GoalCard({ goal, onWithdraw, withdrawing, scheduling, onPause, onResume }) {
  const isPaused = goal.scheduleStatus === 'paused'
  const { isCompleted } = goal

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[20px] border border-[var(--c-border)] overflow-hidden"
      style={{ background: 'var(--c-surface)' }}
    >
      <div
        className="h-1 w-full"
        style={{
          background: isCompleted
            ? 'linear-gradient(90deg,#C9A227,#f0d060)'
            : `linear-gradient(90deg,${TEAL},rgba(52,211,153,0.35))`,
        }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className="text-[14px] font-black text-[var(--c-text)] m-0 truncate tracking-[-0.2px] mb-1.5">
              {goal.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {isCompleted ? (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.8px]"
                  style={{ background: 'rgba(201,162,39,0.12)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)' }}
                >
                  <Check size={8} strokeWidth={3} /> Completed
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.8px]"
                  style={{ background: TEAL_BG, color: TEAL, border: `1px solid ${TEAL_BORDER}` }}
                >
                  <Zap size={8} strokeWidth={3} /> Active
                </span>
              )}
              {goal.apy > 0 && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tabular-nums"
                  style={{ background: 'var(--c-accent-soft)', color: 'var(--c-accent)', border: '1px solid var(--c-accent-border)' }}
                >
                  <Percent size={8} /> {goal.apy}% p.a.
                </span>
              )}
            </div>
          </div>
          {isPaused && !isCompleted && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9.5px] font-bold shrink-0"
              style={{ background: 'rgba(251,146,60,0.1)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)' }}
            >
              <Pause size={9} strokeWidth={2.5} /> Paused
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-5">
          <CircleRing pct={goal.progress} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[var(--c-text-muted)] m-0">Amount saved</p>
            <p className="text-[20px] font-black text-[var(--c-text)] m-0 tabular-nums tracking-[-0.5px] leading-tight mb-2">
              {fmtN(goal.principal)}
            </p>
            <div
              className="relative w-full h-1.5 rounded-full overflow-hidden mb-1.5"
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
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[var(--c-text-faint)]">
                {goal.remaining != null ? `${fmtN(goal.remaining)} to go` : '—'}
              </span>
              {goal.goal != null && (
                <span className="text-[10px] font-semibold text-[var(--c-text-muted)]">of {fmtN(goal.goal)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div
            className="flex flex-col gap-0.5 p-3 rounded-xl"
            style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border-soft)' }}
          >
            <span className="text-[9.5px] uppercase tracking-[1px] font-bold text-[var(--c-text-faint)]">Interest earned</span>
            <span className="text-[13px] font-black tabular-nums" style={{ color: TEAL }}>+{fmtN(goal.interestEarned)}</span>
          </div>
          <div
            className="flex flex-col gap-0.5 p-3 rounded-xl"
            style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border-soft)' }}
          >
            <span className="text-[9.5px] uppercase tracking-[1px] font-bold text-[var(--c-text-faint)]">Frequency</span>
            <span className="text-[13px] font-black text-[var(--c-text)] capitalize">
              {goal.frequency || '—'}
            </span>
          </div>
        </div>

        {/* Actions */}
        {!isCompleted && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--c-border-soft)]">
            {goal.frequency && (
              <button
                type="button"
                onClick={() => isPaused ? onResume(goal.id) : onPause(goal.id)}
                disabled={scheduling}
                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl font-bold text-[11.5px] border transition active:scale-95 disabled:opacity-60"
                style={isPaused
                  ? { background: TEAL_BG, borderColor: TEAL_BORDER, color: TEAL }
                  : { background: 'rgba(251,146,60,0.08)', borderColor: 'rgba(251,146,60,0.25)', color: '#fb923c' }
                }
              >
                {scheduling
                  ? <Loader2 size={12} className="animate-spin" />
                  : isPaused
                    ? <><Play size={11} strokeWidth={2.5} /> Resume</>
                    : <><Pause size={11} strokeWidth={2.5} /> Pause</>
                }
              </button>
            )}
            <button
              type="button"
              onClick={() => onWithdraw(goal.id)}
              disabled={withdrawing}
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl font-bold text-[11.5px] border border-[var(--c-border)] text-[var(--c-text-muted)] bg-[var(--c-surface-soft)] transition hover:border-[var(--c-border-strong)] active:scale-95 disabled:opacity-60 ml-auto"
            >
              {withdrawing
                ? <Loader2 size={12} className="animate-spin" />
                : <><ArrowUpRight size={12} strokeWidth={2.5} /> Withdraw</>
              }
            </button>
          </div>
        )}
      </div>
    </motion.article>
  )
}

/* ── Page ─────────────────────────────────────────────────── */

export default function DesktopTargetSavings() {
  const { alert } = useAlert()
  const { plans: rawProducts, investments, creating, create, withdraw, refresh } = useSavingsOverview()

  const [showModal, setShowModal] = useState(false)
  const [success, setSuccess]     = useState(null)
  const [schedulingId, setSchedulingId] = useState(null)
  const [withdrawingId, setWithdrawingId] = useState(null)

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
  const activeGoals   = targetGoals.filter(g => !g.isCompleted)
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
      alert({ type: 'success', title: 'Goal created', message: `${payload.name} is now active — saving ${fmtN(payload.contribution)} ${payload.frequency}` })
    } else {
      alert({ type: 'error', title: 'Could not create goal', message: r.message || 'Something went wrong.' })
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

  async function handlePause(id) {
    setSchedulingId(id)
    const r = await setScheduleStatus(id, 'pause')
    setSchedulingId(null)
    if (r.success) { refresh(); alert({ type: 'success', title: 'Schedule paused', message: 'Auto-debit has been paused.' }) }
    else alert({ type: 'error', title: 'Could not pause', message: r.message || 'Failed to pause schedule.' })
  }

  async function handleResume(id) {
    setSchedulingId(id)
    const r = await setScheduleStatus(id, 'resume')
    setSchedulingId(null)
    if (r.success) { refresh(); alert({ type: 'success', title: 'Schedule resumed', message: 'Auto-debit has been resumed.' }) }
    else alert({ type: 'error', title: 'Could not resume', message: r.message || 'Failed to resume schedule.' })
  }

  return (
    <div className="flex flex-col gap-5 max-w-[1240px] mx-auto pb-10">

      {/* Header */}
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/user/savings"
              className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[var(--c-text-muted)] hover:text-[var(--c-text)] transition"
            >
              <ChevronLeft size={12} /> Save & earn
            </Link>
          </div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.4px] text-brand-accent font-bold m-0">
            <Target size={10} /> Target savings
          </p>
          <h1 className="text-[22px] font-black tracking-[-0.5px] text-[var(--c-text)] m-0 mt-1">Your goals</h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Save toward specific targets with automated contributions
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowModal(true); setSuccess(null) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[12.5px] transition hover:-translate-y-px active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
        >
          <Plus size={14} strokeWidth={2.6} /> New goal
        </button>
      </header>

      {/* Hero */}
      <article
        className="relative overflow-hidden rounded-[24px] border shadow-[0_24px_60px_-20px_rgba(2,7,23,0.6)]"
        style={{ background: 'linear-gradient(140deg,#0d2657 0%,#091a3a 55%,#040e24 100%)', borderColor: TEAL_BORDER }}
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(52,211,153,0.14)' }} />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(52,211,153,0.08)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: 'radial-gradient(rgba(52,211,153,0.2) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(52,211,153,0.55),transparent)' }} />

        <div className="relative grid grid-cols-1 min-[860px]:grid-cols-[1.4fr_1fr] gap-0 divide-y min-[860px]:divide-y-0 min-[860px]:divide-x divide-white/[0.07]">
          {/* Left */}
          <div className="p-5">
            <span className="inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[1.5px] font-bold mb-4" style={{ color: TEAL }}>
              <Target size={9} /> Total goal portfolio
            </span>
            <div className="flex items-center gap-5">
              <CircleRing pct={overallPct} size={100} stroke={10} />
              <div>
                <p className="text-[11px] text-white/50 m-0">Total saved</p>
                <span className="text-[30px] font-black tracking-[-1.5px] text-white leading-none tabular-nums block">
                  {fmtN(totalSaved)}
                </span>
                <p className="text-[11px] text-white/50 m-0 mt-1">
                  of {fmtN(totalGoal)} total goal · {overallPct}% complete
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="grid grid-cols-2 gap-px p-5">
            {[
              { label: 'Interest earned', value: fmtN(totalInterest), accent: true,  icon: Coins },
              { label: 'Active goals',    value: String(activeGoals.length),          icon: Target },
              { label: 'Completed',       value: String(completedGoals.length),       icon: Check },
              { label: 'APY rate',        value: targetProduct ? `${targetProduct.apy}% p.a.` : '—', icon: Percent },
            ].map(({ label, value, accent, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col justify-between p-3 rounded-xl"
                style={{
                  background: accent ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)',
                  border: accent ? `1px solid ${TEAL_BORDER}` : '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold m-0" style={{ color: accent ? TEAL : 'rgba(255,255,255,0.4)' }}>
                    {label}
                  </p>
                  <Icon size={12} style={{ color: accent ? TEAL : 'rgba(255,255,255,0.3)' }} />
                </div>
                <p
                  className="text-[16.5px] font-black tabular-nums tracking-[-0.4px] m-0 mt-1.5 leading-none"
                  style={{ color: accent ? TEAL : '#fff' }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Active goals */}
      {activeGoals.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2 className="inline-flex items-center gap-2 text-[14px] font-black m-0 text-[var(--c-text)] tracking-[-0.2px]">
              <Zap size={14} style={{ color: TEAL }} /> Active goals
            </h2>
            <span className="text-[10.5px] font-semibold text-[var(--c-text-muted)]">{activeGoals.length}</span>
          </div>
          <div className="grid grid-cols-1 min-[860px]:grid-cols-2 gap-4">
            {activeGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onWithdraw={handleWithdraw}
                withdrawing={withdrawingId === goal.id}
                scheduling={schedulingId === goal.id}
                onPause={handlePause}
                onResume={handleResume}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed goals */}
      {completedGoals.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2 className="inline-flex items-center gap-2 text-[14px] font-black m-0 text-[var(--c-text)] tracking-[-0.2px]">
              <Check size={14} style={{ color: '#C9A227' }} /> Completed goals
            </h2>
            <span className="text-[10.5px] font-semibold text-[var(--c-text-muted)]">{completedGoals.length}</span>
          </div>
          <div className="grid grid-cols-1 min-[860px]:grid-cols-2 gap-4">
            {completedGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onWithdraw={handleWithdraw}
                withdrawing={withdrawingId === goal.id}
                scheduling={schedulingId === goal.id}
                onPause={handlePause}
                onResume={handleResume}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {targetGoals.length === 0 && (
        <div className="flex flex-col items-center text-center py-20 px-4 rounded-[20px] border border-[var(--c-border)]" style={{ background: 'var(--c-surface)' }}>
          <span
            className="inline-flex items-center justify-center w-16 h-16 rounded-[22px] mb-5 border"
            style={{ background: TEAL_BG, borderColor: TEAL_BORDER, color: TEAL }}
          >
            <Target size={28} strokeWidth={1.8} />
          </span>
          <h3 className="text-[16px] font-black text-[var(--c-text)] m-0 tracking-[-0.2px]">No goals yet</h3>
          <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 max-w-[320px] leading-relaxed">
            Create your first savings goal and start saving automatically toward it.
          </p>
          <button
            type="button"
            onClick={() => { setShowModal(true); setSuccess(null) }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[13px] mt-5 transition hover:-translate-y-px active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
          >
            <Plus size={14} strokeWidth={2.6} /> Create first goal
          </button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && targetProduct && (
          <CreateGoalModal
            product={targetProduct}
            onClose={() => { setShowModal(false); setSuccess(null) }}
            onSubmit={handleCreate}
            submitting={creating}
            success={success}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
