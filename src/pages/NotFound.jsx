import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, ArrowLeft, Home, Search, Compass, LifeBuoy,
  Gift, Receipt, Smartphone, Bitcoin, Globe2, BookOpen,
  Building2,
} from 'lucide-react'
import { colors, tint, gradientText } from '../components/landing/theme'

const goldGrad = `linear-gradient(135deg, ${colors.gold}, ${colors.champagne})`

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

const SUGGESTIONS = [
  { icon: Gift,       label: 'Buy & Sell Gift Cards', desc: 'Trade Amazon, iTunes, Steam at the best naira rates', href: '/gift-cards' },
  { icon: Receipt,    label: 'Pay Bills',             desc: 'DSTV, GOTV, electricity & 100+ billers',              href: '/bills' },
  { icon: Smartphone, label: 'Airtime & Data',        desc: 'MTN, Airtel, Glo, 9mobile — instant top-up',          href: '/airtime' },
  { icon: Bitcoin,    label: 'Crypto Swap',           desc: 'Swap BTC, USDT, ETH at live market rates',            href: '/crypto-swap' },
  { icon: Globe2,     label: 'Spend Globally',        desc: 'Pay in 200+ countries with a naira-funded Visa',      href: '/spend-globally' },
  { icon: BookOpen,   label: 'The VeloxZap Blog',     desc: 'Product launches, security deep-dives, market notes', href: '/company/blog' },
  { icon: Building2,  label: 'About Us',              desc: 'Who we are, what we believe, and where we are going', href: '/company/about' },
  { icon: LifeBuoy,   label: 'Get Support',           desc: 'Reach our team — typical reply in under 90 seconds',  href: '/company/contact' },
]

export default function NotFound() {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [location.pathname])

  const onSubmit = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return navigate('/')

    const lower = q.toLowerCase()
    const hit = SUGGESTIONS.find(s =>
      s.label.toLowerCase().includes(lower) || s.desc.toLowerCase().includes(lower)
    )
    navigate(hit?.href ?? '/')
  }

  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        paddingTop: 104,
        background:
          `radial-gradient(ellipse 60% 40% at 80% 0%, ${tint(colors.gold, 12)}, transparent 60%),` +
          `radial-gradient(ellipse 60% 40% at 20% 100%, ${tint(colors.champagne, 10)}, transparent 65%),` +
          `linear-gradient(180deg, var(--color-primary-500) 0%, ${colors.navy} 50%, var(--color-primary-700) 100%)`,
        overflow: 'hidden',
      }}
    >

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
            transition={{ duration: 0.5 }}
          >
            <span style={PILL(true)}>
              <Compass size={11} /> 404 · Page not found
            </span>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.05, ease: 'easeOut' }}
            style={{ position: 'relative', margin: '24px auto 0', maxWidth: 720 }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute', inset: '-30% -10%',
                background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${tint(colors.gold, 22)}, transparent 70%)`,
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }}
            />
            <h1
              className="f-head"
              style={{
                position: 'relative',
                margin: 0,
                fontSize: 'clamp(110px, 22vw, 240px)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.06em',
                ...gradientText(`linear-gradient(135deg, ${colors.gold} 0%, ${colors.champagne} 50%, ${colors.gold} 100%)`),
                textShadow: `0 0 60px ${tint(colors.gold, 30)}`,
              }}
            >
              404
            </h1>
          </motion.div>

          <motion.h2
            className="f-head"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            style={{
              margin: '8px auto 14px',
              maxWidth: 720,
              fontSize: 'clamp(26px, 3.8vw, 38px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: colors.text,
            }}
          >
            This page took a wrong turn at the{' '}
            <span style={gradientText(goldGrad)}>Zeloxzap.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            style={{
              maxWidth: 560, margin: '0 auto 14px',
              fontSize: 16, lineHeight: 1.7,
              color: colors.textMuted,
            }}
          >
            We can't find <span style={{ color: colors.text, fontWeight: 600 }}>{location.pathname}</span> —
            it may have moved, been renamed, or never existed. Your money is safe; this URL just isn't.
          </motion.p>


          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              maxWidth: 480, margin: '24px auto 0',
              padding: 6,
              borderRadius: 99,
              background: tint(colors.navyMid, 60),
              border: `1px solid ${tint(colors.gold, 18)}`,
              boxShadow: `0 12px 30px ${tint('black', 30)}`,
            }}
          >
            <Search size={16} color={tint(colors.text, 55)} style={{ flexShrink: 0, marginLeft: 12 }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Try 'gift cards', 'crypto', 'about'…"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none', outline: 'none',
                color: colors.text,
                fontSize: 14.5,
                padding: '10px 6px',
                fontFamily: 'inherit',
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              className="cta-gold"
              style={{ padding: '10px 16px', fontSize: 13 }}
            >
              Search <ArrowRight size={13} />
            </button>
          </motion.form>


          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 22 }}
          >
            <Link to="/" className="cta-gold">
              <Home size={14} /> Back to home
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="cta-ghost"
              style={{ cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <ArrowLeft size={14} /> Go back
            </button>
          </motion.div>
        </div>
      </section>


      <section style={{ ...SECTION, paddingTop: 30, paddingBottom: 110 }}>
        <div style={WRAP}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <span style={PILL()}>Or jump to</span>
            <h3
              className="f-head"
              style={{
                margin: '14px auto 0',
                fontSize: 'clamp(20px, 2.8vw, 26px)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: colors.text,
              }}
            >
              Popular pages on VeloxZap
            </h3>
          </div>

          <div
            style={{
              display: 'grid', gap: 14,
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            }}
          >
            {SUGGESTIONS.map(({ icon: Icon, label, desc, href }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.04 }}
              >
                <Link
                  to={href}
                  style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                >
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                      padding: 18,
                      borderRadius: 14,
                      background: `linear-gradient(180deg, ${tint(colors.navyMid, 50)}, ${tint(colors.navy, 60)})`,
                      border: `1px solid ${tint(colors.gold, 12)}`,
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      height: '100%',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = tint(colors.gold, 32)
                      e.currentTarget.style.transform = 'translateY(-3px)'
                      e.currentTarget.style.boxShadow = `0 18px 38px ${tint('black', 35)}, 0 0 28px ${tint(colors.gold, 10)}`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = tint(colors.gold, 12)
                      e.currentTarget.style.transform = ''
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 11,
                        background: tint(colors.gold, 12),
                        border: `1px solid ${tint(colors.gold, 26)}`,
                        display: 'grid', placeItems: 'center',
                        flexShrink: 0,
                        boxShadow: `0 0 14px ${tint(colors.gold, 14)}`,
                      }}
                    >
                      <Icon size={18} color={colors.gold} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        className="f-head"
                        style={{
                          margin: '0 0 3px',
                          fontSize: 14.5, fontWeight: 700,
                          color: colors.text, letterSpacing: '-0.005em',
                        }}
                      >
                        {label}
                      </p>
                      <p style={{ margin: 0, fontSize: 12.5, color: colors.textMuted, lineHeight: 1.55 }}>
                        {desc}
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      color={tint(colors.gold, 70)}
                      style={{ flexShrink: 0, marginTop: 4 }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>


          <p
            style={{
              margin: '36px auto 0',
              maxWidth: 520, textAlign: 'center',
              fontSize: 13, color: colors.textMuted,
            }}
          >
            Still stuck?{' '}
            <Link
              to="/company/contact"
              style={{ color: colors.gold, fontWeight: 700, textDecoration: 'none' }}
            >
              Contact our team →
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
