import SEO from '../components/SEO'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, ArrowDownRight, ArrowUpRight, CheckCircle2, ShieldCheck,
  Sparkles, Wallet, Zap, BadgeCheck, Lock, Globe2, Plane, ShoppingBag,
  Tv, CreditCard, Snowflake, Eye, EyeOff, Banknote, MapPin, Wifi,
  Compass, ChevronRight,
} from 'lucide-react'

const COUNTRIES = [
  { flag:'🇺🇸', name:'United States', code:'USD', rate:'₦1,612' },
  { flag:'🇬🇧', name:'United Kingdom', code:'GBP', rate:'₦2,045' },
  { flag:'🇪🇺', name:'Eurozone',       code:'EUR', rate:'₦1,754' },
  { flag:'🇨🇦', name:'Canada',         code:'CAD', rate:'₦1,178' },
  { flag:'🇯🇵', name:'Japan',          code:'JPY', rate:'₦10.42' },
  { flag:'🇦🇺', name:'Australia',      code:'AUD', rate:'₦1,062' },
  { flag:'🇨🇭', name:'Switzerland',    code:'CHF', rate:'₦1,820' },
  { flag:'🇸🇬', name:'Singapore',      code:'SGD', rate:'₦1,205' },
  { flag:'🇿🇦', name:'South Africa',   code:'ZAR', rate:'₦88.40' },
  { flag:'🇦🇪', name:'UAE',            code:'AED', rate:'₦438' },
  { flag:'🇮🇳', name:'India',          code:'INR', rate:'₦19.30' },
  { flag:'🇨🇳', name:'China',          code:'CNY', rate:'₦223' },
]

const FX_FEED = [
  { code:'USD', flag:'🇺🇸', sym:'$', rate:'₦1,612', delta:'+0.4%', up:true  },
  { code:'GBP', flag:'🇬🇧', sym:'£', rate:'₦2,045', delta:'+0.6%', up:true  },
  { code:'EUR', flag:'🇪🇺', sym:'€', rate:'₦1,754', delta:'−0.2%', up:false },
  { code:'CAD', flag:'🇨🇦', sym:'$', rate:'₦1,178', delta:'+0.1%', up:true  },
]

const STEPS = [
  [Wallet,       'Fund in naira',     'Top up your VeloxZap wallet from any Nigerian bank, USSD or transfer.'],
  [CreditCard,   'Card auto-converts','Spend in any currency — we convert at live rates with a 1.5% spread.'],
  [Globe2,       'Pay anywhere',      'Online or in-store, anywhere Visa is accepted in 200+ countries.'],
  [CheckCircle2, 'Settled instantly', 'Naira debits your wallet the second the merchant authorises.'],
]

const FEATURES = [
  [Zap,        'Instant issuance',     'Card lives in your wallet 30 seconds after sign-up. No application, no waiting.'],
  [Snowflake,  'Freeze in one tap',    'Misplaced your card or stopped a subscription? Freeze and unfreeze instantly.'],
  [Lock,       '3D-Secure on by default','Every online charge needs your fingerprint or PIN — never just the card number.'],
  [BadgeCheck, '1.5% FX spread, no fee','You see the exact naira amount before you pay. No hidden conversion fees.'],
]

const USES = [
  [Tv,         'Subscriptions',  'Netflix, Spotify, Apple, ChatGPT, Adobe, iCloud — any monthly bill.'],
  [Plane,      'Travel & hotels','Pay for flights, Airbnb, hotels and rideshares anywhere abroad.'],
  [ShoppingBag,'Online shopping','Amazon, AliExpress, Shopify stores, eBay, Etsy — global checkout works.'],
  [Wifi,       'SaaS & ads',     'AWS, Vercel, Notion, Figma, Meta and Google ads in dollars.'],
]

