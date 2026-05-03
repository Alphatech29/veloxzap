
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function Faq({ items, defaultOpen = 0, className = '' }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`ad-faq ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className={`ad-faq-row ${isOpen ? 'is-open' : ''}`}>
            <button
              className="ad-faq-q"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <span className="ad-faq-chev">
                <ChevronDown size={16} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                  className="ad-faq-a-wrap"
                >
                  <p className="ad-faq-a">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
