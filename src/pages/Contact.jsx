import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Sparkles, Mail, Phone, MessageCircle, MessageSquare,
  MapPin, Clock, Send, ChevronDown, CheckCircle2, Headphones,
  Building2, ShieldCheck, HelpCircle, LifeBuoy,
} from 'lucide-react'
import { colors, tint, gradientText } from '../components/landing/theme'

const goldGrad = `linear-gradient(135deg, ${colors.gold}, ${colors.champagne})`

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={props.size || 16} height={props.size || 16} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={props.size || 16} height={props.size || 16} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={props.size || 16} height={props.size || 16} aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const SECTION = { position: 'relative', zIndex: 2, padding: '90px 24px' }
const WRAP    = { maxWidth: 1240, margin: '0 auto' }

const PILL = (gold = false) => ({
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '6px 14px', borderRadius: 99,
  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
  fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: gold ? colors.gold : colors.textMuted,
  background: gold ? tint(colors.gold, 10) : tint(colors.text, 5),
  border: `1px solid ${gold ? tint(colors.gold, 28) : tint(colors.text, 10)}`,
})

const CHANNELS = [
  {
    icon: MessageCircle,
    label: 'Live chat',
    value: 'Tap the bubble in-app',
    eta: 'Avg. 90s response',
    sub: '24 / 7',
  },
  {
    icon: Mail,
    label: 'Email us',
    value: 'hello@veloxzap.com',
    eta: 'Reply within 4 hours',
    sub: 'Mon–Sun',
    href: 'mailto:hello@veloxzap.com',
  },
  {
    icon: Phone,
    label: 'Call us',
    value: '+234 (0) 1 700 9000',
    eta: 'Lagos time, 9am–9pm',
    sub: 'Toll free',
    href: 'tel:+23417009000',
  },
  {
    icon: MessageSquare,
    label: 'WhatsApp',
    value: '+234 802 555 9000',
    eta: 'Reply within 10 min',
    sub: 'Verified business',
    href: 'https://wa.me/2348025559000',
  },
]

const TOPICS = [
  'General enquiry',
  'Account & billing support',
  'Sales / partnerships',
  'Press & media',
  'Report a bug',
  'Careers',
]

const FAQS = [
  {
    q: 'How quickly will someone get back to me?',
    a: 'Live chat replies in under 90 seconds. Email is answered within 4 hours during weekdays and within a day on weekends. Anything urgent — use chat or WhatsApp.',
  },
  {
    q: 'I’m locked out of my account. What do I do?',
    a: 'Use the password reset flow on the login screen first. If that fails or your number changed, message support from a previously verified email and we’ll walk you through identity recovery.',
  },
  {
    q: 'Where are you physically based?',
    a: 'Headquarters in Victoria Island, Lagos with a satellite team in Abuja. We’re happy to host investors, partners, and journalists by appointment — book a slot below.',
  },
  {
    q: 'Do you offer phone support in local languages?',
    a: 'Yes. Our voice team supports English, Yoruba, Igbo, Hausa, and Pidgin. Live chat additionally supports French for our West-African corridor.',
  },
  {
    q: 'How do I report a security issue or vulnerability?',
    a: 'Email security@veloxzap.com directly. We have a structured bug-bounty programme and respond to confirmed reports with bounty offers within 48 hours.',
  },
  {
    q: 'Can I partner with VeloxZap or pitch a product idea?',
    a: 'Absolutely. Pick "Sales / partnerships" in the form below — partnerships read every submission and reply within two business days.',
  },
]

const OFFICES = [
  {
    city: 'Lagos',
    role: 'Headquarters',
    address: 'Plot 14, Adeola Odeku Street, Victoria Island, Lagos 101241',
    hours: 'Mon–Fri · 9:00am – 6:00pm WAT',
    accent: colors.gold,
  },
  {
    city: 'Abuja',
    role: 'Satellite office',
    address: '3rd Floor, Bukar Dipcharima House, Central Business District, Abuja 900103',
    hours: 'Mon–Fri · 10:00am – 5:00pm WAT',
    accent: colors.champagne,
  },
]

const SOCIAL = [
  { icon: TwitterIcon,   label: 'X / Twitter', href: 'https://x.com/veloxzap' },
  { icon: LinkedinIcon,  label: 'LinkedIn',    href: 'https://linkedin.com/company/veloxzap' },
  { icon: InstagramIcon, label: 'Instagram',   href: 'https://instagram.com/veloxzap' },
]

