import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon, Palette, Shield, Bell, Eye, Info,
  Sparkles, ChevronRight, Globe, Coins, Clock, Sun, Moon, Monitor,
  KeyRound, Lock, Smartphone, Mail, MessageCircle,
  FileText, ShieldCheck, HelpCircle,
  Check, AlertTriangle, BellRing, BellOff, Loader2,
} from 'lucide-react'
import useUser from '../../hooks/useUser'
import { useTheme } from '../../context/ThemeContext'
import { subscribePush, unsubscribePush } from '../../lib/push'

const SECTIONS = [
  { id: 'preferences',   label: 'Preferences',   icon: SettingsIcon },
  { id: 'appearance',    label: 'Appearance',    icon: Palette },
  { id: 'security',      label: 'Security',      icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'about',         label: 'About',         icon: Info },
]

export default function DesktopSettings() {
  const { user } = useUser()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [active, setActive] = useState('preferences')

  const sectionRefs = useRef({})
  const setRef = id => el => { sectionRefs.current[id] = el }

  function gotoSection(id) {
    setActive(id)
    const el = sectionRefs.current[id]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const [language, setLanguage]       = useState('English (US)')
  const [currency, setCurrency]       = useState('NGN')
  const [timezone, setTimezone]       = useState('Africa/Lagos · WAT')
  const [hideOnLaunch, setHideOnLaunch] = useState(
    () => localStorage.getItem('vzap_hide_balance') === '1'
  )
  const [density, setDensity]         = useState('comfortable')

  const [emailLogin, setEmailLogin]   = useState(true)
  const [emailTx, setEmailTx]         = useState(true)
  const [smsLogin, setSmsLogin]       = useState(false)
  const [smsTx, setSmsTx]             = useState(true)
  const [emailPromos, setEmailPromos] = useState(false)
  const [newsletter, setNewsletter]   = useState(true)

  const pushSupported = 'Notification' in window && 'serviceWorker' in navigator
  const [pushPermission, setPushPermission] = useState(() =>
    pushSupported ? Notification.permission : 'unsupported'
  )
  const [pushSubscribed, setPushSubscribed] = useState(false)
  const [pushLoading, setPushLoading]       = useState(false)

  useEffect(() => {
    if (!pushSupported) return
    navigator.serviceWorker.ready
      .then(reg => reg.pushManager.getSubscription())
      .then(sub => { if (sub) { setPushSubscribed(true); setPushPermission('granted') } })
      .catch(() => {})
  }, [pushSupported])

  async function handlePushToggle() {
    if (pushLoading) return
    setPushLoading(true)
    try {
      if (pushSubscribed) {
        await unsubscribePush()
        setPushSubscribed(false)
        setPushPermission(Notification.permission)
      } else {
        await subscribePush()
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.getSubscription()
        setPushSubscribed(!!sub)
        setPushPermission(Notification.permission)
      }
    } finally {
      setPushLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-10">

      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[1.4px] text-brand-accent font-semibold m-0">
            <Sparkles size={11} /> Account
          </p>
          <h1 className="text-[28px] font-bold tracking-[-0.5px] text-[var(--c-text)] m-0 mt-1.5">
            Settings
          </h1>
          <p className="text-[13px] text-[var(--c-text-muted)] m-0 mt-1">
            Tune your preferences, security, and notifications. Changes save instantly.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
          <ShieldCheck size={13} className="text-brand-accent" />
          <span className="text-[11.5px] text-[var(--c-text-muted)]">
            Signed in as <span className="font-semibold text-[var(--c-text)]">{user?.email || '—'}</span>
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 min-[960px]:grid-cols-[240px_1fr] gap-4">

        <aside className="min-[960px]:sticky min-[960px]:top-[88px] min-[960px]:self-start">
          <nav className="flex min-[960px]:flex-col gap-1 p-1.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-x-auto min-[960px]:overflow-visible">
            {SECTIONS.map(({ id, label, icon: Icon }) => {
              const isActive = active === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => gotoSection(id)}
                  className={[
                    'group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold whitespace-nowrap transition text-left shrink-0 min-[960px]:w-full',
                    isActive
                      ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[var(--c-text)]'
                      : 'border border-transparent text-[var(--c-text-muted)] hover:bg-[var(--c-surface-soft)] hover:text-[var(--c-text)]',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'inline-flex items-center justify-center w-7 h-7 rounded-[9px] border transition shrink-0',
                      isActive
                        ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)]'
                        : 'bg-[var(--c-surface-soft)] border-[var(--c-border-soft)] text-[var(--c-text-muted)] group-hover:text-brand-accent',
                    ].join(' ')}
                  >
                    <Icon size={13} strokeWidth={2.2} />
                  </span>
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={12} className="text-brand-accent shrink-0 hidden min-[960px]:inline" />}
                </button>
              )
            })}
          </nav>
        </aside>

        <div className="flex flex-col gap-4 min-w-0">

          <Section id="preferences" title="Preferences" subtitle="How VeloxZap behaves day-to-day." setRef={setRef}>
            <SettingRow icon={Globe}    label="Language"          value={language}   onClick={() => setLanguage('English (US)')} />
            <SettingRow icon={Coins}    label="Default currency"  value={currency}   onClick={() => setCurrency('NGN')} />
            <SettingRow icon={Clock}    label="Timezone"          value={timezone}   onClick={() => setTimezone('Africa/Lagos · WAT')} />
            <SettingRow
              icon={Eye}
              label="Hide balance on launch"
              sub="Mask your wallet balance until you tap to reveal."
              control={<Toggle on={hideOnLaunch} onClick={() => setHideOnLaunch(v => { const next = !v; localStorage.setItem('vzap_hide_balance', next ? '1' : '0'); return next })} />}
              isLast
            />
          </Section>

          <Section id="appearance" title="Appearance" subtitle="Pick how the app looks." setRef={setRef}>
            <div className="p-3 grid grid-cols-2 min-[640px]:grid-cols-3 gap-2.5">
              <ThemeOption icon={Sun}     label="Light"   active={theme === 'light'}  onClick={() => setTheme('light')} />
              <ThemeOption icon={Moon}    label="Dark"    active={theme === 'dark'}   onClick={() => setTheme('dark')} />
              <ThemeOption icon={Monitor} label="System"  active={false} disabled />
            </div>

            <SettingRow
              icon={SettingsIcon}
              label="Density"
              control={
                <DensityToggle value={density} onChange={setDensity} />
              }
              isLast
            />
          </Section>

          <Section id="security" title="Security" subtitle="Protect your account and money." setRef={setRef}>
            <SettingRow icon={KeyRound}   label="Password"          sub="-" cta="Change" onClick={() => navigate('/user/change-password')} />
            <SettingRow icon={Lock}       label="Two-factor auth"   sub="Authenticator app" meta="Active"   metaTone="success" cta="Manage" />
            <SettingRow icon={Smartphone} label="Transaction PIN"   sub={user?.is_pin_created === 1 ? '4-digit PIN active' : 'Not set — tap to create'} meta={user?.is_pin_created === 1 ? 'Active' : undefined} metaTone="success" cta={user?.is_pin_created === 1 ? 'Update' : 'Set PIN'} onClick={() => navigate('/user/transaction-pin')} />

          </Section>

          <Section id="notifications" title="Notifications" subtitle="Choose how we reach you." setRef={setRef}>

            {/* Push notification banner */}
            {pushSupported && (
              <div className="px-4 pt-4 pb-3 border-b border-[var(--c-border)]">
                {pushPermission === 'denied' ? (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[color-mix(in_srgb,#ef4444_8%,transparent)] border border-[color-mix(in_srgb,#ef4444_25%,transparent)]">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-[color-mix(in_srgb,#ef4444_12%,transparent)] border border-[color-mix(in_srgb,#ef4444_25%,transparent)] text-[#ef4444]">
                      <BellOff size={15} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-bold text-[#ef4444] m-0">Push blocked by browser</p>
                      <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">
                        Go to your browser site settings and allow notifications for this site, then refresh.
                      </p>
                    </div>
                  </div>
                ) : pushSubscribed ? (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--c-success-bg)] border border-[var(--c-success)]">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-[var(--c-success-bg)] border border-[var(--c-success)] text-[var(--c-success)]">
                      <BellRing size={15} />
                    </span>
                    <div className="flex-1">
                      <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0">Push notifications active</p>
                      <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">Credit alerts will appear even when the app is closed.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handlePushToggle}
                      disabled={pushLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-bold border transition shrink-0 text-[#ef4444] border-[color-mix(in_srgb,#ef4444_30%,transparent)] bg-[color-mix(in_srgb,#ef4444_8%,transparent)] hover:bg-[color-mix(in_srgb,#ef4444_15%,transparent)]"
                    >
                      {pushLoading ? <Loader2 size={12} className="animate-spin" /> : <BellOff size={12} />}
                      Disable
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)]">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)]">
                      <BellRing size={15} />
                    </span>
                    <div className="flex-1">
                      <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0">Enable push notifications</p>
                      <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">Get instant credit alerts even when VeloxZap is closed.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handlePushToggle}
                      disabled={pushLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-bold transition shrink-0 bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] hover:opacity-90 shadow-[0_4px_12px_-4px_rgba(201,162,39,0.5)]"
                    >
                      {pushLoading ? <Loader2 size={12} className="animate-spin" /> : <BellRing size={12} />}
                      Enable
                    </button>
                  </div>
                )}
              </div>
            )}

            <NotificationMatrix
              rows={[
                { id: 'login', label: 'Login alerts',        sub: 'New sign-ins on your account' },
                { id: 'tx',    label: 'Transaction alerts',  sub: 'Deposits, transfers, card spend' },
                { id: 'promo', label: 'Promos & rewards',    sub: 'Cashback, gift card deals' },
                { id: 'news',  label: 'Newsletter',          sub: 'Monthly product roundup' },
              ]}
              values={{
                login: { email: emailLogin, push: pushSubscribed, sms: smsLogin },
                tx:    { email: emailTx,    push: pushSubscribed, sms: smsTx },
                promo: { email: emailPromos, push: false, sms: false },
                news:  { email: newsletter,  push: false, sms: false },
              }}
              setters={{
                login: { email: setEmailLogin, push: handlePushToggle, sms: setSmsLogin },
                tx:    { email: setEmailTx,    push: handlePushToggle, sms: setSmsTx },
                promo: { email: setEmailPromos, push: () => {}, sms: () => {} },
                news:  { email: setNewsletter,  push: () => {}, sms: () => {} },
              }}
            />
          </Section>


          <Section id="about" title="About" subtitle="Legal & support." setRef={setRef}>
            <SettingRow icon={FileText}    label="Terms of service" link="/terms" />
            <SettingRow icon={ShieldCheck} label="Privacy policy"   link="/privacy" />
            <SettingRow icon={FileText}    label="AML policy"       link="/aml" />
            <SettingRow icon={HelpCircle}  label="Help center"      link="/user/contact" />
            <SettingRow
              icon={Info}
              label="Version"
              value="1.2.0"
              sub="Build a8f3c · Encrypted end-to-end"
              isLast
            />
          </Section>

        </div>
      </div>
    </div>
  )
}

