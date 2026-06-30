import SEO from '../components/SEO'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Download, FileText, Loader2, ShieldCheck, Mail } from 'lucide-react'
import { colors, tint, gradientText } from '../components/landing/theme'
import { generateLegalDocumentPdf } from '../utils/generateLegalPdf'

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

const PRIVACY_INTRO =
  'This Privacy Policy explains how VeloxZap Technologies Limited collects, uses, discloses, and protects your personal information when you use our website, mobile applications, and related services. ' +
  'By using VeloxZap, you consent to the practices described in this Policy.'

const SECTIONS = [
  {
    id: 'scope',
    title: '1. Scope of this policy',
    body: [
      'This Privacy Policy applies to all users of VeloxZap\'s website, mobile applications, APIs, and related services (collectively, the "Services"), and governs personal information processed in connection with gift card trading, airtime and data purchases, virtual account and wallet funding, bank withdrawals, digital asset trading, the VeloxZap virtual dollar card, savings plans, and bill payment services.',
      'This Policy is issued in accordance with the Nigeria Data Protection Act 2023 and the Nigeria Data Protection Regulation, and applies regardless of the device or platform you use to access the Services.',
    ],
  },
  {
    id: 'information-we-collect',
    title: '2. Information we collect',
    body: [
      'Identity and verification data: your full name, date of birth, phone number, email address, government-issued identification, selfie/biometric verification, proof of address, and source-of-funds information collected for KYC, AML, and sanctions-screening purposes. Your Bank Verification Number (BVN) and National Identification Number (NIN) are collected and verified on our behalf by our licensed KYC verification partner, not stored directly by VeloxZap, and are used solely to confirm your identity in line with regulatory requirements.',
      'Financial and transaction data: wallet balances, virtual account details issued through our payment partners Paystack, Flutterwave, and Monnify, bank account details used for withdrawals, gift card trade details, airtime and data purchase history, digital asset wallet addresses and trade history, virtual dollar card transaction data, savings plan details, and bill payment records (including electricity, cable TV, and betting account information).',
      'Technical and usage data: IP address, device identifiers, device type and operating system, browser type, log files, app usage patterns, crash reports, and approximate location derived from your IP address or device settings.',
      'Communications data: records of your correspondence with our support team, including emails, in-app chat messages, and call recordings where applicable, for quality assurance and dispute-resolution purposes.',
    ],
  },
  {
    id: 'how-we-collect',
    title: '3. How we collect information',
    body: [
      'Directly from you, when you register an account, complete identity verification, initiate a transaction, contact support, or otherwise interact with the Services.',
      'Automatically, through cookies, SDKs, and similar tracking technologies as you use our website and mobile applications, as further described in Section 9 (Cookies & tracking technologies).',
      'From third parties, including our payment partners (Paystack, Flutterwave, Monnify), our KYC verification partner (which collects and verifies your BVN and NIN on our behalf), card issuing partners, credit and fraud-screening bureaus, and publicly available sources, where necessary to verify your identity, assess risk, or facilitate a transaction.',
    ],
  },
  {
    id: 'how-we-use',
    title: '4. How we use your information',
    body: [
      'We use the information we collect to: (a) create and manage your account and verify your identity; (b) process gift card trades, airtime and data purchases, virtual account funding, withdrawals, digital asset trades, virtual dollar card transactions, savings plan activity, and bill payments; (c) detect, investigate, and prevent fraud, money laundering, and other prohibited activity; (d) comply with KYC, AML, CTF, tax, and other legal or regulatory obligations; (e) communicate with you about your account, transactions, security alerts, one-time passwords, and changes to our Services or policies; (f) provide customer support and resolve disputes; (g) analyze usage trends and develop, test, and improve new and existing Services; and (h) send you promotional or marketing communications, where you have not opted out.',
      'We do not use your BVN, NIN, or other sensitive verification data for any purpose other than identity verification, fraud prevention, and compliance with applicable law, and we do not sell this data to third parties.',
    ],
  },
  {
    id: 'legal-basis',
    title: '5. Legal basis for processing',
    body: [
      'We process your personal information on one or more of the following legal bases: your consent; the necessity of processing to perform our contract with you (these Terms and the provision of the Services); compliance with a legal obligation, including KYC/AML regulation; and our legitimate interests in operating, securing, and improving the Services, provided such interests are not overridden by your rights and freedoms.',
    ],
  },
  {
    id: 'sharing',
    title: '6. How we share your information',
    body: [
      'We share your information with our licensed payment partners, including Paystack, Flutterwave, and Monnify, to issue and manage your virtual account and process wallet funding; with partner banks and payment processors to facilitate withdrawals; with our card issuing partners to issue and operate the VeloxZap virtual dollar card; with identity verification and KYC service providers to confirm your identity; with blockchain networks as necessary to process digital asset transactions; and with regulators, law enforcement, or other governmental authorities where required by law, court order, or to investigate suspected fraud or illegal activity.',
      'We may also share information with cloud hosting, analytics, customer support, and fraud-prevention service providers who process data on our behalf and are contractually bound to protect it and use it only for the purposes we specify.',
      'If VeloxZap is involved in a merger, acquisition, reorganization, or sale of assets, your personal information may be transferred as part of that transaction, subject to confidentiality obligations and your continued protection under this Policy or a substantially similar one.',
      'We do not sell your personal information to third parties for their own independent marketing purposes.',
    ],
  },
  {
    id: 'international-transfers',
    title: '7. International data transfers',
    body: [
      'Some of our service providers and payment partners may process or store data outside Nigeria. Where we transfer personal information outside Nigeria, we take reasonable steps to ensure the recipient provides an adequate level of protection consistent with the Nigeria Data Protection Act 2023, including through contractual safeguards.',
    ],
  },
  {
    id: 'retention',
    title: '8. Data retention',
    body: [
      'We retain your personal information for as long as your account remains active and for a reasonable period thereafter to comply with legal, regulatory, accounting, tax, and dispute-resolution obligations, including the minimum record-retention periods required under applicable AML and KYC regulations.',
      'When personal information is no longer required for these purposes, we securely delete, anonymize, or archive it in accordance with our internal data retention procedures.',
    ],
  },
  {
    id: 'cookies',
    title: '9. Cookies & tracking technologies',
    body: [
      'We use cookies, mobile SDKs, and similar tracking technologies to keep you signed in, remember your preferences, understand how you use the Services, and improve performance and security. You can manage cookie preferences through your browser settings, though disabling certain cookies may limit functionality of the Services.',
    ],
  },
  {
    id: 'security',
    title: '10. Data security',
    body: [
      'We implement administrative, technical, and physical safeguards designed to protect your personal information, including encryption of data in transit and at rest, access controls, and regular security reviews. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
      'You play a critical role in protecting your own data by safeguarding your login credentials, transaction PIN, and device, and by promptly notifying us at support@veloxzap.com of any suspected unauthorized access to your account.',
    ],
  },
  {
    id: 'your-rights',
    title: '11. Your rights',
    body: [
      'Subject to applicable law, you have the right to: access the personal information we hold about you; request correction of inaccurate or incomplete information; request deletion of your information, subject to our legal and regulatory retention obligations; object to or restrict certain processing; withdraw consent where processing is based on consent, without affecting the lawfulness of processing carried out before withdrawal; and lodge a complaint with the Nigeria Data Protection Commission.',
      'You may exercise these rights by contacting us at support@veloxzap.com. We will respond to verified requests within the timeframe required by applicable law.',
    ],
  },
  {
    id: 'children',
    title: '12. Children\'s privacy',
    body: [
      'The Services are not directed to, and we do not knowingly collect personal information from, individuals under the age of 18. If we become aware that we have collected personal information from a minor without appropriate consent, we will take steps to delete that information.',
    ],
  },
  {
    id: 'third-party-links',
    title: '13. Third-party links & services',
    body: [
      'The Services may contain links to or integrations with third-party websites, platforms, or services, including our payment, card-issuing, and identity-verification partners. This Policy does not apply to the privacy practices of those third parties, and we encourage you to review their respective privacy policies.',
    ],
  },
  {
    id: 'changes',
    title: '14. Changes to this policy',
    body: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. Material changes will be communicated via email or in-app notice at least seven (7) days before taking effect, except where an immediate change is required by law.',
      'Your continued use of the Services after the effective date of any change constitutes your acceptance of the revised Policy.',
    ],
  },
  {
    id: 'contact',
    title: '15. Contact us',
    body: [
      'If you have questions, concerns, or requests regarding this Privacy Policy or our handling of your personal information, contact our support team at support@veloxzap.com or through the Contact page. For formal data-protection inquiries, correspondence should be addressed to the Data Protection Officer, VeloxZap Technologies Limited.',
    ],
  },
]

