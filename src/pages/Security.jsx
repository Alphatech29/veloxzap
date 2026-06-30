import SEO from '../components/SEO'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, ShieldCheck, Lock, Fingerprint, Eye, Zap,
  Server, AlertTriangle, BadgeCheck, KeyRound, Smartphone,
  ScanFace, Radio, Award, Sparkles, Mail,
} from 'lucide-react'
import { colors, tint, gradientText } from '../components/landing/theme'
import useSettings from '../hooks/useSettings'

const goldGrad = `linear-gradient(135deg, ${colors.gold}, ${colors.champagne})`

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

const STATS = [
  { value: '256-bit', label: 'AES encryption',         sub: 'Data at rest & in transit' },
  { value: '99.9%',   label: 'Platform uptime',        sub: 'Last 12 months' },
  { value: '<2 min',  label: 'Fraud alert response',   sub: 'Average detection time' },
  { value: '0',       label: 'Customer fund losses',   sub: 'Due to platform breach' },
]

const FEATURES = [
  {
    icon: KeyRound,
    title: '256-bit AES encryption',
    desc: 'Every byte of your data — at rest and in transit — is encrypted with AES-256, the same standard used by top financial platforms and intelligence agencies worldwide.',
  },
  {
    icon: ScanFace,
    title: 'Biometric authentication',
    desc: 'Face ID and fingerprint login are supported across Android and iOS. We never store biometric data on our servers — authentication happens entirely on your device.',
  },
  {
    icon: Smartphone,
    title: 'Two-factor authentication',
    desc: 'Every sign-in and high-value transaction triggers a second factor — OTP via SMS, email, or an authenticator app. Your account can\'t be accessed from an unknown device without it.',
  },
  {
    icon: Radio,
    title: 'Real-time fraud monitoring',
    desc: 'Our ML-powered fraud engine analyses every transaction in under 50 milliseconds, flagging anomalies based on device, location, velocity, and behavioural patterns.',
  },
  {
    icon: Lock,
    title: 'Transaction PIN',
    desc: 'Every withdrawal, transfer, and card action requires your personal six-digit transaction PIN — separate from your login password, stored only as a one-way hash.',
  },
  {
    icon: Eye,
    title: 'Always-on monitoring',
    desc: 'Our security operations centre runs 24/7. Suspicious logins, unusual device changes, and high-risk transaction patterns trigger instant alerts to our fraud team.',
  },
  {
    icon: Server,
    title: 'Isolated infrastructure',
    desc: 'Customer funds and sensitive data live in isolated, access-controlled environments. Engineers cannot access production data without multi-party approval and a full audit trail.',
  },
  {
    icon: ShieldCheck,
    title: 'Automatic session management',
    desc: 'Sessions expire after inactivity, and all active sessions are visible in your settings. Log out every device remotely in one tap if your phone is lost or stolen.',
  },
]

const CERTS = [
  { icon: BadgeCheck, label: 'PCI DSS Level 1',   sub: 'Highest payment-card security standard globally' },
  { icon: Lock,       label: 'ISO 27001',          sub: 'Certified information security management' },
  { icon: ShieldCheck,label: 'Enterprise-grade TLS 1.3', sub: 'Transport layer security on every connection' },
  { icon: Award,      label: 'SOC 2 Type II',      sub: 'Independently audited security & availability controls' },
]

const LAYERS = [
  { step: '01', title: 'Device layer',       desc: 'Biometrics, device fingerprinting, and jailbreak/root detection prevent unauthorised access before a request even leaves your phone.' },
  { step: '02', title: 'Network layer',      desc: 'All traffic travels over TLS 1.3. Certificate pinning prevents man-in-the-middle attacks. Our APIs reject any connection without a valid certificate chain.' },
  { step: '03', title: 'Application layer',  desc: 'Every API call is authenticated and rate-limited. Input is validated and sanitised server-side. SQL injection, XSS, and CSRF protections are enforced by default.' },
  { step: '04', title: 'Data layer',         desc: 'Sensitive fields (PINs, card numbers, BVN) are encrypted at the column level. Database access requires MFA and is fully logged. Backups are encrypted and tested weekly.' },
  { step: '05', title: 'Operations layer',   desc: 'Production access requires dual authorisation. All infrastructure changes are peer-reviewed, and our SIEM aggregates logs across every service for real-time threat detection.' },
]