function Section({ id, title, subtitle, children, setRef }) {
  return (
    <article
      ref={setRef(id)}
      id={id}
      className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden scroll-mt-[88px]"
    >
      <header className="px-4 pt-4 pb-3 border-b border-[var(--c-border)]">
        <h2 className="text-[14px] font-bold m-0 text-[var(--c-text)] tracking-[-0.2px]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11.5px] text-[var(--c-text-muted)] m-0 mt-0.5">
            {subtitle}
          </p>
        )}
      </header>
      <div className="flex flex-col">
        {children}
      </div>
    </article>
  )
}

function Divider() {
  return <div className="h-px bg-[var(--c-border)] mx-4" />
}

function SettingRow({
  icon: Icon, label, sub, value, control, cta, link, meta, metaTone, swatch, onClick, isLast,
}) {
  const RowWrapper = link ? Link : 'div'
  const wrapperProps = link ? { to: link } : {}

  return (
    <RowWrapper
      {...wrapperProps}
      className={[
        'flex items-center gap-3 px-4 py-3 transition',
        link ? 'hover:bg-[var(--c-surface-soft)] cursor-pointer' : '',
        !isLast ? 'border-b border-[var(--c-border)]' : '',
      ].join(' ')}
    >
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent shrink-0">
        <Icon size={14} />
      </span>
      <div className="flex-1 min-w-0 leading-tight">
        <p className="text-[12.5px] font-semibold text-[var(--c-text)] m-0">
          {label}
        </p>
        {sub && (
          <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5 truncate">
            {sub}
          </p>
        )}
      </div>

      {value && !control && !cta && (
        <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-[var(--c-text)] shrink-0">
          {swatch && (
            <span
              aria-hidden
              className="w-4 h-4 rounded-full border border-[rgba(232,197,71,0.55)]"
              style={{ background: swatch }}
            />
          )}
          {value}
        </span>
      )}

      {meta && (
        <span
          className={[
            'inline-flex items-center px-1.5 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-[0.8px] shrink-0',
            metaTone === 'success'
              ? 'bg-[var(--c-success-bg)] text-[var(--c-success)]'
              : 'bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]',
          ].join(' ')}
        >
          {meta}
        </span>
      )}

      {control && (
        <span className="shrink-0">{control}</span>
      )}

      {cta && (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] text-[11.5px] font-semibold hover:border-[var(--c-accent-border)] transition shrink-0"
        >
          {cta} <ChevronRight size={11} />
        </button>
      )}

      {link && !cta && !control && !value && (
        <ChevronRight size={14} className="text-[var(--c-text-faint)] shrink-0" />
      )}
    </RowWrapper>
  )
}

