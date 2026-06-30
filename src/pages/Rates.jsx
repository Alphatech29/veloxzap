

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Search, RefreshCw,
  ArrowRight, Zap, Gift, Bitcoin,
} from 'lucide-react'
import SEO from '../components/SEO'
import usePublicGiftCardBrands from '../hooks/usePublicGiftCardBrands'

/* ─── design tokens ──────────────────────────────── */
const C = {
  navy:      'var(--color-brand-primary)',
  navyMid:   'var(--color-brand-mid)',
  gold:      'var(--color-brand-accent)',
  champagne: 'var(--color-brand-gold-soft)',
  text:      'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  surface:   'var(--color-surface)',
  border:    'var(--color-border)',
}
const tint  = (c, p) => `color-mix(in srgb, ${c} ${p}%, transparent)`
const fmtNGN = n => '₦' + Number(n).toLocaleString('en-NG', { maximumFractionDigits: 0 })

/* ─── crypto data (matches CryptoExchange rates) ─── */
const CRYPTO = [
  {
    id: 'BTC', name: 'Bitcoin',  symbol: 'BTC',
    logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/btc.png',
    rate: 98_450_000, change: +2.4,
  },
  {
    id: 'ETH', name: 'Ethereum', symbol: 'ETH',
    logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/eth.png',
    rate: 5_320_000,  change: +1.1,
  },
  {
    id: 'USDT', name: 'Tether',  symbol: 'USDT',
    logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/usdt.png',
    rate: 1_620,       change: +0.1,
  },
  {
    id: 'BNB', name: 'BNB',     symbol: 'BNB',
    logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/bnb.png',
    rate: 950_000,    change: -0.8,
  },
  {
    id: 'SOL', name: 'Solana',  symbol: 'SOL',
    logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/sol.png',
    rate: 235_000,    change: +3.6,
  },
  {
    id: 'XRP', name: 'XRP',     symbol: 'XRP',
    logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/xrp.png',
    rate: 950,         change: -1.2,
  },
]

/* ─── helpers for gift card brands ──────────────── */
function brandColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return `hsl(${h % 360}, 60%, 48%)`
}
function brandInitials(name) {
  const w = name.trim().split(/\s+/)
  return w.length > 1 ? (w[0][0] + w[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase()
}
function brandBestRate(brand) {
  const active = (brand.sub_categories || []).filter(s => s.status === 1)
  if (!active.length) return null
  return active.reduce((best, s) => (Number(s.rate) > Number(best.rate) ? s : best), active[0])
}

/* ─── tab pill ───────────────────────────────────── */
function TabPill({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 22px', borderRadius: 999, border: 'none',
        fontSize: 14, fontWeight: 700, cursor: 'pointer',
        transition: 'all 0.25s ease',
        background: active
          ? `linear-gradient(135deg, ${C.gold}, ${C.champagne})`
          : tint(C.navyMid, 40),
        color: active ? C.navy : C.textMuted,
        boxShadow: active ? `0 6px 20px ${tint(C.gold, 28)}` : 'none',
      }}
    >
      <Icon size={15} />
      {label}
    </button>
  )
}

/* ─── gift card brand row ────────────────────────── */
function BrandRow({ brand, delay }) {
  const best = brandBestRate(brand)
  const color = brandColor(brand.name)
  const count = (brand.sub_categories || []).filter(s => s.status === 1).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto',
        alignItems: 'center',
        gap: 16,
        padding: '14px 20px',
        borderRadius: 14,
        background: tint(C.navyMid, 30),
        border: `1px solid ${tint(C.gold, 8)}`,
        transition: 'border-color 0.2s, background 0.2s',
      }}
      whileHover={{ borderColor: tint(C.gold, 22), background: tint(C.navyMid, 45) }}
    >
      {/* Brand identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
        {brand.image ? (
          <img
            src={brand.image}
            alt={brand.name}
            style={{
              width: 40, height: 40, borderRadius: 10, objectFit: 'contain',
              background: tint('white', 8), padding: 4, flexShrink: 0,
            }}
          />
        ) : (
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: tint(color, 20), border: `1px solid ${tint(color, 40)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color,
          }}>
            {brandInitials(brand.name)}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {brand.name}
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
            {count} {count === 1 ? 'denomination' : 'denominations'}
          </div>
        </div>
      </div>

      {/* Rate */}
      <div style={{ textAlign: 'right' }}>
        {best ? (
          <>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.gold }}>
              {fmtNGN(best.rate)}
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>per {best.name || 'unit'}</div>
          </>
        ) : (
          <div style={{ fontSize: 13, color: C.textMuted }}>—</div>
        )}
      </div>

      {/* Change badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '4px 10px', borderRadius: 999,
        fontSize: 12, fontWeight: 700,
        background: tint('rgb(16,185,129)', 10),
        color: 'rgb(16,185,129)',
      }}>
        <TrendingUp size={11} />
        Live
      </div>

      {/* CTA */}
      <Link
        to="/auth/register"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '7px 14px', borderRadius: 999,
          fontSize: 12, fontWeight: 700, textDecoration: 'none',
          background: tint(C.gold, 14),
          color: C.gold,
          border: `1px solid ${tint(C.gold, 30)}`,
          whiteSpace: 'nowrap',
          transition: 'background 0.2s',
        }}
      >
        Sell <ArrowRight size={11} />
      </Link>
    </motion.div>
  )
}

