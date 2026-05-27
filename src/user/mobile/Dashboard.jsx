import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Smartphone, Wifi,
  Receipt, Gift, Bitcoin, ShieldCheck, ChevronRight,
  Sparkles, TrendingUp, Lock,
} from 'lucide-react'
import useUser from '../../hooks/useUser'

const QUICK_ACTIONS = [
  { to: '/user/airtime',      label: 'Airtime',      icon: Smartphone },
  { to: '/user/bills',        label: 'Bills',        icon: Receipt },
  { to: '/user/data',         label: 'Data',         icon: Wifi },
  { to: '/user/trade-cards',  label: 'Trade Card',   icon: Gift },
  { to: '/user/crypto-exchange', label: 'Crypto Trade', icon: Bitcoin },
  { to: '/user/finance',      label: 'Finance',      icon: TrendingUp },
  { to: '/user/buy-giftcard', label: 'Buy Gift Card', icon: Gift },
  { to: '/user/convert',       label: 'Convert',       icon: TrendingUp },
]

const RECENT = [
  { id: 't1', kind: 'in',  title: 'Funding · Paystack',   meta: 'Today, 09:42', day: 'Today',     amount: 250000 },
  { id: 't2', kind: 'out', title: 'MTN Airtime · 0803…',  meta: 'Today, 08:11', day: 'Today',     amount: 2000 },
  { id: 't3', kind: 'out', title: 'DSTV Compact',          meta: 'Yesterday',     day: 'Yesterday', amount: 14500 },
  { id: 't4', kind: 'in',  title: 'USDT → NGN swap',       meta: 'Yesterday',     day: 'Yesterday', amount: 87420 },
]

const BALANCE_BG = `radial-gradient(540px 240px at 110% -10%, rgba(201, 162, 39, 0.32), transparent 60%), radial-gradient(360px 180px at -10% 110%, rgba(232, 197, 71, 0.16), transparent 60%), linear-gradient(135deg, rgba(20, 42, 92, 0.95), rgba(10, 31, 68, 1))`

function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatUSD(n) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatShortNGN(n) {
  return '₦' + n.toLocaleString('en-NG')
}

