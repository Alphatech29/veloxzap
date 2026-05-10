import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, Mail, Lock, Eye, EyeOff, ArrowRight,
  Loader2, Globe, Apple, ShieldCheck, Activity,
  Lock as LockIcon, Users, Sparkles, Unlock,
} from 'lucide-react'
import { FaGoogle } from "react-icons/fa";
import { useAuth } from '../context/AuthContext'

const CHIPS = [
  { Icon: ShieldCheck, label: '247/7 Support',   pos: 'tl' },
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

export default function Login() {
  const navigate = useNavigate()
  const lagos = useLagosClock()

  const REMEMBER_KEY = 'veloxzap.rememberEmail'

  const [email,    setEmail]    = useState(() => localStorage.getItem(REMEMBER_KEY) || '')
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [remember, setRemember] = useState(true)
  const [formError, setFormError] = useState('')

  const { login, loading, error, reset } = useAuth()
  const displayError = formError || error?.message

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    reset()
    if (!email || !password) {
      setFormError('Enter your email and password to unlock the vault.')
      return
    }
    const result = await login({ email, password })
    if (result.success) {
      if (remember) localStorage.setItem(REMEMBER_KEY, email)
      else localStorage.removeItem(REMEMBER_KEY)
      navigate('/user/dashboard')
    }
  }

  return (
    <div className="la-stage">
      <div className="la-bg-stars" aria-hidden />
      <div className="la-bg-mark"  aria-hidden>VELOXZAP</div>
      <div className="la-bg-glow"  aria-hidden />

      <header className="la-top">
        <Link to="/" className="la-brand">
          <span className="la-brand-mark"><Zap size={14} /></span>
          <span className="la-brand-word">
            Velox<span className="la-brand-accent">Zap</span>
          </span>
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
              <Unlock size={11} />
              Vault unlocked
            </span>

            <h1 className="la-title">
              Welcome <span className="la-title-accent">back</span>
            </h1>
            <p className="la-sub">
              Enter your credentials to access your premium dashboard.
            </p>

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

              <div className="la-field">
                <Lock size={15} className="la-field-ic" />
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Password"
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

              <div className="la-meta">
                <label className="la-check">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  <span className="la-check-box" />
                  <span>Keep me signed in</span>
                </label>
                <Link to="/auth/forget-password" className="la-forgot">
                  Forgot password?
                </Link>
              </div>

              {displayError && <div className="la-err" role="alert">{displayError}</div>}

              <button type="submit" className="la-cta" disabled={loading}>
                <span className="la-cta-text">
                  {loading ? 'Unlocking…' : 'Sign in'}
                </span>
                <span className="la-cta-arrow" aria-hidden>
                  {loading
                    ? <Loader2 size={15} className="la-spin" />
                    : <ArrowRight size={15} />}
                </span>
              </button>

              <div className="la-divider"><span>or continue with</span></div>

              <div className="la-oauth">
                <button type="button" className="la-oauth-pill" aria-label="Continue with Google">
                  <FaGoogle size={16} />
                </button>
                <button type="button" className="la-oauth-pill" aria-label="Continue with Apple">
                  <Apple size={16} />
                </button>
                <Link to="/auth/register" className="la-create">
                  Create account <ArrowRight size={12} />
                </Link>
              </div>
            </form>
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