const CHIPS = [ [Globe2, '200+ countries'], [Banknote, 'No FX hassle']]

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
const Delta = ({ up, children }) => <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10.5px] font-bold ${up ? 'text-[#4ade80] bg-[#4ade80]/10' : 'text-[#f87171] bg-[#f87171]/10'}`}>{up ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>}{children}</span>

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

function GlobeLines() {
  return (
    <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.16]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 900">
      <defs>
        <linearGradient id="lat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="#C9A227" stopOpacity="0"/>
          <stop offset="50%" stopColor="#C9A227" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="route" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="#E8C547" stopOpacity="0"/>
          <stop offset="50%" stopColor="#E8C547" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#E8C547" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <g stroke="url(#lat)" strokeWidth="0.7" fill="none">
        <path d="M0,180 Q720,140 1440,180"/>
        <path d="M0,360 Q720,310 1440,360"/>
        <path d="M0,540 Q720,500 1440,540"/>
        <path d="M0,720 Q720,690 1440,720"/>
      </g>
      <g stroke="url(#route)" strokeWidth="1" strokeDasharray="4 6" fill="none">
        <path d="M180,640 Q540,200 920,300 T1320,200"/>
        <path d="M120,420 Q420,260 700,460 T1280,520"/>
      </g>
      <g fill="#C9A227">
        {[[180,640],[920,300],[1320,200],[120,420],[700,460],[1280,520]].map(([x,y],i)=>(
          <g key={i}>
            <circle cx={x} cy={y} r="3.5" opacity="0.95"/>
            <circle cx={x} cy={y} r="9" fill="none" stroke="#C9A227" strokeOpacity="0.45"/>
          </g>
        ))}
      </g>
    </svg>
  )
}

function VirtualCard({ showDetails, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 20, rotateY: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 8, rotateY: -8 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      whileHover={{ rotateX: 4, rotateY: 4, translateY: -8 }}
      style={{ transformStyle: 'preserve-3d', transition: 'transform 0.4s ease' }}
      className="relative aspect-[1.586/1] w-full max-w-[420px] rounded-[24px] p-6 text-text shadow-[0_36px_70px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.18)]"
    >
      <span className="pointer-events-none absolute inset-0 rounded-[24px]" style={{
        background: 'linear-gradient(135deg, #0A1F44 0%, #142A5C 45%, #1d3a78 100%)',
      }}/>
      <span className="pointer-events-none absolute inset-0 rounded-[24px]" style={{
        background: 'radial-gradient(circle at 80% 0%, rgba(201,162,39,0.45) 0%, transparent 55%), radial-gradient(circle at 0% 100%, rgba(232,197,71,0.25) 0%, transparent 60%)',
      }}/>
      <span className="pointer-events-none absolute inset-0 rounded-[24px] opacity-30" style={{
        backgroundImage: DOT_GRID, backgroundSize: '20px 20px',
      }}/>
      <span className="pointer-events-none absolute inset-0 rounded-[24px]" style={{
        background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)',
        mixBlendMode: 'overlay',
      }}/>
      <span className="pointer-events-none absolute inset-0 rounded-[24px] border border-white/10"/>

      <div className="relative z-[2] flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_6px_14px_rgba(201,162,39,0.45)]">
              <Zap size={16} strokeWidth={2.6}/>
            </span>
            <div className="font-['Space_Grotesk',sans-serif] text-[15px] font-extrabold tracking-tight">VeloxZap</div>
          </div>
          <span className="grid h-8 w-12 place-items-center rounded-md border border-brand-accent/40 bg-gradient-to-br from-brand-accent/30 to-brand-accent/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
            <span className="block h-3 w-6 rounded-sm bg-gradient-to-br from-brand-gold-soft to-brand-accent/70"/>
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2.5 font-mono text-[18px] font-extrabold tracking-[0.18em] text-text">
          <span>4621</span>
          <span className="opacity-70">{showDetails ? '8472' : '••••'}</span>
          <span className="opacity-70">{showDetails ? '1059' : '••••'}</span>
          <span>2384</span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-text/50">Cardholder</div>
            <div className="truncate font-['Space_Grotesk',sans-serif] text-[13px] font-bold tracking-tight">CHIDINMA OKAFOR</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-text/50">Expires</div>
            <div className="font-['Space_Grotesk',sans-serif] text-[13px] font-bold tracking-tight">{showDetails ? '08/29' : '••/••'}</div>
          </div>
          <div className="font-['Space_Grotesk',sans-serif] text-[20px] font-extrabold italic tracking-tight">VISA</div>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="absolute -top-3 -right-3 z-[3] inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-brand-accent/40 bg-brand-mid/90 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold-soft shadow-[0_8px_20px_rgba(0,0,0,0.45)] backdrop-blur-md hover:border-brand-accent/70"
      >
        {showDetails ? <EyeOff size={12}/> : <Eye size={12}/>}{showDetails ? 'Hide' : 'Reveal'}
      </button>
    </motion.div>
  )
}

function FXTicker() {
  const [feed, setFeed] = useState(FX_FEED)
  useEffect(() => {
    const id = setInterval(() => {
      setFeed(prev => prev.map(r => {
        const drift = (Math.random() * 0.6 - 0.3).toFixed(1)
        const up = Number(drift) >= 0
        return { ...r, delta: (up ? '+' : '−') + Math.abs(drift) + '%', up }
      }))
    }, 3000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="rounded-[20px] border border-brand-accent/20 bg-brand-primary/55 p-5 backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe2 size={16} className="text-brand-accent"/>
          <span className="font-['Space_Grotesk',sans-serif] text-[13px] font-extrabold tracking-tight">Live FX rates</span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#4ade80]">
          <span className="h-1.5 w-1.5 animate-[pulse_1.6s_infinite] rounded-full bg-[#4ade80]"/>live
        </span>
      </div>
      <ul className="space-y-2">
        {feed.map(r => (
          <li key={r.code} className="flex items-center justify-between gap-3 rounded-xl border border-text/5 bg-text/[0.03] px-3 py-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-brand-accent/30 bg-brand-accent/10 text-[14px]">{r.flag}</span>
              <div className="min-w-0">
                <div className="font-['Space_Grotesk',sans-serif] text-[13px] font-extrabold tracking-tight">{r.code}</div>
                <div className="truncate font-mono text-[10.5px] text-text-muted">1 {r.code} = {r.rate}</div>
              </div>
            </div>
            <Delta up={r.up}>{r.delta}</Delta>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SpendGlobally() {
  const [reveal, setReveal] = useState(false)

  return (
    <main className="main-offset relative isolate min-h-screen overflow-hidden text-text" style={{ background: STAGE_BG }}>
      <SEO
        title="Spend Globally With Your Naira — Virtual Visa Card"
        description="Fund in naira and spend in 200+ countries with your VeloxZap virtual Visa card. No FX stress, no dollar shortage, instant top-up."
        path="/spend-globally"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Global Spending",
          "provider": { "@type": "Organization", "name": "VeloxZap", "url": "https://veloxzap.com" },
          "description": "Spend in 200+ countries using your VeloxZap virtual Visa card funded in Nigerian naira.",
          "areaServed": "Worldwide",
          "serviceType": "International Payments"
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: DOT_GRID, backgroundSize: '28px 28px', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 100%)' }}/>
      <GlobeLines/>
      <div className="pointer-events-none absolute top-[5%] -right-[130px] z-0 h-[480px] w-[480px] rounded-full opacity-45 blur-[80px]" style={{ background: 'radial-gradient(circle, var(--color-brand-accent) 0%, transparent 70%)' }}/>
      <div className="pointer-events-none absolute bottom-[8%] -left-[120px] z-0 h-[520px] w-[520px] rounded-full opacity-45 blur-[80px]" style={{ background: 'radial-gradient(circle, var(--color-brand-gold-soft) 0%, transparent 70%)' }}/>

      <section className="relative z-[2] py-7 md:py-14 lg:py-[72px]">
        <div className="relative z-[2] mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-7 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div className="flex min-w-0 flex-col gap-5">
            <Pill tone="gold">
              <span className="h-1.5 w-1.5 animate-[pulse_1.6s_infinite] rounded-full bg-brand-accent shadow-[0_0_10px_var(--color-brand-accent)]"/>
              SPEND GLOBALLY · NAIRA-FUNDED VISA
            </Pill>
            <h1 className="font-['Space_Grotesk',sans-serif] text-[clamp(36px,6.4vw,60px)] font-extrabold leading-[1.04] tracking-[-0.03em]">
              Spend anywhere on earth, <Grad>funded in naira.</Grad>
            </h1>
            <p className="max-w-[540px] text-[15px] leading-[1.7] text-text-muted lg:text-base">
              A virtual Visa card that lives in your VeloxZap wallet. Pay Netflix, AWS, Amazon, an Airbnb in Lisbon — anywhere Visa is accepted in 200+ countries. We convert at live rates with a flat 1.5% spread.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/auth/register" className={ctaGold}>Get my card <ArrowRight size={16}/></Link>
              <a href="#fx" className={ctaGhost}>See live rates <ArrowDownRight size={16}/></a>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-5 gap-y-3.5">
              {CHIPS.map(([Ic, label]) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                  <Ic size={14} className="text-brand-accent"/>{label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative grid place-items-center py-4 lg:py-0" style={{ perspective: 1400 }}>
            <VirtualCard showDetails={reveal} onToggle={() => setReveal(v => !v)}/>

            <motion.div initial={{ opacity: 0, x: -20, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.6 }}
              className="absolute -bottom-4 -left-2 z-[4] inline-flex items-center gap-2.5 rounded-2xl border border-brand-accent/30 bg-brand-mid/85 px-3.5 py-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:-left-4 lg:-left-8">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-accent/15 text-brand-accent">
                <Banknote size={14}/>
              </span>
              <div>
                <div className="text-xs font-bold leading-[1.1]">Charged $9.99</div>
                <div className="text-[10.5px] text-text-muted">≈ ₦16,360 · Netflix</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.8 }}
              className="absolute -top-3 right-0 z-[4] inline-flex items-center gap-2.5 rounded-2xl border border-brand-accent/30 bg-brand-mid/85 px-3.5 py-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:-right-3 lg:-right-6">
              <ShieldCheck size={14} className="shrink-0 text-brand-accent"/>
              <div>
                <div className="text-xs font-bold leading-[1.1]">3D-Secure pass</div>
                <div className="text-[10.5px] text-text-muted">Approved · 0.4s</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Section id="fx">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div>
            <Head pill="Live FX" title={<>Live rates, <Grad>flat 1.5% spread.</Grad></>}
                  sub="The rate you see is the rate that hits your wallet. No hidden conversion markup."/>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:gap-[18px]" style={{ perspective: 1200 }}>
              {FX_FEED.map(r => (
                <motion.article key={r.code} whileHover={{ rotateX: -6, rotateY: 6, translateY: -6 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative overflow-hidden rounded-[22px] border border-brand-accent/15 bg-brand-mid/60 p-[22px]">
                  <span className="pointer-events-none absolute -top-[50px] -right-[50px] h-[150px] w-[150px] rounded-full opacity-50 blur-[28px]" style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.45), transparent 70%)' }}/>
                  <span className="pointer-events-none absolute -bottom-4 -right-1 select-none font-['Space_Grotesk',sans-serif] text-[110px] font-extrabold leading-none text-brand-accent opacity-[0.08]">{r.sym}</span>
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-brand-accent/25 bg-brand-accent/10 text-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">{r.flag}</span>
                      <div className="min-w-0">
                        <div className="truncate font-['Space_Grotesk',sans-serif] text-sm font-extrabold tracking-tight">{r.code}</div>
                        <div className="font-mono text-[10.5px] text-text-muted">vs NGN</div>
                      </div>
                    </div>
                    <Delta up={r.up}>{r.delta}</Delta>
                  </div>
                  <div className="font-['Space_Grotesk',sans-serif] text-[22px] font-extrabold tracking-tight">{r.rate}</div>
                  <div className="mt-1.5 text-[11px] text-text-muted">per 1 {r.code} · live mid</div>
                </motion.article>
              ))}
            </div>
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <FXTicker/>
          </div>
        </div>
      </Section>

      <Section>
        <Head pill="Where you can spend" title={<>200+ countries. <Grad>One card.</Grad></>}
              sub="Online or in-store. Subscriptions, travel, shopping, ads, SaaS — anywhere Visa is accepted."/>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-3.5" style={{ perspective: 1000 }}>
          {COUNTRIES.map(c => (
            <motion.div key={c.code} whileHover={{ rotateY: 8, rotateX: -4, translateY: -4 }} transition={{ type: 'spring', stiffness: 240, damping: 18 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative flex items-center gap-3 overflow-hidden rounded-[14px] border border-brand-accent/15 bg-gradient-to-br from-brand-mid/70 to-brand-primary/50 p-3.5">
              <span className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-full border border-brand-accent/20 bg-brand-accent/5 text-[20px] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">{c.flag}</span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate font-['Space_Grotesk',sans-serif] text-[13px] font-bold tracking-tight text-text">{c.name}</span>
                <span className="font-mono text-[10.5px] font-bold tracking-wider text-brand-gold-soft">{c.code} · {c.rate}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 flex w-full items-center justify-center gap-1.5 text-xs text-text-muted">
          <MapPin size={12} className="text-brand-accent"/>…plus every country and territory where Visa cards are accepted.
        </p>
      </Section>

      <Section>
        <Head pill="Where it shines" title={<>Built for the way <Grad>you actually spend.</Grad></>}
              sub="The four most common reasons Nigerians need a dollar-billing card — sorted in one tap."/>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5" style={{ perspective: 1300 }}>
          {USES.map(([Ic, title, desc], i) => (
            <motion.div key={title} initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.5, delay:i*0.06 }}
              whileHover={{ rotateX:-5, rotateY:5, translateY:-5 }} style={{ transformStyle:'preserve-3d' }}
              className="relative overflow-hidden rounded-[22px] border border-brand-accent/15 bg-brand-mid/60 p-6">
              <span className="pointer-events-none absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-brand-accent/55 to-transparent"/>
              <span className="pointer-events-none absolute -bottom-10 -right-8 text-brand-accent opacity-[0.08]">
                <Ic size={140} strokeWidth={1}/>
              </span>
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-[14px] border border-brand-accent/35 bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 text-brand-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_18px_rgba(201,162,39,0.18)]"><Ic size={20}/></div>
              <h3 className="mb-2 font-['Space_Grotesk',sans-serif] text-[17px] font-extrabold tracking-tight">{title}</h3>
              <p className="text-[13px] leading-[1.7] text-text-muted">{desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <Head pill="How it works" title={<>From naira to <Grad>any currency</Grad> in 4 steps.</>}
              sub="No applications, no waiting. The card is in your wallet 30 seconds after sign-up."/>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4" style={{ perspective: 1300 }}>
          {STEPS.map(([Ic, title, desc], i) => (
            <motion.div key={title} whileHover={{ rotateX:-5, rotateY:5, translateY:-6 }} transition={{ type:'spring', stiffness:200, damping:18 }}
              style={{ transformStyle:'preserve-3d' }}
              className="relative rounded-[18px] border border-brand-accent/15 bg-brand-primary/55 p-6">
              <span className="pointer-events-none absolute inset-x-3 -top-px h-px bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent"/>
              {i < STEPS.length - 1 && (
                <span className="pointer-events-none absolute right-[-14px] top-1/2 z-[3] hidden -translate-y-1/2 text-brand-accent/60 lg:block">
                  <ChevronRight size={22}/>
                </span>
              )}
              <span className="pointer-events-none absolute top-3 right-4 select-none bg-gradient-to-br from-brand-accent to-brand-gold-soft bg-clip-text font-['Space_Grotesk',sans-serif] text-5xl font-extrabold leading-none tracking-[-0.04em] text-transparent opacity-15">{String(i+1).padStart(2,'0')}</span>
              <div className="mb-3.5 grid h-[46px] w-[46px] place-items-center rounded-[12px] border border-brand-accent/35 bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 text-brand-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_18px_rgba(201,162,39,0.18)]"><Ic size={20}/></div>
              <h3 className="mb-1.5 font-['Space_Grotesk',sans-serif] text-base font-extrabold tracking-tight">{title}</h3>
              <p className="text-[12.5px] leading-[1.65] text-text-muted">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                <Compass size={11} className="text-brand-accent"/>step {String(i+1).padStart(2,'0')}
              </span>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <Head pill="Why VeloxZap card" title={<>Premium controls, <Grad>zero friction.</Grad></>}
              sub="The toggles you actually use — instant freeze, true 3D-Secure, transparent FX."/>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5" style={{ perspective: 1300 }}>
          {FEATURES.map(([Ic, title, desc], i) => (
            <motion.div key={title} initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.5, delay:i*0.06 }}
              whileHover={{ rotateX:-4, rotateY:4, translateY:-4 }} style={{ transformStyle:'preserve-3d' }}
              className="relative overflow-hidden rounded-[22px] border border-brand-accent/15 bg-brand-mid/60 p-6">
              <span className="pointer-events-none absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-brand-accent/55 to-transparent"/>
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-[14px] border border-brand-accent/35 bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 text-brand-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_18px_rgba(201,162,39,0.18)]"><Ic size={20}/></div>
              <h3 className="mb-2 font-['Space_Grotesk',sans-serif] text-[17px] font-extrabold tracking-tight">{title}</h3>
              <p className="text-[13px] leading-[1.7] text-text-muted">{desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </main>
  )
}
