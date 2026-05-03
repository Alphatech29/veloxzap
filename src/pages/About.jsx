import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Sparkles, Target, Compass, ShieldCheck, Heart,
  Users, Rocket, Zap, Globe2, Award, Building2, TrendingUp,
  Lock, BadgeCheck, Quote,
} from 'lucide-react'
import { colors, tint, gradientText } from '../components/landing/theme'
import CountUp from '../components/landing/CountUp'

const goldGrad = `linear-gradient(135deg, ${colors.gold}, ${colors.champagne})`

const STATS = [
  { value: 500, suffix: 'K+',  label: 'Active customers',    icon: Users      },
  { value: 45.2, suffix: 'M+',  prefix: '₦', label: 'Processed monthly', decimals: 1, icon: TrendingUp },
  { value: 200, suffix: '+',   label: 'Countries supported', icon: Globe2     },
  { value: 99.9,suffix: '%',   label: 'Uptime guarantee',    decimals: 1, icon: ShieldCheck },
]

const VALUES = [
  { icon: Zap,         title: 'Speed obsessed',       desc: 'Every transaction, every screen, every support ticket. We measure ourselves in seconds, not days.' },
  { icon: ShieldCheck, title: 'Security first',       desc: 'Bank-grade encryption, biometric auth, and 24/7 fraud monitoring. Your money is safer with us than under the mattress.' },
  { icon: Heart,       title: 'Customer obsessed',    desc: 'Real humans, real answers. Our support team responds in under 90 seconds — no chatbots, no scripts.' },
  { icon: Target,      title: 'Radically transparent',desc: 'No hidden fees. No fine print. The rate you see is the rate you get — every single time.' },
  { icon: Rocket,      title: 'Built for Africa',     desc: 'We understand the realities — slow banks, FX crunches, dollar squeeze. We build solutions for here.' },
  { icon: Compass,     title: 'Move with purpose',    desc: 'We ship features Nigerians actually need, not features that look good on pitch decks.' },
]

const TIMELINE = [
  { year: '2022', title: 'The spark',         desc: 'Three friends frustrated with bank delays and crypto scams sketched VeloxZap on a napkin in Lagos.' },
  { year: '2023', title: 'First 10,000',      desc: 'Beta launched with gift card trading. Hit ten thousand users in 90 days — entirely word-of-mouth.' },
  { year: '2024', title: 'Series A',          desc: 'Raised $8M led by tier-one African VCs to expand into bills, airtime, and crypto swap.' },
  { year: '2025', title: 'Global card',       desc: 'Launched the VeloxZap Visa card. 200+ countries unlocked for naira holders.' },
  { year: '2026', title: 'Half a million',    desc: 'Crossed 500K active customers. Now processing over ₦1.2B in transactions every month.' },
]

const LEADERS = [
  { name: 'Adaeze Okonkwo',   role: 'Co-founder & CEO',  bio: 'Ex-Flutterwave product lead. Built payment rails for 12M+ users across West Africa.', initials: 'AO' },
  { name: 'Tunde Bakare',     role: 'Co-founder & CTO',  bio: 'Former Paystack staff engineer. Designed the fraud system that stopped ₦4B in attempted fraud.', initials: 'TB' },
  { name: 'Chiamaka Eze',     role: 'Co-founder & COO',  bio: 'Goldman Sachs alum. Ran African expansion ops at three fintechs before returning home.', initials: 'CE' },
  { name: 'Daniel Adesanya',  role: 'Head of Engineering',bio: 'Scaled trading systems handling $2B+ daily at Binance. Now building the rails for African finance.', initials: 'DA' },
]

const RECOGNITION = [
  { icon: BadgeCheck,  label: 'CBN Licensed',       sub: 'Full regulatory compliance'   },
  { icon: Lock,        label: 'PCI DSS Level 1',    sub: 'Highest security certification'},
  { icon: Award,       label: 'Y Combinator W23',   sub: 'Top fintech cohort'           },
  { icon: Building2,   label: 'TechCabal Top 30',   sub: 'African startups to watch'    },
]

