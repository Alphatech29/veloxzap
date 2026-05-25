import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Check, ShieldCheck, Info, X, Loader2, Hash,
  Receipt, ChevronLeft, AlertCircle, Copy, Zap,
} from 'lucide-react'
import {
  CATEGORIES, PROVIDERS, PRESETS, METER_TYPES,
  formatNGN,
} from './constants'
import useBills from '../../../hooks/useBills'
import useUser from '../../../hooks/useUser'
import { useAlert } from '../../../components/ui/Alert'
import PinModal from '../../../components/ui/PinModal'

export default function PaymentForm({ categoryId, onBack }) {
  const cat = CATEGORIES.find(c => c.id === categoryId)
  const providers = PROVIDERS[categoryId] || []
  const isElec = categoryId === 'electricity'

  const bills = useBills()
  const { user } = useUser()
  const { alert } = useAlert()

  const phone = user?.phone_number || ''

  const [providerId, setProviderId] = useState(null)
  const [meterType, setMeterType] = useState('prepaid')
  const [account, setAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [pinOpen, setPinOpen] = useState(false)
  const [pinError, setPinError] = useState(null)
  const [copied, setCopied] = useState(false)

  const provider = providers.find(p => p.id === providerId)
  const num = Number(amount) || 0
  const status = bills.buying ? 'processing' : bills.token ? 'done' : 'idle'

  const validAccount = isElec
    ? account.length >= 6 && bills.verifyStatus !== 'invalid'
    : account.length >= 6
  const minAmount = bills.minimumAmount ?? provider?.minAmount ?? 1000
  const validAmount = num >= minAmount && num <= 100000
  const ready = !!provider && validAccount && validAmount && (isElec ? bills.verifyStatus === 'found' : true)

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

  function handleCopy() {
    navigator.clipboard?.writeText(bills.token.replace(/\s/g, '')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleDone() {
    bills.reset()
    setProviderId(null)
    setAccount('')
    setAmount('')
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
            <Sparkles size={10} /> {cat.label}
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Pay {cat.label}
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Select a provider and fill in your details.
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
              <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                {isElec ? 'Choose DISCO' : 'Choose provider'}
              </h2>
              <span className="text-[9.5px] text-[var(--c-text-muted)] tabular-nums">{providers.length} options</span>
            </div>
            <div className="grid grid-cols-3 min-[640px]:grid-cols-4 min-[960px]:grid-cols-6 gap-1.5">
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
                    {active && (
                      <span aria-hidden className="pointer-events-none absolute -top-3 -right-3 w-10 h-10 rounded-full bg-brand-accent/[0.22] blur-xl" />
                    )}
                    <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
                      <img src={p.logo} alt={p.label} className="w-full h-full object-contain" />
                    </span>
                    <span className="relative text-[9.5px] font-bold text-[var(--c-text)] leading-tight text-center truncate max-w-full">
                      {p.label}
                    </span>
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

                {/* Account / meter */}
                <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                      {isElec ? 'Meter details' : 'Account details'}
                    </h2>
                    {isElec && (
                      <div className="inline-flex p-0.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
                        {METER_TYPES.map(m => {
                          const active = meterType === m.id
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setMeterType(m.id)}
                              className={[
                                'px-2.5 py-1 rounded-md text-[10px] font-bold tracking-[0.2px] transition',
                                active
                                  ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_2px_8px_rgba(201,162,39,0.28)]'
                                  : 'text-[var(--c-text-muted)] hover:text-[var(--c-text)]',
                              ].join(' ')}
                            >
                              {m.label}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
                    {cat.accountLabel}
                  </p>
                  <div className={[
                    'relative rounded-xl bg-[var(--c-surface-soft)] border transition overflow-hidden',
                    bills.verifyStatus === 'invalid'
                      ? 'border-[var(--c-error,#ef4444)] shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                      : 'border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)]',
                  ].join(' ')}>
                    <div className="relative flex items-center gap-2.5 p-2.5">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.05)] shrink-0">
                        <img src={provider.logo} alt={provider.label} className="w-full h-full object-contain" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={account}
                          onChange={handleAccount}
                          placeholder={cat.accountPlaceholder}
                          className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[15px] font-bold tabular-nums tracking-[0.3px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                          style={{ boxShadow: 'none' }}
                        />

                        {/* Verification feedback */}
                        {isElec && account.length >= 6 && (
                          <AnimatePresence mode="wait">
                            {bills.verifyStatus === 'loading' && (
                              <motion.p
                                key="loading"
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 2 }}
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
                              <motion.p
                                key="found"
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 2 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ duration: 0.18 }}
                                className="text-[10px] font-bold text-[var(--c-success)] m-0 inline-flex items-center gap-1 overflow-hidden"
                              >
                                <Check size={9} strokeWidth={3} /> {bills.customerName}
                              </motion.p>
                            )}
                            {bills.verifyStatus === 'invalid' && (
                              <motion.p
                                key="invalid"
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 2 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ duration: 0.15 }}
                                className="text-[9.5px] font-bold text-[var(--c-error,#ef4444)] m-0 inline-flex items-center gap-1 overflow-hidden"
                              >
                                <AlertCircle size={8} /> Invalid meter number
                              </motion.p>
                            )}
                          </AnimatePresence>
                        )}

                        {!isElec && account.length > 0 && account.length < 6 && (
                          <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-1 inline-flex items-center gap-1">
                            <Info size={10} className="text-brand-accent" />
                            Keep typing — minimum 6 digits.
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
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-surface)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
                          >
                            <X size={12} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </article>

                {/* Amount */}
                <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">Amount</h2>
                    <AnimatePresence initial={false}>
                      {num > 0 && (
                        <motion.p
                          key={`pick-${num}`}
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -2 }}
                          transition={{ duration: 0.15 }}
                          className="text-[10px] uppercase tracking-[1.1px] font-bold text-brand-accent m-0"
                        >
                          {formatNGN(num)} selected
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="grid grid-cols-3 min-[640px]:grid-cols-6 gap-1.5">
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
                            'relative overflow-hidden flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-lg text-center transition active:scale-[0.96]',
                            belowMin
                              ? 'opacity-30 cursor-not-allowed bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)]'
                              : active
                                ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.32)]'
                                : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)] hover:border-[var(--c-accent-border)]',
                          ].join(' ')}
                        >
                          <span className={['text-[8px] font-bold uppercase tracking-[0.8px]', active ? 'text-brand-primary/70' : 'text-[var(--c-text-muted)]'].join(' ')}>NGN</span>
                          <span className="text-[13px] font-black tabular-nums tracking-[-0.2px]">{v.toLocaleString('en-NG')}</span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="relative mt-2 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition overflow-hidden">
                    <span aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand-accent/[0.08] blur-2xl" />
                    <div className="relative flex items-center gap-2.5 p-2.5">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent text-[13px] font-black shrink-0">₦</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={amount ? Number(amount).toLocaleString('en-NG') : ''}
                        onChange={handleAmount}
                        placeholder="Enter custom amount"
                        className="flex-1 min-w-0 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[16px] font-bold tracking-[-0.2px] tabular-nums text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-semibold placeholder:tracking-normal"
                        style={{ boxShadow: 'none' }}
                      />
                    </div>
                  </div>
                  {isElec && (
                    <p className="text-[9.5px] text-[var(--c-text-muted)] m-0 mt-1.5 px-1">
                      Min {formatNGN(minAmount)} · Max ₦100,000 per transaction
                    </p>
                  )}
                </article>

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
                      <p className="text-[16px] font-bold text-[var(--c-text)] m-0">Payment Successful!</p>
                      <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-1">
                        {phone ? <>Token sent to <span className="font-bold text-[var(--c-text)]">{phone}</span></> : 'Sent to registered phone number'}
                      </p>
                    </div>

                    <div className="w-full rounded-[12px] overflow-hidden" style={{ border: '1px solid var(--c-border)' }}>
                      {/* Token */}
                      <div className="px-4 py-3.5 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                        <p className="text-[9px] font-bold uppercase tracking-[1.2px] m-0 mb-1.5" style={{ color: '#10b981' }}>
                          {meterType === 'prepaid' ? 'Recharge token' : 'Payment reference'}
                        </p>
                        <p className="text-[15px] font-black font-mono tabular-nums tracking-[2px] text-[var(--c-text)] m-0 leading-tight break-all">
                          {bills.token}
                        </p>
                      </div>
                      {/* Provider */}
                      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                        <span className="text-[11px] text-[var(--c-text-muted)]">Provider</span>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white border border-[var(--c-border)] overflow-hidden shrink-0">
                            <img src={provider?.logo} alt={provider?.label} className="w-full h-full object-contain" />
                          </span>
                          <span className="text-[11.5px] font-bold text-[var(--c-text)]">{provider?.label}</span>
                        </div>
                      </div>
                      {/* Meter */}
                      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                        <span className="text-[11px] text-[var(--c-text-muted)]">Meter</span>
                        <span className="text-[11.5px] font-bold font-mono text-[var(--c-text)]">{account}</span>
                      </div>
                      {/* Customer */}
                      {bills.customerName && (
                        <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                          <span className="text-[11px] text-[var(--c-text-muted)]">Customer</span>
                          <span className="text-[11.5px] font-bold" style={{ color: '#10b981' }}>{bills.customerName}</span>
                        </div>
                      )}
                      {/* Amount */}
                      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(16,185,129,0.06)' }}>
                        <span className="text-[12px] font-bold text-[var(--c-text)]">Amount paid</span>
                        <span className="text-[15px] font-black tabular-nums" style={{ color: '#10b981' }}>{formatNGN(num)}</span>
                      </div>
                    </div>

                    <div className="w-full flex gap-2">
                      <motion.button type="button" onClick={handleCopy} whileTap={{ scale: 0.97 }}
                        className="flex-1 h-[42px] rounded-[12px] flex items-center justify-center gap-2 font-bold text-[13px]"
                        style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', boxShadow: '0 6px 20px -4px rgba(201,162,39,0.5)' }}
                      >
                        {copied ? <Check size={13} strokeWidth={3} /> : <Copy size={13} />}
                        {copied ? 'Copied!' : 'Copy token'}
                      </motion.button>
                      <motion.button type="button" onClick={handleDone} whileTap={{ scale: 0.97 }}
                        className="flex-1 h-[42px] rounded-[12px] font-bold text-[13px]"
                        style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border)', color: 'var(--c-text-muted)' }}
                      >
                        Done
                      </motion.button>
                    </div>
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
                          <img src={provider.logo} alt="" className="w-full h-full object-contain" />
                        </span>
                        {provider.label}
                      </span>
                    )}
                  </header>

                  <div className="p-4 flex flex-col gap-2">
                    {/* Rows */}
                    {[
                      { label: 'Category',    value: cat.label },
                      { label: 'Provider',    value: provider?.label || '—' },
                      isElec ? { label: 'Meter type', value: METER_TYPES.find(m => m.id === meterType)?.label } : null,
                      { label: cat.accountLabel, value: account || '—', mono: true },
                      bills.customerName ? { label: 'Customer', value: bills.customerName, accent: true } : null,
                      { label: 'Amount', value: num > 0 ? formatNGN(num) : '—', bold: true },
                    ].filter(Boolean).map((row, i) => (
                      <div key={i} className="flex items-baseline justify-between gap-2">
                        <span className="text-[10.5px] text-[var(--c-text-muted)]">{row.label}</span>
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

                    {/* Pay button */}
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
                          {isElec ? 'Generating token…' : 'Processing payment…'}
                        </>
                      ) : (
                        <>
                          <Zap size={13} strokeWidth={2.6} />
                          {ready
                            ? `Pay `
                            : !provider
                              ? 'Pick a provider'
                              : !validAccount
                                ? isElec ? 'Enter meter number' : `Enter ${cat.accountLabel.toLowerCase()}`
                                : !validAmount
                                  ? `Min ${formatNGN(minAmount)}`
                                  : 'Verify meter first'}
                        </>
                      )}
                    </button>

                    <p className="inline-flex items-center justify-center gap-1 text-[10px] text-[var(--c-text-muted)] mt-1">
                      <ShieldCheck size={9} className="text-brand-accent" />
                      Receipts saved for 7 years
                    </p>
                  </div>
                </article>

                <article className="rounded-xl border border-[var(--c-border-soft)] bg-[var(--c-surface-soft)] p-3 flex items-start gap-2 mt-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
                    <Info size={12} />
                  </span>
                  <div className="leading-snug">
                    <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">Token delivered via SMS</p>
                    <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                      Find receipts & tokens in <span className="text-brand-accent font-semibold">Transactions</span> for 7 years.
                    </p>
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
        subtitle={`Confirm ${formatNGN(num)} ${isElec ? `electricity for meter ${account}` : `${cat?.label} payment`}`}
        loading={bills.buying}
        error={pinError}
        onConfirm={handlePinConfirm}
        onCancel={() => { setPinOpen(false); setPinError(null) }}
      />
    </div>
  )
}
