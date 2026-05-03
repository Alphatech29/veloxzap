

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Receipt, Tv, Zap, Droplet, Wifi, GraduationCap, Building2,
  ArrowRight, ArrowDownRight, CheckCircle2, Clock, ShieldCheck,
  Sparkles, Wallet, BadgeCheck, BadgePercent, Search, Bell, RefreshCw,
  CreditCard, ScrollText, Shield,
} from 'lucide-react'
import './css/PayBills.css'

const categories = [
  { id: 'tv',          icon: Tv,            title: 'TV subscriptions', desc: 'DStv, GOtv, Startimes, Showmax — pay or renew in seconds.', count: '12+ providers', tag: 'TV' },
  { id: 'electricity', icon: Zap,           title: 'Electricity',      desc: 'Buy meter tokens for IKEDC, EKEDC, AEDC and every NERC disco.', count: '11 discos', tag: 'Power' },
  { id: 'water',       icon: Droplet,       title: 'Water',            desc: 'Settle Lagos, Abuja and state water bills directly.',         count: '6 boards', tag: 'Water' },
  { id: 'internet',    icon: Wifi,          title: 'Internet & ISPs',  desc: 'Spectranet, Smile, Tizeti, Swift — keep the WiFi alive.',     count: '8 ISPs', tag: 'ISP' },
  { id: 'education',   icon: GraduationCap, title: 'Education',        desc: 'WAEC, JAMB, NECO PINs and school fees — instant.',            count: '20+ exams', tag: 'Edu' },
  { id: 'government',  icon: Building2,     title: 'Government',       desc: 'FRSC, Customs, LASRRA, and licensing fees.',                  count: '15+ services', tag: 'Gov' },
]

const providers = [
  { name: 'DStv',         color: '#005BBB', initials: 'DS', tag: 'TV' },
  { name: 'GOtv',         color: '#FFD500', initials: 'GO', tag: 'TV' },
  { name: 'Startimes',    color: '#0072BC', initials: 'ST', tag: 'TV' },
  { name: 'Showmax',      color: '#222222', initials: 'SX', tag: 'TV' },
  { name: 'IKEDC',        color: '#0E6E36', initials: 'IK', tag: 'Power' },
  { name: 'EKEDC',        color: '#E30613', initials: 'EK', tag: 'Power' },
  { name: 'AEDC',         color: '#003C71', initials: 'AE', tag: 'Power' },
  { name: 'BEDC',         color: '#FFB100', initials: 'BE', tag: 'Power' },
  { name: 'PHED',         color: '#1E5B9D', initials: 'PH', tag: 'Power' },
  { name: 'KEDCO',        color: '#0F766E', initials: 'KE', tag: 'Power' },
  { name: 'Spectranet',   color: '#003F7E', initials: 'Sp', tag: 'ISP' },
  { name: 'Smile',        color: '#7E57C2', initials: 'Sm', tag: 'ISP' },
  { name: 'Tizeti',       color: '#00A99D', initials: 'Tz', tag: 'ISP' },
  { name: 'Swift',        color: '#FB923C', initials: 'Sw', tag: 'ISP' },
  { name: 'Lagos Water',  color: '#0EA5E9', initials: 'LW', tag: 'Water' },
  { name: 'FCT Water',    color: '#0284C7', initials: 'FW', tag: 'Water' },
  { name: 'Rivers Water', color: '#0369A1', initials: 'RW', tag: 'Water' },
  { name: 'Kano Water',   color: '#0891B2', initials: 'KW', tag: 'Water' },
  { name: 'WAEC',         color: '#1B5E20', initials: 'WC', tag: 'Edu' },
  { name: 'JAMB',         color: '#7B1FA2', initials: 'JB', tag: 'Edu' },
  { name: 'NECO',         color: '#15803D', initials: 'NC', tag: 'Edu' },
  { name: 'NABTEB',       color: '#B45309', initials: 'NB', tag: 'Edu' },
  { name: 'FRSC',         color: '#C62828', initials: 'FR', tag: 'Gov' },
  { name: 'NIS',          color: '#1F2937', initials: 'NI', tag: 'Gov' },
  { name: 'LASRRA',       color: '#0F4C81', initials: 'LA', tag: 'Gov' },
  { name: 'Customs',      color: '#5B21B6', initials: 'CS', tag: 'Gov' },
]

const steps = [
  { n: 1, icon: Search,       title: 'Pick a category',    desc: 'Choose TV, electricity, water, internet, education or government.' },
  { n: 2, icon: BadgeCheck,   title: 'Select your biller', desc: 'We auto-detect the disco from your meter and validate every account.' },
  { n: 3, icon: Wallet,       title: 'Pay in naira',       desc: 'Fund directly from your VeloxZap wallet — no card, no OTP, no wait.' },
  { n: 4, icon: CheckCircle2, title: 'Token & receipt',    desc: 'Meter token or confirmation arrives in under 30 seconds. Auto-stored.' },
]

