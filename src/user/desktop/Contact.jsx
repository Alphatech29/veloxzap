import { useState } from 'react'
import {
  MessageCircle, Mail, Phone, MessageSquare, Sparkles, Clock,
  ArrowUpRight, MapPin, Globe, HelpCircle, ChevronRight, AlertTriangle, CheckCircle2,
  Zap,
} from 'lucide-react'

const CHANNELS = [
  {
    id: 'chat',
    label: 'Live chat',
    sub: 'Connect with a support agent instantly.',
    icon: MessageCircle,
    featured: true,
    meta: 'Online now',
    metaTone: 'success',
    badge: '~2 min wait',
  },
  {
    id: 'email',
    label: 'Email',
    sub: 'support@veloxzap.com',
    icon: Mail,
    meta: 'Replies in <2h',
    badge: '<2 h reply',
  },
  {
    id: 'phone',
    label: 'Call us',
    sub: '+234 800 VELOX (83569)',
    icon: Phone,
    meta: '24/7',
    badge: '24/7 line',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    sub: '+234 901 234 5678',
    icon: MessageSquare,
    meta: 'Tap to chat',
    badge: '~5 min reply',
  },
]

const FAQS = [
  {
    q: 'How do I verify my account?',
    a: 'Head to Profile → Verification and follow the BVN + ID upload prompts. Most verifications complete in under 3 minutes.',
  },
  {
    q: "My deposit hasn't arrived.",
    a: 'Bank transfers reflect in under 30 seconds on most networks. Crypto deposits need 1–3 on-chain confirmations. If it has been more than 10 minutes, tap "Report an issue" and paste your transaction hash.',
  },
  {
    q: 'How do I freeze or unfreeze my card?',
    a: 'Open the card in Virtual cards, tap the ··· menu, then Freeze. The card is suspended immediately and can be unfrozen any time from the same screen.',
  },
  {
    q: 'Can I change my phone number?',
    a: "Yes — go to Profile → Personal info → Phone. We'll send an OTP to both the old and new number to confirm the change.",
  },
  {
    q: 'How long do withdrawals take?',
    a: 'Instant for all Nigerian banks via NIP. Dollar withdrawals to a dom account or international wire settle in 1–2 business days.',
  },
  {
    q: 'What happens if I enter the wrong PIN?',
    a: 'After 5 failed attempts your account is locked for 30 minutes. Use "Forgot PIN" to reset it via your registered email.',
  },
]

const STATUS_NOTES = [
  { id: 's1', label: 'Bank deposits',    desc: 'All Nigerian banks reflecting in <30s' },
  { id: 's2', label: 'Crypto deposits',  desc: 'BTC and USDT processing normally' },
  { id: 's3', label: 'Cards & spending', desc: 'Naira and dollar cards working' },
]

