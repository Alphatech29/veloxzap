import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles, TrendingUp, Plus, ArrowUpRight, ArrowDownLeft,
  ShieldCheck, Target, Calendar, Check, Lock, PiggyBank, BarChart3,
} from 'lucide-react'
import DatePicker from '../../components/ui/DatePicker'

const TOTAL_SAVED     = 1_070_000
const INTEREST_EARNED = 38_520
const ANNUAL_RATE     = 12

const PLANS = [
  { id: 'p1', name: 'Emergency Fund', icon: ShieldCheck, target: 500_000,   saved: 320_000, rate: 12, due: 'Dec 2025',  status: 'active' },
  { id: 'p2', name: 'MacBook Pro',    icon: Target,      target: 1_200_000, saved: 450_000, rate: 10, due: 'Jun 2026',  status: 'active' },
  { id: 'p3', name: 'Vacation',       icon: TrendingUp,  target: 300_000,   saved: 300_000, rate: 8,  due: 'Completed', status: 'completed' },
]

const STATS = [
  { label: 'Total saved',      value: '₦1,070,000', sub: '+₦38,520 interest' },
  { label: 'Active plans',     value: '2',          sub: '1 completed' },
  { label: 'Interest rate',    value: '12% p.a.',   sub: 'Paid monthly' },
  { label: 'Next payout',      value: 'Jun 1',      sub: '₦9,630 due' },
]

function fmtNGN(n) {
  return '₦' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0,0,0,0)

