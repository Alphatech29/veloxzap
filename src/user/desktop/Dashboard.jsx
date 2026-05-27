import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Smartphone,
  Receipt, ArrowLeftRight, TrendingUp, Wifi,
  Sparkles, ShieldCheck, ChevronRight, Gift, Bitcoin,
  Check, Clock, Coins, Lock, X,
} from 'lucide-react'
import useUser from '../../hooks/useUser'
import useTransactions from '../../hooks/useTransactions'

const QUICK_ACTIONS = [
  { to: '/user/airtime',   label: 'Airtime',  icon: Smartphone, featured: true },
  { to: '/user/data',      label: 'Data',     icon: Wifi },
  { to: '/user/bills',     label: 'Bills',    icon: Receipt },
  { to: '/user/trade-cards', label: 'Gift Card', icon: Gift },
  { to: '/user/convert',   label: 'Convert',  icon: ArrowLeftRight },
  { to: '/user/crypto-exchange', label: 'Crypto Exchange', icon: Bitcoin },
]

const PALETTE = ['#C9A227', '#7AA7FF', '#E89B6B', '#5BD0A0', '#A78BFA', '#F472B6']

const HERO_BG = `radial-gradient(640px 240px at 100% 0%, rgba(201,162,39,0.32), transparent 65%), radial-gradient(420px 200px at 0% 100%, rgba(232,197,71,0.18), transparent 60%), linear-gradient(135deg, rgba(20,42,92,0.98), rgba(10,31,68,1))`

