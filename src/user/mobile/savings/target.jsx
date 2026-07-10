import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAlert } from '../../../components/ui/Alert'
import { useSavingsOverview } from '../../../hooks/useSavings'
import { setScheduleStatus, topUpAccount } from '../../../services/savings'
import CreateGoalSheet from '../../../components/internalUI/CreateGoalSheet'
import GoalHistorySheet from '../../../components/internalUI/GoalHistorySheet'
import WithdrawGoalSheet from '../../../components/internalUI/WithdrawGoalSheet'
import {
  ChevronLeft, Target, Plus, Check, Loader2,
  ArrowUpRight, ArrowDownLeft, Pause, Play, Flag, Percent, Coins, Zap,
  History,
} from 'lucide-react'

function fmt(n) { return Number(n || 0).toLocaleString('en-NG') }
function fmtN(n) { return '₦' + fmt(Math.round(n || 0)) }
function fmtDate(d) {
  if (!d) return null
  const date = /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + 'T00:00:00') : new Date(d)
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

const TEAL        = '#34d399'
const TEAL_BG     = 'rgba(52,211,153,0.1)'
const TEAL_BORDER = 'rgba(52,211,153,0.28)'

const WITHDRAWAL_BLOCKED = new Set(['pending', 'approved', 'completed'])

/* ── Circle ring ─────────────────────────────────────────── */

