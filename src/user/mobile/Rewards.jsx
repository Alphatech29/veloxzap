import { useState } from 'react'
import { motion } from 'framer-motion'
import useSettings from '../../hooks/useSettings'
import useUser from '../../hooks/useUser'
import useReferrals from '../../hooks/useReferrals'
import useRewardRules from '../../hooks/useRewardRules'
import useRewardTransactions from '../../hooks/useRewardTransactions'
import { claimRewardTransaction } from '../../services/rewardRules'
import { useAlert } from '../../components/ui/Alert'
import {
  Sparkles, TrendingUp, Crown, Star,
  ArrowUpRight, Zap, Users, ChevronRight, Coins, Lock, Check,
  Copy, Share2, UserPlus, Wallet, ShieldCheck, Send, MailPlus,
  Fingerprint,
} from 'lucide-react'
import MobilePageHeader from '../../components/partials/MobilePageHeader'

const EARN_META = [
  { id: 'swap',      label: 'Crypto swap',       sourceType: 'crypto_swap',     fallbackRate: '5× pts',  icon: TrendingUp },
  { id: 'bills',     label: 'Bills & utilities', sourceType: 'bills',           fallbackRate: '2× pts',  icon: Zap },
  { id: 'gift_card', label: 'Giftcard trades',  sourceType: 'giftcard_trade', fallbackRate: '3× pts',  icon: Coins },
]

const SOURCE_LABELS = {
  bills:          'Bills payment',
  bill_payment:   'Bills payment',
  crypto_swap:    'Crypto swap',
  card_spend:     'Card spending',
  giftcard_trade: 'Giftcard trade',
  signup_bonus:   'Sign-up bonus',
  referral:       'Referral bonus',
}

const PERKS = [
  { id: '1', label: 'Free monthly transfer', cost: 250,  icon: Zap,        unlocked: true },
  { id: '2', label: 'Premium card design',   cost: 1500, icon: Star,       unlocked: true },
  { id: '3', label: 'Higher daily limits',   cost: 3000, icon: TrendingUp, unlocked: false },
  { id: '4', label: 'VIP support line',      cost: 5000, icon: Crown,      unlocked: false },
]

const LIST = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const ITEM = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
}

function fmt(n) { return Number(n).toLocaleString('en-NG') }
function fmtN(n) { return '₦' + fmt(n) }

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() }
function formatName(name) {
  if (!name) return 'Friend'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return cap(parts[0])
  return `${cap(parts[0])} ${cap(parts[1]).charAt(0)}.`
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const diff = Math.floor((Date.now() - d) / 1000)
  if (diff < 60)     return 'Just now'
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  if (diff < 172800) return 'Yesterday'
  return d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
}

