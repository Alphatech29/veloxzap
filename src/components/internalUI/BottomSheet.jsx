import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function BottomSheet({
  open,
  onClose,
  label,
  title,
  children,
  closeOnScrimClick = true,
  maxHeight,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bs-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[40] bg-[var(--c-scrim)] backdrop-blur-[2px]"
            onClick={() => closeOnScrimClick && onClose()}
          />
          <motion.div
            key="bs-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[50] rounded-t-[28px] bg-[var(--c-surface)] border-t border-[var(--c-border)] shadow-[0_-24px_60px_-12px_rgba(0,0,0,0.35)] flex flex-col"
            style={{
              paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
              ...(maxHeight ? { maxHeight } : {}),
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <span className="w-9 h-1 rounded-full bg-[var(--c-border)]" />
            </div>

            {/* Standard header (rendered when title is provided) */}
            {title && (
              <div className="flex items-center justify-between px-5 pt-2 pb-4 shrink-0">
                <div>
                  {label && (
                    <p className="text-[10px] uppercase tracking-[1.3px] font-bold text-brand-accent m-0">
                      {label}
                    </p>
                  )}
                  <h2 className="text-[18px] font-bold tracking-[-0.3px] text-[var(--c-text)] m-0 mt-0.5">
                    {title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function SheetRow({ label, value, bold, muted, accent }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[12px] text-[var(--c-text-muted)] font-medium">{label}</span>
      <span className={[
        'text-[13px] font-bold tabular-nums',
        bold   ? 'text-[var(--c-text)] !text-[14px]' : '',
        muted  ? 'text-[var(--c-text-muted)] font-medium' : '',
        accent ? 'text-[var(--c-success)]' : '',
        !bold && !muted && !accent ? 'text-[var(--c-text)]' : '',
      ].join(' ')}>{value}</span>
    </div>
  )
}