/* ─── crypto row ─────────────────────────────────── */
function CryptoRow({ coin, delay }) {
  const up = coin.change >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto',
        alignItems: 'center',
        gap: 16,
        padding: '14px 20px',
        borderRadius: 14,
        background: tint(C.navyMid, 30),
        border: `1px solid ${tint(C.gold, 8)}`,
        transition: 'border-color 0.2s, background 0.2s',
      }}
      whileHover={{ borderColor: tint(C.gold, 22), background: tint(C.navyMid, 45) }}
    >
      {/* Coin identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <img
          src={coin.logo}
          alt={coin.name}
          style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{coin.name}</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
            {coin.symbol}
          </div>
        </div>
      </div>

      {/* Rate */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.gold }}>{fmtNGN(coin.rate)}</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>per {coin.symbol}</div>
      </div>

      {/* Change */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '4px 10px', borderRadius: 999,
        fontSize: 12, fontWeight: 700,
        background: up ? tint('rgb(16,185,129)', 10) : tint('rgb(239,68,68)', 10),
        color: up ? 'rgb(16,185,129)' : 'rgb(239,68,68)',
      }}>
        {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {up ? '+' : ''}{coin.change}%
      </div>

      {/* CTA */}
      <Link
        to="/auth/register"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '7px 14px', borderRadius: 999,
          fontSize: 12, fontWeight: 700, textDecoration: 'none',
          background: tint(C.gold, 14),
          color: C.gold,
          border: `1px solid ${tint(C.gold, 30)}`,
          whiteSpace: 'nowrap',
          transition: 'background 0.2s',
        }}
      >
        Swap <ArrowRight size={11} />
      </Link>
    </motion.div>
  )
}

