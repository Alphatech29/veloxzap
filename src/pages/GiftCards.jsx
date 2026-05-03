

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gift, ArrowRight, ArrowDownRight, ArrowUpRight, CheckCircle2,
  Clock, ShieldCheck, Sparkles, TrendingUp, Search, Wallet,
  Camera, Banknote, Zap, BadgeCheck, Globe2,
} from 'lucide-react'
import './css/GiftCards.css'

const brands = [
  { name: 'Amazon',       color: '#FF9900', initials: 'A',  rate: '₦945' },
  { name: 'iTunes',       color: '#A2AAAD', initials: 'iT', rate: '₦930' },
  { name: 'Steam',        color: '#1B2838', initials: 'S',  rate: '₦904' },
  { name: 'Google Play',  color: '#34A853', initials: 'GP', rate: '₦910' },
  { name: 'Xbox',         color: '#107C10', initials: 'X',  rate: '₦885' },
  { name: 'PlayStation',  color: '#0070D1', initials: 'PS', rate: '₦890' },
  { name: 'Netflix',      color: '#E50914', initials: 'N',  rate: '₦920' },
  { name: 'Spotify',      color: '#1DB954', initials: 'Sp', rate: '₦915' },
  { name: 'Nike',         color: '#111111', initials: 'Nk', rate: '₦880' },
  { name: 'Sephora',      color: '#000000', initials: 'Se', rate: '₦875' },
  { name: 'Walmart',      color: '#0071CE', initials: 'W',  rate: '₦870' },
  { name: 'eBay',         color: '#E53238', initials: 'eB', rate: '₦895' },
  { name: 'Best Buy',     color: '#0046BE', initials: 'BB', rate: '₦865' },
  { name: 'Target',       color: '#CC0000', initials: 'T',  rate: '₦870' },
  { name: 'Starbucks',    color: '#006241', initials: 'St', rate: '₦905' },
  { name: 'Visa GC',      color: '#1A1F71', initials: 'V',  rate: '₦940' },
]

const topRates = [
  { name: 'Amazon',  amount: '$100', payout: '₦94,500', delta: '+0.8%', up: true,  color: '#FF9900' },
  { name: 'iTunes',  amount: '$100', payout: '₦93,000', delta: '+0.5%', up: true,  color: '#A2AAAD' },
  { name: 'Steam',   amount: '$100', payout: '₦90,400', delta: '+0.3%', up: true,  color: '#66C0F4' },
  { name: 'Netflix', amount: '$50',  payout: '₦46,000', delta: '−0.2%', up: false, color: '#E50914' },
]

const features = [
  { icon: TrendingUp,  title: 'Best naira rates',     desc: 'Live rates aggregated from 50+ sources so you always trade at the top of the market.' },
  { icon: Zap,         title: 'Verified in seconds',  desc: 'Our scanners check every card in 15–30 seconds — no human gatekeeping.'                  },
  { icon: Wallet,      title: 'Instant naira payout', desc: 'Cash hits your wallet the moment the card is verified. Withdraw anytime, any bank.'      },
  { icon: ShieldCheck, title: 'Bank-grade security',  desc: 'CBN licensed, PCI DSS compliant, end-to-end encrypted on every trade.'                   },
]

const sellSteps = [
  { n: 1, icon: Gift,        title: 'Pick a brand',    desc: 'Choose from 200+ supported gift card brands.' },
  { n: 2, icon: Camera,      title: 'Snap or paste',   desc: 'Upload card photo, paste e-code, or type the PIN — whichever you have.' },
  { n: 3, icon: BadgeCheck,  title: 'We verify it',    desc: 'Our system confirms balance and validity in under 30 seconds.' },
  { n: 4, icon: Banknote,    title: 'Get paid in ₦',   desc: 'Naira lands in your VeloxZap wallet. Withdraw to any Nigerian bank.' },
]

const buySteps = [
  { n: 1, icon: Search,      title: 'Search the brand', desc: 'Pick from Amazon, iTunes, Steam and dozens more.' },
  { n: 2, icon: Wallet,      title: 'Pay in naira',     desc: 'Fund from your VeloxZap wallet — no card needed.' },
  { n: 3, icon: BadgeCheck,  title: 'We deliver',       desc: 'E-code is delivered to your inbox the same minute.' },
  { n: 4, icon: Globe2,      title: 'Spend globally',   desc: 'Use it on Amazon, App Store, Steam — anywhere the brand is accepted.' },
]


