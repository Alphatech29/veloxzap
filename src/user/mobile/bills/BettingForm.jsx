import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Sparkles, Check, ShieldCheck, Info, X, Volleyball,
  Loader2, Search,
} from 'lucide-react'
import { PROVIDERS, formatNGN } from './constants'
import PinModal from '../../../components/ui/PinModal'
import BottomSheet, { SheetRow } from '../../../components/internalUI/BottomSheet'
import useBetting from '../../../hooks/useBetting'
import { useAlert } from '../../../components/ui/Alert'

const PRESETS = [200, 500, 1000, 2000, 5000, 10000]

function ProviderLogo({ provider, size = 'md' }) {
  const dim = size === 'lg' ? 'w-9 h-9' : size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'
  const text = size === 'lg' ? 'text-[11px]' : size === 'sm' ? 'text-[8px]' : 'text-[10px]'
  if (provider.logo) {
    return (
      <span className={`inline-flex items-center justify-center ${dim} rounded-full bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)]`}>
        <img src={provider.logo} alt={provider.label} className="w-full h-full object-cover rounded-full" />
      </span>
    )
  }
  return (
    <span className={`inline-flex items-center justify-center ${dim} rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary font-black ${text} shadow-[0_1px_4px_rgba(201,162,39,0.3)]`}>
      {provider.label.slice(0, 2).toUpperCase()}
    </span>
  )
}

const HOT_IDS = ['sportybet', 'betnaija', 'betway', 'betking']

