import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Sparkles, Check, ShieldCheck, Info, X, Loader2,
  Tv, Zap, Wifi, Hash, ChevronRight,
} from 'lucide-react'
import dstvLogo from '../../assets/dstv.jpg'
import gotvLogo from '../../assets/gotv.jpg'
import startimesLogo from '../../assets/startime.jpg'
import showmaxLogo from '../../assets/showmax.png'
import ikedcLogo from '../../assets/ikedc.png'
import ekedcLogo from '../../assets/ekedc.jpg'
import kedcoLogo from '../../assets/kedco.jpg'
import phedcLogo from '../../assets/phedc.png'
import jedLogo from '../../assets/jed.jpg'
import ibedcLogo from '../../assets/ibedc.jpg'
import kaedcoLogo from '../../assets/kaedco.jpg'
import aedcLogo from '../../assets/aedc.png'
import eedcLogo from '../../assets/eedc.png'
import bedcLogo from '../../assets/bedc.jpg'
import abaLogo from '../../assets/aba.jpg'
import yedcLogo from '../../assets/yedc.jpg'
import spectranetLogo from '../../assets/spectranet.webp'
import smileLogo from '../../assets/smile.jpg'

const CATEGORIES = [
  { id: 'cable',       label: 'Cable TV',     icon: Tv,   accountLabel: 'Smartcard number', accountPlaceholder: '1234567890', verifyHint: 'Subscriber name appears once verified' },
  { id: 'electricity', label: 'Electricity',  icon: Zap,  accountLabel: 'Meter number',     accountPlaceholder: '1234567890123', verifyHint: 'Customer name appears once verified' },
  { id: 'internet',    label: 'Internet',     icon: Wifi, accountLabel: 'Account number',   accountPlaceholder: 'Account / username', verifyHint: 'Account holder appears once verified' },
]

const PROVIDERS = {
  cable: [
    { id: 'dstv',      label: 'DSTV',     logo: dstvLogo },
    { id: 'gotv',      label: 'GoTV',     logo: gotvLogo },
    { id: 'startimes', label: 'StarTimes', logo: startimesLogo },
    { id: 'showmax',   label: 'ShowMax',  logo: showmaxLogo },
  ],
  electricity: [
    { id: 'ikedc',  label: 'Ikeja',         logo: ikedcLogo },
    { id: 'ekedc',  label: 'Eko',           logo: ekedcLogo },
    { id: 'aedc',   label: 'Abuja',         logo: aedcLogo },
    { id: 'phedc',  label: 'Port Harcourt', logo: phedcLogo },
    { id: 'ibedc',  label: 'Ibadan',        logo: ibedcLogo },
    { id: 'eedc',   label: 'Enugu',         logo: eedcLogo },
    { id: 'kedco',  label: 'Kano',          logo: kedcoLogo },
    { id: 'kaedco', label: 'Kaduna',        logo: kaedcoLogo },
    { id: 'jed',    label: 'Jos',           logo: jedLogo },
    { id: 'bedc',   label: 'Benin',         logo: bedcLogo },
    { id: 'aba',    label: 'Aba',           logo: abaLogo },
    { id: 'yedc',   label: 'Yola',          logo: yedcLogo },
  ],
  internet: [
    { id: 'spectranet', label: 'Spectranet', logo: spectranetLogo },
    { id: 'smile',      label: 'Smile',      logo: smileLogo },
  ],
}

const PRESETS = [1000, 2000, 5000, 10000, 15000, 20000]

const METER_TYPES = [
  { id: 'prepaid',  label: 'Prepaid' },
  { id: 'postpaid', label: 'Postpaid' },
]

function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG')
}

