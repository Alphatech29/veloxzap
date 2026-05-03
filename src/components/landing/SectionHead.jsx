

import { motion } from 'framer-motion'
import { colors, tint } from './theme'

export default function SectionHead({ pill, title, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
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
          {pill}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="f-head"
        style={{
          fontWeight: 800,
          fontSize: 'clamp(28px, 4.5vw, 52px)',
          color: colors.text,
          margin: '20px 0 0',
          letterSpacing: '-0.04em',
          lineHeight: 1.05,
        }}
      >
        {title}
      </motion.h2>

      {sub && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.16 }}
          style={{
            fontSize: 16,
            color: colors.textMuted,
            lineHeight: 1.7,
            maxWidth: 560,
            margin: '14px auto 0',
          }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  )
}
