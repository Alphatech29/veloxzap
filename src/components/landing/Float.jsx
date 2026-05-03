

import { motion } from 'framer-motion'

export default function Float({ children, delay = 0, drift = 14, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -drift, 0] }}
      transition={{
        opacity: { duration: 0.7, delay },
        scale:   { duration: 0.7, delay },
        y:       { duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay },
      }}
      style={{ position: 'absolute', zIndex: 5, ...style }}
    >
      {children}
    </motion.div>
  )
}
