import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowDownUp, Sparkles, Info, ShieldCheck,
  Check, TrendingUp, ArrowLeftRight, Receipt, Clock, Zap, Loader2,
} from 'lucide-react'

const USD_RATE  = 1620
const FEE_RATE  = 0.005

const BALANCES = {
  USD: 0,
  NGN: 1284750.45,
}

const QUICK_PCTS = [
  { id: '25',  label: '25%', value: 0.25 },
  { id: '50',  label: '50%', value: 0.5  },
  { id: '75',  label: '75%', value: 0.75 },
  { id: 'max', label: 'Max', value: 1    },
]

const RECENT = [
  { id: 'c1', from: 'NGN', to: 'USD', amount: 250000,  received: 154.32, when: 'Today · 09:42' },
  { id: 'c2', from: 'USD', to: 'NGN', amount: 50,      received: 81000,  when: 'Yesterday'      },
  { id: 'c3', from: 'NGN', to: 'USD', amount: 100000,  received: 61.73,  when: 'May 5'          },
]

function fmt(num, code) {
  if (!isFinite(num)) return code === 'NGN' ? '₦0.00' : '$0.00'
  const f = num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return code === 'NGN' ? `₦${f}` : `$${f}`
}

export default function DesktopConvert() {
  const [direction, setDirection] = useState('usd-ngn')
  const [amount, setAmount]       = useState('')
  const [status, setStatus]       = useState('idle')

  const fromCode  = direction === 'usd-ngn' ? 'USD' : 'NGN'
  const toCode    = direction === 'usd-ngn' ? 'NGN' : 'USD'
  const balance   = BALANCES[fromCode] ?? 0

  const num        = parseFloat(String(amount).replace(/[^\d.]/g, '')) || 0
  const fee        = num * FEE_RATE
  const netAmount  = num - fee
  const converted  = direction === 'usd-ngn' ? netAmount * USD_RATE : netAmount / USD_RATE

  const insufficient = num > balance
  const canSubmit    = num > 0 && !insufficient && status === 'idle'

  const rateDisplay = direction === 'usd-ngn'
    ? `1 USD = ₦${USD_RATE.toLocaleString()}`
    : `1 NGN = $${(1 / USD_RATE).toFixed(6)}`

  function handleAmountChange(e) {
    const raw     = e.target.value.replace(/[^\d.]/g, '')
    const parts   = raw.split('.')
    const cleaned = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : raw
    setAmount(cleaned)
  }

  function handleSwap() {
    setDirection(d => d === 'usd-ngn' ? 'ngn-usd' : 'usd-ngn')
    setAmount('')
  }

  function handleQuick(pct) {
    setAmount(String(Math.floor(balance * pct * 100) / 100))
  }

  function handleSubmit() {
    if (!canSubmit) return
    setStatus('processing')
    setTimeout(() => {
      setStatus('done')
      setTimeout(() => { setStatus('idle'); setAmount('') }, 1800)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
            <Sparkles size={10} /> Swap currencies
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">Convert</h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Exchange between USD and NGN at live rates · {Math.round(FEE_RATE * 1000) / 10}% transparent fee.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
          <ShieldCheck size={10} /> Live rates · refreshed every 30s
        </span>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">

          {/* Swap card */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4 relative overflow-visible">

            {/* From */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">You send</h2>
              <span className="text-[10px] text-[var(--c-text-muted)] font-medium">
                Balance · <span className="font-bold text-[var(--c-text)] tabular-nums">{fmt(balance, fromCode)}</span>
              </span>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2.5 items-stretch">
              <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition overflow-hidden">
                <div className="px-3 py-2.5">
                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">Amount</p>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[22px] font-black tabular-nums tracking-[-0.4px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] mt-0.5"
                    style={{ boxShadow: 'none' }}
                  />
                </div>
              </div>
              <CurrencyLabel code={fromCode} />
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {QUICK_PCTS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleQuick(p.value)}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-bold tracking-[0.2px] bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:border-[var(--c-accent-border)] hover:text-brand-accent active:scale-95 transition"
                >
                  {p.label}
                </button>
              ))}
              {insufficient && (
                <span className="inline-flex items-center gap-1 ml-auto text-[10.5px] font-bold text-[var(--c-danger)]">
                  <Info size={11} /> Insufficient balance
                </span>
              )}
            </div>

            {/* Swap button */}
            <div className="flex justify-center my-3 -mb-3 relative">
              <button
                type="button"
                onClick={handleSwap}
                aria-label="Swap direction"
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[3px] border-[var(--c-surface)] shadow-[0_4px_14px_rgba(201,162,39,0.34)] hover:rotate-180 hover:scale-105 transition-all duration-300"
              >
                <ArrowDownUp size={14} strokeWidth={2.6} />
              </button>
            </div>

            {/* To */}
            <div className="flex items-center justify-between mb-2 mt-3">
              <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">You receive</h2>
              <span className="text-[10px] text-[var(--c-text-muted)] font-medium">
                Balance · <span className="font-bold text-[var(--c-text)] tabular-nums">{fmt(BALANCES[toCode] ?? 0, toCode)}</span>
              </span>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2.5 items-stretch">
              <div className="rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] overflow-hidden">
                <div className="px-3 py-2.5">
                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-brand-accent m-0">Estimated</p>
                  <p className="text-[22px] font-black tabular-nums tracking-[-0.4px] text-[var(--c-text)] m-0 mt-0.5 truncate">
                    {num > 0 ? fmt(converted, toCode) : '0.00'}
                  </p>
                </div>
              </div>
              <CurrencyLabel code={toCode} />
            </div>
          </article>

          {/* Recent conversions */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                <Clock size={11} className="text-brand-accent" /> Recent conversions
              </h3>
              <span className="text-[10px] text-[var(--c-text-muted)]">Last 30 days</span>
            </div>
            <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
              {RECENT.map(r => (
                <li
                  key={r.id}
                  className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]">
                    <ArrowLeftRight size={12} />
                  </span>
                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="text-[11.5px] font-semibold text-[var(--c-text)] truncate">
                      {r.from} → {r.to}
                    </span>
                    <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5 inline-flex items-center gap-0.5">
                      <Clock size={9} /> {r.when}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--c-text-muted)] tabular-nums">
                    -{fmt(r.amount, r.from)}
                  </span>
                  <span className="text-[11.5px] font-bold tabular-nums text-[var(--c-success)] whitespace-nowrap">
                    +{fmt(r.received, r.to)}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">

          {/* Order summary */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-accent-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)]">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)]">
                <Receipt size={12} className="text-brand-accent" /> Order summary
              </h3>
              <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-[0.9px] text-brand-accent">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand-accent animate-ping opacity-70" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-brand-accent" />
                </span>
                Live
              </span>
            </header>

            <div className="p-4 flex flex-col gap-2">
              <SummaryRow label="Rate"                              value={rateDisplay}                                    mono />
              <SummaryRow label="You send"                         value={fmt(num, fromCode)}                             bold />
              <SummaryRow label={`Fee (${(FEE_RATE*100).toFixed(1)}%)`} value={fmt(fee, fromCode)}                       muted />
              <SummaryRow label="Slippage"                         value="≤ 0.10%"                                        muted />
              <div className="border-t border-dashed border-[var(--c-border)] my-0.5" />
              <SummaryRow label="You receive"                      value={fmt(converted, toCode)}                         accent hint="Settles in ≤ 5 seconds" />
              <div className="flex items-center justify-between mt-0.5 pt-2.5 border-t border-[var(--c-border)]">
                <p className="text-[10px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">Net out</p>
                <p className="text-[15px] font-black tabular-nums text-[var(--c-text)] tracking-[-0.3px] m-0">
                  {fmt(netAmount, fromCode)}
                </p>
              </div>

              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className={[
                  'relative overflow-hidden inline-flex items-center justify-center gap-2 w-full h-10 rounded-xl text-[12px] font-bold tracking-[0.2px] transition active:scale-[0.99] mt-1.5',
                  canSubmit
                    ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_6px_18px_-6px_rgba(201,162,39,0.5)] hover:-translate-y-px'
                    : status === 'done'
                      ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
                      : insufficient
                        ? 'bg-[var(--c-danger-soft)] text-[var(--c-danger)] border border-[var(--c-danger-border)] cursor-not-allowed'
                        : 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)] cursor-not-allowed',
                ].join(' ')}
              >
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.span key="idle" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-2">
                      <Zap size={13} strokeWidth={2.6} />
                      {insufficient ? 'Insufficient balance' : num > 0 ? `Convert · ${fmt(num, fromCode)}` : 'Enter an amount'}
                    </motion.span>
                  )}
                  {status === 'processing' && (
                    <motion.span key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                        <Loader2 size={13} strokeWidth={2.6} />
                      </motion.span>
                      Converting…
                    </motion.span>
                  )}
                  {status === 'done' && (
                    <motion.span key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="inline-flex items-center gap-2">
                      <Check size={13} strokeWidth={3} /> Converted successfully
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <p className="inline-flex items-center justify-center gap-1 text-[10px] text-[var(--c-text-muted)] mt-1">
                <ShieldCheck size={9} className="text-brand-accent" />
                Quote refreshes every 30s
              </p>
            </div>
          </article>

          {/* Live rate */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)] mb-3">
              <TrendingUp size={11} className="text-brand-accent" /> Live rate
            </h3>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent text-[11px] font-black shrink-0">
                $₦
              </span>
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-[12px] font-bold text-[var(--c-text)]">USD / NGN</span>
                <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5">US Dollar · Nigerian Naira</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[13px] font-bold tabular-nums text-[var(--c-text)]">
                  ₦{USD_RATE.toLocaleString()}
                </span>
                <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 mt-0.5">per 1 USD</p>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-[var(--c-border-soft)] bg-[var(--c-surface-soft)] p-3 flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
              <Info size={12} />
            </span>
            <div className="leading-snug">
              <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">Lock the rate</p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Big convert? Schedule with limit orders in <span className="text-brand-accent font-semibold">Pro tools</span>.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

function CurrencyLabel({ code }) {
  const isUSD = code === 'USD'
  return (
    <div className="inline-flex items-center gap-2 px-3.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] shrink-0">
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent text-[13px] font-black">
        {isUSD ? '$' : '₦'}
      </span>
      <div className="flex flex-col items-start leading-tight">
        <span className="text-[12.5px] font-bold text-[var(--c-text)] tracking-[-0.1px]">{code}</span>
        <span className="text-[9.5px] text-[var(--c-text-muted)]">{isUSD ? 'US Dollar' : 'Nigerian Naira'}</span>
      </div>
    </div>
  )
}

function SummaryRow({ label, value, mono, bold, accent, muted, hint }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[10.5px] text-[var(--c-text-muted)]">{label}</span>
      <span className={[
        'whitespace-nowrap text-right',
        mono   ? 'font-mono text-[11.5px]'          : 'text-[11.5px]',
        bold   ? 'font-bold text-[var(--c-text)]'   : '',
        accent ? 'font-bold text-brand-accent'       : '',
        muted  ? 'text-[var(--c-text-muted)] font-semibold' : '',
        !bold && !accent && !muted ? 'font-semibold text-[var(--c-text)]' : '',
      ].join(' ')}>
        {value}
        {hint && <span className="block text-[9.5px] text-[var(--c-text-muted)] font-medium mt-0.5">{hint}</span>}
      </span>
    </div>
  )
}
