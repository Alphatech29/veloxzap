import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronLeft, Camera, BadgeCheck, Star, Copy, Pencil,
  User, Mail, Phone, Calendar, ShieldCheck, MapPin, Wallet, IdCard, Globe,
  AlertTriangle,
} from 'lucide-react'
import useUser from '../../hooks/useUser'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const PROFILE_BG = `radial-gradient(540px 240px at 110% -10%, rgba(201, 162, 39, 0.32), transparent 60%), radial-gradient(360px 180px at -10% 110%, rgba(232, 197, 71, 0.16), transparent 60%), linear-gradient(135deg, rgba(20, 42, 92, 0.95), rgba(10, 31, 68, 1))`

const LIST = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const ITEM = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
}

function getInitials(user) {
  const source = user?.full_name || user?.email || '?'
  return source.split(/\s+|@/)[0].slice(0, 2).toUpperCase()
}

function resolveAvatarUrl(value) {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  return `${API_BASE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

function formatMemberSince(value) {
  if (!value) return null
  const d = new Date(value)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function MobileProfile() {
  const { user } = useUser()
  const navigate = useNavigate()
  const initials = getInitials(user)
  const avatarUrl = resolveAvatarUrl(user?.avatar)

  const personalInfo = [
    { icon: User,     label: 'Full name',     value: user?.full_name || 'Add name',          editable: true },
    { icon: Mail,     label: 'Email',         value: user?.email || '—',                     meta: 'Verified', metaTone: 'success' },
    { icon: Phone,    label: 'Phone',         value: user?.phone_number || 'Add phone number',      editable: true },
    { icon: Globe,    label: 'Country',       value: user?.country || 'Add country',            editable: true },
    { icon: Calendar, label: 'Date of birth', value: user?.dob || 'Add date of birth',       editable: true },
  ]

  const verification = [
    { icon: ShieldCheck, label: 'KYC tier', value: 'Tier 2 · ₦5M daily',  meta: 'Upgrade', metaTone: 'accent' },
    { icon: IdCard,      label: 'BVN',      value: user?.bvn || '••• 4521',             meta: 'Verified', metaTone: 'success' },
    { icon: MapPin,      label: 'Address',  value: user?.address || 'Lagos, Nigeria',       editable: true },
  ]

  const accountInfo = [
    { icon: Wallet,   label: 'Wallet ID',    value: user?.uid || 'VLX-8X9P-2047-MQTR', copyable: true },
    { icon: Calendar, label: 'Member since', value: formatMemberSince(user?.created_at) || '—' },
  ]

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--c-text-muted)] active:scale-95 transition self-start -mt-1 hover:text-brand-accent"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden p-5 pb-6 rounded-[22px] border border-[rgba(201,162,39,0.32)] text-text shadow-[0_18px_44px_-14px_rgba(2,7,23,0.55)] flex flex-col items-center text-center"
        style={{ background: PROFILE_BG }}
      >
        <span aria-hidden className="absolute -top-12 -right-12 w-[180px] h-[180px] rounded-full bg-brand-accent/15 blur-3xl pointer-events-none" />
        <span aria-hidden className="absolute -bottom-12 -left-10 w-[140px] h-[140px] rounded-full bg-brand-gold-soft/10 blur-3xl pointer-events-none" />

        <div className="relative inline-flex shrink-0">
          <span aria-hidden className="absolute -inset-2 rounded-full bg-gradient-to-br from-brand-accent/45 to-brand-gold-soft/45 blur-md" />
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="relative w-[84px] h-[84px] rounded-full object-cover border-[3px] border-[rgba(232,197,71,0.6)] shadow-[0_10px_24px_rgba(201,162,39,0.4)]"
            />
          ) : (
            <span className="relative inline-flex items-center justify-center w-[84px] h-[84px] rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary font-bold text-[26px] tracking-[0.5px] border-[3px] border-[rgba(232,197,71,0.6)] shadow-[0_10px_24px_rgba(201,162,39,0.4)]">
              {initials}
            </span>
          )}
          <button
            type="button"
            aria-label="Change photo"
            className="absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-menu-bg)] border-[2px] border-[rgba(201,162,39,0.6)] text-brand-accent active:scale-95 transition shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
          >
            <Camera size={12} />
          </button>
        </div>

        <h1 className="relative text-[18px] font-bold tracking-[-0.3px] text-text m-0 mt-3 truncate max-w-full">
          {user?.full_name || 'VeloxZap member'}
        </h1>
        <p className="relative text-[12px] text-white/65 m-0 mt-1 truncate max-w-full">
          {user?.email || 'member@veloxzap.com'}
        </p>

        <div className="relative flex flex-wrap items-center justify-center gap-1.5 mt-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.1] border border-white/[0.16] text-[9.5px] font-bold uppercase tracking-[0.9px] text-white/85">
            <BadgeCheck size={10} className="text-[var(--c-success)]" /> Verified
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-accent/15 border border-[rgba(201,162,39,0.4)] text-[9.5px] font-bold uppercase tracking-[0.9px] text-brand-accent">
            <Star size={9} strokeWidth={2.6} /> Tier 2
          </span>
        </div>
      </motion.article>

      <Section title="Personal info" items={personalInfo} />
      <Section title="Verification" items={verification} />
      <Section title="Account" items={accountInfo} />

      <p className="text-center text-[10px] text-[var(--c-text-faint)] mt-1 mb-2 tracking-[0.6px]">
        Need help? Contact support
      </p>
    </div>
  )
}

function Section({ title, items }) {
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
        {items.map((item, i) => (
          <motion.li
            key={item.label}
            variants={ITEM}
            className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}
          >
            <InfoRow {...item} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}

function InfoRow({ icon: Icon, label, value, meta, metaTone, editable, copyable }) {
  return (
    <div className="flex items-center gap-3 p-3">
      <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent shrink-0">
        <Icon size={15} />
      </span>
      <div className="flex-1 min-w-0 leading-tight">
        <p className="text-[9.5px] uppercase tracking-[1px] font-semibold text-[var(--c-text-muted)] m-0">
          {label}
        </p>
        <p className="text-[13px] font-semibold text-[var(--c-text)] m-0 mt-0.5 truncate">
          {value}
        </p>
      </div>
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
      {copyable && (
        <button
          type="button"
          aria-label={`Copy ${label}`}
          className="inline-flex items-center justify-center w-8 h-8 rounded-[10px] bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition shrink-0"
        >
          <Copy size={12} />
        </button>
      )}
      {editable && !copyable && (
        <button
          type="button"
          aria-label={`Edit ${label}`}
          className="inline-flex items-center justify-center w-8 h-8 rounded-[10px] text-[var(--c-text-faint)] hover:text-brand-accent active:scale-95 transition shrink-0"
        >
          <Pencil size={12} />
        </button>
      )}
    </div>
  )
}
