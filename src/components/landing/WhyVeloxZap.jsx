

import { motion } from 'framer-motion'
import { colors, tint, goldGradient, gradientText } from './theme'
import { pillars } from './data'
import SectionHead from './SectionHead'

export default function WhyVeloxZap() {
  return (
    <section
      style={{
        position: 'relative', zIndex: 2,
        padding: 'clamp(64px, 9vw, 100px) 24px 40px',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionHead
          pill="Why VeloxZap"
          title={<>Built different. <span style={gradientText(goldGradient)}>Trusted by 500K+.</span></>}
          sub="Three reasons Nigerians choose VeloxZap over every other exchange in the country."
        />

        <div className="testi-masonry">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                className="pillar"
              >
                
                <div
                  style={{
                    position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
                    background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 50)}, transparent)`,
                  }}
                />

                
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: tint(colors.gold, 12),
                    border: `1px solid ${tint(colors.gold, 28)}`,
                    display: 'grid', placeItems: 'center',
                    marginBottom: 18,
                    boxShadow: `0 0 24px ${tint(colors.gold, 16)}`,
                  }}
                >
                  <Icon size={22} color={colors.gold} />
                </div>

                
                <h3
                  className="f-head"
                  style={{
                    fontSize: 19, fontWeight: 800, color: colors.text,
                    margin: '0 0 10px', letterSpacing: '-0.02em',
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  style={{
                    fontSize: 13, color: colors.textMuted,
                    lineHeight: 1.7, margin: '0 0 18px',
                  }}
                >
                  {pillar.desc}
                </p>

                
                <div
                  style={{
                    padding: '14px 18px', borderRadius: 12,
                    background: tint(colors.gold, 6),
                    border: `1px solid ${tint(colors.gold, 14)}`,
                  }}
                >
                  <p
                    className="f-head"
                    style={{
                      fontSize: 24, fontWeight: 800, margin: 0,
                      letterSpacing: '-0.03em',
                      ...gradientText(goldGradient),
                    }}
                  >
                    {pillar.metric}
                  </p>
                  <p
                    className="f-mono"
                    style={{
                      fontSize: 10, color: colors.textMuted,
                      margin: '2px 0 0', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}
                  >
                    {pillar.metricLabel}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
