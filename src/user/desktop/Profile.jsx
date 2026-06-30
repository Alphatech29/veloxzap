import { useState } from 'react'
import {
  Camera, BadgeCheck, Star, Copy, Pencil, Check, X,
  User, Mail, Phone, Calendar, ShieldCheck, MapPin, Wallet, IdCard,
  AlertTriangle, KeyRound, Smartphone, Globe, Activity, Sparkles,
  ChevronRight, Crown, Lock, BellRing, Loader2,
} from 'lucide-react'
import useUser from '../../hooks/useUser'
import useEmailVerification from '../../hooks/useEmailVerification'
import { useToast } from '../../components/ui/Toast'

const HERO_BG = `radial-gradient(640px 240px at 100% 0%, rgba(201,162,39,0.32), transparent 65%), radial-gradient(420px 200px at 0% 100%, rgba(232,197,71,0.18), transparent 60%), linear-gradient(135deg, rgba(20,42,92,0.98), rgba(10,31,68,1))`

function getInitials(user) {
  const source = user?.full_name || user?.email || '?'
  return source.split(/\s+|@/)[0].slice(0, 2).toUpperCase()
}

export default function DesktopProfile() {
  const { user, updateAvatar, updating } = useUser()
  const initials = getInitials(user)
  const [copied, setCopied] = useState(null)
  const [editing, setEditing] = useState(null)
  const avatarUrl = user?.avatar
  const isEmailVerified = user?.is_email_verified === 1

  const { sendLink, sending } = useEmailVerification()
  const { toast } = useToast()

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    await updateAvatar(file)
  }

  const accountId = user?.uid || 'VLX-8X9P-2047-MQTR'

  function copy(key, value) {
    if (navigator.clipboard) navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  async function openVerifyEmail() {
    const result = await sendLink()
    toast({
      type: result.success ? 'success' : 'error',
      title: result.success ? 'Verification link sent' : 'Could not send link',
      message: result.success
        ? `Check ${user?.email} and click the link to confirm.`
        : result.message,
    })
  }

  const personalInfo = [
    { id: 'name',  icon: User,     label: 'Full name',     value: user?.full_name || 'Add name' },
    {
      id: 'email', icon: Mail, label: 'Email', value: user?.email || '—',
      meta: isEmailVerified ? 'Verified' : 'Unverified',
      metaTone: isEmailVerified ? 'success' : 'danger',
      cta: isEmailVerified ? undefined : { label: 'Verify' },
    },
    { id: 'phone', icon: Phone,    label: 'Phone',         value: user?.phone_number || '+234 803 555 1234' },
    { id: 'country', icon: Globe,  label: 'Country',       value: user?.country || 'Nigeria' },
    { id: 'dob',   icon: Calendar, label: 'Date of birth', value: user?.dob || 'Apr 14, 1995' },
  ]

  const verification = [
    { id: 'kyc',  icon: ShieldCheck, label: 'KYC tier', value: 'Tier 2 · ₦5M daily limit', meta: user?.is_kyc_verified === 1 ? 'Verified' : user?.is_kyc_verified === 2 ? 'Processing' : 'Unverified', metaTone: user?.is_kyc_verified === 1 ? 'success' : user?.is_kyc_verified === 2 ? 'accent' : 'danger' },
    { id: 'bvn',  icon: IdCard,      label: 'BVN',      value: user?.bvn || '-',                meta: user?.is_bvn_verified === 1 ? 'Verified' : user?.is_bvn_verified === 2 ? 'Processing' : 'Unverified', metaTone: user?.is_bvn_verified === 1 ? 'success' : user?.is_bvn_verified === 2 ? 'accent' : 'danger' },
    { id: 'addr', icon: MapPin,      label: 'Address',  value: user?.address || '12 Admiralty Way, Lekki Phase 1, Lagos' },
  ]

  const security = [
    { id: 'pwd',  icon: KeyRound,   label: 'Password',         value: 'Last changed 23 days ago' },
    { id: '2fa',  icon: Lock,       label: 'Two-factor auth',  value: 'Authenticator app',         meta: 'Active',   metaTone: 'success' },
    { id: 'pin',  icon: Smartphone, label: 'Transaction PIN',  value: '4-digit PIN set' },
    { id: 'biom', icon: BadgeCheck, label: 'Biometrics',       value: 'Face ID enabled',           meta: 'Mobile',   metaTone: 'accent' },
  ]

  const notifications = [
    { id: 'login',  icon: BellRing, label: 'Login alerts',         value: 'Email + SMS' },
    { id: 'spend',  icon: BellRing, label: 'Spending notifications', value: 'Push only' },
    { id: 'promo',  icon: BellRing, label: 'Promos & rewards',     value: 'Email' },
  ]

  const sessions = [
    { id: 's1', device: 'Chrome · Windows',     location: 'Lagos, NG',  meta: 'Current session', current: true },
    { id: 's2', device: 'Safari · iPhone 15',   location: 'Lagos, NG',  meta: '2 hours ago' },
    { id: 's3', device: 'VeloxZap iOS app',     location: 'Abuja, NG',  meta: 'Yesterday' },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-10">

      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[1.4px] text-brand-accent font-semibold m-0">
            <Sparkles size={11} /> Account
          </p>
          <h1 className="text-[28px] font-bold tracking-[-0.5px] text-[var(--c-text)] m-0 mt-1.5">
            Your profile
          </h1>
          <p className="text-[13px] text-[var(--c-text-muted)] m-0 mt-1">
            Manage personal details, verification & security in one place.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text)] text-[12.5px] font-semibold hover:border-[var(--c-accent-border)] transition"
        >
          <Activity size={13} /> Activity log
        </button>
      </header>

      <article
        className="relative overflow-hidden p-6 rounded-3xl border border-[rgba(201,162,39,0.32)] text-text shadow-[0_18px_44px_-18px_rgba(2,7,23,0.55)]"
        style={{ background: HERO_BG }}
      >
        <span aria-hidden className="pointer-events-none absolute -top-16 -right-16 w-[260px] h-[260px] rounded-full bg-brand-accent/[0.18] blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute -bottom-14 -left-12 w-[180px] h-[180px] rounded-full bg-brand-gold-soft/[0.12] blur-3xl" />

        <div className="relative grid grid-cols-1 min-[820px]:grid-cols-[auto_1fr_auto] items-center gap-6">
          <div className="relative inline-flex shrink-0 mx-auto min-[820px]:mx-0">
            <span aria-hidden className="absolute -inset-2 rounded-full bg-gradient-to-br from-brand-accent/45 to-brand-gold-soft/45 blur-md" />
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="relative w-[104px] h-[104px] rounded-full object-cover border-[3px] border-[rgba(232,197,71,0.6)] shadow-[0_10px_24px_rgba(201,162,39,0.4)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.style.removeProperty('display')
                }}
              />
            ) : null}
            <span
              className="relative inline-flex items-center justify-center w-[104px] h-[104px] rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary font-bold text-[32px] tracking-[0.5px] border-[3px] border-[rgba(232,197,71,0.6)] shadow-[0_10px_24px_rgba(201,162,39,0.4)]"
              style={avatarUrl ? { display: 'none' } : undefined}
            >
              {initials}
            </span>
            <label
              aria-label="Change photo"
              className={`absolute -bottom-1 -right-1 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--c-menu-bg)] border-[2px] border-[rgba(201,162,39,0.6)] text-brand-accent hover:scale-105 transition shadow-[0_4px_10px_rgba(0,0,0,0.3)] cursor-pointer${updating ? ' opacity-60 pointer-events-none' : ''}`}
            >
              {updating ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={updating}
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <div className="text-center min-[820px]:text-left">
            <h2 className="text-[24px] font-bold tracking-[-0.4px] text-text m-0 leading-tight">
              {user?.full_name || 'VeloxZap member'}
            </h2>
            <p className="text-[13px] text-white/60 m-0 mt-1">
              {user?.email || 'member@veloxzap.com'}
            </p>
            <div className="inline-flex flex-wrap items-center justify-center min-[820px]:justify-start gap-1.5 mt-3">
              
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-accent/15 border border-[rgba(201,162,39,0.4)] text-[10px] font-bold uppercase tracking-[0.9px] text-brand-accent">
                <Star size={10} strokeWidth={2.6} /> Tier 2
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.14] text-[10px] font-bold uppercase tracking-[0.9px] text-white/75">
                <Crown size={10} className="text-brand-accent" /> Gold member
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 min-w-[260px]">
            <HeroStat label="Account ID" value={user?.uid || 'VLX-8X9P-2047-MQTR'} hint="Tap to copy" onClick={() => copy('walletHero', accountId)} copied={copied === 'walletHero'} />
            <HeroStat label="Member since" value="May 2026" />
            <HeroStat label="Daily limit" value="₦5M" />
          </div>
        </div>
      </article>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-5">
        <SectionCard
          id="personal"
          title="Personal info"
          subtitle="Used on receipts, transfers and KYC."
          editing={editing}
          setEditing={setEditing}
          hideEdit
        >
          <Grid2>
            {personalInfo.map(item => (
              <InfoCell
                key={item.id}
                {...item}
                editing={false}
                copied={copied}
                onCopy={copy}
                onCta={item.id === 'email' ? openVerifyEmail : undefined}
                ctaDisabled={item.id === 'email' && sending}
              />
            ))}
          </Grid2>
        </SectionCard>

        <SectionCard
          id="verification"
          title="Verification"
          subtitle="Boost limits by completing KYC."
          editing={editing}
          setEditing={setEditing}
        >
          <Stack>
            {verification.map(item => (
              <InfoCell key={item.id} {...item} editing={editing === 'verification'} copied={copied} onCopy={copy} />
            ))}
            <div className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
              <div>
                <p className="text-[10px] uppercase tracking-[1.1px] font-bold text-brand-accent m-0">
                  Tier 3 perks
                </p>
                <p className="text-[12px] font-semibold text-[var(--c-text)] m-0 mt-0.5">
                  Unlock ₦50M daily limit & priority support
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[11px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.28)] hover:-translate-y-px transition shrink-0"
              >
                Start <ChevronRight size={11} strokeWidth={2.6} />
              </button>
            </div>
          </Stack>
        </SectionCard>
      </section>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-5">
        <SectionCard
          id="security"
          title="Security"
          subtitle="Lock down your VeloxZap account."
          editing={editing}
          setEditing={setEditing}
          actionLabel="Manage"
        >
          <Grid2>
            {security.map(item => (
              <InfoCell key={item.id} {...item} editing={editing === 'security'} copied={copied} onCopy={copy} />
            ))}
          </Grid2>
        </SectionCard>

        <SectionCard
          id="account"
          title="Account"
          subtitle="VeloxZap identifiers."
          editing={editing}
          setEditing={setEditing}
          hideEdit
        >
          <Stack>
            <InfoCell
              icon={Wallet}
              label="Account ID"
              value={accountId}
              copyable
              copyKey="accountId"
              copied={copied}
              onCopy={copy}
            />
            <InfoCell icon={Calendar} label="Member since" value="May 8, 2026" />
            <InfoCell icon={Globe} label="Region" value="Nigeria · Lagos" />
            <InfoCell icon={ShieldCheck} label="Account status" value="Active" meta="Healthy" metaTone="success" />
          </Stack>
        </SectionCard>
      </section>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-5">
        <SectionCard
          id="sessions"
          title="Active sessions"
          subtitle="Devices currently signed in to your account."
          editing={editing}
          setEditing={setEditing}
          actionLabel="Sign out all"
          actionTone="danger"
          hideEdit
        >
          <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
            {sessions.map(s => (
              <li
                key={s.id}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]"
              >
                <span
                  className={[
                    'inline-flex items-center justify-center w-9 h-9 rounded-[10px] border',
                    s.current
                      ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border-[var(--c-accent-border)] text-brand-accent'
                      : 'bg-[var(--c-surface)] border-[var(--c-border)] text-[var(--c-text-muted)]',
                  ].join(' ')}
                >
                  <Smartphone size={14} />
                </span>
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="text-[12.5px] font-semibold text-[var(--c-text)] truncate">
                    {s.device}
                  </span>
                  <span className="text-[10.5px] text-[var(--c-text-muted)] mt-0.5 inline-flex items-center gap-1">
                    <Globe size={9} /> {s.location} · {s.meta}
                  </span>
                </div>
                {s.current ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--c-success-bg)] text-[var(--c-success)] text-[9.5px] font-bold uppercase tracking-[0.8px]">
                    This device
                  </span>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text-muted)] text-[10.5px] font-semibold hover:text-[var(--c-danger)] hover:border-[var(--c-danger-border)] transition"
                  >
                    Sign out
                  </button>
                )}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          id="notifications"
          title="Notifications"
          subtitle="Choose what we ping you about."
          editing={editing}
          setEditing={setEditing}
        >
          <Stack>
            {notifications.map(item => (
              <InfoCell key={item.id} {...item} editing={editing === 'notifications'} copied={copied} onCopy={copy} />
            ))}
          </Stack>
        </SectionCard>
      </section>

      <section className="rounded-2xl border border-[var(--c-danger-border)] bg-[var(--c-danger-soft)] p-5">
        <div className="flex items-start gap-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--c-danger-soft)] border border-[var(--c-danger-border)] text-[var(--c-danger)] shrink-0">
            <AlertTriangle size={18} />
          </span>
          <div className="flex-1">
            <h3 className="inline-flex items-center gap-2 text-[14px] font-bold m-0 text-[var(--c-danger)]">
              Danger zone
            </h3>
            <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1 leading-snug max-w-[640px]">
              Closing your account is permanent. We'll wipe your wallet, cards, and history after a 30-day cooling period — you can cancel any time before then.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text)] text-[12px] font-semibold hover:border-[var(--c-danger-border)] hover:text-[var(--c-danger)] transition"
              >
                Export data
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--c-danger)] text-white text-[12px] font-bold border border-[var(--c-danger)] hover:opacity-90 transition"
              >
                <AlertTriangle size={13} /> Close account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function HeroStat({ label, value, hint, onClick, copied }) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={[
        'p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.14] text-left transition',
        onClick ? 'hover:bg-white/[0.10] hover:border-[rgba(201,162,39,0.4)]' : '',
      ].join(' ')}
    >
      <p className="text-[9.5px] uppercase tracking-[1px] text-white/55 font-bold m-0">
        {label}
      </p>
      <p className="text-[13px] font-bold text-text m-0 mt-1 tabular-nums tracking-[-0.1px] truncate w-[150px]">
        {value}
      </p>
      {hint && (
        <p className="text-[9.5px] text-white/45 m-0 mt-0.5 inline-flex items-center gap-1">
          {copied ? <><Check size={9} strokeWidth={3} className="text-[var(--c-success)]" /> Copied</> : <>{hint}</>}
        </p>
      )}
    </Comp>
  )
}