export default function Privacy() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(false)

  function handleNavClick(id) {
    setActiveId(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleDownload() {
    if (downloading) return
    setDownloading(true)
    setDownloadError(false)
    try {
      await generateLegalDocumentPdf({
        title: 'Privacy Policy',
        lastUpdated: LAST_UPDATED,
        intro: PRIVACY_INTRO,
        sections: SECTIONS,
        fileName: 'veloxzap-privacy-policy.pdf',
      })
    } catch {
      setDownloadError(true)
    } finally {
      setDownloading(false)
    }
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
        title="VeloxZap Privacy Policy — How We Handle Your Data"
        description="Understand how VeloxZap collects, stores, and protects your personal and financial data in compliance with Nigerian data protection regulations."
        path="/privacy"
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
              <ShieldCheck size={11} /> Privacy
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
            Privacy{' '}
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
            Last updated {LAST_UPDATED}. Here's how we collect, use, and protect your information.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 26 }}
          >
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="cta-gold"
              style={{ border: 'none', cursor: downloading ? 'default' : 'pointer', opacity: downloading ? 0.75 : 1 }}
            >
              {downloading ? (
                <>
                  <Loader2 size={16} className="privacy-spin" /> Preparing PDF…
                </>
              ) : (
                <>
                  <Download size={16} /> Download as PDF
                </>
              )}
            </button>
            {downloadError && (
              <span style={{ fontSize: 12, color: '#f06a6a' }}>
                Could not generate the PDF. Please try again.
              </span>
            )}
          </motion.div>
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
            className="privacy-grid"
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
              className="privacy-nav"
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

              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  marginTop: 12, padding: '9px 12px',
                  borderRadius: 10,
                  border: `1px solid ${tint(colors.gold, 26)}`,
                  background: tint(colors.gold, 10),
                  color: colors.gold,
                  fontSize: 12, fontWeight: 700,
                  cursor: downloading ? 'default' : 'pointer',
                  opacity: downloading ? 0.7 : 1,
                }}
              >
                {downloading ? <Loader2 size={13} className="privacy-spin" /> : <Download size={13} />}
                {downloading ? 'Preparing…' : 'Download PDF'}
              </button>
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
                      Questions about your privacy?
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
          .privacy-grid { grid-template-columns: 1fr !important; }
          .privacy-nav { position: relative !important; top: 0 !important; max-height: none !important; }
        }
        .privacy-spin { animation: privacy-spin 0.8s linear infinite; }
        @keyframes privacy-spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  )
}
