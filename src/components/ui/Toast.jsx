import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

const TYPE_META = {
  success: { Icon: CheckCircle2, bg: 'var(--c-success-bg)',  fg: 'var(--c-success)' },
  error:   { Icon: XCircle,      bg: 'var(--c-danger-soft)', fg: 'var(--c-danger)'  },
  warning: { Icon: AlertTriangle, bg: 'var(--c-warn-bg)',    fg: 'var(--c-warn)'    },
  info:    { Icon: Info,          bg: 'var(--c-accent-soft)', fg: 'var(--c-accent)' },
}

let nextId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const toast = useCallback((config) => {
    const id = ++nextId
    const duration = config.duration ?? 4000
    setToasts((list) => [...list, { id, type: 'info', ...config }])
    timers.current[id] = setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-[90] flex flex-col gap-2.5 w-[320px] max-w-[calc(100vw-32px)] pointer-events-none"
        style={{ top: 'calc(80px + env(safe-area-inset-top))' }}
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const toast = useContext(ToastContext)
  if (!toast) throw new Error('useToast must be used inside <ToastProvider>')
  return { toast }
}

function ToastItem({ toast, onClose }) {
  const { type = 'info', title, message } = toast
  const meta = TYPE_META[type] || TYPE_META.info
  const { Icon } = meta

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
      className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--c-menu-bg)] border border-[var(--c-border)] shadow-[0_20px_50px_-16px_rgba(2,7,23,0.5)] pointer-events-auto"
    >
      <span
        className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
        style={{ background: meta.bg, color: meta.fg }}
      >
        <Icon size={17} />
      </span>
      <div className="flex-1 min-w-0">
        {title && <p className="text-[13px] font-bold text-[var(--c-text)] m-0 leading-snug">{title}</p>}
        {message && <p className="text-[11.5px] text-[var(--c-text-muted)] m-0 mt-0.5 leading-relaxed">{message}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[var(--c-text-muted)] hover:text-[var(--c-text)] shrink-0 active:scale-90 transition"
      >
        <X size={12} />
      </button>
    </motion.div>
  )
}
