import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Smartphone, Wifi, Receipt, ArrowDownLeft, ArrowUpRight, ArrowLeftRight,
  CreditCard, Activity, Gift, Tag, Bitcoin, User as UserIcon, LifeBuoy,
  LogOut, X, ChevronRight, ShieldCheck, Crown, Settings, PiggyBank, Target, Lock, Wallet,
} from 'lucide-react'
import useUser from '../../hooks/useUser'
import { useTheme } from '../../hooks/useTheme'
import useSettings from '../../hooks/useSettings'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const NAV_GROUPS = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    id: 'pay',
    label: 'Pay & top up',
    items: [
      { to: '/user/airtime', label: 'Airtime', icon: Smartphone },
      { to: '/user/data',    label: 'Data',    icon: Wifi },
      { to: '/user/bills',   label: 'Bills',   icon: Receipt },
    ],
  },
  {
    id: 'money',
    label: 'Money',
    items: [
      { to: '/user/deposit',     label: 'Deposit',      icon: ArrowDownLeft },
      { to: '/user/withdraw',    label: 'Withdraw',     icon: ArrowUpRight },
      { to: '/user/wallet',      label: 'Crypto wallet', icon: Wallet },
      { to: '/user/savings',          label: 'Save & earn',    icon: PiggyBank,
        badge: { label: 'Up to 18%', tone: 'gold' } },
      { to: '/user/convert',          label: 'Convert',        icon: ArrowLeftRight },
      { to: '/user/cards',            label: 'Virtual cards',  icon: CreditCard },
      { to: '/user/trade-cards',      label: 'Trade cards',    icon: Tag },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    items: [
      { to: '/user/transactions', label: 'Transactions', icon: Activity },
      { to: '/user/rewards',      label: 'Rewards',      icon: Gift,
        badge: { label: 'Earn cash', tone: 'gold' } },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    items: [
      { to: '/user/profile',   label: 'Profile',   icon: UserIcon },
      { to: '/user/settings',  label: 'Settings',  icon: Settings },
      { to: '/user/contact',   label: 'Support',   icon: LifeBuoy },
    ],
  },
]

function getInitials(user) {
  const source = user?.full_name || user?.email || '?'
  return source.split(/\s+|@/)[0].slice(0, 2).toUpperCase()
}

function resolveAvatarUrl(value) {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  return `${API_BASE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

export default function UserSidebar({ open, onClose, onLogout }) {
  const { user } = useUser()
  const { theme } = useTheme()
  const { settings } = useSettings()
  const referralReward = settings?.referral_rewards
    ? '₦' + Number(settings.referral_rewards).toLocaleString('en-NG')
    : null
  const logo = theme === 'dark' ? '/logo-2.png' : '/logo-1.png'
  const [avatarError, setAvatarError] = useState(false)
  const initials = getInitials(user)
  const avatarUrl = resolveAvatarUrl(user?.avatar)
  const showAvatar = avatarUrl && !avatarError
  const rawFirst = (user?.full_name || '').trim().split(/\s+/)[0] || ''

  useEffect(() => {
    setAvatarError(false)
  }, [avatarUrl])
  const firstName = rawFirst
    ? rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1).toLowerCase()
    : 'there'

  return (
    <aside
      className={[
        'fixed top-0 left-0 z-40 flex flex-col h-screen px-3.5 py-5 backdrop-blur-md',
        'bg-[var(--c-side-bg)] border-r border-[var(--c-side-border)] text-[var(--c-text)]',
        'w-[280px] min-[960px]:w-[260px]',
        'transition-transform duration-200',
        open ? 'translate-x-0' : '-translate-x-full',
        'min-[960px]:translate-x-0',
      ].join(' ')}
    >
      <div className="flex items-center justify-between px-2 pb-4">
        <Link to="/user/dashboard" className="inline-flex items-center">
          <img src={logo} alt="VeloxZap" className="h-10 w-auto object-contain" />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="inline-flex min-[960px]:hidden items-center justify-center w-8 h-8 rounded-lg border border-[var(--c-border-strong)] bg-[var(--c-surface-soft)] text-[var(--c-text)] cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      <Link
        to="/user/profile"
        className="group relative overflow-hidden flex items-center gap-3 p-2.5 rounded-2xl bg-gradient-to-br from-[var(--c-surface)] to-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] transition mb-4"
      >
        <span aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-16 h-16 rounded-full bg-brand-accent/[0.08] blur-2xl group-hover:bg-brand-accent/[0.18] transition" />
        <span className="relative inline-flex shrink-0">
          <span aria-hidden className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-brand-accent/45 to-brand-gold-soft/45 blur-md" />
          {showAvatar ? (
            <img
              key={avatarUrl}
              src={avatarUrl}
              alt=""
              onError={() => setAvatarError(true)}
              className="relative w-10 h-10 rounded-full object-cover border border-[rgba(232,197,71,0.5)] shadow-[0_4px_14px_rgba(201,162,39,0.32)]"
            />
          ) : (
            <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary font-bold text-[12px] tracking-[0.4px] border border-[rgba(232,197,71,0.5)] shadow-[0_4px_14px_rgba(201,162,39,0.32)]">
              {initials}
            </span>
          )}
        </span>
        <div className="relative flex-1 min-w-0 leading-tight">
          <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0 truncate">
            {user?.full_name || "Hi, there!"}
          </p>
          <p className="inline-flex items-center gap-1 text-[9.5px] uppercase tracking-[1px] text-brand-accent font-bold m-0 mt-0.5">
            <Crown size={9} strokeWidth={2.6} /> Gold tier
          </p>
        </div>
        <ChevronRight size={13} className="relative text-[var(--c-text-faint)] group-hover:text-brand-accent group-hover:translate-x-0.5 transition shrink-0" />
      </Link>

      <nav className="flex flex-col gap-3 flex-1 overflow-y-auto pr-0.5 -mr-0.5">
        {NAV_GROUPS.map(group => (
          <div key={group.id} className="flex flex-col gap-0.5">
            <p className="px-3 mb-1 text-[9.5px] uppercase tracking-[1.2px] font-bold text-[var(--c-text-faint)] m-0">
              {group.label}
            </p>
            {group.items.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={onClose}
                className={({ isActive }) => [
                  'group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12.5px] font-semibold transition',
                  isActive
                    ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[var(--c-text)] shadow-[inset_0_0_0_1px_rgba(201,162,39,0.08)]'
                    : 'border border-transparent text-[var(--c-text-muted)] hover:bg-[var(--c-surface-soft)] hover:text-[var(--c-text)]',
                ].join(' ')}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span aria-hidden className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-brand-accent to-brand-gold-soft" />
                    )}
                    <span
                      className={[
                        'inline-flex items-center justify-center w-7 h-7 rounded-[9px] border transition shrink-0',
                        isActive
                          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.3)]'
                          : 'bg-[var(--c-surface-soft)] border-[var(--c-border-soft)] text-[var(--c-text-muted)] group-hover:text-brand-accent group-hover:border-[var(--c-accent-border)]',
                      ].join(' ')}
                    >
                      <Icon size={13} strokeWidth={2.2} />
                    </span>
                    <span className="flex-1 truncate">{label}</span>
                    {badge && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8.5px] uppercase tracking-[0.7px] font-bold bg-brand-accent/15 border border-[var(--c-accent-border)] text-brand-accent">
                        {badge.label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <Link
        to="/user/rewards"
        className="group relative overflow-hidden flex items-start gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] hover:border-[var(--c-accent-border-strong)] transition mt-4"
      >
        <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-20 h-20 rounded-full bg-brand-accent/[0.18] blur-2xl group-hover:bg-brand-accent/[0.28] transition" />
        <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_12px_rgba(201,162,39,0.32)] shrink-0">
          <Gift size={14} strokeWidth={2.2} />
        </span>
        <div className="relative flex-1 min-w-0 leading-tight">
          <p className="text-[10px] uppercase tracking-[1.1px] text-brand-accent font-bold m-0">
            Refer & earn
          </p>
          <p className="text-[12px] font-bold text-[var(--c-text)] m-0 mt-0.5">
            {referralReward ? `${referralReward} per friend` : '₦1,000 per friend'}
          </p>
          <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5 leading-snug">
            Real cash to your wallet.
          </p>
        </div>
      </Link>

      <div className="pt-3 mt-3 border-t border-[var(--c-border)] flex flex-col gap-2">
        <p className="inline-flex items-center justify-center gap-1 text-[9.5px] text-[var(--c-text-faint)] mt-1">
          <ShieldCheck size={9} className="text-brand-accent" />
          v1.2.0 · Encrypted
        </p>
      </div>
    </aside>
  )
}
