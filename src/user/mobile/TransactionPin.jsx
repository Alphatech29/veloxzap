import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import useUser from '../../hooks/useUser'
import { createPin, changePin } from '../../services/user'
import { useAlert } from '../../components/ui/Alert'
import MobilePageHeader from '../../components/partials/MobilePageHeader'

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
        <label className="text-[10.5px] font-semibold text-[var(--c-text-muted)] uppercase tracking-[0.9px] px-1">
          {label}
        </label>
      )}
      <div className="flex gap-3 justify-center">
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
            className="w-[60px] h-[60px] text-center text-[22px] font-bold rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text)] outline-none focus:border-[var(--c-accent-border)] transition caret-transparent"
          />
        ))}
      </div>
    </div>
  )
}

export default function MobileTransactionPin() {
  const navigate = useNavigate()
  const { alert } = useAlert()
  const { user, refresh } = useUser()
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
      await alert({
        type: 'success',
        title: hasPinSet ? 'PIN updated!' : 'PIN created!',
        message: hasPinSet
          ? 'Your transaction PIN has been changed.'
          : 'Your transaction PIN is now active.',
      })
      navigate(-1)
    } else {
      alert({ type: 'error', title: 'Failed', message: result.message })
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <MobilePageHeader title={hasPinSet ? 'Change transaction PIN' : 'Set transaction PIN'} />
      <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 leading-snug">
        {hasPinSet
          ? 'Enter your current PIN, then choose a new one.'
          : 'Create a 4-digit PIN to authorise transactions.'}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-5 p-4 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)]">

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
            <p className="text-[11px] text-[var(--c-danger)] -mt-2 text-center">
              PINs do not match.
            </p>
          )}

          <button
            type="button"
            onClick={() => setMasked(v => !v)}
            className="inline-flex items-center gap-1.5 self-center text-[11.5px] font-semibold text-[var(--c-text-muted)] active:scale-95 transition"
          >
            {masked ? <Eye size={13} /> : <EyeOff size={13} />}
            {masked ? 'Show PIN' : 'Hide PIN'}
          </button>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[13.5px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.28)] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
          {loading ? 'Saving…' : hasPinSet ? 'Update PIN' : 'Set PIN'}
        </button>

        <p className="text-center text-[10.5px] text-[var(--c-text-faint)] leading-snug px-2">
          Required for every transaction. Never share your PIN with anyone.
        </p>
      </form>
    </div>
  )
}
