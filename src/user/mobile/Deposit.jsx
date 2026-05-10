import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Sparkles, Building2, Bitcoin,
  Copy, Check, Info, Clock, QrCode, ShieldCheck,
} from 'lucide-react'

const METHODS = [
  { id: 'bank',   label: 'Virtual account', sub: 'Bank transfer · Instant · Free', icon: Building2 },
  { id: 'crypto', label: 'Crypto deposit',  sub: 'USDT · BTC',                     icon: Bitcoin },
]

const VIRTUAL_ACCOUNT = {
  bank: 'Wema Bank',
  number: '8234567890',
  name: 'VLX/JOHN DOE',
}

const CRYPTO_WALLETS = [
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether',
    network: 'TRC20',
    address: 'TN8eF3xPq9KvJzrM4LbRwH2VkEa7zN9pXc',
    min: '10 USDT',
    warn: 'Only send USDT on TRC20 network. Other coins will be lost.',
  },
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin',
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    min: '0.0005 BTC',
    warn: 'Send only BTC on the Bitcoin network. Other coins will be lost.',
  },
]

export default function MobileDeposit() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('bank')
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
          Top up via your virtual account or crypto wallet · funds arrive in seconds.
        </p>
      </div>

      <section>
        <h3 className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
          Choose method
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {METHODS.map(({ id, label, sub, icon: Icon }) => {
            const active = method === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id)}
                className={[
                  'group relative overflow-hidden flex flex-col gap-2 p-3 rounded-2xl text-left transition active:scale-[0.98]',
                  active
                    ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border-strong)]'
                    : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                ].join(' ')}
              >
                {active && (
                  <span aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-16 h-16 rounded-full bg-brand-accent/[0.18] blur-2xl" />
                )}
                <div className="relative flex items-start justify-between">
                  <span
                    className={[
                      'inline-flex items-center justify-center w-10 h-10 rounded-2xl border transition',
                      active
                        ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.32)]'
                        : 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border-[var(--c-accent-border)]',
                    ].join(' ')}
                  >
                    <Icon size={17} strokeWidth={2} />
                  </span>
                  {active && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-accent text-brand-primary">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  )}
                </div>
                <div className="relative">
                  <p className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                    {label}
                  </p>
                  <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                    {sub}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.section
          key={method}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {method === 'bank' && (
            <BankPanel copied={copied} onCopy={handleCopy} />
          )}
          {method === 'crypto' && (
            <CryptoPanel copied={copied} onCopy={handleCopy} />
          )}
        </motion.section>
      </AnimatePresence>

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

function BankPanel({ copied, onCopy }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-0.5 px-1">
        Send money to your virtual account
      </h3>
      <CopyRow label="Bank" value={VIRTUAL_ACCOUNT.bank} copyKey="bank" copied={copied} onCopy={onCopy} />
      <CopyRow label="Account number" value={VIRTUAL_ACCOUNT.number} mono copyKey="acct" copied={copied} onCopy={onCopy} />
      <CopyRow label="Account name" value={VIRTUAL_ACCOUNT.name} copyKey="name" copied={copied} onCopy={onCopy} />
      <p className="inline-flex items-center gap-1.5 text-[10.5px] text-[var(--c-text-muted)] mt-1 px-1">
        <Clock size={11} className="text-brand-accent" />
        Money credits in under 30 seconds.
      </p>
    </div>
  )
}

function CryptoPanel({ copied, onCopy }) {
  const [coin, setCoin] = useState('usdt')
  const wallet = CRYPTO_WALLETS.find(w => w.id === coin) || CRYPTO_WALLETS[0]

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-0.5 px-1">
        Your dedicated wallet
      </h3>

      <div className="inline-flex p-1 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] self-start">
        {CRYPTO_WALLETS.map(w => {
          const active = w.id === coin
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => setCoin(w.id)}
              className={[
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-[0.2px] transition',
                active
                  ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_3px_10px_rgba(201,162,39,0.28)]'
                  : 'text-[var(--c-text-muted)] hover:text-[var(--c-text)]',
              ].join(' ')}
            >
              {w.symbol}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)]">
        <span className="inline-flex items-center justify-center w-[88px] h-[88px] rounded-xl bg-white border border-[var(--c-border)] shrink-0">
          <QrCode size={56} strokeWidth={1.4} className="text-brand-primary" />
        </span>
        <div className="flex-1 min-w-0 leading-tight">
          <p className="text-[10px] uppercase tracking-[1.1px] text-[var(--c-text-muted)] font-semibold m-0">
            Network · {wallet.network}
          </p>
          <p className="text-[11px] font-mono text-[var(--c-text)] m-0 mt-0.5 break-all">
            {wallet.address}
          </p>
          <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-1.5">
            Min · {wallet.min}
          </p>
        </div>
      </div>
      <CopyRow label={`${wallet.symbol} address`} value={wallet.address} mono copyKey={`addr-${wallet.id}`} copied={copied} onCopy={onCopy} />
      <p className="inline-flex items-start gap-1.5 text-[10.5px] text-[var(--c-warn)] mt-1 px-1 leading-snug">
        <Info size={11} className="mt-px shrink-0" />
        {wallet.warn}
      </p>
    </div>
  )
}