function FaqItem({ item, open, onToggle }) {
  return (
    <div
      style={{
        borderRadius: 14,
        background: tint(colors.navyMid, 50),
        border: `1px solid ${open ? tint(colors.gold, 28) : tint(colors.gold, 12)}`,
        transition: 'border-color 0.2s',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          all: 'unset',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
          width: '100%',
          padding: '18px 22px',
          cursor: 'pointer',
          color: colors.text,
        }}
      >
        <span
          className="f-head"
          style={{
            fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.005em', lineHeight: 1.4,
          }}
        >
          {item.q}
        </span>
        <span
          aria-hidden
          style={{
            display: 'grid', placeItems: 'center',
            width: 30, height: 30, borderRadius: 9,
            background: open ? tint(colors.gold, 18) : tint(colors.text, 6),
            border: `1px solid ${open ? tint(colors.gold, 32) : tint(colors.text, 10)}`,
            color: open ? colors.gold : colors.textMuted,
            transition: 'transform 0.25s, background 0.2s, border-color 0.2s, color 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        >
          <ChevronDown size={16} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p
              style={{
                margin: 0,
                padding: '0 22px 20px',
                fontSize: 14.5,
                lineHeight: 1.7,
                color: colors.textMuted,
              }}
            >
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', topic: TOPICS[0], message: '',
  })
  const [status, setStatus] = useState('idle')
  const [openFaq, setOpenFaq] = useState(0)

  const change = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 900)
  }

  const inputBase = {
    width: '100%',
    padding: '13px 14px',
    borderRadius: 12,
    border: `1px solid ${tint(colors.gold, 14)}`,
    background: tint(colors.navy, 60),
    color: colors.text,
    fontSize: 14.5,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
    boxSizing: 'border-box',
  }
  const focusOn = (e) => {
    e.currentTarget.style.borderColor = tint(colors.gold, 50)
    e.currentTarget.style.boxShadow = `0 0 0 3px ${tint(colors.gold, 14)}`
    e.currentTarget.style.background = tint(colors.navy, 75)
  }
  const focusOff = (e) => {
    e.currentTarget.style.borderColor = tint(colors.gold, 14)
    e.currentTarget.style.boxShadow = 'none'
    e.currentTarget.style.background = tint(colors.navy, 60)
  }
  const labelStyle = {
    display: 'block',
    marginBottom: 7,
    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: colors.textMuted,
  }

  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        paddingTop: 104,
        background:
          `radial-gradient(ellipse 60% 40% at 80% 0%, ${tint(colors.gold, 10)}, transparent 60%),` +
          `radial-gradient(ellipse 60% 40% at 20% 100%, ${tint(colors.champagne, 8)}, transparent 65%),` +
          `linear-gradient(180deg, var(--color-primary-500) 0%, ${colors.navy} 50%, var(--color-primary-700) 100%)`,
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08,
          backgroundImage: `radial-gradient(${tint('white', 100)} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black, transparent 75%)',
        }}
      />


      <section style={{ ...SECTION, paddingTop: 60, paddingBottom: 70 }}>
        <div style={{ ...WRAP, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={PILL(true)}>
              <Sparkles size={11} /> Talk to us
            </span>
          </motion.div>

          <motion.h1
            className="f-head"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            style={{
              margin: '20px auto 18px',
              maxWidth: 920,
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: '-0.04em',
              color: colors.text,
            }}
          >
            Real humans.{' '}
            <span style={gradientText(`linear-gradient(110deg, ${colors.gold}, ${colors.champagne}, ${colors.gold})`)}>
              Real answers.
            </span>{' '}
            Always.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            style={{
              maxWidth: 640, margin: '0 auto',
              fontSize: 17, lineHeight: 1.7,
              color: colors.textMuted,
            }}
          >
            No chatbots scripted to deflect, no ticket queues that swallow your message. Pick a
            channel below and a teammate in Lagos will be with you in minutes.
          </motion.p>
        </div>
      </section>


      <section style={{ ...SECTION, paddingTop: 0, paddingBottom: 70 }}>
        <div style={WRAP}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'grid', gap: 14,
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            }}
          >
            {CHANNELS.map(({ icon: Icon, label, value, eta, sub, href }) => {
              const inner = (
                <>
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
                      background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 60)}, transparent)`,
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 11,
                        background: tint(colors.gold, 12),
                        border: `1px solid ${tint(colors.gold, 26)}`,
                        display: 'grid', placeItems: 'center',
                      }}
                    >
                      <Icon size={18} color={colors.gold} />
                    </div>
                    <span
                      className="f-mono"
                      style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
                        color: colors.gold, textTransform: 'uppercase',
                        padding: '4px 9px', borderRadius: 99,
                        background: tint(colors.gold, 10),
                        border: `1px solid ${tint(colors.gold, 22)}`,
                      }}
                    >
                      {sub}
                    </span>
                  </div>
                  <p
                    className="f-mono"
                    style={{
                      margin: '0 0 6px',
                      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em',
                      color: colors.textMuted, textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </p>
                  <p
                    className="f-head"
                    style={{
                      margin: '0 0 8px',
                      fontSize: 16, fontWeight: 700,
                      color: colors.text, letterSpacing: '-0.01em',
                      wordBreak: 'break-word',
                    }}
                  >
                    {value}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.5 }}>
                    {eta}
                  </p>
                </>
              )
              const sharedStyle = {
                position: 'relative',
                display: 'block',
                padding: '24px 22px',
                borderRadius: 18,
                background: `linear-gradient(180deg, ${tint(colors.navyMid, 60)}, ${tint(colors.navy, 70)})`,
                border: `1px solid ${tint(colors.gold, 14)}`,
                boxShadow: `0 12px 40px ${tint('black', 30)}, inset 0 1px 0 ${tint('white', 5)}`,
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
              }
              const hoverOn = (e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.borderColor = tint(colors.gold, 30)
                e.currentTarget.style.boxShadow = `0 18px 48px ${tint('black', 40)}, 0 0 32px ${tint(colors.gold, 12)}, inset 0 1px 0 ${tint('white', 6)}`
              }
              const hoverOff = (e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = tint(colors.gold, 14)
                e.currentTarget.style.boxShadow = `0 12px 40px ${tint('black', 30)}, inset 0 1px 0 ${tint('white', 5)}`
              }
              return href ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={sharedStyle}
                  onMouseEnter={hoverOn}
                  onMouseLeave={hoverOff}
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={label}
                  style={sharedStyle}
                  onMouseEnter={hoverOn}
                  onMouseLeave={hoverOff}
                >
                  {inner}
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>


      <section style={{ ...SECTION, paddingTop: 30 }}>
        <div style={WRAP}>
          <div
            style={{
              display: 'grid', gap: 24,
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              alignItems: 'start',
            }}
          >

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              style={{
                position: 'relative',
                padding: 'clamp(28px, 4vw, 42px)',
                borderRadius: 22,
                background: `linear-gradient(180deg, ${tint(colors.navyMid, 60)}, ${tint(colors.navy, 75)})`,
                border: `1px solid ${tint(colors.gold, 16)}`,
                boxShadow: `0 24px 60px ${tint('black', 45)}, inset 0 1px 0 ${tint('white', 5)}`,
                overflow: 'hidden',
              }}
            >
              <div
                aria-hidden
                style={{
                  position: 'absolute', top: -120, right: -120, width: 280, height: 280,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${tint(colors.gold, 14)} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />

              <div style={{ position: 'relative' }}>
                <span style={PILL()}>Send a message</span>
                <h2
                  className="f-head"
                  style={{
                    margin: '14px 0 10px',
                    fontSize: 'clamp(24px, 3.4vw, 32px)',
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.15,
                    color: colors.text,
                  }}
                >
                  Tell us what you need.
                </h2>
                <p style={{ margin: '0 0 26px', fontSize: 14.5, color: colors.textMuted, lineHeight: 1.7 }}>
                  We read every submission. Pick the right topic so it lands in the inbox of the
                  person who can actually help.
                </p>

                <AnimatePresence mode="wait" initial={false}>
                  {status === 'sent' ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        padding: '28px 24px',
                        borderRadius: 16,
                        background: `linear-gradient(135deg, ${tint(colors.gold, 14)}, ${tint(colors.champagne, 8)})`,
                        border: `1px solid ${tint(colors.gold, 32)}`,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 56, height: 56, borderRadius: '50%',
                          background: goldGrad,
                          color: colors.navy,
                          display: 'grid', placeItems: 'center',
                          margin: '0 auto 14px',
                          boxShadow: `0 12px 28px ${tint(colors.gold, 40)}`,
                        }}
                      >
                        <CheckCircle2 size={26} strokeWidth={2.4} />
                      </div>
                      <h3
                        className="f-head"
                        style={{
                          margin: '0 0 8px',
                          fontSize: 20, fontWeight: 700,
                          color: colors.text, letterSpacing: '-0.015em',
                        }}
                      >
                        Message received.
                      </h3>
                      <p style={{ margin: '0 0 18px', fontSize: 14.5, color: colors.textMuted, lineHeight: 1.65 }}>
                        Thanks {form.name.split(' ')[0] || 'there'} — a real teammate will reply to
                        <strong style={{ color: colors.text }}> {form.email}</strong> within 4 hours.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setStatus('idle')
                          setForm({ name: '', email: '', topic: TOPICS[0], message: '' })
                        }}
                        className="cta-ghost"
                        style={{ cursor: 'pointer' }}
                      >
                        Send another
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={submit}
                      style={{ display: 'grid', gap: 16 }}
                    >
                      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                        <div>
                          <label htmlFor="cf-name" style={labelStyle}>Your name</label>
                          <input
                            id="cf-name"
                            type="text"
                            required
                            value={form.name}
                            onChange={change('name')}
                            onFocus={focusOn}
                            onBlur={focusOff}
                            placeholder="Adaeze Okonkwo"
                            style={inputBase}
                          />
                        </div>
                        <div>
                          <label htmlFor="cf-email" style={labelStyle}>Email address</label>
                          <input
                            id="cf-email"
                            type="email"
                            required
                            value={form.email}
                            onChange={change('email')}
                            onFocus={focusOn}
                            onBlur={focusOff}
                            placeholder="you@email.com"
                            style={inputBase}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cf-topic" style={labelStyle}>What is this about?</label>
                        <div style={{ position: 'relative' }}>
                          <select
                            id="cf-topic"
                            value={form.topic}
                            onChange={change('topic')}
                            onFocus={focusOn}
                            onBlur={focusOff}
                            style={{
                              ...inputBase,
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              paddingRight: 42,
                              cursor: 'pointer',
                            }}
                          >
                            {TOPICS.map((t) => (
                              <option key={t} value={t} style={{ background: colors.navy, color: colors.text }}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            color={colors.textMuted}
                            style={{
                              position: 'absolute', right: 14, top: '50%',
                              transform: 'translateY(-50%)', pointerEvents: 'none',
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cf-msg" style={labelStyle}>Message</label>
                        <textarea
                          id="cf-msg"
                          required
                          rows={5}
                          value={form.message}
                          onChange={change('message')}
                          onFocus={focusOn}
                          onBlur={focusOff}
                          placeholder="Tell us as much as you can — links, screenshots, transaction IDs all help us help you faster."
                          style={{ ...inputBase, resize: 'vertical', minHeight: 130, lineHeight: 1.6 }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <p style={{ margin: 0, fontSize: 12.5, color: colors.textMuted, display: 'flex', alignItems: 'center', gap: 7 }}>
                          <ShieldCheck size={13} color={colors.gold} />
                          Encrypted in transit. Never shared.
                        </p>
                        <button
                          type="submit"
                          disabled={status === 'sending'}
                          className="cta-gold"
                          style={{
                            cursor: status === 'sending' ? 'progress' : 'pointer',
                            opacity: status === 'sending' ? 0.85 : 1,
                            border: 'none',
                          }}
                        >
                          {status === 'sending' ? 'Sending…' : 'Send message'}
                          <Send size={15} />
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.08 }}
              style={{ display: 'grid', gap: 16 }}
            >
              <div
                style={{
                  position: 'relative',
                  padding: 26,
                  borderRadius: 18,
                  background: `linear-gradient(180deg, ${tint(colors.navyMid, 55)}, ${tint(colors.navy, 65)})`,
                  border: `1px solid ${tint(colors.gold, 14)}`,
                  overflow: 'hidden',
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
                    background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 60)}, transparent)`,
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: 11,
                      background: tint(colors.gold, 12),
                      border: `1px solid ${tint(colors.gold, 26)}`,
                      display: 'grid', placeItems: 'center',
                    }}
                  >
                    <Headphones size={18} color={colors.gold} />
                  </div>
                  <h3
                    className="f-head"
                    style={{
                      margin: 0, fontSize: 16.5, fontWeight: 700,
                      color: colors.text, letterSpacing: '-0.01em',
                    }}
                  >
                    Support hours
                  </h3>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
                  {[
                    { k: 'Live chat', v: '24 / 7 — always on' },
                    { k: 'Email & WhatsApp', v: 'Mon–Sun · 7am – 11pm WAT' },
                    { k: 'Phone support', v: 'Mon–Sun · 9am – 9pm WAT' },
                    { k: 'Press & partnerships', v: 'Mon–Fri · 9am – 6pm WAT' },
                  ].map(({ k, v }) => (
                    <li key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13.5 }}>
                      <span style={{ color: colors.textMuted }}>{k}</span>
                      <span style={{ color: colors.text, fontWeight: 600, textAlign: 'right' }}>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  position: 'relative',
                  padding: 26,
                  borderRadius: 18,
                  background: `linear-gradient(180deg, ${tint(colors.navyMid, 55)}, ${tint(colors.navy, 65)})`,
                  border: `1px solid ${tint(colors.gold, 14)}`,
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: 11,
                      background: tint(colors.gold, 12),
                      border: `1px solid ${tint(colors.gold, 26)}`,
                      display: 'grid', placeItems: 'center',
                    }}
                  >
                    <Mail size={18} color={colors.gold} />
                  </div>
                  <h3
                    className="f-head"
                    style={{
                      margin: 0, fontSize: 16.5, fontWeight: 700,
                      color: colors.text, letterSpacing: '-0.01em',
                    }}
                  >
                    Direct inboxes
                  </h3>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 12 }}>
                  {[
                    { k: 'Customer support', v: 'support@veloxzap.com' },
                    { k: 'Press & media',    v: 'press@veloxzap.com'   },
                    { k: 'Partnerships',     v: 'partners@veloxzap.com'},
                    { k: 'Security reports', v: 'security@veloxzap.com'},
                  ].map(({ k, v }) => (
                    <li key={k}>
                      <p
                        className="f-mono"
                        style={{
                          margin: 0, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em',
                          color: colors.textMuted, textTransform: 'uppercase',
                        }}
                      >
                        {k}
                      </p>
                      <a
                        href={`mailto:${v}`}
                        style={{
                          color: colors.text, textDecoration: 'none', fontSize: 14, fontWeight: 600,
                          borderBottom: `1px dashed ${tint(colors.gold, 30)}`,
                        }}
                      >
                        {v}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  padding: '20px 24px',
                  borderRadius: 18,
                  background: `linear-gradient(135deg, ${tint(colors.gold, 8)}, ${tint(colors.champagne, 4)})`,
                  border: `1px solid ${tint(colors.gold, 22)}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap',
                }}
              >
                <p
                  className="f-mono"
                  style={{
                    margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
                    color: colors.textMuted, textTransform: 'uppercase',
                  }}
                >
                  Follow along
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {SOCIAL.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      style={{
                        width: 38, height: 38, borderRadius: 10,
                        display: 'grid', placeItems: 'center',
                        background: tint(colors.navy, 70),
                        border: `1px solid ${tint(colors.gold, 18)}`,
                        color: colors.text,
                        textDecoration: 'none',
                        transition: 'transform 0.2s, color 0.2s, border-color 0.2s, background 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.color = colors.gold
                        e.currentTarget.style.borderColor = tint(colors.gold, 40)
                        e.currentTarget.style.background = tint(colors.navy, 85)
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.color = colors.text
                        e.currentTarget.style.borderColor = tint(colors.gold, 18)
                        e.currentTarget.style.background = tint(colors.navy, 70)
                      }}
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      <section style={SECTION}>
        <div style={WRAP}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <span style={PILL()}>Find us</span>
            <h2
              className="f-head"
              style={{
                margin: '18px auto 14px',
                maxWidth: 720,
                fontSize: 'clamp(28px, 4.4vw, 46px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: colors.text,
              }}
            >
              Two offices,{' '}
              <span style={gradientText(goldGrad)}>one mission.</span>
            </h2>
            <p style={{ maxWidth: 560, margin: '0 auto', fontSize: 15.5, color: colors.textMuted, lineHeight: 1.7 }}>
              Drop in by appointment — we love hosting customers, partners, and journalists in
              person.
            </p>
          </div>

          <div
            style={{
              display: 'grid', gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            }}
          >
            {OFFICES.map(({ city, role, address, hours, accent }, i) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                style={{
                  position: 'relative',
                  padding: 28,
                  borderRadius: 20,
                  background: `linear-gradient(180deg, ${tint(colors.navyMid, 60)}, ${tint(colors.navy, 70)})`,
                  border: `1px solid ${tint(accent, 16)}`,
                  overflow: 'hidden',
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: 'absolute', top: -90, right: -90, width: 220, height: 220, borderRadius: '50%',
                    background: `radial-gradient(circle, ${tint(accent, 14)} 0%, transparent 70%)`,
                  }}
                />
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <div
                      style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: tint(accent, 14),
                        border: `1px solid ${tint(accent, 28)}`,
                        display: 'grid', placeItems: 'center',
                      }}
                    >
                      <Building2 size={20} color={accent} />
                    </div>
                    <div>
                      <p
                        className="f-mono"
                        style={{
                          margin: 0, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em',
                          color: accent, textTransform: 'uppercase',
                        }}
                      >
                        {role}
                      </p>
                      <h3
                        className="f-head"
                        style={{
                          margin: '2px 0 0',
                          fontSize: 22, fontWeight: 800,
                          color: colors.text, letterSpacing: '-0.02em',
                        }}
                      >
                        {city}
                      </h3>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: 12 }}>
                    <p style={{ margin: 0, display: 'flex', gap: 10, fontSize: 14.2, color: colors.textMuted, lineHeight: 1.6 }}>
                      <MapPin size={16} color={accent} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: colors.text }}>{address}</span>
                    </p>
                    <p style={{ margin: 0, display: 'flex', gap: 10, fontSize: 14.2, color: colors.textMuted, lineHeight: 1.6 }}>
                      <Clock size={16} color={accent} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{hours}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section style={SECTION}>
        <div style={WRAP}>
          <div
            style={{
              display: 'grid', gap: 40,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              alignItems: 'start',
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
            >
              <span style={PILL()}>FAQ</span>
              <h2
                className="f-head"
                style={{
                  margin: '18px 0 14px',
                  fontSize: 'clamp(28px, 4.2vw, 42px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.12,
                  color: colors.text,
                }}
              >
                Quick answers,{' '}
                <span style={gradientText(goldGrad)}>before you write.</span>
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 15.5, color: colors.textMuted, lineHeight: 1.7 }}>
                A lot of contact emails answer themselves. If your question is below, you might
                save yourself a step.
              </p>
              <Link
                to="/company/about"
                className="cta-ghost"
                style={{ textDecoration: 'none' }}
              >
                <HelpCircle size={15} /> Visit help centre
              </Link>
            </motion.div>

            <div style={{ display: 'grid', gap: 12 }}>
              {FAQS.map((item, i) => (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                >
                  <FaqItem
                    item={item}
                    open={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section style={{ ...SECTION, paddingTop: 40, paddingBottom: 110 }}>
        <div style={WRAP}>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            style={{
              position: 'relative',
              padding: 'clamp(40px, 6vw, 64px) clamp(28px, 5vw, 60px)',
              borderRadius: 26,
              background: `linear-gradient(135deg, ${tint(colors.navyMid, 90)}, ${tint(colors.navy, 95)})`,
              border: `1px solid ${tint(colors.gold, 22)}`,
              boxShadow: `0 30px 80px ${tint('black', 60)}, 0 0 0 1px ${tint(colors.gold, 8)}, 0 0 80px ${tint(colors.gold, 10)}`,
              overflow: 'hidden',
              display: 'grid', gap: 28,
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              alignItems: 'center',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute', top: -100, right: -100, width: 320, height: 320, borderRadius: '50%',
                background: `radial-gradient(circle, ${tint(colors.gold, 16)} 0%, transparent 70%)`,
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 80)}, transparent)`,
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={PILL(true)}>
                <LifeBuoy size={11} /> Need help right now?
              </span>
              <h2
                className="f-head"
                style={{
                  margin: '18px 0 12px',
                  fontSize: 'clamp(24px, 3.8vw, 38px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.12,
                  color: colors.text,
                }}
              >
                The fastest way to reach{' '}
                <span style={gradientText(goldGrad)}>a real human.</span>
              </h2>
              <p style={{ margin: 0, fontSize: 15, color: colors.textMuted, lineHeight: 1.7, maxWidth: 460 }}>
                Open the app and tap the chat bubble — average pickup time today is 78 seconds.
              </p>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <a href="https://wa.me/2348025559000" target="_blank" rel="noopener noreferrer" className="cta-gold">
                Chat on WhatsApp <ArrowRight size={16} />
              </a>
              <Link to="/auth/login" className="cta-ghost">
                Open the app
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
