

import { useState, useRef, useEffect } from 'react'
import { useInView } from 'framer-motion'

export default function CountUp({ end, duration = 1800, prefix = '', suffix = '', decimals = 0 }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const isVisible = useInView(ref, { once: true })
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!isVisible || hasStarted.current) return
    hasStarted.current = true

    const startTime = Date.now()
    function tick() {
      const progress = Math.min((Date.now() - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = decimals
        ? parseFloat((eased * end).toFixed(decimals))
        : Math.floor(eased * end)
      setValue(current)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isVisible, end, duration, decimals])

  const displayed = decimals ? value.toFixed(decimals) : value.toLocaleString()
  return <span ref={ref}>{prefix}{displayed}{suffix}</span>
}
