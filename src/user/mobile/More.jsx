import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  History, User, Users, ScrollText, LogOut, ChevronRight,
  Shield, Fingerprint, Bell, HelpCircle, MessageCircle,
  FileText, ShieldCheck, Info, BadgeCheck, Star, Copy,
  Palette, Languages, Coins, EyeOff, Sun, Moon, Lock, KeyRound,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import useUser from '../../hooks/useUser'

const ACCOUNT = [
  { to: '/user/transactions',  label: 'Transaction history', sub: 'View all activity',     icon: History },
  { to: '/user/profile',       label: 'Profile',             sub: 'Personal info & KYC',   icon: User },
  { to: '/user/statements',    label: 'Statements',          sub: 'Download monthly reports', icon: ScrollText },
]

const PREFERENCES = [
  { label: 'Appearance', sub: 'Theme & accent color', icon: Palette, Widget: ThemeToggle },
  { to: '/user/preferences/language',   label: 'Language',         sub: 'English (US)',           icon: Languages },
  { to: '/user/preferences/currency',   label: 'Default currency', sub: 'NGN · ₦',                icon: Coins },
  { to: '/user/preferences/privacy',    label: 'Privacy',          sub: 'Hide balance on launch', icon: EyeOff },
]

function buildSecurity(user) {
  return [
    {
      to: '/user/transaction-pin',
      label: 'Transaction PIN',
      sub: user?.is_pin_created === 1 ? 'Change your PIN' : 'Set up your PIN',
      icon: Lock,
      meta: user?.is_pin_created === 1 ? 'Set' : undefined,
    },
    { to: '/user/change-password',     label: 'Change password',     sub: 'Update your login password', icon: KeyRound },
    { to: '/user/security/2fa',        label: '2-step verification', sub: 'Recommended',           icon: Shield,      meta: 'On' },
    { to: '/user/security/biometrics', label: 'Biometric login',     sub: 'Face ID or fingerprint', icon: Fingerprint },
    { to: '/user/notifications',       label: 'Alerts & reminders',  sub: 'Push, email, SMS',      icon: Bell },
  ]
}

const SUPPORT = [
  { to: '/user/help',    label: 'Help center', sub: 'Browse FAQs & guides',   icon: HelpCircle },
  { to: '/user/contact', label: 'Contact us',  sub: '24/7 priority support',  icon: MessageCircle },
]

const ABOUT = [
  { to: '/user/legal/terms',   label: 'Terms of service', icon: FileText },
  { to: '/user/legal/privacy', label: 'Privacy policy',   icon: ShieldCheck },
  { to: '/user/about',         label: 'About VeloxZap',   icon: Info },
]

const PROFILE_BG = `radial-gradient(540px 240px at 110% -10%, rgba(201, 162, 39, 0.32), transparent 60%), radial-gradient(360px 180px at -10% 110%, rgba(232, 197, 71, 0.16), transparent 60%), linear-gradient(135deg, rgba(20, 42, 92, 0.95), rgba(10, 31, 68, 1))`

const LIST = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const ITEM = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getInitials(user) {
  const source = user?.full_name || user?.email || '?'
  return source.split(/\s+|@/)[0].slice(0, 2).toUpperCase()
}

