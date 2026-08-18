import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wifi, Clock, Bell, Globe2 } from 'lucide-react'
import useUser from '../../hooks/useUser'
import MobilePageHeader from '../../components/partials/MobilePageHeader'
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

const USD_BG = `radial-gradient(circle at 110% -10%, rgba(110, 231, 167, 0.32), transparent 55%), radial-gradient(circle at -10% 110%, rgba(46, 139, 87, 0.16), transparent 55%), linear-gradient(135deg, rgba(15, 56, 47, 1), rgba(6, 24, 19, 1))`

export default function MobileCards() {
  const { user } = useUser()
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
    <div className="flex flex-col gap-5">
      <MobilePageHeader title="Virtual cards" />
      <p className="text-[12.5px] text-[var(--c-text-muted)] m-0 leading-snug">
        A global Visa virtual dollar card is on the way — spend online the moment it launches.
      </p>

      <div className="relative" style={{ perspective: '1200px' }}>
          <motion.article
            initial={{ opacity: 0, rotateY: -10, y: 12 }}
            animate={{ opacity: 1, rotateY: 0, y: 0 }}
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
                {`•••• •••• •••• ${card.last4}`}
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
                  <CardNetworkLogo network={card.network} size={30} className="text-white" />
                </div>
              </div>
            </div>

            {/* Coming soon overlay */}
            <div className="absolute inset-0 bg-[#050b1c]/55 backdrop-blur-[2.5px] flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.14] border border-white/[0.28] text-[10.5px] uppercase tracking-[1.4px] font-bold text-white">
                <Clock size={11} strokeWidth={2.4} /> Coming soon
              </span>
            </div>
          </motion.article>
      </div>

      <article className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4 flex flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-[14px] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent">
          <Globe2 size={18} strokeWidth={2} />
        </span>
        <div>
          <p className="text-[13.5px] font-bold text-[var(--c-text)] m-0">Your virtual card is coming soon</p>
          <p className="text-[11.5px] text-[var(--c-text-muted)] m-0 mt-1 leading-snug">
            We're finishing up global Visa issuance so you can spend online and pay for subscriptions anywhere.
          </p>
        </div>
        <button
          type="button"
          onClick={handleNotify}
          disabled={notified}
          className={[
            'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold tracking-[0.1px] active:scale-[0.98] transition',
            notified
              ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
              : 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.3)]',
          ].join(' ')}
        >
          <Bell size={13} strokeWidth={2.4} /> {notified ? "You're on the list" : 'Notify me at launch'}
        </button>
      </article>

      <p className="text-center text-[10px] text-[var(--c-text-faint)] mt-1 mb-2 tracking-[0.5px]">
        Card will be issued by VeloxZap Financial Services Ltd.
      </p>
    </div>
  )
}
