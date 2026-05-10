import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Snowflake, Eye, EyeOff, ListChecks, Sparkles, Wifi,
  Copy, Check, ArrowDownLeft, ArrowUpRight, ShieldCheck,
  TrendingUp, CreditCard, Lock, Zap, Receipt, ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const CARDS = [
  {
    id: 'ngn',
    label: 'Naira',
    currency: 'NGN',
    symbol: '₦',
    name: 'Virtual Naira',
    balance: 1284750.45,
    last4: '4521',
    full: '5061 2390 8721 4521',
    expiry: '08/29',
    cvv: '328',
    network: 'Verve',
    decimals: 2,
    dailyLimit: 5000000,
    dailyUsed: 1240000,
    monthlyLimit: 20000000,
    monthlyUsed: 8420000,
  },
  {
    id: 'usd',
    label: 'Dollar',
    currency: 'USD',
    symbol: '$',
    name: 'Virtual Dollar',
    balance: 320.50,
    last4: '7812',
    full: '4012 3456 9876 7812',
    expiry: '11/29',
    cvv: '149',
    network: 'Visa',
    decimals: 2,
    dailyLimit: 5000,
    dailyUsed: 480,
    monthlyLimit: 50000,
    monthlyUsed: 12400,
  },
]

const RECENT_BY_CARD = {
  ngn: [
    { id: 'n1', kind: 'out', title: 'Spotify · Annual',     meta: 'Today · 14:20',      amount: 24500, status: 'completed' },
    { id: 'n2', kind: 'out', title: 'Apple iCloud · 200GB', meta: 'Yesterday',          amount: 1300,  status: 'completed' },
    { id: 'n3', kind: 'in',  title: 'Card top-up',          meta: 'May 4 · 11:42',      amount: 50000, status: 'completed' },
    { id: 'n4', kind: 'out', title: 'Konga · Order',        meta: 'May 2',              amount: 38900, status: 'completed' },
  ],
  usd: [
    { id: 'u1', kind: 'out', title: 'Netflix · Premium',    meta: 'Today · 09:14',      amount: 19.99, status: 'completed' },
    { id: 'u2', kind: 'out', title: 'GitHub Copilot',       meta: 'Yesterday',          amount: 10.00, status: 'completed' },
    { id: 'u3', kind: 'in',  title: 'Card top-up',          meta: 'May 3',              amount: 200,   status: 'completed' },
  ],
}

const NGN_BG = `radial-gradient(circle at 110% -10%, rgba(201, 162, 39, 0.5), transparent 55%), radial-gradient(circle at -10% 110%, rgba(232, 197, 71, 0.2), transparent 55%), linear-gradient(135deg, rgba(20, 42, 92, 1), rgba(10, 31, 68, 1))`
const USD_BG = `radial-gradient(circle at 110% -10%, rgba(110, 231, 167, 0.36), transparent 55%), radial-gradient(circle at -10% 110%, rgba(46, 139, 87, 0.18), transparent 55%), linear-gradient(135deg, rgba(15, 56, 47, 1), rgba(6, 24, 19, 1))`

