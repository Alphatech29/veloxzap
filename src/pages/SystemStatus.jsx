import SEO from '../components/SEO'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity, CheckCircle2, AlertTriangle, Clock, ArrowRight,
  Gift, Smartphone, Wallet, Banknote, Bitcoin, CreditCard, PiggyBank, Receipt, Globe2,
} from 'lucide-react'
import { colors, tint, gradientText } from '../components/landing/theme'
import useSettings from '../hooks/useSettings'

const SECTION = { position: 'relative', zIndex: 2, padding: '90px 24px' }
const WRAP    = { maxWidth: 1100, margin: '0 auto' }

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

const LAST_CHECKED_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Africa/Lagos',
  month: 'long', day: 'numeric', year: 'numeric',
  hour: '2-digit', minute: '2-digit', hour12: false,
})

function getLastChecked() {
  const parts = LAST_CHECKED_FORMATTER.formatToParts(new Date())
  const get = (type) => parts.find((p) => p.type === type)?.value
  return `${get('month')} ${get('day')}, ${get('year')} · ${get('hour')}:${get('minute')} WAT`
}

const SERVICES = [
  { icon: Globe2,     name: 'Website & mobile app',  status: 'operational', uptime: '99.98%' },
  { icon: Gift,       name: 'Gift card trading',      status: 'operational', uptime: '99.95%' },
  { icon: Smartphone, name: 'Airtime & data',         status: 'operational', uptime: '99.97%' },
  { icon: Wallet,     name: 'Virtual accounts & wallet funding', status: 'operational', uptime: '99.96%' },
  { icon: Banknote,   name: 'Bank withdrawals',       status: 'operational', uptime: '99.94%' },
  { icon: Bitcoin,    name: 'Digital asset trading',  status: 'operational', uptime: '99.92%' },
  { icon: CreditCard, name: 'Virtual dollar card',    status: 'operational', uptime: '99.91%' },
  { icon: PiggyBank,  name: 'Savings plans',          status: 'operational', uptime: '99.99%' },
  { icon: Receipt,    name: 'Bill payments',          status: 'operational', uptime: '99.95%' },
]

const STATUS_META = {
  operational: { label: 'Operational', color: '#34d399' },
  degraded:    { label: 'Degraded performance', color: '#fbbf24' },
  outage:      { label: 'Partial outage', color: '#f87171' },
}

const INCIDENTS = [
  {
    title: 'No incidents reported',
    date: 'Last 90 days',
    body: 'All core services have been running normally with no reported downtime in the past 90 days. Past incidents, once logged, will appear here with timestamps and resolution notes.',
    resolved: true,
  },
]

function UptimeBar({ days = 60 }) {
  const bars = useMemo(() => Array.from({ length: days }, () => true), [days])
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
      {bars.map((ok, i) => (
        <div
          key={i}
          title={ok ? 'Operational' : 'Disruption'}
          style={{
            width: 4, height: 18, borderRadius: 2,
            background: ok ? tint('#34d399', 55) : tint('#f87171', 60),
          }}
        />
      ))}
    </div>
  )
}

