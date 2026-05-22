import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, HelpCircle, Info, X, XCircle } from 'lucide-react'


const AlertContext = createContext(null)

const TYPE_META = {
  success: { Icon: CheckCircle2, bg: 'var(--c-success-bg)',  fg: 'var(--c-success)' },
  error:   { Icon: XCircle,      bg: 'var(--c-danger-soft)', fg: 'var(--c-danger)'  },
  warning: { Icon: AlertTriangle, bg: 'var(--c-warn-bg)',    fg: 'var(--c-warn)'    },
  info:    { Icon: Info,          bg: 'var(--c-accent-soft)', fg: 'var(--c-accent)' },
  confirm: { Icon: HelpCircle,   bg: 'var(--c-accent-soft)', fg: 'var(--c-accent)'  },
}

export function AlertProvider({ children }) {
  const [state, setState] = useState(null)
  const resolveRef = useRef(null)

  const show = useCallback((config) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve
      setState(config)
    })
  }, [])

  const close = useCallback((result = false) => {
    resolveRef.current?.(result)
    resolveRef.current = null
    setState(null)
  }, [])

  useEffect(() => {
    if (!state) return
    function onKey(e) {
      if (e.key === 'Escape') close(false)
      if (e.key === 'Enter' && !state.isConfirm) close(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, close])

  return (
    <AlertContext.Provider value={show}>
      {children}
      <AnimatePresence>
        {state && <AlertDialog config={state} onClose={close} />}
      </AnimatePresence>
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const show = useContext(AlertContext)
  if (!show) throw new Error('useAlert must be used inside <AlertProvider>')

  const alert = useCallback(
    (config) => show({ confirmLabel: 'OK', ...config, isConfirm: false }),
    [show],
  )
  const confirm = useCallback(
    (config) => show({ type: 'confirm', confirmLabel: 'Confirm', cancelLabel: 'Cancel', ...config, isConfirm: true }),
    [show],
  )

  return { alert, confirm }
}

function AlertDialog({ config, onClose }) {
  const {
    type = 'info',
    title,
    message,
    confirmLabel = 'OK',
    cancelLabel = 'Cancel',
    isConfirm = false,
    danger = false,
  } = config

  const meta = TYPE_META[type] || TYPE_META.info
  const { Icon } = meta

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-5">
      {/* Scrim */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="absolute inset-0 bg-[var(--c-scrim)] backdrop-blur-[3px]"
        onClick={() => onClose(false)}
      />

      {/* Dialog panel */}
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="vzap-alert-title"
        initial={{ opacity: 0, y: 22, scale: 0.95 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={{    opacity: 0, y: 12, scale: 0.96  }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-[360px] rounded-2xl bg-[var(--c-menu-bg)] border border-[var(--c-border)] shadow-[0_30px_60px_-20px_rgba(2,7,23,0.55)] p-6 flex flex-col gap-5"
      >
        {/* Close × */}
        <button
          type="button"
          onClick={() => onClose(false)}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-border)] active:scale-90 transition"
        >
          <X size={13} />
        </button>

        {/* Icon + text */}
        <div className="flex flex-col items-center text-center gap-3 pt-1">
          <span
            className="inline-flex items-center justify-center w-[58px] h-[58px] rounded-2xl"
            style={{ background: meta.bg, color: meta.fg }}
          >
            <Icon size={27} />
          </span>
          <div className="flex flex-col gap-1.5">
            <p id="vzap-alert-title" className="text-[15.5px] font-bold text-[var(--c-text)] m-0 leading-snug">
              {title}
            </p>
            {message && (
              <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 leading-relaxed">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className={`grid gap-2.5 ${isConfirm ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {isConfirm && (
            <button
              type="button"
              onClick={() => onClose(false)}
              className="py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text)] text-[13px] font-semibold hover:border-[var(--c-border-strong)] active:scale-[0.98] transition"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={() => onClose(true)}
            className={[
              'py-2.5 rounded-xl text-[13px] font-bold active:scale-[0.98] transition',
              danger
                ? 'bg-[var(--c-danger-soft)] border border-[var(--c-danger-border)] text-[var(--c-danger)] hover:bg-[var(--c-danger)] hover:text-[var(--c-bg)] hover:border-[var(--c-danger)]'
                : 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.28)] hover:-translate-y-px',
            ].join(' ')}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