function CircleRing({ pct = 0, size = 72, stroke = 7, withdrawn = false }) {
  const r    = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const done = pct >= 100
  const color  = withdrawn ? 'rgba(148,163,184,0.5)' : done ? '#C9A227' : TEAL
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
        {done && !withdrawn
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
  const goal      = a.goal_amount != null ? Number(a.goal_amount) : null
  const progress  = goal > 0 ? Math.min(100, Math.round((principal / goal) * 100)) : 0
  const remaining = goal != null ? Math.max(0, goal - principal) : null
  return {
    id:              a.id,
    name:            a.name || 'Target savings',
    principal,
    goal,
    progress,
    remaining,
    interestEarned:  Number(a.accrued_interest || 0),
    apy:             Number(a.apy_at_creation ?? 0),
    status:          a.status,
    isCompleted:     (a.status === 'completed' || progress >= 100) && a.status !== 'withdrawn',
    isWithdrawn:     a.status === 'withdrawn',
    frequency:       a.schedule_frequency || a.frequency || null,
    scheduleStatus:  a.schedule_status || null,
    startDate:       a.start_date || null,
    maturityDate:    a.maturity_date || null,
    penalty:         Number(a.early_withdrawal_penalty || 0),
    withdrawalStatus: a.withdrawal_status || null,
  }
}

/* ── Goal card ────────────────────────────────────────────── */

function GoalCard({ goal, onWithdraw, onHistory, scheduling, onPause, onResume, onQuickSave, quickSaving }) {
  const isPaused       = goal.scheduleStatus === 'paused'
  const { isCompleted, isWithdrawn } = goal
  const withdrawalBlocked = WITHDRAWAL_BLOCKED.has(goal.withdrawalStatus)
  const [showQuickSave, setShowQuickSave] = useState(false)
  const [saveAmt, setSaveAmt]             = useState('')

  function submitQuickSave() {
    const num = Number(saveAmt.replace(/[^0-9.]/g, ''))
    if (num < 100) return
    onQuickSave(goal.id, num)
    setShowQuickSave(false)
    setSaveAmt('')
  }

  return (
    <div
      className="rounded-[18px] border border-[var(--c-border)] overflow-hidden"
      style={{ background: 'var(--c-surface)' }}
    >
      <div
        className="h-[3px] w-full"
        style={{
          background: isWithdrawn
            ? 'linear-gradient(90deg,rgba(148,163,184,0.5),rgba(148,163,184,0.18))'
            : isCompleted
              ? 'linear-gradient(90deg,#C9A227,#f0d060)'
              : `linear-gradient(90deg,${TEAL},rgba(52,211,153,0.35))`,
        }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            {isWithdrawn ? (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[0.8px] shrink-0"
                style={{ background: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.28)' }}
              >
                <ArrowUpRight size={7} strokeWidth={3} /> Withdrawn
              </span>
            ) : isCompleted ? (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[0.8px] shrink-0"
                style={{ background: 'rgba(201,162,39,0.12)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)' }}
              >
                <Check size={7} strokeWidth={3} /> Completed
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[0.8px] shrink-0"
                style={{ background: TEAL_BG, color: TEAL, border: `1px solid ${TEAL_BORDER}` }}
              >
                <Zap size={7} strokeWidth={3} /> Active
              </span>
            )}
            <h3 className="text-[13.5px] font-black text-[var(--c-text)] m-0 truncate tracking-[-0.2px]">{goal.name}</h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {goal.apy > 0 && (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold tabular-nums"
                style={{ background: 'var(--c-accent-soft)', color: 'var(--c-accent)', border: '1px solid var(--c-accent-border)' }}
              >
                <Percent size={7} /> {goal.apy}%
              </span>
            )}
            {isPaused && !isCompleted && !isWithdrawn && (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold"
                style={{ background: 'rgba(251,146,60,0.1)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)' }}
              >
                <Pause size={7} strokeWidth={2.5} /> Paused
              </span>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <CircleRing pct={goal.progress} withdrawn={isWithdrawn} />
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-black text-[var(--c-text)] m-0 tabular-nums tracking-[-0.5px] leading-tight mb-1.5">
              {fmtN(goal.principal)}
            </p>
            <div
              className="relative w-full h-1 rounded-full overflow-hidden mb-1"
              style={{ background: 'var(--c-border-soft)' }}
            >
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${goal.progress}%` }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: isWithdrawn
                    ? 'linear-gradient(90deg,rgba(148,163,184,0.5),rgba(148,163,184,0.25))'
                    : isCompleted
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
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[var(--c-border-soft)]">
          <div className="flex-1 min-w-0">
            <span className="text-[9px] uppercase tracking-[1px] font-bold text-[var(--c-text-faint)]">Interest</span>
            <p className="text-[12px] font-black tabular-nums m-0" style={{ color: TEAL }}>+{fmtN(goal.interestEarned)}</p>
          </div>
          <div className="w-px h-7 bg-[var(--c-border-soft)]" />
          <div className="flex-1 min-w-0">
            <span className="text-[9px] uppercase tracking-[1px] font-bold text-[var(--c-text-faint)]">
              {goal.maturityDate ? 'Matures' : 'Frequency'}
            </span>
            <p className="text-[12px] font-black text-[var(--c-text)] m-0 capitalize truncate">
              {goal.maturityDate ? fmtDate(goal.maturityDate) : (goal.frequency || '—')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 pt-3 border-t border-[var(--c-border-soft)]">
          <AnimatePresence mode="wait">
            {!isCompleted && !isWithdrawn && showQuickSave ? (
              <motion.div
                key="quicksave"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-2"
              >
                <p className="text-[10px] font-semibold text-[var(--c-text-muted)] m-0">
                  Add funds to <span className="font-bold text-[var(--c-text)]">{goal.name}</span>
                </p>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[var(--c-text-muted)]">₦</span>
                    <input
                      type="text" inputMode="decimal" value={saveAmt}
                      onChange={e => setSaveAmt(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && submitQuickSave()}
                      placeholder="0.00"
                      autoFocus
                      className="w-full h-9 pl-7 pr-3 rounded-lg text-[12.5px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                      style={{ background: 'var(--c-surface-soft)' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setShowQuickSave(false); setSaveAmt('') }}
                    className="inline-flex items-center px-3 h-9 rounded-lg font-bold text-[11px] border border-[var(--c-border)] text-[var(--c-text-muted)] bg-[var(--c-surface-soft)] transition active:scale-95 shrink-0"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submitQuickSave}
                    disabled={quickSaving || Number(saveAmt.replace(/[^0-9.]/g, '')) < 100}
                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg font-bold text-[11px] border transition active:scale-95 disabled:opacity-50 shrink-0"
                    style={{ background: TEAL_BG, borderColor: TEAL_BORDER, color: TEAL }}
                  >
                    {quickSaving
                      ? <Loader2 size={11} className="animate-spin" />
                      : <><ArrowDownLeft size={11} strokeWidth={2.5} /> Save</>
                    }
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => onHistory(goal)}
                  className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg font-bold text-[11px] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] bg-[var(--c-surface-soft)] transition active:scale-95"
                >
                  <History size={11} strokeWidth={2.3} /> History
                </button>

                {!isCompleted && !isWithdrawn && (
                  <button
                    type="button"
                    onClick={() => setShowQuickSave(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg font-bold text-[11px] border transition active:scale-95"
                    style={{ background: TEAL_BG, borderColor: TEAL_BORDER, color: TEAL }}
                  >
                    <ArrowDownLeft size={11} strokeWidth={2.5} /> Quick Save
                  </button>
                )}

                {!isCompleted && !isWithdrawn && goal.frequency && (
                  <button
                    type="button"
                    onClick={() => isPaused ? onResume(goal.id) : onPause(goal.id)}
                    disabled={scheduling}
                    className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg font-bold text-[11px] border transition active:scale-95 disabled:opacity-60"
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

                {!isCompleted && !isWithdrawn && (
                  withdrawalBlocked ? (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg font-bold text-[11px] border ml-auto cursor-default capitalize"
                      style={{ background: 'rgba(251,146,60,0.07)', borderColor: 'rgba(251,146,60,0.25)', color: '#fb923c' }}
                    >
                      {goal.withdrawalStatus}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onWithdraw(goal)}
                      className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg font-bold text-[11px] border border-[var(--c-border)] text-[var(--c-text-muted)] bg-[var(--c-surface-soft)] transition active:scale-95 ml-auto"
                    >
                      <ArrowUpRight size={11} strokeWidth={2.5} /> Withdraw
                    </button>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────── */

export default function MobileTargetSavings() {
  const navigate = useNavigate()
  const { alert } = useAlert()
  const { plans: rawProducts, investments, creating, create, withdraw, refresh } = useSavingsOverview()

  const [showModal, setShowModal]         = useState(false)
  const [success, setSuccess]             = useState(null)
  const [schedulingId, setSchedulingId]   = useState(null)
  const [withdrawGoal, setWithdrawGoal]   = useState(null)
  const [withdrawing, setWithdrawing]     = useState(false)
  const [quickSavingId, setQuickSavingId] = useState(null)
  const [historyGoal, setHistoryGoal]     = useState(null)

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

  const activeGoals    = targetGoals.filter(g => !g.isCompleted && !g.isWithdrawn)
  const withdrawnGoals = targetGoals.filter(g => g.isWithdrawn)
  const completedGoals = targetGoals.filter(g => g.isCompleted)
  const allGoals       = useMemo(() => [...activeGoals, ...completedGoals, ...withdrawnGoals], [activeGoals, completedGoals, withdrawnGoals])

  async function handleCreate(payload) {
    if (!targetProduct) return
    const r = await create({
      product_id:    targetProduct.id,
      name:          payload.name,
      initial_amount: payload.amount,
      goal_amount:   payload.goal,
      ...(payload.contribution ? { contribution_amount: payload.contribution, frequency: payload.frequency } : {}),
      start_date:    payload.startDate || null,
      maturity_date: payload.maturityDate || null,
    })
    if (r.success) {
      setSuccess({
        name:         payload.name,
        category:     payload.category || null,
        principal:    payload.amount,
        goal:         payload.goal,
        apy:          payload.apy,
        frequency:    payload.frequency || null,
        startDate:    fmtDate(payload.startDate),
        maturityDate: fmtDate(payload.maturityDate),
      })
    } else {
      alert({ type: 'error', title: 'Could not create goal', message: r.message || 'Something went wrong.' })
    }
  }

  async function handleQuickSave(id, amount) {
    setQuickSavingId(id)
    const r = await topUpAccount(id, { amount })
    setQuickSavingId(null)
    if (r?.success) {
      refresh()
    } else {
      alert({ type: 'error', title: 'Deposit failed', message: r?.message || 'Could not process deposit.' })
    }
  }

  async function handleWithdraw() {
    if (!withdrawGoal) return
    setWithdrawing(true)
    const r = await withdraw(withdrawGoal.id)
    setWithdrawing(false)
    if (r.success) {
      setWithdrawGoal(null)
    } else {
      alert({ type: 'error', title: 'Withdrawal failed', message: r.message || 'Could not process withdrawal.' })
    }
  }

  async function handlePause(id) {
    setSchedulingId(id)
    const r = await setScheduleStatus(id, 'pause')
    setSchedulingId(null)
    if (r.success) { refresh() }
    else alert({ type: 'error', title: 'Could not pause', message: r.message || 'Failed to pause.' })
  }

  async function handleResume(id) {
    setSchedulingId(id)
    const r = await setScheduleStatus(id, 'resume')
    setSchedulingId(null)
    if (r.success) { refresh() }
    else alert({ type: 'error', title: 'Could not resume', message: r.message || 'Failed to resume.' })
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--c-bg)' }}>

      {/* Top bar */}
      <div className="grid grid-cols-3 items-center pt-4">
        <button
          type="button"
          onClick={() => navigate('/user/savings')}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition justify-self-start"
        >
          <ChevronLeft size={13} /> Back
        </button>
        <h1 className="text-[15px] font-black text-[var(--c-text)] m-0 tracking-[-0.3px] text-center">Your goals</h1>
        <button
          type="button"
          onClick={() => { setShowModal(true); setSuccess(null) }}
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl transition active:scale-90 justify-self-end"
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
                { label: 'Interest',  value: fmtN(totalInterest),          accent: true },
                { label: 'Active',    value: String(activeGoals.length) },
                { label: 'Done',      value: String(completedGoals.length) },
              ].map(({ label, value, accent }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center py-2.5 rounded-xl"
                  style={{
                    background: accent ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.06)',
                    border:     accent ? `1px solid ${TEAL_BORDER}` : '1px solid rgba(255,255,255,0.08)',
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

        {/* All goals */}
        {allGoals.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h2 className="inline-flex items-center gap-1.5 text-[13px] font-black m-0 text-[var(--c-text)] tracking-[-0.2px]">
                <Target size={13} style={{ color: TEAL }} /> All goals
              </h2>
              <span className="text-[10px] font-semibold text-[var(--c-text-muted)]">{allGoals.length}</span>
            </div>
            {allGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onWithdraw={setWithdrawGoal}
                onHistory={setHistoryGoal}
                scheduling={schedulingId === goal.id}
                onPause={handlePause}
                onResume={handleResume}
                onQuickSave={handleQuickSave}
                quickSaving={quickSavingId === goal.id}
              />
            ))}
          </section>
        )}

        {/* Empty state */}
        {targetGoals.length === 0 && (
          <div className="flex flex-col items-center text-center pt-8 pb-8 px-4 rounded-[22px] border border-[var(--c-border)]" style={{ background: 'var(--c-surface)' }}>
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

            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              {['Dream Car', 'MacBook Pro', 'Trip to Dubai', 'Emergency Fund', 'New Phone'].map(label => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                  style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border-soft)', color: 'var(--c-text-muted)' }}
                >
                  <Flag size={9} strokeWidth={2.2} style={{ color: TEAL }} /> {label}
                </span>
              ))}
            </div>

            <div className="w-full mt-5 rounded-2xl border border-[var(--c-border-soft)] overflow-hidden" style={{ background: 'var(--c-surface-soft)' }}>
              {[
                { icon: Zap,   label: 'Automated contributions', sub: 'Auto-save weekly or monthly' },
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
              onClick={() => { setShowModal(true); setSuccess(null) }}
              className="inline-flex items-center justify-center gap-2 w-full h-[52px] rounded-2xl font-bold text-[14px] mt-5 transition active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 10px 28px -8px rgba(201,162,39,0.55)' }}
            >
              <Plus size={16} strokeWidth={2.6} /> Create your first goal
            </button>
          </div>
        )}
      </div>

      <CreateGoalSheet
        open={showModal}
        product={targetProduct}
        onClose={() => { setShowModal(false); setSuccess(null) }}
        onSubmit={handleCreate}
        submitting={creating}
        success={success}
      />

      <WithdrawGoalSheet
        open={withdrawGoal !== null}
        goal={withdrawGoal}
        onClose={() => setWithdrawGoal(null)}
        onConfirm={handleWithdraw}
        withdrawing={withdrawing}
      />

      <GoalHistorySheet
        open={historyGoal !== null}
        goal={historyGoal}
        onClose={() => setHistoryGoal(null)}
      />
    </div>
  )
}
