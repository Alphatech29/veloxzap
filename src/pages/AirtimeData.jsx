
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Smartphone, Signal, Zap, Wifi, ArrowRight, CheckCircle2,
  Clock, ShieldCheck, Sparkles, ChevronDown,
  Database, Star, Globe2, BadgePercent, Repeat,
} from 'lucide-react'
import SEO from '../components/SEO'
import './css/AirtimeData.css'

const networks = [
  { id: 'mtn',     name: 'MTN',     color: '#FFCC00', tag: 'Y\'ello' },
  { id: 'airtel',  name: 'Airtel',  color: '#FF1A2E', tag: 'Smartphone Network' },
  { id: 'glo',     name: 'Glo',     color: '#00C95A', tag: 'Grandmasters' },
  { id: 't2mobile', name: 'T2mobile', color: '#ff5c05', tag: 'Now Now' },
]

const airtimePresets = [
  { amount: '₦100',    bonus: '+5%' },
  { amount: '₦200',    bonus: '+5%' },
  { amount: '₦500',    bonus: '+5%' },
  { amount: '₦1,000',  bonus: '+5%' },
  { amount: '₦2,000',  bonus: '+5%' },
  { amount: '₦5,000',  bonus: '+5%' },
  { amount: '₦10,000', bonus: '+5%' },
  { amount: 'Custom',  bonus: 'Any' },
]

const dataPlans = {
  mtn: [
    { size: '1GB',   duration: '1 Day',    price: '₦350' },
    { size: '2.5GB', duration: '2 Days',   price: '₦600',  badge: 'Hot'        },
    { size: '6GB',   duration: '7 Days',   price: '₦1,500', badge: 'Popular'   },
    { size: '15GB',  duration: '30 Days',  price: '₦4,500' },
    { size: '40GB',  duration: '30 Days',  price: '₦11,000', badge: 'Best Value' },
    { size: '75GB',  duration: '30 Days',  price: '₦18,000' },
  ],
  airtel: [
    { size: '750MB', duration: '1 Day',    price: '₦300' },
    { size: '3GB',   duration: '2 Days',   price: '₦600',  badge: 'Hot'        },
    { size: '7GB',   duration: '7 Days',   price: '₦1,500', badge: 'Popular'   },
    { size: '18GB',  duration: '30 Days',  price: '₦4,500' },
    { size: '35GB',  duration: '30 Days',  price: '₦9,000',  badge: 'Best Value' },
    { size: '120GB', duration: '30 Days',  price: '₦22,000' },
  ],
  glo: [
    { size: '1.5GB', duration: '1 Day',    price: '₦300' },
    { size: '3.5GB', duration: '2 Days',   price: '₦600',  badge: 'Hot'        },
    { size: '7.5GB', duration: '7 Days',   price: '₦1,500', badge: 'Popular'   },
    { size: '13GB',  duration: '30 Days',  price: '₦3,500' },
    { size: '32GB',  duration: '30 Days',  price: '₦7,500',  badge: 'Best Value' },
    { size: '93GB',  duration: '30 Days',  price: '₦17,500' },
  ],
  t2mobile: [
    { size: '500MB', duration: '1 Day',    price: '₦200' },
    { size: '1.5GB', duration: '2 Days',   price: '₦500',  badge: 'Hot'        },
    { size: '4.5GB', duration: '7 Days',   price: '₦1,500', badge: 'Popular'   },
    { size: '11GB',  duration: '30 Days',  price: '₦4,000' },
    { size: '30GB',  duration: '30 Days',  price: '₦9,000',  badge: 'Best Value' },
    { size: '75GB',  duration: '30 Days',  price: '₦20,000' },
  ],
}

const features = [
  { icon: Globe2,      title: 'All four networks',  desc: 'MTN, Airtel, Glo and T2mobile — one app, any number, any time.' },
  { icon: Zap,         title: 'Delivered instantly', desc: 'Airtime and data hit the recipient line in under 5 seconds.'   },
  { icon: BadgePercent, title: '5% cashback',        desc: 'Earn rewards on every top-up that you can withdraw or reuse.'  },
  { icon: Repeat,      title: 'One-tap repeats',     desc: 'Save your common numbers and recharge them with a single tap.' },
]

const steps = [
  { n: 1, icon: Smartphone, title: 'Choose network', desc: 'Pick MTN, Airtel, Glo or T2mobile — we detect it from the number too.' },
  { n: 2, icon: Database,   title: 'Pick a plan',    desc: 'Daily, weekly, monthly data — or any airtime amount you want.'        },
  { n: 3, icon: CheckCircle2, title: 'Done in seconds', desc: 'We deliver the value, send a receipt, and credit your cashback.'   },
]

