import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAlert } from '../../../components/ui/Alert'
import { useSavingsOverview, useSavingsPlanLedger } from '../../../hooks/useSavings'
import { setScheduleStatus, topUpAccount } from '../../../lib/savings'
import CreateGoalModal from '../../../components/internalUI/CreateGoalModal'
import {
  Target, Plus, Check, Loader2,
  ArrowUpRight, ArrowDownLeft, Pause, Play, Percent, Coins, Zap,
  ChevronLeft, History, X, Receipt, Sparkles, AlertTriangle,
} from 'lucide-react'

function fmt(n) { return Number(n || 0).toLocaleString('en-NG') }
function fmtN(n) { return '₦' + fmt(Math.round(n || 0)) }
function fmtDate(d) {
  if (!d) return null
  const date = /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + 'T00:00:00') : new Date(d)
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}
function fmtTime(d) {
  if (!d) return null
  const date = /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + 'T00:00:00') : new Date(d)
  return date.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit', hour12: true })
}

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

/* ── History modal ───────────────────────────────────────── */

const LEDGER_META = {
  deposit:         { label: 'Deposit',                  icon: ArrowDownLeft, sign: '+' },
  top_up:          { label: 'Top-up',                   icon: ArrowDownLeft, sign: '+' },
  interest_credit: { label: 'Interest credited',        icon: Sparkles,      sign: '+' },
  withdrawal:      { label: 'Withdrawal',               icon: ArrowUpRight,  sign: '-' },
  penalty:         { label: 'Early withdrawal penalty', icon: AlertTriangle, sign: '-' },
}

function LedgerRow({ entry }) {
  const meta = LEDGER_META[entry.type] || { label: entry.type, icon: Coins, sign: '' }
  const Icon = meta.icon
  const isCredit = meta.sign === '+'
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-xl shrink-0 border"
        style={{
          background:   isCredit ? TEAL_BG    : 'var(--c-surface-soft)',
          borderColor:  isCredit ? TEAL_BORDER : 'var(--c-border-soft)',
          color:        isCredit ? TEAL        : 'var(--c-text-muted)',
        }}
      >
        <Icon size={13} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11.5px] font-bold text-[var(--c-text)] m-0 truncate">{entry.description || meta.label}</p>
        <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
          {fmtDate(entry.created_at)} · {fmtTime(entry.created_at)}
        </p>
      </div>
      <span className="text-[12px] font-black tabular-nums shrink-0" style={{ color: isCredit ? TEAL : 'var(--c-text)' }}>
        {meta.sign}{fmtN(entry.amount)}
      </span>
    </div>
  )
}

function TargetHistoryModal({ goal, onClose }) {
  const { ledger, loading } = useSavingsPlanLedger(goal?.id)
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[6px]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="relative w-full max-w-xl h-[82vh] flex flex-col rounded-[24px] border border-[var(--c-border)] overflow-hidden pointer-events-auto"
          style={{ background: 'var(--c-surface)', boxShadow: '0 32px 80px -16px rgba(2,7,23,0.5)' }}
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-5 border-b border-[var(--c-border-soft)]">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="inline-flex items-center justify-center w-11 h-11 rounded-2xl shrink-0 border"
                style={{ background: TEAL_BG, borderColor: TEAL_BORDER, color: TEAL }}
              >
                <History size={18} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="text-[9.5px] uppercase tracking-[1.3px] font-bold m-0" style={{ color: TEAL }}>Transaction history</p>
                <h2 className="text-[16px] font-black text-[var(--c-text)] m-0 truncate tracking-[-0.3px]">{goal.name}</h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
            >
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={22} className="animate-spin text-[var(--c-text-muted)]" />
              </div>
            ) : ledger.length === 0 ? (
              <div className="flex flex-col items-center text-center py-16 px-4 gap-3">
                <span
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border"
                  style={{ background: TEAL_BG, borderColor: TEAL_BORDER, color: TEAL }}
                >
                  <Receipt size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-[14px] font-black text-[var(--c-text)] m-0">No transactions yet</h3>
                  <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1 leading-relaxed">
                    Deposits and interest credits for this goal will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[var(--c-border-soft)]">
                {ledger.map(entry => <LedgerRow key={entry.id} entry={entry} />)}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
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
    interestEarned: Number(a.accrued_interest || 0),
    apy: Number(a.apy_at_creation ?? 0),
    status: a.status,
    isCompleted: (a.status === 'completed' || progress >= 100) && a.status !== 'withdrawn',
    isWithdrawn: a.status === 'withdrawn',
    frequency: a.schedule_frequency || a.frequency || null,
    scheduleStatus: a.schedule_status || null,
    startDate: a.start_date || null,
    maturityDate: a.maturity_date || null,
    penalty: Number(a.early_withdrawal_penalty || 0),
    withdrawalStatus: a.withdrawal_status || null,
  }
}

