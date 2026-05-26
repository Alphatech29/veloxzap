import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Check, ShieldCheck, Info, X, Volleyball,
  Loader2, ChevronLeft, Receipt,
} from 'lucide-react'
import { PROVIDERS, formatNGN } from './constants'
import useBetting from '../../../hooks/useBetting'
import { useAlert } from '../../../components/ui/Alert'
import PinModal from '../../../components/ui/PinModal'

const PRESETS = [200, 500, 1000, 2000, 5000, 10000]

function ProviderLogo({ provider, size = 'md' }) {
  const dim = size === 'lg' ? 'w-11 h-11' : size === 'sm' ? 'w-4 h-4' : 'w-10 h-10'
  const text = size === 'lg' ? 'text-[12px]' : size === 'sm' ? 'text-[8px]' : 'text-[11px]'
  if (provider?.logo) {
    return (
      <span className={`inline-flex items-center justify-center ${dim} rounded-full bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.05)]`}>
        <img src={provider.logo} alt={provider.label} className="w-full h-full object-cover rounded-full" />
      </span>
    )
  }
  return (
    <span className={`inline-flex items-center justify-center ${dim} rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary font-black ${text} shadow-[0_2px_8px_rgba(201,162,39,0.3)]`}>
      {provider?.label?.slice(0, 2).toUpperCase()}
    </span>
  )
}

