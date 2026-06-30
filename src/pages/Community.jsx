import SEO from '../components/SEO'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Users, ShieldAlert, MessageCircleHeart, Megaphone,
  Sparkles, CheckCircle2, XCircle, Lightbulb,
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

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={props.size || 18} height={props.size || 18} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
)
const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={props.size || 18} height={props.size || 18} aria-hidden="true">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12z" />
  </svg>
)
const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={props.size || 18} height={props.size || 18} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
const TelegramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={props.size || 18} height={props.size || 18} aria-hidden="true">
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
  </svg>
)

const TELEGRAM_URL = 'https://t.me/veloxzap'

function getChannels(settings) {
  return [
    {
      icon: TelegramIcon,
      label: 'Telegram',
      desc: 'Live chat with fellow users, instant rate alerts, and product announcements.',
      sub: 'Most active',
      href: settings?.telegram_url || 'https://t.me/veloxzap',
    },
    {
      icon: TwitterIcon,
      label: 'X / Twitter',
      desc: 'Service updates, rate drops, and quick replies from our team.',
      sub: 'Daily updates',
      href: settings?.twitter_url || 'https://twitter.com/veloxzap',
    },
    {
      icon: InstagramIcon,
      label: 'Instagram',
      desc: 'Behind-the-scenes, giveaways, and feature walkthroughs.',
      sub: 'Visual updates',
      href: settings?.instagram_url || 'https://instagram.com/veloxzap',
    },
    {
      icon: FacebookIcon,
      label: 'Facebook',
      desc: 'Community discussions and customer stories from across Nigeria.',
      sub: 'Discussions',
      href: settings?.facebook_url || 'https://facebook.com/veloxzap',
    },
    {
      icon: LinkedinIcon,
      label: 'LinkedIn',
      desc: 'Company news, partnerships, and career opportunities.',
      sub: 'Company news',
      href: settings?.linkedin_url || 'https://linkedin.com/company/veloxzap',
    },
  ]
}

const DOS = [
  'Share genuine feedback, tips, and questions about gift card trading, airtime/data, savings, or bill payments.',
  'Report suspicious accounts, scam links, or impersonators to our team immediately.',
  'Help newcomers find their footing — we were all new once.',
  'Keep transaction disputes private and route them to official support, not public chat.',
]

const DONTS = [
  'Share your password, transaction PIN, OTP, or BVN/NIN with anyone — including accounts claiming to be VeloxZap staff.',
  'Trust unsolicited DMs offering "rate boosts," giveaways, or investment schemes in our name.',
  'Post spam, unrelated promotions, or referral-link flooding.',
  'Use the community to give or solicit unlicensed financial, investment, or trading advice.',
]

