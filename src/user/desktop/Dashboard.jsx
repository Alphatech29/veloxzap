import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Smartphone,
  Receipt, ArrowLeftRight, Wifi,
  Sparkles, ShieldCheck, ChevronRight, Gift, Bitcoin,
  Lock, X,
} from 'lucide-react'
import useUser from '../../hooks/useUser'
import useTransactions from '../../hooks/useTransactions'
import TransactionModal from '../../components/internalUI/TransactionModal'
import { fmtDate } from '../../utils/format'
import { TRANSACTION_STATUS } from '../../constants/status'

const QUICK_ACTIONS = [
  { to: '/user/airtime',          label: 'Airtime',       icon: Smartphone,    featured: true },
  { to: '/user/data',             label: 'Data',          icon: Wifi },
  { to: '/user/bills',            label: 'Bills',         icon: Receipt },
  { to: '/user/trade-cards',      label: 'Gift Card',     icon: Gift },
  { to: '/user/convert',          label: 'Convert',       icon: ArrowLeftRight },
  { to: '/user/wallet',           label: 'Crypto',        icon: Bitcoin },
]

const STATUS_TONE = Object.fromEntries(
  Object.entries(TRANSACTION_STATUS).map(([status, meta]) => [status, meta.cls])
)

const HERO_BG = `radial-gradient(700px 300px at 110% -10%, rgba(201,162,39,0.28), transparent 60%),
  radial-gradient(400px 300px at -5% 110%, rgba(232,197,71,0.14), transparent 60%),
  linear-gradient(145deg, rgba(16,36,80,0.99), rgba(8,24,56,1))`

function formatNGN(n) {
  return '₦' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
    { id: 'ngn', symbol: '₦', label: 'NGN', name: 'Naira wallet',  balance: Number(wallet?.ngn_balance ?? 0) },
    { id: 'usd', symbol: '$', label: 'USD', name: 'Dollar wallet', balance: Number(wallet?.usd_balance ?? 0) },
  ]
}