function formatNGN(n) {
  return '₦' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function formatShort(n) {
  const v = Number(n)
  if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `₦${Math.round(v / 1_000)}k`
  return '₦' + v.toLocaleString('en-NG')
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

function buildAccounts(wallet) {
  return [
    { id: 'ngn', symbol: '₦', label: 'NGN', name: 'Naira wallet',  balance: Number(wallet?.ngn_balance ?? 0), delta: 0 },
    { id: 'usd', symbol: '$', label: 'USD', name: 'Dollar wallet', balance: Number(wallet?.usd_balance ?? 0), delta: 0 },
  ]
}

function Sparkline({ data, color = '#C9A227', height = 56, gradId = 'spark' }) {
  if (!data.length) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 100
  const points = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    height - ((v - min) / range) * (height - 6) - 3,
  ])
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
  const { transactions: allTx, loading: txLoading, inflow, outflow } = useTransactions({ recentLimit: Infinity })

  const [hidden, setHidden]                 = useState(() => localStorage.getItem('vzap_hide_balance') === '1')
  const [pinBannerDismissed, setPinBannerDismissed] = useState(false)
  const [activeAccount, setActiveAccount]   = useState('ngn')

  const accounts = buildAccounts(wallet)
  const account  = accounts.find(a => a.id === activeAccount) || accounts[0]

  const rawFirst = (user?.full_name || '').trim().split(/\s+/)[0] || ''
  const firstName = rawFirst ? rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1).toLowerCase() : ''

  // Recent 6 for the activity list
  const recentTx = useMemo(() => allTx.slice(0, 6), [allTx])

  // Spending breakdown by category (completed debits)
  const spendingCategories = useMemo(() => {
    const map = {}
    allTx
      .filter(t => t.kind === 'out' && t.status === 'completed')
      .forEach(t => { map[t.category] = (map[t.category] || 0) + t.total })
    const total = Object.values(map).reduce((s, v) => s + v, 0)
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, amount], i) => ({
        id: label, label, amount,
        pct: total ? Math.round((amount / total) * 100) : 0,
        color: PALETTE[i % PALETTE.length],
      }))
  }, [allTx])

  // Hero metrics: outflow per period
  const heroMetrics = useMemo(() => {
    const now = new Date()
    const completed = allTx.filter(t => t.status === 'completed' && t.kind === 'out')
    const sum = list => list.reduce((s, t) => s + t.total, 0)
    const since = ms => completed.filter(t => new Date(t.createdAt) >= new Date(now - ms))
    const inMonth = completed.filter(t => {
      const d = new Date(t.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const inYear = completed.filter(t => new Date(t.createdAt).getFullYear() === now.getFullYear())
    return [
      { id: '24h', label: 'Last 24h',    value: formatShort(sum(since(864e5))) },
      { id: '7d',  label: 'Last 7 days', value: formatShort(sum(since(6048e5))) },
      { id: 'mtd', label: 'This month',  value: formatShort(sum(inMonth)) },
      { id: 'ytd', label: 'YTD',         value: formatShort(sum(inYear)) },
    ]
  }, [allTx])

  // 30-day cumulative outflow sparkline
  const sparklineData = useMemo(() => {
    const DAYS = 30
    const now = new Date()
    const daily = Array(DAYS).fill(0)
    allTx
      .filter(t => t.kind === 'out' && t.status === 'completed')
      .forEach(t => {
        const diff = Math.round((now - new Date(t.createdAt)) / 864e5)
        if (diff >= 0 && diff < DAYS) daily[DAYS - 1 - diff] += t.total
      })
    // cumulative
    let cum = 0
    return daily.map(v => (cum += v))
  }, [allTx])

  const txCount = allTx.length
  const net     = inflow - outflow

  return (
    <div className="flex flex-col gap-4 max-w-[1320px] mx-auto pb-10">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.4px] text-brand-accent font-bold m-0">
            <Sparkles size={10} /> {greeting()} · {todayString()}
          </p>
          <h1 className="text-[24px] font-bold tracking-[-0.5px] text-[var(--c-text)] m-0 mt-1.5">
            Welcome back,{' '}
            {firstName ? (
              <span className="text-brand-accent">{firstName}</span>
            ) : loading ? (
              <span aria-hidden className="inline-block align-[-2px] w-[120px] h-[20px] rounded-md bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] animate-pulse" />
            ) : (
              <span className="text-brand-accent">there</span>
            )}
          </h1>
        </div>
      </header>

      {!loading && user && user.is_pin_created !== 1 && !pinBannerDismissed && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--c-warn-bg)] border border-[var(--c-warn)] border-opacity-40">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--c-warn-bg)] border border-[var(--c-warn)] border-opacity-30 text-[var(--c-warn)] shrink-0">
            <Lock size={14} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-bold text-[var(--c-warn)] m-0">Transaction PIN not set</p>
            <p className="text-[11px] text-[var(--c-warn)] opacity-80 m-0 mt-0.5">
              You won't be able to send money or make payments until your PIN is active.
            </p>
          </div>
          <Link to="/user/transaction-pin" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--c-warn)] text-[var(--c-bg)] text-[11.5px] font-bold shrink-0 hover:opacity-90 transition">
            Set PIN <ChevronRight size={11} />
          </Link>
          <button type="button" onClick={() => setPinBannerDismissed(true)} aria-label="Dismiss"
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[var(--c-warn)] opacity-60 hover:opacity-100 hover:bg-[var(--c-warn-bg)] transition shrink-0">
            <X size={13} />
          </button>
        </div>
      )}

      {/* Hero card */}
      <article className="relative overflow-hidden rounded-2xl border border-[rgba(201,162,39,0.32)] text-text shadow-[0_18px_44px_-18px_rgba(2,7,23,0.55)]" style={{ background: HERO_BG }}>
        <span aria-hidden className="pointer-events-none absolute -top-24 -right-24 w-[340px] h-[340px] rounded-full bg-brand-accent/[0.16] blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 w-[240px] h-[240px] rounded-full bg-brand-gold-soft/[0.12] blur-3xl" />

        <div className="relative grid grid-cols-1 min-[960px]:grid-cols-[1.1fr_1fr] gap-5 p-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex p-0.5 rounded-lg bg-white/[0.06] border border-white/[0.12]">
                {accounts.map(a => {
                  const active = activeAccount === a.id
                  return (
                    <button key={a.id} type="button" onClick={() => setActiveAccount(a.id)}
                      className={['inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-[0.3px] transition',
                        active ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_2px_8px_rgba(201,162,39,0.36)]' : 'text-white/65 hover:text-text',
                      ].join(' ')}>
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
              <p className="text-[10px] uppercase tracking-[1.1px] text-white/55 m-0 font-bold">{account.name}</p>
              <div className="flex items-baseline gap-2 mt-1.5">
                {loading && !wallet ? (
                  <span aria-hidden className="inline-block w-[180px] h-[34px] rounded-md bg-white/[0.08] border border-white/[0.10] animate-pulse" />
                ) : (
                  <span className="text-[34px] font-bold tracking-[-0.8px] text-text leading-none tabular-nums break-all">
                    {hidden ? `${account.symbol}••••••••` : formatAccountBalance(account)}
                  </span>
                )}
                <button type="button" onClick={() => setHidden(h => !h)} aria-label={hidden ? 'Show balance' : 'Hide balance'}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-white/[0.08] border border-white/[0.14] text-text hover:bg-white/[0.14] transition shrink-0 self-end">
                  {hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
              <p className="text-[10.5px] text-white/55 m-0 mt-1.5 inline-flex items-center gap-1">
                <TrendingUp size={10} className={net >= 0 ? 'text-brand-accent' : 'text-[var(--c-danger,#f87171)]'} />
                <span className={`font-bold ${net >= 0 ? 'text-brand-accent' : 'text-[var(--c-danger,#f87171)]'}`}>
                  {net >= 0 ? 'Net surplus' : 'Net deficit'} {formatShort(Math.abs(net))}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <Link to="/user/deposit" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[11px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.3)] hover:-translate-y-px transition">
                <ArrowDownLeft size={12} strokeWidth={2.6} /> Deposit
              </Link>
              <Link to="/user/withdraw" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.08] border border-white/[0.16] text-text text-[11px] font-bold hover:bg-white/[0.14] transition">
                <ArrowUpRight size={12} strokeWidth={2.6} /> Withdraw
              </Link>
              <Link to="/user/transactions" className="inline-flex items-center gap-0.5 ml-auto text-[10.5px] font-semibold text-white/70 hover:text-brand-accent transition">
                Statement <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* Sparkline + metrics */}
          <div className="flex flex-col gap-3 min-[960px]:border-l min-[960px]:border-white/[0.08] min-[960px]:pl-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[1.1px] text-white/55 m-0 font-bold">30-day spend</p>
              {txLoading ? (
                <span aria-hidden className="h-3 w-16 rounded bg-white/[0.08] animate-pulse" />
              ) : (
                <p className="text-[10.5px] text-brand-accent font-bold tabular-nums inline-flex items-center gap-0.5">
                  <TrendingUp size={10} /> {txCount} transactions
                </p>
              )}
            </div>
            <div className="h-[80px]">
              {txLoading
                ? <div aria-hidden className="w-full h-full rounded-lg bg-white/[0.06] animate-pulse" />
                : <Sparkline data={sparklineData.length ? sparklineData : [0, 0]} gradId="hero-spark" />}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {txLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} aria-hidden className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.10]">
                      <span className="block h-2 w-2/3 rounded bg-white/[0.10] animate-pulse mb-1.5" />
                      <span className="block h-3 w-1/2 rounded bg-white/[0.10] animate-pulse" />
                    </div>
                  ))
                : heroMetrics.map(m => (
                    <div key={m.id} className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.10]">
                      <p className="text-[9px] uppercase tracking-[0.9px] text-white/55 font-bold m-0">{m.label}</p>
                      <p className="text-[12px] font-bold text-brand-accent m-0 mt-0.5 tabular-nums tracking-[-0.1px]">{m.value}</p>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-between gap-2 px-5 py-2.5 border-t border-white/[0.06] bg-white/[0.02]">
          <span className="inline-flex items-center gap-1.5 text-[10px] text-white/50">
            <ShieldCheck size={11} className="text-brand-accent" /> Vault secured · 256-bit encryption
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-white/50">
            <Sparkles size={10} className="text-brand-accent" /> Updated just now
          </span>
        </div>
      </article>

      {/* KPI strip */}
      <section className="grid grid-cols-2 min-[640px]:grid-cols-4 gap-3">
        <KpiCard icon={ArrowDownLeft} label="Inflow"       value={txLoading ? '—' : formatShort(inflow)}  tone="success" hint="Completed credits" />
        <KpiCard icon={ArrowUpRight}  label="Outflow"      value={txLoading ? '—' : formatShort(outflow)} tone="warn"    hint="Completed debits" />
        <KpiCard icon={TrendingUp}    label="Net flow"     value={txLoading ? '—' : formatShort(Math.abs(net))}
          delta={net >= 0 ? 'Surplus' : 'Deficit'} deltaTone={net >= 0 ? 'success' : 'danger'} tone="accent" hint="Inflow minus outflow" />
        <KpiCard icon={Coins}         label="Transactions" value={txLoading ? '—' : String(txCount)}
          tone="muted" hint="All time" />
      </section>

      {/* Quick actions */}
      <section>
        <div className="flex items-end justify-between gap-3 mb-2">
          <div>
            <h2 className="text-[14px] font-bold m-0 text-[var(--c-text)] tracking-[-0.2px]">Quick actions</h2>
            <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">Move fast — pick a service to get started.</p>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
            <Sparkles size={9} /> {QUICK_ACTIONS.length} services
          </span>
        </div>
        <div className="grid grid-cols-3 min-[640px]:grid-cols-6 gap-2">
          {QUICK_ACTIONS.map(({ to, label, icon: Icon, featured }) => (
            <Link key={to} to={to}
              className={['group relative overflow-hidden flex flex-col items-center gap-2 p-3 rounded-xl text-center transition duration-300 hover:-translate-y-0.5',
                featured
                  ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] hover:border-[var(--c-accent-border-strong)] hover:shadow-[0_12px_28px_-10px_rgba(201,162,39,0.45)]'
                  : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] hover:shadow-[0_12px_28px_-12px_rgba(2,7,23,0.4)]',
              ].join(' ')}>
              <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-[80px] h-[80px] rounded-full bg-brand-accent/[0.08] blur-2xl group-hover:bg-brand-accent/[0.22] transition" />
              <span className={['relative inline-flex items-center justify-center w-10 h-10 rounded-xl border transition',
                featured
                  ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.32)]'
                  : 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border-[var(--c-accent-border)] group-hover:shadow-[0_0_18px_-2px_rgba(201,162,39,0.4)]',
              ].join(' ')}>
                <Icon size={16} strokeWidth={2} />
              </span>
              <span className="relative text-[11px] font-bold text-[var(--c-text)] tracking-[-0.1px]">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity + Spending breakdown */}
      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.55fr_1fr] gap-3">

        {/* Recent activity */}
        <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
          <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--c-border)]">
            <div>
              <h2 className="text-[13px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">Recent activity</h2>
              <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">Latest 6 transactions across all wallets.</p>
            </div>
            <Link to="/user/transactions" className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-accent hover:underline">
              See all <ChevronRight size={11} />
            </Link>
          </header>

          {txLoading ? (
            <ul className="m-0 list-none p-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className={`flex items-center gap-3 px-4 py-2.5 ${i > 0 ? 'border-t border-[var(--c-border)]' : ''}`}>
                  <span aria-hidden className="w-9 h-9 rounded-lg bg-[var(--c-surface-soft)] animate-pulse shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span aria-hidden className="h-3 w-2/3 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                    <span aria-hidden className="h-2.5 w-1/3 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                  </div>
                  <span aria-hidden className="h-3 w-20 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                </li>
              ))}
            </ul>
          ) : recentTx.length === 0 ? (
            <p className="px-4 py-6 text-[12px] text-[var(--c-text-faint)] text-center">No transactions yet.</p>
          ) : (
            <ul className="m-0 list-none p-0">
              {recentTx.map((tx, i) => (
                <li key={tx.id}
                  className={['grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 hover:bg-[var(--c-surface-soft)] transition', i > 0 ? 'border-t border-[var(--c-border)]' : ''].join(' ')}>

                  <span className={['inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0',
                    tx.kind === 'in' ? 'text-[var(--c-success)] bg-[var(--c-success-bg)]' : 'text-[var(--c-warn)] bg-[var(--c-warn-bg)]',
                  ].join(' ')}>
                    {tx.kind === 'in' ? <ArrowDownLeft size={13} strokeWidth={2.4} /> : <ArrowUpRight size={13} strokeWidth={2.4} />}
                  </span>

                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="text-[12.5px] font-semibold text-[var(--c-text)] truncate">
                      {tx.description || tx.title}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[10px] text-[var(--c-text-muted)] tabular-nums">{tx.day} · {tx.meta}</span>
                      {tx.reference && (
                        <span className="text-[9.5px] font-mono text-[var(--c-text-faint)]">#{tx.reference}</span>
                      )}
                      {tx.status !== 'completed' && (
                        <span className={[
                          'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8.5px] uppercase tracking-[0.8px] font-bold',
                          tx.status === 'pending'
                            ? 'bg-[var(--c-warn-bg)] text-[var(--c-warn)]'
                            : 'bg-[var(--c-danger-bg,#3a1a1a)] text-[var(--c-danger,#f87171)]',
                        ].join(' ')}>
                          {tx.status === 'pending' ? <Clock size={8} strokeWidth={3} /> : <X size={8} strokeWidth={3} />}
                          {tx.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className={['text-[12.5px] font-bold tabular-nums whitespace-nowrap text-right',
                    tx.kind === 'in' ? 'text-[var(--c-success)]' : 'text-[var(--c-text)]',
                  ].join(' ')}>
                    {tx.kind === 'in' ? '+' : '-'}{formatNGN(tx.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>

        {/* Spending breakdown */}
        <article className="p-4 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">Spending breakdown</h3>
            <Link to="/user/transactions" className="text-[10px] font-semibold text-brand-accent hover:underline">See all</Link>
          </div>

          {txLoading ? (
            <div className="flex flex-col gap-2.5">
              <div aria-hidden className="h-2 rounded-full bg-[var(--c-surface-soft)] animate-pulse" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
                  <span aria-hidden className="w-2 h-2 rounded-[2px] bg-[var(--c-surface-soft)] animate-pulse" />
                  <span aria-hidden className="h-2.5 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                  <span aria-hidden className="h-2.5 w-16 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                </div>
              ))}
            </div>
          ) : spendingCategories.length === 0 ? (
            <p className="text-[11px] text-[var(--c-text-faint)] text-center py-4">No spending data yet.</p>
          ) : (
            <>
              <div className="relative h-2 rounded-full bg-[var(--c-surface-soft)] overflow-hidden flex mb-3">
                {spendingCategories.map(c => (
                  <div key={c.id} style={{ width: `${c.pct}%`, background: c.color }} />
                ))}
              </div>
              <ul className="m-0 list-none p-0 flex flex-col gap-1.5">
                {spendingCategories.map(c => (
                  <li key={c.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-[2px] shrink-0" style={{ background: c.color }} />
                    <span className="text-[11px] font-semibold text-[var(--c-text)] truncate">{c.label}</span>
                    <span className="text-[11px] font-bold tabular-nums text-[var(--c-text)] whitespace-nowrap">
                      ₦{Number(c.amount).toLocaleString('en-NG')} <span className="text-[var(--c-text-muted)] font-medium">· {c.pct}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>
      </section>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, delta, tone, deltaTone, hint, to }) {
  const toneMap = {
    success: 'bg-[var(--c-success-bg)] text-[var(--c-success)]',
    warn:    'bg-[var(--c-warn-bg)] text-[var(--c-warn)]',
    accent:  'bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]',
    muted:   'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)]',
  }
  const deltaMap = {
    success: 'text-[var(--c-success)]',
    danger:  'text-[var(--c-danger,#f87171)]',
    accent:  'text-brand-accent',
  }
  const Wrapper = to ? Link : 'article'
  return (
    <Wrapper {...(to ? { to } : {})} className="group relative overflow-hidden p-3 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] transition block">
      <span aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-16 h-16 rounded-full bg-brand-accent/[0.06] blur-2xl group-hover:bg-brand-accent/[0.14] transition" />
      <div className="relative flex items-center justify-between gap-2 mb-2">
        <span className={['inline-flex items-center justify-center w-8 h-8 rounded-lg', toneMap[tone] || toneMap.muted].join(' ')}>
          <Icon size={13} strokeWidth={2.4} />
        </span>
        {delta && (
          <span className={['inline-flex items-center gap-0.5 text-[10px] font-bold tabular-nums whitespace-nowrap', deltaMap[deltaTone] || 'text-[var(--c-text-muted)]'].join(' ')}>
            {delta}
          </span>
        )}
      </div>
      <p className="relative text-[10px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)] m-0">{label}</p>
      <p className="relative text-[16px] font-black text-[var(--c-text)] m-0 mt-0.5 tabular-nums tracking-[-0.3px]">{value}</p>
      {hint && <p className="relative text-[9.5px] text-[var(--c-text-muted)] m-0 mt-1.5 truncate">{hint}</p>}
    </Wrapper>
  )
}
