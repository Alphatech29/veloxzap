import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Search, Calendar, Clock,
  Tag, Mail, BookOpen,
} from 'lucide-react'
import { colors, tint, gradientText } from '../components/landing/theme'
import { POSTS } from './blog/data'
import { CATEGORIES, catLabel, PILL, Avatar, CoverArt } from './blog/shared'

const goldGrad = `linear-gradient(135deg, ${colors.gold}, ${colors.champagne})`

const SECTION = { position: 'relative', zIndex: 2, padding: '90px 24px' }
const WRAP    = { maxWidth: 1240, margin: '0 auto' }

export default function Blog() {
  const [activeCat, setActiveCat] = useState('all')
  const [query,     setQuery]     = useState('')

  const featured = POSTS.find(p => p.featured)
  const rest     = POSTS.filter(p => !p.featured)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rest.filter(p => {
      if (activeCat !== 'all' && p.category !== activeCat) return false
      if (q && !(p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))) return false
      return true
    })
  }, [activeCat, query, rest])

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


      <section style={{ ...SECTION, paddingTop: 60, paddingBottom: 50 }}>
        <div style={{ ...WRAP, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={PILL(true)}>
              <BookOpen size={11} /> The VeloxZap Blog
            </span>
          </motion.div>

          <motion.h1
            className="f-head"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            style={{
              margin: '20px auto 18px',
              maxWidth: 880,
              fontSize: 'clamp(34px, 5.6vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: colors.text,
            }}
          >
            Notes from the team building{' '}
            <span style={gradientText(`linear-gradient(110deg, ${colors.gold}, ${colors.champagne}, ${colors.gold})`)}>
              the future of African finance.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            style={{
              maxWidth: 600, margin: '0 auto 30px',
              fontSize: 16.5, lineHeight: 1.7,
              color: colors.textMuted,
            }}
          >
            Product launches, security deep-dives, market insights and the occasional opinion —
            from the engineers, designers and operators behind VeloxZap.
          </motion.p>


          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              maxWidth: 520, margin: '0 auto',
              padding: '6px 6px 6px 16px',
              borderRadius: 99,
              background: tint(colors.navyMid, 60),
              border: `1px solid ${tint(colors.gold, 18)}`,
              boxShadow: `0 12px 30px ${tint('black', 30)}`,
            }}
          >
            <Search size={16} color={tint(colors.text, 55)} style={{ flexShrink: 0 }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search articles, tags or authors"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none', outline: 'none',
                color: colors.text,
                fontSize: 14.5,
                padding: '10px 0',
                fontFamily: 'inherit',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  background: tint(colors.text, 8),
                  border: 'none', cursor: 'pointer',
                  color: colors.textMuted,
                  fontSize: 11, fontWeight: 600,
                  padding: '6px 12px', borderRadius: 99,
                  fontFamily: 'inherit',
                }}
              >
                Clear
              </button>
            )}
          </motion.div>
        </div>
      </section>


      {featured && activeCat === 'all' && !query && (
        <section style={{ ...SECTION, paddingTop: 20, paddingBottom: 40 }}>
          <div style={WRAP}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to={`/company/blog/${featured.id}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  style={{
                    position: 'relative',
                    display: 'grid', gap: 28,
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    alignItems: 'center',
                    padding: 'clamp(24px, 3vw, 36px)',
                    borderRadius: 22,
                    background: `linear-gradient(135deg, ${tint(colors.navyMid, 70)}, ${tint(colors.navy, 80)})`,
                    border: `1px solid ${tint(colors.gold, 20)}`,
                    boxShadow: `0 24px 70px ${tint('black', 50)}, 0 0 60px ${tint(colors.gold, 8)}`,
                    transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = tint(colors.gold, 35)
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = `0 30px 80px ${tint('black', 55)}, 0 0 80px ${tint(colors.gold, 14)}`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = tint(colors.gold, 20)
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.boxShadow = `0 24px 70px ${tint('black', 50)}, 0 0 60px ${tint(colors.gold, 8)}`
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
                      background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 80)}, transparent)`,
                    }}
                  />

                  <CoverArt accent={featured.accent} large />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                      <span
                        className="f-mono"
                        style={{
                          fontSize: 10, fontWeight: 800, letterSpacing: '0.14em',
                          color: colors.navy,
                          background: goldGrad,
                          padding: '4px 10px', borderRadius: 99,
                          textTransform: 'uppercase',
                          boxShadow: `0 4px 12px ${tint(colors.gold, 35)}`,
                        }}
                      >
                        Featured
                      </span>
                      <span
                        className="f-mono"
                        style={{
                          fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em',
                          color: colors.gold, textTransform: 'uppercase',
                        }}
                      >
                        {catLabel(featured.category)}
                      </span>
                    </div>

                    <h2
                      className="f-head"
                      style={{
                        margin: '0 0 14px',
                        fontSize: 'clamp(22px, 3vw, 32px)',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.18,
                        color: colors.text,
                      }}
                    >
                      {featured.title}
                    </h2>
                    <p
                      style={{
                        margin: '0 0 22px',
                        fontSize: 15.5, lineHeight: 1.7,
                        color: colors.textMuted,
                      }}
                    >
                      {featured.excerpt}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar initials={featured.initials} size={36} accent={featured.accent} />
                        <div>
                          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: colors.text }}>
                            {featured.author}
                          </p>
                          <p style={{ margin: 0, fontSize: 12, color: colors.textMuted }}>
                            <Calendar size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                            {featured.date} · <Clock size={10} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                            {featured.readTime}
                          </p>
                        </div>
                      </div>

                      <span
                        style={{
                          marginLeft: 'auto',
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          color: colors.gold, fontSize: 13.5, fontWeight: 700,
                        }}
                      >
                        Read article <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}


      <section style={{ ...SECTION, paddingTop: 30, paddingBottom: 30 }}>
        <div style={WRAP}>
          <div
            style={{
              display: 'flex', flexWrap: 'wrap', gap: 8,
              justifyContent: 'center',
            }}
          >
            {CATEGORIES.map(({ key, label, icon: Icon }) => {
              const active = activeCat === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveCat(key)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '9px 16px',
                    borderRadius: 99,
                    cursor: 'pointer',
                    fontSize: 13, fontWeight: 600,
                    fontFamily: 'inherit',
                    color: active ? colors.navy : tint(colors.text, 80),
                    background: active ? goldGrad : tint(colors.navyMid, 50),
                    border: `1px solid ${active ? 'transparent' : tint(colors.gold, 16)}`,
                    boxShadow: active
                      ? `0 8px 22px ${tint(colors.gold, 35)}, inset 0 1px 0 ${tint('white', 30)}`
                      : 'none',
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.color = colors.text
                      e.currentTarget.style.borderColor = tint(colors.gold, 32)
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.color = tint(colors.text, 80)
                      e.currentTarget.style.borderColor = tint(colors.gold, 16)
                    }
                  }}
                >
                  <Icon size={13} />
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </section>


      <section style={{ ...SECTION, paddingTop: 20, paddingBottom: 80 }}>
        <div style={WRAP}>
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  textAlign: 'center', padding: '80px 24px',
                  borderRadius: 18,
                  background: tint(colors.navyMid, 40),
                  border: `1px dashed ${tint(colors.gold, 20)}`,
                }}
              >
                <Search size={32} color={tint(colors.gold, 70)} style={{ marginBottom: 14 }} />
                <h3
                  className="f-head"
                  style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: colors.text }}
                >
                  No articles match yet
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: colors.textMuted }}>
                  Try a different category or clear your search.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`grid-${activeCat}-${query}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: 'grid', gap: 22,
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                }}
              >
                {filtered.map((p, i) => (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.05 }}
                  >
                    <Link
                      to={`/company/blog/${p.id}`}
                      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex', flexDirection: 'column',
                          height: '100%',
                          padding: 18,
                          borderRadius: 18,
                          background: `linear-gradient(180deg, ${tint(colors.navyMid, 55)}, ${tint(colors.navy, 65)})`,
                          border: `1px solid ${tint(colors.gold, 12)}`,
                          transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = tint(colors.gold, 32)
                          e.currentTarget.style.transform = 'translateY(-4px)'
                          e.currentTarget.style.boxShadow = `0 22px 48px ${tint('black', 40)}, 0 0 36px ${tint(colors.gold, 10)}`
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = tint(colors.gold, 12)
                          e.currentTarget.style.transform = ''
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        <CoverArt accent={p.accent} />

                        <div style={{ padding: '18px 4px 4px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <span
                            className="f-mono"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              alignSelf: 'flex-start',
                              fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
                              color: colors.gold, textTransform: 'uppercase',
                              marginBottom: 10,
                            }}
                          >
                            <Tag size={10} />
                            {catLabel(p.category)}
                          </span>

                          <h3
                            className="f-head"
                            style={{
                              margin: '0 0 8px',
                              fontSize: 17.5, fontWeight: 700,
                              letterSpacing: '-0.01em', lineHeight: 1.3,
                              color: colors.text,
                            }}
                          >
                            {p.title}
                          </h3>
                          <p
                            style={{
                              margin: '0 0 18px',
                              fontSize: 13.5, lineHeight: 1.65,
                              color: colors.textMuted,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {p.excerpt}
                          </p>

                          <div
                            style={{
                              marginTop: 'auto',
                              display: 'flex', alignItems: 'center', gap: 10,
                              paddingTop: 14,
                              borderTop: `1px solid ${tint('white', 5)}`,
                            }}
                          >
                            <Avatar initials={p.initials} size={28} accent={p.accent} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p
                                style={{
                                  margin: 0, fontSize: 12.5, fontWeight: 600,
                                  color: colors.text,
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}
                              >
                                {p.author}
                              </p>
                              <p
                                style={{
                                  margin: 0, fontSize: 11, color: colors.textMuted,
                                  display: 'flex', alignItems: 'center', gap: 6,
                                }}
                              >
                                {p.date}
                                <span style={{ opacity: 0.5 }}>·</span>
                                <Clock size={9} style={{ verticalAlign: 'middle' }} /> {p.readTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
              padding: 'clamp(36px, 6vw, 56px) clamp(24px, 5vw, 56px)',
              borderRadius: 24,
              background: `linear-gradient(135deg, ${tint(colors.navyMid, 90)}, ${tint(colors.navy, 95)})`,
              border: `1px solid ${tint(colors.gold, 22)}`,
              boxShadow: `0 30px 80px ${tint('black', 60)}, 0 0 0 1px ${tint(colors.gold, 8)}, 0 0 80px ${tint(colors.gold, 10)}`,
              overflow: 'hidden',
              display: 'grid',
              gap: 28,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              alignItems: 'center',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute', top: -120, right: -120, width: 320, height: 320, borderRadius: '50%',
                background: `radial-gradient(circle, ${tint(colors.gold, 16)} 0%, transparent 70%)`,
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
                <Mail size={11} /> Newsletter
              </span>
              <h2
                className="f-head"
                style={{
                  margin: '18px 0 12px',
                  fontSize: 'clamp(24px, 3.6vw, 36px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: colors.text,
                }}
              >
                The best of VeloxZap,{' '}
                <span style={gradientText(goldGrad)}>once a week.</span>
              </h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: colors.textMuted, maxWidth: 440 }}>
                Product updates, market signals and the occasional behind-the-scenes story.
                No spam. Unsubscribe in one click.
              </p>
            </div>

            <form
              onSubmit={e => e.preventDefault()}
              style={{
                position: 'relative', zIndex: 1,
                display: 'flex', gap: 8,
                padding: 6,
                borderRadius: 99,
                background: tint(colors.navyMid, 60),
                border: `1px solid ${tint(colors.gold, 22)}`,
              }}
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none', outline: 'none',
                  color: colors.text,
                  fontSize: 14.5,
                  padding: '10px 16px',
                  fontFamily: 'inherit',
                  minWidth: 0,
                }}
              />
              <button
                type="submit"
                className="cta-gold"
                style={{ padding: '10px 18px', fontSize: 13.5 }}
              >
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
