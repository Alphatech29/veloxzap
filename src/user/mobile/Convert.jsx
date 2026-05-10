import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronDown, ArrowDownUp, Sparkles, Info,
  ShieldCheck, X, Check, TrendingUp,
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
  { id: '25', label: '25%', value: 0.25 },
  { id: '50', label: '50%', value: 0.5 },
  { id: '75', label: '75%', value: 0.75 },
  { id: 'max', label: 'Max', value: 1 },
]

function formatAmount(num, decimals) {
  if (!isFinite(num)) return '0'
  return num.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

function formatBalance(code, value) {
  const c = CURRENCIES.find(x => x.code === code)
  return `${formatAmount(value, c?.decimals ?? 2)} ${code}`
}

export default function MobileConvert() {
  const navigate = useNavigate()
  const [fromCode, setFromCode] = useState('NGN')
  const [toCode, setToCode] = useState('USDT')
  const [amount, setAmount] = useState('100000')
  const [picker, setPicker] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const from = CURRENCIES.find(c => c.code === fromCode)
  const to = CURRENCIES.find(c => c.code === toCode)
  const balance = BALANCES[fromCode] ?? 0

  const num = Number(String(amount).replace(/[^\d.]/g, '')) || 0
  const converted = num * (from.rate / to.rate)
  const insufficient = num > balance
  const canSubmit = num > 0 && !insufficient

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
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2400)
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition self-start -mt-1"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <div>
        <p className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
          <Sparkles size={11} /> Exchange
        </p>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
          Convert
        </h1>
        <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 leading-snug">
          Swap between fiat and crypto at live rates · zero hidden fees
        </p>
      </div>

      <div className="relative flex flex-col gap-2">
        <CurrencyCard
          label="You pay"
          balanceLabel={`Balance: ${formatBalance(fromCode, balance)}`}
          currency={from}
          amount={amount}
          editable
          onAmountChange={handleAmountChange}
          onPick={() => setPicker('from')}
          insufficient={insufficient}
        />

        <button
          type="button"
          onClick={handleSwap}
          aria-label="Swap currencies"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[3px] border-[var(--c-bg)] shadow-[0_6px_18px_rgba(201,162,39,0.4)] active:scale-90 transition"
        >
          <ArrowDownUp size={15} strokeWidth={2.6} />
        </button>

        <CurrencyCard
          label="You receive"
          balanceLabel={`Balance: ${formatBalance(toCode, BALANCES[toCode] ?? 0)}`}
          currency={to}
          amount={num > 0 ? formatAmount(converted, to.decimals) : '0'}
          editable={false}
          onPick={() => setPicker('to')}
        />
      </div>

      {fromCode === 'NGN' && balance > 0 && (
        <div className="flex gap-1.5">
          {QUICK_PCTS.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleQuick(p.value)}
              className="flex-1 inline-flex items-center justify-center px-2 py-1.5 rounded-[10px] bg-[var(--c-surface)] border border-[var(--c-border)] text-[11px] font-semibold text-[var(--c-text)] hover:border-[var(--c-accent-border)] active:scale-95 transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-3 flex flex-col gap-2">
        <RateRow icon={TrendingUp} label="Rate" value={rateDisplay} />
        <RateRow label="Network fee" value="₦0 · gasless" tone="success" />
        <RateRow
          label="You receive"
          value={`≈ ${num > 0 ? formatAmount(converted, to.decimals) : '0'} ${to.code}`}
          emphasized
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit && !submitted}
        className={[
          'inline-flex items-center justify-center gap-1.5 w-full py-3 rounded-2xl text-[14px] font-bold tracking-[-0.1px] transition',
          submitted
            ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
            : 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_8px_22px_rgba(201,162,39,0.36)] active:scale-[0.98]',
          !canSubmit && !submitted ? 'opacity-50 cursor-not-allowed' : '',
        ].join(' ')}
      >
        <AnimatePresence mode="wait" initial={false}>
          {submitted ? (
            <motion.span
              key="ok"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="inline-flex items-center gap-1.5"
            >
              <Check size={16} strokeWidth={2.6} /> Conversion queued
            </motion.span>
          ) : insufficient ? (
            <motion.span
              key="low"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Insufficient {fromCode}
            </motion.span>
          ) : (
            <motion.span
              key="go"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="inline-flex items-center gap-1.5"
            >
              <ArrowDownUp size={15} strokeWidth={2.4} /> Convert {fromCode} → {toCode}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <p className="inline-flex items-center justify-center gap-1.5 text-[10.5px] text-[var(--c-text-muted)] mt-1 mb-2">
        <ShieldCheck size={11} className="text-brand-accent" />
        Locked rate for 30s · executed at submit time
      </p>

      <AnimatePresence>
        {picker && (
          <CurrencyPicker
            selected={picker === 'from' ? fromCode : toCode}
            otherCode={picker === 'from' ? toCode : fromCode}
            onSelect={handleSelectCurrency}
            onClose={() => setPicker(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function CurrencyCard({ label, balanceLabel, currency, amount, editable, onAmountChange, onPick, insufficient }) {
  return (
    <article
      className={[
        'relative overflow-hidden p-3.5 rounded-2xl bg-[var(--c-surface)] border transition',
        insufficient ? 'border-[var(--c-danger-border)]' : 'border-[var(--c-border)]',
      ].join(' ')}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-[1.2px] font-semibold text-[var(--c-text-muted)] m-0">
          {label}
        </p>
        {balanceLabel && (
          <p className="text-[10px] text-[var(--c-text-muted)] m-0 truncate max-w-[55%]">
            {balanceLabel}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPick}
          aria-label={`Pick currency · ${currency.code}`}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-[12px] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent active:scale-95 hover:shadow-[0_0_14px_-2px_rgba(201,162,39,0.4)] transition shrink-0"
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-[8px] bg-[var(--c-menu-bg)] text-[var(--c-text)] text-[10.5px] font-bold tracking-[0.4px]">
            {currency.code.slice(0, 3)}
          </span>
          <ChevronDown size={13} strokeWidth={2.4} />
        </button>
        {editable ? (
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={onAmountChange}
            placeholder="0"
            className={[
              'flex-1 min-w-0 bg-transparent border-0 outline-0 text-right text-[22px] font-bold tracking-[-0.4px] tabular-nums placeholder:text-[var(--c-text-faint)]',
              insufficient ? 'text-[var(--c-danger)]' : 'text-[var(--c-text)]',
            ].join(' ')}
          />
        ) : (
          <p className="flex-1 min-w-0 m-0 text-right text-[22px] font-bold tracking-[-0.4px] tabular-nums text-[var(--c-text)] truncate">
            {amount}
          </p>
        )}
      </div>
    </article>
  )
}

function RateRow({ icon: Icon, label, value, tone, emphasized }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1 text-[11.5px] text-[var(--c-text-muted)]">
        {Icon && <Icon size={11} className="text-brand-accent" />}
        {!Icon && <Info size={11} className="text-[var(--c-text-faint)]" />}
        {label}
      </span>
      <span
        className={[
          'tabular-nums whitespace-nowrap',
          emphasized ? 'text-[13px] font-bold text-[var(--c-text)]' : 'text-[11.5px] font-semibold',
          tone === 'success' && !emphasized ? 'text-[var(--c-success)]' : '',
          !tone && !emphasized ? 'text-[var(--c-text)]' : '',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  )
}

function CurrencyPicker({ selected, otherCode, onSelect, onClose }) {
  return (
    <>
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-[var(--c-scrim)] backdrop-blur-[3px] border-0"
      />
      <motion.div
        role="dialog"
        aria-label="Pick a currency"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-[var(--c-menu-bg)] border-t border-x border-[var(--c-accent-soft-2)] shadow-[0_-24px_50px_-12px_rgba(2,7,23,0.6)]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
      >
        <div className="flex justify-center pt-3 pb-1.5">
          <span className="block w-12 h-1.5 rounded-full bg-[var(--c-border-strong)]" />
        </div>
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <div>
            <p className="text-[10.5px] uppercase tracking-[1.2px] text-brand-accent font-semibold m-0">
              Select currency
            </p>
            <h3 className="text-[18px] font-bold tracking-[-0.3px] text-[var(--c-text)] m-0 mt-0.5">
              Choose asset
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text)] active:scale-95 transition"
          >
            <X size={15} />
          </button>
        </div>
        <ul className="list-none m-0 px-3 pb-2 space-y-1.5">
          {CURRENCIES.map(c => {
            const active = c.code === selected
            const blocked = c.code === otherCode
            return (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => !blocked && onSelect(c.code)}
                  disabled={blocked}
                  className={[
                    'flex items-center gap-3 w-full p-3 rounded-2xl text-left transition',
                    active
                      ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)]'
                      : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                    blocked ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.99]',
                  ].join(' ')}
                >
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-[14px] bg-[var(--c-menu-bg)] border border-[var(--c-border)] text-[var(--c-text)] text-[12px] font-bold tracking-[0.4px]">
                    {c.code}
                  </span>
                  <span className="flex-1 min-w-0 leading-tight">
                    <span className="block text-[14px] font-semibold text-[var(--c-text)] truncate">
                      {c.name}
                    </span>
                    <span className="block text-[11px] text-[var(--c-text-muted)] mt-0.5 tabular-nums">
                      Balance · {formatAmount(BALANCES[c.code] ?? 0, c.decimals)} {c.code}
                    </span>
                  </span>
                  {active && (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-accent text-brand-primary shrink-0">
                      <Check size={13} strokeWidth={2.6} />
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </motion.div>
    </>
  )
}
