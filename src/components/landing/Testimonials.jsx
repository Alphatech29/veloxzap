

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { colors, tint, goldGradient, gradientText } from './theme'
import { testimonials } from './data'
import SectionHead from './SectionHead'

export default function Testimonials() {
  return (
    <section
      style={{
        position: 'relative', zIndex: 2,
        padding: 'clamp(64px, 9vw, 100px) 24px 40px',
        background: tint(colors.navy, 40),
        borderTop: `1px solid ${tint(colors.gold, 6)}`,
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionHead
          pill="Testimonials"
          title={<>Loved by thousands <span style={gradientText(goldGradient)}>across Nigeria.</span></>}
          sub="Real stories from real users who trust VeloxZap every day."
        />

        <div className="testi-masonry">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="testi"
            >
              
              <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={13} color={colors.gold} fill={colors.gold} />
                ))}
              </div>

              
              <p
                style={{
                  fontSize: 14, color: tint(colors.text, 75),
                  lineHeight: 1.75, margin: '0 0 18px', fontStyle: 'italic',
                }}
              >
                “{t.quote}”
              </p>

              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${index % 2 === 0 ? colors.gold : colors.champagne}, ${colors.navyMid})`,
                    display: 'grid', placeItems: 'center',
                    boxShadow: `0 8px 18px ${tint(colors.gold, 18)}`,
                    flexShrink: 0,
                  }}
                >
                  <span
                    className="f-head"
                    style={{ fontSize: 14, fontWeight: 800, color: colors.navy }}
                  >
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p
                    className="f-head"
                    style={{ fontSize: 13, fontWeight: 800, color: colors.text, margin: 0 }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{ fontSize: 11, color: colors.textMuted, margin: 0 }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
