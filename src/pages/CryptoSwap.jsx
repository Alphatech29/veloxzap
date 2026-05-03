import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, ArrowDownRight, ArrowUpRight, ArrowDown, CheckCircle2, ShieldCheck,
  Sparkles, TrendingUp, Wallet, Zap, BadgeCheck, Lock, RefreshCw, Activity, Globe2,
  Boxes, Link2, Hexagon,
} from 'lucide-react'

const STEPS = [
  [Wallet,       'Connect a wallet', 'Send from MetaMask, Trust, Binance — any wallet that holds your coin.'],
  [ArrowDown,    'Pick the pair',    'BTC → NGN, USDT → NGN, ETH → USDC — 60+ pairs at live market rates.'],
  [ShieldCheck,  'Lock the rate',    'Quote is fixed for 90 seconds while you confirm the on-chain transfer.'],
  [CheckCircle2, 'Naira in seconds', 'Funds land in your VeloxZap wallet after 1 confirmation. Withdraw any bank.'],
]

const FEATURES = [
  [TrendingUp, 'Best market rates',   'We aggregate 12+ liquidity sources so you trade at the top of the order book.'],
  [Zap,        'Settled in 60 sec',   'On-chain confirms in 30s, naira hits your wallet in 60s. Withdraw any bank.'],
  [Lock,       'Non-custodial swap',  'Coins move through your wallet — VeloxZap never holds your private keys.'],
  [BadgeCheck, '0.5% spread, no fee', 'Tight spread, zero hidden fees. The naira amount you see is what you get.'],
]

const CHIPS = [[Activity, 'Live aggregator'], [Globe2, '60+ pairs']]
const USDT  = { sym:'USDT', name:'Tether', color:'#26A17B', initials:'₮' }
const NGN   = { sym:'NGN',  name:'Naira',  color:'#0A1F44', initials:'₦' }

const HEX = '%23C9A227'
const HEX_GRID =
  `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='64' viewBox='0 0 56 64'><path d='M28 1 L55 16.5 L55 47.5 L28 63 L1 47.5 L1 16.5 Z' fill='none' stroke='${HEX}' stroke-opacity='0.10' stroke-width='1'/></svg>")`

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

function Cube3D({ size = 88, color = '#C9A227', glyph = '₿', delay = 0, className = '', style = {} }) {
  const half = size / 2
  const face = {
    position: 'absolute',
    width: size,
    height: size,
    border: `1px solid ${color}55`,
    background: `linear-gradient(135deg, ${color}28 0%, ${color}10 60%, transparent 100%)`,
    backdropFilter: 'blur(6px)',
    boxShadow: `inset 0 0 22px ${color}22, 0 0 24px ${color}33`,
    display: 'grid',
    placeItems: 'center',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 800,
    fontSize: size * 0.4,
    color: color,
    textShadow: `0 0 14px ${color}aa`,
  }
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      style={{ width: size, height: size, perspective: 800, ...style }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay }}
    >
      <motion.div
        style={{ width: size, height: size, position: 'relative', transformStyle: 'preserve-3d' }}
        animate={{ rotateX: [10, 14, 10], rotateY: [0, 360] }}
        transition={{
          rotateX: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          rotateY: { duration: 18, repeat: Infinity, ease: 'linear' },
        }}
      >
        <div style={{ ...face, transform: `translateZ(${half}px)` }}>{glyph}</div>
        <div style={{ ...face, transform: `rotateY(180deg) translateZ(${half}px)` }}>{glyph}</div>
        <div style={{ ...face, transform: `rotateY(90deg) translateZ(${half}px)` }}/>
        <div style={{ ...face, transform: `rotateY(-90deg) translateZ(${half}px)` }}/>
        <div style={{ ...face, transform: `rotateX(90deg) translateZ(${half}px)` }}/>
        <div style={{ ...face, transform: `rotateX(-90deg) translateZ(${half}px)` }}/>
      </motion.div>
    </motion.div>
  )
}