export default function BettingForm({ onBack }) {
  const providers = PROVIDERS.betting
  const bet = useBetting()
  const { alert } = useAlert()

  const [providerId, setProviderId] = useState(null)
  const [accountId, setAccountId] = useState('')
  const [rawAmount, setRawAmount] = useState('')
  const [pinOpen, setPinOpen] = useState(false)
  const [pinError, setPinError] = useState(null)

  const provider = providers.find(p => p.id === providerId)
  const num = Number(rawAmount.replace(/,/g, '')) || 0
  const validated = !!bet.customerName
  const ready = !!provider && validated && num >= 100
  const status = bet.buying ? 'processing' : bet.reference ? 'done' : 'idle'

  function pickProvider(id) {
    setProviderId(id)
    setAccountId('')
    setRawAmount('')
    bet.resetValidation()
    bet.reset()
  }

  const validateTimerRef = useRef(null)

  useEffect(() => {
    clearTimeout(validateTimerRef.current)
    if (!provider || accountId.length < 3) {
      bet.resetValidation()
      return
    }
    validateTimerRef.current = setTimeout(() => {
      if (!bet.validating) {
        bet.validate({ serviceID: provider.serviceId, betting_number: accountId })
      }
    }, 700)
    return () => clearTimeout(validateTimerRef.current)
  }, [accountId, provider?.serviceId])

  function handleAmountInput(e) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setRawAmount(raw)
  }

  async function handlePinConfirm(pin) {
    setPinError(null)
    setPinOpen(false)
    const result = await bet.buy({
      serviceID: provider?.serviceId,
      billersCode: accountId,
      amount: num,
      pin,
    })
    if (!result?.success) {
      const msg = result?.message || 'Something went wrong. Please try again.'
      if (msg.toLowerCase().includes('pin')) {
        setPinError(msg)
        setPinOpen(true)
      } else {
        alert({ type: 'error', title: 'Payment failed', message: msg })
      }
    }
  }

  function handleDone() {
    bet.reset()
    setProviderId(null)
    setAccountId('')
    setRawAmount('')
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition mb-2"
          >
            <ChevronLeft size={13} /> All categories
          </button>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
            <Sparkles size={10} /> Betting
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">Fund Betting Wallet</h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">Top up your betting account instantly.</p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
          <ShieldCheck size={10} /> Verified billers
        </span>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">

        {/* ── Left: form ── */}
        <div className="flex flex-col gap-4">

          {/* Provider picker */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">Choose bookmaker</h2>
              <span className="text-[9.5px] text-[var(--c-text-muted)] tabular-nums">{providers.length} options</span>
            </div>
            <div className="grid grid-cols-3 min-[1100px]:grid-cols-5 gap-2">
              {providers.map(p => {
                const active = providerId === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pickProvider(p.id)}
                    className={[
                      'relative overflow-hidden flex flex-col items-center gap-2 p-3 rounded-xl transition active:scale-[0.96]',
                      active
                        ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border-strong)]'
                        : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                    ].join(' ')}
                  >
                    {active && <span aria-hidden className="pointer-events-none absolute -top-3 -right-3 w-10 h-10 rounded-full bg-brand-accent/[0.22] blur-xl" />}
                    <span className="relative">
                      <ProviderLogo provider={p} size="lg" />
                    </span>
                    <span className="relative text-[10px] font-bold text-[var(--c-text)] leading-tight text-center">{p.label}</span>
                    {active && (
                      <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-brand-accent text-brand-primary">
                        <Check size={8} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </article>

          <AnimatePresence mode="wait">
            {provider && (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col gap-4"
              >

                {/* Account ID input */}
                <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
                  <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px] mb-2">Account ID / Username</h2>
                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
                    {provider.label} user ID
                  </p>
                  <div className="relative rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition overflow-hidden">
                    <div className="relative flex items-center gap-2.5 p-2.5">
                      <span className="shrink-0">
                        <ProviderLogo provider={provider} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          inputMode="text"
                          value={accountId}
                          onChange={e => {
                            setAccountId(e.target.value.slice(0, 40))
                            bet.resetValidation()
                          }}
                          placeholder="Enter your account ID"
                          autoCapitalize="none"
                          autoComplete="off"
                          className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[14px] font-bold tracking-[0.2px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                          style={{ boxShadow: 'none' }}
                        />
                      </div>
                      <AnimatePresence initial={false}>
                        {accountId && (
                          <motion.button
                            key="clear"
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ duration: 0.15 }}
                            type="button"
                            onClick={() => { setAccountId(''); bet.resetValidation() }}
                            aria-label="Clear"
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-surface)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
                          >
                            <X size={12} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Validation feedback */}
                  <div className="mt-2">
                    <AnimatePresence initial={false} mode="wait">
                      {bet.validating ? (
                        <motion.div key="validating"
                          initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)]">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--c-surface)] border border-[var(--c-border)] shrink-0">
                              <Loader2 size={11} className="animate-spin text-[var(--c-text-muted)]" />
                            </span>
                            <div className="flex-1">
                              <p className="text-[8px] uppercase tracking-[0.8px] font-bold text-[var(--c-text-faint)] m-0 mb-0.5">Checking</p>
                              <p className="text-[11px] font-semibold text-[var(--c-text-muted)] m-0">Verifying account…</p>
                            </div>
                          </div>
                        </motion.div>
                      ) : bet.customerName ? (
                        <motion.div key="valid"
                          initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border"
                            style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.22)' }}
                          >
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full shrink-0"
                              style={{ background: 'rgba(16,185,129,0.15)', border: '1.5px solid rgba(16,185,129,0.35)' }}
                            >
                              <Check size={11} strokeWidth={3} style={{ color: '#10b981' }} />
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[8px] uppercase tracking-[0.8px] font-bold m-0 mb-0.5" style={{ color: 'rgba(16,185,129,0.65)' }}>Account verified</p>
                              <p className="text-[11.5px] font-black m-0 truncate" style={{ color: '#10b981' }}>{bet.customerName}</p>
                            </div>
                            <ShieldCheck size={14} className="shrink-0" style={{ color: 'rgba(16,185,129,0.45)' }} />
                          </div>
                        </motion.div>
                      ) : bet.validationError ? (
                        <motion.div key="invalid"
                          initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border"
                            style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}
                          >
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full shrink-0"
                              style={{ background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.25)' }}
                            >
                              <X size={11} strokeWidth={2.5} style={{ color: '#f87171' }} />
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[8px] uppercase tracking-[0.8px] font-bold m-0 mb-0.5" style={{ color: 'rgba(248,113,113,0.65)' }}>Not found</p>
                              <p className="text-[11px] font-semibold m-0 truncate" style={{ color: '#f87171' }}>{bet.validationError}</p>
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </article>

                {/* Amount */}
                <AnimatePresence>
                  {validated && (
                    <motion.article
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">Amount to fund</h2>
                        <span className="text-[9.5px] text-[var(--c-text-muted)]">Min ₦100</span>
                      </div>

                      <div className="relative rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition overflow-hidden mb-3">
                        <div className="flex items-center gap-2 px-3 py-2.5">
                          <span className="text-[20px] font-black text-[var(--c-text-muted)] shrink-0">₦</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={rawAmount}
                            onChange={handleAmountInput}
                            placeholder="0"
                            className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[22px] font-black tabular-nums text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] w-full"
                            style={{ boxShadow: 'none' }}
                          />
                          <AnimatePresence initial={false}>
                            {rawAmount && (
                              <motion.button
                                key="clear-amt"
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={{ duration: 0.15 }}
                                type="button"
                                onClick={() => setRawAmount('')}
                                aria-label="Clear"
                                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-surface)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
                              >
                                <X size={12} />
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        {PRESETS.map(p => {
                          const active = num === p
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setRawAmount(String(p))}
                              className={[
                                'relative flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all duration-150 active:scale-[0.95]',
                                active
                                  ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft shadow-[0_4px_12px_-2px_rgba(201,162,39,0.45)]'
                                  : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                              ].join(' ')}
                            >
                              {active && (
                                <span className="absolute top-1 right-1.5 inline-flex items-center justify-center w-3 h-3 rounded-full bg-brand-primary/20">
                                  <Check size={6} strokeWidth={3.5} className="text-brand-primary" />
                                </span>
                              )}
                              <span className={['text-[9px] font-semibold leading-none mb-0.5', active ? 'text-brand-primary/70' : 'text-[var(--c-text-faint)]'].join(' ')}>₦</span>
                              <span className={['text-[12px] font-black tabular-nums leading-none', active ? 'text-brand-primary' : 'text-[var(--c-text)]'].join(' ')}>
                                {p.toLocaleString('en-NG')}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </motion.article>
                  )}
                </AnimatePresence>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: summary / success ── */}
        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">
          <AnimatePresence mode="wait">

            {status === 'done' ? (
              <motion.div key="success"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <article className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--c-border)', background: 'var(--c-surface)' }}>
                  <div className="flex flex-col items-center gap-4 p-6">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}
                    >
                      <Check size={26} strokeWidth={2.5} style={{ color: '#10b981' }} />
                    </motion.div>

                    <div className="text-center">
                      <p className="text-[16px] font-bold text-[var(--c-text)] m-0">Wallet Funded!</p>
                      <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-1">
                        Your {provider?.label} account has been topped up.
                      </p>
                    </div>

                    <div className="w-full rounded-[12px] overflow-hidden" style={{ border: '1px solid var(--c-border)' }}>
                      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                        <span className="text-[11px] text-[var(--c-text-muted)]">Bookmaker</span>
                        <div className="flex items-center gap-1.5">
                          <ProviderLogo provider={provider} size="sm" />
                          <span className="text-[11.5px] font-bold text-[var(--c-text)]">{provider?.label}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                        <span className="text-[11px] text-[var(--c-text-muted)]">Account ID</span>
                        <span className="text-[11.5px] font-bold font-mono text-[var(--c-text)] max-w-[55%] text-right truncate">{accountId}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(16,185,129,0.06)' }}>
                        <span className="text-[12px] font-bold text-[var(--c-text)]">Amount funded</span>
                        <span className="text-[15px] font-black tabular-nums" style={{ color: '#10b981' }}>{formatNGN(num)}</span>
                      </div>
                    </div>

                    <motion.button type="button" onClick={handleDone} whileTap={{ scale: 0.97 }}
                      className="w-full h-[42px] rounded-[12px] flex items-center justify-center gap-2 font-bold text-[13px]"
                      style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', boxShadow: '0 6px 20px -4px rgba(201,162,39,0.5)' }}
                    >
                      <Check size={13} strokeWidth={3} /> Done
                    </motion.button>
                  </div>
                </article>
              </motion.div>
            ) : (
              <motion.div key="summary"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-accent-border)] overflow-hidden">
                  <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)]">
                    <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)]">
                      <Receipt size={12} className="text-brand-accent" /> Order summary
                    </h3>
                    {provider && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/70 border border-[var(--c-border-soft)] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[var(--c-text)]">
                        <ProviderLogo provider={provider} size="sm" />
                        {provider.label}
                      </span>
                    )}
                  </header>

                  <div className="p-4 flex flex-col gap-2">
                    {[
                      { label: 'Bookmaker', value: provider?.label || '—' },
                      { label: 'Account ID', value: accountId || '—', mono: true },
                      { label: 'Verified name', value: bet.customerName || '—' },
                      { label: 'Amount', value: num > 0 ? formatNGN(num) : '—', bold: true },
                    ].map((row, i) => (
                      <div key={i} className="flex items-baseline justify-between gap-2">
                        <span className="text-[10.5px] text-[var(--c-text-muted)] shrink-0">{row.label}</span>
                        <span className={[
                          'whitespace-nowrap text-right max-w-[60%] truncate text-[11.5px]',
                          row.mono ? 'font-mono' : '',
                          row.bold ? 'font-bold text-[var(--c-text)]' : 'font-semibold text-[var(--c-text)]',
                        ].join(' ')}>
                          {row.value}
                        </span>
                      </div>
                    ))}

                    <div className="flex items-center justify-between mt-0.5 pt-2.5 border-t border-[var(--c-border)]">
                      <p className="text-[10px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">Total</p>
                      <p className="text-[16px] font-black tabular-nums text-[var(--c-text)] tracking-[-0.3px] m-0">
                        {num > 0 ? formatNGN(num) : '₦0'}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!ready || status === 'processing'}
                      onClick={() => setPinOpen(true)}
                      className={[
                        'relative overflow-hidden inline-flex items-center justify-center gap-2 w-full h-10 rounded-xl text-[12px] font-bold tracking-[0.2px] transition active:scale-[0.99] mt-1.5',
                        ready && status === 'idle'
                          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_6px_18px_-6px_rgba(201,162,39,0.5)] hover:-translate-y-px'
                          : 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)] cursor-not-allowed',
                      ].join(' ')}
                    >
                      {status === 'processing' ? (
                        <>
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                            <Loader2 size={13} strokeWidth={2.6} />
                          </motion.span>
                          Processing…
                        </>
                      ) : (
                        <>

                          {ready
                            ? `Fund`
                            : !provider
                              ? 'Select a bookmaker'
                              : bet.validating
                                ? 'Verifying account…'
                                : !validated
                                  ? 'Enter & verify account ID'
                                  : num < 100
                                    ? 'Enter amount (min ₦100)'
                                    : 'Fund Wallet'}
                        </>
                      )}
                    </button>

                    <div className="flex items-start gap-1.5 px-1 mt-1">
                      <Info size={10} className="text-brand-accent shrink-0 mt-[1px]" />
                      <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 leading-snug">
                        Verify account ID — <span className="font-semibold text-[var(--c-text)]">non-refundable</span> once processed.
                      </p>
                    </div>
                  </div>
                </article>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </section>

      <PinModal
        open={pinOpen}
        title="Enter PIN"
        subtitle={`Confirm ${formatNGN(num)} for ${provider?.label || 'Betting'}`}
        loading={bet.buying}
        error={pinError}
        onConfirm={handlePinConfirm}
        onCancel={() => { setPinOpen(false); setPinError(null) }}
      />
    </div>
  )
}