export default function DesktopContact() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="flex flex-col gap-6 max-w-[1240px] mx-auto pb-8">

      {/* ── Header ── */}
      <header className="flex items-start justify-between gap-4 flex-wrap pt-1">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
            <Sparkles size={10} /> We're here to help
          </p>
          <h1 className="text-[22px] font-bold tracking-[-0.5px] text-[var(--c-text)] m-0 mt-1">
            Contact support
          </h1>
          <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1 max-w-[480px] leading-relaxed">
            Pick a channel below or browse the FAQs. Most issues are resolved in under 2 minutes.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-success-bg)] border border-[var(--c-success)] text-[10px] font-bold uppercase tracking-[0.9px] text-[var(--c-success)]">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--c-success)] animate-ping opacity-60" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--c-success)]" />
            </span>
            All systems online
          </span>
          <p className="text-[10px] text-[var(--c-text-faint)] m-0">Last checked just now</p>
        </div>
      </header>

      {/* ── Channels ── */}
      <section>
        <p className="text-[9.5px] uppercase tracking-[1.2px] font-bold text-[var(--c-text-muted)] m-0 mb-2.5">
          Get in touch
        </p>
        <div className="grid grid-cols-1 min-[580px]:grid-cols-2 min-[1040px]:grid-cols-4 gap-3">
          {CHANNELS.map(({ id, label, sub, icon: Icon, featured, meta, metaTone, badge }) => (
            <button
              key={id}
              type="button"
              className={[
                'group relative overflow-hidden flex flex-col gap-3 p-4 rounded-xl text-left transition active:scale-[0.99]',
                featured
                  ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border-strong)] hover:shadow-[0_10px_28px_-8px_rgba(201,162,39,0.35)]'
                  : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.12)]',
              ].join(' ')}
            >
              <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-brand-accent/[0.08] blur-2xl group-hover:bg-brand-accent/[0.18] transition" />

              <div className="relative flex items-center justify-between">
                <span
                  className={[
                    'inline-flex items-center justify-center w-10 h-10 rounded-xl border transition',
                    featured
                      ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)] shadow-[0_4px_12px_rgba(201,162,39,0.35)]'
                      : 'bg-[var(--c-surface-soft)] text-brand-accent border-[var(--c-border)]',
                  ].join(' ')}
                >
                  <Icon size={17} strokeWidth={2} />
                </span>
                {meta && (
                  <span
                    className={[
                      'inline-flex items-center px-1.5 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-[0.7px]',
                      metaTone === 'success'
                        ? 'bg-[var(--c-success-bg)] text-[var(--c-success)]'
                        : 'bg-[var(--c-surface)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)]',
                    ].join(' ')}
                  >
                    {meta}
                  </span>
                )}
              </div>

              <div className="relative flex-1 leading-tight">
                <p className="text-[13px] font-bold m-0 text-[var(--c-text)] tracking-[-0.15px]">
                  {label}
                </p>
                <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">
                  {sub}
                </p>
              </div>

              <div className="relative flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--c-text-muted)]">
                  <Zap size={9} className="text-brand-accent" />
                  {badge}
                </span>
                <ArrowUpRight
                  size={13}
                  className="text-[var(--c-text-faint)] group-hover:text-brand-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition"
                />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Main two-col ── */}
      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.5fr_1fr] gap-4 items-start">

        {/* FAQs */}
        <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
          <header className="flex items-center justify-between gap-2 px-5 py-3.5 border-b border-[var(--c-border)]">
            <h2 className="inline-flex items-center gap-1.5 text-[12.5px] font-bold m-0 text-[var(--c-text)]">
              <HelpCircle size={12} className="text-brand-accent" /> Frequently asked questions
            </h2>
            <span className="text-[10px] text-[var(--c-text-faint)]">{FAQS.length} topics</span>
          </header>
          <ul className="list-none m-0 p-0">
            {FAQS.map((f, i) => {
              const open = openFaq === i
              return (
                <li key={f.q} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-start justify-between gap-3 px-5 py-3.5 text-left hover:bg-[var(--c-surface-soft)] transition"
                  >
                    <p className="text-[12px] font-semibold text-[var(--c-text)] m-0 leading-snug">
                      {f.q}
                    </p>
                    <ChevronRight
                      size={12}
                      className={[
                        'text-[var(--c-text-faint)] shrink-0 mt-0.5 transition-transform',
                        open ? 'rotate-90' : '',
                      ].join(' ')}
                    />
                  </button>
                  {open && (
                    <p className="text-[11.5px] text-[var(--c-text-muted)] m-0 px-5 pb-4 leading-relaxed border-t border-[var(--c-border-soft)]">
                      {f.a}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        </article>

        {/* Sidebar */}
        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">

          {/* Service status */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)]">
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
                  <div className="flex items-center gap-3 px-4 py-3">
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
                    <span className="text-[9.5px] uppercase tracking-[0.8px] font-bold text-[var(--c-success)] shrink-0">
                      Operational
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          {/* Office hours */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)] mb-3">
              <Clock size={11} className="text-brand-accent" /> Office & hours
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              <li className="grid grid-cols-[auto_1fr] items-start gap-2.5">
                <Clock size={11} className="text-brand-accent mt-0.5" />
                <div className="leading-snug">
                  <p className="text-[11.5px] font-semibold text-[var(--c-text)] m-0">Live chat & WhatsApp</p>
                  <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">24/7 · 365 days a year</p>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] items-start gap-2.5">
                <Phone size={11} className="text-brand-accent mt-0.5" />
                <div className="leading-snug">
                  <p className="text-[11.5px] font-semibold text-[var(--c-text)] m-0">Phone support</p>
                  <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">Mon–Sun · 7:00 AM – 11:00 PM WAT</p>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] items-start gap-2.5">
                <MapPin size={11} className="text-brand-accent mt-0.5" />
                <div className="leading-snug">
                  <p className="text-[11.5px] font-semibold text-[var(--c-text)] m-0">Lagos HQ</p>
                  <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">14b Admiralty Way, Lekki Phase 1</p>
                </div>
              </li>
            </ul>
          </article>

          {/* Fraud alert */}
          <article className="rounded-xl border border-[var(--c-danger-border)] bg-[var(--c-danger-soft)] p-4 flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--c-danger-soft)] border border-[var(--c-danger-border)] text-[var(--c-danger)] shrink-0">
              <AlertTriangle size={14} />
            </span>
            <div className="leading-snug">
              <p className="text-[11.5px] font-bold text-[var(--c-danger)] m-0">
                Suspect fraud or unauthorized access?
              </p>
              <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-1 leading-relaxed">
                Call <span className="text-[var(--c-text)] font-semibold">+234 800 VELOX</span> immediately — we'll lock your account on the line, no questions asked.
              </p>
            </div>
          </article>

        </div>
      </section>
    </div>
  )
}