/* ─── skeleton loader ────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            height: 68, borderRadius: 14,
            background: `linear-gradient(90deg, ${tint(C.navyMid, 30)}, ${tint(C.navyMid, 50)}, ${tint(C.navyMid, 30)})`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </div>
  )
}

/* ─── main page ──────────────────────────────────── */
export default function Rates() {
  const [tab, setTab]       = useState('giftcards')
  const [search, setSearch] = useState('')
  const { brands, loading } = usePublicGiftCardBrands()

  const filteredBrands = useMemo(() => {
    const q = search.toLowerCase()
    return brands
      .filter(b => b.name.toLowerCase().includes(q))
      .filter(b => brandBestRate(b) !== null)
  }, [brands, search])

  const filteredCrypto = useMemo(() => {
    const q = search.toLowerCase()
    return CRYPTO.filter(c =>
      c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
    )
  }, [search])

  const now = new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })

  return (
    <main style={{ background: C.navy, minHeight: '100vh', paddingBottom: 80 }}>
      <SEO
        title="Live Rates — Gift Cards & Crypto in Nigeria"
        description="Check real-time gift card and crypto exchange rates in naira. Amazon, iTunes, Steam, USDT, BTC, ETH and 200+ more — always the best rates on VeloxZap."
        path="/rates"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "VeloxZap Live Rates",
          "url": "https://veloxzap.com/rates",
          "description": "Real-time gift card and cryptocurrency exchange rates to Nigerian naira.",
          "publisher": { "@type": "Organization", "name": "VeloxZap", "url": "https://veloxzap.com" },
        }}
      />

      {/* ── hero ── */}
      <section style={{ position: 'relative', padding: '80px 24px 48px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${tint(C.gold, 10)}, transparent)`,
        }} />

        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '6px 16px', borderRadius: 999, marginBottom: 20,
            background: tint(C.gold, 10), border: `1px solid ${tint(C.gold, 28)}`,
            fontSize: 12, fontWeight: 700, color: C.gold, letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: C.gold,
              boxShadow: `0 0 8px ${C.gold}`, animation: 'pulse 2s infinite',
            }} />
            Live Rates
          </span>

          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 60px)', fontWeight: 800,
            color: C.text, letterSpacing: '-0.04em', lineHeight: 1.05, margin: '0 0 16px',
          }}>
            Always the{' '}
            <span style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.champagne})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              best rate
            </span>
            {' '}in Nigeria
          </h1>

          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.75, margin: '0 0 32px' }}>
            Real-time gift card and crypto exchange rates — 200+ brands, 6 coins, instant naira payouts.
          </p>

          {/* meta row */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 40 }}>
            {[
              { icon: Zap,       label: 'Instant payout'   },
              { icon: RefreshCw, label: `Updated ${now}`   },
              { icon: TrendingUp,label: 'Zero fees'         },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={13} color={C.gold} />
                <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 36 }}>
            <TabPill active={tab === 'giftcards'} onClick={() => { setTab('giftcards'); setSearch('') }}
              icon={Gift} label="Gift Cards" />
            <TabPill active={tab === 'crypto'} onClick={() => { setTab('crypto'); setSearch('') }}
              icon={Bitcoin} label="Crypto" />
          </div>

          {/* search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 14,
            background: tint(C.navyMid, 50), border: `1px solid ${tint(C.gold, 14)}`,
            maxWidth: 500, margin: '0 auto',
          }}>
            <Search size={16} color={tint(C.gold, 60)} />
            <input
              type="text"
              placeholder={tab === 'giftcards' ? 'Search gift cards...' : 'Search coins...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: C.text, fontSize: 14,
              }}
            />
          </div>
        </div>
      </section>

      {/* ── table ── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>

        {/* column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          gap: 16, padding: '0 20px 10px',
          fontSize: 11, fontWeight: 700, color: C.textMuted,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <span>{tab === 'giftcards' ? 'Brand' : 'Coin'}</span>
          <span style={{ textAlign: 'right' }}>Rate (NGN)</span>
          <span>24h</span>
          <span>Action</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            {tab === 'giftcards' ? (
              loading ? (
                <Skeleton />
              ) : filteredBrands.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: C.textMuted, fontSize: 14 }}>
                  No brands match "{search}"
                </div>
              ) : (
                filteredBrands.map((brand, i) => (
                  <BrandRow key={brand.id} brand={brand} delay={i * 0.03} />
                ))
              )
            ) : (
              filteredCrypto.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: C.textMuted, fontSize: 14 }}>
                  No coins match "{search}"
                </div>
              ) : (
                filteredCrypto.map((coin, i) => (
                  <CryptoRow key={coin.id} coin={coin} delay={i * 0.05} />
                ))
              )
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── CTA banner ── */}
      <section style={{ maxWidth: 900, margin: '56px auto 0', padding: '0 24px' }}>
        <div style={{
          borderRadius: 20, padding: '40px 36px',
          background: `linear-gradient(135deg, ${tint(C.navyMid, 70)}, ${tint(C.navy, 90)})`,
          border: `1px solid ${tint(C.gold, 18)}`,
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: 24,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%',
            background: `radial-gradient(circle, ${tint(C.gold, 12)}, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: C.text }}>
              Ready to trade at these rates?
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: C.textMuted }}>
              Sign up free — no bank required, no paperwork, instant naira payouts.
            </p>
          </div>
          <Link
            to="/auth/register"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 999, textDecoration: 'none',
              fontSize: 14, fontWeight: 800,
              background: `linear-gradient(135deg, ${C.gold}, ${C.champagne})`,
              color: C.navy, flexShrink: 0,
              boxShadow: `0 8px 24px ${tint(C.gold, 32)}`,
            }}
          >
            Create Free Account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1 }
          50%       { opacity: 0.4 }
        }
      `}</style>
    </main>
  )
}
