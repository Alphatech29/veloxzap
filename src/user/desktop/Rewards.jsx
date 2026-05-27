import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useSettings from '../../hooks/useSettings'
import useUser from '../../hooks/useUser'
import useReferrals from '../../hooks/useReferrals'
import {
  Gift, Sparkles, TrendingUp, Crown, Star, ArrowUpRight, Zap,
  Users, ChevronRight, Coins, Lock, Check, Copy, Share2, UserPlus,
  Wallet, ShieldCheck, Send, MailPlus, Fingerprint,
} from 'lucide-react'

const EARN_STATIC = [
  { id: 'swap',  label: 'Crypto swap',       desc: '5× points on every swap',      rate: '5× pts',  icon: TrendingUp },
  { id: 'bills', label: 'Bills & utilities', desc: 'Cable, electricity, internet', rate: '2× pts',  icon: Zap },
  { id: 'card',  label: 'Card spending',     desc: 'Tap your virtual card',        rate: '1.5×',    icon: Coins },
]

const PERKS = [
  { id: '1', label: 'Free monthly transfer', desc: 'One free transfer per month',   cost: 250,  icon: Zap,         unlocked: true },
  { id: '2', label: 'Premium card design',   desc: 'Choose from 5 exclusive skins', cost: 1500, icon: Star,        unlocked: true },
  { id: '3', label: 'Higher daily limits',   desc: 'Up to ₦20M per day',            cost: 3000, icon: TrendingUp,  unlocked: false },
  { id: '4', label: 'VIP support line',      desc: 'Priority chat & call agents',   cost: 5000, icon: Crown,       unlocked: false },
]

const RECENT_STATIC = [
  { id: 'r1', title: 'DSTV bill payment', amount: 240, kind: 'pts', meta: 'Today · 14:20' },
  { id: 'r2', title: 'USDT → NGN swap',   amount: 437, kind: 'pts', meta: 'Yesterday' },
  { id: 'r4', title: 'Sign-up bonus',     amount: 500, kind: 'pts', meta: 'May 1' },
  { id: 'r5', title: 'Spotify Premium',   amount: 19,  kind: 'pts', meta: 'May 1' },
]

const SHARE_CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: Send },
  { id: 'email',    label: 'Email',    icon: MailPlus },
  { id: 'copy',     label: 'Copy link', icon: Copy },
]

function fmt(n) { return Number(n).toLocaleString('en-NG') }
function fmtN(n) { return '₦' + fmt(n) }
function formatName(name) {
  if (!name) return 'Friend'
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  const parts = name.trim().split(/\s+/)
  return parts.length > 1 ? `${cap(parts[0])} ${parts[1][0].toUpperCase()}.` : cap(parts[0])
}