export default function BettingForm({ onBack }) {
  const providers = PROVIDERS.betting
  const hotProviders = HOT_IDS.map(id => providers.find(p => p.id === id)).filter(Boolean)
  const bet = useBetting()
  const { alert } = useAlert()
  const [providerId, setProviderId] = useState('sportybet')
  const [accountId, setAccountId] = useState('')
  const [rawAmount, setRawAmount] = useState('')
  const [bookmakerSheetOpen, setBookmakerSheetOpen] = useState(false)
  const [bookmakerSearch, setBookmakerSearch] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
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
    setBookmakerSheetOpen(false)
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

  function openSheet() {
    if (!ready || status !== 'idle') return
    setSheetOpen(true)
  }

  async function handlePinConfirm(pin) {
    setPinError(null)
    setPinOpen(false)

    let result
    try {
      result = await bet.buy({
        serviceID: provider?.serviceId,
        billersCode: accountId,
        amount: num,
        pin,
      })
    } catch {
      alert({ type: 'error', title: 'Payment failed', message: 'Network error. Please try again.' })
      return
    }

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
    setSheetOpen(false)
    bet.reset()
    setProviderId('sportybet')
    setAccountId('')
    setRawAmount('')
    onBack()
  }

  return (
    <>
    <div className="flex flex-col gap-2.5">

      {/* Top bar */}
      <div className="flex items-center justify-between -mt-1">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition"
        >
          <ChevronLeft size={12} /> Back
        </button>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--c-surface)] border border-[var(--c-border)] text-[9px] font-bold text-[var(--c-text-muted)]">
          <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[7px] font-black">2</span>
          Step 2 of 2
        </span>
      </div>

      {/* Category header */}
      <div className="relative overflow-hidden rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-2.5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_3px_10px_rgba(201,162,39,0.3)] shrink-0">
            <Volleyball size={16} strokeWidth={2.1} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="inline-flex items-center gap-1 text-[8px] uppercase tracking-[1.2px] text-brand-accent font-bold m-0">
              <Sparkles size={7} /> Betting
            </p>
            <h1 className="text-[13px] font-semibold tracking-[-0.3px] text-[var(--c-text)] m-0 leading-tight">Fund Betting Wallet</h1>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[8px] font-bold uppercase tracking-[0.5px] text-brand-accent">
            <ShieldCheck size={8} /> Secure
          </span>
        </div>
      </div>

      {/* Section 1: Provider */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 px-0.5">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[8px] font-black shrink-0">1</span>
          <h3 className="text-[11px] font-bold text-[var(--c-text)] m-0">Choose bookmaker</h3>
          <span className="ml-auto text-[9px] text-[var(--c-text-muted)] font-medium">{providers.length} available</span>
        </div>

        {/* Hot picks */}
        <div className="grid grid-cols-4 gap-1">
          {hotProviders.map(p => {
            const active = providerId === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => pickProvider(p.id)}
                className={[
                  'relative overflow-hidden flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-200 active:scale-[0.95]',
                  active
                    ? 'bg-gradient-to-b from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border-2 border-brand-accent shadow-[0_0_0_2px_rgba(201,162,39,0.1)]'
                    : 'bg-[var(--c-surface)] border border-[var(--c-border)]',
                ].join(' ')}
              >
                <ProviderLogo provider={p} size="md" />
                <span className="text-[8.5px] font-bold text-[var(--c-text)] leading-tight text-center">{p.label}</span>
                {active && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center w-3 h-3 rounded-full bg-brand-accent text-brand-primary">
                    <Check size={6} strokeWidth={3.5} />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* See all trigger */}
        <button
          type="button"
          onClick={() => setBookmakerSheetOpen(true)}
          className={[
            'relative overflow-hidden flex items-center gap-2.5 w-full rounded-xl border transition-all duration-200 active:scale-[0.99] p-2.5',
            provider && !HOT_IDS.includes(provider.id)
              ? 'bg-gradient-to-r from-[var(--c-accent-soft-2)] to-[var(--c-surface)] border-brand-accent shadow-[0_0_0_2px_rgba(201,162,39,0.08)]'
              : 'bg-[var(--c-surface)] border-[var(--c-border)]',
          ].join(' ')}
        >
          {provider && !HOT_IDS.includes(provider.id) ? (
            <>
              <span className="shrink-0"><ProviderLogo provider={provider} size="sm" /></span>
              <div className="flex-1 min-w-0 text-left leading-tight">
                <p className="text-[7.5px] uppercase tracking-[1px] font-bold text-brand-accent m-0">Selected</p>
                <p className="text-[12px] font-black text-[var(--c-text)] m-0 truncate">{provider.label}</p>
              </div>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent shrink-0">
                <Check size={8} strokeWidth={3} />
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] shrink-0">
                <Volleyball size={12} strokeWidth={2} />
              </span>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[11px] font-semibold text-[var(--c-text-muted)] m-0">See all {providers.length} bookmakers</p>
              </div>
              <ChevronRight size={13} className="text-[var(--c-text-faint)] shrink-0" />
            </>
          )}
        </button>
      </section>

      {/* Sections 2+ */}
      <AnimatePresence mode="wait">
        {provider && (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-2.5"
          >

            {/* Section 2: Account ID */}
            <section className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 px-0.5">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[8px] font-black shrink-0">2</span>
                <h3 className="text-[11px] font-bold text-[var(--c-text)] m-0">Account ID / Username</h3>
              </div>

              <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_2px_rgba(201,162,39,0.10)] transition-all duration-200 overflow-hidden">
                <div className="flex items-center gap-2 p-2.5">
                  <span className="shrink-0">
                    <ProviderLogo provider={provider} size="sm" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] uppercase tracking-[0.8px] font-bold text-[var(--c-text-muted)] m-0 mb-0.5">
                      {provider.label} user ID
                    </p>
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
                      className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[13px] font-black tracking-[0.2px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-semibold placeholder:tracking-normal"
                      style={{ boxShadow: 'none', WebkitTapHighlightColor: 'transparent' }}
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
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
                      >
                        <X size={10} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Validation feedback */}
              <AnimatePresence initial={false} mode="wait">
                {bet.validating ? (
                  <motion.div key="validating"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
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
                    initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
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
                    initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
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
            </section>

            {/* Section 3: Amount */}
            <AnimatePresence>
              {validated && (
                <motion.section
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-1.5"
                >
                  <div className="flex items-center gap-1.5 px-0.5">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[8px] font-black shrink-0">3</span>
                    <h3 className="text-[11px] font-bold text-[var(--c-text)] m-0">Amount to fund</h3>
                    <span className="ml-auto text-[9px] text-[var(--c-text-muted)]">Min ₦100</span>
                  </div>

                  {/* Amount input */}
                  <div className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_2px_rgba(201,162,39,0.10)] transition-all duration-200 overflow-hidden">
                    <div className="flex items-center gap-1.5 px-3 py-2.5">
                      <span className="text-[18px] font-black text-[var(--c-text-muted)] shrink-0">₦</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={rawAmount}
                        onChange={handleAmountInput}
                        placeholder="0"
                        className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[22px] font-black tabular-nums text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] w-full"
                        style={{ boxShadow: 'none', WebkitTapHighlightColor: 'transparent' }}
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
                            aria-label="Clear amount"
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
                          >
                            <X size={10} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {PRESETS.map(p => {
                      const active = num === p
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setRawAmount(String(p))}
                          className={[
                            'relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-150 active:scale-[0.95]',
                            active
                              ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft shadow-[0_4px_12px_-2px_rgba(201,162,39,0.45)]'
                              : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                          ].join(' ')}
                        >
                          {active && (
                            <span className="absolute top-1 right-1.5 inline-flex items-center justify-center w-2.5 h-2.5 rounded-full bg-brand-primary/20">
                              <Check size={5} strokeWidth={3.5} className="text-brand-primary" />
                            </span>
                          )}
                          <span className={['text-[8px] font-semibold leading-none mb-0.5', active ? 'text-brand-primary/70' : 'text-[var(--c-text-faint)]'].join(' ')}>₦</span>
                          <span className={['text-[11px] font-black tabular-nums leading-none', active ? 'text-brand-primary' : 'text-[var(--c-text)]'].join(' ')}>
                            {p.toLocaleString('en-NG')}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-pay summary */}
      <AnimatePresence>
        {ready && status === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] via-[var(--c-surface)] to-[var(--c-surface)] border border-[var(--c-accent-border)] p-2.5"
          >
            <p className="text-[8px] uppercase tracking-[1px] text-brand-accent font-black m-0 mb-1.5 inline-flex items-center gap-1">
              <Volleyball size={7} strokeWidth={2.8} /> Review payment
            </p>
            <div className="flex items-center gap-2">
              <ProviderLogo provider={provider} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-[10.5px] font-bold text-[var(--c-text)] m-0 leading-tight">{provider?.label}</p>
                <p className="text-[9px] text-[var(--c-text-muted)] m-0 font-mono tabular-nums truncate">{accountId}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[16px] font-black text-brand-accent m-0 leading-tight tabular-nums tracking-[-0.5px]">{formatNGN(num)}</p>
                <p className="text-[7.5px] text-[var(--c-text-muted)] m-0 font-bold uppercase tracking-[0.5px]">Total</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proceed */}
      <button
        type="button"
        disabled={!ready}
        onClick={openSheet}
        className={[
          'inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl text-[12.5px] font-black tracking-[0.2px] transition-all duration-200 active:scale-[0.99]',
          ready
            ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_6px_18px_-4px_rgba(201,162,39,0.5)]'
            : 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)] cursor-not-allowed',
        ].join(' ')}
      >
        Proceed
      </button>

      {/* Info */}
      <div className="rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] px-2.5 py-2 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
          <Info size={10} />
        </span>
        <p className="text-[9.5px] text-[var(--c-text-muted)] m-0">
          <span className="font-semibold text-[var(--c-text)]">Instant funding</span> — Your {provider?.label || 'betting'} balance is credited within seconds.
        </p>
      </div>

      <p className="inline-flex items-center justify-center gap-1 text-[9px] text-[var(--c-text-muted)] mt-0 mb-1">
        <ShieldCheck size={9} className="text-brand-accent" />
        Secured by VeloxZap · Verified billers
      </p>
    </div>

    {/* ── Bookmaker picker sheet ── */}
    <BottomSheet
      open={bookmakerSheetOpen}
      onClose={() => { setBookmakerSheetOpen(false); setBookmakerSearch('') }}
      label="Bookmaker"
      title="Choose bookmaker"
      closeOnScrimClick
      maxHeight="85vh"
    >
      {/* Search */}
      <div className="px-3 pb-2 shrink-0">
        <div className="flex items-center gap-2 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] px-3 py-2 focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_2px_rgba(201,162,39,0.10)] transition-all duration-200">
          <Search size={13} className="text-[var(--c-text-muted)] shrink-0" />
          <input
            type="text"
            value={bookmakerSearch}
            onChange={e => setBookmakerSearch(e.target.value)}
            placeholder="Search bookmaker…"
            autoCapitalize="none"
            autoComplete="off"
            className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[12px] font-semibold text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-normal"
            style={{ boxShadow: 'none', WebkitTapHighlightColor: 'transparent' }}
          />
          {bookmakerSearch && (
            <button type="button" onClick={() => setBookmakerSearch('')} className="text-[var(--c-text-muted)] active:scale-90 transition shrink-0">
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="grid grid-cols-3 gap-1.5">
          {providers.filter(p => p.label.toLowerCase().includes(bookmakerSearch.toLowerCase())).map(p => {
            const active = providerId === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => pickProvider(p.id)}
                className={[
                  'relative overflow-hidden flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all duration-200 active:scale-[0.95]',
                  active
                    ? 'bg-gradient-to-b from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border-2 border-brand-accent shadow-[0_0_0_2px_rgba(201,162,39,0.1)]'
                    : 'bg-[var(--c-surface)] border border-[var(--c-border)]',
                ].join(' ')}
              >
                {active && <span aria-hidden className="pointer-events-none absolute inset-0 bg-brand-accent/[0.03] rounded-xl" />}
                <span className="relative"><ProviderLogo provider={p} size="md" /></span>
                <span className="relative text-[9px] font-bold text-[var(--c-text)] leading-tight text-center">{p.label}</span>
                {active && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center w-3 h-3 rounded-full bg-brand-accent text-brand-primary">
                    <Check size={6} strokeWidth={3.5} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {bookmakerSearch && providers.filter(p => p.label.toLowerCase().includes(bookmakerSearch.toLowerCase())).length === 0 && (
          <p className="text-center text-[11px] text-[var(--c-text-muted)] py-8">No bookmaker found for "{bookmakerSearch}"</p>
        )}
      </div>
    </BottomSheet>

    {/* ── Order summary sheet ── */}
    <BottomSheet
      open={sheetOpen}
      onClose={() => {
        if (status === 'processing') return
        if (status === 'done') { handleDone(); return }
        setSheetOpen(false)
      }}
      label={status === 'done' ? 'Wallet funded' : 'Order summary'}
      title={status === 'processing' ? undefined : status === 'done' ? 'All done!' : `Fund ${provider?.label || 'Betting'}`}
      closeOnScrimClick={status === 'idle'}
      maxHeight="90vh"
    >
      <AnimatePresence mode="wait" initial={false}>

        {status === 'processing' && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-3 px-4 py-10"
          >
            <Loader2 size={28} className="animate-spin text-brand-accent" />
            <p className="text-[13px] font-semibold text-[var(--c-text-muted)] m-0">Processing payment…</p>
          </motion.div>
        )}

        {status === 'done' && (
          <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3 px-4 py-6"
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}
            >
              <Check size={26} strokeWidth={2.5} style={{ color: '#10b981' }} />
            </motion.div>

            <div className="text-center">
              <p className="text-[15px] font-bold text-[var(--c-text)] m-0">Wallet Funded!</p>
              <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Your {provider?.label} account has been topped up.
              </p>
            </div>

            <div className="w-full rounded-[12px] overflow-hidden" style={{ border: '1px solid var(--c-border)' }}>
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                <span className="text-[11px] text-[var(--c-text-muted)]">Bookmaker</span>
                <div className="flex items-center gap-1.5">
                  <ProviderLogo provider={provider} size="sm" />
                  <span className="text-[11.5px] font-bold text-[var(--c-text)]">{provider?.label}</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                <span className="text-[11px] text-[var(--c-text-muted)]">Account ID</span>
                <span className="text-[11.5px] font-bold font-mono text-[var(--c-text)]">{accountId}</span>
              </div>
              <div className="flex items-center justify-between px-3.5 py-3" style={{ background: 'rgba(16,185,129,0.06)' }}>
                <span className="text-[12px] font-bold text-[var(--c-text)]">Amount funded</span>
                <span className="text-[15px] font-black tabular-nums" style={{ color: '#10b981' }}>{formatNGN(num)}</span>
              </div>
            </div>

            <motion.button type="button" onClick={handleDone} whileTap={{ scale: 0.97 }}
              className="w-full h-11 rounded-[14px] flex items-center justify-center gap-2 font-bold text-[13px]"
              style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', boxShadow: '0 5px 16px -4px rgba(201,162,39,0.5)' }}
            >
              <Check size={13} strokeWidth={3} /> Done
            </motion.button>
          </motion.div>
        )}

        {status === 'idle' && (
          <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <div className="mx-4 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-3 flex items-center gap-2.5">
              <span className="shrink-0">
                <ProviderLogo provider={provider} size="md" />
              </span>
              <div className="min-w-0 leading-tight flex-1">
                <p className="text-[13.5px] font-black text-[var(--c-text)] m-0">{provider?.label}</p>
                <p className="text-[10.5px] font-semibold text-[var(--c-text-muted)] m-0 mt-0.5 font-mono truncate">{accountId}</p>
              </div>
            </div>

            <div className="mx-4 mt-2.5 flex flex-col rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">

              <SheetRow label="Account ID" value={accountId} />
              <SheetRow label="Fee" value="₦0.00" muted />
              <div className="h-px bg-[var(--c-border)]" />
              <SheetRow label="Total" value={formatNGN(num)} bold />
            </div>

            <div className="mx-4 mt-2.5 flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)]">
              <Info size={11} className="text-brand-accent shrink-0" />
              <p className="text-[10px] text-[var(--c-text-muted)] m-0">
                Verify your account ID — <span className="font-semibold text-[var(--c-text)]">non-refundable</span> once processed.
              </p>
            </div>

            <div className="px-4 mt-3 mb-1">
              <button type="button" onClick={() => setPinOpen(true)}
                className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[13px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_6px_20px_-6px_rgba(201,162,39,0.55)] active:scale-[0.99] transition"
              >

                Fund Wallet
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </BottomSheet>

    <PinModal
      open={pinOpen}
      title="Enter PIN"
      subtitle={`Confirm ${formatNGN(num)} for ${provider?.label || 'Betting'}`}
      loading={bet.buying}
      error={pinError}
      onConfirm={handlePinConfirm}
      onCancel={() => { setPinOpen(false); setPinError(null) }}
    />
    </>
  )
}
