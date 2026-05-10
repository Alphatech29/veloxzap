import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Sparkles, Phone, Check, ShieldCheck, Zap, Info, X, Loader2,
} from 'lucide-react'
import mtnLogo from '../../assets/mtn.png'
import airtelLogo from '../../assets/airtel.png'
import gloLogo from '../../assets/glo.png'
import t2Logo from '../../assets/t2.png'

const NETWORKS = [
  { id: 'mtn',     label: 'MTN',     logo: mtnLogo,    color: '#FFCC00' },
  { id: 'airtel',  label: 'Airtel',  logo: airtelLogo, color: '#ED1C24' },
  { id: 'glo',     label: 'Glo',     logo: gloLogo,    color: '#5BB242' },
  { id: 't2mobile', label: 'T2mobile', logo: t2Logo,   color: '#fe7515' },
]

const PRESETS = [50, 100, 200, 500, 1000, 2000]

const PREFIX_MAP = {
  mtn:     ['0803','0806','0813','0816','0810','0814','0903','0906','0703','0706','0704','0913','0916'],
  airtel:  ['0802','0808','0812','0708','0902','0901','0907','0904','0912'],
  glo:     ['0805','0807','0815','0811','0905','0915'],
  t2mobile: ['0809','0817','0818','0908','0909'],
}

function detectNetwork(phone) {
  const p = phone.replace(/\D/g, '').replace(/^234/, '0')
  if (p.length < 4 || !p.startsWith('0')) return null
  const prefix = p.slice(0, 4)
  for (const [id, prefixes] of Object.entries(PREFIX_MAP)) {
    if (prefixes.includes(prefix)) return id
  }
  return null
}

function formatPhone(raw) {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 4) return d
  if (d.length <= 7) return `${d.slice(0,4)} ${d.slice(4)}`
  return `${d.slice(0,4)} ${d.slice(4,7)} ${d.slice(7,11)}`
}

function formatNGN(n) {
  return '₦' + n.toLocaleString('en-NG')
}

export default function MobileAirtime() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [manualNet, setManualNet] = useState(null)
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('idle')

  const detected = detectNetwork(phone)
  const activeNet = manualNet || detected
  const networkInfo = NETWORKS.find(n => n.id === activeNet)

  const num = Number(amount) || 0
  const validPhone = phone.length === 11 && phone.startsWith('0')
  const validAmount = num >= 50 && num <= 50000
  const ready = validPhone && validAmount && activeNet

  function handlePhone(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 11)
    setPhone(v)
    setManualNet(null)
  }

  function handleBuy() {
    if (!ready || status !== 'idle') return
    setStatus('processing')
    setTimeout(() => {
      setStatus('done')
      setTimeout(() => {
        setStatus('idle')
        setPhone('')
        setAmount('')
        setManualNet(null)
      }, 1600)
    }, 900)
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
          <Sparkles size={11} /> Top up
        </p>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
          Buy airtime
        </h1>
        <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 leading-snug">
          Recharge any Nigerian network in seconds · cashback to wallet.
        </p>
      </div>

      <section>
        <p className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
          Phone number
        </p>
        <div className="relative rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_4px_rgba(201,162,39,0.10)] transition overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl transition-opacity duration-300"
            style={{
              opacity: networkInfo ? 0.55 : 0,
              background: networkInfo?.color || 'transparent',
            }}
          />
          <div className="relative flex items-center gap-2.5 p-1">
            <AnimatePresence mode="wait" initial={false}>
              {networkInfo ? (
                <motion.span
                  key={`net-${networkInfo.id}`}
                  initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.6, opacity: 0, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-[var(--c-border)] shadow-[0_4px_12px_rgba(0,0,0,0.18)] shrink-0 overflow-hidden p-1"
                >
                  <img src={networkInfo.logo} alt={networkInfo.label} className="w-full h-full object-contain rounded-full" />
                </motion.span>
              ) : (
                <motion.span
                  key="phone-icon"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] shrink-0"
                >
                  <Phone size={16} />
                </motion.span>
              )}
            </AnimatePresence>

            <div className="flex-1 min-w-0">
              <input
                type="tel"
                inputMode="numeric"
                value={formatPhone(phone)}
                onChange={handlePhone}
                placeholder="0802 123 4567"
                className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[18px] font-bold tabular-nums tracking-[0.4px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                style={{ boxShadow: 'none', WebkitTapHighlightColor: 'transparent' }}
              />

            </div>

            <AnimatePresence initial={false}>
              {phone && (
                <motion.button
                  key="clear"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                  type="button"
                  onClick={() => { setPhone(''); setManualNet(null) }}
                  aria-label="Clear"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-border)] active:scale-90 transition shrink-0"
                >
                  <X size={13} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
          Network
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {NETWORKS.map(n => {
            const active = activeNet === n.id
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setManualNet(n.id)}
                className={[
                  'relative overflow-hidden flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition active:scale-[0.96]',
                  active
                    ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border-strong)]'
                    : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                ].join(' ')}
              >
                {active && (
                  <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-10 h-10 rounded-full bg-brand-accent/[0.18] blur-xl" />
                )}
                <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-[var(--c-border)] overflow-hidden p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                  <img src={n.logo} alt={n.label} className="w-full h-full object-contain rounded-full" />
                </span>
                <span className="relative text-[10.5px] font-bold text-[var(--c-text)]">
                  {n.label}
                </span>
                {active && (
                  <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-accent text-brand-primary">
                    <Check size={9} strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
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
                {active && (
                  <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white/20 blur-xl" />
                )}
                <span
                  className={[
                    'relative text-[8.5px] font-bold uppercase tracking-[0.9px]',
                    active ? 'text-brand-primary/70' : 'text-[var(--c-text-muted)]',
                  ].join(' ')}
                >
                  NGN
                </span>
                <span className="relative text-[15px] font-black tabular-nums tracking-[-0.3px]">
                  {v.toLocaleString('en-NG')}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative mt-2 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_4px_rgba(201,162,39,0.10)] transition overflow-hidden">
          <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-brand-accent/[0.08] blur-2xl" />
          <div className="relative flex items-center gap-2.5 p-1.5">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent text-[14px] font-black shrink-0">
              ₦
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={amount ? Number(amount).toLocaleString('en-NG') : ''}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="Enter custom amount"
              className="flex-1 min-w-0 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[15px] font-bold tracking-[-0.2px] tabular-nums text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-semibold placeholder:tracking-normal"
              style={{ boxShadow: 'none', WebkitTapHighlightColor: 'transparent' }}
            />
            <AnimatePresence initial={false}>
              {num > 0 && (
                <motion.span
                  key="ngn-suffix"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.18 }}
                  className="text-[10px] uppercase tracking-[1.1px] font-bold text-brand-accent shrink-0"
                >
                  NGN
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

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
              <Zap size={14} strokeWidth={2.6} />
              {ready
                ? `Top up · ${formatNGN(num)}`
                : !validPhone
                  ? 'Enter phone number'
                  : !activeNet
                    ? 'Pick network'
                    : !validAmount
                      ? 'Enter amount (₦50 – ₦50,000)'
                      : 'Top up'}
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
              Sending airtime…
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
              Airtime delivered
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
            Instant delivery
          </p>
          <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Wrong number? Recharges are non-refundable — double-check before sending.
          </p>
        </div>
      </div>

      <p className="inline-flex items-center justify-center gap-1.5 text-[10.5px] text-[var(--c-text-muted)] mt-1 mb-2">
        <ShieldCheck size={11} className="text-brand-accent" />
        Secured by VeloxZap · NCC licensed VAS
      </p>
    </div>
  )
}
