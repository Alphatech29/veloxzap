import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, ArrowDownUp, Sparkles, Info, ShieldCheck, X, Check,
  TrendingUp, ArrowLeftRight, Receipt, Clock, Zap, Loader2,
} from 'lucide-react'

const CURRENCIES = [
  { code: 'NGN',  name: 'Nigerian Naira', rate: 1,         decimals: 2 },
  { code: 'USDT', name: 'Tether USD',     rate: 1750,      decimals: 2 },
  { code: 'USD',  name: 'US Dollar',      rate: 1700,      decimals: 2 },
  { code: 'BTC',  name: 'Bitcoin',        rate: 105000000, decimals: 6 },
  { code: 'ETH',  name: 'Ethereum',       rate: 5800000,   decimals: 6 },
]

const BALANCES = {
  NGN: 1284750.45,
  USDT: 320.50,
  USD: 0,
  BTC: 0.00184,
  ETH: 0.062,
}

const QUICK_PCTS = [
  { id: '25',  label: '25%', value: 0.25 },
  { id: '50',  label: '50%', value: 0.5 },
  { id: '75',  label: '75%', value: 0.75 },
  { id: 'max', label: 'Max', value: 1 },
]

const RECENT = [
  { id: 'c1', from: 'NGN',  to: 'USDT', amount: 250000, received: 142.86, when: 'Today · 09:42' },
  { id: 'c2', from: 'USDT', to: 'NGN',  amount: 50,     received: 87420,  when: 'Yesterday' },
  { id: 'c3', from: 'NGN',  to: 'BTC',  amount: 100000, received: 0.00095, when: 'May 5' },
]

const FEE_RATE = 0.005

