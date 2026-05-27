import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDownUp } from 'lucide-react'

export default function ProcessingOverlay({ open, title = 'Processing…', subtitle }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="processing-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[var(--c-bg)]/90 backdrop-blur-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', boxShadow: '0 8px 28px rgba(201,162,39,0.45)' }}
          >
            <ArrowDownUp size={22} strokeWidth={2.6} className="text-brand-primary" />
          </motion.div>
          <div className="text-center px-6">
            <p className="text-[15px] font-bold text-[var(--c-text)] m-0">{title}</p>
            {subtitle && (
              <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1">{subtitle}</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
