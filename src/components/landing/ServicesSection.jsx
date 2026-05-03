

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { colors, tint, goldGradient, gradientText } from './theme'
import { services } from './data'
import SectionHead from './SectionHead'

export default function ServicesSection() {
  return (
    <section style={{ position: 'relative', zIndex: 2, padding: 'clamp(72px, 10vw, 120px) 24px 40px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionHead
          pill="Services"
          title={<>Everything you need to <span style={gradientText(goldGradient)}>move money.</span></>}
          sub="Four core services in one wallet — built for Nigerians, fast and CBN-licensed."
        />

        <div
          className="svc-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="svc-card"
              >
                
                <div
                  style={{
                    position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
                    background: `linear-gradient(90deg, transparent, ${tint(service.accent, 60)}, transparent)`,
                  }}
                />

                
                <div
                  className="svc-icon"
                  style={{
                    background: tint(service.accent, 12),
                    border: `1px solid ${tint(service.accent, 28)}`,
                    boxShadow: `0 8px 24px ${tint(service.accent, 18)}`,
                  }}
                >
                  <Icon size={22} color={service.accent} />
                </div>

                
                <h3
                  className="f-head"
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: colors.text,
                    margin: '0 0 10px',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  {service.title}
                </h3>

                
                <p style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  lineHeight: 1.7,
                  margin: '0 0 16px',
                }}>
                  {service.desc}
                </p>

                
                <ul style={{
                  listStyle: 'none', padding: 0, margin: 0,
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  {service.highlights.map(item => (
                    <li
                      key={item}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        fontSize: 12, color: colors.text, fontWeight: 500,
                      }}
                    >
                      <span
                        style={{
                          width: 5, height: 5, borderRadius: 99,
                          background: service.accent,
                          boxShadow: `0 0 8px ${service.accent}`,
                          flexShrink: 0,
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                
                <Link
                  to={service.href}
                  className="svc-cta"
                  style={{ color: service.accent }}
                >
                  Get Started <ArrowRight size={14} />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
