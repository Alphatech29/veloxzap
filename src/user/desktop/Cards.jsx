import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Wifi, Clock, Bell, Globe2, ShieldCheck, Zap, CreditCard } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import CardNetworkLogo from '../../components/ui/CardNetworkLogo'
import { useAlert } from '../../components/ui/Alert'

const CARD = {
  id: 'usd',
  label: 'Dollar',
  currency: 'USD',
  symbol: '$',
  name: 'Virtual Dollar',
  last4: '7812',
  network: 'visa',
}

const HIGHLIGHTS = [
  { icon: Zap, title: 'Instant issuance', desc: 'Get a card the moment you request one — no waiting, no paperwork.' },
  { icon: Globe2, title: 'Spend globally', desc: 'Pay for subscriptions and checkouts anywhere Visa is accepted.' },
  { icon: ShieldCheck, title: 'Freeze anytime', desc: 'Lock your card instantly from your dashboard if it’s ever compromised.' },
]

const USD_BG = `radial-gradient(circle at 110% -10%, rgba(110, 231, 167, 0.36), transparent 55%), radial-gradient(circle at -10% 110%, rgba(46, 139, 87, 0.18), transparent 55%), linear-gradient(135deg, rgba(15, 56, 47, 1), rgba(6, 24, 19, 1))`

export default function DesktopCards() {
  const { user } = useAuth()
  const { alert } = useAlert()
  const [notified, setNotified] = useState(false)

  const card = CARD
  const cardBg = USD_BG
  const accent = '#6EE7A7'
  const cardholder = (user?.full_name || 'VELOXZAP MEMBER').toUpperCase()

  function handleNotify() {
    setNotified(true)
    alert({ type: 'success', title: "You're on the list!", message: "We'll let you know the moment virtual cards go live." })
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
            <Sparkles size={10} /> Spend anywhere
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Virtual cards
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            A global Visa virtual dollar card — accepted everywhere, launching soon.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
          <Clock size={10} /> Coming soon
        </span>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.2fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">

          <div className="relative" style={{ perspective: '1200px' }}>
              <motion.article
                initial={{ opacity: 0, rotateY: -90, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[1.586/1] max-w-[460px] rounded-2xl text-text shadow-[0_24px_48px_-18px_rgba(2,7,23,0.7)] overflow-hidden"
                style={{ background: cardBg, transformStyle: 'preserve-3d' }}
              >
                <span aria-hidden className="pointer-events-none absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full" style={{ background: `radial-gradient(circle, ${accent}55, transparent 70%)` }} />
                <span aria-hidden className="pointer-events-none absolute -bottom-12 -left-12 w-[150px] h-[150px] rounded-full" style={{ background: `radial-gradient(circle, ${accent}33, transparent 70%)` }} />

                <div className="relative h-full p-5 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[9.5px] uppercase tracking-[1.4px] text-white/55 font-bold m-0">
                        VeloxZap
                      </p>
                      <p className="text-[14px] font-bold text-text m-0 mt-1">
                        {card.name}
                      </p>
                    </div>
                    <Wifi size={20} className="text-white/65 rotate-90" />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="inline-block w-9 h-7 rounded-[6px]"
                      style={{
                        background: `linear-gradient(135deg, ${accent}d0, ${accent}80)`,
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
                      }}
                    />
                    <p className="text-[18px] font-mono font-bold tracking-[3px] text-text m-0 tabular-nums">
                      {`•••• •••• •••• ${card.last4}`}
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[8.5px] uppercase tracking-[1.2px] text-white/55 font-bold m-0">
                        Cardholder
                      </p>
                      <p className="text-[11.5px] font-bold tracking-[1.5px] text-text m-0 mt-0.5 truncate max-w-[200px]">
                        {cardholder}
                      </p>
                    </div>
                    <CardNetworkLogo network={card.network} size={34} className="text-white" />
                  </div>
                </div>

                <div className="absolute inset-0 backdrop-blur-md bg-[#050b1c]/50 flex items-center justify-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.16] border border-white/[0.24] text-text text-[11px] font-bold uppercase tracking-[1.5px]">
                    <Clock size={13} /> Coming soon
                  </div>
                </div>
              </motion.article>
          </div>

          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)] mb-3">
              <CreditCard size={12} className="text-brand-accent" /> What to expect
            </h3>
            <div className="grid grid-cols-1 min-[640px]:grid-cols-3 gap-3">
              {HIGHLIGHTS.map(h => (
                <div key={h.title} className="flex flex-col gap-2 p-3 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
                    <h.icon size={14} strokeWidth={2.2} />
                  </span>
                  <div>
                    <p className="text-[11.5px] font-bold text-[var(--c-text)] m-0">{h.title}</p>
                    <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5 leading-snug">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">
          <article className="relative overflow-hidden rounded-xl bg-[var(--c-surface)] border border-[var(--c-accent-border)] p-5 flex flex-col items-center text-center gap-3">
            <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-brand-accent/[0.16] blur-2xl" />
            <span className="relative inline-flex items-center justify-center w-11 h-11 rounded-[14px] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent">
              <Globe2 size={18} strokeWidth={2} />
            </span>
            <div className="relative">
              <p className="text-[13px] font-bold text-[var(--c-text)] m-0">Your virtual card is coming soon</p>
              <p className="text-[11px] text-[var(--c-text-muted)] m-0 mt-1.5 leading-snug">
                We're finishing up global Visa issuance so you can spend online and pay for subscriptions anywhere.
              </p>
            </div>
            <button
              type="button"
              onClick={handleNotify}
              disabled={notified}
              className={[
                'relative inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold tracking-[0.1px] transition w-full justify-center',
                notified
                  ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
                  : 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.3)] hover:-translate-y-px',
              ].join(' ')}
            >
              <Bell size={13} strokeWidth={2.4} /> {notified ? "You're on the list" : 'Notify me at launch'}
            </button>
          </article>

          <article className="rounded-xl border border-[var(--c-border-soft)] bg-[var(--c-surface-soft)] p-3.5 flex items-start gap-2.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
              <ShieldCheck size={13} />
            </span>
            <div className="leading-snug">
              <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">Card issued by VeloxZap Financial Services Ltd.</p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                No setup fee at launch — pricing details will be shared before go-live.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