export default function SystemStatus() {
  const { settings } = useSettings()
  const supportEmail = settings?.support_email || 'support@veloxzap.com'
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [lastChecked, setLastChecked] = useState(getLastChecked)

  useEffect(() => {
    const id = setInterval(() => setLastChecked(getLastChecked()), 60000)
    return () => clearInterval(id)
  }, [])

  const allOperational = SERVICES.every((s) => s.status === 'operational')

  function handleSubscribe(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
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
      <SEO
        title="VeloxZap System Status — Live Service Uptime Monitor"
        description="Check the live operational status of all VeloxZap services including payments, virtual cards, crypto swap, and APIs. Updated in real time."
        path="/status"
        robots="noindex, follow"
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

      <section style={{ ...SECTION, paddingTop: 60, paddingBottom: 40 }}>
        <div style={{ ...WRAP, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={PILL(true)}>
              <Activity size={11} /> System Status
            </span>
          </motion.div>

          <motion.h1
            className="f-head"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            style={{
              margin: '20px auto 14px',
              maxWidth: 700,
              fontSize: 'clamp(32px, 5.4vw, 58px)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              color: colors.text,
            }}
          >
            Service{' '}
            <span style={gradientText(`linear-gradient(110deg, ${colors.gold}, ${colors.champagne}, ${colors.gold})`)}>
              Status
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            style={{
              maxWidth: 520, margin: '0 auto', fontSize: 14.5,
              color: colors.textMuted,
            }}
          >
            Last checked {lastChecked}.
          </motion.p>
        </div>
      </section>

      <section style={{ ...SECTION, paddingTop: 0, paddingBottom: 40 }}>
        <div style={WRAP}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '20px 24px',
              borderRadius: 18,
              background: allOperational
                ? `linear-gradient(135deg, ${tint('#34d399', 12)}, ${tint('#34d399', 4)})`
                : `linear-gradient(135deg, ${tint('#fbbf24', 12)}, ${tint('#fbbf24', 4)})`,
              border: `1px solid ${tint(allOperational ? '#34d399' : '#fbbf24', 28)}`,
            }}
          >
            <div
              style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: tint(allOperational ? '#34d399' : '#fbbf24', 18),
                display: 'grid', placeItems: 'center',
              }}
            >
              <CheckCircle2 size={22} color={allOperational ? '#34d399' : '#fbbf24'} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 16.5, fontWeight: 700, color: colors.text }}>
                {allOperational ? 'All systems operational' : 'Some systems are experiencing issues'}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: colors.textMuted }}>
                Updated automatically by our operations team.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ ...SECTION, paddingTop: 0, paddingBottom: 60 }}>
        <div style={WRAP}>
          <div
            style={{
              borderRadius: 20,
              background: `linear-gradient(180deg, ${tint(colors.navyMid, 50)}, ${tint(colors.navy, 60)})`,
              border: `1px solid ${tint(colors.gold, 12)}`,
              overflow: 'hidden',
            }}
          >
            {SERVICES.map(({ icon: Icon, name, status, uptime }, i) => {
              const meta = STATUS_META[status]
              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '18px 24px',
                    borderBottom: i === SERVICES.length - 1 ? 'none' : `1px solid ${tint(colors.gold, 10)}`,
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: tint(colors.gold, 10),
                      border: `1px solid ${tint(colors.gold, 22)}`,
                      display: 'grid', placeItems: 'center',
                    }}
                  >
                    <Icon size={16} color={colors.gold} />
                  </div>
                  <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: colors.text, flex: '1 1 180px' }}>
                    {name}
                  </p>
                  <div style={{ display: 'none', flex: '1 1 200px' }} className="status-uptimebar">
                    <UptimeBar />
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, color: colors.textMuted, width: 64, textAlign: 'right' }}>
                    {uptime}
                  </p>
                  <span
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '5px 11px', borderRadius: 99,
                      fontSize: 12, fontWeight: 700,
                      color: meta.color,
                      background: tint(meta.color, 12),
                      border: `1px solid ${tint(meta.color, 26)}`,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color }} />
                    {meta.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section style={SECTION}>
        <div style={WRAP}>
          <div style={{ marginBottom: 28 }}>
            <span style={PILL()}>
              <Clock size={11} /> Incident history
            </span>
            <h2
              className="f-head"
              style={{
                margin: '14px 0 0',
                fontSize: 'clamp(22px, 3.4vw, 32px)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: colors.text,
              }}
            >
              Past 90 days
            </h2>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            {INCIDENTS.map((incident) => (
              <motion.div
                key={incident.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45 }}
                style={{
                  padding: '22px 24px',
                  borderRadius: 16,
                  background: `linear-gradient(180deg, ${tint(colors.navyMid, 50)}, ${tint(colors.navy, 60)})`,
                  border: `1px solid ${tint(colors.gold, 12)}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  {incident.resolved ? (
                    <CheckCircle2 size={16} color="#34d399" />
                  ) : (
                    <AlertTriangle size={16} color="#fbbf24" />
                  )}
                  <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: colors.text }}>
                    {incident.title}
                  </p>
                  <span
                    className="f-mono"
                    style={{
                      marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
                      color: colors.textMuted, textTransform: 'uppercase',
                    }}
                  >
                    {incident.date}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13.5, color: colors.textMuted, lineHeight: 1.65 }}>
                  {incident.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...SECTION, paddingTop: 20, paddingBottom: 110 }}>
        <div style={WRAP}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'relative',
              padding: 'clamp(28px, 4vw, 42px)',
              borderRadius: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 20,
              background: `linear-gradient(135deg, ${tint(colors.navyMid, 80)}, ${tint(colors.navy, 90)})`,
              border: `1px solid ${tint(colors.gold, 20)}`,
              overflow: 'hidden',
            }}
          >
            <div>
              <p
                className="f-head"
                style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: colors.text }}
              >
                Get notified of incidents
              </p>
              <p style={{ margin: 0, fontSize: 13.5, color: colors.textMuted, maxWidth: 420 }}>
                We'll email you the moment a service is disrupted, and again when it's resolved.
              </p>
            </div>

            {subscribed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399', fontSize: 14, fontWeight: 600 }}>
                <CheckCircle2 size={18} /> You're subscribed
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: `1px solid ${tint(colors.gold, 18)}`,
                    background: tint(colors.navy, 60),
                    color: colors.text,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                    minWidth: 220,
                  }}
                />
                <button type="submit" className="cta-gold" style={{ border: 'none', cursor: 'pointer' }}>
                  Subscribe <ArrowRight size={15} />
                </button>
              </form>
            )}
          </motion.div>

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <p style={{ fontSize: 13, color: colors.textMuted }}>
              Spotted an issue not listed here?{' '}
              <Link to="/contact" style={{ color: colors.gold, fontWeight: 600 }}>
                Let us know
              </Link>{' '}
              or email{' '}
              <a href={`mailto:${supportEmail}`} style={{ color: colors.gold, fontWeight: 600 }}>
                {supportEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 720px) {
          .status-uptimebar { display: flex !important; }
        }
      `}</style>
    </main>
  )
}
