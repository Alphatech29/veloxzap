import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Check, ShieldCheck, Info, X, Loader2, Hash,
  Wallet, Receipt, ChevronRight, Tv, Zap, Wifi, Clock,
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
  { id: 'cable',       label: 'Cable TV',    icon: Tv,   accountLabel: 'Smartcard number', accountPlaceholder: '1234567890' },
  { id: 'electricity', label: 'Electricity', icon: Zap,  accountLabel: 'Meter number',     accountPlaceholder: '1234567890123' },
  { id: 'internet',    label: 'Internet',    icon: Wifi, accountLabel: 'Account number',   accountPlaceholder: 'Account / username' },
]

const PROVIDERS = {
  cable: [
    { id: 'dstv',      label: 'DSTV',      logo: dstvLogo },
    { id: 'gotv',      label: 'GoTV',      logo: gotvLogo },
    { id: 'startimes', label: 'StarTimes', logo: startimesLogo },
    { id: 'showmax',   label: 'ShowMax',   logo: showmaxLogo },
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

const RECENT_BILLS = [
  { id: 'b1', cat: 'cable',       provider: 'dstv',  account: '1234567890',     amount: 14500, when: 'May 1' },
  { id: 'b2', cat: 'electricity', provider: 'ikedc', account: '12345678901',    amount: 9800,  when: 'Apr 28' },
  { id: 'b3', cat: 'internet',    provider: 'spectranet', account: 'olumide77', amount: 22000, when: 'Apr 22' },
]

const CASHBACK_RATE = 0.01

function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG')
}

function mockName(account) {
  const names = ['John Doe', 'Sarah Okafor', 'Tunde Adebayo', 'Aisha Bello', 'Chinedu Eze']
  const idx = account.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % names.length
  return names[idx]
}

export default function DesktopBills() {
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
  const verifiedName = validAccount ? mockName(account) : ''
  const cashback = Math.round(num * CASHBACK_RATE)

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

  function pickRecent(b) {
    setCategory(b.cat)
    setProviderId(b.provider)
    setAccount(b.account)
    setAmount(String(b.amount))
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
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
            <Sparkles size={10} /> Pay bills
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Bills & utilities
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Cable, electricity & internet · instant token, no queues.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
          <ShieldCheck size={10} /> Verified billers
        </span>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px] mb-2">
              Category
            </h2>
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORIES.map(({ id, label, icon: Icon }) => {
                const active = category === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => pickCategory(id)}
                    className={[
                      'relative overflow-hidden flex items-center gap-2.5 p-2.5 rounded-xl transition active:scale-[0.97]',
                      active
                        ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border-strong)]'
                        : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                    ].join(' ')}
                  >
                    {active && (
                      <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-12 h-12 rounded-full bg-brand-accent/[0.18] blur-2xl" />
                    )}
                    <span
                      className={[
                        'relative inline-flex items-center justify-center w-9 h-9 rounded-lg border transition shrink-0',
                        active
                          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.3)]'
                          : 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border-[var(--c-accent-border)]',
                      ].join(' ')}
                    >
                      <Icon size={15} strokeWidth={2.2} />
                    </span>
                    <span className="relative text-[11.5px] font-bold text-[var(--c-text)]">
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </article>

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                Provider
              </h2>
              <span className="text-[9.5px] text-[var(--c-text-muted)] tabular-nums">
                {providers.length} options
              </span>
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
                <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                      Account details
                    </h2>
                    {category === 'electricity' && (
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
                  <div className="relative rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition overflow-hidden">
                    <div className="relative flex items-center gap-2.5 p-2.5">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.05)] shrink-0">
                        <img src={provider.logo} alt={provider.label} className="w-full h-full object-contain" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={account}
                          onChange={e => setAccount(e.target.value.replace(/\s/g, '').slice(0, 20))}
                          placeholder={cat.accountPlaceholder}
                          className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[15px] font-bold tabular-nums tracking-[0.3px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                          style={{ boxShadow: 'none' }}
                        />
                        <AnimatePresence initial={false}>
                          {validAccount && verifiedName && (
                            <motion.p
                              key="verified"
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 2 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.18 }}
                              className="text-[10px] font-bold text-[var(--c-success)] m-0 inline-flex items-center gap-1 overflow-hidden"
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
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-surface)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
                          >
                            <X size={12} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  {!validAccount && account.length > 0 && (
                    <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-1.5 px-1 inline-flex items-center gap-1">
                      <Info size={10} className="text-brand-accent" />
                      Keep typing — minimum 6 digits.
                    </p>
                  )}
                </article>

                <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                      Amount
                    </h2>
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
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setAmount(String(v))}
                          className={[
                            'relative overflow-hidden flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-lg text-center transition active:scale-[0.96]',
                            active
                              ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_3px_10px_rgba(201,162,39,0.32)]'
                              : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)] hover:border-[var(--c-accent-border)]',
                          ].join(' ')}
                        >
                          <span
                            className={[
                              'text-[8px] font-bold uppercase tracking-[0.8px]',
                              active ? 'text-brand-primary/70' : 'text-[var(--c-text-muted)]',
                            ].join(' ')}
                          >
                            NGN
                          </span>
                          <span className="text-[13px] font-black tabular-nums tracking-[-0.2px]">
                            {v.toLocaleString('en-NG')}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="relative mt-2 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition overflow-hidden">
                    <span aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand-accent/[0.08] blur-2xl" />
                    <div className="relative flex items-center gap-2.5 p-2.5">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent text-[13px] font-black shrink-0">
                        ₦
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={amount ? Number(amount).toLocaleString('en-NG') : ''}
                        onChange={e => setAmount(e.target.value.replace(/[^\d]/g, ''))}
                        placeholder="Enter custom amount"
                        className="flex-1 min-w-0 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[16px] font-bold tracking-[-0.2px] tabular-nums text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-semibold placeholder:tracking-normal"
                        style={{ boxShadow: 'none' }}
                      />
                      <span className="text-[9px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)] shrink-0">
                        ₦100 – ₦1M
                      </span>
                    </div>
                  </div>
                </article>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">

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
              <SummaryRow label="Category"  value={cat.label} />
              <SummaryRow label="Provider"  value={provider?.label || '—'} />
              {category === 'electricity' && (
                <SummaryRow label="Meter type" value={METER_TYPES.find(m => m.id === meterType)?.label} />
              )}
              <SummaryRow label={cat.accountLabel} value={validAccount ? account : '—'} mono />
              {validAccount && verifiedName && (
                <SummaryRow label="Customer" value={verifiedName} accent />
              )}
              <SummaryRow label="Amount" value={num > 0 ? formatNGN(num) : '—'} bold />
              <div className="border-t border-dashed border-[var(--c-border)] my-0.5" />
              <SummaryRow
                label="Cashback"
                value={num > 0 ? `+${formatNGN(cashback)}` : '—'}
                accent
                hint={<><Wallet size={8} className="inline -mt-0.5 mr-0.5" /> to wallet</>}
              />
              <div className="flex items-center justify-between mt-0.5 pt-2.5 border-t border-[var(--c-border)]">
                <p className="text-[10px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">
                  Total
                </p>
                <p className="text-[16px] font-black tabular-nums text-[var(--c-text)] tracking-[-0.3px] m-0">
                  {num > 0 ? formatNGN(num) : '₦0'}
                </p>
              </div>

              <button
                type="button"
                disabled={!ready || status !== 'idle'}
                onClick={handleBuy}
                className={[
                  'relative overflow-hidden inline-flex items-center justify-center gap-2 w-full h-10 rounded-xl text-[12px] font-bold tracking-[0.2px] transition active:scale-[0.99] mt-1.5',
                  ready && status === 'idle'
                    ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_6px_18px_-6px_rgba(201,162,39,0.5)] hover:-translate-y-px'
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
                      <Hash size={13} strokeWidth={2.6} />
                      {ready
                        ? `Pay · ${formatNGN(num)}`
                        : !provider
                          ? 'Pick a provider'
                          : !validAccount
                            ? `Enter ${cat.accountLabel.toLowerCase()}`
                            : !validAmount
                              ? 'Enter amount'
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
                        <Loader2 size={13} strokeWidth={2.6} />
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
                      <Check size={13} strokeWidth={3} />
                      {category === 'electricity' ? 'Token sent via SMS' : 'Payment successful'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <p className="inline-flex items-center justify-center gap-1 text-[10px] text-[var(--c-text-muted)] mt-1">
                <ShieldCheck size={9} className="text-brand-accent" />
                Receipts saved for 7 years
              </p>
            </div>
          </article>

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-[var(--c-border)]">
              <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)]">
                <Clock size={11} className="text-brand-accent" /> Recent bills
              </h3>
              <span className="text-[9.5px] text-[var(--c-text-muted)]">
                Tap to repeat
              </span>
            </header>
            <ul className="list-none m-0 p-0">
              {RECENT_BILLS.map((b, i) => {
                const provs = PROVIDERS[b.cat] || []
                const p = provs.find(x => x.id === b.provider)
                return (
                  <li key={b.id} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                    <button
                      type="button"
                      onClick={() => pickRecent(b)}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-left hover:bg-[var(--c-surface-soft)] transition"
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.05)] shrink-0">
                        {p?.logo
                          ? <img src={p.logo} alt={p.label} className="w-full h-full object-contain" />
                          : <span className="text-[9.5px] font-black text-[var(--c-text-muted)]">?</span>}
                      </span>
                      <div className="flex-1 min-w-0 leading-tight">
                        <p className="text-[11.5px] font-semibold text-[var(--c-text)] m-0 truncate">
                          {p?.label || b.provider}
                        </p>
                        <p className="text-[10px] font-mono text-[var(--c-text-muted)] m-0 mt-0.5 tabular-nums truncate">
                          {b.account} · {b.when}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold tabular-nums text-[var(--c-text)] whitespace-nowrap shrink-0">
                        {formatNGN(b.amount)}
                      </span>
                      <ChevronRight size={11} className="text-[var(--c-text-faint)] shrink-0" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </article>

          <article className="rounded-xl border border-[var(--c-border-soft)] bg-[var(--c-surface-soft)] p-3 flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
              <Info size={12} />
            </span>
            <div className="leading-snug">
              <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">
                Schedule recurring bills
              </p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Auto-pay before due date — manage in <span className="text-brand-accent font-semibold">Subscriptions</span>.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

function SummaryRow({ label, value, mono, bold, accent, hint }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[10.5px] text-[var(--c-text-muted)]">
        {label}
      </span>
      <span
        className={[
          'whitespace-nowrap text-right max-w-[60%] truncate',
          mono ? 'font-mono text-[11.5px]' : 'text-[11.5px]',
          bold ? 'font-bold text-[var(--c-text)]' : '',
          accent ? 'font-bold text-brand-accent' : '',
          !bold && !accent ? 'font-semibold text-[var(--c-text)]' : '',
        ].join(' ')}
      >
        {value}
        {hint && (
          <span className="block text-[9.5px] text-[var(--c-text-muted)] font-medium mt-0.5">
            {hint}
          </span>
        )}
      </span>
    </div>
  )
}
