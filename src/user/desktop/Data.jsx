import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Phone, Check, ShieldCheck, Zap, Info, X, Loader2,
  Wallet, Clock, Receipt, ChevronRight, Wifi,
} from 'lucide-react'
import mtnLogo from '../../assets/mtn.png'
import airtelLogo from '../../assets/airtel.png'
import gloLogo from '../../assets/glo.png'
import t2Logo from '../../assets/t2.png'
import useData, { TYPE_TABS, CASHBACK_RATE } from '../../hooks/useData'
import { useAlert } from '../../components/ui/Alert'
import PinModal from '../../components/ui/PinModal'

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

export default function DesktopData() {
  const { alert } = useAlert()
  const { recentNumbers, recentLoading, buying, buy, variations, variationsLoading, fetchVariations, tab, setTab } = useData()

  const [phone, setPhone] = useState('')
  const [manualNet, setManualNet] = useState('mtn')
  const [planId, setPlanId] = useState(null)
  const [pinOpen, setPinOpen] = useState(false)

  const detected = detectNetwork(phone)
  const activeNet = manualNet || detected
  const networkInfo = NETWORKS.find(n => n.id === activeNet)

  useEffect(() => {
    if (activeNet) fetchVariations(activeNet)
  }, [activeNet, fetchVariations])

  const networkPlans = activeNet ? (variations[activeNet] ?? []) : []
  const visiblePlans = tab === 'hot'
    ? networkPlans.filter(p => p.hot)
    : networkPlans.filter(p => p.type === tab)

  const selectedPlan = networkPlans.find(p => p.id === planId)
  const validPhone = phone.length === 11 && phone.startsWith('0')
  const ready = validPhone && activeNet && selectedPlan
  const cashback = selectedPlan ? Math.round(selectedPlan.price * CASHBACK_RATE) : 0

  function handlePhone(e) {
    setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))
    setPlanId(null)
  }

  function pickNetwork(id) {
    if (id !== activeNet) setPlanId(null)
    setManualNet(id)
  }

  function pickRecent(r) {
    setPhone(r.phone)
    setManualNet(null)
    setPlanId(null)
  }

  function handleBuy() {
    if (!ready || buying) return
    setPinOpen(true)
  }

  async function handlePinConfirm(pin) {
    const result = await buy({
      phone,
      network: activeNet,
      variationCode: selectedPlan.variationCode,
      amount: selectedPlan.amount,
      pin,
    })
    setPinOpen(false)
    if (result.success) {
      await alert({ type: 'success', title: 'Data activated!', message: `${selectedPlan.volume} sent to ${phone}.` })
      setPhone('')
      setPlanId(null)
      setManualNet(null)
    } else {
      alert({ type: 'error', title: 'Purchase failed', message: result.message })
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
            <Sparkles size={10} /> Stay online
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Buy data
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Pick a plan for any Nigerian network · activates instantly.
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
                      onClick={() => { setPhone(''); setManualNet(null); setPlanId(null) }}
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
                      onClick={() => pickNetwork(n.id)}
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
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <div>
                <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">
                  Data plans
                </h2>
                {networkInfo && (
                  <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                    {visiblePlans.length} {visiblePlans.length === 1 ? 'plan' : 'plans'} for {networkInfo.label}
                  </p>
                )}
              </div>
              <div className="inline-flex flex-wrap gap-0.5 p-0.5 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
                {TYPE_TABS.filter(t =>
                  t.id === 'hot'
                    ? networkPlans.some(p => p.hot)
                    : networkPlans.some(p => p.type === t.id)
                ).map(t => {
                  const active = tab === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTab(t.id)}
                      className={[
                        'px-2.5 py-1 rounded-md text-[10px] font-bold tracking-[0.2px] transition',
                        active
                          ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_2px_8px_rgba(201,162,39,0.28)]'
                          : 'text-[var(--c-text-muted)] hover:text-[var(--c-text)]',
                      ].join(' ')}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {!activeNet && (
              <div className="rounded-xl bg-[var(--c-surface-soft)] border border-dashed border-[var(--c-border)] p-6 flex flex-col items-center text-center">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent mb-2">
                  <Wifi size={16} />
                </span>
                <p className="text-[12px] font-semibold text-[var(--c-text)] m-0">
                  Pick a network to view plans
                </p>
                <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">
                  Enter a phone number or select a carrier above.
                </p>
              </div>
            )}

            {activeNet && variationsLoading && !variations[activeNet] && (
              <div className="flex items-center justify-center py-8 gap-2 text-[var(--c-text-muted)]">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  className="inline-flex text-brand-accent"
                >
                  <Loader2 size={18} />
                </motion.span>
                <span className="text-[11px]">Loading plans…</span>
              </div>
            )}

            {activeNet && !variationsLoading && visiblePlans.length === 0 && (
              <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] p-5 text-center">
                <p className="text-[11.5px] text-[var(--c-text-muted)] m-0">
                  No {tab} plans for {networkInfo?.label}.
                </p>
              </div>
            )}

            {activeNet && visiblePlans.length > 0 && (
              <div className="grid grid-cols-2 min-[640px]:grid-cols-3 min-[960px]:grid-cols-4 gap-1.5">
                {visiblePlans.map(plan => {
                  const active = planId === plan.id
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setPlanId(plan.id)}
                      className={[
                        'relative overflow-hidden flex flex-col items-center gap-0.5 p-2.5 rounded-lg text-center transition active:scale-[0.97]',
                        active
                          ? 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border-strong)]'
                          : 'bg-[var(--c-surface-soft)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                      ].join(' ')}
                    >
                      {active && (
                        <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-12 h-12 rounded-full bg-brand-accent/[0.22] blur-xl" />
                      )}
                      {plan.bonus && (
                        <span className="absolute top-1 left-1 right-1 inline-flex items-center justify-center px-1 py-0.5 rounded-md bg-[var(--c-surface)] border border-[var(--c-border)] text-[7.5px] font-bold text-brand-accent tracking-[0.2px] leading-none truncate">
                          {plan.bonus}
                        </span>
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
                      {plan.type === 'other' ? (
                        <span className="relative text-[9px] font-semibold text-[var(--c-text)] leading-snug mt-1 text-center line-clamp-3">
                          {plan.name}
                        </span>
                      ) : (
                        <>
                          <span className={`relative text-[12.5px] font-black text-[var(--c-text)] tracking-[-0.3px] leading-none ${plan.bonus ? 'mt-4' : 'mt-1'}`}>
                            {plan.volume}
                          </span>
                          {plan.validity !== '—' && (
                            <span className="relative inline-flex items-center gap-0.5 text-[9px] text-[var(--c-text-muted)] font-medium leading-none mt-0.5">
                              <Clock size={8} className="text-brand-accent" />
                              {plan.validity}
                            </span>
                          )}
                        </>
                      )}
                      <span className="relative text-[12px] font-black text-brand-accent tabular-nums tracking-[-0.2px] leading-none mt-1">
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
              <SummaryRow label="Plan"      value={selectedPlan ? `${selectedPlan.volume} · ${selectedPlan.validity}` : '—'} bold />
              <SummaryRow label="Price"     value={selectedPlan ? formatNGN(selectedPlan.price) : '—'} />
              <div className="border-t border-dashed border-[var(--c-border)] my-0.5" />
              <SummaryRow
                label="Cashback"
                value={selectedPlan ? `+${formatNGN(cashback)}` : '—'}
                accent
                hint={<><Wallet size={8} className="inline -mt-0.5 mr-0.5" /> to wallet</>}
              />
              <div className="flex items-center justify-between mt-0.5 pt-2.5 border-t border-[var(--c-border)]">
                <p className="text-[10px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] m-0">
                  Total
                </p>
                <p className="text-[16px] font-black tabular-nums text-[var(--c-text)] tracking-[-0.3px] m-0">
                  {selectedPlan ? formatNGN(selectedPlan.price) : '₦0'}
                </p>
              </div>

              <button
                type="button"
                disabled={!ready || buying}
                onClick={handleBuy}
                className={[
                  'relative overflow-hidden inline-flex items-center justify-center gap-2 w-full h-10 rounded-xl text-[12px] font-bold tracking-[0.2px] transition active:scale-[0.99] mt-1.5',
                  ready && !buying
                    ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_6px_18px_-6px_rgba(201,162,39,0.5)] hover:-translate-y-px'
                    : 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)] cursor-not-allowed',
                ].join(' ')}
              >
                <AnimatePresence mode="wait">
                  {buying ? (
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
                      Activating data…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Zap size={13} strokeWidth={2.6} />
                      {ready
                        ? `Buy ${selectedPlan.volume} · ${formatNGN(selectedPlan.price)}`
                        : !validPhone
                          ? 'Enter phone number'
                          : !activeNet
                            ? 'Pick network'
                            : 'Pick a data plan'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <p className="inline-flex items-center justify-center gap-1 text-[10px] text-[var(--c-text-muted)] mt-1">
                <ShieldCheck size={9} className="text-brand-accent" />
                Activates instantly
              </p>
            </div>
          </article>

          {recentLoading || recentNumbers.length > 0 ? (
            <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
              <header className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-[var(--c-border)]">
                <h3 className="inline-flex items-center gap-1.5 text-[11.5px] font-bold m-0 text-[var(--c-text)]">
                  <Clock size={11} className="text-brand-accent" /> Recent numbers
                </h3>
                <span className="text-[9.5px] text-[var(--c-text-muted)]">
                  Tap to use
                </span>
              </header>
              {recentLoading ? (
                <div className="flex items-center justify-center py-5">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    className="inline-flex text-brand-accent"
                  >
                    <Loader2 size={16} />
                  </motion.span>
                </div>
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
                            <p className="text-[11.5px] font-semibold text-[var(--c-text)] m-0 truncate">
                              {net?.label ?? r.net}
                            </p>
                            <p className="text-[10.5px] font-mono text-[var(--c-text-muted)] m-0 mt-0.5 tabular-nums">
                              {formatPhone(r.phone)}
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
          ) : null}

          <article className="rounded-xl border border-[var(--c-border-soft)] bg-[var(--c-surface-soft)] p-3 flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
              <Info size={12} />
            </span>
            <div className="leading-snug">
              <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">
                Auto-renew your plan
              </p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Roll-over keeps unused MB. Manage in <span className="text-brand-accent font-semibold">Subscriptions</span>.
              </p>
            </div>
          </article>
        </div>
      </section>

      <PinModal
        open={pinOpen}
        title="Enter transaction PIN"
        subtitle={selectedPlan ? `Confirm ${selectedPlan.volume} · ${formatNGN(selectedPlan.price)} to ${phone}` : ''}
        loading={buying}
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
