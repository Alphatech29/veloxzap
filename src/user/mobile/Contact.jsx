import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, MessageCircle, Mail, Phone, MessageSquare,
  Sparkles, Clock, Send, CheckCircle2, ArrowUpRight,
} from 'lucide-react'

const CHANNELS = [
  { id: 'chat',     label: 'Live chat', sub: 'Average · 2 min',     icon: MessageCircle, featured: true },
  { id: 'email',    label: 'Email',     sub: 'support@veloxzap.com', icon: Mail },
  { id: 'phone',    label: 'Call us',   sub: '+234 800 VELOX',       icon: Phone },
  { id: 'whatsapp', label: 'WhatsApp',  sub: '+234 901 234 5678',    icon: MessageSquare },
]

const SUBJECTS = [
  'General inquiry',
  'Transaction issue',
  'Account & verification',
  'Card or payment',
  'Security concern',
  'Feedback',
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
  const navigate = useNavigate()
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim() || submitting) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSent(true)
      setMessage('')
      setTimeout(() => setSent(false), 2400)
    }, 800)
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition self-start -mt-1"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <div>
        <p className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
          <Sparkles size={11} /> We're here to help
        </p>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
          Contact us
        </h1>
        <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 leading-snug">
          Pick a channel below or send us a quick message. We respond fast.
        </p>
      </div>

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

      <section>
        <h3 className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
          Or send a message
        </h3>
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-3 flex flex-col gap-3"
        >
          <div>
            <label className="block text-[10px] uppercase tracking-[1.1px] font-semibold text-[var(--c-text-muted)] mb-1.5 px-0.5">
              Subject
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SUBJECTS.map(s => {
                const active = subject === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSubject(s)}
                    className={[
                      'inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-semibold tracking-[0.1px] active:scale-95 transition',
                      active
                        ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.28)]'
                        : 'bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:border-[var(--c-accent-border)]',
                    ].join(' ')}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label htmlFor="contact-msg" className="block text-[10px] uppercase tracking-[1.1px] font-semibold text-[var(--c-text-muted)] mb-1.5 px-0.5">
              Message
            </label>
            <textarea
              id="contact-msg"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              placeholder="Tell us what's going on..."
              className="w-full resize-none rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] focus:border-[var(--c-accent-border)] focus:outline-none text-[13px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] p-3 leading-snug transition"
            />
            <p className="text-[10px] text-[var(--c-text-faint)] mt-1 px-0.5">
              {message.length}/500 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={!message.trim() || submitting || sent}
            className={[
              'inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-[13px] font-bold tracking-[-0.1px] transition',
              sent
                ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
                : 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_6px_18px_rgba(201,162,39,0.32)] active:scale-[0.98]',
              (!message.trim() || submitting) && !sent ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.span
                  key="sent"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} strokeWidth={2.4} /> Message sent
                </motion.span>
              ) : submitting ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-1.5"
                >
                  <span className="inline-flex w-3.5 h-3.5 rounded-full border-[2px] border-brand-primary/30 border-t-brand-primary animate-spin" />
                  Sending...
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="inline-flex items-center gap-1.5"
                >
                  <Send size={14} strokeWidth={2.4} /> Send message
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </form>
      </section>

      <p className="text-center text-[11px] text-[var(--c-text-muted)] mt-1 mb-2 leading-snug">
        Looking for quick answers?{' '}
        <span className="text-brand-accent font-semibold">Browse the help center →</span>
      </p>
    </div>
  )
}
