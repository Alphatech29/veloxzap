import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Sun, HelpCircle, X, Sunrise, Sunset, Check, Inbox } from 'lucide-react'
import useUser from '../../hooks/useUser'
import useNotifications from '../../hooks/useNotifications'

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

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return { label: 'Good morning', Icon: Sunrise }
  if (h < 17) return { label: 'Good afternoon', Icon: Sun }
  return { label: 'Good evening', Icon: Sunset }
}

const ICON_BTN =
  'inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] active:scale-95 hover:border-[var(--c-accent-border)] transition'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(dateStr).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
}

export default function UserMobileHeader() {
  const { user } = useUser()
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const [showNotif, setShowNotif] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const initials = getInitials(user)
  const avatarUrl = resolveAvatarUrl(user?.avatar)
  const showAvatar = avatarUrl && !avatarError
  const rawFirst = (user?.full_name || '').trim().split(/\s+/)[0] || ''
  const firstName = rawFirst
    ? rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1).toLowerCase()
    : 'there'
  const { label: greetLabel, Icon: GreetIcon } = greeting()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setAvatarError(false)
  }, [avatarUrl])

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 10) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 text-[var(--c-text)] transition-all duration-300 ${scrolled ? 'backdrop-blur-2xl bg-[var(--c-top-bg)] border-b border-[var(--c-side-border)]' : 'bg-transparent border-b border-transparent'}`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="h-[60px] flex items-center gap-3 px-4">
          <Link to="/user/profile" aria-label="Open profile" className="relative inline-flex shrink-0 active:scale-95 transition">
            <span
              aria-hidden
              className="absolute -inset-1 rounded-full bg-gradient-to-br from-brand-accent/45 to-brand-gold-soft/45 blur-md"
            />
            {showAvatar ? (
              <img
                key={avatarUrl}
                src={avatarUrl}
                alt=""
                onError={() => setAvatarError(true)}
                className="relative w-10 h-10 rounded-full object-cover border border-[rgba(232,197,71,0.5)] shadow-[0_4px_14px_rgba(201,162,39,0.32)]"
              />
            ) : (
              <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary font-bold text-[13px] tracking-[0.4px] border border-[rgba(232,197,71,0.5)] shadow-[0_4px_14px_rgba(201,162,39,0.32)]">
                {initials}
              </span>
            )}
          </Link>

          <div className="flex-1 min-w-0 leading-tight">
            <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[1.2px] text-[var(--c-text-muted)] m-0 font-semibold">
              <GreetIcon size={10} className="text-brand-accent" />
              {greetLabel}
            </p>
            <p className="text-[15px] font-bold tracking-[-0.25px] text-[var(--c-text)] m-0 truncate mt-0.5">
              {firstName}
            </p>
          </div>

          <Link
            to="/user/contact"
            aria-label="Help & support"
            className={ICON_BTN}
          >
            <HelpCircle size={16} />
          </Link>

          <button
            type="button"
            onClick={() => setShowNotif(true)}
            aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ''}`}
            className={`${ICON_BTN} relative`}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span
                aria-hidden
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft shadow-[0_0_0_2px_var(--c-top-bg),0_0_8px_rgba(201,162,39,0.7)]"
              />
            )}
          </button>
        </div>

        <span
          aria-hidden
          className="block h-px bg-gradient-to-r from-transparent via-[var(--c-accent-border)] to-transparent"
        />
      </header>

      {showNotif && (
        <NotificationSheet
          notifications={notifications}
          unreadCount={unreadCount}
          markRead={markRead}
          markAllRead={markAllRead}
          onClose={() => setShowNotif(false)}
        />
      )}
    </>
  )
}

function NotificationSheet({ notifications, unreadCount, markRead, markAllRead, onClose }) {
  return (
    <>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-[var(--c-scrim)] backdrop-blur-[2px] border-0 animate-in fade-in duration-200"
      />
      <div
        role="dialog"
        aria-label="Notifications"
        className="fixed top-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-b-[28px] bg-[var(--c-menu-bg)] border-x border-b border-[var(--c-accent-soft-2)] shadow-[0_24px_50px_-12px_rgba(2,7,23,0.6)] animate-in slide-in-from-top duration-300"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div>
            <p className="text-[10.5px] uppercase tracking-[1.2px] text-brand-accent font-semibold m-0">
              Inbox
            </p>
            <h3 className="text-[18px] font-bold tracking-[-0.3px] text-[var(--c-text)] m-0 mt-0.5">
              Notifications
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand-accent active:opacity-70 transition"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] active:scale-95 transition"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center text-center px-6 pt-3 pb-10">
            <span className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent">
              <span
                aria-hidden
                className="absolute -inset-3 rounded-3xl bg-brand-accent/15 blur-xl"
              />
              <Inbox size={26} className="relative" />
            </span>
            <h4 className="mt-4 mb-1 text-[15.5px] font-semibold tracking-[-0.2px] text-[var(--c-text)]">
              You're all caught up
            </h4>
            <p className="m-0 max-w-[260px] text-[12.5px] leading-[1.55] text-[var(--c-text-muted)]">
              We'll let you know the moment anything needs your attention.
            </p>
          </div>
        ) : (
          <ul className="list-none m-0 p-0 pb-4">
            {notifications.map((n, i) => (
              <li key={n.id} className={i > 0 ? 'border-t border-[var(--c-border-soft)]' : ''}>
                <button
                  type="button"
                  onClick={() => !n.read_at && markRead(n.id)}
                  className="w-full flex items-start gap-3 px-5 py-3.5 text-left active:bg-[var(--c-surface-soft)] transition-colors"
                >
                  {!n.read_at && (
                    <span aria-hidden className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                  )}
                  <div className={`min-w-0 flex-1 ${n.read_at ? 'pl-4' : ''}`}>
                    <p className="text-[13px] font-semibold text-[var(--c-text)] m-0 truncate">{n.title}</p>
                    <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5 leading-snug">{n.message}</p>
                    <p className="text-[10.5px] text-[var(--c-text-faint)] m-0 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
