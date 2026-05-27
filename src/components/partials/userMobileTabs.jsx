import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home, Gift, CreditCard, MoreHorizontal,
} from 'lucide-react'

const SPRING = { type: 'spring', stiffness: 400, damping: 32 }

const TABS = [
  { to: '/user/dashboard', label: 'Home',  icon: Home },
  { to: '/user/rewards',   label: 'Rewards', icon: Gift },
  { to: '/user/cards',     label: 'Cards', icon: CreditCard },
  { to: '/user/more',      label: 'More',  icon: MoreHorizontal },
]

export default function UserMobileTabs() {
  const location = useLocation()

  const activeTab = TABS.find(
    t => location.pathname === t.to || location.pathname.startsWith(t.to + '/')
  )
  const activeKey = activeTab?.to ?? null

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-30 px-3 pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
    >
      <div className="pointer-events-auto relative">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-10 -bottom-2 h-12 rounded-full bg-brand-accent/[0.14] blur-3xl"
        />

        <div className="relative flex items-stretch gap-1 p-1.5 rounded-[28px] backdrop-blur-2xl bg-[var(--c-menu-bg)] border border-[var(--c-accent-soft-2)] shadow-[0_24px_56px_-18px_rgba(2,7,23,0.65),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[var(--c-accent-border-strong)] to-transparent"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.04] via-transparent to-transparent"
          />

          {TABS.map(tab => (
            <TabLink key={tab.to} {...tab} isActive={activeKey === tab.to} />
          ))}
        </div>
      </div>
    </nav>
  )
}

function TabLink({ to, label, icon: Icon, isActive }) {
  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className="group relative flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-[22px] text-[10.5px] font-semibold tracking-[0.1px] active:scale-95 transition-transform"
    >
      {isActive && (
        <motion.span
          layoutId="active-tab-bg"
          aria-hidden
          className="absolute inset-0 rounded-[50px] bg-gradient-to-br from-[var(--c-accent-soft-2)] via-[var(--c-accent-soft)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_18px_-4px_rgba(201,162,39,0.5)]"
          transition={SPRING}
        />
      )}

      <motion.span
        animate={{ scale: isActive ? 1.06 : 1, y: isActive ? -0.5 : 0 }}
        transition={SPRING}
        className={
          isActive
            ? 'relative inline-flex text-brand-accent'
            : 'relative inline-flex text-[var(--c-text-muted)]'
        }
      >
        <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
      </motion.span>

      <span
        className={
          isActive
            ? 'relative text-brand-accent'
            : 'relative text-[var(--c-text-muted)] opacity-70'
        }
      >
        {label}
      </span>
    </Link>
  )
}
