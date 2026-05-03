

import { motion } from 'framer-motion'
import { colors, tint } from './theme'

export default function Chip({ icon: Icon, title, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -2 }}
      className="chip"
      style={{
        border: `1px solid ${tint(color, 30)}`,
        boxShadow: `0 18px 48px ${tint(color, 20)}, inset 0 1px 0 ${tint('white', 8)}`,
      }}
    >
      <div
        className="chip-icon"
        style={{
          background: tint(color, 18),
          border: `1px solid ${tint(color, 32)}`,
          boxShadow: `0 0 16px ${tint(color, 28)}`,
        }}
      >
        <Icon size={16} color={color} />
      </div>
      <div>
        <p
          className="f-mono"
          style={{ fontSize: 9, color: colors.textMuted, margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}
        >
          {title}
        </p>
        <p
          className="f-head"
          style={{ fontSize: 13, color: colors.text, margin: 0, fontWeight: 800 }}
        >
          {value}
        </p>
      </div>
    </motion.div>
  )
}
