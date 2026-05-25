import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronDown, ArrowDown, Sparkles,
  ShieldCheck, X, Check, TrendingUp, Info, Zap, Loader2, Copy, AlertTriangle,
} from 'lucide-react'
import BottomSheet from '../../components/internalUI/BottomSheet'

const COINS = [
  { id: 'BTC',  label: 'Bitcoin',  symbol: 'BTC',  logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/btc.png',  rate: 98_450_000, decimals: 6 },
  { id: 'ETH',  label: 'Ethereum', symbol: 'ETH',  logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/eth.png',  rate: 5_320_000,  decimals: 6 },
  { id: 'USDT', label: 'Tether',   symbol: 'USDT', logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/usdt.png', rate: 1_620,      decimals: 2 },
  { id: 'BNB',  label: 'BNB',      symbol: 'BNB',  logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/bnb.png',  rate: 950_000,    decimals: 4 },
]

const WALLET_ADDRESSES = {
  BTC:  { address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', network: 'Bitcoin (BTC)' },
  ETH:  { address: '0x742d35Cc6634C0532925a3b8D4C9b91A0b5e5b45',  network: 'Ethereum (ERC-20)' },
  USDT: { address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',          network: 'TRON (TRC-20)' },
  BNB:  { address: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',  network: 'BNB Chain (BEP-20)' },
}

const FEE_RATE = 0.005

function fmtNGN(n) {
  return '₦' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtCoin(n, coin) {
  return Number(n).toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: coin.decimals,
  }) + ' ' + coin.symbol
}

export default function MobileCryptoExchange() {
  const navigate = useNavigate()

  const [coin, setCoin]         = useState(COINS[0])
  const [amount, setAmount]     = useState('')
  const [pickerOpen, setPicker] = useState(false)
  const [status, setStatus]     = useState('idle')
  const [copied, setCopied]     = useState(false)

  const num    = Number(String(amount).replace(/[^\d.]/g, '')) || 0
  const fee    = num * FEE_RATE
  const net    = num - fee
  const ngnOut = net * coin.rate

  const canSubmit = num > 0 && status === 'idle'
  const wallet    = WALLET_ADDRESSES[coin.id]

  function handleAmountChange(e) {
    const raw   = e.target.value.replace(/[^\d.]/g, '')
    const parts = raw.split('.')
    setAmount(parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : raw)
  }

  function handleGetAddress() {
    if (!canSubmit) return
    setStatus('generating')
    setTimeout(() => setStatus('address'), 1200)
  }

  function handleSent() {
    setStatus('sent')
    setTimeout(() => { setStatus('idle'); setAmount('') }, 2500)
  }

  function handleCopy() {
    navigator.clipboard.writeText(wallet?.address ?? '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Back */}
      <button
        type="button"
        onClick={() => window.history.state?.idx > 0 ? navigate(-1) : navigate('/user/dashboard', { replace: true })}
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition self-start -mt-1"
      >
        <ChevronLeft size={14} /> Back
      </button>

      {/* Header */}
      <div>
        <p className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
          <Sparkles size={11} /> Crypto exchange
        </p>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
          Sell Crypto for Naira
        </h1>
        <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 leading-snug">
          Send crypto to our wallet · receive Naira instantly · {(FEE_RATE * 100).toFixed(1)}% fee
        </p>
      </div>

      {/* Exchange cards */}
      <div className="flex flex-col">

        {/* You send */}
        <article className="relative overflow-hidden rounded-t-[20px] bg-[var(--c-surface)] border border-[var(--c-border)]">

          {/* Label row */}
          <div className="flex items-center justify-between px-3.5 pt-3">
            <p className="text-[9.5px] uppercase tracking-[1.6px] font-bold text-[var(--c-text-muted)] m-0">You send</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[9px] font-semibold text-[var(--c-text-faint)]">
              External wallet
            </span>
          </div>

          {/* Amount input */}
          <div className="px-3.5 pt-2 pb-2.5">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[20px] font-bold tracking-[-0.3px] tabular-nums leading-none placeholder:text-[var(--c-text-faint)] text-[var(--c-text)]"
              style={{ boxShadow: 'none' }}
            />
            <p className="text-[10px] font-medium text-[var(--c-text-muted)] m-0 mt-1 tabular-nums">
              {coin.symbol} &middot; {fmtNGN(coin.rate)} per coin
            </p>
          </div>

          {/* Divider */}
          <div className="mx-3.5 h-px bg-[var(--c-border)]" />

          {/* Coin selector */}
          <button
            type="button"
            onClick={() => setPicker(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-[var(--c-surface-soft)] active:bg-[var(--c-surface-soft)] active:scale-[0.99] transition-all group"
          >
            <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] overflow-hidden">
              <img src={coin.logo} alt={coin.symbol} className="w-5 h-5 object-contain" />
            </span>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[13px] font-bold text-[var(--c-text)] m-0 leading-tight">{coin.label}</p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">{coin.symbol}</p>
            </div>
            <div className="inline-flex items-center gap-1 shrink-0">
              <span className="text-[10.5px] font-bold text-brand-accent">Change</span>
              <ChevronDown size={13} strokeWidth={2.4} className="text-brand-accent" />
            </div>
          </button>
        </article>

        {/* Direction connector */}
        <div className="relative flex justify-center z-10 -my-px">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[var(--c-border)]" />
          <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-bg)] border border-[var(--c-border)] text-[var(--c-text-muted)]">
            <ArrowDown size={13} strokeWidth={2.2} />
          </span>
        </div>

        {/* You receive */}
        <article className="relative overflow-hidden rounded-b-[20px] bg-gradient-to-b from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-t-0 border-[var(--c-accent-border)]">

          {/* Label row */}
          <div className="flex items-center justify-between px-3.5 pt-3">
            <p className="text-[9.5px] uppercase tracking-[1.6px] font-bold text-brand-accent m-0">You receive</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[rgba(201,162,39,0.15)] border border-[var(--c-accent-border)] text-[9px] font-bold text-brand-accent">
              Estimated
            </span>
          </div>

          {/* Amount display */}
          <div className="px-3.5 pt-2 pb-2.5">
            <p className="text-[20px] font-bold tracking-[-0.3px] tabular-nums leading-none text-[var(--c-text)] m-0 truncate">
              {num > 0 ? fmtNGN(ngnOut) : '0'}
            </p>
            <p className="text-[10px] font-medium text-[var(--c-text-muted)] m-0 mt-1">
              Nigerian Naira &middot; after {(FEE_RATE * 100).toFixed(1)}% fee
            </p>
          </div>

          {/* Divider */}
          <div className="mx-3.5 h-px bg-[var(--c-accent-border)]" />

          {/* NGN identity row */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5">
            <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#00843d] border border-[rgba(0,132,61,0.4)] shadow-[0_2px_8px_rgba(0,132,61,0.25)]">
              <span className="text-white font-black text-[14px] leading-none">₦</span>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-[var(--c-text)] m-0 leading-tight">Nigerian Naira</p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">NGN</p>
            </div>
          </div>
        </article>
      </div>

      {/* Rate summary */}
      <div className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-3 flex flex-col gap-2">
        <RateRow icon={TrendingUp} label="Rate" value={`${fmtNGN(coin.rate)} / 1 ${coin.symbol}`} />
        <RateRow label={`Fee (${(FEE_RATE * 100).toFixed(1)}%)`} value={num > 0 ? fmtCoin(fee, coin) : `0 ${coin.symbol}`} />
        <RateRow label="You receive" value={num > 0 ? fmtNGN(ngnOut) : '₦0'} emphasized />
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={status === 'address' ? handleSent : handleGetAddress}
        disabled={status === 'generating' || status === 'sent' || (!canSubmit && status === 'idle')}
        className={[
          'inline-flex items-center justify-center gap-1.5 w-full py-3.5 rounded-2xl text-[14px] font-bold tracking-[-0.1px] transition',
          status === 'sent'
            ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
            : (canSubmit || status === 'address')
              ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_8px_22px_rgba(201,162,39,0.36)] active:scale-[0.98]'
              : 'bg-[var(--c-surface)] text-[var(--c-text-muted)] border border-[var(--c-border)] opacity-60 cursor-not-allowed',
        ].join(' ')}
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === 'generating' && (
            <motion.span key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                <Loader2 size={16} strokeWidth={2.4} />
              </motion.span>
              Generating address…
            </motion.span>
          )}
          {status === 'sent' && (
            <motion.span key="sent" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-1.5">
              <Check size={16} strokeWidth={2.6} /> Payment confirmed
            </motion.span>
          )}
          {status === 'address' && (
            <motion.span key="confirm" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-1.5">
              <Check size={15} strokeWidth={2.6} /> I've sent the crypto
            </motion.span>
          )}
          {status === 'idle' && (
            <motion.span key="idle" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-1.5">
              <Zap size={15} strokeWidth={2.4} />
              {num > 0 ? 'Get Wallet Address' : 'Enter an amount'}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Wallet address card — slides in after address is generated */}
      <AnimatePresence>
        {(status === 'address' || status === 'sent') && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="rounded-2xl border border-[var(--c-accent-border)] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] uppercase tracking-[1.2px] text-brand-accent font-semibold m-0">Deposit address</p>
              <span className="text-[10px] text-[var(--c-text-muted)] font-medium">{wallet?.network}</span>
            </div>

            <div className="flex items-center gap-2 bg-[var(--c-menu-bg)] border border-[var(--c-border)] rounded-xl px-3 py-2.5">
              <p className="flex-1 min-w-0 m-0 text-[10.5px] font-mono text-[var(--c-text)] break-all leading-snug">
                {wallet?.address}
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent active:scale-90 transition"
              >
                {copied ? <Check size={13} strokeWidth={2.6} /> : <Copy size={13} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11.5px]">
              <span className="text-[var(--c-text-muted)]">Send exactly</span>
              <span className="font-bold text-[var(--c-text)] tabular-nums">{fmtCoin(num, coin)}</span>
            </div>
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="text-[var(--c-text-muted)]">You will receive</span>
              <span className="font-bold text-brand-accent tabular-nums">{fmtNGN(ngnOut)}</span>
            </div>

            <div className="flex items-start gap-2 pt-2 border-t border-[var(--c-accent-border)]">
              <AlertTriangle size={11} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 leading-snug">
                Only send <strong className="text-[var(--c-text)]">{coin.symbol}</strong> on the <strong className="text-[var(--c-text)]">{wallet?.network}</strong> network. Wrong network = lost funds.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="inline-flex items-center justify-center gap-1.5 text-[10.5px] text-[var(--c-text-muted)] mb-2">
        <ShieldCheck size={11} className="text-brand-accent" />
        Funds credited within 1–3 network confirmations
      </p>

      {/* Coin picker bottom sheet */}
      <CoinPicker
        open={pickerOpen}
        selected={coin}
        onSelect={c => { setCoin(c); setPicker(false); setAmount(''); setStatus('idle') }}
        onClose={() => setPicker(false)}
      />
    </div>
  )
}

function RateRow({ icon: Icon, label, value, emphasized }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1 text-[11.5px] text-[var(--c-text-muted)]">
        {Icon ? <Icon size={11} className="text-brand-accent" /> : <Info size={11} className="text-[var(--c-text-faint)]" />}
        {label}
      </span>
      <span className={[
        'tabular-nums whitespace-nowrap',
        emphasized ? 'text-[13px] font-bold text-[var(--c-text)]' : 'text-[11.5px] font-semibold text-[var(--c-text)]',
      ].join(' ')}>
        {value}
      </span>
    </div>
  )
}

function CoinPicker({ open, selected, onSelect, onClose }) {
  return (
    <BottomSheet open={open} onClose={onClose} label="Select coin" title="Choose asset" maxHeight="80vh">
      <ul className="list-none m-0 px-3 pb-2 space-y-1.5 overflow-y-auto">
        {COINS.map(c => {
          const active = c.id === selected.id
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c)}
                className={[
                  'flex items-center gap-3 w-full p-3 rounded-2xl text-left transition active:scale-[0.99]',
                  active
                    ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)]'
                    : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                ].join(' ')}
              >
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-[14px] bg-[var(--c-surface)] border border-[var(--c-border)] shrink-0">
                  <img src={c.logo} alt={c.symbol} className="w-7 h-7 object-contain" />
                </span>
                <span className="flex-1 min-w-0 leading-tight">
                  <span className="block text-[14px] font-semibold text-[var(--c-text)] truncate">{c.label}</span>
                  <span className="block text-[11px] text-[var(--c-text-muted)] mt-0.5 tabular-nums">
                    {fmtNGN(c.rate)} / 1 {c.symbol}
                  </span>
                </span>
                {active && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-accent text-brand-primary shrink-0">
                    <Check size={11} strokeWidth={2.6} />
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