function formatAmount(num, decimals) {
  if (!isFinite(num)) return '0'
  return num.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

function formatBalance(code) {
  const v = BALANCES[code] ?? 0
  const c = CURRENCIES.find(x => x.code === code)
  return `${formatAmount(v, c?.decimals ?? 2)} ${code}`
}

export default function DesktopConvert() {
  const [fromCode, setFromCode] = useState('NGN')
  const [toCode, setToCode] = useState('USDT')
  const [amount, setAmount] = useState('100000')
  const [picker, setPicker] = useState(null)
  const [status, setStatus] = useState('idle')

  const from = CURRENCIES.find(c => c.code === fromCode)
  const to = CURRENCIES.find(c => c.code === toCode)
  const balance = BALANCES[fromCode] ?? 0

  const num = Number(String(amount).replace(/[^\d.]/g, '')) || 0
  const fee = num * FEE_RATE
  const netAmount = num - fee
  const converted = netAmount * (from.rate / to.rate)
  const insufficient = num > balance
  const canSubmit = num > 0 && !insufficient && status === 'idle'

  const rateDisplay = `1 ${from.code} = ${formatAmount(from.rate / to.rate, to.decimals)} ${to.code}`

  function handleAmountChange(e) {
    const raw = e.target.value.replace(/[^\d.]/g, '')
    const parts = raw.split('.')
    const cleaned = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : raw
    setAmount(cleaned)
  }

  function handleSwap() {
    setFromCode(toCode)
    setToCode(fromCode)
    setAmount('')
  }

  function handleQuick(pct) {
    setAmount(String(Math.floor(balance * pct * 100) / 100))
  }

  function handleSelectCurrency(code) {
    if (picker === 'from') {
      if (code === toCode) setToCode(fromCode)
      setFromCode(code)
    } else if (picker === 'to') {
      if (code === fromCode) setFromCode(toCode)
      setToCode(code)
    }
    setPicker(null)
  }

  function handleSubmit() {
    if (!canSubmit) return
    setStatus('processing')
    setTimeout(() => {
      setStatus('done')
      setTimeout(() => {
        setStatus('idle')
        setAmount('')
      }, 1800)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
            <Sparkles size={10} /> Swap currencies
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Convert
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Move between fiat & crypto at live rates · {Math.round(FEE_RATE * 1000) / 10}% transparent fee.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
          <ShieldCheck size={10} /> Live rates · refreshed every 30s
        </span>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4 relative overflow-visible">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                You send
              </h2>
              <span className="text-[10px] text-[var(--c-text-muted)] font-medium">
                Balance · <span className="font-bold text-[var(--c-text)] tabular-nums">{formatBalance(fromCode)}</span>
              </span>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2.5 items-stretch">
              <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition overflow-hidden">
                <div className="px-3 py-2.5">
                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">
                    Amount
                  </p>
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

              <CurrencyPickerButton
                currency={from}
                balance={BALANCES[fromCode]}
                onClick={() => setPicker('from')}
              />
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {fromCode === 'NGN' && QUICK_PCTS.map(p => (
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

            <div className="flex justify-center my-3 -mb-3 relative">
              <button
                type="button"
                onClick={handleSwap}
                aria-label="Swap currencies"
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[3px] border-[var(--c-surface)] shadow-[0_4px_14px_rgba(201,162,39,0.34)] hover:rotate-180 hover:scale-105 transition-all duration-300"
              >
                <ArrowDownUp size={14} strokeWidth={2.6} />
              </button>
            </div>

            <div className="flex items-center justify-between mb-2 mt-3">
              <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                You receive
              </h2>
              <span className="text-[10px] text-[var(--c-text-muted)] font-medium">
                Balance · <span className="font-bold text-[var(--c-text)] tabular-nums">{formatBalance(toCode)}</span>
              </span>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2.5 items-stretch">
              <div className="rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] overflow-hidden">
                <div className="px-3 py-2.5">
                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-brand-accent m-0">
                    Estimated
                  </p>
                  <p className="text-[22px] font-black tabular-nums tracking-[-0.4px] text-[var(--c-text)] m-0 mt-0.5 truncate">
                    {num > 0 ? formatAmount(converted, to.decimals) : '0.00'}
                  </p>
                </div>
              </div>

              <CurrencyPickerButton
                currency={to}
                balance={BALANCES[toCode]}
                onClick={() => setPicker('to')}
              />
            </div>
          </article>

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                <Clock size={11} className="text-brand-accent" /> Recent conversions
              </h3>
              <span className="text-[10px] text-[var(--c-text-muted)]">
                Last 30 days
              </span>
            </div>
            <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
              {RECENT.map(r => {
                const fc = CURRENCIES.find(c => c.code === r.from)
                const tc = CURRENCIES.find(c => c.code === r.to)
                return (
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
                      -{formatAmount(r.amount, fc.decimals)}
                    </span>
                    <span className="text-[11.5px] font-bold tabular-nums text-[var(--c-success)] whitespace-nowrap">
                      +{formatAmount(r.received, tc.decimals)}
                    </span>
                  </li>
                )
              })}
            </ul>
          </article>
        </div>

        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">

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
              <SummaryRow label="Rate" value={rateDisplay} mono />
              <SummaryRow label="You send" value={`${formatAmount(num, from.decimals)} ${from.code}`} bold />
              <SummaryRow label={`Fee (${(FEE_RATE * 100).toFixed(1)}%)`} value={`${formatAmount(fee, from.decimals)} ${from.code}`} muted />
              <SummaryRow label="Slippage" value="≤ 0.10%" muted />
              <div className="border-t border-dashed border-[var(--c-border)] my-0.5" />
              <SummaryRow
                label="You receive"
                value={`${formatAmount(converted, to.decimals)} ${to.code}`}
                accent
                hint="Settles in ≤ 5 seconds"
              />
              <div className="flex items-center justify-between mt-0.5 pt-2.5 border-t border-[var(--c-border)]">
                <p className="text-[10px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">
                  Net out
                </p>
                <p className="text-[15px] font-black tabular-nums text-[var(--c-text)] tracking-[-0.3px] m-0">
                  {formatAmount(netAmount, from.decimals)} {from.code}
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
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Zap size={13} strokeWidth={2.6} />
                      {insufficient
                        ? 'Insufficient balance'
                        : num > 0
                          ? `Convert · ${formatAmount(num, from.decimals)} ${from.code}`
                          : 'Enter an amount'}
                    </motion.span>
                  )}
                  {status === 'processing' && (
                    <motion.span
                      key="proc"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center gap-2"
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                        className="inline-flex"
                      >
                        <Loader2 size={13} strokeWidth={2.6} />
                      </motion.span>
                      Converting…
                    </motion.span>
                  )}
                  {status === 'done' && (
                    <motion.span
                      key="done"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Check size={13} strokeWidth={3} />
                      Converted successfully
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

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)] mb-2">
              <TrendingUp size={11} className="text-brand-accent" /> Live rates
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
              {CURRENCIES.filter(c => c.code !== 'NGN').map(c => (
                <li
                  key={c.code}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]"
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] text-[10px] font-black">
                    {c.code.slice(0, 2)}
                  </span>
                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="text-[11px] font-semibold text-[var(--c-text)] truncate">
                      {c.code}
                    </span>
                    <span className="text-[9.5px] text-[var(--c-text-muted)] mt-0.5 truncate">
                      {c.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold tabular-nums text-[var(--c-text)] whitespace-nowrap">
                    ₦{formatAmount(c.rate, 2)}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl border border-[var(--c-border-soft)] bg-[var(--c-surface-soft)] p-3 flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
              <Info size={12} />
            </span>
            <div className="leading-snug">
              <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">
                Lock the rate
              </p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Big convert? Schedule with limit orders in <span className="text-brand-accent font-semibold">Pro tools</span>.
              </p>
            </div>
          </article>
        </div>
      </section>

      <CurrencyPicker
        open={!!picker}
        excludeCode={picker === 'from' ? toCode : fromCode}
        onPick={handleSelectCurrency}
        onClose={() => setPicker(null)}
      />
    </div>
  )
}

function CurrencyPickerButton({ currency, balance, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] active:scale-[0.98] transition shrink-0"
    >
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent text-[11px] font-black">
        {currency.code.slice(0, 2)}
      </span>
      <div className="flex flex-col items-start leading-tight">
        <span className="text-[12.5px] font-bold text-[var(--c-text)] tracking-[-0.1px]">
          {currency.code}
        </span>
        <span className="text-[9.5px] text-[var(--c-text-muted)]">
          {currency.name}
        </span>
      </div>
      <ChevronDown size={13} className="text-[var(--c-text-muted)] ml-1" />
    </button>
  )
}

function SummaryRow({ label, value, mono, bold, accent, muted, hint }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[10.5px] text-[var(--c-text-muted)]">
        {label}
      </span>
      <span
        className={[
          'whitespace-nowrap text-right',
          mono ? 'font-mono text-[11.5px]' : 'text-[11.5px]',
          bold ? 'font-bold text-[var(--c-text)]' : '',
          accent ? 'font-bold text-brand-accent' : '',
          muted ? 'text-[var(--c-text-muted)] font-semibold' : '',
          !bold && !accent && !muted ? 'font-semibold text-[var(--c-text)]' : '',
        ].join(' ')}
      >
        {value}
        {hint && (
          <span className="block text-[9.5px] text-[var(--c-text-muted)] font-medium mt-0.5">
            {hint}
          </span>
        )}
      </span>
    </div>
  )
}

function CurrencyPicker({ open, excludeCode, onPick, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-[var(--c-scrim)] backdrop-blur-[3px] border-0 cursor-default"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pick a currency"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="relative w-full max-w-[420px] max-h-[calc(100vh-32px)] flex flex-col rounded-2xl bg-[var(--c-menu-bg)] border border-[var(--c-border)] shadow-[0_30px_60px_-20px_rgba(2,7,23,0.55)] overflow-hidden"
          >
            <header className="flex items-center justify-between gap-2 px-5 py-4 border-b border-[var(--c-border)] shrink-0">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[1.2px] text-brand-accent font-bold m-0">
                  Choose currency
                </p>
                <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[var(--c-text)] m-0 mt-0.5">
                  Pick a wallet
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-border)] active:scale-95 transition shrink-0"
              >
                <X size={13} />
              </button>
            </header>
            <ul className="list-none m-0 p-0 overflow-y-auto">
              {CURRENCIES.map((c, i) => {
                const disabled = c.code === excludeCode
                const balance = BALANCES[c.code] ?? 0
                return (
                  <li key={c.code} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onPick(c.code)}
                      className={[
                        'w-full flex items-center gap-3 px-5 py-3 text-left transition',
                        disabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-[var(--c-surface-soft)] active:bg-[var(--c-surface-soft)]',
                      ].join(' ')}
                    >
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent text-[12px] font-black shrink-0">
                        {c.code.slice(0, 2)}
                      </span>
                      <div className="flex-1 min-w-0 leading-tight">
                        <p className="text-[13px] font-bold text-[var(--c-text)] m-0 truncate">
                          {c.code}
                        </p>
                        <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5 truncate">
                          {c.name}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[12px] font-bold tabular-nums text-[var(--c-text)] m-0">
                          {formatAmount(balance, c.decimals)}
                        </p>
                        <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                          {disabled ? 'In use' : 'Available'}
                        </p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
