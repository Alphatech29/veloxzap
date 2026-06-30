

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gift, ArrowRight, ArrowDownRight, ArrowUpRight, CheckCircle2,
  Clock, ShieldCheck, Sparkles, TrendingUp, Search, Wallet,
  Camera, Banknote, Zap, BadgeCheck, Globe2,
} from 'lucide-react'
import SEO from '../components/SEO'
import usePublicGiftCardBrands from '../hooks/usePublicGiftCardBrands'
import './css/GiftCards.css'

const BRAND_TILE_LIMIT = 16

function brandColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return `hsl(${hash % 360}, 65%, 50%)`
}

function brandInitials(name) {
  const words = name.trim().split(/\s+/)
  return words.length > 1
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

function brandHeadlineRate(brand) {
  const active = (brand.sub_categories || []).filter(s => s.status === 1)
  if (!active.length) return null
  return active.reduce((best, s) => (Number(s.rate) > Number(best.rate) ? s : best), active[0])
}

const TOP_RATE_LIMIT = 4

const features = [
  { icon: TrendingUp,  title: 'Best naira rates',     desc: 'Live rates aggregated from 50+ sources so you always trade at the top of the market.' },
  { icon: Zap,         title: 'Verified in seconds',  desc: 'Our scanners check every card in 15–30 seconds — no human gatekeeping.'                  },
  { icon: Wallet,      title: 'Instant naira payout', desc: 'Cash hits your wallet the moment the card is verified. Withdraw anytime, any bank.'      },
  { icon: ShieldCheck, title: 'Enterprise security',  desc: 'PCI DSS compliant, end-to-end encrypted on every trade.'                                 },
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

  const { brands, loading: brandsLoading } = usePublicGiftCardBrands()

  const shownBrands = brands.slice(0, BRAND_TILE_LIMIT)
  const moreBrandsCount = Math.max(brands.length - shownBrands.length, 0)

  const topRates = brands
    .map(b => ({ brand: b, headline: brandHeadlineRate(b) }))
    .filter(x => x.headline)
    .sort((a, c) => Number(c.headline.rate) - Number(a.headline.rate))
    .slice(0, TOP_RATE_LIMIT)

  return (
    <main className="gc-stage main-offset">
      <SEO
        title="Buy & Sell Gift Cards in Nigeria at the Best Rates"
        description="Trade Amazon, iTunes, Steam, Google Play and 200+ gift card brands for naira instantly. Best rates, 15-second verification, zero fees. VeloxZap."
        path="/gift-cards"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Gift Card Trading",
          "provider": { "@type": "Organization", "name": "VeloxZap", "url": "https://veloxzap.com" },
          "description": "Buy and sell gift cards for naira at the best rates in Nigeria. Supports 200+ brands including Amazon, iTunes, Steam, and Google Play.",
          "areaServed": "NG",
          "serviceType": "Gift Card Exchange"
        }}
      />

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
                { icon: ShieldCheck, label: 'Enterprise Security' },
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
            {brandsLoading ? (
              Array.from({ length: TOP_RATE_LIMIT }).map((_, i) => (
                <article key={i} className="gc-rate gc-rate-skel animate-pulse">
                  <div className="gc-rate-top">
                    <span className="gc-rate-name-skel" />
                  </div>
                  <div className="gc-rate-amt-skel" />
                  <div className="gc-rate-arrow">→</div>
                  <div className="gc-rate-payout-skel" />
                </article>
              ))
            ) : topRates.length > 0 ? (
              topRates.map(({ brand, headline }) => (
                <article
                  key={brand.id}
                  className="gc-rate"
                  style={{ '--brand': brandColor(brand.name) }}
                >
                  <span className="gc-rate-glow" />
                  <div className="gc-rate-top">
                    <span className="gc-rate-name">{brand.name}</span>
                    <span className="gc-rate-live">
                      <span className="gc-rate-live-dot" />
                      Live
                    </span>
                  </div>
                  <div className="gc-rate-amt">{headline.currency}100</div>
                  <div className="gc-rate-arrow">→</div>
                  <div className="gc-rate-payout">₦{(Number(headline.rate) * 100).toLocaleString('en-NG')}</div>
                  <div className="gc-rate-foot">Estimated payout</div>
                </article>
              ))
            ) : (
              <div className="gc-brand-empty">
                <span className="gc-brand-empty-ic">
                  <TrendingUp size={18} />
                </span>
                <p>Live rates are being updated. Check back shortly.</p>
              </div>
            )}
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
            {brandsLoading ? (
              Array.from({ length: BRAND_TILE_LIMIT }).map((_, i) => (
                <div key={i} className="gc-brand gc-brand-skel animate-pulse">
                  <span className="gc-brand-mark" />
                  <div className="gc-brand-meta">
                    <span className="gc-brand-name-skel" />
                    <span className="gc-brand-rate-skel" />
                  </div>
                </div>
              ))
            ) : shownBrands.length > 0 ? (
              shownBrands.map(b => {
                const headline = brandHeadlineRate(b)
                return (
                  <div
                    key={b.id}
                    className="gc-brand"
                    style={{ '--brand': brandColor(b.name) }}
                  >
                    <BrandMark name={b.name} logo={b.logo} />
                    <div className="gc-brand-meta">
                      <span className="gc-brand-name">{b.name}</span>
                      <span className="gc-brand-rate">
                        {headline ? `₦${Number(headline.rate).toLocaleString('en-NG')}/${headline.currency}1` : 'Coming soon'}
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="gc-brand-empty">
                <span className="gc-brand-empty-ic">
                  <Gift size={18} />
                </span>
                <p>Brand catalog is being updated. Check back shortly.</p>
              </div>
            )}
          </div>

          {!brandsLoading && shownBrands.length > 0 && (
            <p className="gc-brand-foot">
              <Sparkles size={12} />
              {moreBrandsCount > 0
                ? `…plus ${moreBrandsCount}+ more brands inside the app, with new ones added weekly.`
                : 'Full catalog lives inside the app, with new brands added weekly.'}
            </p>
          )}
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

function BrandMark({ name, logo }) {
  const [imgError, setImgError] = useState(false)

  if (logo && !imgError) {
    return (
      <span className="gc-brand-mark gc-brand-mark-logo">
        <img src={logo} alt={name} onError={() => setImgError(true)} />
      </span>
    )
  }
  return <span className="gc-brand-mark">{brandInitials(name)}</span>
}