function SectionCard({ id, title, subtitle, children, editing, setEditing, actionLabel, actionTone, hideEdit }) {
  const isEditing = editing === id
  return (
    <article className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
      <header className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[var(--c-border)]">
        <div>
          <h2 className="text-[14px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {!hideEdit && (
          isEditing ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] text-[11px] font-semibold hover:text-[var(--c-text)] transition"
              >
                <X size={11} /> Cancel
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[11px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.28)] hover:-translate-y-px transition"
              >
                <Check size={11} strokeWidth={3} /> Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(id)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] text-[11px] font-semibold hover:border-[var(--c-accent-border)] hover:text-brand-accent transition"
            >
              <Pencil size={11} /> {actionLabel || 'Edit'}
            </button>
          )
        )}
        {hideEdit && actionLabel && (
          <button
            type="button"
            className={[
              'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition',
              actionTone === 'danger'
                ? 'bg-[var(--c-danger-soft)] border-[var(--c-danger-border)] text-[var(--c-danger)] hover:opacity-90'
                : 'bg-[var(--c-surface-soft)] border-[var(--c-border-soft)] text-[var(--c-text)] hover:border-[var(--c-accent-border)] hover:text-brand-accent',
            ].join(' ')}
          >
            {actionLabel}
          </button>
        )}
      </header>
      <div className="p-4">
        {children}
      </div>
    </article>
  )
}

