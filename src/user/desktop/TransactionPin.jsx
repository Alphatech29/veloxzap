import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, Sparkles, ShieldCheck, Loader2 } from 'lucide-react'
import useUser from '../../hooks/useUser'
import useTransactions from '../../hooks/useTransactions'
import { createPin, changePin } from '../../lib/user'
import { useAlert } from '../../components/ui/Alert'

function PinInput({ value, onChange, masked, label, autoFocus }) {
  const inputsRef = useRef([])
  const digits = Array.from({ length: 4 }, (_, i) => value[i] || '')

  function handleInput(index, e) {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const next = digits.map((d, i) => (i === index ? char : d)).join('')
    onChange(next)
    if (char && index < 3) inputsRef.current[index + 1]?.focus()
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
    e.preventDefault()
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-[11.5px] font-semibold text-[var(--c-text-muted)] uppercase tracking-[0.9px]">
          {label}
        </label>
      )}
      <div className="flex gap-3">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputsRef.current[i] = el }}
            type={masked ? 'password' : 'tel'}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            autoFocus={autoFocus && i === 0}
            onChange={e => handleInput(i, e)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className="w-14 h-14 text-center text-[20px] font-bold rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)] outline-none focus:border-[var(--c-accent-border)] focus:bg-[var(--c-surface)] transition caret-transparent"
          />
        ))}
      </div>
    </div>
  )
}

export default function DesktopTransactionPin() {
  const navigate = useNavigate()
  const { alert } = useAlert()
  const { user, refresh } = useUser()
  const { refresh: refreshTransactions } = useTransactions({ autoFetch: false })
  const hasPinSet = user?.is_pin_created === 1

  const [currentPin,  setCurrentPin]  = useState('')
  const [newPin,      setNewPin]      = useState('')
  const [confirmPin,  setConfirmPin]  = useState('')
  const [masked,      setMasked]      = useState(true)
  const [loading,     setLoading]     = useState(false)

  const mismatch = confirmPin.length === 4 && newPin !== confirmPin
  const canSubmit = (
    (!hasPinSet || currentPin.length === 4) &&
    newPin.length === 4 &&
    confirmPin.length === 4 &&
    newPin === confirmPin &&
    !loading
  )

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    const result = hasPinSet
      ? await changePin({ oldPin: currentPin, newPin })
      : await createPin({ pin: newPin })
    setLoading(false)
    if (result.success) {
      await refresh()
      refreshTransactions()
      await alert({
        type: 'success',
        title: hasPinSet ? 'PIN updated!' : 'PIN created!',
        message: hasPinSet
          ? 'Your transaction PIN has been changed.'
          : 'Your transaction PIN is now active.',
      })
      navigate('/user/settings')
    } else {
      alert({ type: 'error', title: 'Failed', message: result.message })
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-[480px] mx-auto pb-10">

      <header>
        <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[1.4px] text-brand-accent font-semibold m-0">
          <Sparkles size={11} /> Security
        </p>
        <h1 className="text-[26px] font-bold tracking-[-0.5px] text-[var(--c-text)] m-0 mt-1.5">
          {hasPinSet ? 'Change transaction PIN' : 'Set transaction PIN'}
        </h1>
        <p className="text-[13px] text-[var(--c-text-muted)] m-0 mt-1">
          {hasPinSet
            ? 'Enter your current PIN, then choose a new one.'
            : 'Create a 4-digit PIN to authorise transactions.'}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <article className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-5 flex flex-col gap-5">

          {hasPinSet && (
            <>
              <PinInput
                label="Current PIN"
                value={currentPin}
                onChange={setCurrentPin}
                masked={masked}
                autoFocus
              />
              <div className="h-px bg-[var(--c-border)]" />
            </>
          )}

          <PinInput
            label="New PIN"
            value={newPin}
            onChange={setNewPin}
            masked={masked}
            autoFocus={!hasPinSet}
          />

          <PinInput
            label="Confirm new PIN"
            value={confirmPin}
            onChange={setConfirmPin}
            masked={masked}
          />

          {mismatch && (
            <p className="text-[11px] text-[var(--c-danger)] -mt-2">
              PINs do not match.
            </p>
          )}

          <button
            type="button"
            onClick={() => setMasked(v => !v)}
            className="inline-flex items-center gap-1.5 self-start text-[11.5px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent transition"
          >
            {masked ? <Eye size={13} /> : <EyeOff size={13} />}
            {masked ? 'Show PIN' : 'Hide PIN'}
          </button>
        </article>

        <div className="flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text)] text-[13px] font-semibold hover:border-[var(--c-accent-border)] transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[13px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.28)] hover:-translate-y-px transition disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
            {loading ? 'Saving…' : hasPinSet ? 'Update PIN' : 'Set PIN'}
          </button>
        </div>

        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
          <ShieldCheck size={13} className="text-brand-accent shrink-0 mt-0.5" />
          <p className="text-[11px] text-[var(--c-text-muted)] m-0 leading-snug">
            Your PIN is required every time you send money or make a payment. Keep it private and avoid obvious sequences like 1234 or 0000.
          </p>
        </div>
      </form>
    </div>
  )
}
