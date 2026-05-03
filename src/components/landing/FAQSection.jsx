

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { colors, tint, goldGradient, gradientText } from './theme'
import { faqs } from './data'
import SectionHead from './SectionHead'

function FAQItem({ question, answer, index }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`faq-row${isOpen ? ' open' : ''}`}
    >
      <button className="faq-q" onClick={() => setIsOpen(prev => !prev)}>
        <span
          style={{
            fontSize: 14, fontWeight: 600,
            color: isOpen ? colors.text : tint(colors.text, 75),
            lineHeight: 1.45,
          }}
        >
          {question}
        </span>
        <span className="faq-chev">
          <ChevronDown size={14} color={isOpen ? colors.gold : tint(colors.text, 30)} />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <p
              style={{
                margin: 0,
                padding: '14px 20px 18px',
                fontSize: 13, color: colors.textMuted, lineHeight: 1.75,
                borderTop: `1px solid ${tint('white', 5)}`,
              }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  return (
    <section
      style={{
        position: 'relative', zIndex: 2,
        padding: 'clamp(64px, 9vw, 100px) 24px 40px',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SectionHead
          pill="FAQ"
          title={<>Got questions? <span style={gradientText(goldGradient)}>We have answers.</span></>}
          sub="Everything you need to know about using VeloxZap."
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
