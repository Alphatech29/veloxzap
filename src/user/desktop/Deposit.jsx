import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Building2, Bitcoin, Copy, Check, Info, Clock,
  QrCode, ShieldCheck, Receipt, ArrowDownLeft, AlertTriangle, ChevronRight,
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

const RECENT_DEPOSITS = [
  { id: 'd1', method: 'Bank transfer', amount: 250000, when: 'Today · 09:42', status: 'completed' },
  { id: 'd2', method: 'USDT · TRC20',  amount: 87420,  when: 'Yesterday',     status: 'completed' },
  { id: 'd3', method: 'Bank transfer', amount: 50000,  when: 'May 2',         status: 'completed' },
]

const FAQS = [
  { q: 'How fast do deposits arrive?',  a: 'Bank transfers reflect in under 30 seconds. Crypto needs 1–3 network confirmations.' },
  { q: 'Are there any fees?',           a: 'Bank deposits are free. Crypto deposits use the network fee only.' },
  { q: 'What if I send the wrong coin?', a: 'Crypto sent on the wrong network is non-recoverable. Always double-check.' },
]

function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG')
}

export default function DesktopDeposit() {
  const [method, setMethod] = useState('bank')
  const [coin, setCoin] = useState('usdt')
  const [copied, setCopied] = useState(null)

  const wallet = CRYPTO_WALLETS.find(w => w.id === coin) || CRYPTO_WALLETS[0]

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
            Top up via your virtual account or crypto wallet · funds arrive in seconds.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
          <ShieldCheck size={10} /> NDIC insured
        </span>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px] mb-2">
              Choose method
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {METHODS.map(({ id, label, sub, icon: Icon }) => {
                const active = method === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMethod(id)}
                    className={[
                      'group relative overflow-hidden flex items-start gap-3 p-3 rounded-xl text-left transition active:scale-[0.99]',
                      active
                        ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border-strong)]'
                        : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                    ].join(' ')}
                  >
                    {active && (
                      <span aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand-accent/[0.18] blur-2xl" />
                    )}
                    <span
                      className={[
                        'relative inline-flex items-center justify-center w-10 h-10 rounded-xl border transition shrink-0',
                        active
                          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.3)]'
                          : 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border-[var(--c-accent-border)]',
                      ].join(' ')}
                    >
                      <Icon size={16} strokeWidth={2.2} />
                    </span>
                    <div className="relative flex-1 min-w-0">
                      <p className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                        {label}
                      </p>
                      <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5 leading-snug">
                        {sub}
                      </p>
                    </div>
                    {active && (
                      <span className="absolute top-2 right-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-accent text-brand-primary">
                        <Check size={9} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </article>

          <AnimatePresence mode="wait">
            <motion.div
              key={method}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {method === 'bank' && <BankPanel copied={copied} onCopy={handleCopy} />}
              {method === 'crypto' && (
                <CryptoPanel
                  wallet={wallet}
                  coin={coin}
                  setCoin={setCoin}
                  copied={copied}
                  onCopy={handleCopy}
                />
              )}
            </motion.div>
          </AnimatePresence>
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
              {method === 'bank' ? (
                <>
                  <Step n="1" label="Open your bank app" desc="Use any Nigerian bank or transfer app." />
                  <Step n="2" label="Send to your VLX account" desc={`${VIRTUAL_ACCOUNT.bank} · ${VIRTUAL_ACCOUNT.number}`} />
                  <Step n="3" label="Funds reflect instantly" desc="Notification arrives in under 30 seconds." />
                </>
              ) : (
                <>
                  <Step n="1" label={`Pick ${wallet.symbol}`} desc={`Send only ${wallet.symbol} on ${wallet.network}.`} />
                  <Step n="2" label="Copy address or scan QR" desc="From your exchange or wallet app." />
                  <Step n="3" label="Wait for confirmations" desc="1–3 confirmations · usually under 5 minutes." />
                </>
              )}
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

function BankPanel({ copied, onCopy }) {
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

      <div className="grid grid-cols-1 min-[640px]:grid-cols-[auto_1fr] gap-4 items-start">
        <div className="relative inline-flex items-center justify-center w-[120px] h-[120px] rounded-2xl bg-gradient-to-br from-brand-primary to-[#142a5c] text-text shadow-[0_8px_22px_-6px_rgba(2,7,23,0.5)] overflow-hidden">
          <span aria-hidden className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand-accent/[0.18] blur-2xl" />
          <Building2 size={42} strokeWidth={1.6} className="relative text-brand-accent" />
        </div>
        <div className="flex flex-col gap-1.5">
          <CopyRow label="Bank"           value={VIRTUAL_ACCOUNT.bank}   copyKey="bank" copied={copied} onCopy={onCopy} />
          <CopyRow label="Account number" value={VIRTUAL_ACCOUNT.number} mono copyKey="acct" copied={copied} onCopy={onCopy} />
          <CopyRow label="Account name"   value={VIRTUAL_ACCOUNT.name}   copyKey="name" copied={copied} onCopy={onCopy} />
        </div>
      </div>

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

function CryptoPanel({ wallet, coin, setCoin, copied, onCopy }) {
  return (
    <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
          Send to your dedicated wallet
        </h2>
        <div className="inline-flex p-0.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
          {CRYPTO_WALLETS.map(w => {
            const active = w.id === coin
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => setCoin(w.id)}
                className={[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10.5px] font-bold tracking-[0.2px] transition',
                  active
                    ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_2px_8px_rgba(201,162,39,0.28)]'
                    : 'text-[var(--c-text-muted)] hover:text-[var(--c-text)]',
                ].join(' ')}
              >
                {w.symbol}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 min-[640px]:grid-cols-[auto_1fr] gap-4 items-start">
        <div className="relative inline-flex items-center justify-center w-[140px] h-[140px] rounded-2xl bg-white border border-[var(--c-border)] shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
          <QrCode size={92} strokeWidth={1.4} className="text-brand-primary" />
        </div>
        <div className="flex flex-col gap-1.5">
          <CopyRow
            label={`${wallet.symbol} address`}
            value={wallet.address}
            mono
            copyKey={`addr-${wallet.id}`}
            copied={copied}
            onCopy={onCopy}
          />
          <div className="grid grid-cols-2 gap-1.5">
            <div className="px-3 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
              <p className="text-[9.5px] uppercase tracking-[1.1px] text-[var(--c-text-muted)] font-bold m-0">
                Network
              </p>
              <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0 mt-0.5">
                {wallet.network}
              </p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
              <p className="text-[9.5px] uppercase tracking-[1.1px] text-[var(--c-text-muted)] font-bold m-0">
                Min deposit
              </p>
              <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0 mt-0.5 tabular-nums">
                {wallet.min}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-[var(--c-warn-bg)] border border-[var(--c-warn-bg)] p-3 flex items-start gap-2.5">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-warn-bg)] text-[var(--c-warn)] border border-[var(--c-warn)] shrink-0">
          <AlertTriangle size={12} />
        </span>
        <div className="leading-snug">
          <p className="text-[11px] font-bold text-[var(--c-warn)] m-0">
            Network warning
          </p>
          <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
            {wallet.warn}
          </p>
        </div>
      </div>
    </article>
  )
}
