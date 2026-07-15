import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BottomSheet from '../../../components/internalUI/BottomSheet'
import { useAlert } from '../../../components/ui/Alert'
import { useSavingsOverview } from '../../../hooks/useSavings'
import {
  PiggyBank, TrendingUp, Lock, Wallet, Target, Sparkles, Plus,
  ShieldCheck, Clock, Check, ChevronRight, Percent, Loader2,
} from 'lucide-react'
import MobilePageHeader from '../../../components/partials/MobilePageHeader'

function fmt(n) { return Number(n || 0).toLocaleString('en-NG') }
function fmtN(n) { return '₦' + fmt(Math.round(n || 0)) }

/* ── Display metadata + adapters ─────────────────────────── */

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
    tiers,
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

/* ── Create-plan sheet ─────────────────────────────────────── */

function CreatePlanSheet({ product, onClose, onSubmit, submitting, success }) {
  const Icon = product.icon
  const isFixed  = product.type === 'fixed'
  const isTarget = product.type === 'target'

  const [amount, setAmount]             = useState('')
  const [name, setName]                 = useState('')
  const [tier, setTier]                 = useState(isFixed ? product.tiers?.[1] ?? product.tiers?.[0] : null)
  const [goal, setGoal]                 = useState('')
  const [contribution, setContribution] = useState('')
  const [frequency, setFrequency]       = useState('weekly')

  const numericAmount = Number(amount.replace(/[^0-9.]/g, '')) || 0
  const apy = isFixed ? tier?.apy ?? product.apy : product.apy
  const projectedYear = numericAmount * (1 + apy / 100)
  const valid = numericAmount >= 1000 && name.trim().length > 1
    && (!isTarget || (Number(goal.replace(/[^0-9.]/g, '')) > numericAmount && Number(contribution.replace(/[^0-9.]/g, '')) > 0))

  function submit() {
    if (!valid || submitting) return
    onSubmit({
      name: name.trim(),
      amount: numericAmount,
      apy,
      tier: isFixed ? tier : null,
      duration: isFixed ? tier.label : null,
      goal: isTarget ? Number(goal.replace(/[^0-9.]/g, '')) : null,
      contribution: isTarget ? Number(contribution.replace(/[^0-9.]/g, '')) : null,
      frequency: isTarget ? frequency : null,
    })
  }

  return (
    <BottomSheet
      open onClose={() => !submitting && onClose()}
      label={success ? null : 'New plan'}
      title={success ? null : product.name}
      maxHeight="92vh"
      closeOnScrimClick={!submitting}
    >
      <div className="overflow-y-auto px-5 pb-2">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center pt-4 pb-2"
            >
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ background: 'var(--c-success-bg)', color: 'var(--c-success)' }}
              >
                <Check size={28} strokeWidth={2.6} />
              </motion.span>
              <h3 className="text-[16px] font-black text-[var(--c-text)] m-0 tracking-[-0.3px]">Plan created</h3>
              <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1.5 max-w-[280px] leading-relaxed">
                {fmtN(success.principal)} moved into <span className="font-semibold text-[var(--c-text)]">{success.name}</span> at {success.apy}% p.a.
              </p>

              <div className="w-full mt-5 rounded-2xl border border-[var(--c-border-soft)] overflow-hidden" style={{ background: 'var(--c-surface-soft)' }}>
                {[
                  { label: 'Plan ID',      value: success.id },
                  { label: 'Amount saved', value: fmtN(success.principal) },
                  { label: 'Rate',         value: `${success.apy}% p.a.` },
                  { label: 'Schedule',     value: success.meta },
                ].map((r, i) => (
                  <div key={r.label} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}`}>
                    <span className="text-[10.5px] text-[var(--c-text-muted)] font-medium">{r.label}</span>
                    <span className="text-[12px] font-bold text-[var(--c-text)] tabular-nums">{r.value}</span>
                  </div>
                ))}
              </div>

              <button
                type="button" onClick={onClose}
                className="inline-flex items-center justify-center gap-2 w-full h-[48px] rounded-xl font-bold text-[13px] mt-5 transition active:scale-[0.99]"
                style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
              >
                Done
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-3.5 pb-4"
            >
              <p className="text-[11.5px] text-[var(--c-text-muted)] m-0 leading-relaxed">{product.desc}</p>

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Plan name</span>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder={isTarget ? 'e.g. Dream Car' : isFixed ? 'e.g. 90-Day Lock' : 'e.g. Emergency Fund'}
                  className="h-[46px] px-4 rounded-xl text-[13px] font-semibold text-[var(--c-text)] outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                  style={{ background: 'var(--c-surface-soft)' }}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">
                  {isTarget ? 'Starting amount' : 'Amount to save'}
                </span>
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

              {isFixed && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Lock duration</span>
                  <div className="grid grid-cols-3 gap-2">
                    {product.tiers.map(t => {
                      const active = tier?.id === t.id
                      return (
                        <button
                          key={t.id} type="button" onClick={() => setTier(t)}
                          className="flex flex-col items-center gap-1 py-3 rounded-xl border transition active:scale-95"
                          style={active
                            ? { background: 'var(--c-accent-soft)', borderColor: 'var(--c-accent-border-strong)' }
                            : { background: 'var(--c-surface-soft)', borderColor: 'var(--c-border-soft)' }}
                        >
                          <span className="text-[11.5px] font-bold" style={{ color: active ? 'var(--c-accent)' : 'var(--c-text)' }}>{t.label}</span>
                          <span className="text-[9.5px] font-semibold text-[var(--c-text-muted)]">{t.apy}% p.a.</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {isTarget && (
                <>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Goal amount</span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--c-text-muted)]">₦</span>
                      <input
                        type="text" inputMode="decimal" value={goal} onChange={e => setGoal(e.target.value)}
                        placeholder="1,000,000"
                        className="w-full h-[46px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                        style={{ background: 'var(--c-surface-soft)' }}
                      />
                    </div>
                  </label>
                  <div className="grid grid-cols-[1fr_110px] gap-2.5">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Contribution</span>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--c-text-muted)]">₦</span>
                        <input
                          type="text" inputMode="decimal" value={contribution} onChange={e => setContribution(e.target.value)}
                          placeholder="20,000"
                          className="w-full h-[46px] pl-8 pr-4 rounded-xl text-[14px] font-bold text-[var(--c-text)] tabular-nums outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition"
                          style={{ background: 'var(--c-surface-soft)' }}
                        />
                      </div>
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">Freq.</span>
                      <select
                        value={frequency} onChange={e => setFrequency(e.target.value)}
                        className="h-[46px] px-3 rounded-xl text-[12px] font-semibold text-[var(--c-text)] outline-none border border-[var(--c-border)] focus:border-[var(--c-accent-border-strong)] transition appearance-none"
                        style={{ background: 'var(--c-surface-soft)' }}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </label>
                  </div>
                </>
              )}

              {numericAmount > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-[var(--c-accent-border)]" style={{ background: 'var(--c-accent-soft)' }}>
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0" style={{ background: 'var(--c-accent-soft-2)', color: 'var(--c-accent)' }}>
                    <TrendingUp size={15} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9.5px] uppercase tracking-[1px] font-bold text-brand-accent m-0">Estimated value in 12 months</p>
                    <p className="text-[14px] font-black text-[var(--c-text)] m-0 mt-0.5 tabular-nums tracking-[-0.3px]">
                      {fmtN(projectedYear)} <span className="text-[10.5px] font-semibold text-[var(--c-success)]">+{fmtN(projectedYear - numericAmount)}</span>
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button" onClick={submit} disabled={!valid || submitting}
                className="inline-flex items-center justify-center gap-2 w-full h-[48px] rounded-xl font-bold text-[13px] mt-1 transition active:scale-[0.99] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
              >
                {submitting ? <><Loader2 size={15} className="animate-spin" /> Creating plan…</> : <><PiggyBank size={15} strokeWidth={2.2} /> Create plan</>}
              </button>
              <p className="inline-flex items-center gap-1.5 text-[9.5px] text-[var(--c-text-faint)] justify-center m-0">
                <ShieldCheck size={10} className="text-brand-accent" /> Funds are debited from your wallet balance
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BottomSheet>
  )
}

/* ── Page ──────────────────────────────────────────────────── */

export default function MobileSaving() {
  const { alert } = useAlert()
  const {
    plans: rawProducts,
    investments,
    creating,
    create,
  } = useSavingsOverview()

  const [product, setProduct] = useState(null)
  const [success, setSuccess] = useState(null)

  const products   = useMemo(() => rawProducts.map(mapProductForUI), [rawProducts])
  const plans      = useMemo(() => investments.map(mapAccountForUI), [investments])
  const submitting = creating

  const totalSaved    = useMemo(() => plans.reduce((s, p) => s + p.principal, 0), [plans])
  const totalInterest = useMemo(() => plans.reduce((s, p) => s + p.interestEarned, 0), [plans])
  const avgApy        = useMemo(() => plans.length ? plans.reduce((s, p) => s + p.apy, 0) / plans.length : 0, [plans])
  const activePlans   = useMemo(() => plans.filter(p => p.status === 'active'), [plans])
  const activeCount   = activePlans.length
  const bestProduct   = useMemo(() => products.reduce((best, p) => (!best || p.apy > best.apy) ? p : best, null), [products])

  function openProduct(p) { setProduct(p); setSuccess(null) }
  function closeSheet() { if (!submitting) { setProduct(null); setSuccess(null) } }

  async function handleCreate(payload) {
    if (!product) return
    const body = {
      product_id: product.id,
      name: payload.name,
      initial_amount: payload.amount,
    }
    if (product.type === 'fixed' && payload.tier) {
      body.lock_duration_days = Math.round((payload.tier.minDays + payload.tier.maxDays) / 2)
    }
    if (product.type === 'target') {
      body.goal_amount = payload.goal
      body.contribution_amount = payload.contribution
      body.frequency = payload.frequency
    }

    const r = await create(body)
    if (r.success) {
      const meta = product.type === 'flexible'
        ? 'Interest paid daily'
        : product.type === 'fixed'
          ? `${payload.duration} lock · matures ${r.data?.maturity_date ? new Date(r.data.maturity_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : 'soon'}`
          : `₦${fmt(payload.contribution)} every ${payload.frequency}`
      setSuccess({
        id: r.data?.reference || payload.name,
        name: payload.name, apy: payload.apy,
        principal: payload.amount, meta,
      })
      alert({ type: 'success', title: 'Savings plan created', message: `${fmtN(payload.amount)} is now earning ${payload.apy}% p.a.` })
    } else {
      alert({ type: 'error', title: 'Could not create plan', message: r.message || 'Something went wrong. Please try again.' })
    }
  }

  return (
    <div className="flex flex-col gap-3.5">
      <MobilePageHeader title="Grow your money" />

      {/* ── Hero ── */}
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-[rgba(201,162,39,0.28)] shadow-[0_14px_36px_-12px_rgba(2,7,23,0.55)]"
        style={{ background: 'linear-gradient(140deg,#0d2657 0%,#091a3a 55%,#040e24 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.2)' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,162,39,0.6),transparent)' }} />

        <div className="relative p-4">
          {/* Balance */}
          <span className="flex items-center gap-1 text-[8.5px] uppercase tracking-[1.4px] font-bold text-brand-accent mb-1.5">
            <Sparkles size={8} /> Total saved
          </span>
          <p className="text-[28px] font-black tracking-[-1.2px] text-white leading-none tabular-nums m-0">
            {fmtN(totalSaved)}
          </p>
          <p className="text-[9.5px] mt-1 mb-0" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {activeCount} active plan{activeCount !== 1 ? 's' : ''} · {avgApy.toFixed(1)}% avg APY
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-white/[0.07]">
            {[
              { label: 'Interest',     value: fmtN(totalInterest),                               accent: true },
              { label: 'Active',       value: fmt(activeCount) },
              { label: 'Best rate',    value: bestProduct ? `${bestProduct.apy}%` : '—' },
            ].map(({ label, value, accent }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-[8px] uppercase tracking-[0.8px] font-bold" style={{ color: accent ? '#C9A227' : 'rgba(255,255,255,0.38)' }}>{label}</span>
                <span className="text-[14px] font-black tabular-nums leading-none" style={{ color: accent ? '#C9A227' : '#fff' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.article>

      {/* ── Start saving ── */}
      <div className="flex items-center justify-between mt-1">
        <h2 className="inline-flex items-center gap-1.5 text-[12.5px] font-black m-0 text-[var(--c-text)] tracking-[-0.2px]">
          <Sparkles size={12} className="text-brand-accent" /> Start a new plan
        </h2>
      </div>
      <div className="flex flex-col gap-2.5">
        {products.map(p => {
          const Icon = p.icon
          return (
            <Link
              key={p.id} to={p.href}
              className="group relative overflow-hidden flex items-center gap-3 p-3.5 rounded-[16px] text-left transition active:scale-[0.98]"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
            >
              <span
                className="inline-flex items-center justify-center w-11 h-11 rounded-2xl shrink-0 border"
                style={{ background: `${p.color}1f`, borderColor: `${p.color}55`, color: p.color }}
              >
                <Icon size={18} strokeWidth={2} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0 truncate">{p.name}</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tabular-nums shrink-0" style={{ background: 'var(--c-accent-soft)', color: 'var(--c-accent)', border: '1px solid var(--c-accent-border)' }}>
                    {p.apyLabel}
                  </span>
                </div>
                <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5 truncate">{p.tagline} · {p.desc.split('.')[0]}</p>
              </div>
              <ChevronRight size={15} className="text-[var(--c-text-faint)] shrink-0 transition group-hover:translate-x-0.5" />
            </Link>
          )
        })}
      </div>

      {/* ── My plans ── */}
      <div className="flex items-center justify-between mt-1">
        <h2 className="inline-flex items-center gap-1.5 text-[12.5px] font-black m-0 text-[var(--c-text)] tracking-[-0.2px]">
          <PiggyBank size={12} className="text-brand-accent" /> Your savings plans
        </h2>
        <span className="text-[10px] text-[var(--c-text-muted)] font-semibold">{activePlans.length} active</span>
      </div>
      <article className="rounded-[18px] border border-[var(--c-border)] overflow-hidden" style={{ background: 'var(--c-surface)' }}>
        <ul className="list-none m-0 p-0">
          {activePlans.map((p, i) => {
            const meta = TYPE_META[p.type]
            const TIcon = meta.icon
            return (
              <li key={p.id} className={i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}>
                <div className="flex items-start gap-3 px-4 py-3.5">
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-2xl shrink-0 border"
                    style={{ background: `${meta.color}1f`, borderColor: `${meta.color}55`, color: meta.color }}
                  >
                    <TIcon size={16} strokeWidth={2} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0 truncate">{p.name}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black shrink-0 tabular-nums" style={{ color: meta.color }}>
                        <Percent size={8} /> {p.apy}%
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--c-text-muted)] m-0 mb-1.5">{p.meta}</p>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-[var(--c-text-muted)]">Balance</span>
                      <span className="text-[12.5px] font-black text-[var(--c-text)] tabular-nums">{fmtN(p.principal)}</span>
                    </div>
                    {(p.type === 'target' || p.type === 'fixed') && (
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
                          <span className="text-[9.5px] text-[var(--c-text-faint)]">
                            {p.type === 'target' ? `${p.progress}% of ${fmtN(p.goal)} goal` : `${p.progress}% through term`}
                          </span>
                          <span className="text-[9.5px] font-semibold" style={{ color: meta.color }}>+{fmtN(p.interestEarned)} earned</span>
                        </div>
                      </>
                    )}
                    {p.type === 'flexible' && (
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] text-[var(--c-text-faint)] inline-flex items-center gap-1"><ShieldCheck size={9} /> Withdraw anytime</span>
                        <span className="text-[9.5px] font-semibold" style={{ color: meta.color }}>+{fmtN(p.interestEarned)} earned</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
          {activePlans.length === 0 && (
            <li className="px-5 pt-8 pb-7 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-full blur-2xl scale-125 pointer-events-none" style={{ background: 'rgba(201,162,39,0.2)' }} />
                <div className="relative w-[88px] h-[88px] rounded-[28px] flex items-center justify-center border" style={{ background: 'rgba(201,162,39,0.1)', borderColor: 'rgba(201,162,39,0.28)', color: '#C9A227' }}>
                  <PiggyBank size={42} strokeWidth={1.5} />
                </div>
                <span className="absolute -top-1.5 -right-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.6px]" style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44' }}>
                  <Sparkles size={7} /> Earn
                </span>
              </div>

              <h3 className="text-[14px] font-black text-[var(--c-text)] m-0 tracking-[-0.3px]">No savings plans yet</h3>
              <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-1 max-w-[240px] leading-relaxed">
                Start earning interest on idle money — pick a plan above to get started.
              </p>

              <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
                {[
                  { label: 'Flexible', color: '#60a5fa', Icon: Wallet },
                  { label: 'Fixed',    color: '#C9A227', Icon: Lock },
                  { label: 'Target',   color: '#34d399', Icon: Target },
                ].map(({ label, color, Icon }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10.5px] font-bold border" style={{ background: `${color}18`, borderColor: `${color}45`, color }}>
                    <Icon size={10} strokeWidth={2.2} /> {label}
                  </span>
                ))}
              </div>

              <div className="w-full mt-5 flex flex-col gap-1.5">
                {[
                  { icon: TrendingUp,  label: 'Earn up to 18% per year',    sub: 'Interest accrues automatically' },
                  { icon: ShieldCheck, label: 'Funds are always secure',     sub: 'Withdraw flexible plans anytime' },
                  { icon: Percent,     label: 'No hidden charges',           sub: 'What you see is what you earn' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--c-border-soft)]" style={{ background: 'var(--c-surface-soft)' }}>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-[10px] shrink-0" style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227' }}>
                      <Icon size={13} strokeWidth={2.2} />
                    </span>
                    <div className="min-w-0 text-left">
                      <p className="text-[11px] font-bold text-[var(--c-text)] m-0 leading-none">{label}</p>
                      <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => products[0] && openProduct(products[0])}
                className="inline-flex items-center justify-center gap-2 w-full h-[46px] rounded-xl font-bold text-[13px] mt-5 transition active:scale-[0.99]"
                style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
              >
                <PiggyBank size={15} strokeWidth={2.2} /> Start your first plan
              </button>
            </li>
          )}
        </ul>
      </article>

      {/* ── Sheet ── */}
      <AnimatePresence>
        {product && (
          <CreatePlanSheet
            product={product}
            onClose={closeSheet}
            onSubmit={handleCreate}
            submitting={submitting}
            success={success}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