export default function AirtimeData() {
  const [activeNet, setActiveNet] = useState('mtn')
  const [tab, setTab] = useState('data')

  const net = networks.find(n => n.id === activeNet)

  return (
    <main className="ad-stage main-offset">
      <SEO
        title="Buy Airtime & Data Online — MTN, Airtel, Glo, 9mobile"
        description="Instant airtime and data top-up for MTN, Airtel, Glo, and 9mobile. Fund from your VeloxZap wallet in seconds — no queues, no banking apps needed."
        path="/airtime"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Airtime & Data Top-Up",
          "provider": { "@type": "Organization", "name": "VeloxZap", "url": "https://veloxzap.com" },
          "description": "Instant airtime and data purchase for all Nigerian networks — MTN, Airtel, Glo, and 9mobile.",
          "areaServed": "NG",
          "serviceType": "Airtime & Data Recharge"
        }}
      />

      <div className="ad-aurora ad-aurora-a" />
      <div className="ad-aurora ad-aurora-b" />
      <div className="ad-grain" />

      
      <section className="ad-hero">
        <div className="ad-hero-grid">
          
          <div className="ad-hero-copy">
            <span className="ad-pill">
              <span className="ad-pill-dot" />
              AIRTIME &amp; DATA
            </span>

            <h1 className="ad-headline">
              Top up any Nigerian line.{' '}
              <span className="ad-headline-grad">Earn cashback every time.</span>
            </h1>

            <p className="ad-sub">
              MTN, Airtel, Glo, T2mobile — airtime and data bundles delivered in under five
              seconds, with 5% cashback that lands in your wallet on every recharge.
            </p>

            <div className="ad-hero-ctas">
              <Link to="/auth/register" className="ad-cta-gold">
                Get started
                <ArrowRight size={16} />
              </Link>
              <a href="#networks" className="ad-cta-ghost">
                See networks
                <ChevronDown size={16} />
              </a>
            </div>

            <div className="ad-trust-row">
              {[
                { icon: ShieldCheck, label: 'Enterprise Security' },
                { icon: Clock,       label: 'Sub-5s delivery' },
                { icon: Star,        label: '4.9★ rating' },
              ].map(({ icon: Ic, label }) => (
                <div key={label} className="ad-trust">
                  <Ic size={14} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          
          <div className="ad-hero-art">
            <div className="ad-signal">
              <span className="ad-signal-ring ad-signal-ring-1" />
              <span className="ad-signal-ring ad-signal-ring-2" />
              <span className="ad-signal-ring ad-signal-ring-3" />
            </div>

            <motion.div
              className="ad-phone"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="ad-phone-notch" />
              <div className="ad-phone-screen">
                <div className="ad-phone-bar">
                  <span className="ad-phone-time">9:41</span>
                  <div className="ad-phone-bar-icons">
                    <Signal size={11} />
                    <Wifi size={11} />
                  </div>
                </div>

                <div className="ad-phone-body">
                  <div className="ad-phone-eyebrow">VELOXZAP · TOP-UP</div>
                  <div className="ad-phone-amount">₦5,000</div>
                  <div className="ad-phone-line">to 0803 ••• 4427</div>

                  <div className="ad-phone-net">
                    <span className="ad-phone-net-dot" style={{ background: '#FFCC00' }} />
                    MTN Airtime
                  </div>

                  <div className="ad-phone-progress">
                    <span className="ad-phone-progress-bar" />
                  </div>

                  <div className="ad-phone-toast">
                    <CheckCircle2 size={14} />
                    Delivered · +₦250 cashback
                  </div>
                </div>
              </div>
            </motion.div>

            
            <motion.div
              className="ad-float ad-float-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Database size={14} />
              <div>
                <div className="ad-float-t">15GB · 30d</div>
                <div className="ad-float-s">MTN · ₦4,500</div>
              </div>
            </motion.div>

            <motion.div
              className="ad-float ad-float-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <BadgePercent size={14} />
              <div>
                <div className="ad-float-t">5% Cashback</div>
                <div className="ad-float-s">Every top-up</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      
      <section id="networks" className="ad-section">
        <div className="ad-container">
          <SectionHead
            pill="Networks"
            title={<>Every Nigerian carrier, <span className="ad-grad">one wallet.</span></>}
            sub="Tap a network to preview the bundles and airtime amounts available right now."
          />

          <div className="ad-net-grid">
            {networks.map(n => (
              <button
                key={n.id}
                onClick={() => setActiveNet(n.id)}
                className={`ad-net-card ${activeNet === n.id ? 'is-active' : ''}`}
                style={{ '--net': n.color }}
              >
                <span className="ad-net-glow" />
                <span className="ad-net-badge">{n.tag}</span>
                <span className="ad-net-name">{n.name}</span>
                <span className="ad-net-meta">
                  <Signal size={12} /> 4G / 5G ready
                </span>
                <span className="ad-net-pick">
                  {activeNet === n.id ? 'Selected' : 'Select'}
                  <ArrowRight size={12} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      
      <section className="ad-section ad-section-tight">
        <div className="ad-container">
          <div className="ad-tab-shell">
            <div className="ad-tab-row">
              <button
                onClick={() => setTab('data')}
                className={`ad-tab ${tab === 'data' ? 'is-on' : ''}`}
              >
                <Database size={14} />
                Data bundles
              </button>
              <button
                onClick={() => setTab('airtime')}
                className={`ad-tab ${tab === 'airtime' ? 'is-on' : ''}`}
              >
                <Smartphone size={14} />
                Airtime
              </button>
              <span className="ad-tab-net">
                <span className="ad-tab-net-dot" style={{ background: net.color }} />
                Showing {net.name}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {tab === 'data' ? (
                <motion.div
                  key={`data-${activeNet}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.32 }}
                  className="ad-bundle-grid"
                >
                  {dataPlans[activeNet].map(p => (
                    <article
                      key={p.size}
                      className="ad-bundle"
                      style={{ '--net': net.color }}
                    >
                      <div className="ad-bundle-chip">
                        <span className="ad-bundle-chip-dot" />
                        SIM · {net.name}
                      </div>

                      {p.badge && <span className="ad-bundle-badge">{p.badge}</span>}

                      <div className="ad-bundle-size">{p.size}</div>
                      <div className="ad-bundle-dur">
                        <Clock size={11} /> {p.duration}
                      </div>

                      <div className="ad-bundle-divider" />

                      <div className="ad-bundle-foot">
                        <span className="ad-bundle-price">{p.price}</span>
                        <span className="ad-bundle-cash">+5% back</span>
                      </div>
                    </article>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={`air-${activeNet}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.32 }}
                  className="ad-air-grid"
                >
                  {airtimePresets.map(a => (
                    <div
                      key={a.amount}
                      className="ad-air"
                      style={{ '--net': net.color }}
                    >
                      <div className="ad-air-amt">{a.amount}</div>
                      <div className="ad-air-bonus">{a.bonus}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <p className="ad-tab-note">
              <Sparkles size={12} />
              Plans shown for illustration. Live prices update inside the app.
            </p>
          </div>
        </div>
      </section>

      
      <section className="ad-section">
        <div className="ad-container">
          <div className="ad-cash">
            <div className="ad-cash-glow" />

            <div className="ad-cash-text">
              <span className="ad-pill ad-pill-on-light">
                <BadgePercent size={11} />
                CASHBACK · 5%
              </span>
              <h2 className="ad-cash-title">
                Get paid <span className="ad-grad">every time</span> you recharge.
              </h2>
              <p className="ad-cash-sub">
                Every airtime top-up and data bundle earns 5% straight to your VeloxZap wallet.
                No tiers, no minimum spend, no expiry — your cashback is yours to keep.
              </p>

              <ul className="ad-cash-list">
                <li><CheckCircle2 size={14} /> Credited the second the recharge lands</li>
                <li><CheckCircle2 size={14} /> Spend it on bills, gift cards or more data</li>
                <li><CheckCircle2 size={14} /> Withdraw to any Nigerian bank, anytime</li>
              </ul>
            </div>

            <div className="ad-cash-card">
              <div className="ad-cash-card-row">
                <span>Top-up</span>
                <strong>₦5,000</strong>
              </div>
              <div className="ad-cash-card-row">
                <span>Cashback</span>
                <strong className="ad-grad">+ ₦250</strong>
              </div>
              <div className="ad-cash-card-bar">
                <span style={{ width: '5%' }} />
              </div>
              <div className="ad-cash-card-foot">
                <span>Wallet</span>
                <strong>₦12,480</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="ad-section">
        <div className="ad-container">
          <SectionHead
            pill="Why VeloxZap"
            title={<>Built for the way Nigerians <span className="ad-grad">actually recharge.</span></>}
            sub="No hopping between apps. No queues. No surprises on your bill."
          />

          <div className="ad-feat-grid">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="ad-feat"
              >
                <div className="ad-feat-ic">
                  <f.icon size={20} />
                </div>
                <h3 className="ad-feat-title">{f.title}</h3>
                <p className="ad-feat-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="ad-section">
        <div className="ad-container">
          <SectionHead
            pill="How it works"
            title={<>Three taps. <span className="ad-grad">Done.</span></>}
            sub="From open-app to delivered in well under a minute."
          />

          <div className="ad-step-grid">
            {steps.map((s, i) => (
              <div key={s.n} className="ad-step">
                <span className="ad-step-num">{String(s.n).padStart(2, '0')}</span>
                <div className="ad-step-ic">
                  <s.icon size={20} />
                </div>
                <h3 className="ad-step-title">{s.title}</h3>
                <p className="ad-step-desc">{s.desc}</p>
                {i < steps.length - 1 && <span className="ad-step-line" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ad-section">
        <div className="ad-container">
          <div className="ad-final">
            <div className="ad-final-mark">
              <Smartphone size={22} />
            </div>
            <h2 className="ad-final-title">
              Your next top-up could earn you cashback.
            </h2>
            <p className="ad-final-sub">
              Join half a million Nigerians recharging the smart way on VeloxZap.
            </p>
            <div className="ad-final-ctas">
              <Link to="/auth/register" className="ad-cta-gold">
                Create free account
                <ArrowRight size={16} />
              </Link>
              <Link to="/" className="ad-cta-ghost">
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
    <header className="ad-head">
      <span className="ad-pill ad-pill-mute">
        <Sparkles size={11} />
        {pill}
      </span>
      <h2 className="ad-head-title">{title}</h2>
      <p className="ad-head-sub">{sub}</p>
    </header>
  )
}