function formatNumber(n, decimals = 2) {
  return n.toLocaleString('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function formatShort(n) {
  return n.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export default function DesktopCards() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState('ngn')
  const [revealed, setRevealed] = useState(false)
  const [frozen, setFrozen] = useState(false)
  const [copied, setCopied] = useState(null)

  const card = CARDS.find(c => c.id === activeId)
  const cardBg = card.id === 'ngn' ? NGN_BG : USD_BG
  const accent = card.id === 'ngn' ? '#C9A227' : '#6EE7A7'
  const cardholder = (user?.full_name || 'VELOXZAP MEMBER').toUpperCase()
  const recent = RECENT_BY_CARD[card.id] || []

  const dailyPct = Math.round((card.dailyUsed / card.dailyLimit) * 100)
  const monthlyPct = Math.round((card.monthlyUsed / card.monthlyLimit) * 100)

  function handleCopy(key, value) {
    if (navigator.clipboard) navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
            <Sparkles size={10} /> Spend anywhere
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Virtual cards
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Naira & dollar cards · accepted globally · no monthly fee.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[12px] font-bold border border-[rgba(232,197,71,0.6)] shadow-[0_6px_18px_-6px_rgba(201,162,39,0.45)] hover:-translate-y-px transition"
        >
          <Plus size={13} strokeWidth={2.6} /> New card
        </button>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.2fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">

          <div className="inline-flex p-1 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] self-start">
            {CARDS.map(c => {
              const active = c.id === activeId
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { setActiveId(c.id); setRevealed(false); setCopied(null) }}
                  className={[
                    'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-[0.2px] transition',
                    active
                      ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_3px_10px_rgba(201,162,39,0.3)]'
                      : 'text-[var(--c-text-muted)] hover:text-[var(--c-text)]',
                  ].join(' ')}
                >
                  <span className="tabular-nums">{c.symbol}</span> {c.label}
                </button>
              )
            })}
          </div>

          <div className="relative" style={{ perspective: '1200px' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={card.id}
                initial={{ opacity: 0, rotateY: -90, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: 90, scale: 0.95 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[1.586/1] max-w-[460px] rounded-2xl text-text shadow-[0_24px_48px_-18px_rgba(2,7,23,0.7)] overflow-hidden"
                style={{ background: cardBg, transformStyle: 'preserve-3d' }}
              >
                <span aria-hidden className="pointer-events-none absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full" style={{ background: `radial-gradient(circle, ${accent}55, transparent 70%)` }} />
                <span aria-hidden className="pointer-events-none absolute -bottom-12 -left-12 w-[150px] h-[150px] rounded-full" style={{ background: `radial-gradient(circle, ${accent}33, transparent 70%)` }} />

                <div className="relative h-full p-5 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[9.5px] uppercase tracking-[1.4px] text-white/55 font-bold m-0">
                        VeloxZap
                      </p>
                      <p className="text-[14px] font-bold text-text m-0 mt-1">
                        {card.name}
                      </p>
                    </div>
                    <Wifi size={20} className="text-white/65 rotate-90" />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="inline-block w-9 h-7 rounded-[6px]"
                      style={{
                        background: `linear-gradient(135deg, ${accent}d0, ${accent}80)`,
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
                      }}
                    />
                    <p className="text-[18px] font-mono font-bold tracking-[3px] text-text m-0 tabular-nums">
                      {revealed ? card.full : `•••• •••• •••• ${card.last4}`}
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[8.5px] uppercase tracking-[1.2px] text-white/55 font-bold m-0">
                        Cardholder
                      </p>
                      <p className="text-[11.5px] font-bold tracking-[1.5px] text-text m-0 mt-0.5 truncate max-w-[200px]">
                        {cardholder}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8.5px] uppercase tracking-[1.2px] text-white/55 font-bold m-0">
                        Expires
                      </p>
                      <p className="text-[11.5px] font-bold tracking-[1px] text-text m-0 mt-0.5 tabular-nums">
                        {card.expiry}
                      </p>
                    </div>
                    <p className="text-[14px] font-black italic tracking-[1px] text-text m-0">
                      {card.network}
                    </p>
                  </div>

                  {frozen && (
                    <div
                      aria-hidden
                      className="absolute inset-0 backdrop-blur-md bg-white/[0.06] flex items-center justify-center"
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.16] border border-white/[0.24] text-text text-[11px] font-bold uppercase tracking-[1.5px]">
                        <Snowflake size={13} /> Card frozen
                      </div>
                    </div>
                  )}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <ActionButton icon={ArrowDownLeft} label="Top up" onClick={() => navigate('/user/convert')} primary />
            <ActionButton
              icon={Snowflake}
              label={frozen ? 'Unfreeze' : 'Freeze'}
              onClick={() => setFrozen(f => !f)}
              active={frozen}
            />
            <ActionButton
              icon={revealed ? EyeOff : Eye}
              label={revealed ? 'Hide' : 'Reveal'}
              onClick={() => setRevealed(r => !r)}
            />
            <ActionButton icon={ListChecks} label="History" onClick={() => navigate('/user/transactions')} />
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.article
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden"
              >
                <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)]">
                  <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)]">
                    <Lock size={12} className="text-brand-accent" /> Secure card details
                  </h3>
                  <span className="text-[10px] text-[var(--c-text-muted)]">
                    Auto-hide in 30s
                  </span>
                </header>
                <div className="grid grid-cols-1 min-[640px]:grid-cols-3 gap-1.5 p-3">
                  <CopyRow
                    label="Card number"
                    value={card.full}
                    mono
                    copyKey="full"
                    copied={copied === 'full'}
                    onCopy={() => handleCopy('full', card.full.replace(/\s/g, ''))}
                  />
                  <CopyRow
                    label="Expiry"
                    value={card.expiry}
                    mono
                    copyKey="exp"
                    copied={copied === 'exp'}
                    onCopy={() => handleCopy('exp', card.expiry)}
                  />
                  <CopyRow
                    label="CVV"
                    value={card.cvv}
                    mono
                    copyKey="cvv"
                    copied={copied === 'cvv'}
                    onCopy={() => handleCopy('cvv', card.cvv)}
                  />
                </div>
              </motion.article>
            )}
          </AnimatePresence>

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)]">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                <Receipt size={12} className="text-brand-accent" /> Card transactions
              </h3>
              <button
                type="button"
                onClick={() => navigate('/user/transactions')}
                className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-brand-accent hover:underline"
              >
                See all <ChevronRight size={11} />
              </button>
            </header>
            {recent.length === 0 ? (
              <p className="px-4 py-6 text-[11.5px] text-[var(--c-text-muted)] m-0 text-center">
                No transactions on this card yet.
              </p>
            ) : (
              <ul className="list-none m-0 p-0">
                {recent.map((tx, i) => (
                  <li
                    key={tx.id}
                    className={[
                      'grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2.5 hover:bg-[var(--c-surface-soft)] transition',
                      i > 0 ? 'border-t border-[var(--c-border)]' : '',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
                        tx.kind === 'in'
                          ? 'text-[var(--c-success)] bg-[var(--c-success-bg)]'
                          : 'text-[var(--c-warn)] bg-[var(--c-warn-bg)]',
                      ].join(' ')}
                    >
                      {tx.kind === 'in'
                        ? <ArrowDownLeft size={12} strokeWidth={2.4} />
                        : <ArrowUpRight size={12} strokeWidth={2.4} />}
                    </span>
                    <div className="flex flex-col min-w-0 leading-tight">
                      <span className="text-[12px] font-semibold text-[var(--c-text)] truncate">
                        {tx.title}
                      </span>
                      <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5">
                        {tx.meta}
                      </span>
                    </div>
                    <span
                      className={[
                        'text-[12px] font-bold tabular-nums whitespace-nowrap',
                        tx.kind === 'in' ? 'text-[var(--c-success)]' : 'text-[var(--c-text)]',
                      ].join(' ')}
                    >
                      {tx.kind === 'in' ? '+' : '-'}{card.symbol}{formatNumber(tx.amount, card.decimals)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>

        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">

          <article className="relative overflow-hidden rounded-xl bg-[var(--c-surface)] border border-[var(--c-accent-border)] p-4">
            <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-brand-accent/[0.16] blur-2xl" />
            <p className="relative text-[10px] uppercase tracking-[1.1px] text-brand-accent font-bold m-0">
              Available balance
            </p>
            <p className="relative text-[24px] font-black tabular-nums tracking-[-0.5px] text-[var(--c-text)] m-0 mt-1.5">
              {card.symbol}{formatNumber(card.balance, card.decimals)}
            </p>
            <p className="relative text-[10.5px] text-[var(--c-text-muted)] m-0 mt-1 inline-flex items-center gap-1">
              <CreditCard size={11} className="text-brand-accent" />
              Card ending {card.last4} · {card.network}
            </p>
            <button
              type="button"
              onClick={() => navigate('/user/convert')}
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[11px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.28)] hover:-translate-y-px transition"
            >
              <Zap size={11} strokeWidth={2.6} /> Top up card
            </button>
          </article>

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                <ShieldCheck size={11} className="text-brand-accent" /> Spending limits
              </h3>
              <button
                type="button"
                className="text-[10px] font-semibold text-brand-accent hover:underline"
              >
                Adjust
              </button>
            </div>

            <LimitRow
              label="Daily"
              used={card.dailyUsed}
              limit={card.dailyLimit}
              pct={dailyPct}
              symbol={card.symbol}
              decimals={card.decimals}
            />
            <div className="h-2.5" />
            <LimitRow
              label="Monthly"
              used={card.monthlyUsed}
              limit={card.monthlyLimit}
              pct={monthlyPct}
              symbol={card.symbol}
              decimals={card.decimals}
            />
          </article>

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)] mb-2.5">
              <TrendingUp size={11} className="text-brand-accent" /> Card stats
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Spent today"  value={`${card.symbol}${formatShort(card.dailyUsed)}`} />
              <Stat label="This month"   value={`${card.symbol}${formatShort(card.monthlyUsed)}`} />
              <Stat label="Transactions" value="38" />
              <Stat label="Cashback"     value={`${card.symbol}${card.id === 'ngn' ? '420' : '4.20'}`} accent />
            </div>
          </article>

          <article className="relative overflow-hidden rounded-xl border border-dashed border-[var(--c-accent-border)] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] p-4">
            <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-brand-accent/[0.18] blur-2xl" />
            <div className="relative flex items-start gap-2.5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.3)] shrink-0">
                <Plus size={15} strokeWidth={2.4} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[9.5px] uppercase tracking-[1.1px] text-brand-accent font-bold m-0">
                  More cards
                </p>
                <h3 className="text-[12.5px] font-bold text-[var(--c-text)] m-0 mt-1">
                  Add EUR or GBP card
                </h3>
                <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-1 leading-snug">
                  Spend in 180+ countries · ₦500 issuance fee.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-brand-primary text-text text-[10.5px] font-bold hover:bg-brand-primary/90 transition"
                >
                  Order now <ChevronRight size={10} />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

function ActionButton({ icon: Icon, label, onClick, primary, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group relative overflow-hidden flex flex-col items-center gap-1.5 py-3 rounded-xl transition active:scale-[0.97]',
        primary
          ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] hover:border-[var(--c-accent-border-strong)]'
          : active
            ? 'bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent'
            : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
      ].join(' ')}
    >
      <span aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-12 h-12 rounded-full bg-brand-accent/[0.06] blur-2xl group-hover:bg-brand-accent/[0.18] transition" />
      <span
        className={[
          'relative inline-flex items-center justify-center w-8 h-8 rounded-lg border transition',
          primary || active
            ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.3)]'
            : 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border-[var(--c-accent-border)]',
        ].join(' ')}
      >
        <Icon size={14} strokeWidth={2.2} />
      </span>
      <span className="relative text-[10.5px] font-bold text-[var(--c-text)] tracking-[-0.1px]">
        {label}
      </span>
    </button>
  )
}

