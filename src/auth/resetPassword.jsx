import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2,
  ShieldCheck, Lock as LockIcon, Sparkles, Users,
  KeyRound, CheckCircle2, Activity,
} from 'lucide-react'

const CHIPS = [
  { Icon: ShieldCheck, label: 'CBN Licensed',   pos: 'tl' },
  { Icon: LockIcon,    label: '256-bit Vault',  pos: 'tr' },
  { Icon: Sparkles,    label: 'Instant Payout', pos: 'bl' },
  { Icon: Users,       label: '500K+ Users',    pos: 'br' },
]

function scorePassword(pw) {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8)          s++
  if (pw.length >= 12)         s++
  if (/[A-Z]/.test(pw))        s++
  if (/[0-9]/.test(pw))        s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return Math.min(s, 4)
}
const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong']

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

export default function ResetPassword() {
  const navigate = useNavigate()
  const lagos = useLagosClock()

  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [show,     setShow]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [done,     setDone]     = useState(false)

  const score = useMemo(() => scorePassword(password), [password])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!password || !confirm) { setError('Please fill in both password fields.'); return }
    if (score < 2)             { setError('Choose a stronger password (8+ chars, mix of letters & numbers).'); return }
    if (password !== confirm)  { setError('The two passwords do not match.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1100))
    setLoading(false)
    setDone(true)
    setTimeout(() => navigate('/auth/login'), 1800)
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
              {done ? 'Password updated' : 'Set a new password'}
            </span>

            <h1 className="la-title">
              {done ? <>You're all <span className="la-title-accent">set</span></> : <>Reset your <span className="la-title-accent">password</span></>}
            </h1>
            <p className="la-sub">
              {done
                ? 'Redirecting you to the sign-in page…'
                : 'Pick a strong password you have not used before. Aim for 12+ characters with numbers and symbols.'}
            </p>

            {done ? (
              <div className="la-form">
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '16px 18px', borderRadius: 14,
                    background: 'color-mix(in srgb, var(--color-brand-accent) 10%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--color-brand-accent) 30%, transparent)',
                  }}
                >
                  <CheckCircle2 size={20} style={{ color: 'var(--color-brand-accent)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                      Password successfully updated
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      Sign in with your new password to continue.
                    </div>
                  </div>
                </div>

                <Link to="/auth/login" className="la-cta" style={{ textDecoration: 'none' }}>
                  <span className="la-cta-text">Continue to sign in</span>
                  <span className="la-cta-arrow" aria-hidden><ArrowRight size={15} /></span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="la-form" noValidate>
                <div className="la-field">
                  <Lock size={15} className="la-field-ic" />
                  <input
                    id="password"
                    type={show ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="New password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="la-field-in"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="la-field-eye"
                    aria-label={show ? 'Hide password' : 'Show password'}
                  >
                    {show ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                <div className="vrx-strength" aria-hidden={!password}>
                  <div className="vrx-strength-track">
                    {[0, 1, 2, 3].map(i => (
                      <span
                        key={i}
                        className="vrx-strength-seg"
                        data-on={i < score}
                        data-level={score}
                      />
                    ))}
                  </div>
                  <span className="vrx-strength-label" data-level={score}>
                    {password ? STRENGTH_LABEL[score] : '8+ characters with letters & numbers'}
                  </span>
                </div>

                <div className="la-field">
                  <Lock size={15} className="la-field-ic" />
                  <input
                    id="confirm"
                    type={show ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="la-field-in"
                  />
                </div>

                {error && <div className="la-err" role="alert">{error}</div>}

                <button type="submit" className="la-cta" disabled={loading}>
                  <span className="la-cta-text">
                    {loading ? 'Updating…' : 'Update password'}
                  </span>
                  <span className="la-cta-arrow" aria-hidden>
                    {loading
                      ? <Loader2 size={15} className="la-spin" />
                      : <ArrowRight size={15} />}
                  </span>
                </button>

                <div className="la-divider"><span>changed your mind?</span></div>

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
