

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { colors, tint, gradientText } from './theme'
import { trustItems } from './data'

export default function Hero() {
  return (
    <div
      style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1280, margin: '0 auto',
        padding: 'clamp(48px, 8vw, 96px) 24px 0',
        textAlign: 'center',
      }}
    >
      
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span
          className="h-pill"
          style={{
            background: tint(colors.gold, 8),
            border: `1px solid ${tint(colors.gold, 26)}`,
            color: colors.gold,
            boxShadow: `0 0 20px ${tint(colors.gold, 18)}`,
          }}
        >
          <span
            className="h-dot"
            style={{ background: colors.gold, boxShadow: `0 0 10px ${colors.gold}` }}
          />
          500K+ Nigerians · Live Now
        </span>
      </motion.div>

      
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="f-head"
        style={{
          fontWeight: 800,
          fontSize: 'clamp(44px, 8.5vw, 108px)',
          color: colors.text,
          margin: '24px 0 0',
          lineHeight: 0.94,
          letterSpacing: '-0.055em',
        }}
      >
        Sell gift cards.<br />
        <motion.span
          animate={{ backgroundPosition: ['0% 50%', '200% 50%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          style={{
            ...gradientText(`linear-gradient(100deg, ${colors.gold}, ${colors.champagne}, ${colors.gold}, ${colors.champagne}, ${colors.gold})`),
            backgroundSize: '200% 100%',
            display: 'inline-block',
          }}
        >
          Pay anything, instantly.
        </motion.span>
      </motion.h1>

      
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.18 }}
        style={{
          fontSize: 'clamp(15px, 1.6vw, 18px)',
          color: colors.textMuted,
          lineHeight: 1.78,
          maxWidth: 580,
          margin: '24px auto 0',
        }}
      >
        Sell or buy gift cards, pay bills, recharge airtime &amp; data, and spend globally
        with a Visa virtual card — all in one place. Zero fees. Instant payouts. Bank-grade security.
      </motion.p>

      
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.26 }}
        style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}
      >
        <Link to="/auth/register" className="cta-gold">
          Start for Free <ArrowRight size={16} />
        </Link>
      </motion.div>

      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.34 }}
        style={{ display: 'flex', gap: 22, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}
      >
        {trustItems.map(({ icon: Icon, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon size={13} color={colors.gold} />
            <span style={{ fontSize: 12, color: colors.textMuted, fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
