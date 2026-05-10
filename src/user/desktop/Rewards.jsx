import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Gift, Sparkles, TrendingUp, Crown, Star, ArrowUpRight, Zap,
  Users, ChevronRight, Coins, Lock, Check, Copy, Share2, UserPlus,
  Wallet, ShieldCheck, Send, MailPlus,
} from 'lucide-react'

const HERO_BG = `radial-gradient(640px 240px at 100% 0%, rgba(201,162,39,0.32), transparent 65%), radial-gradient(420px 200px at 0% 100%, rgba(232,197,71,0.18), transparent 60%), linear-gradient(135deg, rgba(20,42,92,0.98), rgba(10,31,68,1))`

const REFERRAL = {
  code: 'VLX-JOHN24',
  link: 'https://veloxzap.com/r/VLX-JOHN24',
  perReferral: 1000,
  friendBonus: 500,
  friends: 12,
  earned: 12000,
  pending: 2,
  pendingAmount: 2000,
}

const EARN = [
  { id: 'refer', label: 'Refer a friend',     desc: 'Real cash for every signup',   rate: '₦1,000',  icon: Users,       cash: true },
  { id: 'swap',  label: 'Crypto swap',        desc: '5× points on every swap',      rate: '5× pts',  icon: TrendingUp },
  { id: 'bills', label: 'Bills & utilities',  desc: 'Cable, electricity, internet', rate: '2× pts',  icon: Zap },
  { id: 'card',  label: 'Card spending',      desc: 'Tap your virtual card',        rate: '1.5×',    icon: Coins },
]

const PERKS = [
  { id: '1', label: 'Free monthly transfer', desc: 'One free transfer every month',  cost: 250,  icon: Zap,         unlocked: true },
  { id: '2', label: 'Premium card design',   desc: 'Pick from 5 exclusive skins',    cost: 1500, icon: Star,        unlocked: true },
  { id: '3', label: 'Higher daily limits',   desc: 'Up to ₦20M per day',             cost: 3000, icon: TrendingUp,  unlocked: false },
  { id: '4', label: 'VIP support line',      desc: 'Priority chat & call agents',    cost: 5000, icon: Crown,       unlocked: false },
]

const RECENT = [
  { id: 'r0', title: 'Referral · Sarah O.',  amount: 1000, kind: 'cash', meta: 'Today · 09:14' },
  { id: 'r1', title: 'DSTV bill payment',    amount: 240,  kind: 'pts',  meta: 'Today · 14:20' },
  { id: 'r2', title: 'USDT → NGN swap',      amount: 437,  kind: 'pts',  meta: 'Yesterday' },
  { id: 'r3', title: 'Referral · Daniel A.', amount: 1000, kind: 'cash', meta: 'May 6' },
  { id: 'r4', title: 'Sign-up bonus',        amount: 500,  kind: 'pts',  meta: 'May 1' },
  { id: 'r5', title: 'Spotify Premium',      amount: 19,   kind: 'pts',  meta: 'May 1' },
]

const SHARE_CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: Send },
  { id: 'email',    label: 'Email',    icon: MailPlus },
  { id: 'copy',     label: 'Copy',     icon: Copy },
]

function formatNum(n) {
  return n.toLocaleString('en-NG')
}

function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG')
}

