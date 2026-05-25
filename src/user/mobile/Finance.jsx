import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Sparkles, TrendingUp, Plus, ArrowUpRight, ArrowDownLeft,
  ShieldCheck, Target, Calendar, ChevronRight, Check, Lock, PiggyBank,
  X, Wallet, BarChart3, Zap,
} from 'lucide-react'
import DatePicker from '../../components/ui/DatePicker'
import BottomSheet from '../../components/internalUI/BottomSheet'

const TOTAL_SAVED     = 1_070_000
const INTEREST_EARNED = 38_520
const ANNUAL_RATE     = 12
const NEXT_PAYOUT     = 9_630

const PLANS = [
  { id: 'p1', name: 'Emergency Fund', icon: ShieldCheck, target: 500_000,   saved: 320_000, rate: 12, due: 'Dec 2025',  status: 'active' },
  { id: 'p2', name: 'MacBook Pro',    icon: Target,      target: 1_200_000, saved: 450_000, rate: 10, due: 'Jun 2026',  status: 'active' },
  { id: 'p3', name: 'Vacation',       icon: TrendingUp,  target: 300_000,   saved: 300_000, rate: 8,  due: 'Completed', status: 'completed' },
]

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(0, 0, 0, 0)

function fmtNGN(n) {
  return '₦' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function fmtShort(n) {
  if (n >= 1_000_000) return '₦' + (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000)     return '₦' + (n / 1_000).toFixed(1) + 'K'
  return '₦' + n
}

export default function MobileFinance() {
  const navigate = useNavigate()
  const [sheetOpen,  setSheetOpen]  = useState(false)
  const [planName,   setPlanName]   = useState('')
  const [planAmount, setPlanAmount] = useState('')
  const [planDate,   setPlanDate]   = useState('')

  useEffect(() => {
    if (!sheetOpen) return
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top      = `-${scrollY}px`
    document.body.style.left     = '0'
    document.body.style.right    = '0'
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.position = ''
      document.body.style.top      = ''
      document.body.style.left     = ''
      document.body.style.right    = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [sheetOpen])

  return (
    <div className="flex flex-col gap-4 pb-2">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => window.history.state?.idx > 0 ? navigate(-1) : navigate('/user/dashboard', { replace: true })}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition"
        >
          <ChevronLeft size={13} /> Back
        </button>
        <span className="inline-flex items-center gap-1 text-[9.5px] uppercase tracking-[1.4px] text-brand-accent font-bold">
          <Sparkles size={9} /> Finance · Savings
        </span>
      </div>

      {/* ── Hero balance card ── */}
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[20px] border border-[rgba(201,162,39,0.3)]"
        style={{
          background: 'linear-gradient(145deg, rgba(14,34,76,1) 0%, rgba(8,22,55,1) 60%, rgba(5,15,40,1) 100%)',
          boxShadow: '0 20px 50px -12px rgba(2,7,23,0.6)',
        }}
      >
        {/* Ambient glows */}
        <span aria-hidden className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C9A227, transparent 70%)' }} />
        <span aria-hidden className="pointer-events-none absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4A6FA5, transparent 70%)' }} />

        {/* Subtle grid texture */}
        <div aria-hidden className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative p-4">
          {/* Label row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md border border-white/[0.15] bg-white/[0.08]">
                <PiggyBank size={10} className="text-brand-accent" />
              </span>
              <span className="text-[9.5px] uppercase tracking-[1.3px] text-white/50 font-semibold">Total saved</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[rgba(110,231,167,0.3)] bg-[rgba(110,231,167,0.08)] text-[9px] font-bold text-[#6EE7A7] uppercase tracking-[0.8px]">
              <span className="w-1 h-1 rounded-full bg-[#6EE7A7] animate-pulse" />
              Active
            </span>
          </div>

          {/* Balance */}
          <p className="text-[28px] font-black tracking-[-1px] text-white tabular-nums leading-none mb-1">
            {fmtNGN(TOTAL_SAVED)}
          </p>
          <p className="text-[10.5px] text-white/45 font-medium mb-4">
            +{fmtNGN(INTEREST_EARNED)} interest earned this year
          </p>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] mb-3" />

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Rate',        value: `${ANNUAL_RATE}%`,          sub: 'per annum' },
              { label: 'Next payout', value: fmtShort(NEXT_PAYOUT),      sub: 'Jun 1' },
              { label: 'Plans',       value: '2 active',                 sub: '1 done' },
            ].map(s => (
              <div key={s.label} className="flex flex-col">
                <span className="text-[8.5px] uppercase tracking-[1px] text-white/35 font-semibold mb-0.5">{s.label}</span>
                <span className="text-[12px] font-bold text-white tabular-nums leading-none">{s.value}</span>
                <span className="text-[9px] text-brand-accent font-medium mt-0.5">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action strip */}
        <div className="relative flex border-t border-white/[0.06]">
          {[
            { label: 'Add Money', icon: ArrowDownLeft, accent: true },
            { label: 'Withdraw',  icon: ArrowUpRight },
            { label: 'New Plan',  icon: Plus, action: () => setSheetOpen(true) },
          ].map(({ label, icon: Icon, accent, action }, i) => (
            <button
              key={label}
              type="button"
              onClick={action}
              className={[
                'flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition active:opacity-70',
                i < 2 ? 'border-r border-white/[0.06]' : '',
                accent ? 'text-brand-accent' : 'text-white/60',
              ].join(' ')}
            >
              <Icon size={13} strokeWidth={2.2} />
              {label}
            </button>
          ))}
        </div>
      </motion.article>

      {/* ── Section title ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-bold text-[var(--c-text)] m-0 leading-none">My savings plans</h2>
          <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">Tap a plan to manage</p>
        </div>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-brand-accent border border-[var(--c-accent-border)] bg-[var(--c-accent-soft)] active:scale-95 transition"
        >
          <Plus size={10} strokeWidth={2.8} /> New
        </button>
      </div>

      {/* ── Plans ── */}
      <div className="flex flex-col gap-2.5">
        {PLANS.map((plan, i) => {
          const pct  = Math.min((plan.saved / plan.target) * 100, 100)
          const done = plan.status === 'completed'
          const Icon = plan.icon
          return (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35, ease: 'easeOut' }}
              className="rounded-[16px] border border-[var(--c-border)] overflow-hidden active:scale-[0.99] transition cursor-pointer"
              style={{ background: 'var(--c-surface)' }}
            >
              {/* Top progress accent line */}
              <div className="h-[2px] w-full bg-[var(--c-border)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + i * 0.07 }}
                  className={done
                    ? 'h-full bg-[var(--c-success)]'
                    : 'h-full bg-gradient-to-r from-brand-accent to-brand-gold-soft'
                  }
                />
              </div>

              <div className="p-3">
                <div className="flex items-center gap-2.5">
                  {/* Icon */}
                  <span className={[
                    'shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-[11px] border',
                    done
                      ? 'bg-[var(--c-success-bg)] border-[var(--c-success-bg)] text-[var(--c-success)]'
                      : 'border-[var(--c-accent-border)] text-brand-accent',
                  ].join(' ')}
                    style={!done ? { background: 'linear-gradient(135deg, var(--c-accent-soft-2), var(--c-accent-soft))' } : undefined}
                  >
                    {done ? <Check size={14} strokeWidth={2.6} /> : <Icon size={14} strokeWidth={1.8} />}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0 truncate">{plan.name}</p>
                      <span className={[
                        'shrink-0 text-[11px] font-black tabular-nums',
                        done ? 'text-[var(--c-success)]' : 'text-[var(--c-text)]',
                      ].join(' ')}>
                        {fmtShort(plan.saved)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[var(--c-text-faint)] tabular-nums">
                        of {fmtShort(plan.target)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={[
                          'text-[9.5px] font-bold',
                          done ? 'text-[var(--c-success)]' : 'text-brand-accent',
                        ].join(' ')}>
                          {plan.rate}% p.a.
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[9.5px] text-[var(--c-text-faint)]">
                          <Calendar size={8} /> {plan.due}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={13} className="text-[var(--c-text-faint)] shrink-0" />
                </div>

                {/* Progress */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-[var(--c-border)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + i * 0.07 }}
                      className={done
                        ? 'h-full rounded-full bg-[var(--c-success)]'
                        : 'h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-gold-soft'
                      }
                    />
                  </div>
                  <span className="text-[9px] font-bold text-[var(--c-text-faint)] tabular-nums shrink-0 w-7 text-right">
                    {pct.toFixed(0)}%
                  </span>
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>

      {/* ── Interest rates ── */}
      <div className="rounded-[16px] border border-[var(--c-border)] overflow-hidden" style={{ background: 'var(--c-surface)' }}>
        <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-[var(--c-border)]">
          <BarChart3 size={11} className="text-brand-accent" />
          <span className="text-[11px] font-bold text-[var(--c-text)]">Interest rates</span>
        </div>
        <div className="divide-y divide-[var(--c-border)]">
          {[
            { duration: '3 months',  rate: '8%',  label: 'Starter' },
            { duration: '6 months',  rate: '10%', label: 'Growth' },
            { duration: '12 months', rate: '12%', label: 'Premium', best: true },
          ].map(r => (
            <div key={r.duration} className="flex items-center justify-between px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <Zap size={10} className={r.best ? 'text-brand-accent' : 'text-[var(--c-text-faint)]'} />
                <div>
                  <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">{r.duration}</p>
                  <p className="text-[9.5px] text-[var(--c-text-faint)] m-0">{r.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {r.best && (
                  <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded-full bg-brand-accent/15 border border-[var(--c-accent-border)] text-brand-accent uppercase tracking-[0.6px]">
                    Best
                  </span>
                )}
                <span className="text-[13px] font-black text-brand-accent tabular-nums">{r.rate}</span>
                <span className="text-[9px] text-[var(--c-text-faint)]">p.a.</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Notice ── */}
      <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-[14px] border border-[var(--c-border-soft)] bg-[var(--c-surface-soft)]">
        <Lock size={11} className="text-brand-accent shrink-0 mt-0.5" />
        <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 leading-relaxed">
          Funds are locked until maturity. A <strong className="text-[var(--c-text)] font-semibold">2% early withdrawal fee</strong> applies. Interest credited monthly.
        </p>
      </div>

      <p className="inline-flex items-center justify-center gap-1 text-[9.5px] text-[var(--c-text-faint)]">
        <ShieldCheck size={9} className="text-brand-accent" /> NDIC insured · 256-bit encrypted
      </p>

      {/* ── New Plan bottom sheet ── */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} maxHeight="85vh">
        {/* Custom gradient header */}
        <div className="flex items-center justify-between px-4 py-3 mx-0 border-b border-[var(--c-border)] shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--c-accent-soft-2), var(--c-accent-soft))' }}
        >
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-[9px] bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.4)]">
              <Wallet size={12} strokeWidth={2} />
            </span>
            <div>
              <p className="text-[9px] uppercase tracking-[1.2px] text-brand-accent font-bold m-0">New savings</p>
              <h3 className="text-[13.5px] font-bold text-[var(--c-text)] m-0 leading-tight">Create a plan</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] active:scale-90 transition"
          >
            <X size={13} />
          </button>
        </div>

        {/* Form */}
        <div className="px-4 pt-4 pb-8 flex flex-col gap-3 overflow-y-auto max-h-[60vh]">

                <div className="flex flex-col gap-1">
                  <label className="text-[9.5px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)]">Plan name</label>
                  <input
                    type="text"
                    value={planName}
                    onChange={e => setPlanName(e.target.value)}
                    placeholder="e.g. Emergency fund"
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[12px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] outline-none focus:border-[var(--c-accent-border)] focus:shadow-[0_0_0_3px_rgba(201,162,39,0.1)] transition"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9.5px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)]">Target amount (NGN)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-brand-accent pointer-events-none">₦</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={planAmount}
                      onChange={e => setPlanAmount(e.target.value.replace(/[^\d.]/g, ''))}
                      placeholder="0.00"
                      className="w-full pl-6 pr-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[12px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] outline-none focus:border-[var(--c-accent-border)] focus:shadow-[0_0_0_3px_rgba(201,162,39,0.1)] transition"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9.5px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)]">Target date</label>
                  <DatePicker value={planDate} onChange={setPlanDate} placeholder="Pick a target date" minDate={tomorrow} />
                </div>

                {/* Rate preview */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { m: '3 mo',  rate: '8%' },
                    { m: '6 mo',  rate: '10%' },
                    { m: '12 mo', rate: '12%', best: true },
                  ].map(r => (
                    <div key={r.m} className={[
                      'flex flex-col items-center py-2 rounded-xl border text-center',
                      r.best
                        ? 'border-[var(--c-accent-border)] bg-[var(--c-accent-soft-2)]'
                        : 'border-[var(--c-border)] bg-[var(--c-surface-soft)]',
                    ].join(' ')}>
                      <span className="text-[11px] font-black text-brand-accent tabular-nums">{r.rate}</span>
                      <span className="text-[8.5px] text-[var(--c-text-faint)]">{r.m}</span>
                      {r.best && <span className="text-[7.5px] font-bold text-brand-accent uppercase tracking-[0.5px] mt-0.5">Best</span>}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 w-full h-[42px] rounded-xl text-[12px] font-bold transition active:scale-[0.98]"
                  style={{
                    background: planName && planAmount && planDate
                      ? 'linear-gradient(135deg, #C9A227, #E8C547)'
                      : 'var(--c-surface-soft)',
                    color: planName && planAmount && planDate ? '#0A1F44' : 'var(--c-text-faint)',
                    border: '1px solid',
                    borderColor: planName && planAmount && planDate ? 'rgba(232,197,71,0.55)' : 'var(--c-border)',
                    boxShadow: planName && planAmount && planDate ? '0 4px 16px rgba(201,162,39,0.28)' : 'none',
                  }}
                >
                  <Plus size={13} strokeWidth={2.6} /> Create plan
                </button>

                <p className="inline-flex items-center justify-center gap-1 text-[9.5px] text-[var(--c-text-faint)] text-center">
                  <Lock size={9} className="text-brand-accent" /> Funds locked until maturity · 2% early exit fee
                </p>
        </div>
      </BottomSheet>
    </div>
  )
}
