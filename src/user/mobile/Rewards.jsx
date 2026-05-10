import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronLeft, Gift, Sparkles, TrendingUp, Crown, Star,
  ArrowUpRight, Zap, Users, ChevronRight, Coins, Lock, Check,
  Copy, Share2, UserPlus, Wallet,
} from 'lucide-react'

const HERO_BG = `radial-gradient(540px 240px at 110% -10%, rgba(201, 162, 39, 0.4), transparent 60%), radial-gradient(360px 180px at -10% 110%, rgba(232, 197, 71, 0.2), transparent 60%), linear-gradient(135deg, rgba(20, 42, 92, 0.95), rgba(10, 31, 68, 1))`

const REFERRAL = {
  code: 'VLX-JOHN24',
  link: 'https://veloxzap.com/r/VLX-JOHN24',
  perReferral: 1000,
  friendBonus: 500,
  friends: 12,
  earned: 12000,
}

const EARN = [
  { id: 'refer',    label: 'Refer a friend',    rate: '₦1,000',  icon: Users,        cash: true },
  { id: 'swap',     label: 'Crypto swap',       rate: '5× pts',  icon: TrendingUp },
  { id: 'bills',    label: 'Bills & utilities', rate: '2× pts',  icon: Zap },
  { id: 'card',     label: 'Card spending',     rate: '1.5×',    icon: Coins },
]

const PERKS = [
  { id: '1', label: 'Free monthly transfer', cost: 250,  icon: Zap,         unlocked: true },
  { id: '2', label: 'Premium card design',   cost: 1500, icon: Star,        unlocked: true },
  { id: '3', label: 'Higher daily limits',   cost: 3000, icon: TrendingUp,  unlocked: false },
  { id: '4', label: 'VIP support line',      cost: 5000, icon: Crown,       unlocked: false },
]

const RECENT = [
  { id: 'r0', title: 'Referral · Sarah O.',  amount: 1000, kind: 'cash', meta: 'Today, 09:14' },
  { id: 'r1', title: 'DSTV bill payment',    amount: 240,  kind: 'pts',  meta: 'Today, 14:20' },
  { id: 'r2', title: 'USDT → NGN swap',      amount: 437,  kind: 'pts',  meta: 'Yesterday' },
  { id: 'r3', title: 'Referral · Daniel A.', amount: 1000, kind: 'cash', meta: 'May 6' },
  { id: 'r4', title: 'Sign-up bonus',        amount: 500,  kind: 'pts',  meta: 'May 1' },
]

const LIST = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const ITEM = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
}

function formatNum(n) {
  return n.toLocaleString('en-NG')
}