/* ── Goal card ────────────────────────────────────────────── */

const WITHDRAWAL_BLOCKED = new Set(['pending', 'approved', 'completed'])

function GoalCard({ goal, onWithdraw, withdrawing, scheduling, onPause, onResume, onHistory, onQuickSave, quickSaving }) {
  const isPaused = goal.scheduleStatus === 'paused'
  const { isCompleted, isWithdrawn } = goal
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)
  const [showQuickSave, setShowQuickSave]     = useState(false)
  const [saveAmt, setSaveAmt]                 = useState('')
  const withdrawalBlocked = WITHDRAWAL_BLOCKED.has(goal.withdrawalStatus)

  function submitQuickSave() {
    const num = Number(saveAmt.replace(/[^0-9.]/g, ''))
    if (num < 100) return
    onQuickSave(goal.id, num)
    setShowQuickSave(false)
    setSaveAmt('')
  }

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
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.8px] shrink-0"
                style={{ background: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.28)' }}
              >
                <ArrowUpRight size={8} strokeWidth={3} /> Withdrawn
              </span>
            ) : isCompleted ? (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.8px] shrink-0"
                style={{ background: 'rgba(201,162,39,0.12)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)' }}
              >
                <Check size={8} strokeWidth={3} /> Completed
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.8px] shrink-0"
                style={{ background: TEAL_BG, color: TEAL, border: `1px solid ${TEAL_BORDER}` }}
              >
                <Zap size={8} strokeWidth={3} /> Active
              </span>
            )}
            <h3 className="text-[13px] font-black text-[var(--c-text)] m-0 truncate tracking-[-0.2px]">
              {goal.name}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {goal.apy > 0 && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tabular-nums"
                style={{ background: 'var(--c-accent-soft)', color: 'var(--c-accent)', border: '1px solid var(--c-accent-border)' }}
              >
                <Percent size={8} /> {goal.apy}%
              </span>
            )}
            {isPaused && !isCompleted && !isWithdrawn && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: 'rgba(251,146,60,0.1)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)' }}
              >
                <Pause size={8} strokeWidth={2.5} /> Paused
              </span>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <CircleRing pct={goal.progress} size={76} stroke={7} />
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

        {/* Bottom bar */}
        <div className="mt-3 pt-3 border-t border-[var(--c-border-soft)]">
          <AnimatePresence mode="wait">
            {!isCompleted && !isWithdrawn && showQuickSave ? (
              <motion.div
                key="quicksave"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-2"
              >
                <p className="text-[10.5px] font-semibold text-[var(--c-text-muted)] m-0">
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
                      className="w-full h-8 pl-7 pr-3 rounded-lg text-[12px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                      style={{ background: 'var(--c-surface-soft)' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setShowQuickSave(false); setSaveAmt('') }}
                    className="inline-flex items-center px-3 h-8 rounded-lg font-bold text-[11px] border border-[var(--c-border)] text-[var(--c-text-muted)] bg-[var(--c-surface-soft)] transition active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submitQuickSave}
                    disabled={quickSaving || Number(saveAmt.replace(/[^0-9.]/g, '')) < 100}
                    className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg font-bold text-[11px] border transition active:scale-95 disabled:opacity-50"
                    style={{ background: TEAL_BG, borderColor: TEAL_BORDER, color: TEAL }}
                  >
                    {quickSaving
                      ? <Loader2 size={11} className="animate-spin" />
                      : <><ArrowDownLeft size={11} strokeWidth={2.5} /> Deposit</>
                    }
                  </button>
                </div>
              </motion.div>

            ) : !isCompleted && !isWithdrawn && confirmWithdraw ? (
              <motion.div
                key="warn"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="rounded-xl p-3 flex flex-col gap-2"
                style={{ background: 'rgba(251,146,60,0.07)', border: '1px solid rgba(251,146,60,0.22)' }}
              >
                <p className="text-[11px] font-semibold leading-relaxed m-0" style={{ color: '#fb923c' }}>
                  Early withdrawal ends this goal.
                  {goal.penalty > 0
                    ? ` A ${goal.penalty}% penalty will be deducted from your balance before it is returned to your wallet.`
                    : ' Your saved funds will be returned to your wallet.'}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmWithdraw(false)}
                    className="inline-flex items-center px-3 h-7 rounded-lg font-bold text-[11px] border border-[var(--c-border)] text-[var(--c-text-muted)] bg-[var(--c-surface-soft)] transition active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => { setConfirmWithdraw(false); onWithdraw(goal.id) }}
                    disabled={withdrawing}
                    className="inline-flex items-center gap-1.5 px-3 h-7 rounded-lg font-bold text-[11px] border transition active:scale-95 disabled:opacity-60"
                    style={{ background: 'rgba(251,146,60,0.12)', borderColor: 'rgba(251,146,60,0.35)', color: '#fb923c' }}
                  >
                    {withdrawing
                      ? <Loader2 size={11} className="animate-spin" />
                      : <><ArrowUpRight size={11} strokeWidth={2.5} /> Yes, withdraw</>
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
                  className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg font-bold text-[11px] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] bg-[var(--c-surface-soft)] transition hover:text-[var(--c-text)] hover:border-[var(--c-border)] active:scale-95"
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
                        ? <><Play size={11} strokeWidth={2.5} /> Resume</>
                        : <><Pause size={11} strokeWidth={2.5} /> Pause</>
                    }
                  </button>
                )}

                {!isCompleted && !isWithdrawn && (
                  withdrawalBlocked ? (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg font-bold text-[11px] border ml-auto cursor-default select-none capitalize"
                      style={{ background: 'rgba(251,146,60,0.07)', borderColor: 'rgba(251,146,60,0.25)', color: '#fb923c' }}
                    >
                      Withdrawal {goal.withdrawalStatus}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmWithdraw(true)}
                      disabled={withdrawing}
                      className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg font-bold text-[11px] border border-[var(--c-border)] text-[var(--c-text-muted)] bg-[var(--c-surface-soft)] transition hover:border-[var(--c-border-strong)] active:scale-95 disabled:opacity-60 ml-auto"
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
    </motion.article>
  )
}

