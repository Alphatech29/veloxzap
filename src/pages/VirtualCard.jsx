import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, ArrowDownRight, CheckCircle2, ShieldCheck, Sparkles,
  Zap, BadgeCheck, Lock, CreditCard, Snowflake, Eye, EyeOff,
  Plus, Repeat, Hash, Bell, SlidersHorizontal, Fingerprint,
} from 'lucide-react'

const CARD_STACK = [
  { label:'Subscriptions', last:'2384', tone:'#0A1F44', accent:'#C9A227', spent:'₦142,800', limit:'₦200,000', pct:71 },
  { label:'Online shopping', last:'7019', tone:'#1a1d2e', accent:'#E8C547', spent:'₦62,400',  limit:'₦150,000', pct:42 },
  { label:'Ads & SaaS',     last:'5562', tone:'#0d2540', accent:'#F5F5F0', spent:'₦318,200', limit:'₦400,000', pct:80 },
]

const TXNS = [
  { merchant:'Netflix',  cat:'Subscription', amount:'$9.99',   ngn:'₦16,360',  letter:'N', tone:'#E50914' },
  { merchant:'AWS',      cat:'Cloud',        amount:'$214.20', ngn:'₦345,288', letter:'A', tone:'#FF9900' },
  { merchant:'Spotify',  cat:'Subscription', amount:'$11.99',  ngn:'₦19,632',  letter:'S', tone:'#1DB954' },
  { merchant:'Amazon',   cat:'Shopping',     amount:'$48.30',  ngn:'₦78,860',  letter:'A', tone:'#FF9900' },
  { merchant:'Vercel',   cat:'SaaS',         amount:'$20.00',  ngn:'₦32,720',  letter:'V', tone:'#000000' },
]

const STEPS = [
  [Plus,         'Tap "New card"',      'Open VeloxZap, hit the + on your card stack. Pick one-time or reusable.'],
  [SlidersHorizontal, 'Set the rules',  'Spend limit, allowed merchant, expiry, label. Defaults work too.'],
  [CheckCircle2, 'Use it anywhere',     'Card details appear instantly. Paste into any checkout that accepts Visa.'],
  [BadgeCheck,   'Track every charge',  'Live notifications, full history, freeze or delete in one tap.'],
]

const SECURITY = [
  [Fingerprint, 'Biometric reveal',    'Card number and CVV stay hidden until your fingerprint or PIN unlocks them.'],
  [Snowflake,   'Instant freeze',      'One tap pauses every charge. Unfreeze the same way — useful between trips.'],
  [Hash,        'One-time card numbers','Generate a single-use card for any sketchy merchant. It dies after one charge.'],
  [Lock,        '3D-Secure on by default','Every online charge needs a fresh approval — never just card-on-file.'],
]

const TIERS = [
  {
    name:'Starter', price:'Free', sub:'Perfect for one-off spending',
    perks:['1 reusable card','3 one-time cards / month','1.5% FX spread','PCI-DSS L1 security'],
    cta:'Get started', highlight:false,
  },
  {
    name:'Plus', price:'₦1,500', period:'/mo', sub:'For regular online buyers',
    perks:['5 reusable cards','Unlimited one-time cards','1.2% FX spread','Priority support','Apple Pay & Google Pay'],
    cta:'Upgrade to Plus', highlight:true,
  },
  {
    name:'Business', price:'₦9,000', period:'/mo', sub:'Cards for your whole team',
    perks:['Unlimited cards & users','0.9% FX spread','Per-card spend rules','CSV exports & API access','Dedicated account manager'],
    cta:'Talk to sales', highlight:false,
  },
]

const CHIPS = [[Zap, '30-second issuance'], [Repeat, 'Reusable & one-time']]

const DOT = '%23F5F5F0'
const DOT_GRID =
  `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><circle cx='14' cy='14' r='1' fill='${DOT}' fill-opacity='0.10'/></svg>")`