export default function MobileBills() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('cable')
  const [providerId, setProviderId] = useState(null)
  const [meterType, setMeterType] = useState('prepaid')
  const [account, setAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('idle')

  const cat = CATEGORIES.find(c => c.id === category)
  const providers = PROVIDERS[category] || []
  const provider = providers.find(p => p.id === providerId)

  const num = Number(amount) || 0
  const validAccount = account.length >= 6
  const validAmount = num >= 100 && num <= 1000000
  const ready = !!provider && validAccount && validAmount

  // simulate verification once account is long enough
  const verifiedName = validAccount ? mockName(account) : ''

  function pickCategory(id) {
    setCategory(id)
    setProviderId(null)
    setAccount('')
    setAmount('')
  }

  function pickProvider(id) {
    setProviderId(id)
    setAccount('')
    setAmount('')
  }

  function handleAccount(e) {
    setAccount(e.target.value.replace(/\s/g, '').slice(0, 20))
  }

  function handleAmount(e) {
    setAmount(e.target.value.replace(/[^\d]/g, ''))
  }

  function handleBuy() {
    if (!ready || status !== 'idle') return
    setStatus('processing')
    setTimeout(() => {
      setStatus('done')
      setTimeout(() => {
        setStatus('idle')
        setProviderId(null)
        setAccount('')
        setAmount('')
      }, 1800)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--c-text-muted)] hover:text-brand-accent active:scale-95 transition self-start -mt-1"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <div>
        <p className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
          <Sparkles size={11} /> Pay bills
        </p>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
          Bills & utilities
        </h1>
        <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 leading-snug">
          Cable, electricity & internet · instant token, no queues.
        </p>
      </div>

      <section>
        <h3 className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
          Category
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const active = category === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => pickCategory(id)}
                className={[
                  'relative overflow-hidden flex flex-col items-center gap-1.5 p-3 rounded-2xl transition active:scale-[0.97]',
                  active
                    ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border-strong)]'
                    : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                ].join(' ')}
              >
                {active && (
                  <span aria-hidden className="pointer-events-none absolute -top-5 -right-5 w-14 h-14 rounded-full bg-brand-accent/[0.18] blur-2xl" />
                )}
                <span
                  className={[
                    'relative inline-flex items-center justify-center w-10 h-10 rounded-2xl border transition',
                    active
                      ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.32)]'
                      : 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border-[var(--c-accent-border)]',
                  ].join(' ')}
                >
                  <Icon size={17} strokeWidth={2.2} />
                </span>
                <span className="relative text-[11px] font-bold text-[var(--c-text)]">
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <h3 className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0">
            Provider
          </h3>
          <span className="text-[10px] text-[var(--c-text-muted)] tabular-nums">
            {providers.length}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {providers.map(p => {
            const active = providerId === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => pickProvider(p.id)}
                className={[
                  'relative overflow-hidden flex flex-col items-center gap-1.5 p-2 rounded-2xl transition active:scale-[0.96]',
                  active
                    ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border-strong)]'
                    : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                ].join(' ')}
              >
                {active && (
                  <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-12 h-12 rounded-full bg-brand-accent/[0.22] blur-xl" />
                )}
                <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-[var(--c-border)] overflow-hidden p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                  <img src={p.logo} alt={p.label} className="w-full h-full object-contain" />
                </span>
                <span className="relative text-[10px] font-bold text-[var(--c-text)] leading-tight text-center truncate max-w-full">
                  {p.label}
                </span>
                {active && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-accent text-brand-primary">
                    <Check size={9} strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {provider && (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-5"
          >
            {category === 'electricity' && (
              <section>
                <h3 className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
                  Meter type
                </h3>
                <div className="inline-flex p-1 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
                  {METER_TYPES.map(m => {
                    const active = meterType === m.id
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMeterType(m.id)}
                        className={[
                          'px-3.5 py-1.5 rounded-xl text-[11px] font-bold tracking-[0.2px] transition',
                          active
                            ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_3px_10px_rgba(201,162,39,0.28)]'
                            : 'text-[var(--c-text-muted)] hover:text-[var(--c-text)]',
                        ].join(' ')}
                      >
                        {m.label}
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            <section>
              <p className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
                {cat.accountLabel}
              </p>
              <div className="relative rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_4px_rgba(201,162,39,0.10)] transition overflow-hidden">
                <div className="relative flex items-center gap-2.5 p-3">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-[var(--c-border)] overflow-hidden p-1 shadow-[0_2px_6px_rgba(0,0,0,0.05)] shrink-0">
                    <img src={provider.logo} alt={provider.label} className="w-full h-full object-contain" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={account}
                      onChange={handleAccount}
                      placeholder={cat.accountPlaceholder}
                      className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[16px] font-bold tabular-nums tracking-[0.4px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                      style={{ boxShadow: 'none', WebkitTapHighlightColor: 'transparent' }}
                    />
                    <AnimatePresence initial={false}>
                      {validAccount && verifiedName && (
                        <motion.p
                          key="verified"
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.18 }}
                          className="text-[10.5px] font-bold text-[var(--c-success)] m-0 inline-flex items-center gap-1 overflow-hidden"
                        >
                          <Check size={9} strokeWidth={3} />
                          {verifiedName}
                        </motion.p>
                      )}
                    </AnimatePresence>
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
                        onClick={() => setAccount('')}
                        aria-label="Clear"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
                      >
                        <X size={13} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              {!validAccount && account.length > 0 && (
                <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-1.5 px-1 inline-flex items-center gap-1">
                  <Info size={10} className="text-brand-accent" />
                  Keep typing — minimum 6 digits.
                </p>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <p className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0">
                  Amount
                </p>
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
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map(v => {
                  const active = num === v
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(String(v))}
                      className={[
                        'relative overflow-hidden flex flex-col items-center justify-center gap-0.5 py-3 rounded-xl text-center transition active:scale-[0.96]',
                        active
                          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.32)]'
                          : 'bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text)] hover:border-[var(--c-accent-border)]',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'text-[8.5px] font-bold uppercase tracking-[0.9px]',
                          active ? 'text-brand-primary/70' : 'text-[var(--c-text-muted)]',
                        ].join(' ')}
                      >
                        NGN
                      </span>
                      <span className="text-[15px] font-black tabular-nums tracking-[-0.3px]">
                        {v.toLocaleString('en-NG')}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="relative mt-2 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_4px_rgba(201,162,39,0.10)] transition overflow-hidden">
                <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-brand-accent/[0.08] blur-2xl" />
                <div className="relative flex items-center gap-2.5 p-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent text-[15px] font-black shrink-0">
                    ₦
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount ? Number(amount).toLocaleString('en-NG') : ''}
                    onChange={handleAmount}
                    placeholder="Enter custom amount"
                    className="flex-1 min-w-0 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[18px] font-bold tracking-[-0.2px] tabular-nums text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-semibold placeholder:tracking-normal"
                    style={{ boxShadow: 'none', WebkitTapHighlightColor: 'transparent' }}
                  />
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        disabled={!ready || status !== 'idle'}
        onClick={handleBuy}
        className={[
          'relative overflow-hidden inline-flex items-center justify-center gap-2 w-full h-12 rounded-2xl text-[13.5px] font-bold tracking-[0.2px] transition active:scale-[0.99]',
          ready && status === 'idle'
            ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_8px_22px_-6px_rgba(201,162,39,0.5)]'
            : status === 'done'
              ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
              : 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)] cursor-not-allowed',
        ].join(' ')}
      >
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="inline-flex items-center gap-2"
            >
              <Hash size={14} strokeWidth={2.6} />
              {ready
                ? `Pay · ${formatNGN(num)}`
                : !provider
                  ? 'Pick a provider'
                  : !validAccount
                    ? `Enter ${cat.accountLabel.toLowerCase()}`
                    : !validAmount
                      ? 'Enter amount (₦100 – ₦1,000,000)'
                      : 'Pay bill'}
            </motion.span>
          )}
          {status === 'processing' && (
            <motion.span
              key="proc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                className="inline-flex"
              >
                <Loader2 size={14} strokeWidth={2.6} />
              </motion.span>
              {category === 'electricity' ? 'Generating token…' : 'Processing payment…'}
            </motion.span>
          )}
          {status === 'done' && (
            <motion.span
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="inline-flex items-center gap-2"
            >
              <Check size={14} strokeWidth={3} />
              {category === 'electricity' ? 'Token sent via SMS' : 'Payment successful'}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] p-3 flex items-start gap-2.5">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-[9px] bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
          <Info size={13} />
        </span>
        <div className="leading-snug">
          <p className="text-[11.5px] font-semibold text-[var(--c-text)] m-0">
            Receipts auto-saved
          </p>
          <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Find tokens & receipts in <span className="text-brand-accent font-semibold">Transactions</span> for the next 7 years.
          </p>
        </div>
      </div>

      <p className="inline-flex items-center justify-center gap-1.5 text-[10.5px] text-[var(--c-text-muted)] mt-1 mb-2">
        <ShieldCheck size={11} className="text-brand-accent" />
        Secured by VeloxZap · Verified billers
      </p>
    </div>
  )
}

function mockName(account) {
  const names = ['John Doe', 'Sarah Okafor', 'Tunde Adebayo', 'Aisha Bello', 'Chinedu Eze']
  const idx = account.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % names.length
  return names[idx]
}