export default function MobileRewards() {
  const navigate = useNavigate()
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
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition self-start -mt-1"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden p-5 rounded-[24px] border border-[rgba(201,162,39,0.36)] text-text shadow-[0_18px_44px_-14px_rgba(2,7,23,0.55)]"
        style={{ background: HERO_BG }}
      >
        <span aria-hidden className="absolute -top-12 -right-12 w-[200px] h-[200px] rounded-full bg-brand-accent/15 blur-3xl pointer-events-none" />
        <span aria-hidden className="absolute -bottom-12 -left-10 w-[150px] h-[150px] rounded-full bg-brand-gold-soft/10 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.4px] text-brand-accent font-semibold">
            <Gift size={11} />
            Rewards & referrals
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-accent/15 border border-[rgba(201,162,39,0.4)] text-[9.5px] uppercase tracking-[0.9px] font-bold text-brand-accent">
            <Star size={9} strokeWidth={2.6} /> Gold tier
          </span>
        </div>

        <div className="relative mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] font-black tracking-[-1px] text-text leading-none tabular-nums">
              {formatNum(points)}
            </span>
            <span className="text-[13px] font-bold text-white/65 tracking-[1px]">
              PTS
            </span>
          </div>
          <p className="text-[11.5px] text-white/65 m-0 mt-1.5">
            Worth approximately ₦{formatNum(Math.floor(points * 5))} in benefits
          </p>
        </div>

        <div className="relative mt-4 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-1.5 text-[10.5px]">
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
      </motion.article>

      <section className="relative overflow-hidden rounded-2xl bg-[var(--c-surface)] border border-[var(--c-accent-border)] p-4">
        <span aria-hidden className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-accent/[0.16] blur-2xl" />
        <span aria-hidden className="pointer-events-none absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-brand-gold-soft/[0.12] blur-2xl" />

        <div className="relative flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.32)] shrink-0">
            <UserPlus size={17} strokeWidth={2} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[1.2px] text-brand-accent font-bold m-0">
              <Wallet size={10} /> Refer & earn cash
            </p>
            <h3 className="text-[16px] font-bold text-[var(--c-text)] m-0 mt-1 tracking-[-0.2px] leading-tight">
              Earn ₦{formatNum(REFERRAL.perReferral)} per friend
            </h3>
            <p className="text-[11.5px] text-[var(--c-text-muted)] m-0 mt-1 leading-snug">
              Paid in real cash to your wallet · friend gets ₦{formatNum(REFERRAL.friendBonus)} welcome bonus
            </p>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-2 mt-4">
          <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] px-3 py-2.5">
            <p className="text-[9.5px] uppercase tracking-[1.1px] text-[var(--c-text-muted)] font-semibold m-0">
              Friends joined
            </p>
            <p className="text-[18px] font-black text-[var(--c-text)] m-0 mt-0.5 tabular-nums tracking-[-0.4px]">
              {formatNum(REFERRAL.friends)}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] px-3 py-2.5">
            <p className="text-[9.5px] uppercase tracking-[1.1px] text-brand-accent font-bold m-0">
              Cash earned
            </p>
            <p className="text-[18px] font-black text-[var(--c-text)] m-0 mt-0.5 tabular-nums tracking-[-0.4px]">
              ₦{formatNum(REFERRAL.earned)}
            </p>
          </div>
        </div>

        <div className="relative mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-dashed border-[var(--c-accent-border)]">
          <div className="flex-1 min-w-0 leading-tight">
            <p className="text-[9.5px] uppercase tracking-[1.1px] text-[var(--c-text-muted)] font-semibold m-0">
              Your referral code
            </p>
            <p className="text-[16px] font-black text-brand-accent m-0 mt-0.5 tracking-[1.8px] truncate">
              {REFERRAL.code}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCopy('code', REFERRAL.code)}
            aria-label="Copy referral code"
            className={[
              'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-[10.5px] font-bold tracking-[0.2px] active:scale-95 transition shrink-0',
              copied === 'code'
                ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
                : 'bg-[var(--c-surface)] border border-[var(--c-border)] text-brand-accent hover:border-[var(--c-accent-border)]',
            ].join(' ')}
          >
            {copied === 'code'
              ? <><Check size={11} strokeWidth={2.8} /> Copied</>
              : <><Copy size={11} /> Copy</>}
          </button>
        </div>

        <div className="relative mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleCopy('link', REFERRAL.link)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] text-[11.5px] font-bold active:scale-95 hover:border-[var(--c-accent-border)] transition"
          >
            {copied === 'link'
              ? <><Check size={12} strokeWidth={2.8} /> Link copied</>
              : <><Copy size={12} /> Copy link</>}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[11.5px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.32)] active:scale-95 transition"
          >
            <Share2 size={12} strokeWidth={2.6} /> Share
          </button>
        </div>
      </section>

      <button
        type="button"
        className="group relative overflow-hidden flex items-center gap-3 p-3.5 rounded-2xl text-left bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] hover:border-[var(--c-accent-border-strong)] active:scale-[0.99] transition"
      >
        <span aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-16 h-16 rounded-full bg-brand-accent/[0.18] blur-2xl group-hover:bg-brand-accent/[0.3] transition" />
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.32)] shrink-0">
          <Coins size={17} strokeWidth={2} />
        </span>
        <div className="relative flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[1.1px] text-brand-accent font-bold m-0">
            Cashback available
          </p>
          <p className="text-[16px] font-black text-[var(--c-text)] m-0 mt-0.5 tabular-nums tracking-[-0.3px]">
            ₦{formatNum(cashback)}
          </p>
        </div>
        <span className="relative inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-primary text-text text-[11px] font-bold">
          Claim <ArrowUpRight size={11} strokeWidth={2.6} />
        </span>
      </button>

      <section>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0">
            <Sparkles size={11} className="text-brand-accent" /> Earn more
          </h3>
        </div>
        <motion.div
          variants={LIST}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-2"
        >
          {EARN.map(({ id, label, rate, icon: Icon, cash }) => (
            <motion.div
              key={id}
              variants={ITEM}
              className="relative overflow-hidden flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent shrink-0">
                <Icon size={15} />
              </span>
              <div className="flex-1 min-w-0 leading-tight">
                <p className="text-[11.5px] font-semibold text-[var(--c-text)] m-0 truncate">
                  {label}
                </p>
                <p className="text-[10px] text-brand-accent font-bold m-0 mt-0.5 tracking-[0.2px] inline-flex items-center gap-1">
                  {cash && <Wallet size={9} strokeWidth={2.6} />}
                  {rate}{cash ? ' cash' : ''}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-[11px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0">
            Perks
          </h3>
          <span className="text-[10px] text-[var(--c-text-muted)] tabular-nums">
            {PERKS.filter(p => p.unlocked || points >= p.cost).length}/{PERKS.length} unlocked
          </span>
        </div>
        <motion.ul
          variants={LIST}
          initial="hidden"
          animate="show"
          className="list-none m-0 p-0 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden"
        >
          {PERKS.map(({ id, label, cost, icon: Icon, unlocked }, i) => {
            const reachable = unlocked || points >= cost
            return (
              <motion.li
                key={id}
                variants={ITEM}
                className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}
              >
                <div className="flex items-center gap-3 p-3">
                  <span
                    className={[
                      'relative inline-flex items-center justify-center w-9 h-9 rounded-[10px] border shrink-0',
                      reachable
                        ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border-[var(--c-accent-border)] text-brand-accent'
                        : 'bg-[var(--c-surface-soft)] border-[var(--c-border-soft)] text-[var(--c-text-faint)]',
                    ].join(' ')}
                  >
                    <Icon size={15} />
                  </span>
                  <div className="flex-1 min-w-0 leading-tight">
                    <p className={['text-[12.5px] font-semibold m-0 truncate', reachable ? 'text-[var(--c-text)]' : 'text-[var(--c-text-muted)]'].join(' ')}>
                      {label}
                    </p>
                    <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5 inline-flex items-center gap-1 tabular-nums">
                      <Coins size={9} className="text-brand-accent" /> {formatNum(cost)} pts
                    </p>
                  </div>
                  {reachable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[10.5px] font-bold border border-[rgba(232,197,71,0.55)] active:scale-95 transition"
                    >
                      <Check size={10} strokeWidth={2.8} /> Claim
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--c-surface-soft)] text-[var(--c-text-faint)] text-[10px] font-semibold">
                      <Lock size={9} />
                    </span>
                  )}
                </div>
              </motion.li>
            )
          })}
        </motion.ul>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-[11px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0">
            Recent earnings
          </h3>
          <button
            type="button"
            className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-brand-accent active:scale-95 transition"
          >
            See all <ChevronRight size={11} />
          </button>
        </div>
        <ul className="list-none m-0 p-0 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
          {RECENT.map((r, i) => {
            const isCash = r.kind === 'cash'
            return (
              <li key={r.id} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5 px-3 py-2.5">
                  <span
                    className={[
                      'inline-flex items-center justify-center w-8 h-8 rounded-[9px] border',
                      isCash
                        ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)]'
                        : 'bg-[var(--c-accent-soft)] border-[var(--c-accent-border)] text-brand-accent',
                    ].join(' ')}
                  >
                    {isCash ? <Wallet size={13} strokeWidth={2.4} /> : <Coins size={13} strokeWidth={2.4} />}
                  </span>
                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="text-[12.5px] font-semibold text-[var(--c-text)] truncate">
                      {r.title}
                    </span>
                    <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5 truncate">
                      {r.meta}
                    </span>
                  </div>
                  <span className={['text-[12.5px] font-bold tabular-nums whitespace-nowrap', isCash ? 'text-[var(--c-success)]' : 'text-brand-accent'].join(' ')}>
                    {isCash ? `+₦${formatNum(r.amount)}` : `+${formatNum(r.amount)} pts`}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
