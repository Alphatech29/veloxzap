import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, Building2, Bitcoin, Copy, Check, Info, Clock,
  ShieldCheck, Receipt, ArrowDownLeft, ChevronRight,
} from 'lucide-react'
import useUser from '../../hooks/useUser'

const RECENT_DEPOSITS = [
  { id: 'd1', method: 'Bank transfer', amount: 250000, when: 'Today · 09:42', status: 'completed' },
  { id: 'd2', method: 'USDT · TRC20',  amount: 87420,  when: 'Yesterday',     status: 'completed' },
  { id: 'd3', method: 'Bank transfer', amount: 50000,  when: 'May 2',         status: 'completed' },
]

const FAQS = [
  { q: 'How fast do deposits arrive?', a: 'Bank transfers reflect in under 30 seconds.' },
  { q: 'Are there any fees?',          a: 'Bank deposits are free.' },
]

function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG')
}

export default function DesktopDeposit() {
  const { dedicatedAccount } = useUser()
  const [copied, setCopied] = useState(null)

  function handleCopy(key, value) {
    if (navigator.clipboard) navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
            <Sparkles size={10} /> Add money
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Deposit
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Top up via your virtual account · funds arrive in seconds.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
          <ShieldCheck size={10} /> NDIC insured
        </span>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <BankPanel account={dedicatedAccount} copied={copied} onCopy={handleCopy} />
          </motion.div>

          <Link
            to="/user/wallet"
            className="group relative overflow-hidden flex items-center gap-3 p-4 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] transition"
          >
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0"
            >
              <Bitcoin size={16} strokeWidth={2} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                Depositing crypto?
              </p>
              <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Get your BTC / USDT / USDC deposit address in your crypto wallet
              </p>
            </div>
            <ChevronRight size={14} className="text-[var(--c-text-faint)] group-hover:text-brand-accent group-hover:translate-x-0.5 transition shrink-0" />
          </Link>
        </div>

        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-accent-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)]">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)]">
                <Receipt size={12} className="text-brand-accent" /> Quick guide
              </h3>
              <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-[0.8px] text-brand-accent">
                <Clock size={9} /> Live
              </span>
            </header>
            <div className="p-4 flex flex-col gap-2">
              <Step n="1" label="Open your bank app" desc="Use any Nigerian bank or transfer app." />
              <Step n="2" label="Send to your VLX account" desc={dedicatedAccount ? `${dedicatedAccount.bank_name} · ${dedicatedAccount.account_number}` : 'Your virtual account details'} />
              <Step n="3" label="Funds reflect instantly" desc="Notification arrives in under 30 seconds." />
            </div>
          </article>

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-[var(--c-border)]">
              <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)]">
                <ArrowDownLeft size={11} className="text-brand-accent" /> Recent deposits
              </h3>
              <span className="text-[9.5px] text-[var(--c-text-muted)]">
                Last 30 days
              </span>
            </header>
            <ul className="list-none m-0 p-0">
              {RECENT_DEPOSITS.map((d, i) => (
                <li key={d.id} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                  <div className="flex items-center gap-2.5 px-4 py-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--c-success-bg)] text-[var(--c-success)] shrink-0">
                      <ArrowDownLeft size={13} strokeWidth={2.4} />
                    </span>
                    <div className="flex-1 min-w-0 leading-tight">
                      <p className="text-[11.5px] font-semibold text-[var(--c-text)] m-0 truncate">
                        {d.method}
                      </p>
                      <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                        {d.when}
                      </p>
                    </div>
                    <span className="text-[11.5px] font-bold tabular-nums text-[var(--c-success)] whitespace-nowrap">
                      +{formatNGN(d.amount)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-[var(--c-border)]">
              <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)]">
                <Info size={11} className="text-brand-accent" /> FAQ
              </h3>
            </header>
            <ul className="list-none m-0 p-0">
              {FAQS.map((f, i) => (
                <li key={f.q} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                  <details className="group">
                    <summary className="flex items-start justify-between gap-2 px-4 py-2.5 cursor-pointer hover:bg-[var(--c-surface-soft)] transition list-none">
                      <p className="text-[11px] font-semibold text-[var(--c-text)] m-0 leading-snug">
                        {f.q}
                      </p>
                      <ChevronRight size={11} className="text-[var(--c-text-faint)] shrink-0 group-open:rotate-90 transition" />
                    </summary>
                    <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 px-4 pb-2.5 leading-snug">
                      {f.a}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  )
}

function Step({ n, label, desc }) {
  return (
    <div className="flex items-start gap-2.5 px-3 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[10px] font-black tabular-nums border border-[rgba(232,197,71,0.55)] shrink-0">
        {n}
      </span>
      <div className="flex-1 min-w-0 leading-tight">
        <p className="text-[11.5px] font-bold text-[var(--c-text)] m-0">
          {label}
        </p>
        <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5 truncate">
          {desc}
        </p>
      </div>
    </div>
  )
}

function CopyRow({ label, value, mono, copyKey, copied, onCopy }) {
  const isCopied = copied === copyKey
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
      <div className="min-w-0 leading-tight flex-1">
        <p className="text-[9.5px] uppercase tracking-[1.1px] text-[var(--c-text-muted)] font-bold m-0">
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
          'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold tracking-[0.2px] active:scale-95 transition shrink-0',
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
  return (
    <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
          Send to your virtual account
        </h2>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--c-success-bg)] text-[var(--c-success)] text-[9.5px] font-bold uppercase tracking-[0.9px]">
          <Clock size={9} strokeWidth={2.6} /> Under 30s
        </span>
      </div>

      {!account ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-[13px] font-semibold text-[var(--c-text)] m-0">No virtual account yet</p>
          <p className="text-[11px] text-[var(--c-text-muted)] m-0">Your dedicated account will appear here once created.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 min-[640px]:grid-cols-[auto_1fr] gap-4 items-start">
        <div className="relative inline-flex items-center justify-center w-[120px] h-[120px] rounded-2xl bg-gradient-to-br from-brand-primary to-[#142a5c] text-text shadow-[0_8px_22px_-6px_rgba(2,7,23,0.5)] overflow-hidden">
          <span aria-hidden className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand-accent/[0.18] blur-2xl" />
          <Building2 size={42} strokeWidth={1.6} className="relative text-brand-accent" />
        </div>
        <div className="flex flex-col gap-1.5">
          <CopyRow label="Bank"           value={account.bank_name}       copyKey="bank" copied={copied} onCopy={onCopy} />
          <CopyRow label="Account number" value={account.account_number}  mono copyKey="acct" copied={copied} onCopy={onCopy} />
          <CopyRow label="Account name"   value={account.account_name}    copyKey="name" copied={copied} onCopy={onCopy} />
        </div>
      </div>
      )}

      <div className="mt-4 rounded-xl bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] p-3 flex items-start gap-2.5">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/80 text-brand-accent border border-[var(--c-accent-border)] shrink-0">
          <Info size={12} />
        </span>
        <div className="leading-snug">
          <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">
            Daily limit · ₦5,000,000
          </p>
          <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Supports all 24 Nigerian banks · funds reflect in your wallet instantly.
          </p>
        </div>
      </div>
    </article>
  )
}
