

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, CheckCircle, Clock } from 'lucide-react'
import { colors, tint, gradientText } from './theme'

const trustBadges = [
  { icon: ShieldCheck, label: 'Enterprise Security' },
  { icon: CheckCircle, label: 'Zero Fees'        },
  { icon: Clock,       label: 'Instant Payouts' },
]

export default function FinalCTA() {
  return (
    <section style={{ position: 'relative', zIndex: 2, padding: '60px 24px 100px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="cta-banner"
        >
          
          <div
            style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(135deg, ${tint(colors.navyMid, 90)} 0%, ${tint(colors.navy, 95)} 50%, ${tint(colors.navyMid, 85)} 100%)`,
            }}
          />
          <div
            style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${tint(colors.gold, 14)}, transparent)`,
            }}
          />
          <div
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 80)}, ${tint(colors.champagne, 50)}, transparent)`,
            }}
          />
          <div
            style={{
              position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%',
              background: `radial-gradient(circle, ${tint(colors.gold, 12)} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute', bottom: -80, left: -80, width: 320, height: 320, borderRadius: '50%',
              background: `radial-gradient(circle, ${tint(colors.champagne, 10)} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          
          <div
            style={{
              position: 'relative', zIndex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
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
              <span
                className="h-dot"
                style={{ background: colors.gold, boxShadow: `0 0 10px ${colors.gold}` }}
              />
              Ready to start?
            </span>

            <h2
              className="f-head"
              style={{
                fontWeight: 800,
                fontSize: 'clamp(30px, 5.5vw, 64px)',
                color: colors.text,
                margin: 0,
                letterSpacing: '-0.05em',
                lineHeight: 1.0,
                maxWidth: 720,
              }}
            >
              Your money, moving at the{' '}
              <span style={gradientText(`linear-gradient(100deg, ${colors.gold}, ${colors.champagne}, ${colors.gold})`)}>
                speed of light.
              </span>
            </h2>

            <p
              style={{
                fontSize: 16, color: colors.textMuted,
                lineHeight: 1.75, maxWidth: 480, margin: 0,
              }}
            >
              Join 500,000+ Nigerians already using VeloxZap. Free to sign up — no paperwork, no branch visits, no waiting.
            </p>

            <div
              style={{
                display: 'flex', flexWrap: 'wrap', gap: 12,
                justifyContent: 'center', marginTop: 4,
              }}
            >
              <Link to="/auth/register" className="cta-gold">
                Create Free Account <ArrowRight size={17} />
              </Link>
              <Link to="/about" className="cta-ghost">Learn More</Link>
            </div>

            <div
              style={{
                display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 22,
                marginTop: 6,
              }}
            >
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Icon size={13} color={colors.gold} />
                  <span style={{ fontSize: 12, color: colors.textMuted, fontWeight: 500 }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
