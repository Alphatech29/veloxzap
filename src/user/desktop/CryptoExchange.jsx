import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bitcoin, Sparkles, ShieldCheck, Info,
  Receipt, Clock, Zap, Loader2, Check, TrendingUp, ChevronDown, Copy, AlertTriangle,
} from 'lucide-react'

const COINS = [
  { id: 'BTC',  label: 'Bitcoin',  symbol: 'BTC',  logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/btc.png',  rate: 98_450_000 },
  { id: 'ETH',  label: 'Ethereum', symbol: 'ETH',  logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/eth.png',  rate: 5_320_000  },
  { id: 'USDT', label: 'Tether',   symbol: 'USDT', logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/usdt.png', rate: 1_620      },
  { id: 'BNB',  label: 'BNB',      symbol: 'BNB',  logo: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/bnb.png',  rate: 950_000    },
]

const WALLET_ADDRESSES = {
  BTC:  { address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', network: 'Bitcoin (BTC)' },
  ETH:  { address: '0x742d35Cc6634C0532925a3b8D4C9b91A0b5e5b45',  network: 'Ethereum (ERC-20)' },
  USDT: { address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',          network: 'TRON (TRC-20)' },
  BNB:  { address: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',  network: 'BNB Chain (BEP-20)' },
}

const RECENT = [
  { id: 'r1', coin: 'BTC',  amount: 0.0012, ngn: 118_140, when: 'Today · 10:22' },
  { id: 'r2', coin: 'USDT', amount: 500,    ngn: 810_000, when: 'Yesterday'      },
  { id: 'r3', coin: 'ETH',  amount: 0.05,   ngn: 266_000, when: 'May 20'         },
]

const FEE_RATE = 0.005

function fmtNGN(n) {
  return '₦' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtCoin(n, symbol) {
  const decimals = symbol === 'USDT' ? 2 : 6
  return `${Number(n).toFixed(decimals)} ${symbol}`
}

export default function DesktopCryptoExchange() {
  const [coin, setCoin]         = useState(COINS[0])
  const [amount, setAmount]     = useState('')
  const [coinOpen, setCoinOpen] = useState(false)
  const [status, setStatus]     = useState('idle')   // idle | generating | address | sent
  const [copied, setCopied]     = useState(false)

  const num    = parseFloat(String(amount).replace(/[^\d.]/g, '')) || 0
  const fee    = num * FEE_RATE
  const net    = num - fee
  const ngnOut = net * coin.rate

  const canSubmit = num > 0 && status === 'idle'
  const wallet    = WALLET_ADDRESSES[coin.id]

  function handleAmountChange(e) {
    const raw     = e.target.value.replace(/[^\d.]/g, '')
    const parts   = raw.split('.')
    const cleaned = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : raw
    setAmount(cleaned)
  }

  function handleGetAddress() {
    if (!canSubmit) return
    setStatus('generating')
    setTimeout(() => setStatus('address'), 1200)
  }

  function handleSent() {
    setStatus('sent')
    setTimeout(() => { setStatus('idle'); setAmount('') }, 2000)
  }

  function handleCopy() {
    navigator.clipboard.writeText(wallet?.address ?? '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
            <Sparkles size={10} /> Crypto exchange
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">Sell Crypto for Naira</h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Send crypto to our wallet · receive Naira instantly · {(FEE_RATE * 100).toFixed(1)}% fee
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
          <ShieldCheck size={10} /> Live rates · refreshed every 30s
        </span>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">

          {/* Exchange card */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4 relative overflow-visible">

            {/* Coin selector */}
            <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px] mb-3">
              Select coin to sell
            </h2>

            <div className="relative mb-4">
              <button
                type="button"
                onClick={() => setCoinOpen(o => !o)}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] transition text-left"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] shrink-0">
                  <img src={coin.logo} alt={coin.symbol} className="w-6 h-6 object-contain" />
                </span>
                <div className="flex-1 leading-tight">
                  <p className="text-[12.5px] font-bold text-[var(--c-text)] m-0">{coin.label}</p>
                  <p className="text-[10px] text-[var(--c-text-muted)] m-0">{coin.symbol} · {fmtNGN(coin.rate)} / 1 {coin.symbol}</p>
                </div>
                <ChevronDown size={15} className={`text-[var(--c-text-muted)] transition-transform ${coinOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {coinOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 z-20 mt-1.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden"
                  >
                    {COINS.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { setCoin(c); setCoinOpen(false); setAmount(''); setStatus('idle') }}
                        className={[
                          'w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition hover:bg-[var(--c-surface-soft)]',
                          c.id === coin.id ? 'bg-[var(--c-accent-soft)]' : '',
                        ].join(' ')}
                      >
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--c-surface)] border border-[var(--c-border)] shrink-0">
                          <img src={c.logo} alt={c.symbol} className="w-5 h-5 object-contain" />
                        </span>
                        <div className="flex-1 leading-tight">
                          <p className="text-[12px] font-bold text-[var(--c-text)] m-0">{c.label}</p>
                          <p className="text-[10px] text-[var(--c-text-muted)] m-0">{fmtNGN(c.rate)} / 1 {c.symbol}</p>
                        </div>
                        {c.id === coin.id && (
                          <Check size={13} className="text-brand-accent shrink-0" strokeWidth={2.6} />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* You send */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">You send</h2>
              <span className="text-[10px] text-[var(--c-text-muted)] font-medium">from your external wallet</span>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2.5 items-stretch mb-4">
              <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition overflow-hidden">
                <div className="px-3 py-2.5">
                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">
                    Amount ({coin.symbol})
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
              <CoinBadge label={coin.symbol} />
            </div>

            {/* You receive */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">You receive</h2>
              <span className="text-[10px] text-brand-accent font-semibold">Estimated</span>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2.5 items-stretch">
              <div className="rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] overflow-hidden">
                <div className="px-3 py-2.5">
                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-brand-accent m-0">Naira (NGN)</p>
                  <p className="text-[22px] font-black tabular-nums tracking-[-0.4px] text-[var(--c-text)] m-0 mt-0.5 truncate">
                    {num > 0 ? fmtNGN(ngnOut) : '0.00'}
                  </p>
                </div>
              </div>
              <CoinBadge label="NGN" />
            </div>
          </article>

          {/* Recent */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                <Clock size={11} className="text-brand-accent" /> Recent exchanges
              </h3>
              <span className="text-[10px] text-[var(--c-text-muted)]">Last 30 days</span>
            </div>
            <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
              {RECENT.map(r => {
                const c = COINS.find(x => x.id === r.coin)
                return (
                  <li
                    key={r.id}
                    className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]"
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--c-surface)] border border-[var(--c-border)]">
                      <img src={c?.logo} alt={c?.symbol} className="w-5 h-5 object-contain" />
                    </span>
                    <div className="flex flex-col min-w-0 leading-tight">
                      <span className="text-[11.5px] font-semibold text-[var(--c-text)] truncate">
                        Sold {r.coin}
                      </span>
                      <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5 inline-flex items-center gap-0.5">
                        <Clock size={9} /> {r.when}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[var(--c-text-muted)] tabular-nums">
                      -{fmtCoin(r.amount, r.coin)}
                    </span>
                    <span className="text-[11.5px] font-bold tabular-nums whitespace-nowrap text-[var(--c-success)]">
                      +{fmtNGN(r.ngn)}
                    </span>
                  </li>
                )
              })}
            </ul>
          </article>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">

          {/* Order summary / Wallet address panel */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-accent-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)]">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)]">
                <Receipt size={12} className="text-brand-accent" />
                {status === 'address' || status === 'sent' ? 'Deposit address' : 'Order summary'}
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
              <AnimatePresence mode="wait">
                {(status === 'idle' || status === 'generating') && (
                  <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-2">
                    <SummaryRow label="Coin"     value={`${coin.label} (${coin.symbol})`} />
                    <SummaryRow label="Rate"     value={`${fmtNGN(coin.rate)} / 1 ${coin.symbol}`} mono />
                    <SummaryRow label="You send" value={num > 0 ? fmtCoin(num, coin.symbol) : '—'} bold />
                    <SummaryRow label={`Fee (${(FEE_RATE * 100).toFixed(1)}%)`} value={num > 0 ? fmtCoin(fee, coin.symbol) : '—'} muted />
                    <div className="border-t border-dashed border-[var(--c-border)] my-0.5" />
                    <SummaryRow label="You receive" value={num > 0 ? fmtNGN(ngnOut) : '—'} accent hint="Settles after confirmations" />

                    <div className="flex items-center justify-between mt-0.5 pt-2.5 border-t border-[var(--c-border)]">
                      <p className="text-[10px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">Total crypto in</p>
                      <p className="text-[15px] font-black tabular-nums text-[var(--c-text)] tracking-[-0.3px] m-0">
                        {num > 0 ? fmtCoin(num, coin.symbol) : '—'}
                      </p>
                    </div>
                  </motion.div>
                )}

                {(status === 'address' || status === 'sent') && (
                  <motion.div key="address" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0 mb-1.5">
                        Send to this address
                      </p>
                      <div className="flex items-center gap-2 bg-[var(--c-surface-soft)] border border-[var(--c-border)] rounded-xl px-3 py-2.5">
                        <p className="flex-1 min-w-0 m-0 text-[10px] font-mono text-[var(--c-text)] break-all leading-snug">
                          {wallet?.address}
                        </p>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent active:scale-90 transition"
                        >
                          {copied ? <Check size={12} strokeWidth={2.6} /> : <Copy size={12} />}
                        </button>
                      </div>
                      <p className="text-[9.5px] text-[var(--c-text-muted)] mt-1.5 m-0">{wallet?.network}</p>
                    </div>

                    <SummaryRow label="Send exactly"  value={fmtCoin(num, coin.symbol)} bold />
                    <SummaryRow label="You receive"   value={fmtNGN(ngnOut)} accent />

                    <div className="flex items-start gap-2 pt-2 border-t border-[var(--c-border)]">
                      <AlertTriangle size={11} className="text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-[var(--c-text-muted)] m-0 leading-snug">
                        Only send <strong className="text-[var(--c-text)]">{coin.symbol}</strong> on <strong className="text-[var(--c-text)]">{wallet?.network}</strong>. Wrong network = lost funds.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action button */}
              <button
                type="button"
                disabled={(!canSubmit && status === 'idle') || status === 'generating' || status === 'sent'}
                onClick={status === 'address' ? handleSent : handleGetAddress}
                className={[
                  'relative overflow-hidden inline-flex items-center justify-center gap-2 w-full h-10 rounded-xl text-[12px] font-bold tracking-[0.2px] transition active:scale-[0.99] mt-2',
                  status === 'sent'
                    ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
                    : (canSubmit || status === 'address')
                      ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_6px_18px_-6px_rgba(201,162,39,0.5)] hover:-translate-y-px'
                      : 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)] cursor-not-allowed',
                ].join(' ')}
              >
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.span key="idle" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-2">
                      <Zap size={13} strokeWidth={2.6} />
                      {num > 0 ? 'Get Wallet Address' : 'Enter an amount'}
                    </motion.span>
                  )}
                  {status === 'generating' && (
                    <motion.span key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                        <Loader2 size={13} strokeWidth={2.6} />
                      </motion.span>
                      Generating address…
                    </motion.span>
                  )}
                  {status === 'address' && (
                    <motion.span key="confirm" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-2">
                      <Check size={13} strokeWidth={2.6} /> I've sent the crypto
                    </motion.span>
                  )}
                  {status === 'sent' && (
                    <motion.span key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="inline-flex items-center gap-2">
                      <Check size={13} strokeWidth={3} /> Payment confirmed
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <p className="inline-flex items-center justify-center gap-1 text-[10px] text-[var(--c-text-muted)] mt-1">
                <ShieldCheck size={9} className="text-brand-accent" />
                Credited within 1–3 network confirmations
              </p>
            </div>
          </article>

          {/* Live rates */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)] mb-3">
              <TrendingUp size={11} className="text-brand-accent" /> Live rates
            </h3>
            <div className="flex flex-col gap-1.5">
              {COINS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { setCoin(c); setAmount(''); setStatus('idle') }}
                  className={[
                    'grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2.5 rounded-xl border transition text-left active:scale-[0.98]',
                    c.id === coin.id
                      ? 'bg-[var(--c-accent-soft)] border-[var(--c-accent-border)]'
                      : 'bg-[var(--c-surface-soft)] border-[var(--c-border-soft)] hover:border-[var(--c-accent-border)]',
                  ].join(' ')}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--c-surface)] border border-[var(--c-border)] shrink-0">
                    <img src={c.logo} alt={c.symbol} className="w-5 h-5 object-contain" />
                  </span>
                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="text-[11.5px] font-bold text-[var(--c-text)]">{c.symbol}</span>
                    <span className="text-[10px] text-[var(--c-text-muted)]">{c.label}</span>
                  </div>
                  <span className="text-[12px] font-bold tabular-nums text-[var(--c-text)] shrink-0">
                    {fmtNGN(c.rate)}
                  </span>
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-[var(--c-border-soft)] bg-[var(--c-surface-soft)] p-3 flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
              <Bitcoin size={12} />
            </span>
            <div className="leading-snug">
              <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">P2P & Advanced trading</p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Need larger volumes? Use <span className="text-brand-accent font-semibold">Pro tools</span> for OTC & P2P trades.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

function CoinBadge({ label }) {
  return (
    <div className="inline-flex items-center justify-center px-3.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] shrink-0 min-w-[64px]">
      <span className="text-[12.5px] font-bold text-[var(--c-text)] tracking-[-0.1px]">{label}</span>
    </div>
  )
}

function SummaryRow({ label, value, mono, bold, accent, muted, hint }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[10.5px] text-[var(--c-text-muted)]">{label}</span>
      <span className={[
        'whitespace-nowrap text-right',
        mono   ? 'font-mono text-[11.5px]'                  : 'text-[11.5px]',
        bold   ? 'font-bold text-[var(--c-text)]'           : '',
        accent ? 'font-bold text-brand-accent'              : '',
        muted  ? 'text-[var(--c-text-muted)] font-semibold' : '',
        !bold && !accent && !muted ? 'font-semibold text-[var(--c-text)]' : '',
      ].join(' ')}>
        {value}
        {hint && <span className="block text-[9.5px] text-[var(--c-text-muted)] font-medium mt-0.5">{hint}</span>}
      </span>
    </div>
  )
}