export default function Dashboard() {
  const { user, wallet, loading } = useUser()
  const { transactions: allTx, loading: txLoading } = useTransactions({ recentLimit: Infinity })

  const [hidden, setHidden]               = useState(() => localStorage.getItem('vzap_hide_balance') === '1')
  const [pinDismissed, setPinDismissed]   = useState(false)
  const [activeAccount, setActiveAccount] = useState('ngn')
  const [activeTx, setActiveTx]           = useState(null)

  const accounts = buildAccounts(wallet)
  const account  = accounts.find(a => a.id === activeAccount) || accounts[0]

  const rawFirst  = (user?.full_name || '').trim().split(/\s+/)[0] || ''
  const firstName = rawFirst ? rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1).toLowerCase() : ''

  const recentTx = useMemo(() => allTx.slice(0, 7), [allTx])

  function toggleHide() {
    setHidden(h => {
      localStorage.setItem('vzap_hide_balance', h ? '0' : '1')
      return !h
    })
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1320px] mx-auto pb-10">

      {/* ── Page header ── */}
      <header className="flex items-center justify-between gap-3 flex-wrap pt-1">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.4px] text-brand-accent font-bold m-0">
            <Sparkles size={10} /> {greeting()}
          </p>
          <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            {firstName ? (
              <>Welcome back, <span className="text-brand-accent">{firstName}</span></>
            ) : loading ? (
              <span aria-hidden className="inline-block align-[-3px] w-[180px] h-[22px] rounded-md bg-[var(--c-surface-soft)] animate-pulse" />
            ) : (
              <>Welcome back</>
            )}
          </h1>
        </div>
        <span className="text-[11px] text-[var(--c-text-muted)]">{todayString()}</span>
      </header>

      {/* ── PIN banner ── */}
      {!loading && user && user.is_pin_created !== 1 && !pinDismissed && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--c-warn-bg)] border border-[var(--c-warn)] border-opacity-40">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--c-warn-bg)] border border-[var(--c-warn)] border-opacity-30 text-[var(--c-warn)] shrink-0">
            <Lock size={14} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-bold text-[var(--c-warn)] m-0">Transaction PIN not set</p>
            <p className="text-[11px] text-[var(--c-warn)] opacity-80 m-0 mt-0.5">
              You won't be able to send or make payments until your PIN is active.
            </p>
          </div>
          <Link to="/user/transaction-pin"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--c-warn)] text-[var(--c-bg)] text-[11.5px] font-bold shrink-0 hover:opacity-90 transition">
            Set PIN <ChevronRight size={11} />
          </Link>
          <button type="button" onClick={() => setPinDismissed(true)} aria-label="Dismiss"
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[var(--c-warn)] opacity-60 hover:opacity-100 transition shrink-0">
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Hero card ── */}
      <article
        className="relative overflow-hidden rounded-2xl border border-[rgba(201,162,39,0.25)] shadow-[0_20px_56px_-20px_rgba(2,7,23,0.65)]"
        style={{ background: HERO_BG }}
      >
        {/* decorative orbs */}
        <span aria-hidden className="pointer-events-none absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full bg-brand-accent/[0.14] blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 left-1/4 w-[200px] h-[200px] rounded-full bg-brand-accent/[0.07] blur-3xl" />

        <div className="relative grid grid-cols-1 min-[860px]:grid-cols-[1fr_300px] min-[1060px]:grid-cols-[1fr_340px]">

          {/* Left — balance */}
          <div className="flex flex-col gap-6 p-6 min-[860px]:p-8">

            {/* Wallet tabs + Live */}
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex p-[3px] rounded-xl bg-white/[0.06] border border-white/[0.10]">
                {accounts.map(a => {
                  const active = activeAccount === a.id
                  return (
                    <button key={a.id} type="button" onClick={() => setActiveAccount(a.id)}
                      className={[
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-[0.2px] transition',
                        active
                          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_2px_10px_rgba(201,162,39,0.4)]'
                          : 'text-white/60 hover:text-white',
                      ].join(' ')}>
                      {a.symbol} {a.label}
                    </button>
                  )
                })}
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/[0.12] text-[9.5px] uppercase tracking-[1px] text-white/75 font-bold">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand-accent animate-ping opacity-60" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-brand-accent" />
                </span>
                Live
              </span>
            </div>

            {/* Balance */}
            <div>
              <p className="text-[10.5px] uppercase tracking-[1.2px] font-bold text-white/45 m-0">
                {account.name}
              </p>
              <div className="flex items-end gap-3 mt-2">
                {loading && !wallet ? (
                  <span aria-hidden className="inline-block w-[220px] h-[44px] rounded-lg bg-white/[0.07] animate-pulse" />
                ) : (
                  <span className="text-[42px] font-black tracking-[-1.2px] text-white leading-none tabular-nums">
                    {hidden ? `${account.symbol}  ••••••` : formatAccountBalance(account)}
                  </span>
                )}
                <button type="button" onClick={toggleHide}
                  aria-label={hidden ? 'Show balance' : 'Hide balance'}
                  className="inline-flex items-center justify-center w-8 h-8 mb-0.5 rounded-lg bg-white/[0.08] border border-white/[0.14] text-white/80 hover:bg-white/[0.14] hover:text-white transition shrink-0">
                  {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link to="/user/deposit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[12px] font-bold border border-[rgba(232,197,71,0.5)] shadow-[0_4px_16px_rgba(201,162,39,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(201,162,39,0.45)] transition">
                <ArrowDownLeft size={13} strokeWidth={2.5} /> Deposit
              </Link>
              <Link to="/user/withdraw"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.08] border border-white/[0.18] text-white text-[12px] font-bold hover:bg-white/[0.14] hover:-translate-y-0.5 transition">
                <ArrowUpRight size={13} strokeWidth={2.5} /> Withdraw
              </Link>
              <Link to="/user/transactions"
                className="inline-flex items-center gap-1 ml-1 text-[11px] font-semibold text-white/55 hover:text-brand-accent transition">
                Statement <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* Right — quick actions */}
          <div className="flex flex-col gap-4 p-6 min-[860px]:border-l border-t min-[860px]:border-t-0 border-white/[0.07] bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] uppercase tracking-[1.2px] font-bold text-white/45 m-0">Quick actions</p>
              <span className="text-[9.5px] text-white/35 font-medium">{QUICK_ACTIONS.length} services</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_ACTIONS.map(({ to, label, icon: Icon, featured }) => (
                <Link key={to} to={to}
                  className={[
                    'group flex flex-col items-center gap-2 p-3 rounded-xl border transition hover:-translate-y-0.5',
                    featured
                      ? 'bg-gradient-to-br from-brand-accent/[0.22] to-brand-accent/[0.10] border-brand-accent/[0.35] hover:border-brand-accent/[0.6] hover:shadow-[0_6px_18px_-6px_rgba(201,162,39,0.5)]'
                      : 'bg-white/[0.04] border-white/[0.09] hover:bg-white/[0.09] hover:border-white/[0.18]',
                  ].join(' ')}>
                  <span className={[
                    'inline-flex items-center justify-center w-9 h-9 rounded-lg border transition',
                    featured
                      ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.4)] shadow-[0_3px_10px_rgba(201,162,39,0.35)]'
                      : 'bg-white/[0.07] border-white/[0.12] text-white/70 group-hover:text-white group-hover:bg-white/[0.12]',
                  ].join(' ')}>
                    <Icon size={15} strokeWidth={2} />
                  </span>
                  <span className={[
                    'text-[10px] font-semibold leading-tight text-center',
                    featured ? 'text-brand-accent' : 'text-white/65 group-hover:text-white',
                  ].join(' ')}>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div className="relative flex items-center justify-between gap-2 px-6 py-2.5 border-t border-white/[0.06] bg-white/[0.015]">
          <span className="inline-flex items-center gap-1.5 text-[10px] text-white/40">
            <ShieldCheck size={11} className="text-brand-accent" /> Vault secured · 256-bit encryption
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-white/40">
            <Sparkles size={10} className="text-brand-accent" /> Updated just now
          </span>
        </div>
      </article>

      {/* ── Bottom: activity ── */}
      <section>

        {/* Recent activity */}
        <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
          <header className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-[var(--c-border)]">
            <div>
              <h2 className="text-[13px] font-bold m-0 text-[var(--c-text)] tracking-[-0.15px]">Recent activity</h2>
              <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">
                {txLoading
                  ? 'Recent transactions across all wallets'
                  : `Last ${recentTx.length} transaction${recentTx.length === 1 ? '' : 's'} across all wallets`}
              </p>
            </div>
            <Link to="/user/transactions"
              className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-brand-accent hover:underline shrink-0">
              View all <ChevronRight size={11} />
            </Link>
          </header>

          {txLoading ? (
            <ul className="m-0 list-none p-0">
              {Array.from({ length: 7 }).map((_, i) => (
                <li key={i} className={`flex items-center gap-3 px-5 py-3 ${i > 0 ? 'border-t border-[var(--c-border)]' : ''}`}>
                  <span aria-hidden className="w-9 h-9 rounded-lg bg-[var(--c-surface-soft)] animate-pulse shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span aria-hidden className="h-3 w-3/5 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                    <span aria-hidden className="h-2.5 w-2/5 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                  </div>
                  <span aria-hidden className="h-3 w-20 rounded bg-[var(--c-surface-soft)] animate-pulse" />
                </li>
              ))}
            </ul>
          ) : recentTx.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--c-surface-soft)] text-[var(--c-text-faint)]">
                <ArrowLeftRight size={16} />
              </span>
              <p className="text-[12px] text-[var(--c-text-faint)] m-0">No transactions yet</p>
            </div>
          ) : (
            <ul className="m-0 list-none p-0">
              {recentTx.map((tx, i) => (
                <li key={tx.id}
                  onClick={() => setActiveTx(tx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveTx(tx) } }}
                  className={[
                    'grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3 cursor-pointer hover:bg-[var(--c-surface-soft)] focus:bg-[var(--c-surface-soft)] focus:outline-none transition',
                    i > 0 ? 'border-t border-[var(--c-border)]' : '',
                  ].join(' ')}>

                  <span className={[
                    'inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0',
                    tx.kind === 'in'
                      ? 'text-[var(--c-success)] bg-[var(--c-success-bg)]'
                      : tx.kind === 'internal'
                        ? 'text-[var(--c-text-muted)] bg-[var(--c-surface-soft)]'
                        : 'text-[var(--c-warn)] bg-[var(--c-warn-bg)]',
                  ].join(' ')}>
                    {tx.kind === 'in'
                      ? <ArrowDownLeft size={13} strokeWidth={2.4} />
                      : tx.kind === 'internal'
                        ? <ArrowLeftRight size={13} strokeWidth={2.4} />
                        : <ArrowUpRight  size={13} strokeWidth={2.4} />}
                  </span>

                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="text-[12.5px] font-semibold text-[var(--c-text)] truncate">
                      {tx.description || tx.title}
                    </span>
                    <span className="text-[10px] text-[var(--c-text-muted)] tabular-nums mt-0.5">
                      {tx.createdAt ? fmtDate(tx.createdAt) : `${tx.day} · ${tx.meta}`}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={[
                      'text-[13px] font-bold tabular-nums whitespace-nowrap text-right',
                      tx.kind === 'in' ? 'text-[var(--c-success)]' : 'text-[var(--c-text)]',
                    ].join(' ')}>
                      {tx.kind === 'in' ? '+' : tx.kind === 'internal' ? '' : '−'}{formatNGN(tx.total)}
                    </span>
                    <span className={[
                      'inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold',
                      STATUS_TONE[tx.status] || 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)]',
                    ].join(' ')}>
                      {tx.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <TransactionModal tx={activeTx} onClose={() => setActiveTx(null)} />
    </div>
  )
}
