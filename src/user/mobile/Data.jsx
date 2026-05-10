import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Sparkles, Phone, Check, ShieldCheck, Wifi, Info, X, Loader2,
  Clock, Zap,
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

const PREFIX_MAP = {
  mtn:     ['0803','0806','0813','0816','0810','0814','0903','0906','0703','0706','0704','0913','0916'],
  airtel:  ['0802','0808','0812','0708','0902','0901','0907','0904','0912'],
  glo:     ['0805','0807','0815','0811','0905','0915'],
  t2mobile: ['0809','0817','0818','0908','0909'],
}

const PLANS = {
  mtn: [
    { id: 'mtn-d-100', type: 'daily',   volume: '100 MB', validity: '1 day',  price: 100,  tag: null },
    { id: 'mtn-d-300', type: 'daily',   volume: '350 MB', validity: '1 day',  price: 200,  tag: null },
    { id: 'mtn-w-500', type: 'weekly',  volume: '500 MB', validity: '3 days', price: 300,  tag: null },
    { id: 'mtn-w-1g',  type: 'weekly',  volume: '1.5 GB', validity: '7 days', price: 1000, tag: 'Popular' },
    { id: 'mtn-m-3g',  type: 'monthly', volume: '3 GB',   validity: '30 days', price: 1500, tag: null },
    { id: 'mtn-m-6g',  type: 'monthly', volume: '6 GB',   validity: '30 days', price: 2500, tag: null },
    { id: 'mtn-m-15g', type: 'monthly', volume: '15 GB',  validity: '30 days', price: 5000, tag: 'Best value' },
    { id: 'mtn-m-40g', type: 'monthly', volume: '40 GB',  validity: '30 days', price: 10000, tag: null },
  ],
  airtel: [
    { id: 'air-d-100', type: 'daily',   volume: '100 MB', validity: '1 day',  price: 100,  tag: null },
    { id: 'air-w-1g',  type: 'weekly',  volume: '1 GB',   validity: '7 days', price: 500,  tag: 'Popular' },
    { id: 'air-m-1.5g', type: 'monthly', volume: '1.5 GB', validity: '30 days', price: 1000, tag: null },
    { id: 'air-m-4.5g', type: 'monthly', volume: '4.5 GB', validity: '30 days', price: 2000, tag: null },
    { id: 'air-m-10g',  type: 'monthly', volume: '10 GB',  validity: '30 days', price: 3000, tag: 'Best value' },
    { id: 'air-m-25g',  type: 'monthly', volume: '25 GB',  validity: '30 days', price: 6000, tag: null },
  ],
  glo: [
    { id: 'glo-d-200', type: 'daily',   volume: '200 MB', validity: '1 day',  price: 150,  tag: null },
    { id: 'glo-w-1g',  type: 'weekly',  volume: '1 GB',   validity: '7 days', price: 500,  tag: null },
    { id: 'glo-m-2.5g', type: 'monthly', volume: '2.5 GB', validity: '30 days', price: 1000, tag: 'Popular' },
    { id: 'glo-m-5.8g', type: 'monthly', volume: '5.8 GB', validity: '30 days', price: 2000, tag: null },
    { id: 'glo-m-13g',  type: 'monthly', volume: '13.25 GB', validity: '30 days', price: 5000, tag: 'Best value' },
  ],
  t2mobile: [
    { id: 't2-d-100', type: 'daily',   volume: '100 MB', validity: '1 day',  price: 100,  tag: null },
    { id: 't2-w-650', type: 'weekly',  volume: '650 MB', validity: '7 days', price: 500,  tag: null },
    { id: 't2-m-1.5g', type: 'monthly', volume: '1.5 GB', validity: '30 days', price: 1000, tag: 'Popular' },
    { id: 't2-m-4.5g', type: 'monthly', volume: '4.5 GB', validity: '30 days', price: 2000, tag: null },
    { id: 't2-m-11g',  type: 'monthly', volume: '11 GB',  validity: '30 days', price: 4000, tag: 'Best value' },
  ],
}

