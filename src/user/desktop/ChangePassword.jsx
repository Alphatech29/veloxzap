import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  KeyRound, Eye, EyeOff, ShieldCheck, Sparkles,
  AlertCircle, Loader2,
} from 'lucide-react'
import { changePassword } from '../../services/user'
import { useAlert } from '../../components/ui/Alert'

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
      <label htmlFor={id} className="text-[11.5px] font-semibold text-[var(--c-text-muted)] uppercase tracking-[0.9px]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder || '••••••••'}
          className="w-full px-3 py-2.5 pr-10 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[13px] font-medium text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] outline-none focus:border-[var(--c-accent-border)] transition"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--c-text-faint)] hover:text-[var(--c-text)] transition"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  )
}

export default function DesktopChangePassword() {
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
      navigate('/user/settings')
    } else {
      alert({ type: 'error', title: 'Update failed', message: result.message })
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-[520px] mx-auto pb-10">

      <header>
        <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[1.4px] text-brand-accent font-semibold m-0">
          <Sparkles size={11} /> Security
        </p>
        <h1 className="text-[26px] font-bold tracking-[-0.5px] text-[var(--c-text)] m-0 mt-1.5">
          Change password
        </h1>
        <p className="text-[13px] text-[var(--c-text-muted)] m-0 mt-1">
          Use a strong, unique password you don't use elsewhere.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <article className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-5 flex flex-col gap-4">

          <PasswordField
            id="old-password"
            label="Current password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            show={showOld}
            onToggle={() => setShowOld(v => !v)}
          />

          <div className="h-px bg-[var(--c-border)]" />

          <div className="flex flex-col gap-1.5">
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
            {loading ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </div>

        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
          <ShieldCheck size={13} className="text-brand-accent shrink-0 mt-0.5" />
          <p className="text-[11px] text-[var(--c-text-muted)] m-0 leading-snug">
            All active sessions will remain signed in. We recommend using at least 8 characters with a mix of letters, numbers, and symbols.
          </p>
        </div>
      </form>
    </div>
  )
}
