import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mail, ArrowRight, ArrowLeft, Loader2,
  ShieldCheck, Lock as LockIcon, Sparkles, Users,
  KeyRound, MailCheck, Activity,
} from 'lucide-react'
import useForgotPassword from '../hooks/useForgotPassword'

const CHIPS = [
  { Icon: ShieldCheck, label: 'Veloxzap',   pos: 'tl' },
  { Icon: LockIcon,    label: '256-bit Vault',  pos: 'tr' },
  { Icon: Sparkles,    label: 'Instant Payout', pos: 'bl' },
  { Icon: Users,       label: '500K+ Users',    pos: 'br' },
]

function useLagosClock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return t.toLocaleTimeString('en-NG', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

export default function ForgetPassword() {
  const lagos = useLagosClock()

  const [email,       setEmail]       = useState('')
  const [formError,   setFormError]   = useState('')
  const [sent,         setSent]       = useState(false)
  const [sentMessage, setSentMessage] = useState('')
  const { submit, submitting, submitError } = useForgotPassword()

  const error = formError || submitError

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (!email) { setFormError('Enter the email tied to your VeloxZap account.'); return }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setFormError('That email address looks invalid.'); return }
    const result = await submit({ email })
    if (result.success) {
      setSentMessage(result.message || '')
      setSent(true)
    }
  }

  return (
    <div className="la-stage">
      <div className="la-bg-stars" aria-hidden />
      <div className="la-bg-mark"  aria-hidden>VELOXZAP</div>
      <div className="la-bg-glow"  aria-hidden />

      <header className="la-top">
        <Link to="/" className="la-brand">
          <img src="/logo-2.png" alt="VeloxZap" className="la-brand-logo" />
        </Link>
        <div className="la-clock" aria-label="Lagos local time">
          <span className="la-clock-dot" />
          <span className="la-clock-label">Lagos</span>
          <span className="la-clock-time">{lagos}</span>
        </div>
      </header>

      <main className="la-main">
        <div className="la-aperture">
          <div className="la-ring la-ring-3" aria-hidden />
          <div className="la-ring la-ring-2" aria-hidden>
            {[0, 90, 180, 270].map(deg => (
              <span key={deg} className="la-tick" style={{ transform: `rotate(${deg}deg)` }} />
            ))}
          </div>
          <div className="la-ring la-ring-1" aria-hidden />

          {CHIPS.map(({ Icon, label, pos }) => (
            <span key={pos} className={`la-chip la-chip-${pos}`}>
              <Icon size={11} />
              {label}
            </span>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="la-pod"
          >
            <span className="la-status">
              <KeyRound size={11} />
              Secure recovery
            </span>

            <h1 className="la-title">
              Forgot your <span className="la-title-accent">password?</span>
            </h1>
            <p className="la-sub">
              {sent
                ? 'Check your inbox for a secure link to reset your password.'
                : 'Enter the email on your account and we will send you a secure link to reset it.'}
            </p>

            {sent ? (
              <div className="la-form">
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '16px 18px', borderRadius: 14,
                    background: 'color-mix(in srgb, var(--color-brand-accent) 10%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--color-brand-accent) 30%, transparent)',
                  }}
                >
                  <MailCheck size={20} style={{ color: 'var(--color-brand-accent)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                      {sentMessage || 'Recovery link sent'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      Sent to <strong style={{ color: 'var(--color-text)' }}>{email}</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { setSent(false); setEmail(''); setSentMessage('') }}
                  className="la-cta"
                >
                  <span className="la-cta-text">Send to a different email</span>
                  <span className="la-cta-arrow" aria-hidden><ArrowRight size={15} /></span>
                </button>

                <div className="la-divider"><span>didn't receive it?</span></div>

                <div className="la-oauth" style={{ justifyContent: 'center' }}>
                  <Link to="/auth/login" className="la-create">
                    <ArrowLeft size={12} /> Back to sign in
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="la-form" noValidate>
                <div className="la-field">
                  <Mail size={15} className="la-field-ic" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="la-field-in"
                  />
                </div>

                {error && <div className="la-err" role="alert">{error}</div>}

                <button type="submit" className="la-cta" disabled={submitting}>
                  <span className="la-cta-text">
                    {submitting ? 'Sending link…' : 'Send recovery link'}
                  </span>
                  <span className="la-cta-arrow" aria-hidden>
                    {submitting
                      ? <Loader2 size={15} className="la-spin" />
                      : <ArrowRight size={15} />}
                  </span>
                </button>

                <div className="la-divider"><span>remembered it?</span></div>

                <div className="la-oauth" style={{ justifyContent: 'center' }}>
                  <Link to="/auth/login" className="la-create">
                    <ArrowLeft size={12} /> Back to sign in
                  </Link>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      <footer className="la-foot">
        <span className="la-foot-copy">
          <Activity size={11} />
          All systems operational
        </span>
        <nav className="la-foot-nav">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/aml">AML</Link>
          <span className="la-foot-meta">© {new Date().getFullYear()} VeloxZap</span>
        </nav>
      </footer>
    </div>
  )
}