function DangerRow({ icon: Icon, label, sub, cta }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] bg-[color-mix(in_srgb,#ef4444_12%,transparent)] border border-[color-mix(in_srgb,#ef4444_28%,transparent)] text-[#ef4444] shrink-0">
        <Icon size={14} />
      </span>
      <div className="flex-1 min-w-0 leading-tight">
        <p className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#ef4444] m-0">
          <AlertTriangle size={11} /> {label}
        </p>
        <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">
          {sub}
        </p>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[color-mix(in_srgb,#ef4444_10%,transparent)] border border-[color-mix(in_srgb,#ef4444_28%,transparent)] text-[#ef4444] text-[11.5px] font-bold hover:bg-[color-mix(in_srgb,#ef4444_18%,transparent)] transition shrink-0"
      >
        {cta}
      </button>
    </div>
  )
}

function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={[
        'relative inline-flex items-center w-[42px] h-[24px] rounded-full p-0.5 border transition-colors',
        on
          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft border-[rgba(232,197,71,0.55)]'
          : 'bg-[var(--c-surface-soft)] border-[var(--c-border-soft)]',
      ].join(' ')}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className={[
          'inline-flex items-center justify-center w-[20px] h-[20px] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.25)]',
          on ? 'bg-white ml-auto' : 'bg-[var(--c-text-muted)]',
        ].join(' ')}
      >
        {on && <Check size={11} className="text-brand-primary" strokeWidth={3} />}
      </motion.span>
    </button>
  )
}

