

import { motion } from 'framer-motion'
import { Zap, ArrowUpRight } from 'lucide-react'
import { colors, tint, goldGradient, gradientText } from './theme'
import { liveRates, quickActions } from './data'
import CountUp from './CountUp'

export default function Card3D() {
  return (
    <div
      style={{
        width: 'min(560px, 88vw)',
        borderRadius: 28,
        background: `linear-gradient(160deg, ${tint(colors.navyMid, 92)}, ${tint(colors.navy, 96)})`,
        border: `1px solid ${tint(colors.gold, 22)}`,
        padding: 'clamp(20px, 3vw, 30px)',
        boxShadow: `0 80px 140px ${tint('black', 65)}, 0 0 60px ${tint(colors.gold, 12)}, inset 0 1px 0 ${tint('white', 12)}`,
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
      }}
    >
      
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${tint(colors.champagne, 70)}, transparent)`,
      }} />

      
      <div style={{
        position: 'absolute', top: -80, right: -80, width: 220, height: 220,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${tint(colors.gold, 22)}, transparent 70%)`,
      }} />

      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div
            animate={{ rotate: [0, 8, 0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 38, height: 38, borderRadius: 11,
              background: goldGradient,
              display: 'grid', placeItems: 'center',
              boxShadow: `0 10px 28px ${tint(colors.gold, 50)}, inset 0 1px 0 ${tint('white', 35)}`,
            }}
          >
            <Zap size={17} color={colors.navy} fill={colors.navy} />
          </motion.div>
          <div>
            <p className="f-head" style={{ fontSize: 13, fontWeight: 800, color: colors.text, margin: 0 }}>VeloxZap Pro</p>
            <p className="f-mono" style={{ fontSize: 10, color: colors.textMuted, margin: 0 }}>v3.2 · sync’d</p>
          </div>
        </div>

        <div
          className="h-pill"
          style={{
            background: tint(colors.champagne, 14),
            border: `1px solid ${tint(colors.champagne, 32)}`,
            color: colors.champagne,
            padding: '4px 11px',
            fontSize: 10,
          }}
        >
          <span className="h-dot" style={{ background: colors.champagne, boxShadow: `0 0 10px ${colors.champagne}` }} />
          LIVE
        </div>
      </div>

      
      <p
        className="f-mono"
        style={{ fontSize: 10, color: colors.textMuted, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.14em' }}
      >
        Total Balance
      </p>
      <p
        className="f-head"
        style={{ fontWeight: 800, fontSize: 'clamp(34px, 5vw, 48px)', margin: 0, letterSpacing: '-0.045em', ...gradientText(goldGradient) }}
      >
        ₦<CountUp end={2450800} />
      </p>

      
      <div
        className="f-mono"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '3px 10px', margin: '6px 0 22px', borderRadius: 99,
          background: tint(colors.champagne, 12),
          border: `1px solid ${tint(colors.champagne, 26)}`,
          color: colors.champagne, fontSize: 10, fontWeight: 700,
        }}
      >
        <ArrowUpRight size={11} />
        +₦124,500 today
      </div>

      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 22 }}>
        {quickActions.map(({ icon: Icon, label }) => (
          <div key={label} className="qa">
            <Icon size={15} color={colors.gold} />
            <span style={{ fontSize: 10, color: colors.text, fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>

      
      <p
        className="f-mono"
        style={{ fontSize: 10, color: colors.textMuted, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.14em' }}
      >
        Live Gift Card Rates
      </p>
      {liveRates.map(({ name, price, color, change }, index) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.7 + index * 0.12 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 0', borderBottom: `1px solid ${tint('white', 5)}`,
          }}
        >
          <span style={{ fontSize: 12, color: colors.text, fontWeight: 600 }}>{name}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="f-mono" style={{ fontSize: 11, color, fontWeight: 700 }}>{price}</span>
            <span
              className="f-mono"
              style={{ fontSize: 9, color, padding: '2px 6px', borderRadius: 5, background: tint(color, 14) }}
            >
              {change}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
