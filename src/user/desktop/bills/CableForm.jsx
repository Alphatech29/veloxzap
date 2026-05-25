import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Check, ShieldCheck, Info, X, Tv,
  AlertCircle, Loader2, ChevronLeft, Receipt, RefreshCw,
} from 'lucide-react'
import { PROVIDERS, formatNGN } from './constants'
import useCable from '../../../hooks/useCable'
import useUser from '../../../hooks/useUser'
import { useAlert } from '../../../components/ui/Alert'
import PinModal from '../../../components/ui/PinModal'

export default function CableForm({ onBack }) {
  const providers = PROVIDERS.cable
  const cable = useCable()
  const { user } = useUser()
  const { alert } = useAlert()

  const phone = user?.phone_number || ''

  const [providerId, setProviderId] = useState(null)
  const [smartcard, setSmartcard] = useState('')
  const [action, setAction] = useState(null)        // 'renew' | 'change'
  const [selectedVariation, setSelectedVariation] = useState(null)
  const [pinOpen, setPinOpen] = useState(false)
  const [pinError, setPinError] = useState(null)

  const provider = providers.find(p => p.id === providerId)

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

  useEffect(() => {
    if (provider?.serviceId) cable.loadVariations(provider.serviceId)
  }, [provider?.serviceId])

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
    cable.reset()
    setProviderId(null)
    setSmartcard('')
    setAction(null)
    setSelectedVariation(null)
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
            <Sparkles size={10} /> Cable TV
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">Pay Cable TV</h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Renew or change your subscription instantly.
          </p>
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
              <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">Choose provider</h2>
              <span className="text-[9.5px] text-[var(--c-text-muted)] tabular-nums">{providers.length} options</span>
            </div>
            <div className="grid grid-cols-2 min-[640px]:grid-cols-4 gap-1.5">
              {providers.map(p => {
                const active = providerId === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pickProvider(p.id)}
                    className={[
                      'relative overflow-hidden flex flex-col items-center gap-1 p-2 rounded-xl transition active:scale-[0.96]',
                      active
                        ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border-strong)]'
                        : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                    ].join(' ')}
                  >
                    {active && <span aria-hidden className="pointer-events-none absolute -top-3 -right-3 w-10 h-10 rounded-full bg-brand-accent/[0.22] blur-xl" />}
                    <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
                      <img src={p.logo} alt={p.label} className="w-full h-full object-cover rounded-full" />
                    </span>
                    <span className="relative text-[9.5px] font-bold text-[var(--c-text)] leading-tight text-center truncate max-w-full">{p.label}</span>
                    {active && (
                      <span className="absolute top-1 right-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-brand-accent text-brand-primary">
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

                {/* Smartcard input */}
                <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
                  <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px] mb-2">Smartcard details</h2>
                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
                    Smartcard / IUC number
                  </p>
                  <div className={[
                    'relative rounded-xl bg-[var(--c-surface-soft)] border transition overflow-hidden',
                    cable.verifyStatus === 'invalid'
                      ? 'border-[var(--c-error,#ef4444)] shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                      : 'border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)]',
                  ].join(' ')}>
                    <div className="relative flex items-center gap-2.5 p-2.5">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.05)] shrink-0">
                        <img src={provider.logo} alt={provider.label} className="w-full h-full object-cover rounded-full" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={smartcard}
                          onChange={handleSmartcard}
                          placeholder="1234567890"
                          className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[15px] font-bold tabular-nums tracking-[0.3px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                          style={{ boxShadow: 'none' }}
                        />
                        {smartcard.length >= 6 && (
                          <AnimatePresence mode="wait">
                            {cable.verifyStatus === 'loading' && (
                              <motion.p key="loading"
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 2 }}
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
                                animate={{ opacity: 1, height: 'auto', marginTop: 2 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ duration: 0.18 }}
                                className="overflow-hidden"
                              >
                                <p className="text-[10px] font-bold text-[var(--c-success)] m-0 inline-flex items-center gap-1">
                                  <Check size={9} strokeWidth={3} /> {cable.customerName}
                                </p>
                                {cable.currentBouquet && (
                                  <p className="text-[9px] text-[var(--c-text-muted)] m-0">
                                    Current: {cable.currentBouquet}
                                    {cable.dueDate ? ` · Expires ${cable.dueDate}` : ''}
                                  </p>
                                )}
                              </motion.div>
                            )}
                            {cable.verifyStatus === 'invalid' && (
                              <motion.p key="invalid"
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 2 }}
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
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-surface)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
                          >
                            <X size={12} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </article>

                {/* Action picker */}
                <AnimatePresence>
                  {cable.verifyStatus === 'found' && (
                    <motion.article
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4"
                    >
                      <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px] mb-3">What would you like to do?</h2>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Renew */}
                        <button
                          type="button"
                          onClick={() => pickAction('renew')}
                          className={[
                            'relative overflow-hidden flex flex-col gap-1.5 p-3 rounded-xl text-left transition active:scale-[0.97]',
                            action === 'renew'
                              ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.28)]'
                              : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                          ].join(' ')}
                        >
                          {action === 'renew' && <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/[0.15] blur-xl" />}
                          <RefreshCw size={18} className={action === 'renew' ? 'text-brand-primary' : 'text-brand-accent'} />
                          <p className={['text-[12px] font-black m-0 leading-tight', action === 'renew' ? 'text-brand-primary' : 'text-[var(--c-text)]'].join(' ')}>Renew</p>
                          <p className={['text-[9.5px] m-0 font-semibold', action === 'renew' ? 'text-brand-primary/70' : 'text-[var(--c-text-muted)]'].join(' ')}>
                            {cable.renewalAmount ? formatNGN(cable.renewalAmount) : 'Same plan, same amount'}
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
                            'relative overflow-hidden flex flex-col gap-1.5 p-3 rounded-xl text-left transition active:scale-[0.97]',
                            action === 'change'
                              ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.28)]'
                              : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                          ].join(' ')}
                        >
                          {action === 'change' && <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/[0.15] blur-xl" />}
                          <Tv size={18} className={action === 'change' ? 'text-brand-primary' : 'text-brand-accent'} />
                          <p className={['text-[12px] font-black m-0 leading-tight', action === 'change' ? 'text-brand-primary' : 'text-[var(--c-text)]'].join(' ')}>Change plan</p>
                          <p className={['text-[9.5px] m-0 font-semibold', action === 'change' ? 'text-brand-primary/70' : 'text-[var(--c-text-muted)]'].join(' ')}>
                            Pick a new bouquet
                          </p>
                          {action === 'change' && (
                            <span className="absolute top-2 right-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-primary/20 text-brand-primary">
                              <Check size={9} strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      </div>
                    </motion.article>
                  )}
                </AnimatePresence>

                {/* Plan picker (change only) */}
                <AnimatePresence>
                  {cable.verifyStatus === 'found' && action === 'change' && (
                    <motion.article
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">Choose a plan</h2>
                        {cable.variationsLoading && (
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="inline-flex text-brand-accent">
                            <Loader2 size={13} />
                          </motion.span>
                        )}
                      </div>

                      {!cable.variationsLoading && cable.variations.length === 0 && (
                        <p className="text-[10.5px] text-[var(--c-text-muted)] text-center py-6">No plans available. Try again later.</p>
                      )}

                      {cable.variations.length > 0 && (
                        <div className="flex flex-col gap-1.5 max-h-[260px] overflow-y-auto pr-1">
                          {cable.variations.map(v => {
                            const active = selectedVariation?.code === v.code
                            return (
                              <button
                                key={v.code}
                                type="button"
                                onClick={() => setSelectedVariation(v)}
                                className={[
                                  'relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition active:scale-[0.99] text-left',
                                  active
                                    ? 'bg-gradient-to-r from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border-[var(--c-accent-border-strong)]'
                                    : 'bg-[var(--c-surface-soft)] border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                                ].join(' ')}
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11.5px] font-bold text-[var(--c-text)] m-0 leading-tight truncate">{v.name}</p>
                                  <p className="text-[9px] text-[var(--c-text-muted)] m-0 mt-0.5">{v.code}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={['text-[13px] font-black tabular-nums', active ? 'text-brand-accent' : 'text-[var(--c-text)]'].join(' ')}>
                                    {formatNGN(Number(v.amount))}
                                  </span>
                                  <span
                                    className={[
                                      'inline-flex items-center justify-center rounded-full border transition',
                                      active ? 'bg-brand-accent border-brand-accent text-brand-primary' : 'bg-transparent border-[var(--c-border)]',
                                    ].join(' ')}
                                    style={{ width: 16, height: 16 }}
                                  >
                                    {active && <Check size={8} strokeWidth={3.5} />}
                                  </span>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}
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

            {/* Success panel */}
            {status === 'done' && (
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
                      <p className="text-[16px] font-bold text-[var(--c-text)] m-0">Subscription Activated!</p>
                      <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-1">
                        Your {provider?.label} subscription is now active.
                      </p>
                    </div>

                    <div className="w-full rounded-[12px] overflow-hidden" style={{ border: '1px solid var(--c-border)' }}>
                      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                        <span className="text-[11px] text-[var(--c-text-muted)]">Provider</span>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white border border-[var(--c-border)] overflow-hidden shrink-0">
                            <img src={provider?.logo} alt={provider?.label} className="w-full h-full object-cover rounded-full" />
                          </span>
                          <span className="text-[11.5px] font-bold text-[var(--c-text)]">{provider?.label}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                        <span className="text-[11px] text-[var(--c-text-muted)]">Smartcard</span>
                        <span className="text-[11.5px] font-bold font-mono text-[var(--c-text)]">{smartcard}</span>
                      </div>
                      {cable.customerName && (
                        <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                          <span className="text-[11px] text-[var(--c-text-muted)]">Customer</span>
                          <span className="text-[11.5px] font-bold" style={{ color: '#10b981' }}>{cable.customerName}</span>
                        </div>
                      )}
                      {bouquetForAction?.name && (
                        <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                          <span className="text-[11px] text-[var(--c-text-muted)]">Plan</span>
                          <span className="text-[11.5px] font-bold text-[var(--c-text)] text-right max-w-[55%] leading-tight">{bouquetForAction.name}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(16,185,129,0.06)' }}>
                        <span className="text-[12px] font-bold text-[var(--c-text)]">Amount paid</span>
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
            )}

            {/* Order summary panel */}
            {status !== 'done' && (
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
                        <span className="inline-flex w-3 h-3 rounded-full overflow-hidden bg-white border border-[var(--c-border-soft)]">
                          <img src={provider.logo} alt="" className="w-full h-full object-cover rounded-full" />
                        </span>
                        {provider.label}
                      </span>
                    )}
                  </header>

                  <div className="p-4 flex flex-col gap-2">
                    {[
                      { label: 'Provider',   value: provider?.label || '—' },
                      { label: 'Smartcard',  value: smartcard || '—', mono: true },
                      cable.customerName ? { label: 'Customer', value: cable.customerName, accent: true } : null,
                      action ? { label: 'Action', value: action === 'renew' ? 'Renew subscription' : 'Change bouquet' } : null,
                      bouquetForAction?.name ? { label: 'Plan', value: bouquetForAction.name } : null,
                      { label: 'Amount', value: num > 0 ? formatNGN(num) : '—', bold: true },
                    ].filter(Boolean).map((row, i) => (
                      <div key={i} className="flex items-baseline justify-between gap-2">
                        <span className="text-[10.5px] text-[var(--c-text-muted)] shrink-0">{row.label}</span>
                        <span className={[
                          'whitespace-nowrap text-right max-w-[60%] truncate text-[11.5px]',
                          row.mono ? 'font-mono' : '',
                          row.bold ? 'font-bold text-[var(--c-text)]' : '',
                          row.accent ? 'font-bold text-[var(--c-success)]' : '',
                          !row.bold && !row.accent ? 'font-semibold text-[var(--c-text)]' : '',
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
                          : status === 'processing'
                            ? 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)] cursor-not-allowed'
                            : 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)] cursor-not-allowed',
                      ].join(' ')}
                    >
                      {status === 'processing' ? (
                        <>
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                            <Loader2 size={13} strokeWidth={2.6} />
                          </motion.span>
                          Processing payment…
                        </>
                      ) : (
                        <>
                          <Tv size={13} strokeWidth={2.6} />
                          {ready
                            ? `Pay ${formatNGN(num)}`
                            : !provider
                              ? 'Select a provider'
                              : cable.verifyStatus !== 'found'
                                ? 'Verify smartcard'
                                : !action
                                  ? 'Choose an action'
                                  : 'Select a plan'}
                        </>
                      )}
                    </button>

                    <div className="flex items-start gap-1.5 px-1 mt-1">
                      <Info size={10} className="text-brand-accent shrink-0 mt-[1px]" />
                      <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 leading-snug">
                        Verify smartcard and plan — <span className="font-semibold text-[var(--c-text)]">non-refundable</span>.
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
        subtitle={`Confirm ${formatNGN(num)} for ${provider?.label || 'Cable TV'} — ${smartcard}`}
        loading={cable.buying}
        error={pinError}
        onConfirm={handlePinConfirm}
        onCancel={() => { setPinOpen(false); setPinError(null) }}
      />
    </div>
  )
}
