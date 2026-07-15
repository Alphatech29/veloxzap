import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Snowflake, Eye, EyeOff, ListChecks,
  Wifi, Copy, ArrowDownLeft,
} from 'lucide-react'
import useUser from '../../hooks/useUser'
import MobilePageHeader from '../../components/partials/MobilePageHeader'

const CARDS = [
  {
    id: 'ngn',
    label: 'Naira',
    currency: 'NGN',
    symbol: '₦',
    name: 'Virtual Naira',
    balance: 1284750.45,
    last4: '4521',
    full: '5061 2390 8721 4521',
    expiry: '08/29',
    cvv: '328',
    network: 'Verve',
    decimals: 2,
  },
  {
    id: 'usd',
    label: 'Dollar',
    currency: 'USD',
    symbol: '$',
    name: 'Virtual Dollar',
    balance: 320.50,
    last4: '7812',
    full: '4012 3456 9876 7812',
    expiry: '11/29',
    cvv: '149',
    network: 'Visa',
    decimals: 2,
  },
]

const NGN_BG = `radial-gradient(circle at 110% -10%, rgba(201, 162, 39, 0.45), transparent 55%), radial-gradient(circle at -10% 110%, rgba(232, 197, 71, 0.18), transparent 55%), linear-gradient(135deg, rgba(20, 42, 92, 1), rgba(10, 31, 68, 1))`

const USD_BG = `radial-gradient(circle at 110% -10%, rgba(110, 231, 167, 0.32), transparent 55%), radial-gradient(circle at -10% 110%, rgba(46, 139, 87, 0.16), transparent 55%), linear-gradient(135deg, rgba(15, 56, 47, 1), rgba(6, 24, 19, 1))`