export default function DesktopRewards() {
  const [copied, setCopied] = useState(null)

  const points = 2840
  const nextTierAt = 5000
  const progress = Math.min(100, (points / nextTierAt) * 100)
  const cashback = 12500

  function handleCopy(key, value) {
    if (navigator.clipboard) navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  async function handleShare() {
    const text = `Join me on VeloxZap and get ₦${formatNum(REFERRAL.friendBonus)} bonus. Use my code ${REFERRAL.code}`
    if (navigator.share) {
      try { await navigator.share({ title: 'VeloxZap', text, url: REFERRAL.link }) } catch {}
    } else {
      handleCopy('share', `${text} — ${REFERRAL.link}`)
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
            <Gift size={10} /> Rewards & referrals
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Earn rewards
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Real cash for friends · points on every transaction.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
          <Crown size={10} /> Gold tier · since May 2026
        </span>
      </header>

      <article
        className="relative overflow-hidden p-6 rounded-2xl border border-[rgba(201,162,39,0.32)] text-text shadow-[0_18px_44px_-18px_rgba(2,7,23,0.55)]"
        style={{ background: HERO_BG }}
      >
        <span aria-hidden className="pointer-events-none absolute -top-16 -right-16 w-[260px] h-[260px] rounded-full bg-brand-accent/[0.16] blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute -bottom-14 -left-12 w-[180px] h-[180px] rounded-full bg-brand-gold-soft/[0.12] blur-3xl" />

        <div className="relative grid grid-cols-1 min-[820px]:grid-cols-[1.2fr_1fr] gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] font-bold text-brand-accent">
                <Sparkles size={10} /> Points balance
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-accent/15 border border-[rgba(201,162,39,0.4)] text-[9.5px] font-bold uppercase tracking-[0.9px] text-brand-accent">
                <Star size={9} strokeWidth={2.6} /> Gold tier
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[42px] font-black tracking-[-1px] text-text leading-none tabular-nums">
                {formatNum(points)}
              </span>
              <span className="text-[14px] font-bold text-white/65 tracking-[1px]">
                PTS
              </span>
            </div>
            <p className="text-[12px] text-white/65 m-0 mt-2">
              ≈ ₦{formatNum(Math.floor(points * 5))} in benefits ready to redeem
            </p>

            <div className="mt-5">
              <div className="flex items-center justify-between text-[10.5px] mb-1.5">
                <span className="font-semibold text-white/85">
                  Progress to <span className="text-brand-accent">Platinum</span>
                </span>
                <span className="tabular-nums font-bold text-text">
                  {formatNum(points)} / {formatNum(nextTierAt)}
                </span>
              </div>
              <div className="relative w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-brand-accent to-brand-gold-soft shadow-[0_0_12px_rgba(201,162,39,0.6)]"
                />
              </div>
              <p className="text-[10.5px] text-white/55 m-0 mt-1.5">
                {formatNum(nextTierAt - points)} pts to unlock Platinum perks
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 self-start">
            <HeroStat label="Cashback ready" value={formatNGN(cashback)} accent />
            <HeroStat label="Referrals paid" value={formatNGN(REFERRAL.earned)} />
            <HeroStat label="Friends joined" value={REFERRAL.friends} />
            <HeroStat label="Pending referrals" value={`${REFERRAL.pending}`} hint={`${formatNGN(REFERRAL.pendingAmount)} pending`} />
          </div>
        </div>
      </article>

      <article className="relative overflow-hidden rounded-2xl border border-[var(--c-accent-border)] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] p-5">
        <span aria-hidden className="pointer-events-none absolute -top-16 -right-16 w-[200px] h-[200px] rounded-full bg-brand-accent/[0.18] blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute -bottom-14 -left-12 w-[160px] h-[160px] rounded-full bg-brand-gold-soft/[0.18] blur-3xl" />

        <div className="relative grid grid-cols-1 min-[820px]:grid-cols-[1.4fr_1fr] gap-5 items-center">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.32)]">
                <UserPlus size={17} strokeWidth={2.2} />
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-bold">
                <Wallet size={10} /> Refer & earn cash
              </span>
            </div>
            <h2 className="text-[24px] font-black text-[var(--c-text)] m-0 mt-3 tracking-[-0.5px] leading-tight">
              Earn ₦{formatNum(REFERRAL.perReferral)} for every friend that signs up.
            </h2>
            <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-2 leading-snug">
              Paid in real cash to your wallet · friend gets a ₦{formatNum(REFERRAL.friendBonus)} welcome bonus when they make their first deposit.
            </p>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <Step n="1" label="Share your code" desc="Send to friends, family or coworkers." />
              <Step n="2" label="They sign up" desc="Using your code at registration." />
              <Step n="3" label="You both earn" desc="Cash credits in seconds." />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="rounded-xl bg-[var(--c-surface)] border border-dashed border-[var(--c-accent-border)] p-3">
              <p className="text-[9.5px] uppercase tracking-[1.1px] text-[var(--c-text-muted)] font-bold m-0">
                Your referral code
              </p>
              <p className="text-[20px] font-black text-brand-accent m-0 mt-1 tracking-[2px] tabular-nums">
                {REFERRAL.code}
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
              <span className="flex-1 min-w-0 text-[11px] font-mono text-[var(--c-text-muted)] truncate">
                {REFERRAL.link}
              </span>
              <button
                type="button"
                onClick={() => handleCopy('link', REFERRAL.link)}
                className={[
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-bold tracking-[0.2px] transition shrink-0',
                  copied === 'link'
                    ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
                    : 'bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-brand-accent hover:border-[var(--c-accent-border)]',
                ].join(' ')}
              >
                {copied === 'link' ? <><Check size={11} strokeWidth={2.8} /> Copied</> : <><Copy size={11} /> Copy link</>}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {SHARE_CHANNELS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={id === 'copy'
                    ? () => handleCopy('share', `Join VeloxZap with code ${REFERRAL.code} — ${REFERRAL.link}`)
                    : handleShare}
                  className="inline-flex flex-col items-center gap-1 py-2 rounded-lg bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] active:scale-[0.97] transition"
                >
                  <Icon size={14} className="text-brand-accent" />
                  <span className="text-[10px] font-bold text-[var(--c-text)]">
                    {label}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[12px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_6px_18px_-6px_rgba(201,162,39,0.5)] hover:-translate-y-px transition"
            >
              <Share2 size={13} strokeWidth={2.6} /> Share & earn
            </button>
          </div>
        </div>
      </article>

      <button
        type="button"
        className="group relative overflow-hidden flex items-center gap-4 p-4 rounded-2xl text-left bg-[var(--c-surface)] border border-[var(--c-accent-border)] hover:border-[var(--c-accent-border-strong)] transition"
      >
        <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-brand-accent/[0.12] blur-2xl group-hover:bg-brand-accent/[0.22] transition" />
        <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.32)] shrink-0">
          <Coins size={18} strokeWidth={2} />
        </span>
        <div className="relative flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[1.1px] text-brand-accent font-bold m-0">
            Cashback waiting
          </p>
          <p className="text-[20px] font-black text-[var(--c-text)] m-0 mt-1 tabular-nums tracking-[-0.4px]">
            {formatNGN(cashback)}
          </p>
          <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-1">
            Earned across bills, swaps and card spending this month.
          </p>
        </div>
        <span className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary text-text text-[12px] font-bold border border-brand-primary group-hover:bg-brand-primary/90 transition shrink-0">
          Claim now <ArrowUpRight size={13} strokeWidth={2.6} />
        </span>
      </button>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="inline-flex items-center gap-1.5 text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                <Sparkles size={12} className="text-brand-accent" /> Earn more
              </h3>
              <span className="text-[10px] text-[var(--c-text-muted)] font-semibold">
                4 ways
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {EARN.map(({ id, label, desc, rate, icon: Icon, cash }) => (
                <div
                  key={id}
                  className="relative overflow-hidden flex items-start gap-2.5 p-3 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]"
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent shrink-0">
                    <Icon size={15} />
                  </span>
                  <div className="flex-1 min-w-0 leading-tight">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-[12px] font-bold text-[var(--c-text)] m-0 truncate">
                        {label}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-brand-accent font-bold tracking-[0.2px] shrink-0">
                        {cash && <Wallet size={9} strokeWidth={2.6} />}
                        {rate}{cash ? ' cash' : ''}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 leading-snug">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)]">
              <h3 className="inline-flex items-center gap-1.5 text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                <Star size={12} className="text-brand-accent" /> Perks store
              </h3>
              <span className="text-[10px] text-[var(--c-text-muted)] tabular-nums">
                {PERKS.filter(p => p.unlocked || points >= p.cost).length}/{PERKS.length} unlocked
              </span>
            </header>
            <ul className="list-none m-0 p-0">
              {PERKS.map(({ id, label, desc, cost, icon: Icon, unlocked }, i) => {
                const reachable = unlocked || points >= cost
                return (
                  <li key={id} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <span
                        className={[
                          'inline-flex items-center justify-center w-10 h-10 rounded-xl border shrink-0',
                          reachable
                            ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border-[var(--c-accent-border)] text-brand-accent'
                            : 'bg-[var(--c-surface-soft)] border-[var(--c-border-soft)] text-[var(--c-text-faint)]',
                        ].join(' ')}
                      >
                        <Icon size={15} />
                      </span>
                      <div className="flex-1 min-w-0 leading-tight">
                        <p className={['text-[12.5px] font-bold m-0 truncate', reachable ? 'text-[var(--c-text)]' : 'text-[var(--c-text-muted)]'].join(' ')}>
                          {label}
                        </p>
                        <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5 truncate">
                          {desc}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10.5px] text-[var(--c-text-muted)] tabular-nums shrink-0">
                        <Coins size={10} className="text-brand-accent" /> {formatNum(cost)}
                      </span>
                      {reachable ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[11px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.28)] hover:-translate-y-px transition shrink-0"
                        >
                          <Check size={11} strokeWidth={2.8} /> Claim
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-faint)] text-[10.5px] font-bold shrink-0">
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

        <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden min-[960px]:sticky min-[960px]:top-[80px]">
          <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)]">
            <h3 className="inline-flex items-center gap-1.5 text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
              <Coins size={12} className="text-brand-accent" /> Recent earnings
            </h3>
            <button
              type="button"
              className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-brand-accent hover:underline"
            >
              See all <ChevronRight size={11} />
            </button>
          </header>
          <ul className="list-none m-0 p-0">
            {RECENT.map((r, i) => {
              const isCash = r.kind === 'cash'
              return (
                <li key={r.id} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5 px-4 py-2.5">
                    <span
                      className={[
                        'inline-flex items-center justify-center w-8 h-8 rounded-lg border shrink-0',
                        isCash
                          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)]'
                          : 'bg-[var(--c-accent-soft)] border-[var(--c-accent-border)] text-brand-accent',
                      ].join(' ')}
                    >
                      {isCash ? <Wallet size={13} strokeWidth={2.4} /> : <Coins size={13} strokeWidth={2.4} />}
                    </span>
                    <div className="flex flex-col min-w-0 leading-tight">
                      <span className="text-[11.5px] font-semibold text-[var(--c-text)] truncate">
                        {r.title}
                      </span>
                      <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5">
                        {r.meta}
                      </span>
                    </div>
                    <span className={['text-[12px] font-bold tabular-nums whitespace-nowrap', isCash ? 'text-[var(--c-success)]' : 'text-brand-accent'].join(' ')}>
                      {isCash ? `+₦${formatNum(r.amount)}` : `+${formatNum(r.amount)} pts`}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
          <footer className="px-4 py-3 border-t border-[var(--c-border)] flex items-center justify-between">
            <p className="inline-flex items-center gap-1 text-[10px] text-[var(--c-text-muted)] m-0">
              <ShieldCheck size={10} className="text-brand-accent" />
              Earnings settle in real-time
            </p>
          </footer>
        </article>
      </section>
    </div>
  )
}

function HeroStat({ label, value, hint, accent }) {
  return (
    <div
      className={[
        'p-2.5 rounded-xl border',
        accent
          ? 'bg-gradient-to-br from-brand-accent/20 to-brand-gold-soft/20 border-[rgba(201,162,39,0.5)]'
          : 'bg-white/[0.06] border-white/[0.14]',
      ].join(' ')}
    >
      <p className="text-[9.5px] uppercase tracking-[1px] text-white/65 font-bold m-0">
        {label}
      </p>
      <p className={[
        'text-[16px] font-black m-0 mt-1 tabular-nums tracking-[-0.3px]',
        accent ? 'text-brand-accent' : 'text-text',
      ].join(' ')}>
        {value}
      </p>
      {hint && (
        <p className="text-[9.5px] text-white/55 m-0 mt-0.5">
          {hint}
        </p>
      )}
    </div>
  )
}

function Step({ n, label, desc }) {
  return (
    <div className="flex flex-col items-start gap-1.5 px-3 py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border-soft)]">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[10px] font-black tabular-nums border border-[rgba(232,197,71,0.55)]">
        {n}
      </span>
      <p className="text-[11.5px] font-bold text-[var(--c-text)] m-0 leading-tight">
        {label}
      </p>
      <p className="text-[10px] text-[var(--c-text-muted)] m-0 leading-snug">
        {desc}
      </p>
    </div>
  )
}
