

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { colors, tint } from './theme'

export default function Background() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  
  const orbOffset = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(800px 600px at 18% 0%,  ${tint(colors.gold, 14)},      transparent 60%),
            radial-gradient(900px 700px at 82% 25%, ${tint(colors.champagne, 12)}, transparent 55%),
            radial-gradient(1200px 900px at 50% 100%, ${tint(colors.navyMid, 80)}, transparent 65%)
          `,
        }}
      />

      
      <motion.div
        animate={{ x: [0, 28, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          y: orbOffset,
          position: 'absolute', top: '12%', left: '6%',
          width: 320, height: 320, borderRadius: '50%',
          background: `radial-gradient(circle, ${tint(colors.gold, 24)}, transparent 65%)`,
          filter: 'blur(60px)',
        }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          y: orbOffset,
          position: 'absolute', bottom: '14%', right: '4%',
          width: 380, height: 380, borderRadius: '50%',
          background: `radial-gradient(circle, ${tint(colors.champagne, 18)}, transparent 70%)`,
          filter: 'blur(70px)',
        }}
      />

      
      {Array.from({ length: 14 }).map((_, i) => {
        const sparkColor = i % 2 ? colors.gold : colors.champagne
        return (
          <motion.span
            key={i}
            animate={{ y: [0, -22, 0], opacity: [0, 0.85, 0] }}
            transition={{
              duration: 5 + (i % 5),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i % 7) * 0.4,
            }}
            style={{
              position: 'absolute',
              top:  `${(i * 53) % 100}%`,
              left: `${(i * 37) % 100}%`,
              width: 3, height: 3, borderRadius: 99,
              background: sparkColor,
              boxShadow: `0 0 8px ${sparkColor}`,
            }}
          />
        )
      })}

      
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, transparent 70%, ${colors.navy})`,
        }}
      />
    </div>
  )
}
