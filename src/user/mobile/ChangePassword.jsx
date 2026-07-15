import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  KeyRound, Eye, EyeOff,
  AlertCircle, Loader2,
} from 'lucide-react'
import { changePassword } from '../../services/user'
import { useAlert } from '../../components/ui/Alert'
import MobilePageHeader from '../../components/partials/MobilePageHeader'

function StrengthBar({ password }) {
  const score = [/.{8,}/, /[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/]
    .filter(r => r.test(password)).length
  const levels = [
    { label: 'Too short',  color: 'bg-[var(--c-danger)]' },
    { label: 'Weak',       color: 'bg-[var(--c-danger)]' },
    { label: 'Fair',       color: 'bg-[var(--c-warn)]' },
    { label: 'Good',       color: 'bg-[var(--c-accent-border-strong)]' },
    { label: 'Strong',     color: 'bg-[var(--c-success)]' },
  ]
  const level = password.length === 0 ? null : levels[Math.min(score, 4)]
  if (!level) return null
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex gap-1 flex-1">
        {levels.map((l, i) => (
          <div
            key={i}
            className={[
              'h-1 flex-1 rounded-full transition-colors',
              i < score ? level.color : 'bg-[var(--c-border)]',
            ].join(' ')}
          />
        ))}
      </div>
      <span className="text-[10.5px] font-semibold text-[var(--c-text-muted)] shrink-0">
        {level.label}
      </span>
    </div>
  )
}

function PasswordField({ id, label, value, onChange, show, onToggle, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10.5px] font-semibold text-[var(--c-text-muted)] uppercase tracking-[0.9px] px-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder || '••••••••'}
          className="w-full px-3.5 py-3 pr-11 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] text-[13.5px] font-medium text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] outline-none focus:border-[var(--c-accent-border)] transition"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--c-text-faint)] active:scale-95 transition"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

export default function MobileChangePassword() {
  const navigate = useNavigate()
  const { alert } = useAlert()

  const [oldPassword,     setOldPassword]     = useState('')
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showOld,     setShowOld]     = useState(false)
  const [showNew,     setShowNew]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword
  const canSubmit = oldPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword && !loading

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    const result = await changePassword({ oldPassword, newPassword })
    setLoading(false)
    if (result.success) {
      await alert({ type: 'success', title: 'Password updated!', message: 'Your password has been changed successfully.' })
      navigate(-1)
    } else {
      alert({ type: 'error', title: 'Update failed', message: result.message })
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <MobilePageHeader title="Change password" />
      <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 leading-snug">
        Use a strong, unique password you don't use elsewhere.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)]">
          <PasswordField
            id="old-password"
            label="Current password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            show={showOld}
            onToggle={() => setShowOld(v => !v)}
          />

          <div className="h-px bg-[var(--c-border)]" />

          <div>
            <PasswordField
              id="new-password"
              label="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              show={showNew}
              onToggle={() => setShowNew(v => !v)}
              placeholder="Min. 8 characters"
            />
            <StrengthBar password={newPassword} />
          </div>

          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            show={showConfirm}
            onToggle={() => setShowConfirm(v => !v)}
          />
          {mismatch && (
            <p className="text-[11px] text-[var(--c-danger)] -mt-2 flex items-center gap-1">
              <AlertCircle size={11} /> Passwords do not match.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[13.5px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.28)] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
          {loading ? 'Updating…' : 'Update password'}
        </button>

        <p className="text-center text-[10.5px] text-[var(--c-text-faint)] leading-snug px-2">
          All active sessions stay signed in after a password change.
        </p>
      </form>
    </div>
  )
}
