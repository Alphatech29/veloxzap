import SEO from '../components/SEO'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, FileText, Cookie, Mail } from 'lucide-react'
import { colors, tint, gradientText } from '../components/landing/theme'

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

const LAST_UPDATED = 'June 1, 2026'

const SECTIONS = [
  {
    id: 'what-are-cookies',
    title: '1. What are cookies?',
    body: [
      'Cookies are small text files placed on your device when you visit a website. They are widely used to make websites function more efficiently, remember your preferences, and provide information to the site owner. Mobile applications use comparable technologies, such as SDKs and local device storage, to achieve similar purposes.',
    ],
  },
  {
    id: 'how-we-use-cookies',
    title: '2. How we use cookies',
    body: [
      'We use cookies and similar technologies on the VeloxZap website and mobile applications to: (a) keep you signed in and maintain your session while you trade gift cards, buy airtime and data, fund your wallet, withdraw funds, trade digital assets, manage your virtual dollar card, or manage your savings plans and bill payments; (b) remember your preferences, such as language and display settings; (c) understand how visitors use our Services so we can improve performance, usability, and security; (d) detect and prevent fraud and unauthorized account access; and (e) measure the effectiveness of our marketing and communications.',
    ],
  },
  {
    id: 'categories',
    title: '3. Categories of cookies we use',
    body: [
      'Strictly necessary cookies: required for core functionality, including keeping you logged in, maintaining session security, and enabling transaction flows such as wallet funding and withdrawals. These cannot be disabled without affecting the Services.',
      'Performance and analytics cookies: help us understand how users interact with the Services, which pages are visited most, and where errors occur, so we can identify and fix issues and improve features.',
      'Functional cookies: remember choices you make, such as display preferences, to provide a more personalized experience on return visits.',
      'Marketing and advertising cookies: used, where applicable, to measure the effectiveness of our campaigns and to deliver more relevant communications. These are only set with your consent where required by law.',
    ],
  },
  {
    id: 'third-party-cookies',
    title: '4. Third-party cookies',
    body: [
      'Some cookies and tracking technologies on our website and mobile applications are placed by third parties that support our Services, including our payment partners (Paystack, Flutterwave, and Monnify), analytics providers, and fraud-prevention and security service providers. These third parties may use cookies to recognize your device and provide their services to us; their use of cookies is governed by their own privacy and cookie policies, not this Policy.',
    ],
  },
  {
    id: 'managing-cookies',
    title: '5. Managing your cookie preferences',
    body: [
      'Most web browsers allow you to control cookies through their settings, including blocking or deleting cookies already stored on your device. You can also manage certain mobile app tracking permissions through your device\'s privacy settings.',
      'Please note that disabling strictly necessary cookies may prevent you from signing in or using core features of the Services, including wallet funding, withdrawals, and transaction processing. Disabling performance or marketing cookies will not affect your ability to use core features of the Services.',
    ],
  },
  {
    id: 'retention',
    title: '6. How long cookies last',
    body: [
      'Session cookies are temporary and are deleted when you close your browser or app. Persistent cookies remain on your device for a set period or until you delete them, and are used to remember your preferences or recognize you on return visits.',
    ],
  },
  {
    id: 'changes',
    title: '7. Changes to this policy',
    body: [
      'We may update this Cookie Policy from time to time to reflect changes in the cookies and technologies we use or for other operational, legal, or regulatory reasons. Material changes will be communicated via email or in-app notice at least seven (7) days before taking effect, except where an immediate change is required by law.',
      'Your continued use of the Services after the effective date of any change constitutes your acceptance of the revised Policy.',
    ],
  },
  {
    id: 'contact',
    title: '8. Contact us',
    body: [
      'If you have questions about this Cookie Policy or how we use cookies and similar technologies, contact our support team at support@veloxzap.com or through the Contact page.',
    ],
  },
]

