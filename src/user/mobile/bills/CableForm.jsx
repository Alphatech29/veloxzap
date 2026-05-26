import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronDown, Sparkles, Check, ShieldCheck, Info, X, Tv,
  AlertCircle, Loader2, RefreshCw,
} from 'lucide-react'
import { PROVIDERS, formatNGN } from './constants'
import PinModal from '../../../components/ui/PinModal'
import BottomSheet, { SheetRow } from '../../../components/internalUI/BottomSheet'
import useCable from '../../../hooks/useCable'
import { useAlert } from '../../../components/ui/Alert'
import useUser from '../../../hooks/useUser'

export default function CableForm({ onBack }) {
  const providers = PROVIDERS.cable
  const cable = useCable()
  const { alert } = useAlert()
  const { user } = useUser()

  const phone = user?.phone_number || ''

  const [providerId, setProviderId] = useState(null)
  const [smartcard, setSmartcard] = useState('')
  const [action, setAction] = useState(null)
  const [selectedVariation, setSelectedVariation] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [planSheetOpen, setPlanSheetOpen] = useState(false)
  const [pinOpen, setPinOpen] = useState(false)
  const [pinError, setPinError] = useState(null)

  const provider = providers.find(p => p.id === providerId)

  // Find the renew variation by matching currentBouquet name
  const renewVariation = cable.variations.find(v =>
    v.name?.toLowerCase().includes(cable.currentBouquet?.toLowerCase()) ||
    cable.currentBouquet?.toLowerCase().includes(v.name?.toLowerCase())
  ) || cable.variations[0]

  const bouquetForAction = action === 'renew' ? renewVariation : selectedVariation
  const amountForAction = action === 'renew' ? (cable.renewalAmount ?? bouquetForAction?.amount) : selectedVariation?.amount
  const num = Number(amountForAction) || 0

  const ready =
    !!provider &&
    cable.verifyStatus === 'found' &&
    !!action &&
    (action === 'renew' ? !!bouquetForAction : !!selectedVariation)

  const status = cable.buying ? 'processing' : cable.reference ? 'done' : 'idle'

  // Load variations when provider changes
  useEffect(() => {
    if (provider?.serviceId) {
      cable.loadVariations(provider.serviceId)
    }
  }, [provider?.serviceId])

  // Debounced smartcard verify
  useEffect(() => {
    cable.verify({ billersCode: smartcard, serviceID: provider?.serviceId })
  }, [smartcard, provider?.serviceId])

  function pickProvider(id) {
    setProviderId(id)
    setSmartcard('')
    setAction(null)
    setSelectedVariation(null)
    cable.reset()
  }

  function handleSmartcard(e) {
    setSmartcard(e.target.value.replace(/\D/g, '').slice(0, 20))
    setAction(null)
    setSelectedVariation(null)
  }

  function pickAction(a) {
    setAction(a)
    setSelectedVariation(null)
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
      result = await cable.buy({
        billersCode: smartcard,
        serviceID: provider?.serviceId,
        variation_code: bouquetForAction?.code,
        amount: num,
        phone,
        pin,
        action,
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
    cable.reset()
    setProviderId(null)
    setSmartcard('')
    setAction(null)
    setSelectedVariation(null)
    onBack()
  }

  return (
    <>
    <div className="flex flex-col gap-3.5">

      {/* Top bar */}
      <div className="flex items-center justify-between -mt-1">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition"
        >
          <ChevronLeft size={12} /> Back
        </button>
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--c-surface)] border border-[var(--c-border)] text-[9px] font-bold text-[var(--c-text-muted)]">
          <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[7px] font-black">2</span>
          Step 2 of 2
        </span>
      </div>

      {/* Category header */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-3.5">
        <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full bg-brand-accent/[0.10] blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-[13px] bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_4px_14px_rgba(201,162,39,0.35)] shrink-0">
            <Tv size={19} strokeWidth={2.1} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
              <Sparkles size={8} /> Cable TV
            </p>
            <h1 className="text-[14px] font-semibold tracking-[-0.4px] text-[var(--c-text)] m-0 leading-tight">Pay Cable TV</h1>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[8.5px] font-bold uppercase tracking-[0.7px] text-brand-accent">
            <ShieldCheck size={9} /> Secure
          </span>
        </div>
      </div>

      {/* Section 1: Provider */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-0.5">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[8px] font-black shrink-0">1</span>
          <h3 className="text-[11px] font-bold text-[var(--c-text)] m-0 tracking-[-0.1px]">Choose provider</h3>
          <span className="ml-auto text-[9px] text-[var(--c-text-muted)] font-medium">{providers.length} available</span>
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
                  <img src={p.logo} alt={p.label} className="w-full h-full object-cover rounded-full" />
                </span>
                <span className="relative text-[8.5px] font-bold text-[var(--c-text)] leading-tight text-center truncate max-w-full px-0.5">{p.label}</span>
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

      {/* Sections 2+ animate in after provider chosen */}
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

            {/* Section 2: Smartcard */}
            <section className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-0.5">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[8px] font-black shrink-0">2</span>
                <h3 className="text-[11px] font-bold text-[var(--c-text)] m-0 tracking-[-0.1px]">Smartcard number</h3>
              </div>

              <div className={[
                'relative rounded-2xl bg-[var(--c-surface)] border transition-all duration-200 overflow-hidden',
                cable.verifyStatus === 'invalid'
                  ? 'border-[var(--c-error,#ef4444)] shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                  : 'border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)]',
              ].join(' ')}>
                <span aria-hidden className="pointer-events-none absolute -top-5 -right-5 w-20 h-20 rounded-full bg-brand-accent/[0.07] blur-2xl" />
                <div className="relative flex items-center gap-2.5 p-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] shrink-0">
                    <img src={provider.logo} alt={provider.label} className="w-full h-full object-cover rounded-full" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8.5px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)] m-0 mb-0.5">Smartcard / IUC number</p>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={smartcard}
                      onChange={handleSmartcard}
                      placeholder="1234567890"
                      className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[15px] font-black tabular-nums tracking-[0.5px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-semibold placeholder:tracking-normal"
                      style={{ boxShadow: 'none', WebkitTapHighlightColor: 'transparent' }}
                    />

                    {/* Verify feedback */}
                    {smartcard.length >= 6 && (
                      <AnimatePresence mode="wait">
                        {cable.verifyStatus === 'loading' && (
                          <motion.p key="loading"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 3 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-[9.5px] text-[var(--c-text-muted)] m-0 inline-flex items-center gap-1 overflow-hidden"
                          >
                            <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                              <Loader2 size={8} />
                            </motion.span>
                            Verifying smartcard…
                          </motion.p>
                        )}
                        {cable.verifyStatus === 'found' && cable.customerName && (
                          <motion.div key="found"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 3 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden"
                          >
                            <p className="text-[9.5px] font-bold text-[var(--c-success)] m-0 inline-flex items-center gap-1">
                              <Check size={8} strokeWidth={3} /> {cable.customerName}
                            </p>
                            {cable.currentBouquet && (
                              <p className="text-[8.5px] text-[var(--c-text-muted)] m-0 truncate">Current: {cable.currentBouquet}</p>
                            )}
                          </motion.div>
                        )}
                        {cable.verifyStatus === 'invalid' && (
                          <motion.p key="invalid"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 3 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-[9.5px] font-bold text-[var(--c-error,#ef4444)] m-0 inline-flex items-center gap-1 overflow-hidden"
                          >
                            <AlertCircle size={8} /> Invalid smartcard number
                          </motion.p>
                        )}
                      </AnimatePresence>
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {smartcard && (
                      <motion.button
                        key="clear"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.15 }}
                        type="button"
                        onClick={() => { setSmartcard(''); setAction(null); setSelectedVariation(null); cable.resetVerify() }}
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

            {/* Section 3: Action picker — only after verify found */}
            <AnimatePresence>
              {cable.verifyStatus === 'found' && (
                <motion.section
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2 px-0.5">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[8px] font-black shrink-0">3</span>
                    <h3 className="text-[11px] font-bold text-[var(--c-text)] m-0 tracking-[-0.1px]">What would you like to do?</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Renew */}
                    <button
                      type="button"
                      onClick={() => pickAction('renew')}
                      className={[
                        'relative overflow-hidden flex flex-col gap-1.5 p-3 rounded-2xl text-left transition-all duration-200 active:scale-[0.97]',
                        action === 'renew'
                          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.28)]'
                          : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                      ].join(' ')}
                    >
                      {action === 'renew' && <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/[0.15] blur-xl" />}
                      <RefreshCw size={18} className={action === 'renew' ? 'text-brand-primary' : 'text-brand-accent'} />
                      <p className={['text-[12px] font-black m-0 leading-tight', action === 'renew' ? 'text-brand-primary' : 'text-[var(--c-text)]'].join(' ')}>Renew</p>
                      <p className={['text-[9px] m-0 font-semibold leading-snug', action === 'renew' ? 'text-brand-primary/70' : 'text-[var(--c-text-muted)]'].join(' ')}>
                        {cable.renewalAmount ? formatNGN(cable.renewalAmount) : 'Same plan'}
                      </p>
                      {action === 'renew' && (
                        <span className="absolute top-2 right-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-primary/20 text-brand-primary">
                          <Check size={9} strokeWidth={3} />
                        </span>
                      )}
                    </button>

                    {/* Change */}
                    <button
                      type="button"
                      onClick={() => pickAction('change')}
                      className={[
                        'relative overflow-hidden flex flex-col gap-1.5 p-3 rounded-2xl text-left transition-all duration-200 active:scale-[0.97]',
                        action === 'change'
                          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.28)]'
                          : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                      ].join(' ')}
                    >
                      {action === 'change' && <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/[0.15] blur-xl" />}
                      <Tv size={18} className={action === 'change' ? 'text-brand-primary' : 'text-brand-accent'} />
                      <p className={['text-[12px] font-black m-0 leading-tight', action === 'change' ? 'text-brand-primary' : 'text-[var(--c-text)]'].join(' ')}>Change plan</p>
                      <p className={['text-[9px] m-0 font-semibold leading-snug', action === 'change' ? 'text-brand-primary/70' : 'text-[var(--c-text-muted)]'].join(' ')}>
                        Pick a new bouquet
                      </p>
                      {action === 'change' && (
                        <span className="absolute top-2 right-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-primary/20 text-brand-primary">
                          <Check size={9} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Section 4: Plan select trigger (only for change) */}
            <AnimatePresence>
              {cable.verifyStatus === 'found' && action === 'change' && (
                <motion.section
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2 px-0.5">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[8px] font-black shrink-0">4</span>
                    <h3 className="text-[11px] font-bold text-[var(--c-text)] m-0 tracking-[-0.1px]">Choose a plan</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => { if (!cable.variationsLoading) setPlanSheetOpen(true) }}
                    className={[
                      'relative flex items-center gap-3 w-full px-3.5 py-3.5 rounded-2xl border transition-all duration-200 active:scale-[0.99] text-left',
                      selectedVariation
                        ? 'bg-gradient-to-r from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border-[var(--c-accent-border-strong)]'
                        : 'bg-[var(--c-surface)] border-[var(--c-border)]',
                    ].join(' ')}
                  >
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent shrink-0">
                      <Tv size={15} strokeWidth={2} />
                    </span>

                    <div className="flex-1 min-w-0">
                      {cable.variationsLoading ? (
                        <p className="text-[11px] text-[var(--c-text-muted)] m-0 inline-flex items-center gap-1.5">
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                            <Loader2 size={10} />
                          </motion.span>
                          Loading plans…
                        </p>
                      ) : selectedVariation ? (
                        <>
                          <p className="text-[12px] font-bold text-[var(--c-text)] m-0 leading-tight truncate">{selectedVariation.name}</p>
                          <p className="text-[9.5px] text-brand-accent font-bold m-0 mt-0.5 tabular-nums">{formatNGN(Number(selectedVariation.amount))}</p>
                        </>
                      ) : (
                        <p className="text-[12px] text-[var(--c-text-faint)] font-semibold m-0">Select a plan</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {selectedVariation && (
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-accent text-brand-primary">
                          <Check size={8} strokeWidth={3.5} />
                        </span>
                      )}
                      <ChevronDown size={14} className="text-[var(--c-text-muted)]" />
                    </div>
                  </button>
                </motion.section>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-pay summary card */}
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
              <Tv size={8} strokeWidth={2.8} /> Review payment
            </p>
            <div className="relative flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] shrink-0">
                <img src={provider?.logo} alt={provider?.label} className="w-full h-full object-cover rounded-full" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-[var(--c-text)] m-0 leading-tight">{provider?.label}</p>
                <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 font-mono tabular-nums truncate">{smartcard}</p>
                {cable.customerName && (
                  <p className="text-[9px] text-[var(--c-success)] m-0 font-bold inline-flex items-center gap-0.5">
                    <Check size={7} strokeWidth={3} /> {cable.customerName}
                  </p>
                )}
                {bouquetForAction?.name && (
                  <p className="text-[9px] text-[var(--c-text-muted)] m-0 font-semibold truncate inline-flex items-center gap-1">
                    {action === 'renew' ? <RefreshCw size={8} /> : <Tv size={8} />}
                    {bouquetForAction.name}
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

      {/* Proceed button */}
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

      {/* Info box */}
      <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] p-2.5 flex items-start gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
          <Info size={11} />
        </span>
        <div className="leading-snug">
          <p className="text-[10.5px] font-semibold text-[var(--c-text)] m-0">Receipts auto-saved</p>
          <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Find receipts in <span className="text-brand-accent font-semibold">Transactions</span> for the next 7 years.
          </p>
        </div>
      </div>

      <p className="inline-flex items-center justify-center gap-1 text-[9.5px] text-[var(--c-text-muted)] mt-0.5 mb-1">
        <ShieldCheck size={10} className="text-brand-accent" />
        Secured by VeloxZap · Verified billers
      </p>
    </div>

    {/* ── Bottom sheet ── */}
    <BottomSheet
      open={sheetOpen}
      onClose={() => {
        if (status === 'processing') return
        if (status === 'done') { handleDone(); return }
        setSheetOpen(false)
      }}
      label={status === 'done' ? 'Subscription activated' : 'Order summary'}
      title={status === 'processing' ? undefined : status === 'done' ? 'All done!' : `Pay ${provider?.label || 'Cable TV'}`}
      closeOnScrimClick={status === 'idle'}
      maxHeight="90vh"
    >
      <AnimatePresence mode="wait" initial={false}>

        {/* Processing */}
        {status === 'processing' && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-3 px-4 py-12"
          >
            <Loader2 size={32} className="animate-spin text-brand-accent" />
            <p className="text-[14px] font-semibold text-[var(--c-text-muted)] m-0">Processing payment…</p>
          </motion.div>
        )}

        {/* Success */}
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
              <p className="text-[17px] font-bold text-[var(--c-text)] m-0">Subscription Activated!</p>
              <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1">
                Your {provider?.label} subscription is now active.
              </p>
            </div>

            <div className="w-full rounded-[14px] overflow-hidden" style={{ border: '1px solid var(--c-border)' }}>
              {/* Provider */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                <span className="text-[11.5px] text-[var(--c-text-muted)]">Provider</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border border-[var(--c-border)] overflow-hidden shrink-0">
                    <img src={provider?.logo} alt={provider?.label} className="w-full h-full object-cover rounded-full" />
                  </span>
                  <span className="text-[12px] font-bold text-[var(--c-text)]">{provider?.label}</span>
                </div>
              </div>
              {/* Smartcard */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                <span className="text-[11.5px] text-[var(--c-text-muted)]">Smartcard</span>
                <span className="text-[12px] font-bold font-mono text-[var(--c-text)]">{smartcard}</span>
              </div>
              {/* Customer */}
              {cable.customerName && (
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                  <span className="text-[11.5px] text-[var(--c-text-muted)]">Customer</span>
                  <span className="text-[12px] font-bold" style={{ color: '#10b981' }}>{cable.customerName}</span>
                </div>
              )}
              {/* Plan */}
              {bouquetForAction?.name && (
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                  <span className="text-[11.5px] text-[var(--c-text-muted)]">Plan</span>
                  <span className="text-[12px] font-bold text-[var(--c-text)] text-right max-w-[55%] leading-tight">{bouquetForAction.name}</span>
                </div>
              )}
              {/* Amount */}
              <div className="flex items-center justify-between px-4 py-3.5" style={{ background: 'rgba(16,185,129,0.06)' }}>
                <span className="text-[12.5px] font-bold text-[var(--c-text)]">Amount paid</span>
                <span className="text-[16px] font-black tabular-nums" style={{ color: '#10b981' }}>{formatNGN(num)}</span>
              </div>
            </div>

            <div className="w-full flex gap-3">
              <motion.button type="button" onClick={handleDone} whileTap={{ scale: 0.97 }}
                className="flex-1 h-[50px] rounded-[16px] flex items-center justify-center gap-2 font-bold text-[14px]"
                style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', boxShadow: '0 6px 20px -4px rgba(201,162,39,0.5)' }}
              >
                <Check size={14} strokeWidth={3} />
                Done
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Order summary */}
        {status === 'idle' && (
          <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <div className="mx-4 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[var(--c-border)] shrink-0 overflow-hidden p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                <img src={provider?.logo} alt={provider?.label} className="w-full h-full object-cover rounded-full" />
              </span>
              <div className="min-w-0 leading-tight flex-1">
                <p className="text-[15px] font-black tabular-nums tracking-[0.2px] text-[var(--c-text)] m-0">{provider?.label}</p>
                <p className="text-[11px] font-semibold text-[var(--c-text-muted)] m-0 mt-0.5 font-mono truncate">{smartcard}</p>
                {cable.customerName && (
                  <p className="text-[10.5px] font-semibold m-0 mt-0.5" style={{ color: '#10b981' }}>{cable.customerName}</p>
                )}
              </div>
            </div>

            <div className="mx-4 mt-3 flex flex-col rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
              {phone && <SheetRow label="Phone" value={phone} muted />}
              <SheetRow label="Plan" value={bouquetForAction?.name || '—'} />
              <SheetRow label="Action" value={action === 'renew' ? 'Renew subscription' : 'Change bouquet'} muted />
              <SheetRow label="Fee" value="₦0.00" muted />
              <div className="h-px bg-[var(--c-border)]" />
              <SheetRow label="Total" value={formatNGN(num)} bold />
            </div>

            <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)]">
              <Info size={12} className="text-brand-accent shrink-0" />
              <p className="text-[10.5px] text-[var(--c-text-muted)] m-0">
                Verify the smartcard and plan before confirming — <span className="font-semibold text-[var(--c-text)]">non-refundable</span>.
              </p>
            </div>

            <div className="px-4 mt-4">
              <button type="button" onClick={() => setPinOpen(true)}
                className="relative overflow-hidden inline-flex items-center justify-center gap-2 w-full h-[52px] rounded-2xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[14px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_8px_28px_-8px_rgba(201,162,39,0.55)] active:scale-[0.99] transition"
              >

                Pay
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </BottomSheet>

    {/* Plan picker sheet */}
    <BottomSheet
      open={planSheetOpen}
      onClose={() => setPlanSheetOpen(false)}
      label="Choose a plan"
      title={`${provider?.label || 'Cable TV'} plans`}
      closeOnScrimClick
      maxHeight="85vh"
    >
      <div className="flex-1 overflow-y-auto pb-4">
        {cable.variations.map((v, i) => {
          const active = selectedVariation?.code === v.code
          const isLast = i === cable.variations.length - 1
          return (
            <button
              key={v.code}
              type="button"
              onClick={() => { setSelectedVariation(v); setPlanSheetOpen(false) }}
              className={[
                'relative w-full flex items-center gap-3.5 px-5 py-3.5 text-left transition active:bg-[var(--c-surface-soft)]',
                !isLast ? 'border-b border-[var(--c-border-soft)]' : '',
                active ? 'bg-[var(--c-accent-soft)]' : '',
              ].join(' ')}
            >
              <div className="flex-1 min-w-0">
                <p className={['text-[13px] font-bold m-0 leading-tight truncate', active ? 'text-brand-accent' : 'text-[var(--c-text)]'].join(' ')}>
                  {v.name}
                </p>
                <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5 font-medium tabular-nums">
                  {formatNGN(Number(v.amount))}
                </p>
              </div>
              <span
                className={[
                  'inline-flex items-center justify-center rounded-full border-2 shrink-0 transition',
                  active ? 'bg-brand-accent border-brand-accent' : 'bg-transparent border-[var(--c-border)]',
                ].join(' ')}
                style={{ width: 20, height: 20 }}
              >
                {active && <Check size={10} strokeWidth={3.5} className="text-brand-primary" />}
              </span>
            </button>
          )
        })}
      </div>
    </BottomSheet>

    <PinModal
      open={pinOpen}
      title="Enter PIN"
      subtitle={`Confirm ${formatNGN(num)} for ${provider?.label || 'Cable TV'} — ${smartcard}`}
      loading={cable.buying}
      error={pinError}
      onConfirm={handlePinConfirm}
      onCancel={() => { setPinOpen(false); setPinError(null) }}
    />
    </>
  )
}
