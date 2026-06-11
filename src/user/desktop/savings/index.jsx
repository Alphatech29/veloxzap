import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAlert } from '../../../components/ui/Alert'
import { useSavingsOverview } from '../../../hooks/useSavings'
import {
  PiggyBank, TrendingUp, Lock, Wallet, Target, Sparkles,
  ShieldCheck, Clock, Check, ChevronRight, Percent,
  Coins, Gauge,
} from 'lucide-react'

function fmt(n) { return Number(n || 0).toLocaleString('en-NG') }
function fmtN(n) { return '₦' + fmt(Math.round(n || 0)) }

/* ── Display metadata + adapters ───────────────────────────── */

const PRODUCT_DISPLAY = {
  flexible: {
    tagline: 'Withdraw anytime',
    icon: Wallet,
    color: '#60a5fa',
    perks: ['No lock-in period', 'Daily interest accrual', 'Instant withdrawals'],
    href: '/user/savings/flexible-savings',
  },
  fixed: {
    tagline: 'Lock & earn more',
    icon: Lock,
    color: '#C9A227',
    perks: ['Flexible lock terms', 'Higher guaranteed rate', 'Payout at maturity'],
    href: '/user/savings/fixed-savings',
  },
  target: {
    tagline: 'Save toward a goal',
    icon: Target,
    color: '#34d399',
    perks: ['Automated contributions', 'Goal progress tracking', 'Completion bonus'],
    href: '/user/savings/target-savings',
  },
}

function mapProductForUI(p) {
  const display = PRODUCT_DISPLAY[p.type] || PRODUCT_DISPLAY.flexible
  const isFixed = p.type === 'fixed'
  const tiers = isFixed && Array.isArray(p.lockDurationTiers)
    ? p.lockDurationTiers.map(t => ({
        id: `${t.min_days}-${t.max_days}`,
        label: `${t.min_days}-${t.max_days} days`,
        apy: Number(t.apy),
        minDays: Number(t.min_days),
        maxDays: Number(t.max_days),
      }))
    : null
  const apy = isFixed && tiers?.length ? Math.max(...tiers.map(t => t.apy)) : p.annualRate
  return {
    id: p.id,
    type: p.type,
    name: p.name,
    tagline: display.tagline,
    apy,
    apyLabel: isFixed ? `Up to ${apy}% p.a.` : `${apy}% p.a.`,
    desc: p.description,
    icon: display.icon,
    color: display.color,
    perks: display.perks,
    href: display.href,
  }
}