export default function GiftCards() {
  const [tab, setTab] = useState('sell')

  return (
    <main className="gc-stage main-offset">
      
      <div className="gc-aurora gc-aurora-a" />
      <div className="gc-aurora gc-aurora-b" />
      <div className="gc-grain" />

      
      <section className="gc-hero">
        <div className="gc-hero-grid">
          
          <div className="gc-hero-copy">
            <span className="gc-pill">
              <span className="gc-pill-dot" />
              GIFT CARDS · BUY &amp; SELL
            </span>

            <h1 className="gc-headline">
              Trade gift cards at{' '}
              <span className="gc-headline-grad">the best naira rates</span> in Nigeria.
            </h1>

            <p className="gc-sub">
              200+ brands accepted. Cards verified in 15–30 seconds. Naira lands in
              your wallet the moment we confirm — withdraw to any bank, any time.
            </p>

            <div className="gc-hero-ctas">
              <Link to="/auth/register" className="gc-cta-gold">
                Start trading
                <ArrowRight size={16} />
              </Link>
              <a href="#rates" className="gc-cta-ghost">
                See live rates
                <ArrowDownRight size={16} />
              </a>
            </div>

            <div className="gc-trust-row">
              {[
                { icon: ShieldCheck, label: 'CBN Licensed' },
                { icon: Clock,       label: '15s verification' },
                { icon: TrendingUp,  label: '₦945/$ Amazon' },
              ].map(({ icon: Ic, label }) => (
                <div key={label} className="gc-trust">
                  <Ic size={14} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          
          <div className="gc-hero-art">
            <div className="gc-stack">
              {[
                { name: 'Amazon',  c1: '#FF9900', c2: '#FFB84D', amt: '$100', delay: 0 },
                { name: 'iTunes',  c1: '#FF2D55', c2: '#A044FF', amt: '$50',  delay: 0.15 },
                { name: 'Steam',   c1: '#1B2838', c2: '#2A475E', amt: '$100', delay: 0.3 },
              ].map((card, i) => (
                <motion.div
                  key={card.name}
                  className={`gc-card gc-card-${i + 1}`}
                  style={{ '--c1': card.c1, '--c2': card.c2 }}
                  initial={{ opacity: 0, y: 30, rotate: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: card.delay, ease: 'easeOut' }}
                >
                  <div className="gc-card-shine" />
                  <div className="gc-card-chip" />
                  <div className="gc-card-brand">{card.name}</div>
                  <div className="gc-card-amt">{card.amt}</div>
                  <div className="gc-card-num">•••• •••• •••• 4427</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="gc-float gc-float-rate"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <TrendingUp size={14} />
              <div>
                <div className="gc-float-t">Live rate</div>
                <div className="gc-float-s">Amazon · ₦945/$</div>
              </div>
            </motion.div>

            <motion.div
              className="gc-float gc-float-paid"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <CheckCircle2 size={14} />
              <div>
                <div className="gc-float-t">Paid · ₦94,500</div>
                <div className="gc-float-s">in 22s</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      
      <section id="rates" className="gc-section">
        <div className="gc-container">
          <SectionHead
            pill="Live Rates"
            title={<>Today&apos;s top <span className="gc-grad">naira rates.</span></>}
            sub="Updated every few minutes across 50+ market sources. What you see is what you get."
          />

          <div className="gc-rate-grid">
            {topRates.map(r => (
              <article
                key={r.name}
                className="gc-rate"
                style={{ '--brand': r.color }}
              >
                <span className="gc-rate-glow" />
                <div className="gc-rate-top">
                  <span className="gc-rate-name">{r.name}</span>
                  <span className={`gc-rate-delta ${r.up ? 'is-up' : 'is-down'}`}>
                    {r.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {r.delta}
                  </span>
                </div>
                <div className="gc-rate-amt">{r.amount}</div>
                <div className="gc-rate-arrow">→</div>
                <div className="gc-rate-payout">{r.payout}</div>
                <div className="gc-rate-foot">Estimated payout</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      
      <section className="gc-section gc-section-tight">
        <div className="gc-container">
          <div className="gc-tab-shell">
            <div className="gc-tab-row">
              <button
                onClick={() => setTab('sell')}
                className={`gc-tab ${tab === 'sell' ? 'is-on' : ''}`}
              >
                <ArrowUpRight size={14} />
                Sell a card
              </button>
              <button
                onClick={() => setTab('buy')}
                className={`gc-tab ${tab === 'buy' ? 'is-on' : ''}`}
              >
                <ArrowDownRight size={14} />
                Buy a card
              </button>
              <span className="gc-tab-note">
                <Sparkles size={11} />
                {tab === 'sell' ? 'Cash out unused cards' : 'Get e-codes instantly'}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32 }}
                className="gc-step-grid"
              >
                {(tab === 'sell' ? sellSteps : buySteps).map(s => (
                  <div key={s.n} className="gc-step">
                    <span className="gc-step-num">{String(s.n).padStart(2, '0')}</span>
                    <div className="gc-step-ic">
                      <s.icon size={20} />
                    </div>
                    <h3 className="gc-step-title">{s.title}</h3>
                    <p className="gc-step-desc">{s.desc}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      
      <section className="gc-section">
        <div className="gc-container">
          <SectionHead
            pill="Brand catalog"
            title={<>200+ brands. <span className="gc-grad">One wallet.</span></>}
            sub="A snapshot of what you can trade — full catalog lives inside the app."
          />

          <div className="gc-brand-grid">
            {brands.map(b => (
              <div
                key={b.name}
                className="gc-brand"
                style={{ '--brand': b.color }}
              >
                <span className="gc-brand-mark">{b.initials}</span>
                <div className="gc-brand-meta">
                  <span className="gc-brand-name">{b.name}</span>
                  <span className="gc-brand-rate">{b.rate}/$</span>
                </div>
              </div>
            ))}
          </div>

          <p className="gc-brand-foot">
            <Sparkles size={12} />
            …plus 180+ more brands inside the app, with new ones added weekly.
          </p>
        </div>
      </section>

      
      <section className="gc-section">
        <div className="gc-container">
          <div className="gc-quote">
            <div className="gc-quote-glow" />

            <div className="gc-quote-text">
              <span className="gc-pill gc-pill-on-light">
                <TrendingUp size={11} />
                INSTANT QUOTE
              </span>
              <h2 className="gc-quote-title">
                See what your card is worth — <span className="gc-grad">before you trade.</span>
              </h2>
              <p className="gc-quote-sub">
                Pick a brand, enter the face value, and we show the exact naira payout
                using today&apos;s live rate. No surprises, no haggling — what you see lands
                in your wallet the moment we verify the card.
              </p>

              <ul className="gc-quote-list">
                <li><CheckCircle2 size={14} /> No fees deducted from your payout</li>
                <li><CheckCircle2 size={14} /> Rates refresh every few minutes</li>
                <li><CheckCircle2 size={14} /> Lock in the rate when you submit</li>
              </ul>
            </div>

            <div className="gc-quote-card">
              <div className="gc-quote-row">
                <span>Brand</span>
                <strong>Amazon · USD</strong>
              </div>
              <div className="gc-quote-row">
                <span>Face value</span>
                <strong>$100.00</strong>
              </div>
              <div className="gc-quote-row">
                <span>Live rate</span>
                <strong>₦945/$</strong>
              </div>
              <div className="gc-quote-divider" />
              <div className="gc-quote-payout">
                <span>You receive</span>
                <strong className="gc-grad">₦94,500</strong>
              </div>
              <button className="gc-quote-btn" type="button" disabled>
                Lock rate · 02:48
              </button>
            </div>
          </div>
        </div>
      </section>

      
      <section className="gc-section">
        <div className="gc-container">
          <SectionHead
            pill="Why VeloxZap"
            title={<>Built for traders who hate <span className="gc-grad">waiting around.</span></>}
            sub="Speed, fair rates and security — the three things every gift card seller actually cares about."
          />

          <div className="gc-feat-grid">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="gc-feat"
              >
                <div className="gc-feat-ic">
                  <f.icon size={20} />
                </div>
                <h3 className="gc-feat-title">{f.title}</h3>
                <p className="gc-feat-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="gc-section">
        <div className="gc-container">
          <div className="gc-final">
            <div className="gc-final-mark">
              <Gift size={22} />
            </div>
            <h2 className="gc-final-title">
              Got a card sitting in your inbox? Turn it into naira today.
            </h2>
            <p className="gc-final-sub">
              Half a million Nigerians already trade with VeloxZap. Your first sale is on us.
            </p>
            <div className="gc-final-ctas">
              <Link to="/auth/register" className="gc-cta-gold">
                Create free account
                <ArrowRight size={16} />
              </Link>
              <Link to="/" className="gc-cta-ghost">
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
    <header className="gc-head">
      <span className="gc-pill gc-pill-mute">
        <Sparkles size={11} />
        {pill}
      </span>
      <h2 className="gc-head-title">{title}</h2>
      <p className="gc-head-sub">{sub}</p>
    </header>
  )
}