export default function CookiePolicy() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id)

  function handleNavClick(id) {
    setActiveId(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
        title="VeloxZap Cookie Policy — What Cookies We Use & Why"
        description="Learn which cookies VeloxZap uses, why we use them, and how you can manage your cookie preferences on our platform."
        path="/cookies"
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

      <section style={{ ...SECTION, paddingTop: 60, paddingBottom: 50 }}>
        <div style={{ ...WRAP, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={PILL(true)}>
              <Cookie size={11} /> Cookies
            </span>
          </motion.div>

          <motion.h1
            className="f-head"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            style={{
              margin: '20px auto 14px',
              maxWidth: 760,
              fontSize: 'clamp(32px, 5.4vw, 58px)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              color: colors.text,
            }}
          >
            Cookie{' '}
            <span style={gradientText(`linear-gradient(110deg, ${colors.gold}, ${colors.champagne}, ${colors.gold})`)}>
              Policy
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            style={{
              maxWidth: 560, margin: '0 auto', fontSize: 14.5,
              color: colors.textMuted,
            }}
          >
            Last updated {LAST_UPDATED}. Here's how we use cookies and similar technologies.
          </motion.p>
        </div>
      </section>

      <section style={{ ...SECTION, paddingTop: 0, paddingBottom: 100 }}>
        <div style={WRAP}>
          <div
            style={{
              display: 'grid',
              gap: 40,
              gridTemplateColumns: '240px 1fr',
            }}
            className="cookie-grid"
          >
            <motion.nav
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'sticky',
                top: 110,
                alignSelf: 'start',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: '18px 16px',
                borderRadius: 16,
                background: tint(colors.navyMid, 45),
                border: `1px solid ${tint(colors.gold, 12)}`,
                maxHeight: 'calc(100vh - 150px)',
                overflowY: 'auto',
              }}
              className="cookie-nav"
            >
              <p
                className="f-mono"
                style={{
                  margin: '0 0 8px', fontSize: 10.5, fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: colors.textMuted,
                }}
              >
                On this page
              </p>
              {SECTIONS.map(({ id, title }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavClick(id)}
                  style={{
                    textAlign: 'left',
                    padding: '7px 10px',
                    borderRadius: 9,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 12.5,
                    lineHeight: 1.4,
                    fontWeight: activeId === id ? 700 : 500,
                    color: activeId === id ? colors.gold : colors.textMuted,
                    background: activeId === id ? tint(colors.gold, 10) : 'transparent',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  {title}
                </button>
              ))}
            </motion.nav>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {SECTIONS.map(({ id, title, body }, i) => (
                <motion.article
                  key={id}
                  id={id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.03, 0.3) }}
                  style={{
                    scrollMarginTop: 110,
                    padding: '28px 28px',
                    borderRadius: 18,
                    background: `linear-gradient(180deg, ${tint(colors.navyMid, 50)}, ${tint(colors.navy, 60)})`,
                    border: `1px solid ${tint(colors.gold, 12)}`,
                  }}
                >
                  <h2
                    className="f-head"
                    style={{
                      margin: '0 0 12px',
                      fontSize: 19, fontWeight: 700,
                      color: colors.text, letterSpacing: '-0.01em',
                    }}
                  >
                    {title}
                  </h2>
                  {body.map((para, pi) => (
                    <p
                      key={pi}
                      style={{
                        margin: pi === body.length - 1 ? 0 : '0 0 12px',
                        fontSize: 14, lineHeight: 1.75, color: colors.textMuted,
                      }}
                    >
                      {para}
                    </p>
                  ))}
                </motion.article>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5 }}
                style={{
                  marginTop: 8,
                  padding: '26px 28px',
                  borderRadius: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 16,
                  background: `linear-gradient(135deg, ${tint(colors.navyMid, 80)}, ${tint(colors.navy, 90)})`,
                  border: `1px solid ${tint(colors.gold, 20)}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: tint(colors.gold, 12),
                      border: `1px solid ${tint(colors.gold, 26)}`,
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                    }}
                  >
                    <FileText size={18} color={colors.gold} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: colors.text }}>
                      Questions about our use of cookies?
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 12.5, color: colors.textMuted }}>
                      Our support team is happy to clarify anything before you sign up.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Link to="/contact" className="cta-gold">
                    Contact support <ArrowRight size={16} />
                  </Link>
                  <a href="mailto:support@veloxzap.com" className="cta-ghost">
                    <Mail size={14} /> Email us
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .cookie-grid { grid-template-columns: 1fr !important; }
          .cookie-nav { position: relative !important; top: 0 !important; max-height: none !important; }
        }
      `}</style>
    </main>
  )
}