function resolveAvatarUrl(value) {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  return `${API_BASE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

export default function MobileMore() {
  const { logout } = useAuth()
  const { user } = useUser()
  const navigate = useNavigate()
  const [avatarError, setAvatarError] = useState(false)
  const initials = getInitials(user)
  const avatarUrl = resolveAvatarUrl(user?.avatar)
  const showAvatar = avatarUrl && !avatarError

  useEffect(() => {
    setAvatarError(false)
  }, [avatarUrl])

  async function handleLogout() {
    await logout()
    navigate('/auth/login', { replace: true })
  }

  return (
    <div className="flex flex-col gap-5">
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden p-4 rounded-[22px] border border-[rgba(201,162,39,0.32)] text-text shadow-[0_18px_44px_-14px_rgba(2,7,23,0.55)]"
        style={{ background: PROFILE_BG }}
      >
        <span aria-hidden className="absolute -top-12 -right-12 w-[180px] h-[180px] rounded-full bg-brand-accent/15 blur-3xl pointer-events-none" />
        <span aria-hidden className="absolute -bottom-12 -left-10 w-[140px] h-[140px] rounded-full bg-brand-gold-soft/10 blur-3xl pointer-events-none" />

        <div className="relative flex items-center gap-3">
          <div className="relative inline-flex shrink-0">
            <span aria-hidden className="absolute -inset-1 rounded-full bg-gradient-to-br from-brand-accent/45 to-brand-gold-soft/45 blur-md" />
            {showAvatar ? (
              <img
                key={avatarUrl}
                src={avatarUrl}
                alt=""
                onError={() => setAvatarError(true)}
                className="relative w-[58px] h-[58px] rounded-full object-cover border border-[rgba(232,197,71,0.5)] shadow-[0_4px_14px_rgba(201,162,39,0.32)]"
              />
            ) : (
              <span className="relative inline-flex items-center justify-center w-[58px] h-[58px] rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary font-bold text-[18px] tracking-[0.4px] border border-[rgba(232,197,71,0.5)] shadow-[0_4px_14px_rgba(201,162,39,0.32)]">
                {initials}
              </span>
            )}
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--c-success)] border-[2px] border-[var(--c-bg)]"
            >
              <BadgeCheck size={11} className="text-[#062b15]" strokeWidth={3} />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-[15.5px] font-bold tracking-[-0.2px] text-text m-0 truncate">
              {user?.full_name || 'VeloxZap member'}
            </h2>
            <p className="text-[11.5px] text-white/65 m-0 mt-0.5 truncate">
              {user?.email || 'member@veloxzap.com'}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/[0.1] border border-white/[0.16] text-[9px] font-bold uppercase tracking-[0.8px] text-white/85">
                <BadgeCheck size={10} className="text-[var(--c-success)]" /> Verified
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-brand-accent/15 border border-[rgba(201,162,39,0.4)] text-[9px] font-bold uppercase tracking-[0.8px] text-brand-accent">
                <Star size={9} strokeWidth={2.6} /> Tier 2
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
          <div className="leading-tight min-w-0">
            <p className="text-[9px] uppercase tracking-[1.1px] text-white/55 font-semibold m-0">
              Wallet ID
            </p>
            <p className="text-[12px] font-mono text-text m-0 mt-0.5 truncate tracking-[0.4px]">
              VLX-8X9P-2047-MQTR
            </p>
          </div>
          <button
            type="button"
            aria-label="Copy wallet ID"
            className="inline-flex items-center justify-center w-8 h-8 rounded-[10px] bg-white/[0.08] border border-white/[0.16] text-text/80 active:scale-95 transition shrink-0"
          >
            <Copy size={13} />
          </button>
        </div>
      </motion.article>

      <Section title="Account" items={ACCOUNT} />
      <Section title="Preferences" items={PREFERENCES} />
      <Section title="Security" items={buildSecurity(user)} />
      <Section title="Support" items={SUPPORT} />
      <Section title="About" items={ABOUT} compact />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 rounded-2xl text-[var(--c-danger)] bg-[var(--c-danger-soft)] border border-[var(--c-danger-border)] active:scale-[0.99] hover:opacity-90 transition"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-[12px] bg-[var(--c-danger-soft)] border border-[var(--c-danger-border)]">
            <LogOut size={16} />
          </span>
          <span className="flex-1 text-left">
            <span className="block text-[13px] font-semibold leading-tight">
              Sign out
            </span>
            <span className="block text-[10.5px] opacity-70 mt-0.5">
              End your secure session
            </span>
          </span>
        </button>
      </motion.div>

      <p className="text-center text-[10px] text-[var(--c-text-faint)] mt-1 mb-2 tracking-[0.6px]">
        VeloxZap · v1.0.0
      </p>
    </div>
  )
}

function StatCard({ label, value, hint }) {
  return (
    <article className="relative overflow-hidden p-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-4 -right-4 w-12 h-12 rounded-full bg-brand-accent/[0.06] blur-xl"
      />
      <p className="relative text-[8.5px] uppercase tracking-[1px] font-semibold text-[var(--c-text-muted)] m-0">
        {label}
      </p>
      <p className="relative text-[14px] font-bold tracking-[-0.2px] text-[var(--c-text)] m-0 mt-0.5 tabular-nums truncate">
        {value}
      </p>
      <p className="relative text-[9px] text-[var(--c-text-faint)] m-0 mt-0.5">
        {hint}
      </p>
    </article>
  )
}

function Section({ title, items, compact }) {
  const padding = compact ? 'p-2.5' : 'p-3'
  const tileSize = compact ? 'w-8 h-8' : 'w-10 h-10'
  const iconSize = compact ? 14 : 16
  const labelSize = compact ? 'text-[12.5px]' : 'text-[13px]'
  const subSize = compact ? 'text-[10px]' : 'text-[10.5px]'

  return (
    <section>
      <h3 className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
        {title}
      </h3>
      <motion.ul
        variants={LIST}
        initial="hidden"
        animate="show"
        className="list-none m-0 p-0 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden"
      >
        {items.map((item, i) => {
          const { to, label, sub, icon: Icon, meta, Widget } = item
          const inner = (
            <>
              <span
                className={[
                  'relative inline-flex items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent shrink-0',
                  tileSize,
                ].join(' ')}
              >
                <Icon size={iconSize} />
              </span>
              <span className="flex-1 min-w-0 leading-tight">
                <span className={['block font-semibold text-[var(--c-text)] truncate', labelSize].join(' ')}>
                  {label}
                </span>
                {sub && (
                  <span className={['block text-[var(--c-text-muted)] mt-0.5 truncate', subSize].join(' ')}>
                    {sub}
                  </span>
                )}
              </span>
            </>
          )

          return (
            <motion.li
              key={to ?? label}
              variants={ITEM}
              className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}
            >
              {Widget ? (
                <div className={['flex items-center gap-3', padding].join(' ')}>
                  {inner}
                  <Widget />
                </div>
              ) : (
                <Link
                  to={to}
                  className={['group flex items-center gap-3 active:bg-[var(--c-surface-soft)] transition', padding].join(' ')}
                >
                  {inner}
                  {meta && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[var(--c-success-bg)] text-[var(--c-success)] text-[9.5px] font-bold uppercase tracking-[0.8px] shrink-0">
                      {meta}
                    </span>
                  )}
                  <ChevronRight
                    size={14}
                    className="text-[var(--c-text-faint)] group-hover:text-brand-accent group-hover:translate-x-0.5 transition shrink-0"
                  />
                </Link>
              )}
            </motion.li>
          )
        })}
      </motion.ul>
    </section>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
      className={[
        'relative inline-flex items-center w-[46px] h-[26px] rounded-full p-0.5 border transition-colors duration-300 shrink-0',
        isDark
          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft border-[var(--c-accent-border-strong)]'
          : 'bg-[var(--c-surface-soft-2)] border-[var(--c-border-strong)]',
      ].join(' ')}
    >
      <motion.span
        animate={{ x: isDark ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
      >
        {isDark
          ? <Moon size={11} className="text-[#0A1F44]" strokeWidth={2.4} />
          : <Sun size={11} className="text-[#0A1F44]" strokeWidth={2.4} />}
      </motion.span>
    </button>
  )
}