export default function DesktopRewards() {
  const [copied, setCopied]   = useState(null)
  const { settings }          = useSettings()
  const { user }              = useUser()
  const { referrals, total, pending, pendingPayout, totalEarned } = useReferrals()

  const referralCode = user?.referral_code ?? ''
  const siteUrl      = settings?.site_url ? settings.site_url.replace(/\/$/, '') : 'https://yourwebsite.com'
  const referralLink = referralCode ? `${siteUrl}/auth/register?ref=${referralCode}` : ''
  const perReferral  = settings?.referral_rewards ? Number(settings.referral_rewards) : 1000
  const friendBonus  = 500

  const EARN = [
    { id: 'refer', label: 'Refer a friend', desc: 'Real cash for every signup', rate: '₦' + fmt(perReferral), icon: Users, cash: true },
    ...EARN_STATIC,
  ]

  const points     = 2840
  const nextTierAt = 5000
  const progress   = Math.min(100, (points / nextTierAt) * 100)
  const cashback   = Number(user?.referral_balance ?? 0)
  const earned     = totalEarned
  const friends    = total

  const recentRows = [
    ...referrals.slice(0, 4).map(r => ({
      id:     r.id,
      title:  `Referral · ${formatName(r.full_name)}`,
      amount: r.reward,
      kind:   'cash',
      status:     r.status,
      is_claimed: r.is_claimed,
      meta:   r.createdAt
        ? new Date(r.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
        : '—',
    })),
    ...RECENT_STATIC,
  ].slice(0, 6)

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
    <div className="flex flex-col gap-5 max-w-[1240px] mx-auto pb-10">

      {/* ── Page header ── */}
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.4px] text-brand-accent font-bold m-0">
            <Gift size={10} /> Rewards & referrals
          </p>
          <h1 className="text-[22px] font-black tracking-[-0.5px] text-[var(--c-text)] m-0 mt-1">
            Earn rewards
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Real cash for friends · points on every transaction
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-accent/20 to-brand-gold-soft/10 border border-[rgba(201,162,39,0.35)] text-[10px] font-bold uppercase tracking-[1px] text-brand-accent">
          <Crown size={10} strokeWidth={2.8} /> Gold tier
        </span>
      </header>

      {/* ── Hero ── */}
      <article
        className="relative overflow-hidden rounded-[24px] border border-[rgba(201,162,39,0.28)] shadow-[0_24px_60px_-20px_rgba(2,7,23,0.6)]"
        style={{ background: 'linear-gradient(140deg,#0d2657 0%,#091a3a 55%,#040e24 100%)' }}
      >
        {/* Glows */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.2)' }} />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(232,197,71,0.12)' }} />
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(201,162,39,0.18) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
        {/* Gold bar */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,162,39,0.7),transparent)' }} />

        <div className="relative grid grid-cols-1 min-[860px]:grid-cols-[1.3fr_1fr] gap-0 divide-y min-[860px]:divide-y-0 min-[860px]:divide-x divide-white/[0.07]">
          {/* Left — points */}
          <div className="p-7">
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[1.5px] font-bold text-brand-accent">
                <Sparkles size={9} /> Points balance
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[1px] text-brand-accent" style={{ background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)' }}>
                <Star size={8} strokeWidth={3} /> Gold
              </span>
            </div>
            <div className="flex items-baseline gap-2.5 mb-1">
              <span className="text-[52px] font-black tracking-[-2px] text-white leading-none tabular-nums">
                {fmt(points)}
              </span>
              <span className="text-[15px] font-bold text-white/40 tracking-[2px] mb-1">PTS</span>
            </div>
            <p className="text-[12px] text-white/50 m-0 mb-6">
              ≈ ₦{fmt(Math.floor(points * 5))} in benefits ready to redeem
            </p>

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-[10.5px] mb-2">
                <span className="font-semibold text-white/70">
                  Next tier: <span className="text-brand-accent font-bold">Platinum</span>
                </span>
                <span className="tabular-nums font-bold text-white/80">
                  {fmt(points)} <span className="text-white/35 font-normal">/ {fmt(nextTierAt)}</span>
                </span>
              </div>
              <div className="relative w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: 'linear-gradient(90deg,#C9A227,#f0d060)', boxShadow: '0 0 16px rgba(201,162,39,0.55)' }}
                />
              </div>
              <p className="text-[10px] text-white/35 m-0 mt-2 font-medium">
                {fmt(nextTierAt - points)} pts away from Platinum
              </p>
            </div>
          </div>

          {/* Right — stats */}
          <div className="grid grid-cols-2 gap-px p-7" style={{ background: 'transparent' }}>
            {[
              { label: 'Referral balance',  value: fmtN(cashback), accent: true },
              { label: 'Cash earned',       value: fmtN(earned) },
              { label: 'Friends joined',    value: fmt(friends) },
              { label: 'Unclaimed',    value: fmtN(pendingPayout), sub: `${pending} referral${pending !== 1 ? 's' : ''}` },
            ].map(({ label, value, sub, accent }) => (
              <div
                key={label}
                className="flex flex-col justify-between p-4 rounded-xl"
                style={{
                  background: accent ? 'rgba(201,162,39,0.12)' : 'rgba(255,255,255,0.04)',
                  border: accent ? '1px solid rgba(201,162,39,0.25)' : '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold m-0" style={{ color: accent ? '#C9A227' : 'rgba(255,255,255,0.4)' }}>
                  {label}
                </p>
                <div>
                  <p className="text-[20px] font-black tabular-nums tracking-[-0.5px] m-0 mt-2 leading-none" style={{ color: accent ? '#C9A227' : '#fff' }}>
                    {value}
                  </p>
                  {sub && <p className="text-[9.5px] text-white/35 m-0 mt-1">{sub}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* ── Refer & earn ── */}
      <article
        className="relative overflow-hidden rounded-[24px] border border-[var(--c-accent-border)]"
        style={{ background: 'var(--c-surface)' }}
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.08)' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,162,39,0.4),transparent)' }} />

        <div className="relative grid grid-cols-1 min-[860px]:grid-cols-[1.3fr_1fr] gap-0 divide-y min-[860px]:divide-y-0 min-[860px]:divide-x divide-[var(--c-border)]">

          {/* Left — info */}
          <div className="p-7">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl shrink-0 border border-[rgba(232,197,71,0.45)]" style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', boxShadow: '0 6px 20px rgba(201,162,39,0.3)', color: '#0A1F44' }}>
                <UserPlus size={18} strokeWidth={2.2} />
              </span>
              <div>
                <p className="text-[9.5px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">Refer & earn cash</p>
                <h2 className="text-[22px] font-black text-[var(--c-text)] m-0 tracking-[-0.5px] leading-tight">
                  ₦{fmt(perReferral)} <span className="text-[var(--c-text-muted)] font-semibold text-[16px]">per friend</span>
                </h2>
              </div>
            </div>
            <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 leading-relaxed mb-6">
              Paid directly to your wallet the moment your friend completes their first deposit. Your friend also receives a ₦{fmt(friendBonus)} welcome bonus.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { n: '01', label: 'Share code', desc: 'Send to friends, family or coworkers' },
                { n: '02', label: 'They sign up', desc: 'Using your code at registration' },
                { n: '03', label: 'You both earn', desc: 'Cash hits your wallet instantly' },
              ].map(({ n, label, desc }) => (
                <div key={n} className="flex flex-col gap-2 p-3.5 rounded-2xl border border-[var(--c-border-soft)]" style={{ background: 'var(--c-surface-soft)' }}>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-black text-brand-primary border border-[rgba(232,197,71,0.5)]" style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)' }}>
                    {n}
                  </span>
                  <p className="text-[12px] font-bold text-[var(--c-text)] m-0">{label}</p>
                  <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 leading-snug">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — referral card widget */}
          <div className="p-7 flex flex-col gap-3">

            {/* Premium card visual */}
            <div
              className="relative overflow-hidden rounded-2xl p-5"
              style={{
                background: 'linear-gradient(135deg,#0d2657 0%,#142A5C 50%,#091a3a 100%)',
                border: '1px solid rgba(201,162,39,0.25)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
              }}
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.2)' }} />
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px,transparent 1px)', backgroundSize: '14px 14px' }} />
              <div className="relative flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[1.5px] text-white/40 font-bold">
                  <Fingerprint size={10} /> Referral Card
                </span>
                <span className="text-[10.5px] font-black text-brand-accent tracking-[1px]">VeloxZap</span>
              </div>
              <p className="relative text-[26px] font-black text-brand-accent tracking-[3px] m-0 leading-none">
                {referralCode || '——'}
              </p>
              <div className="relative flex items-center justify-between mt-5">
                <div>
                  <p className="text-[8.5px] uppercase tracking-[1.2px] text-white/35 font-bold m-0">Referral Code</p>
                  <p className="text-[10.5px] text-white/55 m-0 mt-0.5 font-medium">{user?.full_name || 'Your account'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('code', referralCode)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold transition active:scale-95"
                  style={copied === 'code'
                    ? { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
                    : { background: 'rgba(201,162,39,0.15)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)' }}
                >
                  {copied === 'code' ? <><Check size={10} strokeWidth={3} /> Copied</> : <><Copy size={10} /> Copy</>}
                </button>
              </div>
            </div>

            {/* Link row */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[var(--c-border)]" style={{ background: 'var(--c-surface-soft)' }}>
              <span className="flex-1 min-w-0 text-[10.5px] font-mono text-[var(--c-text-muted)] truncate">
                {referralLink || 'Loading…'}
              </span>
              <button
                type="button"
                onClick={() => handleCopy('link', referralLink)}
                disabled={!referralLink}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold transition active:scale-95 shrink-0"
                style={copied === 'link'
                  ? { background: 'var(--c-success-bg)', color: 'var(--c-success)', border: '1px solid var(--c-success-bg)' }
                  : { background: 'var(--c-surface-soft-2)', color: 'var(--c-text-muted)', border: '1px solid var(--c-border-soft)' }}
              >
                {copied === 'link' ? <><Check size={10} strokeWidth={3} /> Copied</> : <><Copy size={10} /> Copy</>}
              </button>
            </div>

            {/* Share channels */}
            <div className="grid grid-cols-3 gap-2">
              {SHARE_CHANNELS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={id === 'copy' ? () => handleCopy('share', `Join VeloxZap with code ${referralCode} — ${referralLink}`) : handleShare}
                  className="group flex flex-col items-center gap-1.5 py-3 rounded-xl border transition active:scale-95"
                  style={{ background: 'var(--c-surface-soft)', borderColor: 'var(--c-border-soft)' }}
                >
                  <Icon size={15} className="text-brand-accent" />
                  <span className="text-[9.5px] font-bold text-[var(--c-text-muted)] group-hover:text-[var(--c-text)]">{label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 w-full h-[46px] rounded-xl font-bold text-[13px] transition hover:-translate-y-px active:scale-[0.99]"
              style={{
                background: 'linear-gradient(135deg,#C9A227,#f0d060)',
                color: '#0A1F44',
                border: '1px solid rgba(232,197,71,0.5)',
                boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)',
              }}
            >
              <Share2 size={14} strokeWidth={2.6} /> Share & earn ₦{fmt(perReferral)}
            </button>
          </div>
        </div>
      </article>

      {/* ── Cashback claim ── */}
      <button
        type="button"
        className="group relative overflow-hidden flex items-center gap-5 p-5 rounded-[20px] text-left transition hover:-translate-y-px active:scale-[0.995]"
        style={{
          background: 'var(--c-surface)',
          border: '1px solid var(--c-accent-border)',
          boxShadow: '0 4px 24px rgba(201,162,39,0.08)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition" style={{ background: 'radial-gradient(500px at var(--mx,50%) var(--my,50%),rgba(201,162,39,0.06),transparent 70%)' }} />
        <span
          className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl shrink-0"
          style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 6px 20px rgba(201,162,39,0.35)', color: '#0A1F44' }}
        >
          <Coins size={22} strokeWidth={2} />
        </span>
        <div className="relative flex-1 min-w-0">
          <p className="text-[9.5px] uppercase tracking-[1.2px] text-brand-accent font-bold m-0">Cashback available</p>
          <p className="text-[26px] font-black text-[var(--c-text)] m-0 mt-0.5 tabular-nums tracking-[-0.6px] leading-tight">{fmtN(cashback)}</p>
          <p className="text-[11.5px] text-[var(--c-text-muted)] m-0 mt-1">Earned across bills, swaps and card spending this month</p>
        </div>
        <span
          className="relative inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-[12.5px] shrink-0 transition group-hover:-translate-y-px"
          style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 6px 18px rgba(201,162,39,0.35)' }}
        >
          Claim now <ArrowUpRight size={14} strokeWidth={2.6} />
        </span>
      </button>

      {/* ── Bottom grid ── */}
      <div className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">

          {/* Earn more */}
          <article className="rounded-[20px] border border-[var(--c-border)] overflow-hidden" style={{ background: 'var(--c-surface)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--c-border-soft)]">
              <h3 className="inline-flex items-center gap-2 text-[13px] font-bold m-0 text-[var(--c-text)]">
                <Sparkles size={13} className="text-brand-accent" /> Ways to earn
              </h3>
              <span className="text-[10px] text-[var(--c-text-muted)] font-semibold">{EARN.length} methods</span>
            </div>
            <div className="grid grid-cols-2 gap-px" style={{ background: 'var(--c-border)' }}>
              {EARN.map(({ id, label, desc, rate, icon: Icon, cash }) => (
                <div key={id} className="flex items-start gap-3 p-4" style={{ background: 'var(--c-surface)' }}>
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0 border border-[var(--c-accent-border)]"
                    style={{ background: 'var(--c-accent-soft-2)', color: '#C9A227' }}
                  >
                    <Icon size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0 truncate">{label}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-brand-accent font-black shrink-0 tabular-nums">
                        {cash && <Wallet size={9} strokeWidth={2.8} />}{rate}{cash ? ' cash' : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--c-text-muted)] m-0 leading-snug">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Perks store */}
          <article className="rounded-[20px] border border-[var(--c-border)] overflow-hidden" style={{ background: 'var(--c-surface)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--c-border-soft)]">
              <h3 className="inline-flex items-center gap-2 text-[13px] font-bold m-0 text-[var(--c-text)]">
                <Star size={13} className="text-brand-accent" /> Perks store
              </h3>
              <span className="text-[10px] text-[var(--c-text-muted)] tabular-nums">
                {PERKS.filter(p => p.unlocked || points >= p.cost).length}/{PERKS.length} unlocked
              </span>
            </div>
            <ul className="list-none m-0 p-0">
              {PERKS.map(({ id, label, desc, cost, icon: Icon, unlocked }, i) => {
                const reachable = unlocked || points >= cost
                return (
                  <li key={id} className={i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}>
                    <div className="flex items-center gap-4 px-5 py-3.5">
                      <span
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl border shrink-0"
                        style={reachable
                          ? { background: 'var(--c-accent-soft-2)', borderColor: 'var(--c-accent-border)', color: '#C9A227' }
                          : { background: 'var(--c-surface-soft)', borderColor: 'var(--c-border-soft)', color: 'var(--c-text-faint)' }}
                      >
                        <Icon size={16} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-bold m-0 truncate" style={{ color: reachable ? 'var(--c-text)' : 'var(--c-text-muted)' }}>{label}</p>
                        <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5 truncate">{desc}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10.5px] tabular-nums shrink-0" style={{ color: 'var(--c-text-muted)' }}>
                        <Coins size={10} className="text-brand-accent" /> {fmt(cost)}
                      </span>
                      {reachable ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition hover:-translate-y-px active:scale-95 shrink-0"
                          style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 4px 12px rgba(201,162,39,0.25)' }}
                        >
                          <Check size={11} strokeWidth={3} /> Claim
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] font-bold shrink-0" style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border-soft)', color: 'var(--c-text-faint)' }}>
                          <Lock size={10} /> Locked
                        </span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </article>
        </div>

        {/* Recent earnings — sticky */}
        <article className="rounded-[20px] border border-[var(--c-border)] overflow-hidden min-[960px]:sticky min-[960px]:top-[80px]" style={{ background: 'var(--c-surface)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--c-border-soft)]">
            <h3 className="inline-flex items-center gap-2 text-[13px] font-bold m-0 text-[var(--c-text)]">
              <Coins size={13} className="text-brand-accent" /> Recent earnings
            </h3>
            <button type="button" className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-brand-accent hover:underline">
              See all <ChevronRight size={11} />
            </button>
          </div>
          <ul className="list-none m-0 p-0">
            {recentRows.map((r, i) => {
              const isCash = r.kind === 'cash'
              return (
                <li key={r.id} className={i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}>
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3.5">
                    <span
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl border shrink-0"
                      style={isCash
                        ? { background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', borderColor: 'rgba(232,197,71,0.5)' }
                        : { background: 'var(--c-accent-soft)', borderColor: 'var(--c-accent-border)', color: '#C9A227' }}
                    >
                      {isCash ? <Wallet size={13} strokeWidth={2.4} /> : <Coins size={13} strokeWidth={2.4} />}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-semibold text-[var(--c-text)] truncate">{r.title}</span>
                      <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5">{r.meta}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className="text-[12.5px] font-bold tabular-nums whitespace-nowrap"
                        style={{ color: isCash ? 'var(--c-success)' : '#C9A227' }}
                      >
                        {isCash ? `+₦${fmt(r.amount)}` : `+${fmt(r.amount)} pts`}
                      </span>
                      {r.status && (
                        <span
                          className="inline-flex items-center px-1.5 py-px rounded-full text-[9px] font-bold tracking-[0.5px]"
                          style={r.status === 'paid'
                            ? { background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }
                            : { background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}
                        >
                          {r.status === 'paid' ? 'Claimed' : 'Pending'}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="px-5 py-3.5 border-t border-[var(--c-border-soft)] flex items-center gap-1.5">
            <ShieldCheck size={10} className="text-brand-accent shrink-0" />
            <p className="text-[10px] text-[var(--c-text-muted)] m-0">Earnings settle in real-time</p>
          </div>
        </article>
      </div>
    </div>
  )
}
