import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, Mail, Phone, MessageSquare, Sparkles, Clock,
  Send, CheckCircle2, ArrowUpRight, ShieldCheck, MapPin, Globe,
  HelpCircle, ChevronRight, AlertTriangle, Info,
} from 'lucide-react'

const CHANNELS = [
  { id: 'chat',     label: 'Live chat', sub: 'Average wait · 2 min',  icon: MessageCircle, featured: true,  meta: 'Online now', metaTone: 'success' },
  { id: 'email',    label: 'Email',     sub: 'support@veloxzap.com',  icon: Mail,                              meta: 'Replies in <2h' },
  { id: 'phone',    label: 'Call us',   sub: '+234 800 VELOX (83569)', icon: Phone,                            meta: '24/7' },
  { id: 'whatsapp', label: 'WhatsApp',  sub: '+234 901 234 5678',     icon: MessageSquare,                     meta: 'Tap to chat' },
]

const SUBJECTS = [
  'General inquiry',
  'Transaction issue',
  'Account & verification',
  'Card or payment',
  'Security concern',
  'Feedback',
]

const FAQS = [
  { q: 'How do I verify my account?', a: 'Head to Profile → Verification and follow the BVN + ID upload prompts.' },
  { q: 'My deposit hasn\'t arrived.',  a: 'Bank transfers reflect in <30 seconds. Crypto needs 1–3 confirmations.' },
  { q: 'How do I freeze my card?',     a: 'Open the card in Virtual cards and tap Freeze. Unfreeze any time.' },
  { q: 'Can I change my phone number?', a: 'Yes — Profile → Personal info → Phone. We\'ll send an OTP to confirm.' },
]

const STATUS_NOTES = [
  { id: 's1', label: 'Bank deposits', state: 'operational', desc: 'All Nigerian banks reflecting in <30s' },
  { id: 's2', label: 'Crypto deposits', state: 'operational', desc: 'BTC and USDT processing normally' },
  { id: 's3', label: 'Cards & spending', state: 'operational', desc: 'Naira and dollar cards working' },
]