/* ── Page ─────────────────────────────────────────────────── */

export default function DesktopTargetSavings() {
  const { alert } = useAlert()
  const { plans: rawProducts, investments, creating, create, withdraw, refresh } = useSavingsOverview()

  const [showModal, setShowModal]         = useState(false)
  const [success, setSuccess]             = useState(null)
  const [schedulingId, setSchedulingId]   = useState(null)
  const [withdrawingId, setWithdrawingId] = useState(null)
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
      product_id: targetProduct.id,
      name: payload.name,
      initial_amount: payload.amount,
      goal_amount: payload.goal,
      ...(payload.contribution ? { contribution_amount: payload.contribution, frequency: payload.frequency } : {}),
      start_date: payload.startDate || null,
      maturity_date: payload.maturityDate || null,
    })
    if (r.success) {
      setSuccess({
        name: payload.name,
        category: payload.category || null,
        principal: payload.amount,
        goal: payload.goal,
        apy: payload.apy,
        frequency: payload.frequency || null,
        startDate: fmtDate(payload.startDate),
        maturityDate: fmtDate(payload.maturityDate),
      })
      alert({ type: 'success', title: 'Goal created', message: `${payload.name} is now active` })
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
      alert({ type: 'success', title: 'Saved!', message: `${fmtN(amount)} added to your goal.` })
    } else {
      alert({ type: 'error', title: 'Deposit failed', message: r?.message || 'Could not process deposit.' })
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
    if (r.success) { refresh(); alert({ type: 'success', title: 'Schedule paused', message: 'Auto save has been paused.' }) }
    else alert({ type: 'error', title: 'Could not pause', message: r.message || 'Failed to pause schedule.' })
  }

  async function handleResume(id) {
    setSchedulingId(id)
    const r = await setScheduleStatus(id, 'resume')
    setSchedulingId(null)
    if (r.success) { refresh(); alert({ type: 'success', title: 'Schedule resumed', message: 'Auto save has been resumed.' }) }
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

      {/* All goals */}
      {allGoals.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2 className="inline-flex items-center gap-2 text-[14px] font-black m-0 text-[var(--c-text)] tracking-[-0.2px]">
              <Target size={14} style={{ color: TEAL }} /> All goals
            </h2>
            <span className="text-[10.5px] font-semibold text-[var(--c-text-muted)]">{allGoals.length}</span>
          </div>
          <div className="grid grid-cols-1 min-[860px]:grid-cols-2 min-[1200px]:grid-cols-3 gap-3">
            {allGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onWithdraw={handleWithdraw}
                withdrawing={withdrawingId === goal.id}
                scheduling={schedulingId === goal.id}
                onPause={handlePause}
                onResume={handleResume}
                onHistory={setHistoryGoal}
                onQuickSave={handleQuickSave}
                quickSaving={quickSavingId === goal.id}
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

      {/* Create goal modal */}
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

      {/* History modal */}
      <AnimatePresence>
        {historyGoal && (
          <TargetHistoryModal
            goal={historyGoal}
            onClose={() => setHistoryGoal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
