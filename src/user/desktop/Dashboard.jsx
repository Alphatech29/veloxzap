import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Plus, Smartphone,
  Receipt, CreditCard, ArrowLeftRight, TrendingUp, Wifi,
  Sparkles, ShieldCheck, ChevronRight, Bell, Gift, Calendar,
  Target, Check, Clock, Coins, PiggyBank, Search,
} from 'lucide-react'
import useUser from '../../hooks/useUser'

function buildAccounts(wallet) {
  const ngnBalance = Number(wallet?.available_balance ?? 0)
  return [
    { id: 'ngn',  symbol: '₦', label: 'NGN',  name: 'Naira wallet',  balance: ngnBalance, delta: 0 },
    { id: 'usd',  symbol: '$', label: 'USD',  name: 'Dollar wallet', balance: 0,          delta: 0 },
    { id: 'usdt', symbol: '₮', label: 'USDT', name: 'Stable coin',   balance: 0,          delta: 0 },
  ]
}

const TREND_30D = [
  680, 705, 690, 712, 740, 728, 760, 805, 790, 820,
  812, 840, 875, 860, 904, 940, 925, 968, 1010, 998,
  1032, 1075, 1060, 1110, 1158, 1142, 1190, 1228, 1268, 1284,
]

const HERO_METRICS = [
  { id: '24h',  label: 'Last 24h',  value: '+₦42,500', tone: 'success' },
  { id: '7d',   label: 'Last 7d',   value: '+₦210k',   tone: 'success' },
  { id: 'mtd',  label: 'This month', value: '+₦344k',   tone: 'success' },
  { id: 'ytd',  label: 'YTD',       value: '+₦4.2M',   tone: 'success' },
]

const QUICK_ACTIONS = [
  { to: '/user/airtime',   label: 'Airtime',     icon: Smartphone, featured: true },
  { to: '/user/data',      label: 'Data',        icon: Wifi },
  { to: '/user/bills',     label: 'Bills',       icon: Receipt },
  { to: '/user/cards',     label: 'Cards',       icon: CreditCard },
  { to: '/user/convert',   label: 'Convert',     icon: ArrowLeftRight },
  { to: '/user/rewards',   label: 'Rewards',     icon: Gift },
]

const RECENT = [
  { id: 't1', kind: 'in',  category: 'Funding',     title: 'Paystack funding',         meta: 'Today · 09:42',     amount: 250000, status: 'completed' },
  { id: 't2', kind: 'out', category: 'Airtime',     title: 'MTN · 0803 555 1234',      meta: 'Today · 08:11',     amount: 2000,   status: 'completed' },
  { id: 't3', kind: 'out', category: 'Cable TV',    title: 'DSTV Compact',             meta: 'Yesterday · 21:04', amount: 14500,  status: 'completed' },
  { id: 't4', kind: 'in',  category: 'Swap',        title: 'USDT → NGN',               meta: 'Yesterday · 14:30', amount: 87420,  status: 'completed' },
  { id: 't5', kind: 'out', category: 'Electricity', title: 'Ikeja Electric · Prepaid', meta: 'May 1 · 11:22',     amount: 9800,   status: 'completed' },
  { id: 't6', kind: 'out', category: 'Card',        title: 'Spotify · Annual',         meta: 'Apr 28 · 19:48',    amount: 24500,  status: 'pending' },
]

const SPENDING_CATEGORIES = [
  { id: 'bills',     label: 'Bills & utilities', amount: 124300, pct: 42, color: '#C9A227' },
  { id: 'card',      label: 'Card spending',     amount: 88420,  pct: 30, color: '#7AA7FF' },
  { id: 'transfers', label: 'Transfers',         amount: 49600,  pct: 16, color: '#E89B6B' },
  { id: 'airtime',   label: 'Airtime & data',    amount: 35820,  pct: 12, color: '#5BD0A0' },
]

const UPCOMING = [
  { id: 'u1', label: 'DSTV Compact',     due: 'Jun 2',  amount: 14500, icon: Receipt },
  { id: 'u2', label: 'Spectranet 100GB', due: 'Jun 9',  amount: 22000, icon: Wifi },
  { id: 'u3', label: 'Ikeja Electric',   due: 'Jun 12', amount: 10000, icon: Sparkles },
]

