import SEO from '../components/SEO'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Download, FileText, Loader2, Scale, Mail } from 'lucide-react'
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

const TERMS_INTRO =
  'This document sets out the Terms of Service governing access to and use of the VeloxZap platform. ' +
  'It is a legally binding agreement between you and VeloxZap Technologies Limited — please read it carefully before using our services.'

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of terms',
    body: [
      'These Terms of Service ("Terms") constitute a legally binding agreement between you ("you", "User") and VeloxZap Technologies Limited, a company incorporated under the laws of the Federal Republic of Nigeria ("VeloxZap", "Company", "we", "us", or "our"), governing your access to and use of VeloxZap\'s website, mobile applications, APIs, and related services (collectively, the "Services").',
      'By creating an account, clicking "I agree", or accessing or using the Services in any way, you acknowledge that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and any product-specific terms incorporated by reference. If you do not agree to every part of these Terms, you must immediately discontinue use of the Services.',
      'If you are using the Services on behalf of an entity, you represent and warrant that you have the authority to bind that entity, in which case "you" refers to that entity.',
    ],
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    body: [
      'You must be at least 18 years old, possess the legal capacity to enter into a binding contract under applicable law, and not be barred from receiving the Services under the laws of Nigeria or any other applicable jurisdiction, including sanctions, anti-terrorism, or anti-money-laundering laws.',
      'By registering, you represent and warrant that all information you provide is true, accurate, current, and complete, and that you will promptly update such information to keep it accurate. VeloxZap is entitled to rely on the information you provide and bears no responsibility for losses arising from inaccurate, outdated, or fraudulent information supplied by you.',
      'VeloxZap reserves the right, in its sole discretion and without liability, to refuse to open an account, to decline any transaction, or to terminate an existing account if eligibility, verification, or risk-screening requirements are not met or are no longer satisfied.',
    ],
  },
  {
    id: 'account',
    title: '3. Account registration & security',
    body: [
      'You are solely responsible for maintaining the confidentiality and security of your login credentials, transaction PIN, one-time passwords, biometric data enrolment, and any device used to access your account. All actions taken through your account, whether or not authorized by you, are deemed to be taken by you.',
      'You agree to notify VeloxZap immediately at support@veloxzap.com of any unauthorized access, security breach, or suspected compromise of your account. VeloxZap shall not be liable for any loss or damage arising from your failure to comply with this section, your failure to safeguard your credentials, or your failure to notify us promptly of unauthorized use.',
      'VeloxZap reserves the right to require additional verification steps, including step-up authentication or temporary account holds, at any time it deems necessary to protect you, other users, or the integrity of the Services.',
    ],
  },
  {
    id: 'kyc',
    title: '4. Identity verification, KYC, AML & sanctions compliance',
    body: [
      'As a financial service provider operating in Nigeria, VeloxZap is required by law to verify the identity of its users in accordance with Know Your Customer (KYC), Anti-Money Laundering (AML), Counter-Terrorism Financing (CTF), and applicable sanctions regulations. We may request documents including, but not limited to, your Bank Verification Number (BVN), National Identification Number (NIN), government-issued identification, proof of address, source-of-funds declarations, or selfie verification.',
      'You represent and warrant that you are not, and are not acting on behalf of, any person or entity that is the subject of sanctions administered by the United Nations, the Central Bank of Nigeria, the U.S. Office of Foreign Assets Control, the European Union, or any other applicable sanctions authority.',
      'Transaction and wallet limits are tied to your verification tier and may be revised at any time. VeloxZap reserves the right, without liability or prior notice, to suspend, restrict, freeze, or terminate any account, and to refuse, delay, or reverse any transaction, where verification is incomplete, where suspicious or unusual activity is detected, or where required to comply with a legal, regulatory, or law-enforcement obligation. We may report suspicious activity to the appropriate regulatory or law-enforcement authorities without notifying you, as required or permitted by law.',
    ],
  },
  {
    id: 'services',
    title: '5. Services provided "as is"',
    body: [
      'VeloxZap provides a range of digital financial services, including but not limited to: (a) trading gift cards for cash; (b) purchasing airtime and data bundles for MTN, Airtel, Glo, and T2mobile; (c) wallet funding via a dedicated virtual bank account assigned to each user and securely managed by our licensed payment partners, including Paystack, Flutterwave, and Monnify; (d) withdrawing funds to any Nigerian bank account; (e) trading and converting digital assets (cryptocurrency) into cash; (f) a virtual dollar card for payments on platforms and merchants that support global transactions; (g) savings products, including Fixed Savings, Safe Savings, and Target Savings plans; and (h) bill payment services, including electricity bills, cable TV subscriptions, and betting account funding.',
      'Availability of specific features may vary by region, device, or verification tier, and may be added, modified, suspended, or discontinued at any time, with or without notice, at VeloxZap\'s sole discretion.',
      'THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR THAT THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE. You acknowledge that internet-based and mobile services may be subject to interruptions and delays beyond VeloxZap\'s control.',
    ],
  },
  {
    id: 'fees',
    title: '6. Fees, pricing & taxes',
    body: [
      'Applicable fees, exchange rates, and charges for each Service are displayed within the app prior to transaction confirmation. Rates for gift card trading and crypto swap are determined by prevailing market conditions, our internal risk pricing, and liquidity, and may fluctuate without notice.',
      'By confirming a transaction, you accept the fee and rate shown at that moment as final. Except as required by applicable law or expressly stated in these Terms, all fees are non-refundable and VeloxZap will not retroactively adjust completed transactions due to subsequent rate or market changes, technical errors discovered after settlement, or buyer\'s remorse.',
      'You are solely responsible for determining and paying any taxes applicable to your use of the Services, including taxes on gains from crypto swap or gift card trading, in accordance with the laws of your jurisdiction. VeloxZap does not provide tax, legal, or financial advice.',
    ],
  },
  {
    id: 'risk',
    title: '7. Risk disclosure — crypto & gift cards',
    body: [
      'Trading in cryptocurrency and gift cards carries substantial risk, including but not limited to price volatility, market illiquidity, regulatory changes, irreversible transactions, and the risk of total loss. VeloxZap does not guarantee any rate of return and is not responsible for losses resulting from market movements occurring before, during, or after a transaction is submitted.',
      'You acknowledge that digital assets are not legal tender, are not insured by any government deposit insurance scheme, and that blockchain transactions, once confirmed, generally cannot be reversed, cancelled, or refunded. You assume full responsibility for verifying wallet addresses, gift card authenticity, and transaction details before submission.',
      'VeloxZap is not a financial, investment, or tax advisor. Nothing on the platform constitutes investment advice or a recommendation to buy, sell, or hold any asset. You should conduct your own due diligence and consult independent professional advisors before transacting.',
    ],
  },
  {
    id: 'conduct',
    title: '8. User conduct & prohibited activities',
    body: [
      'You agree not to use the Services for any unlawful purpose, including fraud, money laundering, terrorism financing, tax evasion, or the trading of stolen, counterfeit, or fraudulently obtained gift cards, payment instruments, or digital assets.',
      'You further agree not to: (a) attempt to circumvent transaction limits, verification checks, fraud controls, or security measures; (b) use bots, scrapers, or automated means to access or interact with the Services without prior written authorization; (c) reverse-engineer, decompile, or attempt to extract the source code of any part of the Services; (d) impersonate any person or misrepresent your affiliation with any person or entity; (e) interfere with or disrupt the integrity or performance of the Services or any data contained therein; or (f) use the Services to transmit malware or engage in any activity that exposes VeloxZap or other users to liability or harm.',
      'Violation of this section may result in immediate suspension or termination of your account, forfeiture of funds connected to the violation to the extent permitted by law, and referral to law enforcement or regulatory authorities.',
    ],
  },
  {
    id: 'transactions',
    title: '9. Transactions, settlement & finality',
    body: [
      'Wallet credits, gift card trades, airtime and data purchases, bill payments, and digital asset trades are processed upon successful verification of the submitted item or instruction. Processing and settlement times vary by transaction type and are indicative only, as communicated within the app, and are not guaranteed.',
      'VeloxZap reserves the right, in its sole discretion, to decline, delay, suspend, reverse, or place a hold on any transaction or related funds that it reasonably suspects to be fraudulent, erroneous, made in error, in violation of these Terms, or connected to prohibited activity, pending investigation, without liability to you for any resulting loss, save as required by applicable law.',
      'Once a transaction has been confirmed and settled in accordance with our internal controls, it is final and irreversible, except where required by law or where VeloxZap, in its sole discretion, elects to investigate or correct a verifiable system error.',
    ],
  },
  {
    id: 'savings',
    title: '10. Savings products & virtual cards',
    body: [
      'Our Fixed Savings, Safe Savings, and Target Savings plans are subject to the specific interest rates, lock periods, and withdrawal conditions presented and accepted at the time of plan creation, which form part of these Terms by reference. Early withdrawal from a locked savings plan may result in forfeiture of accrued interest and, where disclosed, an early-withdrawal fee.',
      'Interest rates on savings products are not guaranteed for future periods and may be revised by VeloxZap prospectively, with notice provided through the app, in line with prevailing market and regulatory conditions.',
      'The VeloxZap virtual dollar card, issued through our card issuing partners, is subject to the issuer\'s own terms and conditions in addition to these Terms, including funding limits, expiry, permitted merchant categories, and chargeback rules, and may be used for payments on platforms and merchants that accept international card transactions. VeloxZap is not liable for declines, holds, or restrictions imposed by card networks, issuers, or merchants beyond our control.',
    ],
  },
  {
    id: 'ip',
    title: '11. Intellectual property',
    body: [
      'All rights, title, and interest in and to the Services, including the VeloxZap name, logo, trademarks, software, design, and all content (excluding user-submitted content), are and remain the exclusive property of VeloxZap or its licensors. Nothing in these Terms grants you any right or license to use VeloxZap\'s intellectual property except as strictly necessary to use the Services as intended.',
      'By submitting content to VeloxZap (such as support correspondence or feedback), you grant VeloxZap a non-exclusive, worldwide, royalty-free, perpetual license to use, reproduce, and adapt such content for the purpose of operating, improving, and promoting the Services.',
    ],
  },
  {
    id: 'third-party',
    title: '12. Third-party services',
    body: [
      'The Services rely on and integrate with third-party providers to operate certain features, including, without limitation: virtual account issuance and wallet funding through our payment partners Paystack, Flutterwave, and Monnify; bank transfer and withdrawal rails operated by partner banks and payment processors; card issuance for the VeloxZap virtual dollar card through our card issuing partners; blockchain networks for digital asset transactions; and identity verification providers used for KYC checks. VeloxZap does not control these third parties and is not responsible or liable for their acts, omissions, errors, outages, or policies, although we will use commercially reasonable efforts to select and monitor reputable partners.',
    ],
  },
  {
    id: 'suspension',
    title: '13. Suspension & termination',
    body: [
      'VeloxZap may suspend, restrict, or terminate your access to the Services, in whole or in part, with or without prior notice, if we reasonably believe you have violated these Terms, engaged in fraudulent or suspicious activity, exposed VeloxZap or other users to risk, or where required by a court order, regulator, or law-enforcement directive. To the fullest extent permitted by law, VeloxZap shall not be liable to you for any such suspension, restriction, or termination.',
      'You may close your account at any time by contacting support, subject to settlement of any pending transactions, outstanding obligations, or ongoing investigations. Verified outstanding wallet balances will be made available for withdrawal following completion of standard account-closure verification and compliance checks.',
      'Provisions of these Terms that by their nature should survive termination — including but not limited to intellectual property, disclaimers, indemnification, limitation of liability, and dispute resolution — shall survive any termination or expiration of these Terms.',
    ],
  },
  {
    id: 'liability',
    title: '14. Limitation of liability',
    body: [
      'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL VELOXZAP, ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES, EVEN IF VELOXZAP HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.',
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, VELOXZAP\'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE GREATER OF (A) THE TOTAL FEES YOU PAID TO VELOXZAP IN THE SIX (6) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR (B) FIFTY THOUSAND NAIRA (₦50,000).',
      'Nothing in these Terms limits or excludes liability for fraud, gross negligence, wilful misconduct, death or personal injury caused by negligence, or any other liability that cannot lawfully be limited or excluded under the laws of Nigeria.',
    ],
  },
  {
    id: 'indemnity',
    title: '15. Indemnification',
    body: [
      'You agree to indemnify, defend, and hold harmless VeloxZap, its directors, officers, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or related to: (a) your breach of these Terms; (b) your violation of any law or the rights of a third party; (c) your use or misuse of the Services; or (d) any content or instructions you submit through the Services.',
    ],
  },
  {
    id: 'force-majeure',
    title: '16. Force majeure',
    body: [
      'VeloxZap shall not be liable for any failure or delay in performance resulting from causes beyond its reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, civil unrest, government action or regulatory changes, internet or telecommunications failures, power outages, blockchain network congestion or failure, or failures of third-party banking or payment infrastructure.',
    ],
  },
  {
    id: 'dispute',
    title: '17. Dispute resolution, arbitration & class action waiver',
    body: [
      'Before initiating any formal proceeding, you agree to first contact VeloxZap support and attempt in good faith to resolve any dispute informally within thirty (30) days.',
      'Any dispute, controversy, or claim arising out of or relating to these Terms or the Services that cannot be resolved informally shall be referred to and finally resolved by arbitration administered under the Arbitration and Mediation Act of Nigeria, seated in Lagos, Nigeria, conducted in English, by a sole arbitrator. The arbitral award shall be final and binding on the parties.',
      'TO THE EXTENT PERMITTED BY LAW, YOU AGREE THAT ANY PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT AS A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. Nothing in this section prevents either party from seeking urgent injunctive relief from a court of competent jurisdiction where necessary to protect its rights.',
    ],
  },
  {
    id: 'law',
    title: '18. Governing law & jurisdiction',
    body: [
      'These Terms and any dispute or claim arising out of or in connection with them are governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict-of-law principles. Subject to Section 17 (Dispute Resolution), the courts of Lagos State and Osun State, Nigeria shall have exclusive jurisdiction over any matter not subject to arbitration.',
    ],
  },
  {
    id: 'general',
    title: '19. General provisions',
    body: [
      'Severability: If any provision of these Terms is held invalid or unenforceable, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.',
      'Entire agreement: These Terms, together with our Privacy Policy and any product-specific terms referenced herein, constitute the entire agreement between you and VeloxZap regarding the Services, superseding any prior agreements.',
      'No waiver: VeloxZap\'s failure to enforce any right or provision of these Terms shall not constitute a waiver of that right or provision.',
      'Assignment: You may not assign or transfer your rights or obligations under these Terms without VeloxZap\'s prior written consent. VeloxZap may assign these Terms, in whole or in part, without restriction, including in connection with a merger, acquisition, or sale of assets.',
      'Electronic communications: You consent to receive communications from VeloxZap electronically, including by email, SMS, push notification, or in-app notice, and agree that such communications satisfy any legal requirement that they be in writing.',
    ],
  },
  {
    id: 'changes',
    title: '20. Changes to these terms',
    body: [
      'VeloxZap may amend these Terms at any time to reflect changes in our Services, business practices, or applicable law or regulation. Material changes will be communicated via email or in-app notice at least seven (7) days before taking effect, except where an immediate change is required by law or to address a security or fraud risk.',
      'Your continued use of the Services after the effective date of any change constitutes your acceptance of the revised Terms. If you do not agree to the revised Terms, you must stop using the Services and may close your account in accordance with Section 13.',
    ],
  },
  {
    id: 'contact',
    title: '21. Contact us',
    body: [
      'If you have questions about these Terms, reach our support team at support@veloxzap.com or through the Contact page. For formal legal notices, correspondence should be addressed to the Legal Department, VeloxZap Technologies Limited.',
    ],
  },
]

