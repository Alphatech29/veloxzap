import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronDown, ArrowDownUp, Sparkles, Info,
  ShieldCheck, X, Check, TrendingUp,
} from 'lucide-react'
import BottomSheet from '../../components/internalUI/BottomSheet'
import ProcessingOverlay from '../../components/internalUI/ProcessingOverlay'
import useUser from '../../hooks/useUser'
import useSettings from '../../hooks/useSettings'
import { convertCurrency } from '../../services/convert'
import { useAlert } from '../../components/ui/Alert'

const CURRENCIES = [
  { code: 'NGN', name: 'Nigerian Naira', decimals: 2, flag: 'https://flagcdn.com/w40/ng.png' },
  { code: 'USD', name: 'US Dollar',      decimals: 2, flag: 'https://flagcdn.com/w40/us.png' },
]

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
  const { wallet } = useUser()
  const { settings } = useSettings()

  // Two independent, non-reciprocal rates (buy/sell spread) — must match backend's utilities/convert.js
  const ngnToUsdRate = Number(settings?.ngn_to_usd ?? 0) // NGN per 1 USD, applied when selling NGN for USD
  const usdToNgnRate = Number(settings?.usd_to_ngn ?? 0) // NGN per 1 USD, applied when selling USD for NGN

  const balances = {
    NGN: Number(wallet?.ngn_balance ?? 0),
    USD: Number(wallet?.usd_balance ?? 0),
  }

  const { alert } = useAlert()

  const [fromCode, setFromCode] = useState('NGN')
  const [toCode, setToCode] = useState('USD')
  const [amount, setAmount] = useState('')
  const [picker, setPicker] = useState(null)
  const [converting, setConverting] = useState(false)

  const from = CURRENCIES.find(c => c.code === fromCode)
  const to = CURRENCIES.find(c => c.code === toCode)
  const balance = balances[fromCode] ?? 0

  const activeRate = fromCode === 'USD' ? usdToNgnRate : ngnToUsdRate

  const num = Number(String(amount).replace(/[^\d.]/g, '')) || 0
  const converted = fromCode === 'USD'
    ? num * usdToNgnRate
    : (ngnToUsdRate ? num / ngnToUsdRate : 0)
  const insufficient = num > balance
  const canSubmit = num > 0 && !insufficient && activeRate > 0 && !converting

  const rateDisplay = activeRate > 0
    ? `1 USD = ${formatAmount(activeRate, 2)} NGN`
    : 'Rate unavailable'

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

  async function handleSubmit() {
    if (!canSubmit) return
    setConverting(true)
    const result = await convertCurrency({ amount: num, from: fromCode })
    setConverting(false)
    if (!result.success) {
      alert({ type: 'error', title: 'Conversion failed', message: result.message || 'Please try again.' })
      return
    }
    setAmount('')
    alert({ type: 'success', title: 'Conversion successful', message: `${formatAmount(num, from.decimals)} ${fromCode} converted to ${formatAmount(converted, to.decimals)} ${toCode}` })
  }

  return (
    <div className="flex flex-col gap-4">

      <ProcessingOverlay
        open={converting}
        title="Converting…"
        subtitle={`${formatAmount(num, from.decimals)} ${fromCode} → ${toCode}`}
      />
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
          Swap between NGN and USD instantly · zero hidden fees
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
          balanceLabel={`Balance: ${formatBalance(toCode, balances[toCode] ?? 0)}`}
          currency={to}
          amount={num > 0 ? formatAmount(converted, to.decimals) : '0'}
          editable={false}
          onPick={() => setPicker('to')}
        />
      </div>

      {balance > 0 && (
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
        <RateRow label="Network fee" value="Free · no hidden charges" tone="success" />
        <RateRow
          label="You receive"
          value={`≈ ${num > 0 ? formatAmount(converted, to.decimals) : '0'} ${to.code}`}
          emphasized
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={[
          'inline-flex items-center justify-center gap-1.5 w-full py-3 rounded-2xl text-[14px] font-bold tracking-[-0.1px] transition',
          'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_8px_22px_rgba(201,162,39,0.36)] active:scale-[0.98]',
          !canSubmit ? 'opacity-50 cursor-not-allowed' : '',
        ].join(' ')}
      >
        <AnimatePresence mode="wait" initial={false}>
          {converting ? (
            <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                <ArrowDownUp size={15} strokeWidth={2.4} />
              </motion.span>
              Converting…
            </motion.span>
          ) : insufficient ? (
            <motion.span key="low" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Insufficient {fromCode}
            </motion.span>
          ) : (
            <motion.span key="go" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-1.5">
              <ArrowDownUp size={15} strokeWidth={2.4} /> Convert {fromCode} → {toCode}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <p className="inline-flex items-center justify-center gap-1.5 text-[10.5px] text-[var(--c-text-muted)] mt-1 mb-2">
        <ShieldCheck size={11} className="text-brand-accent" />
        {activeRate > 0 ? `Rate: 1 USD = ${activeRate.toLocaleString('en-NG')} NGN · indicative` : 'Fetching rate…'}
      </p>

      <CurrencyPicker
        open={!!picker}
        selected={picker === 'from' ? fromCode : toCode}
        otherCode={picker === 'from' ? toCode : fromCode}
        balances={balances}
        onSelect={handleSelectCurrency}
        onClose={() => setPicker(null)}
      />

    </div>
  )
}

function CurrencyCard({ label, balanceLabel, currency, amount, editable, onAmountChange, onPick, insufficient }) {
  return (
    <article
      className={[
        'relative overflow-hidden rounded-2xl bg-[var(--c-surface)] border transition-all duration-200',
        insufficient
          ? 'border-[var(--c-danger-border)] shadow-[0_0_0_3px_rgba(239,68,68,0.08)]'
          : editable
            ? 'border-[var(--c-accent-border)] shadow-[0_0_0_3px_rgba(201,162,39,0.07)]'
            : 'border-[var(--c-border)]',
      ].join(' ')}
    >
      {/* top strip */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1.5">
        <p className="text-[9.5px] uppercase tracking-[1.4px] font-bold text-[var(--c-text-muted)] m-0">
          {label}
        </p>
        {balanceLabel && (
          <p className="text-[10px] text-[var(--c-text-muted)] m-0 truncate max-w-[55%]">
            {balanceLabel}
          </p>
        )}
      </div>

      {/* main row */}
      <div className="flex items-center gap-3 px-4 pb-4 pt-1">
        <button
          type="button"
          onClick={onPick}
          aria-label={`Pick currency · ${currency.code}`}
          className="inline-flex items-center gap-2 pl-1 pr-2.5 py-1.5 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] active:scale-95 transition shrink-0 shadow-sm"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-[var(--c-border-soft)] shadow-sm">
            <img src={currency.flag} alt={currency.code} className="w-full h-full object-cover" />
          </span>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[12px] font-black text-[var(--c-text)] tracking-[0.2px]">{currency.code}</span>
            <span className="text-[9px] text-[var(--c-text-muted)] font-medium mt-0.5">{currency.name.split(' ')[0]}</span>
          </div>
          <ChevronDown size={12} strokeWidth={2.6} className="text-[var(--c-text-muted)] ml-0.5" />
        </button>

        {editable ? (
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={onAmountChange}
            placeholder="0.00"
            className={[
              'flex-1 min-w-0 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 appearance-none',
              'text-right text-[20px] font-black tracking-[-0.6px] tabular-nums',
              'placeholder:text-[var(--c-text-faint)]',
              insufficient ? 'text-[var(--c-danger)]' : 'text-[var(--c-text)]',
            ].join(' ')}
            style={{ boxShadow: 'none' }}
          />
        ) : (
          <p className={[
            'flex-1 min-w-0 m-0 text-right text-[20px] font-black tracking-[-0.6px] tabular-nums truncate',
            amount === '0' ? 'text-[var(--c-text-faint)]' : 'text-[var(--c-text)]',
          ].join(' ')}>
            {amount}
          </p>
        )}
      </div>

      {/* subtle bottom glow for editable */}
      {editable && (
        <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />
      )}
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

function CurrencyPicker({ open, selected, otherCode, balances, onSelect, onClose }) {
  return (
    <BottomSheet open={open} onClose={onClose} label="Select currency" title="Choose asset" maxHeight="85vh">
      <ul className="list-none m-0 px-3 pb-2 space-y-1.5 overflow-y-auto">
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
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--c-menu-bg)] border border-[var(--c-border)] overflow-hidden">
                    <img src={c.flag} alt={c.code} className="w-full h-full object-cover" />
                  </span>
                  <span className="flex-1 min-w-0 leading-tight">
                    <span className="block text-[14px] font-semibold text-[var(--c-text)] truncate">
                      {c.name}
                    </span>
                    <span className="block text-[11px] text-[var(--c-text-muted)] mt-0.5 tabular-nums">
                      Balance · {formatAmount(balances[c.code] ?? 0, c.decimals)} {c.code}
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
    </BottomSheet>
  )
}