export default function DesktopContact() {
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const charCount = message.length
  const maxChars = 600

  function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim() || submitting) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSent(true)
      setMessage('')
      setTimeout(() => setSent(false), 2400)
    }, 900)
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
            <Sparkles size={10} /> We're here to help
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Contact support
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Pick a channel or drop us a message. Our average response time is under 2 minutes.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-success-bg)] border border-[var(--c-success)] text-[10px] font-bold uppercase tracking-[0.9px] text-[var(--c-success)]">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--c-success)] animate-ping opacity-60" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--c-success)]" />
          </span>
          All systems online
        </span>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px] mb-3">
              Choose a channel
            </h2>
            <div className="grid grid-cols-1 min-[640px]:grid-cols-2 gap-2">
              {CHANNELS.map(({ id, label, sub, icon: Icon, featured, meta, metaTone }) => (
                <button
                  key={id}
                  type="button"
                  className={[
                    'group relative overflow-hidden flex items-start gap-3 p-3 rounded-xl text-left transition active:scale-[0.99]',
                    featured
                      ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border-strong)] hover:shadow-[0_8px_22px_-8px_rgba(201,162,39,0.4)]'
                      : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                  ].join(' ')}
                >
                  <span aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand-accent/[0.10] blur-2xl group-hover:bg-brand-accent/[0.22] transition" />
                  <span
                    className={[
                      'relative inline-flex items-center justify-center w-10 h-10 rounded-xl border shrink-0 transition',
                      featured
                        ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.3)]'
                        : 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border-[var(--c-accent-border)]',
                    ].join(' ')}
                  >
                    <Icon size={16} strokeWidth={2.2} />
                  </span>
                  <div className="relative flex-1 min-w-0 leading-tight">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                        {label}
                      </p>
                      {meta && (
                        <span
                          className={[
                            'inline-flex items-center px-1.5 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-[0.8px] shrink-0',
                            metaTone === 'success'
                              ? 'bg-[var(--c-success-bg)] text-[var(--c-success)]'
                              : 'bg-[var(--c-surface)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)]',
                          ].join(' ')}
                        >
                          {meta}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--c-text-muted)] m-0">
                      {sub}
                    </p>
                  </div>
                  <ArrowUpRight size={13} className="relative text-[var(--c-text-faint)] group-hover:text-brand-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition shrink-0" />
                </button>
              ))}
            </div>
          </article>

          <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                Send us a message
              </h2>
              <span className="text-[10px] text-[var(--c-text-muted)]">
                Replies in &lt;2 hours
              </span>
            </div>

            <div>
              <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
                Subject
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUBJECTS.map(s => {
                  const active = subject === s
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSubject(s)}
                      className={[
                        'inline-flex items-center px-2.5 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1px] transition',
                        active
                          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.28)]'
                          : 'bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:border-[var(--c-accent-border)] hover:text-[var(--c-text)]',
                      ].join(' ')}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">
                  Message
                </p>
                <span className={[
                  'text-[9.5px] tabular-nums',
                  charCount > maxChars * 0.9 ? 'text-[var(--c-warn)]' : 'text-[var(--c-text-muted)]',
                ].join(' ')}>
                  {charCount}/{maxChars}
                </span>
              </div>
              <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition overflow-hidden">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value.slice(0, maxChars))}
                  rows={6}
                  placeholder="Tell us what's going on. The more detail the better — include transaction IDs, screenshots tags or steps to reproduce."
                  className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none p-3 text-[12.5px] font-medium text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] resize-y min-h-[120px]"
                  style={{ boxShadow: 'none' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="inline-flex items-center gap-1 text-[10.5px] text-[var(--c-text-muted)] m-0">
                <ShieldCheck size={11} className="text-brand-accent" />
                Encrypted in transit · we never share details with third parties.
              </p>
              <button
                type="submit"
                disabled={!message.trim() || submitting}
                className={[
                  'relative overflow-hidden inline-flex items-center justify-center gap-1.5 min-w-[140px] h-10 px-4 rounded-xl text-[12px] font-bold tracking-[0.2px] transition',
                  !submitting && message.trim()
                    ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_6px_18px_-6px_rgba(201,162,39,0.5)] hover:-translate-y-px'
                    : sent
                      ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
                      : 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)] cursor-not-allowed',
                ].join(' ')}
              >
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} strokeWidth={2.6} /> Sent — check your email
                    </motion.span>
                  ) : submitting ? (
                    <motion.span
                      key="sending"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                        className="inline-flex w-3 h-3 rounded-full border-2 border-[var(--c-text-muted)] border-t-transparent"
                      />
                      Sending…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <Send size={13} strokeWidth={2.6} /> Send message
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-[var(--c-border)]">
              <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)]">
                <Globe size={11} className="text-brand-accent" /> Service status
              </h3>
              <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-[0.9px] text-[var(--c-success)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-success)]" />
                Live
              </span>
            </header>
            <ul className="list-none m-0 p-0">
              {STATUS_NOTES.map((s, i) => (
                <li key={s.id} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                  <div className="flex items-center gap-2.5 px-4 py-2.5">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-success-bg)] text-[var(--c-success)] shrink-0">
                      <CheckCircle2 size={12} strokeWidth={2.4} />
                    </span>
                    <div className="flex-1 min-w-0 leading-tight">
                      <p className="text-[11.5px] font-semibold text-[var(--c-text)] m-0 truncate">
                        {s.label}
                      </p>
                      <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5 truncate">
                        {s.desc}
                      </p>
                    </div>
                    <span className="text-[9.5px] uppercase tracking-[0.9px] font-bold text-[var(--c-success)] shrink-0">
                      Operational
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-[var(--c-border)]">
              <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)]">
                <HelpCircle size={11} className="text-brand-accent" /> Quick answers
              </h3>
              <button type="button" className="text-[10.5px] font-semibold text-brand-accent hover:underline">
                Browse all
              </button>
            </header>
            <ul className="list-none m-0 p-0">
              {FAQS.map((f, i) => (
                <li key={f.q} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                  <details className="group">
                    <summary className="flex items-start justify-between gap-2 px-4 py-2.5 cursor-pointer hover:bg-[var(--c-surface-soft)] transition list-none">
                      <p className="text-[11px] font-semibold text-[var(--c-text)] m-0 leading-snug">
                        {f.q}
                      </p>
                      <ChevronRight size={11} className="text-[var(--c-text-faint)] shrink-0 mt-0.5 group-open:rotate-90 transition" />
                    </summary>
                    <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 px-4 pb-2.5 leading-snug">
                      {f.a}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)] mb-2">
              <Clock size={11} className="text-brand-accent" /> Office & hours
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
              <li className="grid grid-cols-[auto_1fr] items-start gap-2.5">
                <Clock size={11} className="text-brand-accent mt-0.5" />
                <div className="leading-snug">
                  <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">
                    Live chat & WhatsApp
                  </p>
                  <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                    24/7 · 365 days a year
                  </p>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] items-start gap-2.5">
                <Phone size={11} className="text-brand-accent mt-0.5" />
                <div className="leading-snug">
                  <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">
                    Phone support
                  </p>
                  <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                    Mon–Sun · 7:00 AM – 11:00 PM WAT
                  </p>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] items-start gap-2.5">
                <MapPin size={11} className="text-brand-accent mt-0.5" />
                <div className="leading-snug">
                  <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">
                    Lagos HQ
                  </p>
                  <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                    14b Admiralty Way, Lekki Phase 1
                  </p>
                </div>
              </li>
            </ul>
          </article>

          <article className="rounded-xl border border-[var(--c-danger-border)] bg-[var(--c-danger-soft)] p-3 flex items-start gap-2.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--c-danger-soft)] border border-[var(--c-danger-border)] text-[var(--c-danger)] shrink-0">
              <AlertTriangle size={13} />
            </span>
            <div className="leading-snug">
              <p className="text-[11px] font-bold text-[var(--c-danger)] m-0">
                Suspect fraud or unauthorized access?
              </p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Call <span className="text-[var(--c-text)] font-semibold">+234 800 VELOX</span> — we'll lock your account on the line.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
