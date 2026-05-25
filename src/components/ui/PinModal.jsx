import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Loader2, X } from 'lucide-react'
import useIsMobile from '../../hooks/useIsMobile'

function PinBoxes({ value, onChange, masked, onComplete }) {
  const inputsRef = useRef([])
  const digits = Array.from({ length: 4 }, (_, i) => value[i] || '')

  function handleInput(index, e) {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const next = digits.map((d, i) => (i === index ? char : d)).join('')
    onChange(next)
    if (char && index < 3) {
      inputsRef.current[index + 1]?.focus()
    } else if (char && index === 3) {
      onComplete?.(next)
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        onChange(digits.map((d, i) => (i === index ? '' : d)).join(''))
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus()
        onChange(digits.map((d, i) => (i === index - 1 ? '' : d)).join(''))
      }
      e.preventDefault()
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    onChange(text)
    inputsRef.current[Math.min(text.length, 3)]?.focus()
    if (text.length === 4) onComplete?.(text)
    e.preventDefault()
  }

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={el => { inputsRef.current[i] = el }}
          type={masked ? 'password' : 'tel'}
          inputMode="numeric"
          maxLength={1}
          value={digit}
          autoFocus={i === 0}
          onChange={e => handleInput(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="w-[58px] h-[62px] text-center text-[22px] font-bold rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)] outline-none focus:border-[var(--c-accent-border)] focus:bg-[var(--c-surface)] transition caret-transparent"
        />
      ))}
    </div>
  )
}

export default function PinModal({ open, title, subtitle, loading, error, onConfirm, onCancel }) {
  const isMobile = useIsMobile()
  const [pin, setPin] = useState('')
  const [masked, setMasked] = useState(true)

  useEffect(() => {
    if (open) { setPin(''); setMasked(true) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape' && !loading) onCancel?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, loading, onCancel])

  function submit(p) {
    if ((p ?? pin).length === 4 && !loading) onConfirm?.(p ?? pin)
  }

  /* ── shared inner content ── */
  const content = (
    <>
      <div className="flex flex-col items-center gap-2.5 pt-1">
        <span className="inline-flex items-center justify-center w-[52px] h-[52px] rounded-2xl bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent">
          <Lock size={22} />
        </span>
        <div className="text-center">
          <p className="text-[15px] font-bold text-[var(--c-text)] m-0">
            {title || 'Enter PIN'}
          </p>
          {subtitle && (
            <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <PinBoxes value={pin} onChange={setPin} masked={masked} onComplete={submit} />

      <AnimatePresence>
        {error && (
          <motion.p
            key="pin-err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="text-[11.5px] font-semibold text-center text-[var(--c-danger)] bg-[var(--c-danger-soft)] border border-[var(--c-danger-border)] rounded-xl px-3 py-2 leading-snug"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => setMasked(v => !v)}
          className="inline-flex items-center gap-1.5 self-center text-[11.5px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent transition"
        >
          {masked ? <Eye size={13} /> : <EyeOff size={13} />}
          {masked ? 'Show PIN' : 'Hide PIN'}
        </button>

        <button
          type="button"
          onClick={() => submit()}
          disabled={pin.length < 4 || loading}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[13px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.28)] hover:-translate-y-px active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> Processing…</>
            : <><Lock size={14} /> Confirm</>}
        </button>
      </div>
    </>
  )

  return (
    <AnimatePresence>
      {open && (
        isMobile ? (
          /* ── Mobile: bottom sheet ── */
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-[4px]"
              onClick={!loading ? onCancel : undefined}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.85 }}
              className="fixed bottom-0 left-0 right-0 z-[80] rounded-t-[24px] overflow-hidden"
              style={{
                background: 'var(--c-menu-bg)',
                paddingBottom: 'env(safe-area-inset-bottom,0px)',
                boxShadow: '0 -16px 48px rgba(0,0,0,0.35)',
              }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-[3px] rounded-full bg-[var(--c-border)]" />
              </div>
              {/* Close */}
              {!loading && (
                <button
                  type="button"
                  onClick={onCancel}
                  aria-label="Cancel"
                  className="absolute top-3.5 right-4 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] active:scale-90 transition"
                >
                  <X size={13} />
                </button>
              )}
              <div className="flex flex-col gap-5 px-6 pt-3 pb-6">
                {content}
              </div>
            </motion.div>
          </>
        ) : (
          /* ── Desktop: centered dialog ── */
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-5">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-[var(--c-scrim)] backdrop-blur-[3px]"
              onClick={!loading ? onCancel : undefined}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 22, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative w-full max-w-[340px] rounded-2xl bg-[var(--c-menu-bg)] border border-[var(--c-border)] shadow-[0_30px_60px_-20px_rgba(2,7,23,0.55)] p-6 flex flex-col gap-5"
            >
              {!loading && (
                <button
                  type="button"
                  onClick={onCancel}
                  aria-label="Cancel"
                  className="absolute top-3.5 right-3.5 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] active:scale-90 transition"
                >
                  <X size={13} />
                </button>
              )}
              {content}
            </motion.div>
          </div>
        )
      )}
    </AnimatePresence>
  )
}