export default function MobileRewards() {
  const [copied, setCopied]   = useState(null)
  const [claiming, setClaiming] = useState(null)
  const { settings }                                                         = useSettings()
  const { user }                                                             = useUser()
  const { alert }                                                            = useAlert()
  const { referrals, total: friends, pending, pendingPayout, totalEarned }  = useReferrals()
  const { getRuleFor }                                                       = useRewardRules()
  const { transactions, earnedPoints, redeemedPoints, refresh }              = useRewardTransactions()

  const referralCode = user?.referral_code ?? ''
  const siteUrl      = settings?.site_url ? settings.site_url.replace(/\/$/, '') : 'https://yourwebsite.com'
  const referralLink = referralCode ? `${siteUrl}/auth/register?ref=${referralCode}` : ''
  const perReferral  = settings?.referral_rewards ? Number(settings.referral_rewards) : 1000
  const friendBonus  = 500

  const cashback   = Number(user?.referral_balance ?? 0)
  const earned     = totalEarned
  const points     = Math.max(0, earnedPoints - redeemedPoints)
  const nextTierAt = 5000
  const progress   = Math.min(100, (points / nextTierAt) * 100)

  const EARN = [
    { id: 'refer', label: 'Refer a friend', rate: fmtN(perReferral), icon: Users, cash: true },
    ...EARN_META.map(m => {
      const rule = getRuleFor(m.sourceType)
      const rate = rule
        ? (rule.multiplier !== 1 ? `${rule.multiplier}× pts` : `${rule.points} pts`)
        : m.fallbackRate
      return { ...m, rate }
    }),
  ]

  const recentRows = [
    ...referrals.map(r => ({
      id:        r.id,
      title:     `Referral · ${formatName(r.full_name)}`,
      amount:    r.reward,
      kind:      'cash',
      meta:      timeAgo(r.createdAt),
      status:    r.status === 'paid' ? 'Claimed' : 'Pending',
      claimed:   r.status === 'paid',
      _date:     r.createdAt,
    })),
    ...transactions.map(t => ({
      id:     t.id,
      title:  SOURCE_LABELS[t.sourceType] ?? t.sourceType ?? 'Transaction',
      amount: t.points,
      kind:   'pts',
      type:   t.type,
      meta:   timeAgo(t.createdAt),
      _date:  t.createdAt,
    })),
  ]
    .filter(r => r.kind === 'cash' ? r.amount > 0 : true)
    .sort((a, b) => new Date(b._date) - new Date(a._date))
    .slice(0, 6)

  async function handleClaim(id) {
    if (claiming === id) return
    setClaiming(id)
    const result = await claimRewardTransaction(id)
    setClaiming(null)
    if (result.success) {
      refresh()
      alert({ type: 'success', title: 'Reward claimed!', message: 'Your points have been claimed successfully.' })
    } else {
      alert({ type: 'error', title: 'Claim failed', message: result.message || 'Could not claim reward. Please try again.' })
    }
  }

  function handleCopy(key, value) {
    if (!value) return
    navigator.clipboard?.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 1800)
  }

  async function handleShare() {
    const text = `Join me on VeloxZap and get ₦${fmt(friendBonus)} bonus. Use my code ${referralCode}`
    if (navigator.share) {
      try { await navigator.share({ title: 'VeloxZap', text, url: referralLink }) } catch {}
    } else {
      handleCopy('share', `${text} — ${referralLink}`)
    }
  }

  return (
    <div className="flex flex-col gap-3.5">
      <MobilePageHeader
        title="Earn rewards"
      />

      {/* ── Hero ── */}
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-[18px] border border-[rgba(201,162,39,0.28)] shadow-[0_14px_36px_-12px_rgba(2,7,23,0.55)]"
        style={{ background: 'linear-gradient(140deg,#0d2657 0%,#091a3a 55%,#040e24 100%)' }}
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.22)' }} />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(232,197,71,0.12)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(201,162,39,0.18) 1px,transparent 1px)', backgroundSize: '18px 18px' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,162,39,0.7),transparent)' }} />

        <div className="relative p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1 text-[8.5px] uppercase tracking-[1.4px] font-bold text-brand-accent">
              <Sparkles size={8} /> Points balance
            </span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-[0.8px] text-brand-accent" style={{ background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)' }}>
              <Star size={7} strokeWidth={3} /> Gold
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-0.5">
            <span className="text-[34px] font-black tracking-[-2px] text-white leading-none tabular-nums">
              {fmt(points)}
            </span>
            <span className="text-[11px] font-bold text-white/40 tracking-[1.5px]">PTS</span>
          </div>


          <div className="pt-3 border-t border-white/[0.07]">
            <div className="flex items-center justify-between mb-1.5 text-[9.5px]">
              <span className="font-semibold text-white/70">
                Next tier: <span className="text-brand-accent font-bold">Platinum</span>
              </span>
              <span className="tabular-nums font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {fmt(points)} <span style={{ color: 'rgba(255,255,255,0.3)' }}>/ {fmt(nextTierAt)}</span>
              </span>
            </div>
            <div className="relative w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: 'linear-gradient(90deg,#C9A227,#f0d060)', boxShadow: '0 0 10px rgba(201,162,39,0.5)' }}
              />
            </div>
            <p className="text-[9px] m-0 mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {fmt(Math.max(0, nextTierAt - points))} pts away from Platinum
            </p>
          </div>

          {/* 4-stat grid */}
          <div className="grid grid-cols-2 gap-1.5 mt-3">
            {[
              { label: 'Referral balance', value: fmtN(cashback),    accent: true },
              { label: 'Cash earned',      value: fmtN(earned) },
              { label: 'Friends joined',   value: fmt(friends) },
              { label: 'Unclaimed',        value: fmtN(pendingPayout), sub: `${pending} referral${pending !== 1 ? 's' : ''}` },
            ].map(({ label, value, sub, accent }) => (
              <div
                key={label}
                className="flex flex-col justify-between p-2.5 rounded-[10px]"
                style={{
                  background: accent ? 'rgba(201,162,39,0.12)' : 'rgba(255,255,255,0.04)',
                  border: accent ? '1px solid rgba(201,162,39,0.25)' : '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <p className="text-[8px] uppercase tracking-[0.8px] font-bold m-0" style={{ color: accent ? '#C9A227' : 'rgba(255,255,255,0.4)' }}>
                  {label}
                </p>
                <div>
                  <p className="text-[14px] font-black tabular-nums tracking-[-0.5px] m-0 mt-1 leading-none" style={{ color: accent ? '#C9A227' : '#fff' }}>
                    {value}
                  </p>
                  {sub && <p className="text-[8px] m-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{sub}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.article>

      {/* ── Refer & earn ── */}
      <article
        className="relative overflow-hidden rounded-[18px] border border-[var(--c-accent-border)]"
        style={{ background: 'var(--c-surface)' }}
      >
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.08)' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,162,39,0.4),transparent)' }} />

        <div className="relative p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0 border border-[rgba(232,197,71,0.45)]"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', boxShadow: '0 4px 14px rgba(201,162,39,0.3)', color: '#0A1F44' }}
            >
              <UserPlus size={15} strokeWidth={2.2} />
            </span>
            <div>
              <p className="text-[8.5px] uppercase tracking-[1.2px] text-brand-accent font-bold m-0">Refer & earn cash</p>
              <h2 className="text-[17px] font-black text-[var(--c-text)] m-0 tracking-[-0.4px] leading-tight">
                {fmtN(perReferral)} <span className="text-[var(--c-text-muted)] font-semibold text-[12px]">per friend</span>
              </h2>
            </div>
          </div>

          <p className="text-[11px] text-[var(--c-text-muted)] m-0 leading-relaxed mb-3.5">
            Paid directly to your wallet the moment your friend completes their first deposit. Your friend also gets a {fmtN(friendBonus)} welcome bonus.
          </p>

          {/* 3-step how-it-works */}
          <div className="grid grid-cols-3 gap-1.5 mb-4">
            {[
              { n: '01', label: 'Share code',    desc: 'Send to friends or family' },
              { n: '02', label: 'They sign up',  desc: 'Using your code at signup' },
              { n: '03', label: 'You both earn', desc: 'Cash hits your wallet' },
            ].map(({ n, label, desc }) => (
              <div key={n} className="flex flex-col gap-1.5 p-2 rounded-[10px] border border-[var(--c-border-soft)]" style={{ background: 'var(--c-surface-soft)' }}>
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-black text-brand-primary border border-[rgba(232,197,71,0.5)]"
                  style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)' }}
                >
                  {n}
                </span>
                <p className="text-[9.5px] font-bold text-[var(--c-text)] m-0 leading-tight">{label}</p>
                <p className="text-[8.5px] text-[var(--c-text-muted)] m-0 leading-snug">{desc}</p>
              </div>
            ))}
          </div>

          {/* Premium referral card visual */}
          <div
            className="relative overflow-hidden rounded-xl p-3.5 mb-2.5"
            style={{
              background: 'linear-gradient(135deg,#0d2657 0%,#142A5C 50%,#091a3a 100%)',
              border: '1px solid rgba(201,162,39,0.25)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
            }}
          >
            <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.2)' }} />
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px,transparent 1px)', backgroundSize: '12px 12px' }} />
            <div className="relative flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1 text-[8px] uppercase tracking-[1.4px] text-white/40 font-bold">
                <Fingerprint size={9} /> Referral Card
              </span>
              <span className="text-[9px] font-black text-brand-accent tracking-[1px]">VeloxZap</span>
            </div>
            <p className="relative text-[20px] font-black text-brand-accent tracking-[3px] m-0 leading-none">
              {referralCode || '——'}
            </p>
            <div className="relative flex items-center justify-between mt-3">
              <div>
                <p className="text-[7.5px] uppercase tracking-[1px] text-white/35 font-bold m-0">Referral Code</p>
                <p className="text-[9px] text-white/55 m-0 mt-0.5 font-medium">{user?.full_name || 'Your account'}</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('code', referralCode)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-[8px] text-[9.5px] font-bold transition active:scale-95"
                style={copied === 'code'
                  ? { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
                  : { background: 'rgba(201,162,39,0.15)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)' }}
              >
                {copied === 'code' ? <><Check size={9} strokeWidth={3} /> Copied</> : <><Copy size={9} /> Copy</>}
              </button>
            </div>
          </div>

          {/* Referral link row */}
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-[10px] border border-[var(--c-border)] mb-2.5" style={{ background: 'var(--c-surface-soft)' }}>
            <span className="flex-1 min-w-0 text-[9.5px] font-mono text-[var(--c-text-muted)] truncate">
              {referralLink || 'Loading…'}
            </span>
            <button
              type="button"
              onClick={() => handleCopy('link', referralLink)}
              disabled={!referralLink}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-[8px] text-[9.5px] font-bold transition active:scale-95 shrink-0"
              style={copied === 'link'
                ? { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
                : { background: 'var(--c-surface-soft-2)', color: 'var(--c-text-muted)', border: '1px solid var(--c-border-soft)' }}
            >
              {copied === 'link' ? <><Check size={9} strokeWidth={3} /> Copied</> : <><Copy size={9} /> Copy</>}
            </button>
          </div>

          {/* Share channels */}
          <div className="grid grid-cols-3 gap-1.5 mb-2.5">
            {[
              { id: 'whatsapp', label: 'WhatsApp', icon: Send },
              { id: 'email',    label: 'Email',    icon: MailPlus },
              { id: 'copy',     label: 'Copy link', icon: Copy },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={id === 'copy'
                  ? () => handleCopy('share', `Join VeloxZap with code ${referralCode} — ${referralLink}`)
                  : handleShare}
                className="group flex flex-col items-center gap-1 py-2 rounded-[10px] border transition active:scale-95"
                style={{ background: 'var(--c-surface-soft)', borderColor: 'var(--c-border-soft)' }}
              >
                <Icon size={12} className="text-brand-accent" />
                <span className="text-[8.5px] font-bold text-[var(--c-text-muted)]">{label}</span>
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-1.5 w-full h-[40px] rounded-[11px] font-bold text-[12px] transition active:scale-[0.99]"
            style={{
              background: 'linear-gradient(135deg,#C9A227,#f0d060)',
              color: '#0A1F44',
              border: '1px solid rgba(232,197,71,0.5)',
              boxShadow: '0 6px 20px -4px rgba(201,162,39,0.5)',
            }}
          >
            <Share2 size={13} strokeWidth={2.6} /> Share & earn {fmtN(perReferral)}
          </button>
        </div>
      </article>

      {/* ── Cashback claim ── */}
      <button
        type="button"
        className="group relative overflow-hidden flex items-center gap-2.5 p-3 rounded-[16px] text-left transition active:scale-[0.995]"
        style={{
          background: 'var(--c-surface)',
          border: '1px solid var(--c-accent-border)',
          boxShadow: '0 4px 20px rgba(201,162,39,0.08)',
        }}
      >
        <span
          className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
          style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 4px 16px rgba(201,162,39,0.32)', color: '#0A1F44' }}
        >
          <Coins size={17} strokeWidth={2} />
        </span>
        <div className="relative flex-1 min-w-0">
          <p className="text-[8.5px] uppercase tracking-[1px] text-brand-accent font-bold m-0">Referral balance</p>
          <p className="text-[18px] font-black text-[var(--c-text)] m-0 mt-0.5 tabular-nums tracking-[-0.5px] leading-tight">{fmtN(cashback)}</p>
          <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 mt-0.5">Bills, swaps & card spending</p>
        </div>
        <span
          className="relative inline-flex items-center gap-0.5 px-2.5 py-1 rounded-[10px] font-bold text-[10.5px] shrink-0"
          style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 3px 10px rgba(201,162,39,0.28)' }}
        >
          Claim <ArrowUpRight size={11} strokeWidth={2.6} />
        </span>
      </button>

      {/* ── Ways to earn ── */}
      <section>
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <h3 className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[1.2px] font-semibold text-[var(--c-text-muted)] m-0">
            <Sparkles size={10} className="text-brand-accent" /> Ways to earn
          </h3>
          <span className="text-[9px] text-[var(--c-text-muted)] font-semibold">{EARN.length} methods</span>
        </div>
        <motion.div
          variants={LIST}
          initial="hidden"
          animate="show"
          className="rounded-[16px] border border-[var(--c-border)] overflow-hidden"
          style={{ background: 'var(--c-surface)' }}
        >
          <div className="grid grid-cols-2 gap-px" style={{ background: 'var(--c-border)' }}>
            {EARN.map(({ id, label, rate, icon: Icon, cash }) => (
              <motion.div key={id} variants={ITEM} className="flex items-center gap-2 p-3" style={{ background: 'var(--c-surface)' }}>
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-[9px] border shrink-0"
                  style={{ background: 'var(--c-accent-soft-2)', borderColor: 'var(--c-accent-border)', color: '#C9A227' }}
                >
                  <Icon size={13} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-[var(--c-text)] m-0 truncate">{label}</p>
                  <p className="text-[9.5px] text-brand-accent font-black m-0 mt-0.5 inline-flex items-center gap-0.5 tabular-nums">
                    {cash && <Wallet size={8} strokeWidth={2.8} />}{rate}{cash ? ' cash' : ''}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Perks store ── */}
      <section>
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <h3 className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[1.2px] font-semibold text-[var(--c-text-muted)] m-0">
            <Star size={10} className="text-brand-accent" /> Perks store
          </h3>
          <span className="text-[9px] text-[var(--c-text-muted)] tabular-nums">
            {PERKS.filter(p => p.unlocked || points >= p.cost).length}/{PERKS.length} unlocked
          </span>
        </div>
        <motion.ul
          variants={LIST}
          initial="hidden"
          animate="show"
          className="list-none m-0 p-0 rounded-[16px] border border-[var(--c-border)] overflow-hidden"
          style={{ background: 'var(--c-surface)' }}
        >
          {PERKS.map(({ id, label, cost, icon: Icon, unlocked }, i) => {
            const reachable = unlocked || points >= cost
            return (
              <motion.li key={id} variants={ITEM} className={i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}>
                <div className="flex items-center gap-2.5 px-3 py-2.5">
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-[9px] border shrink-0"
                    style={reachable
                      ? { background: 'var(--c-accent-soft-2)', borderColor: 'var(--c-accent-border)', color: '#C9A227' }
                      : { background: 'var(--c-surface-soft)', borderColor: 'var(--c-border-soft)', color: 'var(--c-text-faint)' }}
                  >
                    <Icon size={13} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold m-0 truncate" style={{ color: reachable ? 'var(--c-text)' : 'var(--c-text-muted)' }}>
                      {label}
                    </p>
                    <p className="text-[9px] text-[var(--c-text-muted)] m-0 mt-0.5 inline-flex items-center gap-0.5 tabular-nums">
                      <Coins size={8} className="text-brand-accent" /> {fmt(cost)} pts
                    </p>
                  </div>
                  {reachable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-0.5 px-2 py-1 rounded-[8px] text-[9.5px] font-bold transition active:scale-95 shrink-0"
                      style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 3px 10px rgba(201,162,39,0.22)' }}
                    >
                      <Check size={9} strokeWidth={3} /> Claim
                    </button>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-[8px] text-[9px] font-bold shrink-0"
                      style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border-soft)', color: 'var(--c-text-faint)' }}
                    >
                      <Lock size={8} /> Locked
                    </span>
                  )}
                </div>
              </motion.li>
            )
          })}
        </motion.ul>
      </section>

      {/* ── Recent earnings ── */}
      <section>
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <h3 className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[1.2px] font-semibold text-[var(--c-text-muted)] m-0">
            <Coins size={10} className="text-brand-accent" /> Recent earnings
          </h3>
          <button type="button" className="inline-flex items-center gap-0.5 text-[9.5px] font-semibold text-brand-accent active:scale-95 transition">
            See all <ChevronRight size={10} />
          </button>
        </div>
        <ul className="list-none m-0 p-0 rounded-[16px] border border-[var(--c-border)] overflow-hidden" style={{ background: 'var(--c-surface)' }}>
          {recentRows.length === 0 ? (
            <li className="px-3 py-4 text-center text-[10px] text-[var(--c-text-muted)]">No recent earnings yet</li>
          ) : recentRows.map((r, i) => {
            const isCash = r.kind === 'cash'
            return (
              <li key={r.id} className={i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5 px-3 py-2.5">
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-[8px] border shrink-0"
                    style={isCash
                      ? { background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', borderColor: 'rgba(232,197,71,0.5)' }
                      : { background: 'var(--c-accent-soft)', borderColor: 'var(--c-accent-border)', color: '#C9A227' }}
                  >
                    {isCash ? <Wallet size={11} strokeWidth={2.4} /> : <Coins size={11} strokeWidth={2.4} />}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11.5px] font-semibold text-[var(--c-text)] truncate">{r.title}</span>
                    <span className="text-[9px] text-[var(--c-text-muted)] mt-0.5">{r.meta}</span>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span
                      className="text-[11.5px] font-bold tabular-nums whitespace-nowrap"
                      style={{ color: isCash ? 'var(--c-success)' : '#C9A227' }}
                    >
                      {isCash ? `+₦${fmt(r.amount)}` : `+${fmt(r.amount)} pts`}
                    </span>
                    {/* referral rows: status badge only */}
                    {isCash && r.status && (
                      <span
                        className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                        style={r.claimed
                          ? { background: 'rgba(16,185,129,0.1)', color: '#10b981' }
                          : { background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
                      >
                        {r.status}
                      </span>
                    )}
                    {/* reward rows: Claim button, Claimed badge, or Expired badge */}
                    {!isCash && r.type === 'earn' && (
                      <button
                        type="button"
                        disabled={claiming === r.id}
                        onClick={() => handleClaim(r.id)}
                        className="inline-flex items-center gap-0.5 px-2 py-1 rounded-[8px] text-[9px] font-bold transition active:scale-95 disabled:opacity-60 whitespace-nowrap"
                        style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.4)' }}
                      >
                        <Check size={8} strokeWidth={3} />
                        {claiming === r.id ? 'Claiming…' : 'Claim'}
                      </button>
                    )}
                    {!isCash && r.type === 'redeem' && (
                      <span
                        className="text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                        style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                      >
                        Claimed
                      </span>
                    )}
                    {!isCash && r.type === 'expire' && (
                      <span
                        className="text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                      >
                        Expired
                      </span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
          <li className="border-t border-[var(--c-border-soft)]">
            <div className="flex items-center gap-1 px-3 py-2">
              <ShieldCheck size={9} className="text-brand-accent shrink-0" />
              <p className="text-[9px] text-[var(--c-text-muted)] m-0">Earnings settle in real-time</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  )
}