const features = [
  { icon: Zap,          title: 'Instant delivery',     desc: 'Tokens, PINs and confirmations land in your inbox in 15–30 seconds — no manual chasing.' },
  { icon: ShieldCheck,  title: 'Verified billers',     desc: 'Every biller is contracted directly. Your account is validated before a kobo is debited.' },
  { icon: BadgePercent, title: 'No service charge',    desc: 'You pay the biller\'s exact tariff. Cashback on every successful payment, withdrawable.' },
  { icon: Bell,         title: 'Reminders & autopay',  desc: 'Schedule recurring bills or get nudged 3 days before due — never blacked out again.' },
]

const heroChips = [
  { icon: ShieldCheck, label: 'CBN Licensed' },
  { icon: Clock,       label: '15s delivery' },
  { icon: Shield,      label: 'Direct to billers' },
]

const recentPayments = [
  { biller: 'DStv',  plan: 'Compact Plus', amount: '₦25,000', icon: Tv,   tone: '#005BBB' },
  { biller: 'IKEDC', plan: '50 units',     amount: '₦12,500', icon: Zap,  tone: '#0E6E36' },
  { biller: 'Smile', plan: '60GB · 30d',   amount: '₦15,000', icon: Wifi, tone: '#7E57C2' },
]

export default function PayBills() {
  const [activeCat, setActiveCat] = useState('tv')
  const active = categories.find(c => c.id === activeCat) ?? categories[0]
  const ActiveIcon = active.icon
  const filtered = providers.filter(p => p.tag === active.tag)

  return (
    <main className="pb-stage main-offset">
      
      <div className="pb-aurora pb-aurora-a" />
      <div className="pb-aurora pb-aurora-b" />
      <div className="pb-grain" />

      
      <section className="pb-hero">
        <div className="pb-hero-grid">
          <div className="pb-hero-copy">
            <span className="pb-pill pb-pill-gold">
              <span className="pb-pill-dot" />
              PAY BILLS · ALL-IN-ONE
            </span>

            <h1 className="pb-headline">
              Every bill, every biller —{' '}
              <span className="pb-grad">paid in seconds.</span>
            </h1>

            <p className="pb-sub">
              DStv, GOtv, Startimes, all 11 electricity discos, water, internet,
              WAEC, JAMB and 100+ more — settled directly with the biller from
              your VeloxZap wallet. Tokens land in 30 seconds.
            </p>

            <div className="pb-hero-ctas">
              <Link to="/auth/register" className="pb-cta-gold">
                Pay a bill <ArrowRight size={16} />
              </Link>
              <a href="#categories" className="pb-cta-ghost">
                Browse billers <ArrowDownRight size={16} />
              </a>
            </div>

            <div className="pb-trust-row">
              {heroChips.map(({ icon: Ic, label }) => (
                <div key={label} className="pb-trust">
                  <Ic size={14} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          
          <div className="pb-hero-art">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="pb-phone"
            >
              <div className="pb-phone-head">
                <div className="pb-phone-head-l">
                  <div className="pb-phone-icon">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <div className="pb-phone-title">Recent payments</div>
                    <div className="pb-phone-sub">This week · 3 paid</div>
                  </div>
                </div>
                <span className="pb-phone-live">Live</span>
              </div>

              <div className="pb-pay-list">
                {recentPayments.map((p, i) => (
                  <motion.div
                    key={p.biller}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="pb-pay-row"
                  >
                    <div
                      className="pb-pay-mark"
                      style={{
                        background: p.tone,
                        boxShadow: `0 4px 14px color-mix(in srgb, ${p.tone} 40%, transparent)`,
                      }}
                    >
                      <p.icon size={16} />
                    </div>
                    <div className="pb-pay-meta">
                      <div className="pb-pay-name">{p.biller}</div>
                      <div className="pb-pay-plan">{p.plan}</div>
                    </div>
                    <div className="pb-pay-right">
                      <div className="pb-pay-amt">{p.amount}</div>
                      <div className="pb-pay-status">
                        <CheckCircle2 size={10} /> Paid
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pb-autopay">
                <RefreshCw size={16} />
                <div>
                  <span className="pb-autopay-l">Autopay set:</span>{' '}
                  <span className="pb-autopay-r">DStv renews on the 5th every month.</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pb-token-float"
              >
                <ScrollText size={14} />
                <div>
                  <div className="pb-token-t">Token sent</div>
                  <div className="pb-token-s">1234 5678 9012 3456</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      
      <section id="categories" className="pb-section">
        <div className="pb-container">
          <SectionHead
            pill="Categories"
            title={<>One wallet. <span className="pb-grad">Every kind of bill.</span></>}
            sub="Tap a category to see who we cover — full list lives inside the app."
          />

          <div className="pb-cat-row">
            {categories.map(cat => {
              const Ic = cat.icon
              const on = cat.id === activeCat
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`pb-cat-tab ${on ? 'pb-cat-tab-on' : 'pb-cat-tab-off'}`}
                >
                  <Ic size={14} />
                  {cat.title}
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="pb-cat-panel"
            >
              <div className="pb-cat-info">
                <div className="pb-cat-icon-lg">
                  <ActiveIcon size={26} />
                </div>
                <h3 className="pb-cat-title">{active.title}</h3>
                <p className="pb-cat-desc">{active.desc}</p>
                <span className="pb-cat-count">
                  <Sparkles size={11} /> {active.count}
                </span>
              </div>

              <div className="pb-cat-providers">
                {filtered.map(p => (
                  <div
                    key={p.name}
                    className="pb-cat-provider"
                    style={{ '--brand': p.color }}
                  >
                    <span
                      className="pb-cat-provider-mark"
                      style={{ color: p.color === '#FFD500' ? '#0A1F44' : '#fff' }}
                    >
                      {p.initials}
                    </span>
                    <div className="pb-cat-provider-name">{p.name}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      
      <section className="pb-section">
        <div className="pb-container">
          <SectionHead
            pill="Provider catalog"
            title={<>100+ billers. <span className="pb-grad">Zero friction.</span></>}
            sub="A snapshot of who we settle directly with — see the full list inside the app."
          />

          <div className="pb-provider-grid">
            {providers.map(p => (
              <div key={p.name} className="pb-provider" style={{ '--brand': p.color }}>
                <span
                  className="pb-provider-mark"
                  style={{ color: p.color === '#FFD500' ? '#0A1F44' : '#fff' }}
                >
                  {p.initials}
                </span>
                <div className="pb-provider-meta">
                  <span className="pb-provider-name">{p.name}</span>
                  <span className="pb-provider-tag">{p.tag}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="pb-provider-foot">
            <Sparkles size={12} />
            …plus 80+ more billers in the app, with new integrations every month.
          </p>
        </div>
      </section>

      
      <section className="pb-section">
        <div className="pb-container">
          <SectionHead
            pill="How it works"
            title={<>From bill to <span className="pb-grad">paid receipt</span> in 30 seconds.</>}
            sub="Four steps. No queues, no banking apps, no scratch cards."
          />

          <div className="pb-step-grid">
            {steps.map(s => {
              const Ic = s.icon
              return (
                <div key={s.n} className="pb-step">
                  <span className="pb-step-num">{String(s.n).padStart(2, '0')}</span>
                  <div className="pb-step-ic"><Ic size={20} /></div>
                  <h3 className="pb-step-title">{s.title}</h3>
                  <p className="pb-step-desc">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      
      <section className="pb-section">
        <div className="pb-container">
          <SectionHead
            pill="Why VeloxZap"
            title={<>Built for people who hate <span className="pb-grad">missing due dates.</span></>}
            sub="Speed, transparent pricing, and a paper trail you can actually find."
          />

          <div className="pb-feat-grid">
            {features.map((f, i) => {
              const Ic = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="pb-feat"
                >
                  <div className="pb-feat-ic"><Ic size={20} /></div>
                  <h3 className="pb-feat-title">{f.title}</h3>
                  <p className="pb-feat-desc">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="pb-section">
        <div className="pb-container">
          <div className="pb-final">
            <div className="pb-final-mark"><CreditCard size={22} /></div>
            <h2 className="pb-final-title">
              Stop juggling apps. Pay every bill from one wallet.
            </h2>
            <p className="pb-final-sub">
              500,000 Nigerians already pay their bills on VeloxZap. Your first
              payment is on us — no service charge, ever.
            </p>
            <div className="pb-final-ctas">
              <Link to="/auth/register" className="pb-cta-gold">
                Open free account <ArrowRight size={16} />
              </Link>
              <Link to="/" className="pb-cta-ghost">
                Explore other services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function SectionHead({ pill, title, sub }) {
  return (
    <header className="pb-head">
      <span className="pb-pill pb-pill-mute">
        <Sparkles size={11} />
        {pill}
      </span>
      <h2 className="pb-head-title">{title}</h2>
      <p className="pb-head-sub">{sub}</p>
    </header>
  )
}
