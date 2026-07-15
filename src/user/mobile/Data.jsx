import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, Check, ShieldCheck, Wifi, Info, X, Loader2,
  Clock, Zap, ChevronRight, Receipt,
} from 'lucide-react'
import mtnLogo from '../../assets/mtn.png'
import airtelLogo from '../../assets/airtel.png'
import gloLogo from '../../assets/glo.png'
import t2Logo from '../../assets/t2.png'
import useData, { TYPE_TABS } from '../../hooks/useData'
import { useAlert } from '../../components/ui/Alert'
import PinModal from '../../components/ui/PinModal'
import BottomSheet, { SheetRow } from '../../components/internalUI/BottomSheet'
import MobilePageHeader from '../../components/partials/MobilePageHeader'

const NETWORKS = [
  { id: 'mtn',      label: 'MTN',      logo: mtnLogo,    color: '#FFCC00' },
  { id: 'airtel',   label: 'Airtel',   logo: airtelLogo, color: '#ED1C24' },
  { id: 'glo',      label: 'Glo',      logo: gloLogo,    color: '#5BB242' },
  { id: 't2mobile', label: 'T2mobile', logo: t2Logo,     color: '#fe7515' },
]

const PREFIX_MAP = {
  mtn:      ['0803','0806','0813','0816','0810','0814','0903','0906','0703','0706','0704','0913','0916'],
  airtel:   ['0802','0808','0812','0708','0902','0901','0907','0904','0912'],
  glo:      ['0805','0807','0815','0811','0905','0915'],
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

export default function MobileData() {
  const { alert }  = useAlert()
  const {
    recentNumbers, recentLoading,
    variations, variationsLoading,
    buying, buy,
    fetchVariations,
    tab, setTab,
  } = useData()

  const [phone,     setPhone]     = useState('')
  const [manualNet, setManualNet] = useState('mtn')
  const [planId,    setPlanId]    = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [pinOpen,   setPinOpen]   = useState(false)

  const detected    = detectNetwork(phone)
  const activeNet   = manualNet || detected
  const networkInfo = NETWORKS.find(n => n.id === activeNet)

  useEffect(() => {
    if (activeNet) fetchVariations(activeNet)
  }, [activeNet, fetchVariations])

  const networkPlans = activeNet ? (variations[activeNet] ?? []) : []
  const visiblePlans = tab === 'hot'
    ? networkPlans.filter(p => p.hot)
    : networkPlans.filter(p => p.type === tab)

  const selectedPlan = networkPlans.find(p => p.id === planId)
  const validPhone   = phone.length === 11 && phone.startsWith('0')
  const ready        = validPhone && activeNet && selectedPlan

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

  function pickRecent(r) {
    setPhone(r.phone)
    setManualNet(r.net)
    setPlanId(null)
  }

  function handleBuy() {
    if (!ready || buying) return
    setSheetOpen(true)
  }

  async function handlePinConfirm(pin) {
    const result = await buy({
      phone,
      network: activeNet,
      variationCode: selectedPlan.variationCode,
      amount: selectedPlan.amount,
      planName: selectedPlan.name,
      pin,
    })
    setPinOpen(false)
    setSheetOpen(false)
    if (result.success) {
      await alert({ type: 'success', title: 'Data activated!', message: `${selectedPlan.volume} sent to ${phone}.` })
      setPhone('')
      setPlanId(null)
      setManualNet('mtn')
    } else {
      alert({ type: 'error', title: 'Purchase failed', message: result.message })
    }
  }

  return (
    <div className="flex flex-col gap-5 pb-6">

      <MobilePageHeader title="Buy data" />
      <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 leading-snug">
        Pick a plan for any Nigerian network · activates instantly.
      </p>

      {/* Phone input */}
      <section>
        <p className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
          Phone number
        </p>
        <div className="relative rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_4px_rgba(201,162,39,0.10)] transition overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl transition-opacity duration-300"
            style={{ opacity: networkInfo ? 0.55 : 0, background: networkInfo?.color || 'transparent' }}
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
                  onClick={() => { setPhone(''); setManualNet('mtn'); setPlanId(null) }}
                  aria-label="Clear"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
                >
                  <X size={13} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Network picker */}
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
                    : 'bg-[var(--c-surface)] border border-[var(--c-border)]',
                ].join(' ')}
              >
                {active && <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-10 h-10 rounded-full bg-brand-accent/[0.18] blur-xl" />}
                <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-[var(--c-border)] overflow-hidden p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                  <img src={n.logo} alt={n.label} className="w-full h-full rounded-full object-contain" />
                </span>
                <span className="relative text-[10.5px] font-bold text-[var(--c-text)]">{n.label}</span>
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

      {/* Plans */}
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

        {/* Type tabs — only show tabs that have plans */}
        {networkPlans.length > 0 && (
          <div className="flex overflow-x-auto gap-1.5 pb-1 mb-2 scrollbar-none">
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
                    'px-3 py-1.5 rounded-xl text-[10.5px] font-bold tracking-[0.2px] transition whitespace-nowrap shrink-0',
                    active
                      ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_3px_10px_rgba(201,162,39,0.28)]'
                      : 'bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)]',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        )}

        {!activeNet && (
          <div className="rounded-2xl bg-[var(--c-surface)] border border-dashed border-[var(--c-border)] p-6 flex flex-col items-center text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent mb-2">
              <Wifi size={20} />
            </span>
            <p className="text-[12.5px] font-semibold text-[var(--c-text)] m-0">Pick a network to view plans</p>
            <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5 max-w-[240px]">Enter a phone number or tap a carrier above.</p>
          </div>
        )}

        {activeNet && variationsLoading && !variations[activeNet] && (
          <div className="flex items-center justify-center gap-2 py-8 text-[var(--c-text-muted)]">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              className="inline-flex text-brand-accent"
            >
              <Loader2 size={20} />
            </motion.span>
            <span className="text-[12px]">Loading plans…</span>
          </div>
        )}

        {activeNet && !variationsLoading && visiblePlans.length === 0 && networkPlans.length > 0 && (
          <div className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-5 text-center">
            <p className="text-[12px] text-[var(--c-text-muted)] m-0">No {tab} plans for {networkInfo?.label}.</p>
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
                      : 'bg-[var(--c-surface)] border border-[var(--c-border)]',
                  ].join(' ')}
                >
                  {active && <span aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-12 h-12 rounded-full bg-brand-accent/[0.22] blur-xl" />}

                  {plan.bonus && (
                    <span className="absolute top-1 left-1 right-1 inline-flex items-center justify-center px-1 py-0.5 rounded-md bg-[var(--c-surface)] border border-[var(--c-border)] text-[7px] font-bold text-brand-accent tracking-[0.2px] leading-none truncate">
                      {plan.bonus}
                    </span>
                  )}

                  {plan.tag && !plan.bonus && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-brand-accent text-brand-primary text-[8px] font-black shadow-[0_2px_6px_rgba(201,162,39,0.5)]">★</span>
                  )}

                  {plan.type === 'other' ? (
                    <span className={`relative text-[8px] font-semibold text-[var(--c-text)] leading-snug text-center line-clamp-3 ${plan.bonus ? 'mt-4' : 'mt-0.5'}`}>
                      {plan.name}
                    </span>
                  ) : (
                    <>
                      <span className={`relative text-[12px] font-black text-[var(--c-text)] tracking-[-0.3px] leading-none ${plan.bonus ? 'mt-4' : 'mt-0.5'}`}>
                        {plan.volume}
                      </span>
                      {plan.validity !== '—' && (
                        <span className="relative inline-flex items-center gap-0.5 text-[9px] text-[var(--c-text-muted)] font-medium leading-none">
                          <Clock size={8} className="text-brand-accent" />
                          {plan.validity}
                        </span>
                      )}
                    </>
                  )}

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

      {/* Recent numbers */}
      {(recentLoading || recentNumbers.length > 0) && (
        <section>
          <h3 className="text-[10px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-1.5 px-1">
            Recent numbers
          </h3>
          {recentLoading ? (
            <div className="flex justify-center py-3">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} className="inline-flex text-brand-accent">
                <Loader2 size={16} />
              </motion.span>
            </div>
          ) : (
            <div className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden divide-y divide-[var(--c-border)]">
              {recentNumbers.map(r => {
                const net = NETWORKS.find(n => n.id === r.net)
                return (
                  <button
                    key={r.phone}
                    type="button"
                    onClick={() => pickRecent(r)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-[var(--c-surface-soft)] transition"
                  >
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[var(--c-border)] overflow-hidden p-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.06)] shrink-0">
                      {net?.logo
                        ? <img src={net.logo} alt={net.label} className="w-full h-full object-contain rounded-full" />
                        : <span className="text-[9px] font-black text-[var(--c-text-muted)]">?</span>}
                    </span>
                    <div className="flex-1 min-w-0 leading-tight">
                      <p className="text-[12px] font-semibold text-[var(--c-text)] m-0">{net?.label ?? r.net}</p>
                      <p className="text-[11px] font-mono text-[var(--c-text-muted)] m-0 mt-0.5 tabular-nums">{formatPhone(r.phone)}</p>
                    </div>
                    <ChevronRight size={13} className="text-[var(--c-text-faint)] shrink-0" />
                  </button>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* Buy button */}
      <button
        type="button"
        disabled={!ready || buying}
        onClick={handleBuy}
        className={[
          'relative overflow-hidden inline-flex items-center justify-center gap-2 w-full h-12 rounded-2xl text-[13.5px] font-bold tracking-[0.2px] transition active:scale-[0.99]',
          ready && !buying
            ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_8px_22px_-6px_rgba(201,162,39,0.5)]'
            : 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)] cursor-not-allowed',
        ].join(' ')}
      >
        <AnimatePresence mode="wait">
          {buying ? (
            <motion.span key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                <Loader2 size={14} strokeWidth={2.6} />
              </motion.span>
              Activating data…
            </motion.span>
          ) : (
            <motion.span key="idle" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-2">
              <Zap size={14} strokeWidth={2.6} />
              {ready
                ? `Buy ${selectedPlan.volume} · ${formatNGN(selectedPlan.price)}`
                : !validPhone ? 'Enter phone number'
                : !activeNet  ? 'Pick network'
                : 'Pick a data plan'}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] p-3 flex items-start gap-2.5">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-[9px] bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
          <Info size={13} />
        </span>
        <div className="leading-snug">
          <p className="text-[11.5px] font-semibold text-[var(--c-text)] m-0">Plans activate instantly</p>
          <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">Data carries forward when you renew before expiry.</p>
        </div>
      </div>

      <p className="inline-flex items-center justify-center gap-1.5 text-[10.5px] text-[var(--c-text-muted)] mt-1 mb-2">
        <ShieldCheck size={11} className="text-brand-accent" />
        Secured by VeloxZap · NCC licensed VAS
      </p>

      <BottomSheet
        open={sheetOpen && !!selectedPlan}
        onClose={() => !buying && setSheetOpen(false)}
        label="Data purchase"
        title="Order summary"
        closeOnScrimClick={!buying}
      >
        <div className="rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] p-3.5 mx-4 mb-1 flex items-center gap-3">
          {networkInfo && (
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-[var(--c-border)] overflow-hidden p-1 shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <img src={networkInfo.logo} alt={networkInfo.label} className="w-full h-full object-contain rounded-full" />
            </span>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[var(--c-text)] m-0">{formatPhone(phone)}</p>
            <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-0.5">{networkInfo?.label}</p>
          </div>
        </div>

        <div className="mx-4 mt-3 flex flex-col rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
          <SheetRow label="Plan"   value={`${selectedPlan?.volume}${selectedPlan?.validity !== '—' ? ` · ${selectedPlan?.validity}` : ''}`} bold />
          {selectedPlan?.bonus && <SheetRow label="Bonus"  value={selectedPlan.bonus} accent />}
          <SheetRow label="Amount" value={formatNGN(selectedPlan?.price ?? 0)} />
          <div className="h-px bg-[var(--c-border)]" />
          <SheetRow label="Total"  value={formatNGN(selectedPlan?.price ?? 0)} bold accent />
        </div>

        <div className="px-4 mt-4">
          <button
            type="button"
            onClick={() => setPinOpen(true)}
            disabled={buying}
            className="w-full h-12 rounded-2xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[13.5px] font-bold border border-[rgba(232,197,71,0.55)] shadow-[0_6px_18px_-6px_rgba(201,162,39,0.5)] active:scale-[0.99] transition disabled:opacity-60"
          >
            Confirm &amp; Pay
          </button>
        </div>
      </BottomSheet>

      <PinModal
        open={pinOpen}
        title="Enter transaction PIN"
        subtitle={selectedPlan ? `${selectedPlan.volume} · ${formatNGN(selectedPlan.price)} to ${phone}` : ''}
        loading={buying}
        onConfirm={handlePinConfirm}
        onCancel={() => setPinOpen(false)}
      />
    </div>
  )
}