export default function Terms() {
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
        title: 'Terms of Service',
        lastUpdated: LAST_UPDATED,
        intro: TERMS_INTRO,
        sections: SECTIONS,
        fileName: 'veloxzap-terms-of-service.pdf',
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
        title="VeloxZap Terms of Service — User Agreement"
        description="Read VeloxZap's Terms of Service governing your use of our fintech platform, including payment rules, account policies, and user responsibilities."
        path="/terms"
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
              <Scale size={11} /> Legal
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
            Terms of{' '}
            <span style={gradientText(`linear-gradient(110deg, ${colors.gold}, ${colors.champagne}, ${colors.gold})`)}>
              Service
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
            Last updated {LAST_UPDATED}. Please read these terms carefully before using VeloxZap.
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
                  <Loader2 size={16} className="terms-spin" /> Preparing PDF…
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
            className="terms-grid"
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
              className="terms-nav"
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
                {downloading ? <Loader2 size={13} className="terms-spin" /> : <Download size={13} />}
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
                      Questions about these terms?
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
          .terms-grid { grid-template-columns: 1fr !important; }
          .terms-nav { position: relative !important; top: 0 !important; max-height: none !important; }
        }
        .terms-spin { animation: terms-spin 0.8s linear infinite; }
        @keyframes terms-spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  )
}
