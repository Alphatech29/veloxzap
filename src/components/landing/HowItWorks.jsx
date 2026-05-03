

import { motion } from 'framer-motion'
import { colors, tint, goldGradient, gradientText } from './theme'
import { steps } from './data'
import SectionHead from './SectionHead'

export default function HowItWorks() {
  return (
    <section
      style={{
        position: 'relative', zIndex: 2,
        padding: 'clamp(64px, 9vw, 100px) 24px 40px',
        background: tint(colors.navy, 50),
        borderTop: `1px solid ${tint(colors.gold, 6)}`,
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionHead
          pill="How it works"
          title={<>Up and running <span style={gradientText(goldGradient)}>in 60 seconds.</span></>}
          sub="Four steps. No waiting. No paperwork. Instant access to all five services."
        />

        <div className="svc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="step-card"
              >
                
                <span className="step-num" style={{ color: step.color }}>
                  {step.number}
                </span>

                
                <div
                  style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${step.color}, ${tint(step.color, 55)})`,
                    display: 'grid', placeItems: 'center',
                    margin: '0 auto 16px',
                    boxShadow: `0 10px 24px ${tint(step.color, 32)}`,
                  }}
                >
                  <Icon size={20} color={colors.navy} />
                </div>

                
                <h3
                  className="f-head"
                  style={{
                    fontSize: 15, fontWeight: 800, color: colors.text,
                    margin: '0 0 8px', textAlign: 'center',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 12.5, color: colors.textMuted,
                    lineHeight: 1.7, margin: 0, textAlign: 'center',
                  }}
                >
                  {step.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