function Grid2({ children }) {
  return (
    <div className="grid grid-cols-1 min-[640px]:grid-cols-2 gap-2">
      {children}
    </div>
  )
}

function Stack({ children }) {
  return <div className="flex flex-col gap-2">{children}</div>
}

function InfoCell({ icon: Icon, label, value, meta, metaTone, editing, copyable, copyKey, cta, copied, onCopy, onCta, ctaDisabled }) {
  const isCopied = copyable && copied === (copyKey || label)
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent shrink-0">
        <Icon size={14} />
      </span>
      <div className="flex-1 min-w-0 leading-tight">
        <p className="text-[9.5px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)] m-0">
          {label}
        </p>
        {editing ? (
          <input
            defaultValue={value}
            className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 mt-0.5 text-[12.5px] font-semibold text-[var(--c-text)]"
            style={{ boxShadow: 'none' }}
          />
        ) : (
          <p className="text-[12.5px] font-semibold text-[var(--c-text)] m-0 mt-0.5 truncate">
            {value}
          </p>
        )}
      </div>
      {meta && (
        <span
          className={[
            'inline-flex items-center px-1.5 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-[0.8px] shrink-0',
            metaTone === 'success'
              ? 'bg-[var(--c-success-bg)] text-[var(--c-success)]'
              : metaTone === 'danger'
              ? 'bg-[var(--c-danger-soft)] text-[var(--c-danger)] border border-[var(--c-danger-border)]'
              : 'bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]',
          ].join(' ')}
        >
          {meta}
        </span>
      )}
      {cta && (
        <button
          type="button"
          onClick={onCta}
          disabled={ctaDisabled}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[10px] font-bold border border-[rgba(232,197,71,0.55)] shrink-0 hover:-translate-y-px transition disabled:opacity-60 disabled:pointer-events-none"
        >
          {ctaDisabled ? <Loader2 size={10} className="animate-spin" /> : <>{cta.label} <ChevronRight size={10} strokeWidth={2.6} /></>}
        </button>
      )}
      {copyable && (
        <button
          type="button"
          onClick={() => onCopy?.(copyKey || label, value)}
          aria-label={`Copy ${label}`}
          className={[
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-[10px] text-[10.5px] font-bold transition shrink-0',
            isCopied
              ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
              : 'bg-[var(--c-surface)] border border-[var(--c-border)] text-brand-accent hover:border-[var(--c-accent-border)]',
          ].join(' ')}
        >
          {isCopied ? <><Check size={11} strokeWidth={2.8} /> Copied</> : <><Copy size={11} /> Copy</>}
        </button>
      )}
    </div>
  )
}