function ThemeOption({ icon: Icon, label, active, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'relative flex flex-col items-center gap-2 p-3 rounded-xl border transition',
        active
          ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border-[var(--c-accent-border)] text-[var(--c-text)] shadow-[0_4px_14px_-4px_rgba(201,162,39,0.32)]'
          : 'bg-[var(--c-surface-soft)] border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:border-[var(--c-accent-border)] hover:text-[var(--c-text)]',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ].join(' ')}
    >
      {active && (
        <span className="absolute top-2 right-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-accent text-brand-primary">
          <Check size={10} strokeWidth={3} />
        </span>
      )}
      <span
        className={[
          'inline-flex items-center justify-center w-9 h-9 rounded-xl border',
          active
            ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)]'
            : 'bg-[var(--c-surface)] border-[var(--c-border)]',
        ].join(' ')}
      >
        <Icon size={15} />
      </span>
      <span className="text-[11.5px] font-bold tracking-[-0.1px]">
        {label}
      </span>
    </button>
  )
}

function DensityToggle({ value, onChange }) {
  const opts = [
    { id: 'comfortable', label: 'Comfy' },
    { id: 'compact',     label: 'Compact' },
  ]
  return (
    <div className="inline-flex p-0.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
      {opts.map(o => {
        const active = value === o.id
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={[
              'inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-bold tracking-[0.3px] transition',
              active
                ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_2px_8px_rgba(201,162,39,0.32)]'
                : 'text-[var(--c-text-muted)] hover:text-[var(--c-text)]',
            ].join(' ')}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function NotificationMatrix({ rows, values, setters }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)]">
              Notification
            </th>
            <th className="px-3 py-2.5 text-[10px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)] text-center w-[80px]">
              <span className="inline-flex items-center gap-1"><Mail size={10} /> Email</span>
            </th>
            <th className="px-3 py-2.5 text-[10px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)] text-center w-[80px]">
              <span className="inline-flex items-center gap-1"><Bell size={10} /> Push</span>
            </th>
            <th className="px-3 py-2.5 text-[10px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)] text-center w-[80px]">
              <span className="inline-flex items-center gap-1"><MessageCircle size={10} /> SMS</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id}
              className={i > 0 ? 'border-t border-[var(--c-border)]' : 'border-t border-[var(--c-border)]'}
            >
              <td className="px-4 py-3 leading-tight">
                <p className="text-[12.5px] font-semibold text-[var(--c-text)] m-0">{row.label}</p>
                <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">{row.sub}</p>
              </td>
              {['email', 'push', 'sms'].map(channel => (
                <td key={channel} className="px-3 py-3 text-center">
                  <Toggle
                    on={values[row.id][channel]}
                    onClick={() => {
                      const setter = setters[row.id][channel]
                      channel === 'push' ? setter() : setter(v => !v)
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
