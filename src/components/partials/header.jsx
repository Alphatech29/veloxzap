import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, ChevronDown, Gift, Receipt, CreditCard, Smartphone,
  Menu, X, ArrowRight, Sparkles, Bitcoin, Globe2,
  Building2, BriefcaseBusiness, Newspaper, Mail,
} from 'lucide-react'

const C = {
  gold:      'var(--color-brand-accent)',
  navy:      'var(--color-brand-primary)',
  navyMid:   'var(--color-brand-mid)',
  champagne: 'var(--color-brand-gold-soft)',
  text:      'var(--color-text)',
  muted:     'var(--color-text-muted)',
}
const tint = (v, p) => `color-mix(in srgb, ${v} ${p}%, transparent)`
const goldGrad = `linear-gradient(135deg, ${C.gold}, ${C.champagne})`

const products = [
  { icon: Gift,       label: 'Buy & Sell Gift Cards', desc: 'Trade Amazon, iTunes, Steam at the best naira rates', href: '/gift-cards',   accent: C.gold,      badge: 'Top rates' },
  { icon: Receipt,    label: 'Pay Bills',             desc: 'DSTV, GOTV, electricity & 100+ billers',              href: '/bills',         accent: C.champagne },
  { icon: Smartphone, label: 'Airtime & Data',        desc: 'MTN, Airtel, Glo, 9mobile — instant top-up',          href: '/airtime',       accent: C.gold },
  { icon: Bitcoin,    label: 'Crypto Swap',           desc: 'Swap BTC, USDT, ETH to naira at live market rates',   href: '/crypto-swap',   accent: C.gold,      badge: 'New' },
  { icon: Globe2,     label: 'Spend Globally',        desc: 'Pay in 200+ countries with a naira-funded Visa card', href: '/spend-globally', accent: C.gold,     badge: 'New' },
]

const company = [
  { icon: Building2,         label: 'About Us', desc: 'Our mission, story and the team behind VeloxZap',     href: '/company/about',    accent: C.gold },
  { icon: BriefcaseBusiness, label: 'Careers',  desc: 'Build the future of African fintech with us',         href: '/company/careers',  accent: C.champagne, badge: 'Hiring' },
  { icon: Newspaper,         label: 'Blog',     desc: 'Product updates, market insights and announcements',  href: '/company/blog',     accent: C.gold },
  { icon: Mail,              label: 'Contact',  desc: 'Reach support, partnerships or press in minutes',     href: '/company/contact',  accent: C.gold },
]

const navLinks = [
  { label: 'Home',     href: '/'         },
  { label: 'Security', href: '/security' },
]

