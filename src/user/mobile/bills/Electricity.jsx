import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Sparkles, Check, ShieldCheck, Info, X, Zap, Copy, AlertCircle, Loader2,
} from 'lucide-react'
import { CATEGORIES, PROVIDERS, PRESETS, METER_TYPES, formatNGN } from './constants'
import PinModal from '../../../components/ui/PinModal'
import BottomSheet, { SheetRow } from '../../../components/internalUI/BottomSheet'
import useBills from '../../../hooks/useBills'
import { useAlert } from '../../../components/ui/Alert'
import useUser from '../../../hooks/useUser'

export default function PaymentForm({ categoryId, onBack }) {
  const cat = CATEGORIES.find(c => c.id === categoryId)
  const providers = PROVIDERS[categoryId] || []
  const isElec = categoryId === 'electricity'

  const bills = useBills()
  const { alert } = useAlert()
  const { user } = useUser()

  const phone = user?.phone_number || ''

  const [providerId, setProviderId] = useState(null)
  const [meterType, setMeterType] = useState('prepaid')
  const [account, setAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [copied, setCopied] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [pinOpen, setPinOpen] = useState(false)
  const [pinError, setPinError] = useState(null)

  const provider = providers.find(p => p.id === providerId)
  const num = Number(amount) || 0

  const status = bills.buying ? 'processing' : bills.token ? 'done' : 'idle'

  // Field validity
  const validAccount = isElec
    ? account.length >= 6 && bills.verifyStatus !== 'invalid'
    : account.length >= 6
  const minAmount = bills.minimumAmount ?? provider?.minAmount ?? 1000
  const validAmount = num >= minAmount && num <= 100000
  const ready = !!provider && validAccount && validAmount && (isElec ? bills.verifyStatus === 'found' : true)

  // Trigger debounced verify whenever inputs change
  useEffect(() => {
    if (!isElec) return
    bills.verify({ billersCode: account, serviceID: provider?.serviceId, type: meterType })
  }, [account, provider?.serviceId, meterType, isElec])

  function pickProvider(id) {
    setProviderId(id)
    setAccount('')
    setAmount('')
    bills.resetVerify()
  }

  function handleAccount(e) {
    setAccount(e.target.value.replace(/\D/g, '').slice(0, 20))
  }

  function handleAmount(e) {
    setAmount(e.target.value.replace(/[^\d]/g, ''))
  }

  function handleCopy() {
    navigator.clipboard?.writeText(bills.token.replace(/\s/g, '')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
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
      result = isElec
        ? await bills.buy({ billersCode: account, serviceID: provider.serviceId, variation_code: meterType, amount: num, pin, phone })
        : await bills.buy({ billersCode: account, serviceID: '', variation_code: '', amount: num, pin, phone })
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
    bills.reset()
    setProviderId(null)
    setAccount('')
    setAmount('')
    onBack()
  }

  const Icon = cat.icon

  return (
    <>
    <div className="flex flex-col gap-3.5">

      {/* Top bar: back + step badge */}
      <div className="flex items-center justify-between -mt-1">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition"
        >
          <ChevronLeft size={12} /> Back
        </button>
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--c-surface)] border border-[var(--c-border)] text-[9px] font-bold text-[var(--c-text-muted)]">
          <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[7px] font-black">
            2
          </span>
          Step 2 of 2
        </span>
      </div>

      {/* Category header card */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-3.5">
        <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full bg-brand-accent/[0.10] blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-[13px] bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_4px_14px_rgba(201,162,39,0.35)] shrink-0">
            <Icon size={19} strokeWidth={2.1} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
              <Sparkles size={8} /> {cat.label}
            </p>
            <h1 className="text-[17px] font-black tracking-[-0.4px] text-[var(--c-text)] m-0 leading-tight">
              Pay {cat.label}
            </h1>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[8.5px] font-bold uppercase tracking-[0.7px] text-brand-accent">
            <ShieldCheck size={9} /> Secure
          </span>
        </div>
      </div>

      {/* ── Section 1: Choose DISCO / provider ── */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-0.5">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[8px] font-black shrink-0">
            1
          </span>
          <h3 className="text-[11px] font-bold text-[var(--c-text)] m-0 tracking-[-0.1px]">
            {isElec ? 'Choose DISCO' : 'Choose provider'}
          </h3>
          <span className="ml-auto text-[9px] text-[var(--c-text-muted)] font-medium">
            {providers.length} {isElec ? 'DISCOs' : 'available'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {providers.map(p => {
            const active = providerId === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => pickProvider(p.id)}
                className={[
                  'group relative overflow-hidden flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all duration-200 active:scale-[0.95]',
                  active
                    ? 'bg-gradient-to-b from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border-2 border-brand-accent shadow-[0_0_0_3px_rgba(201,162,39,0.12),0_4px_14px_rgba(201,162,39,0.20)]'
                    : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                ].join(' ')}
              >
                {active && <span aria-hidden className="pointer-events-none absolute inset-0 bg-brand-accent/[0.03] rounded-xl" />}
                <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <img src={p.logo} alt={p.label} className="w-full h-full object-contain rounded-full" />
                </span>
                <span className="relative text-[8.5px] font-bold text-[var(--c-text)] leading-tight text-center truncate max-w-full px-0.5">
                  {p.label}
                </span>
                {active && (
                  <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-brand-accent text-brand-primary shadow-[0_1px_4px_rgba(201,162,39,0.5)]">
                    <Check size={7} strokeWidth={3.5} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Sections 2 & 3 animate in after provider chosen ── */}
      <AnimatePresence mode="wait">
        {provider && (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3.5"
          >
            {/* ── Section 2: Meter details / Account ── */}
            <section className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-0.5">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[8px] font-black shrink-0">
                  2
                </span>
                <h3 className="text-[11px] font-bold text-[var(--c-text)] m-0 tracking-[-0.1px]">
                  {isElec ? 'Meter details' : 'Account details'}
                </h3>
              </div>

              {/* Electricity: prepaid / postpaid cards */}
              {isElec && (
                <div className="grid grid-cols-2 gap-2">
                  {METER_TYPES.map(m => {
                    const active = meterType === m.id
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMeterType(m.id)}
                        className={[
                          'relative overflow-hidden flex flex-col gap-1.5 p-3 rounded-2xl text-left transition-all duration-200 active:scale-[0.97]',
                          active
                            ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.28)]'
                            : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                        ].join(' ')}
                      >
                        {active && <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/[0.15] blur-xl" />}
                        <span className="text-[18px] leading-none">{m.id === 'prepaid' ? '⚡' : '📋'}</span>
                        <p className={['text-[12px] font-black m-0 leading-tight', active ? 'text-brand-primary' : 'text-[var(--c-text)]'].join(' ')}>
                          {m.label}
                        </p>
                        <p className={['text-[9px] m-0 font-semibold leading-snug', active ? 'text-brand-primary/70' : 'text-[var(--c-text-muted)]'].join(' ')}>
                          {m.id === 'prepaid' ? 'Get token via SMS' : 'Pay monthly bill'}
                        </p>
                        {active && (
                          <span className="absolute top-2 right-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-primary/20 text-brand-primary">
                            <Check size={9} strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Account / meter number input */}
              <div className={[
                'relative rounded-2xl bg-[var(--c-surface)] border transition-all duration-200 overflow-hidden',
                bills.verifyStatus === 'invalid'
                  ? 'border-[var(--c-error,#ef4444)] shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                  : 'border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)]',
              ].join(' ')}>
                <span aria-hidden className="pointer-events-none absolute -top-5 -right-5 w-20 h-20 rounded-full bg-brand-accent/[0.07] blur-2xl" />
                <div className="relative flex items-center gap-2.5 p-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] shrink-0">
                    <img src={provider.logo} alt={provider.label} className="w-full h-full object-contain rounded-full" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8.5px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)] m-0 mb-0.5">
                      {cat.accountLabel}
                    </p>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={account}
                      onChange={handleAccount}
                      placeholder={cat.accountPlaceholder}
                      className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[15px] font-black tabular-nums tracking-[0.5px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-semibold placeholder:tracking-normal"
                      style={{ boxShadow: 'none', WebkitTapHighlightColor: 'transparent' }}
                    />

                    {/* Verification feedback */}
                    {isElec && account.length >= 6 && (
                      <AnimatePresence mode="wait">
                        {bills.verifyStatus === 'loading' && (
                          <motion.p
                            key="loading"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 3 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-[9.5px] text-[var(--c-text-muted)] m-0 inline-flex items-center gap-1 overflow-hidden"
                          >
                            <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                              <Loader2 size={8} />
                            </motion.span>
                            Verifying meter…
                          </motion.p>
                        )}
                        {bills.verifyStatus === 'found' && bills.customerName && (
                          <motion.div
                            key="found"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 3 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden"
                          >
                            <p className="text-[9.5px] font-bold text-[var(--c-success)] m-0 inline-flex items-center gap-1">
                              <Check size={8} strokeWidth={3} /> {bills.customerName}
                            </p>
                            {bills.customerAddress && (
                              <p className="text-[8.5px] text-[var(--c-text-muted)] m-0 truncate">{bills.customerAddress}</p>
                            )}
                          </motion.div>
                        )}
                        {bills.verifyStatus === 'invalid' && (
                          <motion.p
                            key="invalid"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 3 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-[9.5px] font-bold text-[var(--c-error,#ef4444)] m-0 inline-flex items-center gap-1 overflow-hidden"
                          >
                            <AlertCircle size={8} /> Invalid meter number
                          </motion.p>
                        )}
                      </AnimatePresence>
                    )}

                    {/* Non-electricity: basic length hint */}
                    {!isElec && account.length > 0 && account.length < 6 && (
                      <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 mt-1 inline-flex items-center gap-1">
                        <Info size={9} className="text-brand-accent" /> Keep typing — minimum 6 digits.
                      </p>
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {account && (
                      <motion.button
                        key="clear"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.15 }}
                        type="button"
                        onClick={() => { setAccount(''); bills.resetVerify() }}
                        aria-label="Clear"
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
                      >
                        <X size={11} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* ── Section 3: Amount ── */}
            <section className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-0.5">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[8px] font-black shrink-0">
                  3
                </span>
                <h3 className="text-[11px] font-bold text-[var(--c-text)] m-0 tracking-[-0.1px]">Amount</h3>
                <AnimatePresence initial={false}>
                  {num > 0 && (
                    <motion.span
                      key={`amt-${num}`}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.15 }}
                      className="ml-auto text-[9.5px] font-black text-brand-accent tabular-nums"
                    >
                      {formatNGN(num)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {PRESETS.map(v => {
                  const active = num === v
                  const belowMin = v < minAmount
                  return (
                    <button
                      key={v}
                      type="button"
                      disabled={belowMin}
                      onClick={() => setAmount(String(v))}
                      className={[
                        'relative overflow-hidden flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl text-center transition-all duration-150',
                        belowMin
                          ? 'opacity-30 cursor-not-allowed bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text-muted)]'
                          : active
                            ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_12px_rgba(201,162,39,0.32)] active:scale-[0.96]'
                            : 'bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text)] hover:border-[var(--c-accent-border)] active:scale-[0.96]',
                      ].join(' ')}
                    >
                      <span className={['text-[7.5px] font-bold uppercase tracking-[0.8px]', active ? 'text-brand-primary/70' : 'text-[var(--c-text-muted)]'].join(' ')}>NGN</span>
                      <span className="text-[13px] font-black tabular-nums tracking-[-0.3px]">{v.toLocaleString('en-NG')}</span>
                    </button>
                  )
                })}
              </div>

              <div className="relative rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition-all duration-200 overflow-hidden">
                <span aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand-accent/[0.08] blur-2xl" />
                <div className="relative flex items-center gap-2.5 p-2.5">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent text-[14px] font-black shrink-0">₦</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount ? Number(amount).toLocaleString('en-NG') : ''}
                    onChange={handleAmount}
                    placeholder="Custom amount"
                    className="flex-1 min-w-0 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[15px] font-black tracking-[-0.2px] tabular-nums text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-semibold placeholder:tracking-normal"
                    style={{ boxShadow: 'none', WebkitTapHighlightColor: 'transparent' }}
                  />
                </div>
              </div>

              {isElec && (
                <p className="text-[9px] text-[var(--c-text-muted)] m-0 px-0.5">
                  Min {formatNGN(minAmount)}
                  {provider?.bandAMinAmount ? ` (Band A: ${formatNGN(provider.bandAMinAmount)})` : ''}
                  {' '}· Max ₦100,000 per transaction
                </p>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pre-pay summary card ── */}
      <AnimatePresence>
        {ready && status === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--c-accent-soft-2)] via-[var(--c-surface)] to-[var(--c-surface)] border border-[var(--c-accent-border)] p-3"
          >
            <span aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full bg-brand-accent/[0.18] blur-2xl" />
            <p className="relative text-[8.5px] uppercase tracking-[1.2px] text-brand-accent font-black m-0 mb-2 inline-flex items-center gap-1">
              <Zap size={8} strokeWidth={2.8} /> Review payment
            </p>
            <div className="relative flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] shrink-0">
                <img src={provider?.logo} alt={provider?.label} className="w-full h-full object-contain rounded-full" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-[11px] font-bold text-[var(--c-text)] m-0 leading-tight">{provider?.label}</p>
                  {provider?.serviceId && (
                    <span className="text-[7.5px] font-bold font-mono text-[var(--c-text-muted)] bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] px-1.5 py-0.5 rounded-md tracking-[0.3px]">
                      {provider.serviceId}
                    </span>
                  )}
                </div>
                <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 font-mono tabular-nums truncate">{account}</p>
                {isElec && (
                  <p className="text-[9px] text-[var(--c-text-muted)] m-0 font-semibold">
                    {meterType === 'prepaid' ? '⚡ Prepaid' : '📋 Postpaid'}
                  </p>
                )}
                {bills.customerName && (
                  <p className="text-[9px] text-[var(--c-success)] m-0 font-bold inline-flex items-center gap-0.5">
                    <Check size={7} strokeWidth={3} /> {bills.customerName}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-[19px] font-black text-brand-accent m-0 leading-tight tabular-nums tracking-[-0.5px]">{formatNGN(num)}</p>
                <p className="text-[8px] text-[var(--c-text-muted)] m-0 font-bold uppercase tracking-[0.6px]">Total</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Proceed button ── */}
      <button
        type="button"
        disabled={!ready}
        onClick={openSheet}
        className={[
          'inline-flex items-center justify-center gap-2 w-full h-12 rounded-2xl text-[13px] font-black tracking-[0.3px] transition-all duration-200 active:scale-[0.99]',
          ready
            ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_8px_24px_-4px_rgba(201,162,39,0.55)]'
            : 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)] cursor-not-allowed',
        ].join(' ')}
      >
        Proceed
      </button>

      {/* ── Info box ── */}
      <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] p-2.5 flex items-start gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
          <Info size={11} />
        </span>
        <div className="leading-snug">
          <p className="text-[10.5px] font-semibold text-[var(--c-text)] m-0">Receipts auto-saved</p>
          <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Find tokens & receipts in <span className="text-brand-accent font-semibold">Transactions</span> for the next 7 years.
          </p>
        </div>
      </div>

      <p className="inline-flex items-center justify-center gap-1 text-[9.5px] text-[var(--c-text-muted)] mt-0.5 mb-1">
        <ShieldCheck size={10} className="text-brand-accent" />
        Secured by VeloxZap · Verified billers
      </p>
    </div>

    <BottomSheet
      open={sheetOpen}
      onClose={() => {
        if (status === 'processing') return
        if (status === 'done') { handleDone(); return }
        setSheetOpen(false)
      }}
      label={status === 'done' ? 'Payment successful' : 'Order summary'}
      title={status === 'processing' ? undefined : status === 'done' ? 'Token Generated!' : `Pay ${cat?.label}`}
      closeOnScrimClick={status === 'idle'}
      maxHeight="90vh"
    >
      <AnimatePresence mode="wait" initial={false}>

        {/* ── Processing ── */}
        {status === 'processing' && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-3 px-4 py-12"
          >
            <Loader2 size={32} className="animate-spin text-brand-accent" />
            <p className="text-[14px] font-semibold text-[var(--c-text-muted)] m-0">Processing payment…</p>
          </motion.div>
        )}

        {/* ── Success ── */}
        {status === 'done' && (
          <motion.div key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4 px-4 py-8 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}
            >
              <Check size={30} strokeWidth={2.5} style={{ color: '#10b981' }} />
            </motion.div>

            <div className="text-center">
              <p className="text-[17px] font-bold text-[var(--c-text)] m-0">Payment Successful!</p>
              <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1">
                {phone ? <>Token sent to <span className="font-bold text-[var(--c-text)]">{phone}</span></> : 'Sent to your registered phone number'}
              </p>
            </div>

            <div className="w-full rounded-[14px] overflow-hidden" style={{ border: '1px solid var(--c-border)' }}>
              {/* Token */}
              <div className="px-4 py-3.5 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                <p className="text-[9.5px] font-bold uppercase tracking-[1.2px] m-0 mb-2" style={{ color: '#10b981' }}>
                  {meterType === 'prepaid' ? 'Recharge token' : 'Payment reference'}
                </p>
                <p className="text-[18px] font-black font-mono tabular-nums tracking-[3px] text-[var(--c-text)] m-0 leading-tight break-all">
                  {bills.token}
                </p>
              </div>
              {/* Provider */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                <span className="text-[11.5px] text-[var(--c-text-muted)]">Provider</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border border-[var(--c-border)] overflow-hidden shrink-0">
                    <img src={provider?.logo} alt={provider?.label} className="w-full h-full object-contain rounded-full" />
                  </span>
                  <span className="text-[12px] font-bold text-[var(--c-text)]">{provider?.label}</span>
                </div>
              </div>
              {/* Meter */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                <span className="text-[11.5px] text-[var(--c-text-muted)]">Meter</span>
                <span className="text-[12px] font-bold font-mono text-[var(--c-text)]">{account}</span>
              </div>
              {/* Customer */}
              {bills.customerName && (
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                  <span className="text-[11.5px] text-[var(--c-text-muted)]">Customer</span>
                  <span className="text-[12px] font-bold" style={{ color: '#10b981' }}>{bills.customerName}</span>
                </div>
              )}
              {/* Amount */}
              <div className="flex items-center justify-between px-4 py-3.5" style={{ background: 'rgba(16,185,129,0.06)' }}>
                <span className="text-[12.5px] font-bold text-[var(--c-text)]">Amount paid</span>
                <span className="text-[16px] font-black tabular-nums" style={{ color: '#10b981' }}>{formatNGN(num)}</span>
              </div>
            </div>

            <div className="w-full flex gap-3">
              <motion.button type="button" onClick={handleCopy} whileTap={{ scale: 0.97 }}
                className="flex-1 h-[50px] rounded-[16px] flex items-center justify-center gap-2 font-bold text-[14px]"
                style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', boxShadow: '0 6px 20px -4px rgba(201,162,39,0.5)' }}
              >
                {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy token'}
              </motion.button>
              <motion.button type="button" onClick={handleDone} whileTap={{ scale: 0.97 }}
                className="flex-1 h-[50px] rounded-[16px] font-bold text-[14px]"
                style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border)', color: 'var(--c-text-muted)' }}
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── Order summary ── */}
        {status === 'idle' && (
          <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <div className="mx-4 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[var(--c-border)] shrink-0 overflow-hidden p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                <img src={provider?.logo} alt={provider?.label} className="w-full h-full object-contain rounded-full" />
              </span>
              <div className="min-w-0 leading-tight flex-1">
                <p className="text-[15px] font-black tabular-nums tracking-[0.2px] text-[var(--c-text)] m-0">{provider?.label}</p>
                <p className="text-[11px] font-semibold text-[var(--c-text-muted)] m-0 mt-0.5 font-mono truncate">{account}</p>
                {isElec && (
                  <p className="text-[10.5px] font-semibold text-[var(--c-text-muted)] m-0 mt-0.5">
                    {meterType === 'prepaid' ? '⚡ Prepaid' : '📋 Postpaid'}
                    {bills.customerName ? ` · ${bills.customerName}` : ''}
                  </p>
                )}
              </div>
            </div>

            <div className="mx-4 mt-3 flex flex-col rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
              {phone && <SheetRow label="Phone" value={phone} muted />}
              <SheetRow label={cat?.label ?? 'Amount'} value={formatNGN(num)} />
              <SheetRow label="Fee" value="₦0.00" muted />
              <div className="h-px bg-[var(--c-border)]" />
              <SheetRow label="Total" value={formatNGN(num)} bold />
            </div>

            <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)]">
              <Info size={12} className="text-brand-accent shrink-0" />
              <p className="text-[10.5px] text-[var(--c-text-muted)] m-0">
                {isElec
                  ? <>Double-check the meter number — recharges are <span className="font-semibold text-[var(--c-text)]">non-refundable</span>.</>
                  : <>Verify the details above before confirming.</>}
              </p>
            </div>

            <div className="px-4 mt-4">
              <button type="button" onClick={() => setPinOpen(true)}
                className="relative overflow-hidden inline-flex items-center justify-center gap-2 w-full h-[52px] rounded-2xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[14px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_8px_28px_-8px_rgba(201,162,39,0.55)] active:scale-[0.99] transition"
              >
                <Zap size={16} strokeWidth={2.6} />
                Pay
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </BottomSheet>

    <PinModal
      open={pinOpen}
      title="Enter PIN"
      subtitle={`Confirm ${formatNGN(num)} ${isElec ? `electricity for meter ${account}` : `${cat?.label} payment`}`}
      loading={bills.buying}
      error={pinError}
      onConfirm={handlePinConfirm}
      onCancel={() => { setPinOpen(false); setPinError(null) }}
    />
    </>
  )
}