const SECTION = { position: 'relative', zIndex: 2, padding: '90px 24px' }
const WRAP    = { maxWidth: 1240, margin: '0 auto' }

const PILL = (gold = false) => ({
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '6px 14px', borderRadius: 99,
  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
  fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: gold ? colors.gold : colors.textMuted,
  background: gold ? tint(colors.gold, 10) : tint(colors.text, 5),
  border: `1px solid ${gold ? tint(colors.gold, 28) : tint(colors.text, 10)}`,
})

export default function About() {
  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        paddingTop: 104,
        background:
          `radial-gradient(ellipse 60% 40% at 80% 0%, ${tint(colors.gold, 10)}, transparent 60%),` +
          `radial-gradient(ellipse 60% 40% at 20% 100%, ${tint(colors.champagne, 8)}, transparent 65%),` +
          `linear-gradient(180deg, var(--color-primary-500) 0%, ${colors.navy} 50%, var(--color-primary-700) 100%)`,
        overflow: 'hidden',
      }}
    >

      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08,
          backgroundImage: `radial-gradient(${tint('white', 100)} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black, transparent 75%)',
        }}
      />


      <section style={{ ...SECTION, paddingTop: 60, paddingBottom: 80 }}>
        <div style={{ ...WRAP, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={PILL(true)}>
              <Sparkles size={11} /> About VeloxZap
            </span>
          </motion.div>

          <motion.h1
            className="f-head"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            style={{
              margin: '20px auto 18px',
              maxWidth: 920,
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: '-0.04em',
              color: colors.text,
            }}
          >
            We're rewriting how{' '}
            <span style={gradientText(`linear-gradient(110deg, ${colors.gold}, ${colors.champagne}, ${colors.gold})`)}>
              Africa moves money.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            style={{
              maxWidth: 640, margin: '0 auto 32px',
              fontSize: 17, lineHeight: 1.7,
              color: colors.textMuted,
            }}
          >
            VeloxZap is a Lagos-born fintech building the fastest, safest way for Nigerians to trade,
            pay, and spend — without waiting on banks or bleeding out fees.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/auth/register" className="cta-gold">
              Join VeloxZap <ArrowRight size={16} />
            </Link>
            <Link to="/company/careers" className="cta-ghost">
              See open roles
            </Link>
          </motion.div>
        </div>
      </section>


      <section style={{ ...SECTION, paddingTop: 40, paddingBottom: 80 }}>
        <div style={WRAP}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'grid', gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}
          >
            {STATS.map(({ value, prefix, suffix, decimals, label, icon: Icon }) => (
              <div
                key={label}
                style={{
                  position: 'relative',
                  padding: '28px 24px',
                  borderRadius: 18,
                  background: `linear-gradient(180deg, ${tint(colors.navyMid, 60)}, ${tint(colors.navy, 70)})`,
                  border: `1px solid ${tint(colors.gold, 14)}`,
                  boxShadow: `0 12px 40px ${tint('black', 30)}, inset 0 1px 0 ${tint('white', 5)}`,
                  overflow: 'hidden',
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
                    background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 60)}, transparent)`,
                  }}
                />
                <div
                  style={{
                    width: 38, height: 38, borderRadius: 11,
                    background: tint(colors.gold, 12),
                    border: `1px solid ${tint(colors.gold, 26)}`,
                    display: 'grid', placeItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <Icon size={18} color={colors.gold} />
                </div>
                <div
                  className="f-head"
                  style={{
                    fontSize: 'clamp(28px, 3.6vw, 40px)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: colors.text,
                    lineHeight: 1.05,
                  }}
                >
                  <CountUp end={value} prefix={prefix} suffix={suffix} decimals={decimals} />
                </div>
                <p style={{ margin: '6px 0 0', fontSize: 13.5, color: colors.textMuted }}>
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>


      <section style={SECTION}>
        <div style={WRAP}>
          <div
            style={{
              display: 'grid', gap: 60,
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
            >
              <span style={PILL()}>Our story</span>
              <h2
                className="f-head"
                style={{
                  margin: '18px 0 18px',
                  fontSize: 'clamp(28px, 4.4vw, 44px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.12,
                  color: colors.text,
                }}
              >
                Born from frustration.{' '}
                <span style={gradientText(goldGrad)}>Built for liberation.</span>
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: colors.textMuted, margin: '0 0 16px' }}>
                In 2022, three Nigerians stuck waiting four days for a wire transfer asked a simple
                question: <em>why is moving our own money this hard?</em>
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: colors.textMuted, margin: '0 0 16px' }}>
                Banks were slow. Crypto was risky. Gift card buyers were getting scammed. Every
                solution served the institution, not the person. So we built one that does the
                opposite.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: colors.textMuted, margin: 0 }}>
                Today, VeloxZap is trusted by half a million Nigerians who are done waiting on
                permission to use their own money.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              style={{
                position: 'relative',
                padding: 36,
                borderRadius: 24,
                background: `linear-gradient(135deg, ${tint(colors.navyMid, 70)}, ${tint(colors.navy, 80)})`,
                border: `1px solid ${tint(colors.gold, 18)}`,
                boxShadow: `0 24px 70px ${tint('black', 50)}, inset 0 1px 0 ${tint('white', 6)}`,
                overflow: 'hidden',
              }}
            >
              <div
                aria-hidden
                style={{
                  position: 'absolute', top: -100, right: -100, width: 280, height: 280,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${tint(colors.gold, 18)} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />
              <Quote size={36} color={colors.gold} style={{ marginBottom: 14, opacity: 0.85 }} />
              <p
                className="f-head"
                style={{
                  fontSize: 'clamp(20px, 2.4vw, 26px)',
                  fontWeight: 600,
                  lineHeight: 1.45,
                  color: colors.text,
                  margin: '0 0 22px',
                  letterSpacing: '-0.01em',
                }}
              >
                "We don't see ourselves as a fintech. We're a permission-stripping company.
                Every product we ship removes one more middleman between you and your money."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: goldGrad,
                    color: colors.navy,
                    display: 'grid', placeItems: 'center',
                    fontWeight: 800, fontSize: 14,
                    boxShadow: `0 6px 18px ${tint(colors.gold, 40)}`,
                  }}
                >
                  AO
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14.5, color: colors.text }}>
                    Adaeze Okonkwo
                  </p>
                  <p style={{ margin: 0, fontSize: 12.5, color: colors.textMuted }}>
                    Co-founder & CEO
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      <section style={SECTION}>
        <div style={WRAP}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <span style={PILL()}>What we believe</span>
            <h2
              className="f-head"
              style={{
                margin: '18px auto 14px',
                maxWidth: 720,
                fontSize: 'clamp(28px, 4.4vw, 46px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: colors.text,
              }}
            >
              The principles that guide{' '}
              <span style={gradientText(goldGrad)}>every decision.</span>
            </h2>
            <p style={{ maxWidth: 580, margin: '0 auto', fontSize: 15.5, color: colors.textMuted, lineHeight: 1.7 }}>
              We picked these six values not because they sound good on a careers page, but because
              we measure ourselves against them every week.
            </p>
          </div>

          <div
            style={{
              display: 'grid', gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                style={{
                  position: 'relative',
                  padding: 26,
                  borderRadius: 18,
                  background: `linear-gradient(180deg, ${tint(colors.navyMid, 50)}, ${tint(colors.navy, 60)})`,
                  border: `1px solid ${tint(colors.gold, 12)}`,
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = tint(colors.gold, 30)
                  e.currentTarget.style.boxShadow = `0 18px 40px ${tint('black', 35)}, 0 0 32px ${tint(colors.gold, 10)}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = tint(colors.gold, 12)
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: tint(colors.gold, 12),
                    border: `1px solid ${tint(colors.gold, 26)}`,
                    display: 'grid', placeItems: 'center',
                    marginBottom: 16,
                    boxShadow: `0 0 20px ${tint(colors.gold, 14)}`,
                  }}
                >
                  <Icon size={20} color={colors.gold} />
                </div>
                <h3
                  className="f-head"
                  style={{
                    margin: '0 0 8px',
                    fontSize: 18, fontWeight: 700,
                    color: colors.text,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {title}
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: colors.textMuted, lineHeight: 1.65 }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section style={SECTION}>
        <div style={WRAP}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={PILL()}>Our journey</span>
            <h2
              className="f-head"
              style={{
                margin: '18px auto 14px',
                maxWidth: 720,
                fontSize: 'clamp(28px, 4.4vw, 46px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: colors.text,
              }}
            >
              From napkin sketch to{' '}
              <span style={gradientText(goldGrad)}>half a million users.</span>
            </h2>
          </div>

          <div style={{ position: 'relative', maxWidth: 820, margin: '0 auto' }}>

            <div
              aria-hidden
              style={{
                position: 'absolute', top: 0, bottom: 0,
                left: 22,
                width: 2,
                background: `linear-gradient(180deg, ${tint(colors.gold, 50)}, ${tint(colors.champagne, 30)}, transparent)`,
              }}
            />

            {TIMELINE.map(({ year, title, desc }, i) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                style={{
                  position: 'relative',
                  paddingLeft: 64,
                  paddingBottom: i === TIMELINE.length - 1 ? 0 : 32,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 12, top: 6,
                    width: 22, height: 22, borderRadius: '50%',
                    background: goldGrad,
                    boxShadow: `0 0 0 4px ${tint(colors.navy, 90)}, 0 0 20px ${tint(colors.gold, 50)}`,
                    display: 'grid', placeItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: colors.navy,
                    }}
                  />
                </div>
                <div
                  className="f-mono"
                  style={{
                    fontSize: 11.5, fontWeight: 700, letterSpacing: '0.16em',
                    color: colors.gold, textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  {year}
                </div>
                <h3
                  className="f-head"
                  style={{
                    margin: '0 0 6px',
                    fontSize: 19, fontWeight: 700,
                    color: colors.text, letterSpacing: '-0.01em',
                  }}
                >
                  {title}
                </h3>
                <p style={{ margin: 0, fontSize: 14.5, color: colors.textMuted, lineHeight: 1.7, maxWidth: 600 }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section style={SECTION}>
        <div style={WRAP}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <span style={PILL()}>Leadership</span>
            <h2
              className="f-head"
              style={{
                margin: '18px auto 14px',
                maxWidth: 720,
                fontSize: 'clamp(28px, 4.4vw, 46px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: colors.text,
              }}
            >
              The people{' '}
              <span style={gradientText(goldGrad)}>building this.</span>
            </h2>
            <p style={{ maxWidth: 580, margin: '0 auto', fontSize: 15.5, color: colors.textMuted, lineHeight: 1.7 }}>
              Operators, engineers and product thinkers from across African fintech, brought back home
              to build something that matters.
            </p>
          </div>

          <div
            style={{
              display: 'grid', gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {LEADERS.map(({ name, role, bio, initials }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                style={{
                  position: 'relative',
                  padding: 24,
                  borderRadius: 18,
                  background: `linear-gradient(180deg, ${tint(colors.navyMid, 55)}, ${tint(colors.navy, 65)})`,
                  border: `1px solid ${tint(colors.gold, 14)}`,
                  textAlign: 'center',
                  overflow: 'hidden',
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
                    background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 50)}, transparent)`,
                  }}
                />
                <div
                  style={{
                    width: 78, height: 78, borderRadius: '50%',
                    background: goldGrad,
                    color: colors.navy,
                    display: 'grid', placeItems: 'center',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 800, fontSize: 24,
                    margin: '4px auto 16px',
                    boxShadow: `0 12px 28px ${tint(colors.gold, 40)}, inset 0 1px 0 ${tint('white', 35)}`,
                  }}
                >
                  {initials}
                </div>
                <h3
                  className="f-head"
                  style={{
                    margin: '0 0 4px',
                    fontSize: 16.5, fontWeight: 700,
                    color: colors.text, letterSpacing: '-0.01em',
                  }}
                >
                  {name}
                </h3>
                <p
                  className="f-mono"
                  style={{
                    margin: '0 0 12px',
                    fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em',
                    color: colors.gold, textTransform: 'uppercase',
                  }}
                >
                  {role}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>
                  {bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section style={SECTION}>
        <div style={WRAP}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={PILL()}>Recognition</span>
            <h2
              className="f-head"
              style={{
                margin: '18px auto 0',
                maxWidth: 720,
                fontSize: 'clamp(24px, 3.6vw, 36px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: colors.text,
              }}
            >
              Trusted, licensed,{' '}
              <span style={gradientText(goldGrad)}>and certified.</span>
            </h2>
          </div>

          <div
            style={{
              display: 'grid', gap: 14,
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}
          >
            {RECOGNITION.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '18px 20px',
                  borderRadius: 14,
                  background: tint(colors.navyMid, 50),
                  border: `1px solid ${tint(colors.gold, 12)}`,
                }}
              >
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: tint(colors.gold, 12),
                    border: `1px solid ${tint(colors.gold, 24)}`,
                    display: 'grid', placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={colors.gold} />
                </div>
                <div>
                  <p
                    className="f-head"
                    style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: colors.text }}
                  >
                    {label}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: colors.textMuted }}>
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section style={{ ...SECTION, paddingTop: 40, paddingBottom: 110 }}>
        <div style={WRAP}>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            style={{
              position: 'relative',
              padding: 'clamp(44px, 7vw, 72px) clamp(28px, 5vw, 60px)',
              borderRadius: 26,
              background: `linear-gradient(135deg, ${tint(colors.navyMid, 90)}, ${tint(colors.navy, 95)})`,
              border: `1px solid ${tint(colors.gold, 22)}`,
              boxShadow: `0 30px 80px ${tint('black', 60)}, 0 0 0 1px ${tint(colors.gold, 8)}, 0 0 80px ${tint(colors.gold, 10)}`,
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute', top: -100, right: -100, width: 320, height: 320, borderRadius: '50%',
                background: `radial-gradient(circle, ${tint(colors.gold, 16)} 0%, transparent 70%)`,
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute', bottom: -100, left: -100, width: 320, height: 320, borderRadius: '50%',
                background: `radial-gradient(circle, ${tint(colors.champagne, 12)} 0%, transparent 70%)`,
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 80)}, transparent)`,
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={PILL(true)}>
                <Sparkles size={11} /> Join the journey
              </span>
              <h2
                className="f-head"
                style={{
                  margin: '20px auto 16px',
                  maxWidth: 760,
                  fontSize: 'clamp(28px, 5vw, 54px)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.05,
                  color: colors.text,
                }}
              >
                Ready to move money the way{' '}
                <span style={gradientText(`linear-gradient(110deg, ${colors.gold}, ${colors.champagne}, ${colors.gold})`)}>
                  it should move?
                </span>
              </h2>
              <p style={{ maxWidth: 520, margin: '0 auto 28px', fontSize: 15.5, color: colors.textMuted, lineHeight: 1.7 }}>
                Half a million Nigerians already have. Sign up takes 60 seconds — no paperwork,
                no branch visits, no waiting.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/auth/register" className="cta-gold">
                  Create free account <ArrowRight size={16} />
                </Link>
                <Link to="/company/careers" className="cta-ghost">
                  Work with us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