const HERO_BG = `radial-gradient(640px 240px at 100% 0%, rgba(201,162,39,0.32), transparent 65%), radial-gradient(420px 200px at 0% 100%, rgba(232,197,71,0.18), transparent 60%), linear-gradient(135deg, rgba(20,42,92,0.98), rgba(10,31,68,1))`

function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatShort(n) {
  return n.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function formatAccountBalance(account) {
  if (account.id === 'ngn') return formatNGN(account.balance)
  return account.symbol + account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function todayString() {
  return new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
}

function Sparkline({ data, color = '#C9A227', height = 56, gradId = 'spark' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 100
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = height - ((v - min) / range) * (height - 6) - 3
    return [x, y]
  })
  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
  const areaPath = `${linePath} L${w},${height} L0,${height} Z`

  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function Dashboard() {
  const { user, wallet, loading } = useUser()
  const [hidden, setHidden] = useState(false)
  const [activeAccount, setActiveAccount] = useState('ngn')

  const rawFirst = (user?.full_name || '').trim().split(/\s+/)[0] || ''
  const firstName = rawFirst
    ? rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1).toLowerCase()
    : ''

  const accounts = buildAccounts(wallet)
  const account = accounts.find(a => a.id === activeAccount) || accounts[0]

  const inflow = 642300
  const outflow = 298140
  const cashback = 12500
  const savingsGoal = 500000
  const savingsCurrent = 312400
  const savingsPct = Math.min(100, Math.round((savingsCurrent / savingsGoal) * 100))

  return (
    <div className="flex flex-col gap-4 max-w-[1320px] mx-auto pb-10">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.4px] text-brand-accent font-bold m-0">
            <Sparkles size={10} />
            {greeting()} · {todayString()}
          </p>
          <h1 className="text-[24px] font-bold tracking-[-0.5px] text-[var(--c-text)] m-0 mt-1.5">
            Welcome back,{' '}
            {firstName ? (
              <span className="text-brand-accent">{firstName}</span>
            ) : loading ? (
              <span
                aria-hidden
                className="inline-block align-[-2px] w-[120px] h-[20px] rounded-md bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] animate-pulse"
              />
            ) : (
              <span className="text-brand-accent">there</span>
            )}
          </h1>
        </div>
      </header>

      <article
        className="relative overflow-hidden rounded-2xl border border-[rgba(201,162,39,0.32)] text-text shadow-[0_18px_44px_-18px_rgba(2,7,23,0.55)]"
        style={{ background: HERO_BG }}
      >
        <span aria-hidden className="pointer-events-none absolute -top-24 -right-24 w-[340px] h-[340px] rounded-full bg-brand-accent/[0.16] blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 w-[240px] h-[240px] rounded-full bg-brand-gold-soft/[0.12] blur-3xl" />

        <div className="relative grid grid-cols-1 min-[960px]:grid-cols-[1.1fr_1fr] gap-5 p-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex p-0.5 rounded-lg bg-white/[0.06] border border-white/[0.12]">
                {accounts.map(a => {
                  const active = activeAccount === a.id
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setActiveAccount(a.id)}
                      className={[
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-[0.3px] transition',
                        active
                          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_2px_8px_rgba(201,162,39,0.36)]'
                          : 'text-white/65 hover:text-text',
                      ].join(' ')}
                    >
                      <span className="tabular-nums">{a.symbol}</span> {a.label}
                    </button>
                  )
                })}
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.16] text-[9.5px] uppercase tracking-[1px] text-white/80 font-bold">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand-accent animate-ping opacity-70" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-brand-accent" />
                </span>
                Live
              </span>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[1.1px] text-white/55 m-0 font-bold">
                {account.name}
              </p>
              <div className="flex items-baseline gap-2 mt-1.5">
                {loading && !wallet ? (
                  <span
                    aria-hidden
                    className="inline-block w-[180px] h-[34px] rounded-md bg-white/[0.08] border border-white/[0.10] animate-pulse"
                  />
                ) : (
                  <span className="text-[34px] font-bold tracking-[-0.8px] text-text leading-none tabular-nums break-all">
                    {hidden ? `${account.symbol}••••••••` : formatAccountBalance(account)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setHidden(h => !h)}
                  aria-label={hidden ? 'Show balance' : 'Hide balance'}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-white/[0.08] border border-white/[0.14] text-text hover:bg-white/[0.14] transition shrink-0 self-end"
                >
                  {hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
              <p className="text-[10.5px] text-white/55 m-0 mt-1.5 inline-flex items-center gap-1">
                <TrendingUp size={10} className="text-brand-accent" />
                <span className="text-brand-accent font-bold">+{account.delta}%</span>
                vs last month
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <Link
                to="/user/deposit"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[11px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.3)] hover:-translate-y-px transition"
              >
                <ArrowDownLeft size={12} strokeWidth={2.6} /> Deposit
              </Link>
              <button type="button" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.08] border border-white/[0.16] text-text text-[11px] font-bold hover:bg-white/[0.14] transition">
                <ArrowUpRight size={12} strokeWidth={2.6} /> Withdraw
              </button>
              <Link
                to="/user/convert"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-transparent border border-white/[0.16] text-text text-[11px] font-bold hover:bg-white/[0.08] transition"
              >
                <ArrowLeftRight size={12} strokeWidth={2.6} /> Convert
              </Link>
              <Link
                to="/user/transactions"
                className="inline-flex items-center gap-0.5 ml-auto text-[10.5px] font-semibold text-white/70 hover:text-brand-accent transition"
              >
                Statement <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-[960px]:border-l min-[960px]:border-white/[0.08] min-[960px]:pl-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[1.1px] text-white/55 m-0 font-bold">
                30-day movement
              </p>
              <p className="text-[10.5px] text-brand-accent font-bold tabular-nums inline-flex items-center gap-0.5">
                <TrendingUp size={10} /> +88.6%
              </p>
            </div>
            <div className="h-[80px]">
              <Sparkline data={TREND_30D} gradId="hero-spark" />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {HERO_METRICS.map(m => (
                <div
                  key={m.id}
                  className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.10]"
                >
                  <p className="text-[9px] uppercase tracking-[0.9px] text-white/55 font-bold m-0">
                    {m.label}
                  </p>
                  <p className="text-[12px] font-bold text-brand-accent m-0 mt-0.5 tabular-nums tracking-[-0.1px]">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-between gap-2 px-5 py-2.5 border-t border-white/[0.06] bg-white/[0.02]">
          <span className="inline-flex items-center gap-1.5 text-[10px] text-white/50">
            <ShieldCheck size={11} className="text-brand-accent" />
            Vault secured · 256-bit encryption
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-white/50">
            <Sparkles size={10} className="text-brand-accent" />
            Updated just now
          </span>
        </div>
      </article>

      <section className="grid grid-cols-2 min-[640px]:grid-cols-4 gap-3">
        <KpiCard
          icon={ArrowDownLeft}
          label="Inflow"
          value={`₦${formatShort(inflow)}`}
          delta="+18.2%"
          tone="success"
          hint="This month"
        />
        <KpiCard
          icon={ArrowUpRight}
          label="Outflow"
          value={`₦${formatShort(outflow)}`}
          delta="-4.7%"
          tone="warn"
          deltaTone="danger"
          hint="This month"
        />
        <KpiCard
          icon={Coins}
          label="Cashback ready"
          value={`₦${formatShort(cashback)}`}
          delta="Claim"
          tone="accent"
          deltaTone="accent"
          hint="Across services"
          to="/user/rewards"
        />
        <KpiCard
          icon={PiggyBank}
          label="Savings goal"
          value={`₦${formatShort(savingsCurrent)}`}
          delta={`${savingsPct}%`}
          tone="muted"
          deltaTone="accent"
          hint={`of ₦${formatShort(savingsGoal)}`}
          progress={savingsPct}
        />
      </section>

      <section>
        <div className="flex items-end justify-between gap-3 mb-2">
          <div>
            <h2 className="text-[14px] font-bold m-0 text-[var(--c-text)] tracking-[-0.2px]">
              Quick actions
            </h2>
            <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">
              Move fast — pick a service to get started.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
            <Sparkles size={9} /> {QUICK_ACTIONS.length} services
          </span>
        </div>
        <div className="grid grid-cols-3 min-[640px]:grid-cols-6 gap-2">
          {QUICK_ACTIONS.map(({ to, label, icon: Icon, featured }) => (
            <Link
              key={to}
              to={to}
              className={[
                'group relative overflow-hidden flex flex-col items-center gap-2 p-3 rounded-xl text-center transition duration-300 hover:-translate-y-0.5',
                featured
                  ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] hover:border-[var(--c-accent-border-strong)] hover:shadow-[0_12px_28px_-10px_rgba(201,162,39,0.45)]'
                  : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] hover:shadow-[0_12px_28px_-12px_rgba(2,7,23,0.4)]',
              ].join(' ')}
            >
              <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-[80px] h-[80px] rounded-full bg-brand-accent/[0.08] blur-2xl group-hover:bg-brand-accent/[0.22] transition" />
              <span
                className={[
                  'relative inline-flex items-center justify-center w-10 h-10 rounded-xl border transition',
                  featured
                    ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.32)]'
                    : 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border-[var(--c-accent-border)] group-hover:shadow-[0_0_18px_-2px_rgba(201,162,39,0.4)]',
                ].join(' ')}
              >
                <Icon size={16} strokeWidth={2} />
              </span>
              <span className="relative text-[11px] font-bold text-[var(--c-text)] tracking-[-0.1px]">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.55fr_1fr] gap-3">
        <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
          <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--c-border)]">
            <div>
              <h2 className="text-[13px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                Recent activity
              </h2>
              <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Latest 6 transactions across all wallets.
              </p>
            </div>
            <Link
              to="/user/transactions"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-accent hover:underline"
            >
              See all <ChevronRight size={11} />
            </Link>
          </header>

          <ul className="m-0 list-none p-0">
            {RECENT.map((tx, i) => (
              <li
                key={tx.id}
                className={[
                  'grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-2.5 hover:bg-[var(--c-surface-soft)] transition',
                  i > 0 ? 'border-t border-[var(--c-border)]' : '',
                ].join(' ')}
              >
                <span
                  className={[
                    'inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0',
                    tx.kind === 'in'
                      ? 'text-[var(--c-success)] bg-[var(--c-success-bg)]'
                      : 'text-[var(--c-warn)] bg-[var(--c-warn-bg)]',
                  ].join(' ')}
                >
                  {tx.kind === 'in'
                    ? <ArrowDownLeft size={13} strokeWidth={2.4} />
                    : <ArrowUpRight size={13} strokeWidth={2.4} />}
                </span>
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="text-[12.5px] font-semibold text-[var(--c-text)] truncate">
                    {tx.title}
                  </span>
                  <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5">
                    {tx.category} · {tx.meta}
                  </span>
                </div>
                <span
                  className={[
                    'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] uppercase tracking-[0.8px] font-bold',
                    tx.status === 'pending'
                      ? 'bg-[var(--c-warn-bg)] text-[var(--c-warn)]'
                      : 'bg-[var(--c-success-bg)] text-[var(--c-success)]',
                  ].join(' ')}
                >
                  {tx.status === 'pending'
                    ? <><Clock size={9} strokeWidth={3} /> Pending</>
                    : <><Check size={9} strokeWidth={3} /> Done</>}
                </span>
                <span
                  className={[
                    'text-[12.5px] font-bold tabular-nums whitespace-nowrap min-w-[100px] text-right',
                    tx.kind === 'in' ? 'text-[var(--c-success)]' : 'text-[var(--c-text)]',
                  ].join(' ')}
                >
                  {tx.kind === 'in' ? '+' : '-'}{formatNGN(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <div className="flex flex-col gap-3">
          <article className="p-4 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[12px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                Spending breakdown
              </h3>
              <span className="text-[9.5px] text-[var(--c-text-muted)] tabular-nums">May</span>
            </div>

            <div className="relative h-2 rounded-full bg-[var(--c-surface-soft)] overflow-hidden flex">
              {SPENDING_CATEGORIES.map(c => (
                <div key={c.id} style={{ width: `${c.pct}%`, background: c.color }} />
              ))}
            </div>

            <ul className="m-0 list-none p-0 mt-2.5 flex flex-col gap-1.5">
              {SPENDING_CATEGORIES.map(c => (
                <li key={c.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-[2px]" style={{ background: c.color }} />
                  <span className="text-[11px] font-semibold text-[var(--c-text)] truncate">
                    {c.label}
                  </span>
                  <span className="text-[11px] font-bold tabular-nums text-[var(--c-text)] whitespace-nowrap">
                    ₦{formatShort(c.amount)} <span className="text-[var(--c-text-muted)] font-medium">· {c.pct}%</span>
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="p-4 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                <Calendar size={11} className="text-brand-accent" /> Upcoming
              </h3>
              <Link to="/user/bills" className="text-[10px] font-semibold text-brand-accent hover:underline">
                Manage
              </Link>
            </div>
            <ul className="m-0 list-none p-0 flex flex-col gap-1.5">
              {UPCOMING.map(({ id, label, due, amount, icon: Icon }) => (
                <li key={id} className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]">
                    <Icon size={12} />
                  </span>
                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="text-[11.5px] font-semibold text-[var(--c-text)] truncate">
                      {label}
                    </span>
                    <span className="text-[9.5px] text-[var(--c-text-muted)] mt-0.5 inline-flex items-center gap-0.5">
                      <Calendar size={8} /> Due {due}
                    </span>
                  </div>
                  <span className="text-[11.5px] font-bold tabular-nums text-[var(--c-text)] whitespace-nowrap">
                    ₦{formatShort(amount)}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="relative overflow-hidden p-4 rounded-xl border border-[var(--c-accent-border)] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)]">
            <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-brand-accent/[0.18] blur-2xl" />
            <div className="relative flex items-start gap-2.5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.3)] shrink-0">
                <Gift size={15} strokeWidth={2} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="inline-flex items-center gap-1 text-[9.5px] uppercase tracking-[1.1px] text-brand-accent font-bold m-0">
                  Refer & earn
                </p>
                <h3 className="text-[13px] font-bold text-[var(--c-text)] m-0 mt-1 tracking-[-0.1px]">
                  ₦1,000 per friend
                </h3>
                <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-1 leading-snug">
                  Real cash to your wallet. Friend gets ₦500 too.
                </p>
                <Link
                  to="/user/rewards"
                  className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-brand-primary text-text text-[10.5px] font-bold hover:bg-brand-primary/90 transition"
                >
                  Open rewards <ChevronRight size={10} />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, delta, tone, deltaTone, hint, progress, to }) {
  const toneMap = {
    success: 'bg-[var(--c-success-bg)] text-[var(--c-success)]',
    warn:    'bg-[var(--c-warn-bg)] text-[var(--c-warn)]',
    accent:  'bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]',
    muted:   'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)]',
  }
  const deltaMap = {
    success: 'text-[var(--c-success)]',
    danger:  'text-[var(--c-danger)]',
    accent:  'text-brand-accent',
  }
  const Wrapper = to ? Link : 'article'
  const wrapperProps = to ? { to } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className="group relative overflow-hidden p-3 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] transition block"
    >
      <span aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-16 h-16 rounded-full bg-brand-accent/[0.06] blur-2xl group-hover:bg-brand-accent/[0.14] transition" />
      <div className="relative flex items-center justify-between gap-2 mb-2">
        <span className={['inline-flex items-center justify-center w-8 h-8 rounded-lg', toneMap[tone] || toneMap.muted].join(' ')}>
          <Icon size={13} strokeWidth={2.4} />
        </span>
        {delta && (
          <span className={['inline-flex items-center gap-0.5 text-[10px] font-bold tabular-nums whitespace-nowrap', deltaMap[deltaTone] || 'text-[var(--c-text-muted)]'].join(' ')}>
            {deltaTone === 'success' && <TrendingUp size={9} strokeWidth={2.8} />}
            {deltaTone === 'danger' && <TrendingUp size={9} strokeWidth={2.8} className="rotate-180" />}
            {delta}
          </span>
        )}
      </div>
      <p className="relative text-[10px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)] m-0">
        {label}
      </p>
      <p className="relative text-[16px] font-black text-[var(--c-text)] m-0 mt-0.5 tabular-nums tracking-[-0.3px]">
        {value}
      </p>
      {progress !== undefined && (
        <div className="relative h-1 rounded-full bg-[var(--c-surface-soft)] mt-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-accent to-brand-gold-soft rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {hint && (
        <p className="relative text-[9.5px] text-[var(--c-text-muted)] m-0 mt-1.5 truncate">
          {hint}
        </p>
      )}
    </Wrapper>
  )
}
