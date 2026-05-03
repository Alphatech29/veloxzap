import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, User, Mail, Lock, Eye, EyeOff, Phone, Gift,
  ArrowRight, Loader2, HelpCircle, Apple,
  ShieldCheck, Sparkles, CreditCard, Wifi, Receipt,
  TrendingUp, Star, CheckCircle2,
} from 'lucide-react'
import { FaGoogle } from 'react-icons/fa'

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

const FLOATERS = [
  { Icon: Gift,        title: 'Gift card sold',   meta: 'Amazon · ₦82,400 received',  cls: 'vrx-float-1' },
  { Icon: CreditCard,  title: 'Virtual card top-up', meta: '$200 · Instantly funded', cls: 'vrx-float-2' },
  { Icon: Wifi,        title: 'Airtime delivered', meta: 'MTN · ₦5,000 in 2.1s',      cls: 'vrx-float-3' },
]

const STATS = [
  { num: '500K',   suffix: '+', label: 'Active users' },
  { num: '₦12B',   suffix: '+', label: 'Processed' },
  { num: '4.9',    suffix: '★', label: 'App rating' },
]

export default function Register() {
  const navigate = useNavigate()
  const [first,    setFirst]    = useState('')
  const [last,     setLast]     = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [password, setPassword] = useState('')
  const [referral, setReferral] = useState('')
  const [show,     setShow]     = useState(false)
  const [agree,    setAgree]    = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const score = useMemo(() => scorePassword(password), [password])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!first || !last || !email || !phone || !password) {
      setError('Please complete all required fields.'); return
    }
    if (score < 2) { setError('Choose a stronger password (8+ chars, mix of letters & numbers).'); return }
    if (!agree)    { setError('Please accept the Terms and Privacy Policy to continue.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="vrx-stage">
      
      <div className="vrx-aurora vrx-aurora-a" aria-hidden />
      <div className="vrx-aurora vrx-aurora-b" aria-hidden />
      <div className="vrx-aurora vrx-aurora-c" aria-hidden />
      <div className="vrx-grain" aria-hidden />
      <div className="vrx-mark"  aria-hidden>VELOXZAP</div>

      
      <header className="vrx-top">
        <Link to="/" className="vrx-brand">
          <span className="vrx-brand-mark"><Zap size={16} /></span>
          <span className="vrx-brand-word">
            Velox<span className="vrx-brand-accent">Zap</span>
          </span>
        </Link>
        <Link to="/help" className="vrx-help" aria-label="Help center">
          <HelpCircle size={14} /> <span>Help center</span>
        </Link>
      </header>

      
      <div className="vrx-shell">

        
        <motion.aside
          className="vrx-showcase"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="vrx-show-eyebrow">
            <Sparkles size={12} /> Join the movement
          </span>

          <h2 className="vrx-show-title">
            Money at the speed of <span className="vrx-show-title-grad">light.</span>
          </h2>

          <p className="vrx-show-sub">
            Africa's most loved platform for gift cards, virtual cards, bills, and airtime.
            Built for the bold. Trusted by half a million Nigerians.
          </p>

          {/* Floating glass cards */}
          <div className="vrx-float-stack" aria-hidden>
            {FLOATERS.map(({ Icon, title, meta, cls }) => (
              <div key={cls} className={`vrx-float-card ${cls}`}>
                <span className="vrx-float-card-icon"><Icon size={18} /></span>
                <div>
                  <div className="vrx-float-card-title">{title}</div>
                  <div className="vrx-float-card-meta">{meta}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="vrx-stats">
            {STATS.map(({ num, suffix, label }) => (
              <div key={label}>
                <div className="vrx-stat-num">{num}<span>{suffix}</span></div>
                <div className="vrx-stat-lbl">{label}</div>
              </div>
            ))}
          </div>

          {/* Avatar pile */}
          <div className="vrx-pile">
            <div className="vrx-pile-avs">
              {['A', 'O', 'C', 'M'].map(letter => (
                <span key={letter} className="vrx-pile-av">{letter}</span>
              ))}
            </div>
            <div className="vrx-pile-text">
              <strong>+1,240 joined</strong> this week
            </div>
          </div>
        </motion.aside>

        {/* ═══ RIGHT: Form card ═══ */}
        <motion.div
          className="vrx-form-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        >
          <div className="vrx-form-halo" aria-hidden />

          <div className="vrx-card">
            <span className="vrx-card-eyebrow">
              <TrendingUp size={11} /> Free forever · No card required
            </span>

            <h1 className="vrx-card-title">
              Create your <span>account</span>
            </h1>
            <p className="vrx-card-sub">
              Already have one?{' '}
              <Link to="/auth/login" className="text-brand-gold-soft font-semibold hover:underline underline-offset-2">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="vrx-field">
                  <User size={16} className="vrx-icon" />
                  <input
                    id="first"
                    type="text"
                    autoComplete="given-name"
                    placeholder=" "
                    value={first}
                    onChange={e => setFirst(e.target.value)}
                    className="vrx-input"
                  />
                  <label htmlFor="first" className="vrx-label">First name</label>
                </div>
                <div className="vrx-field">
                  <User size={16} className="vrx-icon" />
                  <input
                    id="last"
                    type="text"
                    autoComplete="family-name"
                    placeholder=" "
                    value={last}
                    onChange={e => setLast(e.target.value)}
                    className="vrx-input"
                  />
                  <label htmlFor="last" className="vrx-label">Last name</label>
                </div>
              </div>

              {/* Email */}
              <div className="vrx-field">
                <Mail size={16} className="vrx-icon" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder=" "
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="vrx-input"
                />
                <label htmlFor="email" className="vrx-label">Email address</label>
              </div>

              {/* Phone with +234 prefix */}
              <div className={`vrx-field vrx-field-tel ${phone ? 'vrx-filled' : ''}`}>
                <Phone size={16} className="vrx-icon" />
                <span className="vrx-prefix">+234</span>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel-national"
                  placeholder=" "
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/[^\d ]/g, ''))}
                  className="vrx-input vrx-input-tel"
                />
                <label htmlFor="phone" className="vrx-label">Phone number</label>
              </div>

              {/* Password */}
              <div>
                <div className="vrx-field">
                  <Lock size={16} className="vrx-icon" />
                  <input
                    id="password"
                    type={show ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder=" "
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="vrx-input pr-12"
                  />
                  <label htmlFor="password" className="vrx-label">Password</label>
                  <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="vrx-eye"
                    aria-label={show ? 'Hide password' : 'Show password'}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
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
              </div>

              {/* Referral */}
              <div className="vrx-field">
                <Gift size={16} className="vrx-icon" />
                <input
                  id="referral"
                  type="text"
                  placeholder=" "
                  value={referral}
                  onChange={e => setReferral(e.target.value.toUpperCase())}
                  className="vrx-input"
                  maxLength={12}
                />
                <label htmlFor="referral" className="vrx-label">Referral code (optional)</label>
              </div>

              {/* Terms */}
              <label className="vrx-check-wrap">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={e => setAgree(e.target.checked)}
                />
                <span className="vrx-check-box" />
                <span className="vrx-check-text">
                  I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
                  <Link to="/privacy">Privacy Policy</Link>.
                </span>
              </label>

              {error && (
                <div className="vrx-err" role="alert">
                  <CheckCircle2 size={14} className="rotate-45" /> {error}
                </div>
              )}

              {/* CTA */}
              <button type="submit" className="vrx-cta" disabled={loading}>
                <span className="vrx-cta-shimmer" aria-hidden />
                {loading ? 'Creating account…' : 'Create free account'}
                {loading
                  ? <Loader2 size={16} className="vrx-spin" />
                  : <ArrowRight size={16} />}
              </button>

              {/* Divider */}
              <div className="vrx-divider"><span>or sign up with</span></div>

              {/* OAuth */}
              <div className="vrx-oauth">
                <button type="button" className="vrx-oauth-btn">
                  <FaGoogle size={15} /> Google
                </button>
                <button type="button" className="vrx-oauth-btn">
                  <Apple size={15} /> Apple
                </button>
              </div>

              <p className="vrx-secure justify-center mt-2">
                <ShieldCheck size={12} /> Bank-grade encryption · Your data is never sold
              </p>
            </form>
          </div>

          {/* Mobile-only quick stats below form */}
          <div className="lg:hidden flex items-center justify-center gap-5 mt-6 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Star size={11} className="text-brand-accent" /> 4.9 rating
            </span>
            <span className="opacity-30">·</span>
            <span>500K+ users</span>
            <span className="opacity-30">·</span>
            <span>CAC Approval</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="vrx-foot pb-8 px-6 lg:pb-10">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="text-xs">© {new Date().getFullYear()} VeloxZap Technologies Ltd.</span>
          <Link to="/terms" className="text-xs">Terms</Link>
          <Link to="/privacy" className="text-xs">Privacy</Link>
          <Link to="/aml" className="text-xs">AML</Link>
        </div>
      </footer>
    </div>
  )
}
