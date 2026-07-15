import { motion } from 'framer-motion'
import {
  MessageCircle, Mail, Phone, MessageSquare,
  Clock, ArrowUpRight,
} from 'lucide-react'
import MobilePageHeader from '../../components/partials/MobilePageHeader'

const CHANNELS = [
  { id: 'chat',     label: 'Live chat', sub: 'Average · 2 min',     icon: MessageCircle, featured: true },
  { id: 'email',    label: 'Email',     sub: 'support@veloxzap.com', icon: Mail },
  { id: 'phone',    label: 'Call us',   sub: '+234 800 VELOX',       icon: Phone },
  { id: 'whatsapp', label: 'WhatsApp',  sub: '+234 901 234 5678',    icon: MessageSquare },
]

const LIST = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const ITEM = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
}

export default function MobileContact() {
  return (
    <div className="flex flex-col gap-5">
      <MobilePageHeader title="Contact us" />
      <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 leading-snug">
        Pick a channel below or send us a quick message. We respond fast.
      </p>

      <article className="relative overflow-hidden p-3.5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)]">
        <span aria-hidden className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-[var(--c-success-bg)] blur-xl" />
        <div className="relative flex items-center gap-3">
          <span className="relative flex w-2.5 h-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--c-success)] animate-ping opacity-60" />
            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-[var(--c-success)]" />
          </span>
          <div className="flex-1 min-w-0 leading-tight">
            <p className="text-[13px] font-bold text-[var(--c-text)] m-0">
              Online now · all channels
            </p>
            <p className="inline-flex items-center gap-1 text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">
              <Clock size={10} /> 24/7 priority support · avg. 2 min reply
            </p>
          </div>
        </div>
      </article>

      <section>
        <h3 className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
          Reach us
        </h3>
        <motion.div
          variants={LIST}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-2"
        >
          {CHANNELS.map(({ id, label, sub, icon: Icon, featured }) => (
            <motion.button
              key={id}
              type="button"
              variants={ITEM}
              className={[
                'group relative overflow-hidden flex flex-col gap-2 p-3.5 rounded-2xl text-left active:scale-[0.98] transition',
                featured
                  ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] hover:border-[var(--c-accent-border-strong)]'
                  : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
              ].join(' ')}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-6 -right-6 w-16 h-16 rounded-full bg-brand-accent/[0.08] blur-2xl group-active:bg-brand-accent/[0.2] transition duration-300"
              />
              <div className="relative flex items-start justify-between">
                <span
                  className={[
                    'inline-flex items-center justify-center w-10 h-10 rounded-2xl border transition',
                    featured
                      ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.32)]'
                      : 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border-[var(--c-accent-border)]',
                  ].join(' ')}
                >
                  <Icon size={17} strokeWidth={2} />
                </span>
                <ArrowUpRight
                  size={14}
                  className="text-[var(--c-text-faint)] group-hover:text-brand-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition"
                />
              </div>
              <div className="relative">
                <p className="text-[13px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                  {label}
                </p>
                <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5 truncate">
                  {sub}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </section>

      <p className="text-center text-[11px] text-[var(--c-text-muted)] mt-1 mb-2 leading-snug">
        Looking for quick answers?{' '}
        <span className="text-brand-accent font-semibold">Browse the help center →</span>
      </p>
    </div>
  )
}
