import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, ShieldCheck, Lock as LockIcon, Sparkles, Users,
  KeyRound, MailCheck, AlertTriangle, Loader2, Activity,
} from 'lucide-react'
import useEmailVerification from '../hooks/useEmailVerification'

const CHIPS = [
  { Icon: ShieldCheck, label: 'VeloxZap',       pos: 'tl' },
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

export default function VerifyEmail() {
  const lagos = useLagosClock()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { verify, verifying, verifyError } = useEmailVerification()
  const [successMessage, setSuccessMessage] = useState('')
  const verifiedTokenRef = useRef(null)

  useEffect(() => {
    if (!token || verifiedTokenRef.current === token) return
    verifiedTokenRef.current = token

    verify({ token }).then((result) => {
      if (result.success) setSuccessMessage(result.message || 'Email verified successfully')
    }).catch(() => {})
  }, [token, verify])

  let status = 'verifying'
  if (!token) status = 'dead'
  else if (successMessage) status = 'done'
  else if (!verifying && verifyError) status = 'dead'

  const linkDead = status === 'dead'
  const done = status === 'done'

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
              {linkDead ? 'Invalid link' : done ? 'Email verified' : 'Verifying…'}
            </span>

            <h1 className="la-title">
              {linkDead
                ? <>Link <span className="la-title-accent">expired</span></>
                : done
                  ? <>You're all <span className="la-title-accent">set</span></>
                  : <>Verifying your <span className="la-title-accent">email</span></>}
            </h1>
            <p className="la-sub">
              {linkDead
                ? (verifyError || 'No verification token found')
                : done
                  ? successMessage
                  : 'Hang tight while we confirm your email address.'}
            </p>

            <div className="la-form">
              {linkDead ? (
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '16px 18px', borderRadius: 14,
                    background: 'color-mix(in srgb, #f87171 10%, transparent)',
                    border: '1px solid color-mix(in srgb, #f87171 30%, transparent)',
                  }}
                >
                  <AlertTriangle size={20} style={{ color: '#f87171', flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {verifyError || 'No verification token found'}
                  </div>
                </div>
              ) : done ? (
                <>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '16px 18px', borderRadius: 14,
                      background: 'color-mix(in srgb, var(--color-brand-accent) 10%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--color-brand-accent) 30%, transparent)',
                    }}
                  >
                    <MailCheck size={20} style={{ color: 'var(--color-brand-accent)', flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      You're good to go.
                    </div>
                  </div>

                  <Link
                    to="/user/dashboard"
                    className="la-cta"
                    style={{ textDecoration: 'none' }}
                  >
                    <span className="la-cta-text">Go to dashboard</span>
                    <span className="la-cta-arrow" aria-hidden><ArrowRight size={15} /></span>
                  </Link>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0' }}>
                  <Loader2 size={28} className="la-spin" style={{ color: 'var(--color-brand-accent)' }} />
                </div>
              )}
            </div>
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
