

import { motion } from 'framer-motion'
import { Smartphone } from 'lucide-react'
import { colors, tint } from '../landing/theme'
import useSettings from '../../hooks/useSettings'

function BadgeImageLink({ src, alt, href }) {
  return (
    <motion.a
      href={href}
      target={href !== '#' ? '_blank' : undefined}
      rel={href !== '#' ? 'noopener noreferrer' : undefined}
      onClick={href === '#' ? e => e.preventDefault() : undefined}
      whileHover={{ scale: 1.03, opacity: 0.9 }}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <img src={src} alt={alt} style={{ height: 42, width: 'auto', display: 'block' }} />
    </motion.a>
  )
}

export default function DownloadApp() {
  const { settings } = useSettings()

  return (
    <section style={{ position: 'relative', zIndex: 2, padding: '36px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${tint(colors.gold, 8)}, transparent)`,
        }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'relative', borderRadius: 24, padding: '28px 32px',
            background: `linear-gradient(135deg, ${tint(colors.navyMid, 70)}, ${tint(colors.navy, 92)})`,
            border: `1px solid ${tint(colors.gold, 16)}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12,
          }}
        >
          <span
            className="h-pill"
            style={{
              background: tint(colors.gold, 10),
              border: `1px solid ${tint(colors.gold, 30)}`,
              color: colors.gold,
            }}
          >
            <Smartphone size={13} />
            Available Everywhere
          </span>

          <h2 style={{
            fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 800,
            color: colors.text, letterSpacing: '-0.03em', margin: 0, maxWidth: 640,
          }}>
            Take VeloxZap with you, everywhere you go
          </h2>

          <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6, maxWidth: 460, margin: 0 }}>
            Trade gift cards, swap crypto and pay bills from your phone. Download the app on your platform of choice.
          </p>

          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center',
            justifyContent: 'center', marginTop: 4,
          }}>
            <BadgeImageLink src="/badges/google-play-badge.png" alt="Get it on Google Play" href={settings?.playstore_url || '#'} />
            <BadgeImageLink src="/badges/app-store-badge.svg" alt="Download on the App Store" href={settings?.appstore_url || '#'} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