export default function Security() {
  const { settings } = useSettings()
  const securityEmail = settings?.security_email || `security@veloxzap.com`

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
      <SEO
        title="VeloxZap Security — How We Protect Your Money & Data"
        description="Learn how VeloxZap secures your account with end-to-end encryption, transaction PINs, two-factor authentication, and 24/7 fraud monitoring."
        path="/security"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "VeloxZap Security",
          "url": "https://veloxzap.com/security",
          "description": "Overview of VeloxZap's security measures including encryption, 2FA, PIN protection and fraud monitoring.",
          "publisher": { "@type": "Organization", "name": "VeloxZap", "url": "https://veloxzap.com" }
        }}
      />
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

      {/* Hero */}
      <section style={{ ...SECTION, paddingTop: 60, paddingBottom: 70 }}>
        <div style={{ ...WRAP, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={PILL(true)}>
              <ShieldCheck size={11} /> Security
            </span>
          </motion.div>

          <motion.h1
            className="f-head"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            style={{
              margin: '20px auto 18px',
              maxWidth: 880,
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: '-0.04em',
              color: colors.text,
            }}
          >
            Your money is safer here{' '}
            <span style={gradientText(`linear-gradient(110deg, ${colors.gold}, ${colors.champagne}, ${colors.gold})`)}>
              than anywhere else.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            style={{
              maxWidth: 620, margin: '0 auto 32px',
              fontSize: 17, lineHeight: 1.7,
              color: colors.textMuted,
            }}
          >
            We've built five independent layers of security so that even if one is compromised,
            the others hold. No customer has ever lost funds to a VeloxZap platform breach.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/auth/register" className="cta-gold">
              Open an account <ArrowRight size={16} />
            </Link>
            <a href={`mailto:${securityEmail}`} className="cta-ghost">
              Report a vulnerability
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ ...SECTION, paddingTop: 0, paddingBottom: 70 }}>
        <div style={WRAP}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'grid', gap: 14,
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            }}
          >
            {STATS.map(({ value, label, sub }) => (
              <div
                key={label}
                style={{
                  position: 'relative',
                  padding: '26px 22px',
                  borderRadius: 18,
                  background: `linear-gradient(180deg, ${tint(colors.navyMid, 60)}, ${tint(colors.navy, 70)})`,
                  border: `1px solid ${tint(colors.gold, 14)}`,
                  boxShadow: `0 12px 40px ${tint('black', 30)}, inset 0 1px 0 ${tint('white', 5)}`,
                  overflow: 'hidden',
                  textAlign: 'center',
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
                    background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 60)}, transparent)`,
                  }}
                />
                <p
                  className="f-head"
                  style={{
                    margin: '0 0 6px',
                    fontSize: 'clamp(28px, 3.6vw, 38px)',
                    fontWeight: 800, letterSpacing: '-0.03em',
                    color: colors.text, lineHeight: 1.05,
                  }}
                >
                  {value}
                </p>
                <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: colors.textMuted }}>
                  {label}
                </p>
                <p className="f-mono" style={{ margin: 0, fontSize: 10.5, color: tint(colors.textMuted, 70), letterSpacing: '0.08em' }}>
                  {sub}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
      <section style={SECTION}>
        <div style={WRAP}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <span style={PILL()}>How we protect you</span>
            <h2
              className="f-head"
              style={{
                margin: '18px auto 14px',
                maxWidth: 720,
                fontSize: 'clamp(28px, 4.4vw, 46px)',
                fontWeight: 800, letterSpacing: '-0.03em',
                lineHeight: 1.1, color: colors.text,
              }}
            >
              Eight layers of protection,{' '}
              <span style={gradientText(goldGrad)}>always active.</span>
            </h2>
            <p style={{ maxWidth: 560, margin: '0 auto', fontSize: 15.5, color: colors.textMuted, lineHeight: 1.7 }}>
              Security isn't a feature we ship — it's the foundation every other feature is built on.
            </p>
          </div>

          <div
            style={{
              display: 'grid', gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                style={{
                  position: 'relative',
                  padding: 26,
                  borderRadius: 18,
                  background: `linear-gradient(180deg, ${tint(colors.navyMid, 50)}, ${tint(colors.navy, 60)})`,
                  border: `1px solid ${tint(colors.gold, 12)}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = tint(colors.gold, 30)
                  e.currentTarget.style.boxShadow = `0 18px 40px ${tint('black', 35)}, 0 0 32px ${tint(colors.gold, 10)}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = tint(colors.gold, 12)
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
                    background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 50)}, transparent)`,
                  }}
                />
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: tint(colors.gold, 12),
                    border: `1px solid ${tint(colors.gold, 26)}`,
                    display: 'grid', placeItems: 'center',
                    marginBottom: 16,
                    boxShadow: `0 0 20px ${tint(colors.gold, 14)}`,
                  }}
                >
                  <Icon size={20} color={colors.gold} />
                </div>
                <h3
                  className="f-head"
                  style={{
                    margin: '0 0 8px', fontSize: 17, fontWeight: 700,
                    color: colors.text, letterSpacing: '-0.01em',
                  }}
                >
                  {title}
                </h3>
                <p style={{ margin: 0, fontSize: 13.5, color: colors.textMuted, lineHeight: 1.7 }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Defence-in-depth layers */}
      <section style={SECTION}>
        <div style={WRAP}>
          <div
            style={{
              display: 'grid', gap: 60,
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
            >
              <span style={PILL()}>Defence in depth</span>
              <h2
                className="f-head"
                style={{
                  margin: '18px 0 18px',
                  fontSize: 'clamp(26px, 4vw, 42px)',
                  fontWeight: 800, letterSpacing: '-0.03em',
                  lineHeight: 1.12, color: colors.text,
                }}
              >
                Five independent layers.{' '}
                <span style={gradientText(goldGrad)}>All must fail for you to be at risk.</span>
              </h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.8, color: colors.textMuted, margin: 0 }}>
                We don't rely on a single security mechanism. If any one layer is bypassed, the next
                one catches the threat — independently and automatically.
              </p>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div
                aria-hidden
                style={{
                  position: 'relative',
                  marginLeft: 22,
                }}
              >
                <div
                  style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0,
                    width: 2,
                    background: `linear-gradient(180deg, ${tint(colors.gold, 50)}, ${tint(colors.champagne, 30)}, transparent)`,
                  }}
                />
              </div>
              {LAYERS.map(({ step, title, desc }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  style={{
                    position: 'relative',
                    paddingLeft: 56,
                    paddingBottom: i === LAYERS.length - 1 ? 0 : 28,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute', left: 12, top: 4,
                      width: 22, height: 22, borderRadius: '50%',
                      background: goldGrad,
                      boxShadow: `0 0 0 4px ${tint(colors.navy, 90)}, 0 0 20px ${tint(colors.gold, 50)}`,
                      display: 'grid', placeItems: 'center',
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.navy }} />
                  </div>
                  <div
                    className="f-mono"
                    style={{
                      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em',
                      color: colors.gold, textTransform: 'uppercase', marginBottom: 3,
                    }}
                  >
                    Layer {step}
                  </div>
                  <h3
                    className="f-head"
                    style={{ margin: '0 0 5px', fontSize: 16.5, fontWeight: 700, color: colors.text, letterSpacing: '-0.01em' }}
                  >
                    {title}
                  </h3>
                  <p style={{ margin: 0, fontSize: 13.5, color: colors.textMuted, lineHeight: 1.7 }}>
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section style={SECTION}>
        <div style={WRAP}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={PILL()}>Certifications</span>
            <h2
              className="f-head"
              style={{
                margin: '18px auto 14px',
                maxWidth: 680,
                fontSize: 'clamp(26px, 4vw, 40px)',
                fontWeight: 800, letterSpacing: '-0.03em',
                lineHeight: 1.12, color: colors.text,
              }}
            >
              Audited, certified,{' '}
              <span style={gradientText(goldGrad)}>and accountable.</span>
            </h2>
            <p style={{ maxWidth: 520, margin: '0 auto', fontSize: 15.5, color: colors.textMuted, lineHeight: 1.7 }}>
              Independent auditors verify our security controls annually. We publish summaries of
              every audit to our enterprise customers on request.
            </p>
          </div>

          <div
            style={{
              display: 'grid', gap: 14,
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {CERTS.map(({ icon: Icon, label, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '20px 22px',
                  borderRadius: 16,
                  background: `linear-gradient(180deg, ${tint(colors.navyMid, 55)}, ${tint(colors.navy, 65)})`,
                  border: `1px solid ${tint(colors.gold, 14)}`,
                }}
              >
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: tint(colors.gold, 12),
                    border: `1px solid ${tint(colors.gold, 26)}`,
                    display: 'grid', placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color={colors.gold} />
                </div>
                <div>
                  <p
                    className="f-head"
                    style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 700, color: colors.text }}
                  >
                    {label}
                  </p>
                  <p style={{ margin: 0, fontSize: 12.5, color: colors.textMuted, lineHeight: 1.5 }}>
                    {sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bug bounty */}
      <section style={SECTION}>
        <div style={WRAP}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'grid', gap: 40,
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              alignItems: 'center',
              padding: 'clamp(36px, 5vw, 56px) clamp(28px, 5vw, 52px)',
              borderRadius: 24,
              background: `linear-gradient(135deg, ${tint(colors.navyMid, 80)}, ${tint(colors.navy, 90)})`,
              border: `1px solid ${tint(colors.gold, 18)}`,
              boxShadow: `0 24px 60px ${tint('black', 45)}, inset 0 1px 0 ${tint('white', 5)}`,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute', top: -100, right: -100, width: 300, height: 300,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${tint(colors.gold, 14)} 0%, transparent 70%)`,
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 70)}, transparent)`,
              }}
            />

            <div style={{ position: 'relative' }}>
              <span style={PILL(true)}>
                <AlertTriangle size={11} /> Bug bounty
              </span>
              <h2
                className="f-head"
                style={{
                  margin: '18px 0 14px',
                  fontSize: 'clamp(24px, 3.6vw, 36px)',
                  fontWeight: 800, letterSpacing: '-0.03em',
                  lineHeight: 1.12, color: colors.text,
                }}
              >
                Found a vulnerability?{' '}
                <span style={gradientText(goldGrad)}>We want to know.</span>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: colors.textMuted, margin: '0 0 8px' }}>
                We run a responsible-disclosure programme and pay bounties for confirmed vulnerabilities.
                If you've found something, please tell us before anyone else — we respond to all reports
                within 48 hours and pay out within 5 business days of confirmation.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: colors.textMuted, margin: 0 }}>
                Reports that lead to a fix are rewarded based on severity, from ₦50,000 for low-risk
                findings up to ₦5,000,000 for critical vulnerabilities. We do not pursue legal action
                against researchers who act in good faith.
              </p>
            </div>

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
              {[
                { level: 'Critical', reward: 'Up to ₦5,000,000', color: '#f87171' },
                { level: 'High',     reward: 'Up to ₦1,500,000', color: colors.gold },
                { level: 'Medium',   reward: 'Up to ₦400,000',   color: colors.champagne },
                { level: 'Low',      reward: 'Up to ₦50,000',    color: colors.textMuted },
              ].map(({ level, reward, color }) => (
                <div
                  key={level}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 16,
                    padding: '13px 16px',
                    borderRadius: 12,
                    background: tint(colors.navy, 60),
                    border: `1px solid ${tint(color, 20)}`,
                  }}
                >
                  <span
                    className="f-mono"
                    style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', color, textTransform: 'uppercase' }}
                  >
                    {level}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{reward}</span>
                </div>
              ))}
              <a
                href={`mailto:${securityEmail}`}
                className="cta-gold"
                style={{ marginTop: 4 }}
              >
                <Mail size={15} /> Report to {securityEmail}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ ...SECTION, paddingTop: 20, paddingBottom: 110 }}>
        <div style={WRAP}>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            style={{
              position: 'relative',
              padding: 'clamp(44px, 7vw, 72px) clamp(28px, 5vw, 60px)',
              borderRadius: 26,
              background: `linear-gradient(135deg, ${tint(colors.navyMid, 90)}, ${tint(colors.navy, 95)})`,
              border: `1px solid ${tint(colors.gold, 22)}`,
              boxShadow: `0 30px 80px ${tint('black', 60)}, 0 0 0 1px ${tint(colors.gold, 8)}, 0 0 80px ${tint(colors.gold, 10)}`,
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 80)}, transparent)`,
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute', top: -100, right: -100, width: 320, height: 320,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${tint(colors.gold, 16)} 0%, transparent 70%)`,
              }}
            />
            <div style={{ position: 'relative' }}>
              <span style={PILL(true)}>
                <Sparkles size={11} /> Your money, protected
              </span>
              <h2
                className="f-head"
                style={{
                  margin: '20px auto 14px',
                  maxWidth: 680,
                  fontSize: 'clamp(26px, 4.6vw, 48px)',
                  fontWeight: 800, letterSpacing: '-0.04em',
                  lineHeight: 1.06, color: colors.text,
                }}
              >
                Ready to move money with{' '}
                <span style={gradientText(`linear-gradient(110deg, ${colors.gold}, ${colors.champagne}, ${colors.gold})`)}>
                  zero compromises?
                </span>
              </h2>
              <p style={{ maxWidth: 500, margin: '0 auto 28px', fontSize: 15.5, color: colors.textMuted, lineHeight: 1.7 }}>
                Join half a million Nigerians who trust VeloxZap with their money every day.
                Sign up takes 60 seconds.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/auth/register" className="cta-gold">
                  Create free account <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="cta-ghost">
                  Talk to security team
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