const STAGE_BG =
  'radial-gradient(ellipse 55% 35% at 85% 5%, rgba(201,162,39,0.14), transparent 60%),' +
  'radial-gradient(ellipse 55% 35% at 10% 90%, rgba(232,197,71,0.10), transparent 65%),' +
  'linear-gradient(180deg, var(--color-primary-500) 0%, var(--color-brand-primary) 50%, var(--color-primary-700) 100%)'

const ctaGold  = 'inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft px-6 py-3 text-sm font-extrabold text-brand-primary no-underline shadow-[0_12px_32px_rgba(201,162,39,0.4),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(201,162,39,0.55)]'
const ctaGhost = 'inline-flex items-center gap-1.5 rounded-full border border-brand-accent/20 bg-brand-accent/5 px-5 py-3 text-sm font-semibold text-text no-underline transition-all duration-200 hover:-translate-y-px hover:border-brand-accent/40 hover:bg-brand-accent/10'

const Grad  = ({ children }) => <span className="bg-gradient-to-br from-brand-accent to-brand-gold-soft bg-clip-text text-transparent">{children}</span>
const Pill  = ({ tone='gold', children }) => <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] ${tone==='gold' ? 'text-brand-gold-soft bg-brand-accent/10 border-brand-accent/30' : 'text-text-muted bg-text/5 border-text/10'}`}>{children}</span>

const Section = ({ id, children }) => (
  <section id={id} className="relative z-[2] py-16 sm:py-20 lg:py-24">
    <div className="relative z-[2] mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-10">{children}</div>
  </section>
)

const Head = ({ pill, title, sub }) => (
  <header className="mb-10 text-center md:mb-14">
    <Pill tone="mute"><Sparkles size={11}/>{pill}</Pill>
    <h2 className="mx-auto mt-3.5 mb-3 max-w-[720px] font-['Space_Grotesk',sans-serif] text-[clamp(28px,4.6vw,44px)] font-extrabold leading-[1.1] tracking-[-0.025em]">{title}</h2>
    <p className="mx-auto max-w-[580px] text-[14.5px] leading-[1.7] text-text-muted md:text-[15.5px]">{sub}</p>
  </header>
)

function MiniCard({ tone, accent, label, last, depth = 0, rotate = 0, offset = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rotate - 4 }}
      animate={{ opacity: 1, y: offset, rotate }}
      transition={{ duration: 0.7, delay: depth * 0.1, ease: 'easeOut' }}
      whileHover={{ y: offset - 8, rotate: rotate * 0.5 }}
      style={{ zIndex: 10 - depth, transformStyle: 'preserve-3d' }}
      className="absolute left-1/2 top-1/2 aspect-[1.586/1] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] p-5 text-text shadow-[0_30px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.18)] sm:w-[340px]"
    >
      <span className="pointer-events-none absolute inset-0 rounded-[20px]" style={{
        background: `linear-gradient(135deg, ${tone} 0%, color-mix(in srgb, ${tone} 70%, white 4%) 50%, color-mix(in srgb, ${tone} 60%, ${accent} 8%) 100%)`,
      }}/>
      <span className="pointer-events-none absolute inset-0 rounded-[20px]" style={{
        background: `radial-gradient(circle at 78% 0%, color-mix(in srgb, ${accent} 65%, transparent) 0%, transparent 55%)`,
      }}/>
      <span className="pointer-events-none absolute inset-0 rounded-[20px] opacity-25" style={{
        backgroundImage: DOT_GRID, backgroundSize: '18px 18px',
      }}/>
      <span className="pointer-events-none absolute inset-0 rounded-[20px]" style={{
        background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)',
        mixBlendMode: 'overlay',
      }}/>
      <span className="pointer-events-none absolute inset-0 rounded-[20px] border border-white/10"/>

      <div className="relative z-[2] flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_4px_10px_rgba(201,162,39,0.4)]">
              <Zap size={13} strokeWidth={2.6}/>
            </span>
            <span className="font-['Space_Grotesk',sans-serif] text-[12px] font-extrabold tracking-tight">VeloxZap</span>
          </div>
          <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-text/85">{label}</span>
        </div>
        <div className="font-mono text-[14px] font-extrabold tracking-[0.16em] text-text/95">•••• •••• •••• {last}</div>
        <div className="flex items-end justify-between">
          <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-text/50">Virtual · {label}</div>
          <div className="font-['Space_Grotesk',sans-serif] text-[16px] font-extrabold italic tracking-tight">VISA</div>
        </div>
      </div>
    </motion.div>
  )
}

function CardManager() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
      className="rounded-[22px] border border-brand-accent/20 bg-brand-primary/65 p-5 shadow-[0_28px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard size={16} className="text-brand-accent"/>
          <span className="font-['Space_Grotesk',sans-serif] text-[14px] font-extrabold tracking-tight">Your cards</span>
        </div>
        <button type="button" className="inline-flex items-center gap-1.5 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-gold-soft">
          <Plus size={11}/>New card
        </button>
      </div>
      <ul className="space-y-3">
        {CARD_STACK.map(c => (
          <li key={c.last} className="rounded-2xl border border-text/8 bg-text/[0.04] p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-12 shrink-0 place-items-center rounded-md border border-white/10 text-[10px] font-mono font-bold tracking-[0.14em] text-text/80" style={{ background: `linear-gradient(135deg, ${c.tone} 0%, color-mix(in srgb, ${c.tone} 70%, ${c.accent} 16%) 100%)` }}>VISA</span>
                <div className="min-w-0">
                  <div className="truncate font-['Space_Grotesk',sans-serif] text-[13px] font-extrabold tracking-tight">{c.label}</div>
                  <div className="truncate font-mono text-[10.5px] text-text-muted">•••• {c.last}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-['Space_Grotesk',sans-serif] text-[12.5px] font-bold tracking-tight">{c.spent}</div>
                <div className="font-mono text-[10px] text-text-muted">of {c.limit}</div>
              </div>
            </div>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-text/8">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-gold-soft" style={{ width: c.pct + '%' }}/>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function TxnFeed() {
  return (
    <div className="rounded-[20px] border border-brand-accent/20 bg-brand-primary/55 p-5 backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-brand-accent"/>
          <span className="font-['Space_Grotesk',sans-serif] text-[13px] font-extrabold tracking-tight">Live charges</span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#4ade80]">
          <span className="h-1.5 w-1.5 animate-[pulse_1.6s_infinite] rounded-full bg-[#4ade80]"/>live
        </span>
      </div>
      <ul className="space-y-2">
        {TXNS.map((t, i) => (
          <motion.li key={t.merchant + i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex items-center justify-between gap-3 rounded-xl border border-text/5 bg-text/[0.03] px-3 py-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[12px] font-extrabold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" style={{ background: t.tone }}>{t.letter}</span>
              <div className="min-w-0">
                <div className="truncate font-['Space_Grotesk',sans-serif] text-[12.5px] font-extrabold tracking-tight">{t.merchant}</div>
                <div className="truncate font-mono text-[10.5px] text-text-muted">{t.cat}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-['Space_Grotesk',sans-serif] text-[12.5px] font-bold tracking-tight">{t.amount}</div>
              <div className="font-mono text-[10px] text-text-muted">{t.ngn}</div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function CardTypeCompare() {
  const Col = ({ icon: Ic, title, kicker, lines, badge, tone }) => (
    <motion.div whileHover={{ rotateX: -4, rotateY: 4, translateY: -4 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      style={{ transformStyle: 'preserve-3d' }}
      className="relative overflow-hidden rounded-[22px] border border-brand-accent/15 bg-brand-mid/60 p-6">
      <span className="pointer-events-none absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-brand-accent/55 to-transparent"/>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-[14px] border border-brand-accent/35 bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 text-brand-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_18px_rgba(201,162,39,0.18)]"><Ic size={20}/></div>
        <span className="rounded-full border border-brand-accent/30 bg-brand-accent/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: tone }}>{badge}</span>
      </div>
      <div className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-text-muted">{kicker}</div>
      <h3 className="mt-1 mb-2 font-['Space_Grotesk',sans-serif] text-[18px] font-extrabold tracking-tight">{title}</h3>
      <ul className="space-y-2 text-[13px] leading-[1.65] text-text-muted">
        {lines.map(l => (
          <li key={l} className="flex items-start gap-2">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-accent"/>{l}
          </li>
        ))}
      </ul>
    </motion.div>
  )
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2" style={{ perspective: 1200 }}>
      <Col
        icon={Hash}
        kicker="Single-use"
        title="One-time card"
        badge="Disposable"
        tone="var(--color-brand-gold-soft)"
        lines={[
          'Generated on demand for a single charge',
          'Auto-destroys after one successful payment',
          'Perfect for sketchy merchants and free-trial sign-ups',
          'No subscription can sneak past it later',
        ]}
      />
      <Col
        icon={Repeat}
        kicker="Long-lived"
        title="Reusable card"
        badge="Recurring"
        tone="var(--color-brand-accent)"
        lines={[
          'Stays in your wallet for as long as you want it',
          'Per-card spend limit and merchant rules',
          'Pause / unpause without changing the card number',
          'Best for Netflix, AWS, Spotify and other monthly bills',
        ]}
      />
    </div>
  )
}

export default function VirtualCard() {
  const [reveal, setReveal] = useState(false)

  return (
    <main className="main-offset relative isolate min-h-screen overflow-hidden text-text" style={{ background: STAGE_BG }}>
      <div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: DOT_GRID, backgroundSize: '28px 28px', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 100%)' }}/>
      <div className="pointer-events-none absolute top-[5%] -right-[130px] z-0 h-[480px] w-[480px] rounded-full opacity-45 blur-[80px]" style={{ background: 'radial-gradient(circle, var(--color-brand-accent) 0%, transparent 70%)' }}/>
      <div className="pointer-events-none absolute bottom-[8%] -left-[120px] z-0 h-[520px] w-[520px] rounded-full opacity-45 blur-[80px]" style={{ background: 'radial-gradient(circle, var(--color-brand-gold-soft) 0%, transparent 70%)' }}/>

      <section className="relative z-[2] py-7 md:py-14 lg:py-[72px]">
        <div className="relative z-[2] mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-7 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div className="flex min-w-0 flex-col gap-5">
            <Pill tone="gold">
              <span className="h-1.5 w-1.5 animate-[pulse_1.6s_infinite] rounded-full bg-brand-accent shadow-[0_0_10px_var(--color-brand-accent)]"/>
              VIRTUAL CARDS · INSTANT
            </Pill>
            <h1 className="font-['Space_Grotesk',sans-serif] text-[clamp(36px,6.4vw,60px)] font-extrabold leading-[1.04] tracking-[-0.03em]">
              Issue a Visa card in <Grad>30 seconds.</Grad>
            </h1>
            <p className="max-w-[540px] text-[15px] leading-[1.7] text-text-muted lg:text-base">
              Spin up a virtual card for every habit — one for Netflix, one for AWS, one for that 7-day trial. Set a limit, label it, freeze it. Funded in naira, billed in any currency.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/auth/register" className={ctaGold}>Issue my first card <ArrowRight size={16}/></Link>
              <a href="#manage" className={ctaGhost}>See it in action <ArrowDownRight size={16}/></a>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-5 gap-y-3.5">
              {CHIPS.map(([Ic, label]) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                  <Ic size={14} className="text-brand-accent"/>{label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative h-[340px] w-full sm:h-[380px]" style={{ perspective: 1400 }}>
            <MiniCard tone="#0d2540" accent="#F5F5F0" label="Ads & SaaS"     last="5562" depth={2} rotate={-10} offset={-46}/>
            <MiniCard tone="#1a1d2e" accent="#E8C547" label="Online shopping" last="7019" depth={1} rotate={-2}  offset={-12}/>
            <MiniCard tone="#0A1F44" accent="#C9A227" label="Subscriptions"  last="2384" depth={0} rotate={6}   offset={28}/>

            <button
              type="button"
              onClick={() => setReveal(v => !v)}
              className="absolute right-2 top-2 z-[20] inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-brand-accent/40 bg-brand-mid/90 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold-soft shadow-[0_8px_20px_rgba(0,0,0,0.45)] backdrop-blur-md hover:border-brand-accent/70 sm:right-6"
            >
              {reveal ? <EyeOff size={12}/> : <Eye size={12}/>}{reveal ? 'Hide stack' : 'Reveal stack'}
            </button>

            <motion.div initial={{ opacity: 0, x: 20, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.9 }}
              className="absolute -bottom-2 -left-1 z-[15] inline-flex items-center gap-2.5 rounded-2xl border border-brand-accent/30 bg-brand-mid/85 px-3.5 py-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:left-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-accent/15 text-brand-accent"><Plus size={14}/></span>
              <div>
                <div className="text-xs font-bold leading-[1.1]">Card #4 issued</div>
                <div className="text-[10.5px] text-text-muted">Travel · 14s ago</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Section id="manage">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <Head pill="Manage like a pro" title={<>One wallet. <Grad>A card for every habit.</Grad></>}
                  sub="Spin up a separate card for each merchant or category. Each gets its own spend limit, label and freeze toggle — no spreadsheet needed."/>
            <ul className="space-y-3 text-[14px] text-text-muted">
              {[
                ['Per-card spend limit', 'Cap each card monthly so a runaway subscription never wrecks your bill.'],
                ['Live notifications',   'Push alert the second a charge attempts. Approve or freeze from the alert.'],
                ['Snooze a subscription','Pause a card before a free trial converts, unpause when you actually want it.'],
                ['Search every charge',  'Filter by merchant, card, category or month. Export to CSV any time.'],
              ].map(([t, d]) => (
                <li key={t} className="flex items-start gap-3 rounded-2xl border border-brand-accent/15 bg-brand-mid/40 p-4">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border border-brand-accent/30 bg-brand-accent/10 text-brand-accent"><CheckCircle2 size={14}/></span>
                  <div>
                    <div className="font-['Space_Grotesk',sans-serif] text-[14px] font-extrabold tracking-tight text-text">{t}</div>
                    <div className="mt-0.5 text-[13px] leading-[1.6]">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <CardManager/>
            <TxnFeed/>
          </div>
        </div>
      </Section>

      <Section>
        <Head pill="Card types" title={<>Two cards, <Grad>two jobs.</Grad></>}
              sub="Use a one-time card for any place you don't fully trust. Use a reusable card for the merchants you bill every month."/>
        <CardTypeCompare/>
      </Section>

      <Section>
        <Head pill="Security from the inside out" title={<>Your card, <Grad>your rules.</Grad></>}
              sub="Every layer between your wallet and a merchant — biometric, dynamic, and yours to override at any moment."/>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5" style={{ perspective: 1300 }}>
          {SECURITY.map(([Ic, title, desc], i) => (
            <motion.div key={title} initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.5, delay:i*0.06 }}
              whileHover={{ rotateX:-4, rotateY:4, translateY:-4 }} style={{ transformStyle:'preserve-3d' }}
              className="relative overflow-hidden rounded-[22px] border border-brand-accent/15 bg-brand-mid/60 p-6">
              <span className="pointer-events-none absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-brand-accent/55 to-transparent"/>
              <span className="pointer-events-none absolute -bottom-10 -right-8 text-brand-accent opacity-[0.08]"><Ic size={140} strokeWidth={1}/></span>
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-[14px] border border-brand-accent/35 bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 text-brand-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_18px_rgba(201,162,39,0.18)]"><Ic size={20}/></div>
              <h3 className="mb-2 font-['Space_Grotesk',sans-serif] text-[17px] font-extrabold tracking-tight">{title}</h3>
              <p className="text-[13px] leading-[1.7] text-text-muted">{desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <Head pill="How to issue" title={<>Four taps from <Grad>idea to card number.</Grad></>}
              sub="No paperwork. No card delivery. The card is in your hand 30 seconds after sign-up."/>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4" style={{ perspective: 1300 }}>
          {STEPS.map(([Ic, title, desc], i) => (
            <motion.div key={title} whileHover={{ rotateX:-5, rotateY:5, translateY:-6 }} transition={{ type:'spring', stiffness:200, damping:18 }}
              style={{ transformStyle:'preserve-3d' }}
              className="relative rounded-[18px] border border-brand-accent/15 bg-brand-primary/55 p-6">
              <span className="pointer-events-none absolute inset-x-3 -top-px h-px bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent"/>
              <span className="pointer-events-none absolute top-3 right-4 select-none bg-gradient-to-br from-brand-accent to-brand-gold-soft bg-clip-text font-['Space_Grotesk',sans-serif] text-5xl font-extrabold leading-none tracking-[-0.04em] text-transparent opacity-15">{String(i+1).padStart(2,'0')}</span>
              <div className="mb-3.5 grid h-[46px] w-[46px] place-items-center rounded-[12px] border border-brand-accent/35 bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 text-brand-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_18px_rgba(201,162,39,0.18)]"><Ic size={20}/></div>
              <h3 className="mb-1.5 font-['Space_Grotesk',sans-serif] text-base font-extrabold tracking-tight">{title}</h3>
              <p className="text-[12.5px] leading-[1.65] text-text-muted">{desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <Head pill="Pricing" title={<>Pay for cards <Grad>the way you use them.</Grad></>}
              sub="Free for one-off spending. Plus and Business unlock more cards, tighter FX, and team controls."/>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6" style={{ perspective: 1200 }}>
          {TIERS.map(t => (
            <motion.div key={t.name} whileHover={{ rotateX: -4, rotateY: t.highlight ? 0 : 4, translateY: -6 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              style={{ transformStyle: 'preserve-3d' }}
              className={`relative flex flex-col gap-5 overflow-hidden rounded-[22px] border p-6 ${t.highlight ? 'border-brand-accent/45 bg-gradient-to-br from-brand-mid/70 to-brand-primary/60 shadow-[0_24px_60px_rgba(201,162,39,0.18)]' : 'border-brand-accent/15 bg-brand-mid/55'}`}>
              {t.highlight && (
                <span className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-md border-x border-b border-brand-accent/45 bg-gradient-to-br from-brand-accent to-brand-gold-soft px-3 py-1 font-mono text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-primary">Popular</span>
              )}
              <div>
                <div className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-text-muted">{t.name}</div>
                <div className="mt-2 flex items-end gap-1.5">
                  <span className="font-['Space_Grotesk',sans-serif] text-[40px] font-extrabold leading-none tracking-tight">{t.price}</span>
                  {t.period && <span className="pb-1 text-[13px] text-text-muted">{t.period}</span>}
                </div>
                <p className="mt-2 text-[13px] text-text-muted">{t.sub}</p>
              </div>
              <ul className="space-y-2 text-[13px] leading-[1.6]">
                {t.perks.map(p => (
                  <li key={p} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-accent"/>
                    <span className="text-text-muted">{p}</span>
                  </li>
                ))}
              </ul>
              <Link to="/auth/register" className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold no-underline transition-all duration-200 hover:-translate-y-0.5 ${t.highlight ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_12px_32px_rgba(201,162,39,0.4)]' : 'border border-brand-accent/25 bg-brand-accent/5 text-text hover:border-brand-accent/45 hover:bg-brand-accent/10'}`}>
                {t.cta}<ArrowRight size={14}/>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>
    </main>
  )
}