export default function MobileDashboard() {
  const { user, wallet, loading } = useUser()
  const [hidden, setHidden] = useState(
    () => localStorage.getItem('vzap_hide_balance') === '1'
  )
  const [currency, setCurrency] = useState('NGN')
  const ngnBalance = Number(wallet?.ngn_balance ?? 0)
  const usdBalance = Number(wallet?.usd_balance ?? 0)
  const balance = currency === 'NGN' ? ngnBalance : usdBalance
  const inflow = 642300
  const outflow = 298140

  const days = Array.from(new Set(RECENT.map(r => r.day)))

  return (
    <div className="flex flex-col gap-5">
      <article
        className="relative overflow-hidden p-5 rounded-[24px] border border-[rgba(201,162,39,0.32)] text-text shadow-[0_18px_44px_-14px_rgba(2,7,23,0.55)]"
        style={{ background: BALANCE_BG }}
      >
        <span aria-hidden className="absolute -top-12 -right-12 w-[180px] h-[180px] rounded-full bg-brand-accent/15 blur-3xl pointer-events-none" />
        <span aria-hidden className="absolute -bottom-12 -left-10 w-[150px] h-[150px] rounded-full bg-brand-gold-soft/10 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.4px] text-brand-accent font-semibold">
            <ShieldCheck size={11} />
            Vault balance
          </span>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-0.5 p-0.5 rounded-full bg-white/[0.08] border border-white/[0.12]">
              {[
                { code: 'NGN', flag: 'https://flagcdn.com/w20/ng.png', alt: 'Nigeria' },
                { code: 'USD', flag: 'https://flagcdn.com/w20/us.png', alt: 'USA' },
              ].map(({ code, flag, alt }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCurrency(code)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.8px] transition ${currency === code ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-sm' : 'text-white/55'}`}
                >
                  <img src={flag} alt={alt} className="w-3.5 h-3.5 rounded-full object-cover" />
                  {code}
                </button>
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.16] text-[9.5px] uppercase tracking-[1.1px] text-white/80 font-semibold">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-accent animate-ping opacity-70" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-brand-accent" />
              </span>
              Live
            </span>
          </div>
        </div>

        <div className="relative flex items-end justify-between gap-3 mt-3">
          <div className="min-w-0">
            {loading && !wallet ? (
              <div
                aria-hidden
                className="w-[170px] h-[28px] rounded-md bg-white/[0.08] border border-white/[0.10] animate-pulse"
              />
            ) : (
              <div className="text-[25px] font-bold tracking-[-0.6px] truncate">
                {hidden
                  ? (currency === 'NGN' ? '₦••••••••' : '$••••••')
                  : (currency === 'NGN' ? formatNGN(balance) : formatUSD(balance))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setHidden(h => {
              const next = !h
              localStorage.setItem('vzap_hide_balance', next ? '1' : '0')
              return next
            })}
            aria-label={hidden ? 'Show balance' : 'Hide balance'}
            className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-white/[0.08] border border-white/[0.16] active:scale-95 transition"
          >
            {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <div className="relative grid grid-cols-2 gap-2 mt-3.5">
          <Link
            to="/user/deposit"
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.3)] active:scale-[0.97] transition"
          >
            <ArrowDownLeft size={13} strokeWidth={2.6} />
            <span className="text-[12px] font-bold">Deposit</span>
          </Link>
          <Link
            to="/user/withdraw"
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/[0.08] border border-white/[0.16] active:scale-[0.97] transition"
          >
            <ArrowUpRight size={13} strokeWidth={2.6} />
            <span className="text-[12px] font-bold">Withdraw</span>
          </Link>
        </div>

        <div className="relative flex items-center justify-between mt-4 pt-3 border-t border-white/[0.08]">
          <span className="inline-flex items-center gap-1 text-[10.5px] text-white/55">
            <ShieldCheck size={11} />
            256-bit encrypted
          </span>
          <span className="inline-flex items-center gap-1 text-[10.5px] text-white/55">
            <Sparkles size={10} className="text-brand-accent" />
            Updated just now
          </span>
        </div>
      </article>

      {!loading && user && user.is_pin_created !== 1 && (
        <Link
          to="/user/transaction-pin"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--c-warn-bg)] border border-[var(--c-warn)] border-opacity-35 active:scale-[0.98] transition"
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--c-warn-bg)] border border-[var(--c-warn)] border-opacity-30 text-[var(--c-warn)] shrink-0">
            <Lock size={15} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-bold text-[var(--c-warn)] m-0">
              Set your transaction PIN
            </p>
            <p className="text-[11px] text-[var(--c-warn)] opacity-75 m-0 mt-0.5 leading-snug">
              Required to send money and make payments.
            </p>
          </div>
          <ChevronRight size={14} className="text-[var(--c-warn)] opacity-70 shrink-0" />
        </Link>
      )}

      <div className="grid grid-cols-2 gap-2">
        <article className="relative overflow-hidden p-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
          <span aria-hidden className="pointer-events-none absolute -top-5 -right-5 w-14 h-14 rounded-full bg-[var(--c-success-bg)] blur-xl" />

          <div className="relative flex items-center justify-between gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-[8px] bg-[var(--c-success-bg)] text-[var(--c-success)]">
              <ArrowDownLeft size={11} strokeWidth={2.6} />
            </span>
            <span className="inline-flex items-center gap-0.5 text-[9.5px] text-[var(--c-success)] font-bold whitespace-nowrap">
              <TrendingUp size={8} strokeWidth={2.8} /> +18.2%
            </span>
          </div>

          <div className="relative mt-2">
            <p className="text-[9px] uppercase tracking-[1px] font-semibold text-[var(--c-text-muted)] m-0">
              Inflow
            </p>
            <p className="text-[12.5px] font-bold tracking-[-0.2px] text-[var(--c-text)] tabular-nums truncate m-0 mt-0.5">
              {hidden ? '••••••' : formatShortNGN(inflow)}
            </p>
          </div>
        </article>

        <article className="relative overflow-hidden p-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
          <span aria-hidden className="pointer-events-none absolute -top-5 -right-5 w-14 h-14 rounded-full bg-[var(--c-warn-bg)] blur-xl" />

          <div className="relative flex items-center justify-between gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-[8px] bg-[var(--c-warn-bg)] text-[var(--c-warn)]">
              <ArrowUpRight size={11} strokeWidth={2.6} />
            </span>
            <span className="inline-flex items-center gap-0.5 text-[9.5px] text-[var(--c-danger)] font-bold whitespace-nowrap">
              <TrendingUp size={8} strokeWidth={2.8} className="rotate-180" /> -4.7%
            </span>
          </div>

          <div className="relative mt-2">
            <p className="text-[9px] uppercase tracking-[1px] font-semibold text-[var(--c-text-muted)] m-0">
              Outflow
            </p>
            <p className="text-[12.5px] font-bold tracking-[-0.2px] text-[var(--c-text)] tabular-nums truncate m-0 mt-0.5">
              {hidden ? '••••••' : formatShortNGN(outflow)}
            </p>
          </div>
        </article>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-[12px] font-bold m-0 text-[var(--c-text)] tracking-[-0.2px]">
            Quick actions
          </h2>

        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group relative overflow-hidden flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-[9.5px] font-semibold tracking-[-0.1px] text-center bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text)] hover:border-[var(--c-accent-border)] active:scale-[0.97] transition duration-200"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-4 -right-4 w-10 h-10 rounded-full bg-brand-accent/[0.08] blur-xl group-active:bg-brand-accent/[0.2] transition duration-300"
              />
              <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-[10px] border bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border-[var(--c-accent-border)] transition duration-200">
                <Icon size={13} strokeWidth={2} />
              </span>
              <span className="relative leading-tight truncate max-w-full">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[12px] font-semibold m-0 text-[var(--c-text)] tracking-[-0.1px]">
            Recent activity
          </h2>
          <Link
            to="/user/transactions"
            className="inline-flex items-center gap-0.5 text-[10.5px] font-medium text-brand-accent active:scale-95 transition"
          >
            See all <ChevronRight size={10} />
          </Link>
        </div>

        <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
          {days.map((day, di) => {
            const items = RECENT.filter(r => r.day === day)
            return (
              <div key={day} className={di > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                <p className="text-[9px] uppercase tracking-[1.2px] font-semibold text-[var(--c-text-muted)] m-0 px-3 pt-2 pb-1">
                  {day}
                </p>
                <ul className="m-0 list-none">
                  {items.map(tx => (
                    <li
                      key={tx.id}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5 px-3 py-2 active:bg-[var(--c-surface-soft)] transition"
                    >
                      <span
                        className={[
                          'inline-flex items-center justify-center w-7 h-7 rounded-[9px]',
                          tx.kind === 'in'
                            ? 'text-[var(--c-success)] bg-[var(--c-success-bg)]'
                            : 'text-[var(--c-warn)] bg-[var(--c-warn-bg)]',
                        ].join(' ')}
                      >
                        {tx.kind === 'in'
                          ? <ArrowDownLeft size={11} strokeWidth={2.6} />
                          : <ArrowUpRight size={11} strokeWidth={2.6} />}
                      </span>
                      <div className="flex flex-col min-w-0 leading-tight">
                        <span className="text-[11.5px] font-semibold text-[var(--c-text)] truncate">
                          {tx.title}
                        </span>
                        <span className="text-[9.5px] text-[var(--c-text-muted)] mt-0.5 truncate">
                          {tx.meta}
                        </span>
                      </div>
                      <span
                        className={[
                          'text-[11.5px] font-bold tabular-nums whitespace-nowrap',
                          tx.kind === 'in' ? 'text-[var(--c-success)]' : 'text-[var(--c-text)]',
                        ].join(' ')}
                      >
                        {tx.kind === 'in' ? '+' : '-'}
                        {formatNGN(tx.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