function CopyRow({ label, value, mono, copyKey, copied, onCopy }) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
      <div className="min-w-0 leading-tight flex-1">
        <p className="text-[9.5px] uppercase tracking-[1.05px] text-[var(--c-text-muted)] font-bold m-0">
          {label}
        </p>
        <p
          className={[
            'text-[var(--c-text)] m-0 mt-0.5 truncate',
            mono ? 'font-mono text-[12.5px] font-bold tracking-[0.4px] tabular-nums' : 'text-[12px] font-semibold',
          ].join(' ')}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className={[
          'inline-flex items-center justify-center w-7 h-7 rounded-md transition shrink-0',
          copied
            ? 'bg-[var(--c-success-bg)] text-[var(--c-success)]'
            : 'bg-[var(--c-surface)] border border-[var(--c-border)] text-brand-accent hover:border-[var(--c-accent-border)]',
        ].join(' ')}
      >
        {copied ? <Check size={11} strokeWidth={3} /> : <Copy size={11} />}
      </button>
    </div>
  )
}

function LimitRow({ label, used, limit, pct, symbol, decimals }) {
  const danger = pct >= 85
  const warn = pct >= 60 && pct < 85
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[10.5px] uppercase tracking-[1.05px] font-bold text-[var(--c-text-muted)] m-0">
          {label}
        </p>
        <p className="text-[10.5px] tabular-nums m-0">
          <span className="font-bold text-[var(--c-text)]">{symbol}{formatNumber(used, decimals)}</span>
          <span className="text-[var(--c-text-muted)]"> / {symbol}{formatNumber(limit, decimals)}</span>
        </p>
      </div>
      <div className="relative h-1.5 rounded-full bg-[var(--c-surface-soft)] overflow-hidden">
        <div
          className={[
            'h-full rounded-full transition-all',
            danger
              ? 'bg-[var(--c-danger)]'
              : warn
                ? 'bg-[var(--c-warn)]'
                : 'bg-gradient-to-r from-brand-accent to-brand-gold-soft',
          ].join(' ')}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 mt-1 tabular-nums">
        {pct}% used · {symbol}{formatNumber(limit - used, decimals)} left
      </p>
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className="px-2.5 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
      <p className="text-[9.5px] uppercase tracking-[1.05px] font-bold text-[var(--c-text-muted)] m-0">
        {label}
      </p>
      <p className={['text-[13px] font-black m-0 mt-0.5 tabular-nums tracking-[-0.2px]', accent ? 'text-brand-accent' : 'text-[var(--c-text)]'].join(' ')}>
        {value}
      </p>
    </div>
  )
}
