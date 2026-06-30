

import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useSettings from '../../hooks/useSettings'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  ArrowRight, Mail, MapPin, Phone,
  ShieldCheck, Lock, BadgeCheck,
} from 'lucide-react'

const SocialIcons = {
  Twitter: props => (
    <svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Instagram: props => (
    <svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  Facebook: props => (
    <svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="currentColor" aria-hidden>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12z" />
    </svg>
  ),
  Linkedin: props => (
    <svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.11 2.06 2.06 0 0 1 0 4.11zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  Telegram: props => (
    <svg viewBox="0 0 24 24" width={props.size} height={props.size} fill="currentColor" aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  ),
}

const C = {
  navy:      'var(--color-brand-primary)',
  navyMid:   'var(--color-brand-mid)',
  gold:      'var(--color-brand-accent)',
  champagne: 'var(--color-brand-gold-soft)',
  text:      'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
}

const tint = (color, percent) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`

const LINKS = {
  Products: [
    ['Buy & Sell Gift Cards', '/gift-cards'],
    ['Pay Bills',             '/bills'],
    ['Spend Globally',        '/spend'],
    ['Virtual Card',          '/virtual-card'],
    ['Airtime & Data',        '/airtime'],
    ['Live Rates',            '/rates'],
  ],
  Company: [
    ['About Us', '/about'],
    ['Blog',     '/blog'],
    ['Press',    '/press'],
  ],
  Legal: [
    ['Privacy Policy',   '/privacy'],
    ['Terms of Service', '/terms'],
    ['Cookie Policy',    '/cookies'],
  ],
  Support: [
    ['Contact Us',    '/contact'],
    ['System Status', '/status'],
    ['Community',     '/community'],
  ],
}


const BADGES = [
  { Icon: ShieldCheck, label: 'Enterprise Security' },
  { Icon: Lock,        label: 'PCI DSS'      },
  { Icon: BadgeCheck,  label: 'ISO 27001'    },
]

function BrandMark3D() {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 220, damping: 16 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 220, damping: 16 })

  function handleMove(e) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width  - 0.5)
    my.set((e.clientY - r.top)  / r.height - 0.5)
  }
  function handleLeave() { mx.set(0); my.set(0) }

  return (
    <Link
      to="/"
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        marginBottom: 18,
        perspective: 800,
      }}
    >
      <motion.img
        src="/logo-2.png"
        alt="VeloxZap"
        style={{
          rotateX: rx, rotateY: ry,
          height: 36, width: 'auto', objectFit: 'contain',
        }}
      />
    </Link>
  )
}

function NewsletterCapsule() {
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 2400)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: 4, borderRadius: 999, maxWidth: 380,
        background: tint(C.navyMid, 60),
        border: `1px solid ${tint(C.gold, 18)}`,
        boxShadow: `inset 0 1px 0 ${tint('white', 4)}`,
      }}
    >
      <Mail size={15} color={tint(C.gold, 80)} style={{ marginLeft: 12 }} />
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          padding: '10px 6px', color: C.text, fontSize: 13,
        }}
      />
      <button type="submit" className="fz-cta-gold">
        {sent ? 'Sent!' : 'Subscribe'}
        {!sent && <ArrowRight size={14} />}
      </button>
    </form>
  )
}

export default function Footer() {
  const { settings } = useSettings()

  const contactLines = [
    settings?.office_address && { Icon: MapPin, text: settings.office_address },
    settings?.support_phone && { Icon: Phone,  text: settings.support_phone },
    settings?.support_email && { Icon: Mail,   text: settings.support_email },
  ].filter(Boolean)

  const socials = [
    settings?.twitter_url   && { Icon: SocialIcons.Twitter,   label: 'Twitter',   href: settings.twitter_url },
    settings?.instagram_url && { Icon: SocialIcons.Instagram, label: 'Instagram', href: settings.instagram_url },
    settings?.facebook_url  && { Icon: SocialIcons.Facebook,  label: 'Facebook',  href: settings.facebook_url },
    settings?.linkedin_url  && { Icon: SocialIcons.Linkedin,  label: 'LinkedIn',  href: settings.linkedin_url },
    settings?.telegram_url  && { Icon: SocialIcons.Telegram,  label: 'Telegram',  href: settings.telegram_url },
  ].filter(Boolean)

  const [spot, setSpot] = useState({ x: 50, y: 50, on: false })
  function trackSpot(e) {
    const r = e.currentTarget.getBoundingClientRect()
    setSpot({
      x: ((e.clientX - r.left) / r.width)  * 100,
      y: ((e.clientY - r.top)  / r.height) * 100,
      on: true,
    })
  }

  return (
    <footer
      onMouseMove={trackSpot}
      onMouseLeave={() => setSpot(s => ({ ...s, on: false }))}
      style={{
        position: 'relative',
        background: `linear-gradient(180deg, ${tint(C.navy, 92)} 0%, ${C.navy} 100%)`,
        borderTop: `1px solid ${tint(C.gold, 14)}`,
        overflow: 'hidden',
      }}
    >
      
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${tint(C.gold, 70)}, ${tint(C.champagne, 50)}, ${tint(C.gold, 70)}, transparent)`,
        }}
      />

      
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(circle 480px at ${spot.x}% ${spot.y}%, ${tint(C.gold, 8)}, transparent 60%)`,
          opacity: spot.on ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />

      
      <div
        aria-hidden
        style={{
          position: 'absolute', top: -120, right: -120, width: 360, height: 360, borderRadius: '50%',
          background: `radial-gradient(circle, ${tint(C.gold, 9)} 0%, transparent 70%)`,
          pointerEvents: 'none', filter: 'blur(20px)',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute', bottom: -120, left: -120, width: 360, height: 360, borderRadius: '50%',
          background: `radial-gradient(circle, ${tint(C.champagne, 8)} 0%, transparent 70%)`,
          pointerEvents: 'none', filter: 'blur(20px)',
        }}
      />

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '80px 24px 32px' }}>

        
        <div className="fz-foot-cta">
          <div>
            <h3
              style={{
                margin: 0, fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800,
                color: C.text, letterSpacing: '-0.02em', lineHeight: 1.2,
              }}
            >
              Stay ahead of the{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.gold}, ${C.champagne})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                rates.
              </span>
            </h3>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: C.textMuted, maxWidth: 460 }}>
              Get weekly market briefings, product drops, and exclusive perks — straight to your inbox.
            </p>
          </div>
          <NewsletterCapsule />
        </div>

        
        <div
          style={{
            height: 1, margin: '40px 0',
            background: `linear-gradient(90deg, transparent, ${tint(C.gold, 18)}, transparent)`,
          }}
        />

        
        <div className="fz-foot-grid">

          
          <div>
            <BrandMark3D />
            <p
              style={{
                fontSize: 13, color: C.textMuted, lineHeight: 1.75,
                maxWidth: 280, margin: '0 0 22px',
              }}
            >
              Africa's premium platform for gift cards, bill payments, virtual cards, and instant airtime.
              Built for speed. Trusted by half a million Nigerians.
            </p>

            {/* Contact lines */}
            {contactLines.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
                {contactLines.map(({ Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={13} color={tint(C.gold, 80)} />
                    <span style={{ fontSize: 12, color: C.textMuted }}>{text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {BADGES.map(({ Icon, label }) => (
                <span
                  key={label}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                    color: C.gold,
                    background: tint(C.gold, 10),
                    border: `1px solid ${tint(C.gold, 24)}`,
                    borderRadius: 6, padding: '4px 9px',
                    textTransform: 'uppercase',
                  }}
                >
                  <Icon size={10} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p
                style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                  color: C.gold, textTransform: 'uppercase',
                  margin: '0 0 18px', position: 'relative',
                  paddingBottom: 10,
                }}
              >
                {group}
                <span
                  style={{
                    position: 'absolute', left: 0, bottom: 0, width: 24, height: 2,
                    background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                    borderRadius: 2,
                  }}
                />
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="fz-foot-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Socials row */}
        <div
          style={{
            marginTop: 56, paddingTop: 28,
            borderTop: `1px solid ${tint('white', 6)}`,
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          }}
        >
          <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 500 }}>
            Follow the journey
          </span>
          {socials.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="fz-soc"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: 28, paddingTop: 20,
            borderTop: `1px solid ${tint('white', 4)}`,
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}
        >
          <p style={{ fontSize: 12, color: tint(C.text, 35), margin: 0, fontFamily: 'monospace' }}>
            © {new Date().getFullYear()} {settings?.site_name} — Crafted in Lagos.
          </p>
          <div style={{ display: 'flex', gap: 18 }}>
            {[['Privacy', '/privacy'], ['Terms', '/terms']].map(([label, href]) => (
              <Link key={label} to={href} className="fz-foot-mini">{label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom shimmer line */}
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${tint(C.gold, 60)}, ${tint(C.champagne, 80)}, ${tint(C.gold, 60)}, transparent)`,
        }}
      />

      <style>{`
        .fz-foot-cta {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: center;
        }
        @media (min-width: 768px) {
          .fz-foot-cta { grid-template-columns: 1fr auto; gap: 32px; }
        }

        .fz-foot-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 640px) {
          .fz-foot-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .fz-foot-grid { grid-template-columns: 1.6fr 1fr 1fr 1fr 1fr; gap: 48px; }
        }

        .fz-foot-link {
          position: relative;
          display: inline-block;
          font-size: 13px;
          color: ${C.textMuted};
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .fz-foot-link::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          width: 0; height: 1px;
          background: ${C.gold};
          transition: width 0.25s ease;
        }
        .fz-foot-link:hover {
          color: ${C.text};
          transform: translateX(8px);
        }
        .fz-foot-link:hover::before { width: 6px; }

        .fz-foot-mini {
          font-size: 12px;
          color: ${tint(C.text, 35)};
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .fz-foot-mini:hover { color: ${C.gold}; }

        .fz-soc {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 10px;
          color: ${tint(C.text, 60)};
          background: ${tint(C.navyMid, 50)};
          border: 1px solid ${tint(C.gold, 12)};
          transition: transform 0.25s ease, box-shadow 0.25s ease, color 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .fz-soc:hover {
          color: ${C.navy};
          background: linear-gradient(135deg, ${C.gold}, ${C.champagne});
          border-color: ${tint(C.gold, 60)};
          transform: translateY(-3px) scale(1.06);
          box-shadow: 0 10px 24px ${tint(C.gold, 28)};
        }

        .fz-cta-gold {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          color: ${C.navy};
          background: linear-gradient(135deg, ${C.gold}, ${C.champagne});
          cursor: pointer;
          box-shadow: 0 6px 18px ${tint(C.gold, 30)};
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .fz-cta-gold:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px ${tint(C.gold, 42)};
        }
        .fz-cta-gold:active { transform: translateY(0); }
      `}</style>
    </footer>
  )
}