export default function DesktopFinance() {
  const [planName,   setPlanName]   = useState('')
  const [planAmount, setPlanAmount] = useState('')
  const [planDate,   setPlanDate]   = useState('')

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      {/* Header */}
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
            <Sparkles size={10} /> Finance
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">Savings</h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Earn up to {ANNUAL_RATE}% p.a. · Auto-save · Flexible plans
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[12px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.3)] hover:-translate-y-px active:scale-[0.98] transition"
        >
          <Plus size={13} strokeWidth={2.6} /> New savings plan
        </button>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 min-[960px]:grid-cols-4 gap-3">
        {STATS.map(s => (
          <article key={s.label} className="p-3.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
            <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">{s.label}</p>
            <p className="text-[18px] font-black tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1 tabular-nums">{s.value}</p>
            <p className="text-[10px] text-brand-accent font-semibold m-0 mt-0.5">{s.sub}</p>
          </article>
        ))}
      </div>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">

        {/* Plans list */}
        <div className="flex flex-col gap-4">

          {/* Hero card */}
          <article
            className="relative overflow-hidden rounded-xl p-5 border border-[rgba(201,162,39,0.35)]"
            style={{
              background: 'radial-gradient(540px 220px at 110% -10%, rgba(201,162,39,0.38), transparent 60%), linear-gradient(135deg, rgba(20,42,92,0.97), rgba(10,31,68,1))',
            }}
          >
            <span aria-hidden className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-brand-accent/[0.1] blur-3xl" />
            <div className="relative flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white/[0.12] border border-white/[0.18]">
                    <PiggyBank size={12} className="text-brand-accent" />
                  </span>
                  <p className="text-[10px] uppercase tracking-[1.3px] text-white/60 font-semibold m-0">Total saved</p>
                </div>
                <p className="text-[28px] font-black tracking-[-0.8px] text-white m-0 tabular-nums leading-none">
                  {fmtNGN(TOTAL_SAVED)}
                </p>
                <p className="text-[11px] text-white/60 m-0 mt-1.5">
                  +{fmtNGN(INTEREST_EARNED)} interest earned this year
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.12] border border-white/[0.18] text-[11px] font-bold text-white hover:bg-white/[0.18] active:scale-95 transition">
                  <ArrowDownLeft size={12} /> Add money
                </button>
                <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.08] border border-white/[0.14] text-[11px] font-bold text-white/80 hover:bg-white/[0.14] active:scale-95 transition">
                  <ArrowUpRight size={12} /> Withdraw
                </button>
              </div>
            </div>
          </article>

          {/* Plans */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <h3 className="text-[12px] font-bold text-[var(--c-text)] m-0 mb-3">My savings plans</h3>
            <div className="flex flex-col gap-3">
              {PLANS.map((plan, i) => {
                const pct  = Math.min((plan.saved / plan.target) * 100, 100)
                const done = plan.status === 'completed'
                const Icon = plan.icon
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] hover:border-[var(--c-accent-border)] transition cursor-pointer"
                  >
                    <span className={[
                      'shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-[10px] border',
                      done
                        ? 'bg-[var(--c-success-bg)] border-[var(--c-success-bg)] text-[var(--c-success)]'
                        : 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border-[var(--c-accent-border)] text-brand-accent',
                    ].join(' ')}>
                      {done ? <Check size={14} strokeWidth={2.6} /> : <Icon size={14} strokeWidth={2} />}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0 truncate">{plan.name}</p>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className={[
                            'text-[10px] font-bold',
                            done ? 'text-[var(--c-success)]' : 'text-brand-accent',
                          ].join(' ')}>
                            {plan.rate}% p.a.
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-[var(--c-text-faint)]">
                            <Calendar size={9} /> {plan.due}
                          </span>
                        </div>
                      </div>

                      <div className="h-1.5 rounded-full bg-[var(--c-border)] overflow-hidden mb-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 + i * 0.06 }}
                          className={done
                            ? 'h-full rounded-full bg-[var(--c-success)]'
                            : 'h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-gold-soft'
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 tabular-nums">
                          {fmtNGN(plan.saved)}{' '}
                          <span className="text-[var(--c-text-faint)]">/ {fmtNGN(plan.target)}</span>
                        </p>
                        <p className="text-[10px] text-[var(--c-text-faint)] m-0">{pct.toFixed(0)}% funded</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">

          {/* Create plan card */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-accent-border)] overflow-hidden">
            <header className="px-4 py-3 border-b border-[var(--c-border)] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)]">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)]">
                <Plus size={12} className="text-brand-accent" /> Create a plan
              </h3>
            </header>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)]">Plan name</label>
                <input
                  type="text"
                  value={planName}
                  onChange={e => setPlanName(e.target.value)}
                  placeholder="e.g. New phone"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[12px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] outline-none focus:border-[var(--c-accent-border)] focus:shadow-[0_0_0_3px_rgba(201,162,39,0.1)] transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)]">Target amount (NGN)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={planAmount}
                  onChange={e => setPlanAmount(e.target.value.replace(/[^\d.]/g, ''))}
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[12px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] outline-none focus:border-[var(--c-accent-border)] focus:shadow-[0_0_0_3px_rgba(201,162,39,0.1)] transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)]">Target date</label>
                <DatePicker
                  value={planDate}
                  onChange={setPlanDate}
                  placeholder="Pick a target date"
                  minDate={tomorrow}
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 w-full h-9 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[12px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.28)] hover:-translate-y-px active:scale-[0.98] transition mt-1"
              >
                <Plus size={13} strokeWidth={2.6} /> Create plan
              </button>
            </div>
          </article>

          {/* Interest rates */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)] mb-3">
              <BarChart3 size={11} className="text-brand-accent" /> Interest rates
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { duration: '3 months',  rate: '8%' },
                { duration: '6 months',  rate: '10%' },
                { duration: '12 months', rate: '12%' },
              ].map(r => (
                <div key={r.duration} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
                  <span className="text-[11.5px] font-medium text-[var(--c-text-muted)]">{r.duration}</span>
                  <span className="text-[12px] font-bold text-brand-accent tabular-nums">{r.rate} p.a.</span>
                </div>
              ))}
            </div>
          </article>

          {/* Notice */}
          <article className="rounded-xl border border-[var(--c-border-soft)] bg-[var(--c-surface-soft)] p-3 flex items-start gap-2">
            <Lock size={11} className="text-brand-accent shrink-0 mt-0.5" />
            <div className="leading-snug">
              <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">Early withdrawal penalty</p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                A 2% fee applies for withdrawals before the target date. Interest is paid monthly.
              </p>
            </div>
          </article>

          <p className="inline-flex items-center justify-center gap-1 text-[10px] text-[var(--c-text-muted)]">
            <ShieldCheck size={9} className="text-brand-accent" />
            NDIC insured · Funds secured
          </p>
        </div>
      </section>
    </div>
  )
}
