import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Phone, Check, ShieldCheck, Zap, Info, X, Loader2,
  Wallet, Clock, Receipt, ChevronRight,
} from 'lucide-react'
import { purchaseAirtime, getRecentAirtimeNumbers } from '../../lib/airtime'
import { CASHBACK_RATE } from '../../hooks/useAirtime'
import { useAlert } from '../../components/ui/Alert'
import PinModal from '../../components/ui/PinModal'
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

const PRESETS = [50, 100, 200, 500, 1000, 1500, 2000, 5000]


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

export default function DesktopAirtime() {
  const { alert } = useAlert()
  const [phone, setPhone] = useState('')
  const [manualNet, setManualNet] = useState(null)
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('idle')
  const [pinOpen, setPinOpen] = useState(false)
  const [recentNumbers, setRecentNumbers] = useState([])

  useEffect(() => {
    getRecentAirtimeNumbers().then(r => { if (r.success) setRecentNumbers(r.numbers) })
  }, [])

  const detected = detectNetwork(phone)
  const activeNet = manualNet || detected
  const networkInfo = NETWORKS.find(n => n.id === activeNet)

  const num = Number(amount) || 0
  const validPhone = phone.length === 11 && phone.startsWith('0')
  const validAmount = num >= 50 && num <= 50000
  const ready = validPhone && validAmount && activeNet
  const cashback = Math.round(num * CASHBACK_RATE)

  function handlePhone(e) {
    setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))
  }

  function pickRecent(r) {
    setPhone(r.phone)
    setManualNet(null)
  }

  function handleBuy() {
    if (!ready || status !== 'idle') return
    setPinOpen(true)
  }

  async function handlePinConfirm(pin) {
    setStatus('processing')
    const result = await purchaseAirtime({ phone, amount: num, network: activeNet, pin })
    setStatus('idle')
    setPinOpen(false)
    if (result.success) {
      const savedPhone = phone
      const savedNum = num
      setPhone('')
      setAmount('')
      setManualNet(null)
      getRecentAirtimeNumbers().then(r => { if (r.success) setRecentNumbers(r.numbers) })
      alert({
        type: 'success',
        title: 'Airtime sent!',
        message: `${formatNGN(savedNum)} airtime delivered to ${formatPhone(savedPhone)}.`,
      })
    } else {
      alert({ type: 'error', title: 'Purchase failed', message: result.message })
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
            <Sparkles size={10} /> Top up
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Buy airtime
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Recharge any Nigerian network · {Math.round(CASHBACK_RATE * 100)}% cashback.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
          <ShieldCheck size={10} /> NCC licensed
        </span>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px] mb-2">
              Recipient
            </h2>
            <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
              Phone number
            </p>
            <div className="relative rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition overflow-hidden">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl transition-opacity duration-300"
                style={{
                  opacity: networkInfo ? 0.5 : 0,
                  background: networkInfo?.color || 'transparent',
                }}
              />
              <div className="relative flex items-center gap-2.5 p-2.5">
                <AnimatePresence mode="wait" initial={false}>
                  {networkInfo ? (
                    <motion.span
                      key={`net-${networkInfo.id}`}
                      initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.6, opacity: 0, rotate: 8 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-[var(--c-border)] shadow-[0_3px_10px_rgba(0,0,0,0.15)] shrink-0 overflow-hidden p-0.5"
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
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--c-surface)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] shrink-0"
                    >
                      <Phone size={15} />
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
                    className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[16px] font-bold tabular-nums tracking-[0.3px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                    style={{ boxShadow: 'none' }}
                  />
                  <AnimatePresence initial={false}>
                    {networkInfo && (
                      <motion.p
                        key={`detect-${networkInfo.id}`}
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 2 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.18 }}
                        className="text-[10px] font-bold text-brand-accent m-0 inline-flex items-center gap-1 tracking-[0.2px] overflow-hidden"
                      >
                        <Check size={9} strokeWidth={3} />
                        {networkInfo.label} detected
                      </motion.p>
                    )}
                  </AnimatePresence>
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
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-surface)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-border)] active:scale-90 transition shrink-0"
                    >
                      <X size={12} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
                Network
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {NETWORKS.map(n => {
                  const active = activeNet === n.id
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setManualNet(n.id)}
                      className={[
                        'relative overflow-hidden flex flex-col items-center gap-1 p-2 rounded-xl transition active:scale-[0.97]',
                        active
                          ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border-strong)]'
                          : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                      ].join(' ')}
                    >
                      {active && (
                        <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-10 h-10 rounded-full bg-brand-accent/[0.18] blur-xl" />
                      )}
                      <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
                        <img src={n.logo} alt={n.label} className="w-full h-full rounded-full object-contain" />
                      </span>
                      <span className="relative text-[10px] font-bold text-[var(--c-text)]">
                        {n.label}
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
            </div>
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

            <div className="grid grid-cols-4 gap-1.5">
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
                    {active && (
                      <span aria-hidden className="pointer-events-none absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/20 blur-xl" />
                    )}
                    <span
                      className={[
                        'relative text-[8px] font-bold uppercase tracking-[0.8px]',
                        active ? 'text-brand-primary/70' : 'text-[var(--c-text-muted)]',
                      ].join(' ')}
                    >
                      NGN
                    </span>
                    <span className="relative text-[13px] font-black tabular-nums tracking-[-0.2px]">
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
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="Enter custom amount"
                  className="flex-1 min-w-0 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 appearance-none text-[16px] font-bold tracking-[-0.2px] tabular-nums text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-semibold placeholder:tracking-normal"
                  style={{ boxShadow: 'none' }}
                />
                <span className="text-[9px] uppercase tracking-[1px] font-bold text-[var(--c-text-muted)] shrink-0">
                  ₦50 – ₦50,000
                </span>
              </div>
            </div>
          </article>
        </div>

        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-accent-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)]">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)]">
                <Receipt size={12} className="text-brand-accent" /> Order summary
              </h3>
              {networkInfo && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/70 border border-[var(--c-border-soft)] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[var(--c-text)]">
                  <span className="inline-flex w-3 h-3 rounded-full overflow-hidden bg-white border border-[var(--c-border-soft)]">
                    <img src={networkInfo.logo} alt="" className="w-full h-full object-contain" />
                  </span>
                  {networkInfo.label}
                </span>
              )}
            </header>

            <div className="p-4 flex flex-col gap-2">
              <SummaryRow label="Recipient" value={validPhone ? formatPhone(phone) : '—'} mono />
              <SummaryRow label="Network"   value={networkInfo?.label || '—'} />
              <SummaryRow label="Airtime"   value={num > 0 ? formatNGN(num) : '—'} bold />
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
                              ? 'Enter amount'
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
                </AnimatePresence>
              </button>

              <p className="inline-flex items-center justify-center gap-1 text-[10px] text-[var(--c-text-muted)] mt-1">
                <ShieldCheck size={9} className="text-brand-accent" />
                Secured · Instant delivery
              </p>
            </div>
          </article>

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-[var(--c-border)]">
              <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)]">
                <Clock size={11} className="text-brand-accent" /> Recent numbers
              </h3>
              <span className="text-[9.5px] text-[var(--c-text-muted)]">
                Tap to use
              </span>
            </header>
            {recentNumbers.length === 0 ? (
              <p className="px-4 py-3 text-[11px] text-[var(--c-text-faint)]">
                No recent numbers yet.
              </p>
            ) : (
              <ul className="list-none m-0 p-0">
                {recentNumbers.map((r, i) => {
                  const net = NETWORKS.find(n => n.id === r.net)
                  return (
                    <li key={r.phone} className={i > 0 ? 'border-t border-[var(--c-border)]' : ''}>
                      <button
                        type="button"
                        onClick={() => pickRecent(r)}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left hover:bg-[var(--c-surface-soft)] transition"
                      >
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.05)] shrink-0">
                          {net?.logo
                            ? <img src={net.logo} alt={net.label} className="w-full h-full object-contain rounded-full" />
                            : <span className="text-[9.5px] font-black text-[var(--c-text-muted)]">?</span>}
                        </span>
                        <div className="flex-1 min-w-0 leading-tight">
                          <p className="text-[11.5px] font-mono font-semibold text-[var(--c-text)] m-0 tabular-nums">
                            {formatPhone(r.phone)}
                          </p>
                          <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">
                            {net?.label ?? r.net}
                          </p>
                        </div>
                        <ChevronRight size={11} className="text-[var(--c-text-faint)] shrink-0" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </article>

          <article className="rounded-xl border border-[var(--c-border-soft)] bg-[var(--c-surface-soft)] p-3 flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
              <Info size={12} />
            </span>
            <div className="leading-snug">
              <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">
                Need it on autopilot?
              </p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Set a recurring top-up — manage in <span className="text-brand-accent font-semibold">Subscriptions</span>.
              </p>
            </div>
          </article>
        </div>
      </section>

      <PinModal
        open={pinOpen}
        title="Confirm purchase"
        subtitle={`Enter your PIN to top up ${formatPhone(phone)} with ${formatNGN(num)}`}
        loading={status === 'processing'}
        onConfirm={handlePinConfirm}
        onCancel={() => setPinOpen(false)}
      />
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
          'whitespace-nowrap text-right',
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