const TYPE_TABS = [
  { id: 'all',     label: 'All' },
  { id: 'daily',   label: 'Daily' },
  { id: 'weekly',  label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
]

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

export default function MobileData() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [manualNet, setManualNet] = useState(null)
  const [planId, setPlanId] = useState(null)
  const [tab, setTab] = useState('all')
  const [status, setStatus] = useState('idle')

  const detected = detectNetwork(phone)
  const activeNet = manualNet || detected
  const networkInfo = NETWORKS.find(n => n.id === activeNet)

  const networkPlans = activeNet ? PLANS[activeNet] || [] : []
  const visiblePlans = tab === 'all'
    ? networkPlans
    : networkPlans.filter(p => p.type === tab)

  const selectedPlan = networkPlans.find(p => p.id === planId)

  const validPhone = phone.length === 11 && phone.startsWith('0')
  const ready = validPhone && activeNet && selectedPlan

  function handlePhone(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 11)
    setPhone(v)
    setManualNet(null)
    setPlanId(null)
  }

  function pickNetwork(id) {
    if (id !== activeNet) setPlanId(null)
    setManualNet(id)
  }

  function handleBuy() {
    if (!ready || status !== 'idle') return
    setStatus('processing')
    setTimeout(() => {
      setStatus('done')
      setTimeout(() => {
        setStatus('idle')
        setPhone('')
        setPlanId(null)
        setManualNet(null)
      }, 1600)
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
          <Sparkles size={11} /> Stay online
        </p>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
          Buy data
        </h1>
        <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 mt-1.5 leading-snug">
          Pick a plan for any Nigerian network · activates instantly.
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
                  onClick={() => { setPhone(''); setManualNet(null); setPlanId(null) }}
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
                onClick={() => pickNetwork(n.id)}
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
                  <img src={n.logo} alt={n.label} className="w-full h-full rounded-full object-contain" />
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
          <h3 className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0">
            Data plans
          </h3>
          {networkInfo && (
            <span className="text-[10px] text-[var(--c-text-muted)] tabular-nums">
              {visiblePlans.length} {visiblePlans.length === 1 ? 'plan' : 'plans'}
            </span>
          )}
        </div>

        <div className="inline-flex p-1 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] mb-2">
          {TYPE_TABS.map(t => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={[
                  'px-3 py-1.5 rounded-xl text-[10.5px] font-bold tracking-[0.2px] transition',
                  active
                    ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_3px_10px_rgba(201,162,39,0.28)]'
                    : 'text-[var(--c-text-muted)] hover:text-[var(--c-text)]',
                ].join(' ')}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {!activeNet && (
          <div className="rounded-2xl bg-[var(--c-surface)] border border-dashed border-[var(--c-border)] p-6 flex flex-col items-center text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent mb-2">
              <Wifi size={20} />
            </span>
            <p className="text-[12.5px] font-semibold text-[var(--c-text)] m-0">
              Pick a network to view plans
            </p>
            <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5 max-w-[240px]">
              Enter a phone number or tap a carrier above.
            </p>
          </div>
        )}

        {activeNet && visiblePlans.length === 0 && (
          <div className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-5 text-center">
            <p className="text-[12px] text-[var(--c-text-muted)] m-0">
              No {tab} plans for {networkInfo?.label}.
            </p>
          </div>
        )}

        {activeNet && visiblePlans.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {visiblePlans.map(plan => {
              const active = planId === plan.id
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setPlanId(plan.id)}
                  className={[
                    'relative overflow-hidden flex flex-col items-center gap-1 p-2 rounded-xl text-center transition active:scale-[0.96]',
                    active
                      ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border-strong)]'
                      : 'bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                  ].join(' ')}
                >
                  {active && (
                    <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-12 h-12 rounded-full bg-brand-accent/[0.22] blur-xl" />
                  )}
                  {plan.tag && (
                    <span
                      aria-label={plan.tag}
                      title={plan.tag}
                      className="absolute top-1 right-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-brand-accent text-brand-primary text-[8px] font-black shadow-[0_2px_6px_rgba(201,162,39,0.5)]"
                    >
                      ★
                    </span>
                  )}
                  <span className="relative text-[12px] font-black text-[var(--c-text)] tracking-[-0.3px] leading-none mt-0.5">
                    {plan.volume}
                  </span>
                  <span className="relative inline-flex items-center gap-0.5 text-[9px] text-[var(--c-text-muted)] font-medium leading-none">
                    <Clock size={8} className="text-brand-accent" />
                    {plan.validity}
                  </span>
                  <span className="relative text-[11.5px] font-black text-brand-accent tabular-nums tracking-[-0.2px] leading-none mt-0.5">
                    {formatNGN(plan.price)}
                  </span>
                  {active && (
                    <span className="absolute bottom-1 left-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-brand-accent text-brand-primary">
                      <Check size={8} strokeWidth={3.2} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
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
                ? `Buy ${selectedPlan.volume} · ${formatNGN(selectedPlan.price)}`
                : !validPhone
                  ? 'Enter phone number'
                  : !activeNet
                    ? 'Pick network'
                    : 'Pick a data plan'}
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
              Activating data…
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
              Data activated
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
            Plans activate instantly
          </p>
          <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Data carries forward when you renew the same plan before expiry.
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