function formatNumber(n, decimals = 2) {
  return n.toLocaleString('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export default function MobileCards() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState('ngn')
  const [revealed, setRevealed] = useState(false)
  const [frozen, setFrozen] = useState(false)

  const card = CARDS.find(c => c.id === activeId)
  const cardBg = card.id === 'ngn' ? NGN_BG : USD_BG
  const accent = card.id === 'ngn' ? '#C9A227' : '#6EE7A7'
  const cardholder = (user?.full_name || 'VELOXZAP MEMBER').toUpperCase()

  const actions = [
    { id: 'topup',  label: 'Top up',  icon: ArrowDownLeft,                onClick: () => navigate('/user/convert') },
    { id: 'freeze', label: frozen ? 'Unfreeze' : 'Freeze', icon: Snowflake, onClick: () => setFrozen(f => !f), accent: frozen },
    { id: 'reveal', label: revealed ? 'Hide' : 'Reveal',   icon: revealed ? EyeOff : Eye, onClick: () => setRevealed(r => !r) },
    { id: 'tx',     label: 'History', icon: ListChecks,                  onClick: () => navigate('/user/transactions') },
  ]

  return (
    <div className="flex flex-col gap-5">
      <MobilePageHeader title="Virtual cards" />
      <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 leading-snug">
        Spend instantly online · supports global merchants and subscriptions.
      </p>

      <div className="flex gap-1 p-1 rounded-full bg-[var(--c-surface)] border border-[var(--c-border)]">
        {CARDS.map(c => {
          const active = activeId === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => { setActiveId(c.id); setRevealed(false) }}
              className={[
                'flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-full text-[12px] font-bold tracking-[0.1px] transition',
                active
                  ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_4px_12px_rgba(201,162,39,0.32)]'
                  : 'text-[var(--c-text-muted)] active:scale-95',
              ].join(' ')}
            >
              <span className="text-[14px] font-black">{c.symbol}</span>
              {c.label}
            </button>
          )
        })}
      </div>

      <div className="relative" style={{ perspective: '1200px' }}>
        <AnimatePresence mode="wait">
          <motion.article
            key={card.id}
            initial={{ opacity: 0, rotateY: -10, y: 12 }}
            animate={{ opacity: 1, rotateY: 0, y: 0 }}
            exit={{ opacity: 0, rotateY: 10, y: -12 }}
            transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
            className="relative aspect-[1.586/1] rounded-[20px] overflow-hidden border border-[rgba(255,255,255,0.1)] shadow-[0_22px_50px_-14px_rgba(2,7,23,0.65)]"
            style={{ background: cardBg, transformStyle: 'preserve-3d' }}
          >
            <span
              aria-hidden
              className="absolute -top-12 -right-12 w-[200px] h-[200px] rounded-full blur-3xl pointer-events-none"
              style={{ background: `${accent}40` }}
            />
            <span
              aria-hidden
              className="absolute -bottom-16 -left-16 w-[180px] h-[180px] rounded-full blur-3xl pointer-events-none"
              style={{ background: `${accent}1a` }}
            />

            <div className="relative h-full p-4 flex flex-col text-text">
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[1.6px] m-0 font-black"
                    style={{ color: accent }}
                  >
                    VeloxZap
                  </p>
                  <p className="text-[10px] uppercase tracking-[1.2px] text-white/70 m-0 mt-0.5 font-semibold">
                    {card.name}
                  </p>
                </div>
                <Wifi size={16} className="text-white/65 rotate-90 mt-0.5" />
              </div>

              <div className="flex items-center gap-2 mt-3.5">
                <span
                  aria-hidden
                  className="block w-10 h-7 rounded-md bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-400/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] relative overflow-hidden"
                >
                  <span className="absolute inset-1 grid grid-cols-3 gap-px opacity-40">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <span key={i} className="bg-amber-700/40" />
                    ))}
                  </span>
                </span>
              </div>

              <p className="font-mono text-[15px] tracking-[2px] mt-auto mb-2 text-text">
                {revealed && !frozen
                  ? card.full
                  : `•••• •••• •••• ${card.last4}`}
              </p>

              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[8.5px] uppercase tracking-[1.2px] text-white/55 m-0 font-semibold">
                    Cardholder
                  </p>
                  <p className="text-[11.5px] font-bold m-0 mt-0.5 truncate tracking-[0.5px]">
                    {cardholder}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[8.5px] uppercase tracking-[1.2px] text-white/55 m-0 font-semibold">
                    Expires
                  </p>
                  <p className="text-[11.5px] font-bold m-0 mt-0.5 tabular-nums tracking-[0.5px]">
                    {card.expiry}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[8.5px] uppercase tracking-[1.2px] text-white/55 m-0 font-semibold">
                    Network
                  </p>
                  <p className="text-[11px] font-black m-0 mt-0.5 tracking-[1.2px]">
                    {card.network.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {frozen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/[0.06] backdrop-blur-[2px] flex items-center justify-center"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.18] border border-white/[0.3] text-[10.5px] uppercase tracking-[1.4px] font-bold text-white">
                    <Snowflake size={11} strokeWidth={2.4} /> Frozen
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {revealed && !frozen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-2 overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
              <p className="text-[9px] uppercase tracking-[1.1px] text-[var(--c-text-muted)] font-semibold m-0">CVV</p>
              <p className="text-[13px] font-mono font-bold text-[var(--c-text)] tabular-nums m-0">{card.cvv}</p>
            </div>
            <button
              type="button"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] active:scale-[0.98] transition"
            >
              <p className="text-[9px] uppercase tracking-[1.1px] text-[var(--c-text-muted)] font-semibold m-0">Copy details</p>
              <Copy size={12} className="text-brand-accent" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-3.5">
        <p className="text-[10px] uppercase tracking-[1.2px] text-[var(--c-text-muted)] font-semibold m-0">
          Available balance
        </p>
        <p className="text-[24px] font-bold tracking-[-0.5px] text-[var(--c-text)] m-0 mt-0.5 tabular-nums">
          {card.symbol}{formatNumber(card.balance, card.decimals)}
        </p>
      </article>

      <div className="grid grid-cols-4 gap-2">
        {actions.map(({ id, label, icon: Icon, onClick, accent: actionAccent }) => (
          <button
            key={id}
            type="button"
            onClick={onClick}
            className="group flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] active:scale-[0.97] transition"
          >
            <span
              className={[
                'inline-flex items-center justify-center w-9 h-9 rounded-[10px] border transition',
                actionAccent
                  ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border-[rgba(232,197,71,0.55)] shadow-[0_4px_12px_rgba(201,162,39,0.3)]'
                  : 'bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border-[var(--c-accent-border)]',
              ].join(' ')}
            >
              <Icon size={15} strokeWidth={2} />
            </span>
            <span className="text-[10.5px] font-semibold text-[var(--c-text)] tracking-[-0.1px]">
              {label}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="group flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--c-surface)] border border-dashed border-[var(--c-border-strong)] hover:border-[var(--c-accent-border)] hover:bg-[var(--c-surface-soft)] active:scale-[0.99] transition"
      >
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-[14px] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent">
          <Plus size={18} strokeWidth={2.4} />
        </span>
        <span className="flex-1 text-left">
          <span className="block text-[13.5px] font-bold text-[var(--c-text)] tracking-[-0.1px]">
            Add new card
          </span>
          <span className="block text-[11px] text-[var(--c-text-muted)] mt-0.5">
            Up to 3 cards · GBP, EUR available
          </span>
        </span>
      </button>

      <p className="text-center text-[10px] text-[var(--c-text-faint)] mt-1 mb-2 tracking-[0.5px]">
        Cards issued by VeloxZap Financial Services Ltd.
      </p>
    </div>
  )
}