export default function Header() {
  const [scrolled,           setScrolled]           = useState(false)
  const [productsOpen,       setProductsOpen]       = useState(false)
  const [companyOpen,        setCompanyOpen]        = useState(false)
  const [mobileOpen,         setMobileOpen]         = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [mobileCompanyOpen,  setMobileCompanyOpen]  = useState(false)
  const [bannerVisible,      setBannerVisible]      = useState(true)
  const dropdownRef        = useRef(null)
  const companyDropdownRef = useRef(null)
  const location           = useLocation()

  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  
  
  
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (mobileOpen)   setMobileOpen(false)
    if (productsOpen) setProductsOpen(false)
    if (companyOpen)  setCompanyOpen(false)
  }, [location])
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProductsOpen(false)
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(e.target)) setCompanyOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001 }}
          >
            <div
              style={{
                position: 'relative',
                background: `linear-gradient(90deg, ${C.navy}, ${C.navyMid} 50%, ${C.navy})`,
                padding: '8px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                minHeight: 36,
              }}
            >
              
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${tint(C.gold, 60)}, transparent)` }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${tint(C.gold, 30)}, transparent)` }} />

              <Sparkles size={12} color={C.champagne} style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 12, fontWeight: 600,
                  color: C.text, letterSpacing: '-0.01em',
                  textAlign: 'center', lineHeight: 1.4,
                }}
              >
                <span className="promo-long">
                  Sell gift cards at our best-ever rates this week —{' '}
                  <span style={{ color: C.gold, fontWeight: 700 }}>Limited time</span>
                </span>
                <span className="promo-short">Best gift card rates — Limited time</span>
              </span>

              <Link
                to="/gift-cards"
                className="promo-btn-hide"
                style={{
                  color: C.navy, fontWeight: 800, fontSize: 11, textDecoration: 'none',
                  padding: '4px 12px', borderRadius: 99,
                  background: goldGrad,
                  boxShadow: `0 4px 14px ${tint(C.gold, 40)}, inset 0 1px 0 ${tint('white', 30)}`,
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                Trade Now →
              </Link>

              <button
                onClick={() => setBannerVisible(false)}
                aria-label="Close banner"
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: tint(C.text, 65), cursor: 'pointer',
                  padding: 4, display: 'flex', alignItems: 'center',
                  transition: 'color 0.18s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={e => (e.currentTarget.style.color = tint(C.text, 65))}
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <header
        style={{
          position: 'fixed',
          top: bannerVisible ? 36 : 0,
          left: 0, right: 0,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          background:    scrolled ? tint(C.navy, 85) : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom:  scrolled ? `1px solid ${tint(C.gold, 14)}` : '1px solid transparent',
          boxShadow:     scrolled
            ? `0 4px 40px ${tint('black', 40)}, 0 0 0 1px ${tint(C.gold, 6)}`
            : 'none',
        }}
      >
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

            
            <Link
              to="/"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}
              aria-label="VeloxZap home"
            >
              <motion.div
                whileHover={{ rotate: -6, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                style={{
                  width: 36, height: 36, borderRadius: 11,
                  background: goldGrad,
                  display: 'grid', placeItems: 'center',
                  boxShadow: `0 8px 22px ${tint(C.gold, 40)}, inset 0 1px 0 ${tint('white', 35)}`,
                  flexShrink: 0,
                }}
              >
                <Zap size={18} color={C.navy} fill={C.navy} />
              </motion.div>
              <span
                className="f-head"
                style={{
                  fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px',
                  color: C.text,
                }}
              >
                Velox
                <span
                  style={{
                    background: goldGrad,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Zap
                </span>
              </span>
            </Link>

            
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

              
              <NavLinkUnderlined
                to={navLinks[0].href}
                isActive={location.pathname === navLinks[0].href}
              >
                {navLinks[0].label}
              </NavLinkUnderlined>

              
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <NavButton
                  active={productsOpen}
                  onClick={() => setProductsOpen(prev => !prev)}
                >
                  Products
                  <motion.span animate={{ rotate: productsOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'inline-flex' }}>
                    <ChevronDown size={14} />
                  </motion.span>
                </NavButton>

                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 12px)',
                        left: '50%', transform: 'translateX(-50%)',
                        width: 480,
                        background: tint(C.navy, 96),
                        border: `1px solid ${tint(C.gold, 18)}`,
                        borderRadius: 18,
                        padding: 14,
                        boxShadow: `0 24px 72px ${tint('black', 65)}, 0 0 0 1px ${tint(C.gold, 8)}, 0 0 60px ${tint(C.gold, 10)}`,
                        backdropFilter: 'blur(28px)',
                        WebkitBackdropFilter: 'blur(28px)',
                      }}
                    >
                      
                      <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: `linear-gradient(90deg, transparent, ${tint(C.champagne, 70)}, transparent)` }} />

                      
                      <div style={{ padding: '6px 10px 12px', borderBottom: `1px solid ${tint('white', 5)}`, marginBottom: 10 }}>
                        <p
                          className="f-mono"
                          style={{
                            margin: 0, fontSize: 10, fontWeight: 700,
                            letterSpacing: '0.14em', color: C.gold,
                            textTransform: 'uppercase',
                          }}
                        >
                          Our Services
                        </p>
                      </div>

                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        {products.map(({ icon: Icon, label, desc, accent, href, badge }) => (
                          <Link
                            key={label}
                            to={href}
                            style={{ textDecoration: 'none' }}
                            onClick={() => setProductsOpen(false)}
                          >
                            <motion.div
                              whileHover={{ y: -2 }}
                              transition={{ duration: 0.15 }}
                              className="mega-item"
                              style={{
                                padding: 12, borderRadius: 12,
                                display: 'flex', alignItems: 'flex-start', gap: 12,
                                cursor: 'pointer',
                                background: 'transparent',
                                transition: 'background 0.15s, border-color 0.15s',
                                position: 'relative',
                                border: `1px solid transparent`,
                                ['--mega-bg']: tint(accent, 6),
                                ['--mega-border']: tint(accent, 22),
                              }}
                            >
                              {badge && (
                                <span
                                  className="f-mono"
                                  style={{
                                    position: 'absolute', top: 8, right: 8,
                                    fontSize: 8, fontWeight: 800, letterSpacing: '0.1em',
                                    color: C.navy,
                                    background: goldGrad,
                                    borderRadius: 99,
                                    padding: '2px 7px',
                                    textTransform: 'uppercase',
                                    boxShadow: `0 4px 10px ${tint(accent, 30)}`,
                                  }}
                                >
                                  {badge}
                                </span>
                              )}
                              <div
                                style={{
                                  width: 38, height: 38, borderRadius: 10,
                                  background: tint(accent, 14),
                                  display: 'grid', placeItems: 'center',
                                  flexShrink: 0,
                                  border: `1px solid ${tint(accent, 28)}`,
                                  boxShadow: `0 0 14px ${tint(accent, 18)}`,
                                }}
                              >
                                <Icon size={18} color={accent} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <p className="f-head" style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 700, color: C.text }}>
                                  {label}
                                </p>
                                <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.45 }}>
                                  {desc}
                                </p>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>

                      
                      <div style={{ padding: '12px 10px 4px', borderTop: `1px solid ${tint('white', 5)}`, marginTop: 10 }}>
                        <Link
                          to="/products"
                          onClick={() => setProductsOpen(false)}
                          style={{
                            textDecoration: 'none',
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            color: C.gold, fontSize: 13, fontWeight: 700,
                            transition: 'gap 0.18s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.gap = '10px')}
                          onMouseLeave={e => (e.currentTarget.style.gap = '6px')}
                        >
                          View all services <ArrowRight size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              
              {navLinks.slice(1).map(({ label, href }) => (
                <NavLinkUnderlined
                  key={label}
                  to={href}
                  isActive={location.pathname === href}
                >
                  {label}
                </NavLinkUnderlined>
              ))}


              <div ref={companyDropdownRef} style={{ position: 'relative' }}>
                <NavButton
                  active={companyOpen}
                  onClick={() => setCompanyOpen(prev => !prev)}
                >
                  Company
                  <motion.span animate={{ rotate: companyOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'inline-flex' }}>
                    <ChevronDown size={14} />
                  </motion.span>
                </NavButton>

                <AnimatePresence>
                  {companyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 12px)',
                        left: '50%', transform: 'translateX(-50%)',
                        width: 480,
                        background: tint(C.navy, 96),
                        border: `1px solid ${tint(C.gold, 18)}`,
                        borderRadius: 18,
                        padding: 14,
                        boxShadow: `0 24px 72px ${tint('black', 65)}, 0 0 0 1px ${tint(C.gold, 8)}, 0 0 60px ${tint(C.gold, 10)}`,
                        backdropFilter: 'blur(28px)',
                        WebkitBackdropFilter: 'blur(28px)',
                      }}
                    >

                      <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: `linear-gradient(90deg, transparent, ${tint(C.champagne, 70)}, transparent)` }} />


                      <div style={{ padding: '6px 10px 12px', borderBottom: `1px solid ${tint('white', 5)}`, marginBottom: 10 }}>
                        <p
                          className="f-mono"
                          style={{
                            margin: 0, fontSize: 10, fontWeight: 700,
                            letterSpacing: '0.14em', color: C.gold,
                            textTransform: 'uppercase',
                          }}
                        >
                          About VeloxZap
                        </p>
                      </div>


                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        {company.map(({ icon: Icon, label, desc, accent, href, badge }) => (
                          <Link
                            key={label}
                            to={href}
                            style={{ textDecoration: 'none' }}
                            onClick={() => setCompanyOpen(false)}
                          >
                            <motion.div
                              whileHover={{ y: -2 }}
                              transition={{ duration: 0.15 }}
                              className="mega-item"
                              style={{
                                padding: 12, borderRadius: 12,
                                display: 'flex', alignItems: 'flex-start', gap: 12,
                                cursor: 'pointer',
                                background: 'transparent',
                                transition: 'background 0.15s, border-color 0.15s',
                                position: 'relative',
                                border: `1px solid transparent`,
                                ['--mega-bg']: tint(accent, 6),
                                ['--mega-border']: tint(accent, 22),
                              }}
                            >
                              {badge && (
                                <span
                                  className="f-mono"
                                  style={{
                                    position: 'absolute', top: 8, right: 8,
                                    fontSize: 8, fontWeight: 800, letterSpacing: '0.1em',
                                    color: C.navy,
                                    background: goldGrad,
                                    borderRadius: 99,
                                    padding: '2px 7px',
                                    textTransform: 'uppercase',
                                    boxShadow: `0 4px 10px ${tint(accent, 30)}`,
                                  }}
                                >
                                  {badge}
                                </span>
                              )}
                              <div
                                style={{
                                  width: 38, height: 38, borderRadius: 10,
                                  background: tint(accent, 14),
                                  display: 'grid', placeItems: 'center',
                                  flexShrink: 0,
                                  border: `1px solid ${tint(accent, 28)}`,
                                  boxShadow: `0 0 14px ${tint(accent, 18)}`,
                                }}
                              >
                                <Icon size={18} color={accent} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <p className="f-head" style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 700, color: C.text }}>
                                  {label}
                                </p>
                                <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.45 }}>
                                  {desc}
                                </p>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>


                      <div style={{ padding: '12px 10px 4px', borderTop: `1px solid ${tint('white', 5)}`, marginTop: 10 }}>
                        <Link
                          to="/company"
                          onClick={() => setCompanyOpen(false)}
                          style={{
                            textDecoration: 'none',
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            color: C.gold, fontSize: 13, fontWeight: 700,
                            transition: 'gap 0.18s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.gap = '10px')}
                          onMouseLeave={e => (e.currentTarget.style.gap = '6px')}
                        >
                          More about us <ArrowRight size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            
            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link
                to="/auth/login"
                style={{
                  padding: '9px 20px', borderRadius: 11,
                  textDecoration: 'none',
                  color: C.text, fontSize: 14, fontWeight: 600,
                  border: `1px solid ${tint(C.gold, 22)}`,
                  background: tint(C.gold, 5),
                  transition: 'all 0.18s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = tint(C.gold, 12)
                  e.currentTarget.style.borderColor = tint(C.gold, 38)
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = tint(C.gold, 5)
                  e.currentTarget.style.borderColor = tint(C.gold, 22)
                }}
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                style={{
                  padding: '10px 22px', borderRadius: 11,
                  textDecoration: 'none',
                  color: C.navy, fontSize: 14, fontWeight: 800,
                  background: goldGrad,
                  boxShadow: `0 6px 22px ${tint(C.gold, 40)}, inset 0 1px 0 ${tint('white', 30)}`,
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  letterSpacing: '-0.1px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 12px 32px ${tint(C.gold, 55)}, inset 0 1px 0 ${tint('white', 35)}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = `0 6px 22px ${tint(C.gold, 40)}, inset 0 1px 0 ${tint('white', 30)}`
                }}
              >
                Get Started <ArrowRight size={14} />
              </Link>
            </div>

            
            <button
              onClick={() => setMobileOpen(prev => !prev)}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
              style={{
                display: 'none',
                alignItems: 'center', justifyContent: 'center',
                width: 42, height: 42, borderRadius: 11,
                border: `1px solid ${tint(C.gold, 22)}`,
                background: tint(C.gold, 6),
                color: C.gold, cursor: 'pointer',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'flex' }}
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        
        <div
          aria-hidden
          style={{
            position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: scrolled ? '60%' : '0%', height: 1,
            background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.champagne}, transparent)`,
            transition: 'width 0.5s ease, opacity 0.5s ease',
            opacity: scrolled ? 1 : 0,
          }}
        />
      </header>

      
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: tint('black', 60),
                zIndex: 9998,
                backdropFilter: 'blur(4px)',
              }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 320, maxWidth: '90vw',
                background: tint(C.navy, 96),
                borderLeft: `1px solid ${tint(C.gold, 18)}`,
                zIndex: 9999,
                display: 'flex', flexDirection: 'column',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                boxShadow: `0 0 60px ${tint('black', 60)}`,
              }}
            >
              
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px 24px',
                  borderBottom: `1px solid ${tint('white', 6)}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div
                    style={{
                      width: 30, height: 30, borderRadius: 9,
                      background: goldGrad,
                      display: 'grid', placeItems: 'center',
                      boxShadow: `0 6px 14px ${tint(C.gold, 40)}, inset 0 1px 0 ${tint('white', 30)}`,
                    }}
                  >
                    <Zap size={15} color={C.navy} fill={C.navy} />
                  </div>
                  <span
                    className="f-head"
                    style={{ fontSize: 18, fontWeight: 800, color: C.text, letterSpacing: '-0.4px' }}
                  >
                    Velox
                    <span
                      style={{
                        background: goldGrad,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Zap
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  style={{ background: 'transparent', border: 'none', color: C.muted, cursor: 'pointer', padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>

              
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
                
                {(() => {
                  const { label, href } = navLinks[0]
                  const active = location.pathname === href
                  return (
                    <Link
                      to={href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'block',
                        padding: '13px 24px',
                        textDecoration: 'none',
                        color: active ? C.gold : C.text,
                        fontSize: 15, fontWeight: 700,
                        background: active ? tint(C.gold, 6) : 'transparent',
                        borderLeft: active ? `2px solid ${C.gold}` : '2px solid transparent',
                        transition: 'color 0.15s, background 0.15s',
                      }}
                    >
                      {label}
                    </Link>
                  )
                })()}

                <button
                  onClick={() => setMobileProductsOpen(prev => !prev)}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '13px 24px',
                    background: 'transparent', border: 'none',
                    color: mobileProductsOpen ? C.gold : C.text,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  Products
                  <motion.span animate={{ rotate: mobileProductsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} color={mobileProductsOpen ? C.gold : C.muted} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {mobileProductsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '4px 16px 12px' }}>
                        {products.map(({ icon: Icon, label, desc, accent, href }) => (
                          <Link
                            key={label}
                            to={href}
                            onClick={() => setMobileOpen(false)}
                            style={{ textDecoration: 'none', display: 'block' }}
                          >
                            <div
                              style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '10px 12px', borderRadius: 10, marginBottom: 4,
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = tint(accent, 8))}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                              <div
                                style={{
                                  width: 34, height: 34, borderRadius: 9,
                                  background: tint(accent, 14),
                                  border: `1px solid ${tint(accent, 28)}`,
                                  display: 'grid', placeItems: 'center', flexShrink: 0,
                                }}
                              >
                                <Icon size={16} color={accent} />
                              </div>
                              <div>
                                <p className="f-head" style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: C.text }}>
                                  {label}
                                </p>
                                <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.4 }}>
                                  {desc}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {navLinks.slice(1).map(({ label, href }) => {
                  const active = location.pathname === href
                  return (
                    <Link
                      key={label}
                      to={href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'block',
                        padding: '13px 24px',
                        textDecoration: 'none',
                        color: active ? C.gold : C.text,
                        fontSize: 15, fontWeight: 700,
                        background: active ? tint(C.gold, 6) : 'transparent',
                        borderLeft: active ? `2px solid ${C.gold}` : '2px solid transparent',
                        transition: 'color 0.15s, background 0.15s',
                      }}
                    >
                      {label}
                    </Link>
                  )
                })}

                <button
                  onClick={() => setMobileCompanyOpen(prev => !prev)}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '13px 24px',
                    background: 'transparent', border: 'none',
                    color: mobileCompanyOpen ? C.gold : C.text,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  Company
                  <motion.span animate={{ rotate: mobileCompanyOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} color={mobileCompanyOpen ? C.gold : C.muted} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {mobileCompanyOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '4px 16px 12px' }}>
                        {company.map(({ icon: Icon, label, desc, accent, href }) => (
                          <Link
                            key={label}
                            to={href}
                            onClick={() => setMobileOpen(false)}
                            style={{ textDecoration: 'none', display: 'block' }}
                          >
                            <div
                              style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '10px 12px', borderRadius: 10, marginBottom: 4,
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = tint(accent, 8))}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                              <div
                                style={{
                                  width: 34, height: 34, borderRadius: 9,
                                  background: tint(accent, 14),
                                  border: `1px solid ${tint(accent, 28)}`,
                                  display: 'grid', placeItems: 'center', flexShrink: 0,
                                }}
                              >
                                <Icon size={16} color={accent} />
                              </div>
                              <div>
                                <p className="f-head" style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: C.text }}>
                                  {label}
                                </p>
                                <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.4 }}>
                                  {desc}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              
              <div
                style={{
                  padding: '20px 24px',
                  borderTop: `1px solid ${tint('white', 6)}`,
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}
              >
                <Link
                  to="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block', padding: '13px',
                    borderRadius: 12, textAlign: 'center',
                    textDecoration: 'none',
                    color: C.text, fontSize: 15, fontWeight: 700,
                    border: `1px solid ${tint(C.gold, 22)}`,
                    background: tint(C.gold, 6),
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '13px', borderRadius: 12,
                    textDecoration: 'none',
                    color: C.navy, fontSize: 15, fontWeight: 800,
                    background: goldGrad,
                    boxShadow: `0 6px 20px ${tint(C.gold, 40)}, inset 0 1px 0 ${tint('white', 30)}`,
                  }}
                >
                  Get Started <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav     { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        .mega-item:hover {
          background: var(--mega-bg) !important;
          border-color: var(--mega-border) !important;
        }
        .nav-link-underline::after {
          content: '';
          position: absolute;
          left: 14px; right: 14px; bottom: 4px;
          height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, transparent, ${C.gold}, ${C.champagne}, transparent);
          transform: scaleX(0); transform-origin: center;
          transition: transform 0.22s ease;
        }
        .nav-link-underline:hover::after,
        .nav-link-underline.is-active::after { transform: scaleX(1); }
      `}</style>
    </>
  )
}

function NavButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '8px 14px', borderRadius: 10,
        border: 'none',
        background: active ? tint(C.gold, 12) : 'transparent',
        color:      active ? C.gold : tint(C.text, 80),
        fontSize: 14, fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.18s',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.color = C.text
          e.currentTarget.style.background = tint(C.gold, 6)
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.color = tint(C.text, 80)
          e.currentTarget.style.background = 'transparent'
        }
      }}
    >
      {children}
    </button>
  )
}

function NavLinkUnderlined({ to, isActive, children }) {
  return (
    <Link
      to={to}
      className={`nav-link-underline${isActive ? ' is-active' : ''}`}
      style={{
        position: 'relative',
        padding: '8px 14px',
        textDecoration: 'none',
        color: isActive ? C.text : tint(C.text, 75),
        fontSize: 14, fontWeight: 600,
        transition: 'color 0.18s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = C.text)}
      onMouseLeave={e => (e.currentTarget.style.color = isActive ? C.text : tint(C.text, 75))}
    >
      {children}
    </Link>
  )
}
