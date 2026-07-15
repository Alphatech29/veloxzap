import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft, Sparkles, Bitcoin, ChevronRight,
  Copy, Check, Info, Clock, ShieldCheck,
} from 'lucide-react'
import useUser from '../../hooks/useUser'

export default function MobileDeposit() {
  const { dedicatedAccount } = useUser()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(null)

  function handleCopy(key, value) {
    if (navigator.clipboard) navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition self-start -mt-1"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <div>
        <p className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
          <Sparkles size={11} /> Add money
        </p>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
          Deposit
        </h1>
        <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 leading-snug">
          Top up via your virtual account · funds arrive in seconds.
        </p>
      </div>

      <BankPanel account={dedicatedAccount} copied={copied} onCopy={handleCopy} />

      <Link
        to="/user/wallet"
        className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] active:scale-[0.98] transition"
      >
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
          <Bitcoin size={16} strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-0 leading-tight">
          <p className="text-[12.5px] font-bold m-0 text-[var(--c-text)]">Depositing crypto?</p>
          <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">Get your BTC/USDT/USDC address in your crypto wallet</p>
        </div>
        <ChevronRight size={14} className="text-[var(--c-text-faint)] shrink-0" />
      </Link>

      <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] p-3 flex items-start gap-2.5">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-[9px] bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
          <Info size={13} />
        </span>
        <div className="leading-snug">
          <p className="text-[11.5px] font-semibold text-[var(--c-text)] m-0">
            Funds reflect instantly
          </p>
          <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Daily limit · ₦5,000,000 · supports all 24 Nigerian banks.
          </p>
        </div>
      </div>

      <p className="inline-flex items-center justify-center gap-1.5 text-[10.5px] text-[var(--c-text-muted)] mt-1 mb-2">
        <ShieldCheck size={11} className="text-brand-accent" />
        End-to-end encrypted · NDIC insured
      </p>
    </div>
  )
}

function CopyRow({ label, value, mono, copyKey, copied, onCopy }) {
  const isCopied = copied === copyKey
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
      <div className="min-w-0 leading-tight">
        <p className="text-[9.5px] uppercase tracking-[1.1px] text-[var(--c-text-muted)] font-semibold m-0">
          {label}
        </p>
        <p
          className={[
            'text-[var(--c-text)] m-0 mt-0.5 truncate',
            mono ? 'font-mono text-[14px] font-bold tracking-[0.4px] tabular-nums' : 'text-[12.5px] font-semibold',
          ].join(' ')}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onCopy(copyKey, value)}
        aria-label={`Copy ${label}`}
        className={[
          'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-[10.5px] font-bold tracking-[0.2px] active:scale-95 transition shrink-0',
          isCopied
            ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
            : 'bg-[var(--c-surface)] border border-[var(--c-border)] text-brand-accent hover:border-[var(--c-accent-border)]',
        ].join(' ')}
      >
        {isCopied ? <><Check size={11} strokeWidth={2.8} /> Copied</> : <><Copy size={11} /> Copy</>}
      </button>
    </div>
  )
}

function BankPanel({ account, copied, onCopy }) {
  if (!account) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] text-center">
        <p className="text-[13px] font-semibold text-[var(--c-text)] m-0">No virtual account yet</p>
        <p className="text-[11px] text-[var(--c-text-muted)] m-0">Your dedicated account will appear here once created.</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-0.5 px-1">
        Send money to your virtual account
      </h3>
      <CopyRow label="Bank" value={account.bank_name} copyKey="bank" copied={copied} onCopy={onCopy} />
      <CopyRow label="Account number" value={account.account_number} mono copyKey="acct" copied={copied} onCopy={onCopy} />
      <CopyRow label="Account name" value={account.account_name} copyKey="name" copied={copied} onCopy={onCopy} />
      <p className="inline-flex items-center gap-1.5 text-[10.5px] text-[var(--c-text-muted)] mt-1 px-1">
        <Clock size={11} className="text-brand-accent" />
        Money credits in under 30 seconds.
      </p>
    </div>
  )
}