export default function Community() {
  const { settings } = useSettings()
  const channels = getChannels(settings)
  const securityEmail = settings?.support_email || 'security@veloxzap.com'

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
        title="VeloxZap Community — Join Our Channels & Stay Updated"
        description="Connect with the VeloxZap community on WhatsApp, Telegram, X and Instagram. Get updates, tips, and support from fellow users and our team."
        path="/community"
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

      <section style={{ ...SECTION, paddingTop: 60, paddingBottom: 60 }}>
        <div style={{ ...WRAP, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={PILL(true)}>
              <Users size={11} /> Community
            </span>
          </motion.div>

          <motion.h1
            className="f-head"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            style={{
              margin: '20px auto 18px',
              maxWidth: 820,
              fontSize: 'clamp(34px, 5.8vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: '-0.04em',
              color: colors.text,
            }}
          >
            500,000+ Nigerians,{' '}
            <span style={gradientText(`linear-gradient(110deg, ${colors.gold}, ${colors.champagne}, ${colors.gold})`)}>
              one conversation.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            style={{
              maxWidth: 600, margin: '0 auto',
              fontSize: 16, lineHeight: 1.7,
              color: colors.textMuted,
            }}
          >
            Trade tips, rate alerts, and real talk with people who use VeloxZap every day. Pick the
            channel that fits you below.
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
            {channels.map(({ icon: Icon, label, desc, sub, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.borderColor = tint(colors.gold, 30)
                  e.currentTarget.style.boxShadow = `0 18px 48px ${tint('black', 40)}, 0 0 32px ${tint(colors.gold, 12)}, inset 0 1px 0 ${tint('white', 6)}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = tint(colors.gold, 14)
                  e.currentTarget.style.boxShadow = `0 12px 40px ${tint('black', 30)}, inset 0 1px 0 ${tint('white', 5)}`
                }}
              >
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
                      color: colors.gold,
                    }}
                  >
                    <Icon size={18} />
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
                  className="f-head"
                  style={{
                    margin: '0 0 8px',
                    fontSize: 16, fontWeight: 700,
                    color: colors.text, letterSpacing: '-0.01em',
                  }}
                >
                  {label}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>
                  {desc}
                </p>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      <section style={SECTION}>
        <div style={WRAP}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={PILL()}>
              <ShieldAlert size={11} /> Community guidelines
            </span>
            <h2
              className="f-head"
              style={{
                margin: '18px auto 14px',
                maxWidth: 700,
                fontSize: 'clamp(28px, 4.4vw, 46px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: colors.text,
              }}
            >
              Keep it useful.{' '}
              <span style={gradientText(goldGrad)}>Keep it safe.</span>
            </h2>
            <p style={{ maxWidth: 560, margin: '0 auto', fontSize: 15.5, color: colors.textMuted, lineHeight: 1.7 }}>
              VeloxZap staff will never DM you first to ask for your PIN, OTP, password, BVN, or
              NIN. If anyone does, report and block them.
            </p>
          </div>

          <div
            style={{
              display: 'grid', gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55 }}
              style={{
                position: 'relative',
                padding: 28,
                borderRadius: 20,
                background: `linear-gradient(180deg, ${tint(colors.navyMid, 60)}, ${tint(colors.navy, 70)})`,
                border: `1px solid ${tint(colors.gold, 16)}`,
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 11,
                    background: tint(colors.gold, 12),
                    border: `1px solid ${tint(colors.gold, 26)}`,
                    display: 'grid', placeItems: 'center',
                  }}
                >
                  <CheckCircle2 size={18} color={colors.gold} />
                </div>
                <h3 className="f-head" style={{ margin: 0, fontSize: 17, fontWeight: 700, color: colors.text }}>
                  Do
                </h3>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 12 }}>
                {DOS.map((item) => (
                  <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, lineHeight: 1.6, color: colors.textMuted }}>
                    <CheckCircle2 size={15} color={colors.gold} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.08 }}
              style={{
                position: 'relative',
                padding: 28,
                borderRadius: 20,
                background: `linear-gradient(180deg, ${tint(colors.navyMid, 60)}, ${tint(colors.navy, 70)})`,
                border: `1px solid ${tint('#f87171', 18)}`,
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 11,
                    background: tint('#f87171', 12),
                    border: `1px solid ${tint('#f87171', 26)}`,
                    display: 'grid', placeItems: 'center',
                  }}
                >
                  <XCircle size={18} color="#f87171" />
                </div>
                <h3 className="f-head" style={{ margin: 0, fontSize: 17, fontWeight: 700, color: colors.text }}>
                  Don't
                </h3>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 12 }}>
                {DONTS.map((item) => (
                  <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, lineHeight: 1.6, color: colors.textMuted }}>
                    <XCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              marginTop: 16,
              padding: '18px 22px',
              borderRadius: 16,
              display: 'flex', alignItems: 'center', gap: 12,
              background: tint('#f87171', 6),
              border: `1px solid ${tint('#f87171', 18)}`,
            }}
          >
            <Lightbulb size={18} color="#f87171" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 13.5, color: colors.textMuted, lineHeight: 1.6 }}>
              Spotted a scam account or suspicious message claiming to be VeloxZap? Report it to{' '}
              <a href={`mailto:${securityEmail}`} style={{ color: colors.text, fontWeight: 600 }}>
                {securityEmail}
              </a>{' '}
              right away.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ ...SECTION, paddingTop: 30, paddingBottom: 110 }}>
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
                <MessageCircleHeart size={11} /> Join the conversation
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
                Your fellow traders{' '}
                <span style={gradientText(goldGrad)}>are waiting.</span>
              </h2>
              <p style={{ margin: 0, fontSize: 15, color: colors.textMuted, lineHeight: 1.7, maxWidth: 460 }}>
                Hop into Telegram for live rate talk, or follow us on socials for daily updates and
                announcements.
              </p>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="cta-gold">
                Join on Telegram <ArrowRight size={16} />
              </a>
              <Link to="/contact" className="cta-ghost">
                <Sparkles size={15} /> Contact support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
