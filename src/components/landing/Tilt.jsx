

import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

export default function Tilt({ children, max = 12 }) {
  const ref = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [max, -max]), { stiffness: 180, damping: 18 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-max, max]), { stiffness: 180, damping: 18 })

  function handleMouseMove(event) {
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((event.clientX - rect.left) / rect.width  - 0.5)
    mouseY.set((event.clientY - rect.top)  / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )
}
