import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, Bell, Search, ChevronDown, Settings, LogOut, Sun, Moon,
  Plus, User, Gift, HelpCircle, Sparkles, CheckCircle2, Command,
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import useUser from '../../hooks/useUser'
import useSettings from '../../hooks/useSettings'

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

const NOTIFICATIONS_UNREAD = 3
const TIER = 'Gold'

const ICON_BTN =
  'relative inline-flex items-center justify-center w-[38px] h-[38px] rounded-[11px] bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] cursor-pointer transition-all hover:bg-[var(--c-surface-soft-2)] hover:border-[var(--c-accent-border)] hover:shadow-[0_4px_18px_-8px_color-mix(in_srgb,var(--color-brand-accent)_45%,transparent)] active:scale-[0.96]'

export default function UserTopbar({ onOpenDrawer, onLogout }) {
  const { user } = useUser()
  const { settings } = useSettings()
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const referralReward = settings?.referral_rewards
    ? 'Earn ₦' + Number(settings.referral_rewards).toLocaleString('en-NG')
    : 'Earn ₦1,000'
  const initials = getInitials(user)
  const avatarUrl = resolveAvatarUrl(user?.avatar)
  const isDark = theme === 'dark'
  const menuRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    function onKey(e) { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    function onKey(e) {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 min-[960px]:left-[260px] z-[50] h-[68px] flex items-center gap-3 px-4 min-[960px]:px-[22px] backdrop-blur-xl bg-[var(--c-top-bg)] border-b border-[var(--c-side-border)] text-[var(--c-text)]">
      <span
        aria-hidden
        className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--color-brand-accent)_38%,transparent)] to-transparent pointer-events-none"
      />

      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="Open menu"
        className="inline-flex min-[960px]:hidden items-center justify-center w-[38px] h-[38px] rounded-[11px] bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] cursor-pointer active:scale-[0.96] transition"
      >
        <Menu size={18} />
      </button>

      <label className="hidden min-[960px]:flex items-center gap-2.5 flex-1 max-w-[420px] h-[40px] px-3.5 rounded-[12px] bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] focus-within:border-[var(--c-accent-border)] focus-within:bg-[var(--c-surface-soft-2)] focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-brand-accent)_10%,transparent)] transition cursor-text">
        <Search size={14} className="shrink-0" />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search transactions, bills, cards…"
          className="flex-1 bg-transparent border-none outline-none text-[var(--c-text)] text-[13px] placeholder:text-[var(--c-text-faint)]"
        />
        <span className="hidden min-[1100px]:inline-flex items-center gap-1 px-1.5 h-[22px] rounded-md bg-[var(--c-surface-soft-2)] border border-[var(--c-border-soft)] text-[10.5px] font-medium text-[var(--c-text-muted)] tracking-wide">
          <Command size={10} /> K
        </span>
      </label>

      <div className="flex items-center gap-2 ml-auto">
        <Link
          to="/user/deposit"
          className="hidden min-[820px]:inline-flex items-center gap-1.5 h-[38px] px-3.5 rounded-[11px] text-[12.5px] font-semibold text-brand-primary bg-gradient-to-br from-brand-accent to-brand-gold-soft shadow-[0_6px_18px_-6px_color-mix(in_srgb,var(--color-brand-accent)_55%,transparent)] hover:shadow-[0_10px_24px_-6px_color-mix(in_srgb,var(--color-brand-accent)_70%,transparent)] active:scale-[0.97] transition-all"
        >
          <Plus size={14} strokeWidth={2.5} />
          Add money
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
          className={ICON_BTN}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? 'sun' : 'moon'}
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="inline-flex"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </motion.span>
          </AnimatePresence>
        </button>

        <button
          type="button"
          aria-label={`Notifications${NOTIFICATIONS_UNREAD ? ` (${NOTIFICATIONS_UNREAD} unread)` : ''}`}
          className={ICON_BTN}
        >
          <Bell size={16} />
          {NOTIFICATIONS_UNREAD > 0 && (
            <span
              aria-hidden
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full text-[10px] font-bold leading-none text-brand-primary bg-gradient-to-br from-brand-accent to-brand-gold-soft shadow-[0_0_0_2px_var(--c-top-bg),0_4px_10px_-2px_color-mix(in_srgb,var(--color-brand-accent)_55%,transparent)]"
            >
              {NOTIFICATIONS_UNREAD > 9 ? '9+' : NOTIFICATIONS_UNREAD}
            </span>
          )}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className={`flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] cursor-pointer transition-all hover:border-[var(--c-accent-border)] hover:bg-[var(--c-surface-soft-2)] ${menuOpen ? 'border-[var(--c-accent-border)] bg-[var(--c-surface-soft-2)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-brand-accent)_10%,transparent)]' : ''}`}
          >
            <span className="relative inline-flex items-center justify-center w-[30px] h-[30px] rounded-full shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="w-[30px] h-[30px] rounded-full object-cover"
                />
              ) : (
                <span className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary font-bold text-xs tracking-[0.4px]">
                  {initials}
                </span>
              )}
              <span
                aria-hidden
                className="absolute -bottom-0.5 -right-0.5 w-[10px] h-[10px] rounded-full bg-emerald-400 border-2 border-[var(--c-surface-soft)]"
              />
            </span>
            <span className="hidden min-[960px]:flex flex-col items-start leading-[1.1] max-w-[150px]">
              <span className="text-[12.5px] font-semibold truncate w-full">{user?.full_name || 'Member'}</span>
              <span className="text-[11px] text-[var(--c-text-muted)] truncate w-full">{user?.email}</span>
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="absolute right-0 top-[calc(100%+10px)] w-[290px] rounded-2xl bg-[var(--c-menu-bg)] border border-[var(--c-accent-soft-2)] shadow-[var(--c-shadow)] overflow-hidden z-20"
              >
                <div className="relative px-4 pt-4 pb-3.5 border-b border-[var(--c-border-soft)]">
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-brand-accent)_10%,transparent)] via-transparent to-transparent pointer-events-none"
                  />
                  <div className="relative flex items-start gap-3">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt=""
                        className="w-[44px] h-[44px] rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <span className="relative inline-flex items-center justify-center w-[44px] h-[44px] rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary font-bold text-sm shrink-0">
                        {initials}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[13.5px] font-semibold text-[var(--c-text)] truncate">{user?.full_name || 'Member'}</span>
                        <CheckCircle2 size={13} className="text-brand-accent shrink-0" aria-label="Verified" />
                      </div>
                      <div className="text-[11.5px] text-[var(--c-text-muted)] truncate">{user?.email}</div>
                    </div>
                  </div>


                </div>

                <div className="p-1.5">
                  <MenuItem to="/user/profile" icon={User} label="Profile" />
                  <MenuItem to="/user/settings" icon={Settings} label="Settings" />
                </div>
                <div className="px-1.5 pb-1.5 border-t border-[var(--c-border-soft)] pt-1.5">
                  <MenuItem to="/user/rewards" icon={Gift} label="Refer & earn" trailing={referralReward} />
                  <MenuItem to="/user/contact" icon={HelpCircle} label="Help center" />
                </div>
                <div className="px-1.5 pb-1.5 border-t border-[var(--c-border-soft)] pt-1.5">
                  <button
                    type="button"
                    onClick={onLogout}
                    role="menuitem"
                    className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] font-medium text-[color-mix(in_srgb,#ef4444_85%,var(--c-text))] hover:bg-[color-mix(in_srgb,#ef4444_10%,transparent)] hover:text-[#ef4444] bg-transparent border-0 cursor-pointer text-left transition"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

function MenuItem({ to, icon: Icon, label, trailing }) {
  return (
    <Link
      to={to}
      role="menuitem"
      className="group flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] text-[var(--c-text-muted)] hover:bg-[var(--c-surface-soft)] hover:text-[var(--c-text)] transition"
    >
      <Icon size={14} className="text-[var(--c-text-muted)] group-hover:text-brand-accent transition-colors" />
      <span className="flex-1">{label}</span>
      {trailing && (
        <span className="text-[10.5px] font-semibold text-brand-gold-soft">
          {trailing}
        </span>
      )}
    </Link>
  )
}