function mapAccountForUI(a) {
  const type = a.product_type || a.type || 'flexible'
  const apy = Number(a.apy_at_creation ?? 0)
  const principal = Number(a.principal || 0)
  const interestEarned = Number(a.total_interest_earned || 0)
  const goal = a.goal_amount != null ? Number(a.goal_amount) : null

  let progress, meta
  if (type === 'target') {
    progress = goal > 0 ? Math.min(100, Math.round((principal / goal) * 100)) : 0
    meta = `${fmtN(principal)} of ${fmtN(goal)} goal`
  } else if (type === 'fixed') {
    if (a.start_date && a.maturity_date) {
      const start = new Date(a.start_date).getTime()
      const end = new Date(a.maturity_date).getTime()
      const now = Date.now()
      progress = end > start ? Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100))) : 0
      const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000))
      meta = daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} to maturity` : 'Matured'
    } else {
      progress = 0
      meta = 'Locked savings'
    }
  } else {
    meta = 'Interest paid daily'
  }

  return {
    id: a.id,
    name: a.name || 'Savings plan',
    type,
    apy,
    principal,
    interestEarned,
    status: a.status,
    progress,
    goal,
    meta,
  }
}

const TYPE_META = {
  flexible: { label: 'Flexible', icon: Wallet, color: '#60a5fa' },
  fixed:    { label: 'Fixed',    icon: Lock,   color: '#C9A227' },
  target:   { label: 'Target',   icon: Target, color: '#34d399' },
}

const PROJECTION_MONTHS = [1, 3, 6, 12]

/* ── Page ──────────────────────────────────────────────────── */

export default function DesktopSaving() {
  const { plans: rawProducts, investments } = useSavingsOverview()

  const [projMonths, setProjMonths] = useState(12)

  const products = useMemo(() => rawProducts.map(mapProductForUI), [rawProducts])
  const plans    = useMemo(() => investments.map(mapAccountForUI), [investments])

  const totalSaved    = useMemo(() => plans.reduce((s, p) => s + p.principal, 0), [plans])
  const totalInterest = useMemo(() => plans.reduce((s, p) => s + p.interestEarned, 0), [plans])
  const avgApy        = useMemo(() => plans.length ? plans.reduce((s, p) => s + p.apy, 0) / plans.length : 0, [plans])
  const activeCount   = plans.filter(p => p.status === 'active').length
  const bestProduct   = useMemo(() => products.reduce((best, p) => (!best || p.apy > best.apy) ? p : best, null), [products])

  const projection = useMemo(() => {
    const base = totalSaved || 100000
    const monthlyRate = (avgApy || 9) / 100 / 12
    return PROJECTION_MONTHS.map(m => ({ month: m, value: base * Math.pow(1 + monthlyRate, m) }))
  }, [totalSaved, avgApy])
  const maxProjection = projection[projection.length - 1]?.value || 1

  return (
    <div className="flex flex-col gap-5 max-w-[1240px] mx-auto pb-10">

      {/* ── Header ── */}
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.4px] text-brand-accent font-bold m-0">
            <PiggyBank size={10} /> Save & earn
          </p>
          <h1 className="text-[22px] font-black tracking-[-0.5px] text-[var(--c-text)] m-0 mt-1">
            Grow your money
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Earn up to 18% p.a. — flexible, fixed and goal-based plans
          </p>
        </div>
      </header>

      {/* ── Hero ── */}
      <article
        className="relative overflow-hidden rounded-[24px] border border-[rgba(201,162,39,0.28)] shadow-[0_24px_60px_-20px_rgba(2,7,23,0.6)]"
        style={{ background: 'linear-gradient(140deg,#0d2657 0%,#091a3a 55%,#040e24 100%)' }}
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.2)' }} />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(232,197,71,0.12)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(201,162,39,0.18) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,162,39,0.7),transparent)' }} />

        <div className="relative grid grid-cols-1 min-[860px]:grid-cols-[1.3fr_1fr] gap-0 divide-y min-[860px]:divide-y-0 min-[860px]:divide-x divide-white/[0.07]">
          {/* Left — total saved */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[1.5px] font-bold text-brand-accent">
                <Sparkles size={9} /> Total saved balance
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[1px] text-brand-accent" style={{ background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)' }}>
                <Gauge size={8} strokeWidth={3} /> {avgApy.toFixed(1)}% avg APY
              </span>
            </div>
            <div className="flex items-baseline gap-2.5 mb-1">
              <span className="text-[32px] font-black tracking-[-1.5px] text-white leading-none tabular-nums">
                {fmtN(totalSaved)}
              </span>
            </div>
            <p className="text-[11px] text-white/50 m-0 mb-4">
              Across {activeCount} active plan{activeCount !== 1 ? 's' : ''} · interest accrues daily
            </p>

            {/* Projection bars */}
            <div>
              <div className="flex items-center justify-between text-[10.5px] mb-2.5">
                <span className="font-semibold text-white/70">Projected growth</span>
                <span className="inline-flex items-center gap-1 text-brand-accent font-bold">
                  <TrendingUp size={11} /> at {avgApy.toFixed(1)}% p.a.
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-end h-[60px]">
                {projection.map(({ month, value }) => {
                  const h = Math.max(18, (value / maxProjection) * 100)
                  const active = month === projMonths
                  return (
                    <button
                      key={month} type="button" onClick={() => setProjMonths(month)}
                      className="relative h-full flex flex-col items-center justify-end group"
                    >
                      <span className="text-[9px] font-bold mb-1.5 transition" style={{ color: active ? '#C9A227' : 'rgba(255,255,255,0.35)' }}>
                        {month} mo
                      </span>
                      <motion.span
                        initial={{ height: 0 }} animate={{ height: `${h}%` }}
                        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: month * 0.05 }}
                        className="w-full rounded-md"
                        style={{
                          background: active ? 'linear-gradient(180deg,#f0d060,#C9A227)' : 'rgba(255,255,255,0.1)',
                          boxShadow: active ? '0 0 16px rgba(201,162,39,0.45)' : 'none',
                        }}
                      />
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center justify-between mt-2.5 px-0.5">
                <span className="text-[10px] text-white/35 font-medium">In {projMonths} month{projMonths !== 1 ? 's' : ''}, your savings could grow to</span>
                <span className="text-[13px] font-black text-brand-accent tabular-nums">
                  {fmtN(projection.find(p => p.month === projMonths)?.value || totalSaved)}
                </span>
              </div>
            </div>
          </div>

          {/* Right — stats */}
          <div className="grid grid-cols-2 gap-px p-5">
            {[
              { label: 'Interest earned', value: fmtN(totalInterest), accent: true, icon: Coins },
              { label: 'Active plans',    value: fmt(activeCount), icon: PiggyBank },
              { label: 'Average APY',     value: `${avgApy.toFixed(1)}%`, icon: Percent },
              { label: 'Best rate',       value: bestProduct ? `${bestProduct.apy}% p.a.` : '—', sub: bestProduct?.name, icon: TrendingUp },
            ].map(({ label, value, sub, accent, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col justify-between p-3 rounded-xl"
                style={{
                  background: accent ? 'rgba(201,162,39,0.12)' : 'rgba(255,255,255,0.04)',
                  border: accent ? '1px solid rgba(201,162,39,0.25)' : '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold m-0" style={{ color: accent ? '#C9A227' : 'rgba(255,255,255,0.4)' }}>
                    {label}
                  </p>
                  <Icon size={12} style={{ color: accent ? '#C9A227' : 'rgba(255,255,255,0.3)' }} />
                </div>
                <div>
                  <p className="text-[16.5px] font-black tabular-nums tracking-[-0.4px] m-0 mt-1.5 leading-none" style={{ color: accent ? '#C9A227' : '#fff' }}>
                    {value}
                  </p>
                  {sub && <p className="text-[9.5px] text-white/35 m-0 mt-1">{sub}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* ── Plan types ── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 text-[14px] font-black m-0 text-[var(--c-text)] tracking-[-0.2px]">
            <Sparkles size={14} className="text-brand-accent" /> Choose a plan
          </h2>
          <span className="text-[10.5px] text-[var(--c-text-muted)] font-semibold">{products.length} plan types</span>
        </div>
        <div className="grid grid-cols-1 min-[760px]:grid-cols-3 gap-4">
          {products.map(p => {
            const Icon = p.icon
            return (
              <Link
                key={p.id}
                to={p.href}
                className="group relative overflow-hidden flex flex-col gap-4 p-5 rounded-[20px] text-left transition hover:-translate-y-1 active:scale-[0.99]"
                style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', boxShadow: '0 4px 24px rgba(2,7,23,0.04)' }}
              >
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition" style={{ background: `${p.color}22` }} />
                <div className="relative flex items-center justify-between">
                  <span
                    className="inline-flex items-center justify-center w-12 h-12 rounded-2xl shrink-0 border"
                    style={{ background: `${p.color}1f`, borderColor: `${p.color}55`, color: p.color }}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tabular-nums" style={{ background: 'var(--c-accent-soft)', color: 'var(--c-accent)', border: '1px solid var(--c-accent-border)' }}>
                    {p.apyLabel}
                  </span>
                </div>
                <div className="relative">
                  <p className="text-[9.5px] uppercase tracking-[1.2px] font-bold m-0" style={{ color: p.color }}>{p.tagline}</p>
                  <h3 className="text-[16px] font-black text-[var(--c-text)] m-0 mt-0.5 tracking-[-0.2px]">{p.name}</h3>
                  <p className="text-[11.5px] text-[var(--c-text-muted)] m-0 mt-1.5 leading-relaxed">{p.desc}</p>
                </div>
                <ul className="relative list-none m-0 p-0 flex flex-col gap-1.5">
                  {p.perks.map(perk => (
                    <li key={perk} className="flex items-center gap-2 text-[11px] text-[var(--c-text-muted)] font-medium">
                      <Check size={11} className="text-brand-accent shrink-0" strokeWidth={2.6} />
                      {perk}
                    </li>
                  ))}
                </ul>
                <span className="relative inline-flex items-center gap-1.5 mt-1 text-[12px] font-bold text-brand-accent">
                  Open plan <ChevronRight size={13} className="transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── My plans ── */}
      <article className="rounded-[20px] border border-[var(--c-border)] overflow-hidden" style={{ background: 'var(--c-surface)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--c-border-soft)]">
            <h3 className="inline-flex items-center gap-2 text-[13px] font-bold m-0 text-[var(--c-text)]">
              <PiggyBank size={13} className="text-brand-accent" /> Your savings plans
            </h3>
            <span className="text-[10px] text-[var(--c-text-muted)] font-semibold">{plans.length} total</span>
          </div>
          <ul className="list-none m-0 p-0">
            {plans.map((p, i) => {
              const meta = TYPE_META[p.type]
              const TIcon = meta.icon
              return (
                <li key={p.id} className={i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}>
                  <div className="flex items-start gap-4 px-5 py-4">
                    <span
                      className="inline-flex items-center justify-center w-11 h-11 rounded-2xl shrink-0 border"
                      style={{ background: `${meta.color}1f`, borderColor: `${meta.color}55`, color: meta.color }}
                    >
                      <TIcon size={17} strokeWidth={2} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-[13px] font-bold text-[var(--c-text)] m-0 truncate">{p.name}</p>
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-black shrink-0 tabular-nums" style={{ color: meta.color }}>
                          <Percent size={9} /> {p.apy}% p.a.
                        </span>
                      </div>
                      <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mb-2">{p.meta}</p>

                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] text-[var(--c-text-muted)]">Balance</span>
                        <span className="text-[13px] font-black text-[var(--c-text)] tabular-nums">{fmtN(p.principal)}</span>
                      </div>

                      {p.type === 'target' && (
                        <>
                          <div className="relative w-full h-1.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--c-border-soft)' }}>
                            <motion.div
                              initial={{ width: 0 }} animate={{ width: `${p.progress}%` }}
                              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                              className="absolute inset-y-0 left-0 rounded-full"
                              style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}cc)` }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-[var(--c-text-faint)]">{p.progress}% of {fmtN(p.goal)} goal</span>
                            <span className="text-[10px] font-semibold" style={{ color: meta.color }}>+{fmtN(p.interestEarned)} earned</span>
                          </div>
                        </>
                      )}
                      {p.type === 'fixed' && (
                        <>
                          <div className="relative w-full h-1.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--c-border-soft)' }}>
                            <motion.div
                              initial={{ width: 0 }} animate={{ width: `${p.progress}%` }}
                              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                              className="absolute inset-y-0 left-0 rounded-full"
                              style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}cc)` }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-[var(--c-text-faint)] inline-flex items-center gap-1"><Clock size={9} /> {p.progress}% through term</span>
                            <span className="text-[10px] font-semibold" style={{ color: meta.color }}>+{fmtN(p.interestEarned)} earned</span>
                          </div>
                        </>
                      )}
                      {p.type === 'flexible' && (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[var(--c-text-faint)] inline-flex items-center gap-1"><ShieldCheck size={9} /> Withdraw anytime</span>
                          <span className="text-[10px] font-semibold" style={{ color: meta.color }}>+{fmtN(p.interestEarned)} earned</span>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
            {plans.length === 0 && (
              <li className="px-5 py-10 text-center">
                <p className="text-[12px] text-[var(--c-text-muted)] m-0">No savings plans yet — choose a plan type above.</p>
              </li>
            )}
          </ul>
      </article>
    </div>
  )
}