function MeshNetwork() {
  return (
    <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="meshLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#E8C547" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      <g stroke="url(#meshLine)" strokeWidth="0.6" fill="none">
        <path d="M0,120 L300,80 L520,200 L780,140 L1100,260 L1400,180"/>
        <path d="M0,360 L240,300 L480,420 L760,340 L1040,460 L1400,380"/>
        <path d="M0,560 L260,500 L500,620 L820,540 L1120,660 L1400,580"/>
      </g>
      <g fill="#C9A227">
        {[[300,80],[520,200],[780,140],[1100,260],[240,300],[480,420],[760,340],[1040,460],[260,500],[500,620],[820,540],[1120,660]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="2.5" opacity="0.85"/>
        ))}
      </g>
    </svg>
  )
}

function BlockTicker() {
  const [blocks, setBlocks] = useState([
    { hash: '0x4a7f…b29c', amount: '0.842 BTC', when: '2s ago' },
    { hash: '0x91d2…fe04', amount: '1,250 USDT', when: '5s ago' },
    { hash: '0xc83a…7715', amount: '3.4 ETH', when: '11s ago' },
    { hash: '0x6e09…2dd1', amount: '480 SOL', when: '19s ago' },
  ])
  useEffect(() => {
    const id = setInterval(() => {
      setBlocks(prev => {
        const next = [
          { hash: '0x' + Math.random().toString(16).slice(2,6) + '…' + Math.random().toString(16).slice(2,6),
            amount: (Math.random()*5).toFixed(2) + ' ' + ['BTC','ETH','USDT','SOL'][Math.floor(Math.random()*4)],
            when: 'just now' },
          ...prev.slice(0,3),
        ]
        return next
      })
    }, 3500)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="rounded-[20px] border border-brand-accent/20 bg-brand-primary/55 p-5 backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Boxes size={16} className="text-brand-accent"/>
          <span className="font-['Space_Grotesk',sans-serif] text-[13px] font-extrabold tracking-tight">Latest blocks</span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#4ade80]">
          <span className="h-1.5 w-1.5 animate-[pulse_1.6s_infinite] rounded-full bg-[#4ade80]"/>live
        </span>
      </div>
      <ul className="space-y-2">
        {blocks.map((b, i) => (
          <motion.li key={b.hash + i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
            className="flex items-center justify-between gap-3 rounded-xl border border-text/5 bg-text/[0.03] px-3 py-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-brand-accent/30 bg-brand-accent/10 text-brand-accent">
                <Hexagon size={12}/>
              </span>
              <div className="min-w-0">
                <div className="truncate font-mono text-[11px] font-bold text-text">{b.hash}</div>
                <div className="truncate text-[10.5px] text-text-muted">{b.amount}</div>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-muted">{b.when}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function Leg({ label, leg, onChange, fiat }) {
  return (
    <div className="rounded-2xl border border-text/10 bg-text/5 p-4">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">{label}</div>
      <div className="flex items-center justify-between gap-3">
        <input type="text" value={leg.amount} onChange={e=>onChange(e.target.value)}
          className="w-full min-w-0 border-none bg-transparent font-['Space_Grotesk',sans-serif] text-[28px] font-extrabold tracking-tight text-text outline-none"/>
        <button type="button" className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-mid/75 px-3 py-1.5 font-['Space_Grotesk',sans-serif] text-[13px] font-extrabold">
          <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full text-[10px] font-extrabold text-white" style={{background:leg.coin.color}}>{leg.coin.initials}</span>
          {leg.coin.sym}
        </button>
      </div>
      <div className="mt-1.5 text-[11px] text-text-muted">{fiat}</div>
    </div>
  )
}

export default function CryptoSwap() {
  const [from, setFrom] = useState({ coin: USDT, amount: '500' })
  const [to,   setTo]   = useState({ coin: NGN,      amount: '806,000' })
  const flip = () => { const a = from; setFrom(to); setTo(a) }

  return (
    <main className="main-offset relative isolate min-h-screen overflow-hidden text-text" style={{background:STAGE_BG}}>
      <div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: HEX_GRID, backgroundSize: '56px 64px', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 100%)' }}/>
      <MeshNetwork/>
      <div className="pointer-events-none absolute top-[5%] -right-[130px] z-0 h-[480px] w-[480px] rounded-full opacity-45 blur-[80px]" style={{background:'radial-gradient(circle, var(--color-brand-accent) 0%, transparent 70%)'}}/>
      <div className="pointer-events-none absolute bottom-[8%] -left-[120px] z-0 h-[520px] w-[520px] rounded-full opacity-45 blur-[80px]" style={{background:'radial-gradient(circle, var(--color-brand-gold-soft) 0%, transparent 70%)'}}/>

      <section className="relative z-[2] py-7 md:py-14 lg:py-[72px]">
        <div className="relative z-[2] mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-7 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div className="flex min-w-0 flex-col gap-5">
            <Pill tone="gold">
              <span className="h-1.5 w-1.5 animate-[pulse_1.6s_infinite] rounded-full bg-brand-accent shadow-[0_0_10px_var(--color-brand-accent)]"/>
              CRYPTO SWAP · ON-CHAIN
            </Pill>
            <h1 className="font-['Space_Grotesk',sans-serif] text-[clamp(36px,6.4vw,60px)] font-extrabold leading-[1.04] tracking-[-0.03em]">
              Swap crypto to naira on the <Grad>fastest blockchain rail.</Grad>
            </h1>
            <p className="max-w-[540px] text-[15px] leading-[1.7] text-text-muted lg:text-base">
              BTC, USDT, ETH and 60+ pairs — aggregated from 12 liquidity sources, tight 0.5% spread, naira lands in your wallet 60 seconds after the on-chain confirm.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/auth/register" className={ctaGold}>Start a swap <ArrowRight size={16}/></Link>
              <a href="#rates" className={ctaGhost}>See live rates <ArrowDownRight size={16}/></a>
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
            <Cube3D size={70}  glyph="₿" color="#F7931A" delay={0.2} className="absolute -left-2 -top-4 z-[3] sm:-left-6 lg:-left-10" style={{ filter: 'drop-shadow(0 18px 30px rgba(247,147,26,0.35))' }}/>
            <Cube3D size={56}  glyph="Ξ" color="#627EEA" delay={0.4} className="absolute -bottom-4 right-4 z-[3] sm:right-6 lg:right-2" style={{ filter: 'drop-shadow(0 18px 30px rgba(98,126,234,0.35))' }}/>
            <Cube3D size={44}  glyph="₮" color="#26A17B" delay={0.6} className="absolute bottom-10 -left-4 z-[3] hidden sm:block lg:-left-12" style={{ filter: 'drop-shadow(0 18px 30px rgba(38,161,123,0.35))' }}/>

            <motion.div initial={{opacity:0, y:30, rotateX:18}} animate={{opacity:1, y:0, rotateX:0}} transition={{duration:0.7, ease:'easeOut'}}
              whileHover={{ rotateX: -4, rotateY: 6 }}
              style={{ transformStyle: 'preserve-3d', transition: 'transform 0.4s ease' }}
              className="relative w-full max-w-[420px] rounded-[28px] border border-brand-accent/25 bg-brand-primary/70 p-5 shadow-[0_28px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06),0_0_0_1px_rgba(201,162,39,0.08)] backdrop-blur-xl sm:p-6">
              <span className="pointer-events-none absolute inset-0 rounded-[28px]" style={{ background: 'linear-gradient(135deg, transparent 30%, rgba(201,162,39,0.18) 50%, transparent 70%)', mixBlendMode: 'overlay' }}/>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 font-['Space_Grotesk',sans-serif] text-base font-extrabold tracking-tight">
                  <Boxes size={16} className="text-brand-accent"/>Swap
                </div>
                <span className="rounded-full border border-brand-accent/30 bg-brand-accent/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-gold-soft">Block · 891,402</span>
              </div>
              <Leg label="You send" leg={from} onChange={a=>setFrom({...from, amount:a})} fiat="$500.00"/>
              <div className="relative h-0">
                <button onClick={flip} aria-label="Flip" type="button"
                  className="absolute left-1/2 top-1/2 z-10 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-xl border-[3px] border-brand-primary bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_6px_16px_rgba(201,162,39,0.4)]">
                  <RefreshCw size={14}/>
                </button>
              </div>
              <Leg label="You receive" leg={to} onChange={a=>setTo({...to, amount:a})} fiat="≈ ₦806,000"/>
              <div className="mt-3.5 flex items-center justify-between gap-3 text-xs text-text-muted">
                <span>1 USDT ≈ <strong className="font-bold text-text">₦1,612</strong></span>
                <span>Locks in <strong className="font-bold text-text">01:28</strong></span>
              </div>
              <button type="button" className="mt-3.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-none bg-gradient-to-br from-brand-accent to-brand-gold-soft px-4 py-3.5 text-sm font-extrabold text-brand-primary shadow-[0_10px_24px_rgba(201,162,39,0.35)]">
                Confirm swap <ArrowRight size={16}/>
              </button>
            </motion.div>

            <motion.div initial={{opacity:0, x:20, y:-20}} animate={{opacity:1, x:0, y:0}} transition={{delay:0.7}}
              className="absolute -top-3 right-0 z-[4] inline-flex items-center gap-2.5 rounded-2xl border border-brand-accent/30 bg-brand-mid/80 px-3.5 py-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:-right-3 lg:-right-6">
              <TrendingUp size={14} className="shrink-0 text-brand-accent"/>
              <div>
                <div className="text-xs font-bold leading-[1.1]">BTC · ₦98.4M</div>
                <div className="text-[10.5px] text-text-muted">+2.4% today</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Section>
        <Head pill="How it works" title={<>From wallet to <Grad>naira</Grad> in 4 blocks.</>}
              sub="No order books to read, no slippage surprises. We handle routing, you keep custody."/>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4" style={{ perspective: 1300 }}>
          {STEPS.map(([Ic, title, desc], i) => (
            <motion.div key={title} whileHover={{ rotateX: -5, rotateY: 5, translateY: -6 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative rounded-[18px] border border-brand-accent/15 bg-brand-primary/55 p-6">
              <span className="pointer-events-none absolute inset-x-3 -top-px h-px bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent"/>
              {i < STEPS.length - 1 && (
                <span className="pointer-events-none absolute right-[-14px] top-1/2 z-[3] hidden -translate-y-1/2 text-brand-accent/60 lg:block">
                  <Link2 size={20}/>
                </span>
              )}
              <span className="pointer-events-none absolute top-3 right-4 select-none bg-gradient-to-br from-brand-accent to-brand-gold-soft bg-clip-text font-['Space_Grotesk',sans-serif] text-5xl font-extrabold leading-none tracking-[-0.04em] text-transparent opacity-15">{String(i+1).padStart(2,'0')}</span>
              <div className="mb-3.5 grid h-[46px] w-[46px] place-items-center rounded-[12px] border border-brand-accent/35 bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 text-brand-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_18px_rgba(201,162,39,0.18)]"><Ic size={20}/></div>
              <h3 className="mb-1.5 font-['Space_Grotesk',sans-serif] text-base font-extrabold tracking-tight">{title}</h3>
              <p className="text-[12.5px] leading-[1.65] text-text-muted">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                <Hexagon size={10} className="text-brand-accent"/>block #{(891400 + i).toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <Head pill="Why VeloxZap" title={<>Built for traders who hate <Grad>spread tax.</Grad></>}
              sub="Tight spread, non-custodial flow, and a quote that doesn't move on you mid-swap."/>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 lg:gap-5" style={{ perspective: 1300 }}>
            {FEATURES.map(([Ic, title, desc], i) => (
              <motion.div key={title} initial={{opacity:0, y:18}} whileInView={{opacity:1, y:0}} viewport={{once:true, margin:'-60px'}} transition={{duration:0.5, delay:i*0.06}}
                whileHover={{ rotateX: -4, rotateY: 4, translateY: -4 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative overflow-hidden rounded-[22px] border border-brand-accent/15 bg-brand-mid/60 p-6">
                <span className="pointer-events-none absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-brand-accent/55 to-transparent"/>
                <span className="pointer-events-none absolute -bottom-12 -right-12 opacity-[0.06]" style={{ color: '#C9A227' }}>
                  <Hexagon size={150} strokeWidth={1}/>
                </span>
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-[14px] border border-brand-accent/35 bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 text-brand-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_18px_rgba(201,162,39,0.18)]"><Ic size={20}/></div>
                <h3 className="mb-2 font-['Space_Grotesk',sans-serif] text-[17px] font-extrabold tracking-tight">{title}</h3>
                <p className="text-[13px] leading-[1.7] text-text-muted">{desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <BlockTicker/>
          </div>
        </div>
      </Section>
    </main>
  )
}
