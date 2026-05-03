import { useState, useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Calendar, Clock, Quote as QuoteIcon,
  Link2, Check, Sparkles, Mail, Tag,
} from 'lucide-react'

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={props.size || 16} height={props.size || 16} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={props.size || 16} height={props.size || 16} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={props.size || 16} height={props.size || 16} aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)
import { colors, tint, gradientText } from '../../components/landing/theme'
import { POSTS, findPost, relatedPosts } from './data'
import { catLabel, PILL, Avatar, CoverArt } from './shared'

const goldGrad = `linear-gradient(135deg, ${colors.gold}, ${colors.champagne})`

const SECTION   = { position: 'relative', zIndex: 2, padding: '60px 24px' }
const WRAP      = { maxWidth: 820,  margin: '0 auto' }
const WIDE_WRAP = { maxWidth: 1240, margin: '0 auto' }


function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? Math.min(1, el.scrollTop / total) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 3,
        zIndex: 1100,
        background: tint(colors.navy, 20),
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: '100%',
          background: goldGrad,
          boxShadow: `0 0 12px ${tint(colors.gold, 60)}`,
          transition: 'width 0.05s linear',
        }}
      />
    </div>
  )
}


function ShareBar({ post, url }) {
  const [copied, setCopied] = useState(false)

  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`
  const linked = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* noop */ }
  }

  const item = {
    width: 38, height: 38, borderRadius: 10,
    display: 'grid', placeItems: 'center',
    background: tint(colors.navyMid, 60),
    border: `1px solid ${tint(colors.gold, 16)}`,
    color: colors.text,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.18s',
  }
  const onEnter = (e) => {
    e.currentTarget.style.background = tint(colors.gold, 12)
    e.currentTarget.style.borderColor = tint(colors.gold, 36)
    e.currentTarget.style.color = colors.gold
  }
  const onLeave = (e) => {
    e.currentTarget.style.background = tint(colors.navyMid, 60)
    e.currentTarget.style.borderColor = tint(colors.gold, 16)
    e.currentTarget.style.color = colors.text
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span
        className="f-mono"
        style={{
          fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em',
          color: colors.textMuted, textTransform: 'uppercase',
          marginRight: 4,
        }}
      >
        Share
      </span>
      <a href={tweet}  target="_blank" rel="noreferrer" aria-label="Share on Twitter"  style={item} onMouseEnter={onEnter} onMouseLeave={onLeave}><TwitterIcon  size={15} /></a>
      <a href={linked} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn" style={item} onMouseEnter={onEnter} onMouseLeave={onLeave}><LinkedinIcon size={15} /></a>
      <a href={fb}     target="_blank" rel="noreferrer" aria-label="Share on Facebook" style={item} onMouseEnter={onEnter} onMouseLeave={onLeave}><FacebookIcon size={15} /></a>
      <button
        onClick={copy}
        aria-label="Copy link"
        style={{ ...item, border: item.border }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
      </button>
      {copied && (
        <span
          className="f-mono"
          style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em',
            color: colors.gold, textTransform: 'uppercase',
          }}
        >
          Copied
        </span>
      )}
    </div>
  )
}


function Block({ block }) {
  const { type } = block

  if (type === 'p') {
    return (
      <p
        style={{
          margin: '0 0 22px',
          fontSize: 17,
          lineHeight: 1.78,
          color: colors.text,
          letterSpacing: '0.005em',
        }}
      >
        {block.text}
      </p>
    )
  }

  if (type === 'h2') {
    return (
      <h2
        className="f-head"
        style={{
          margin: '36px 0 14px',
          fontSize: 'clamp(22px, 2.4vw, 26px)',
          fontWeight: 800,
          color: colors.text,
          letterSpacing: '-0.02em',
          lineHeight: 1.25,
        }}
      >
        {block.text}
      </h2>
    )
  }

  if (type === 'h3') {
    return (
      <h3
        className="f-head"
        style={{
          margin: '28px 0 10px',
          fontSize: 19,
          fontWeight: 700,
          color: colors.text,
          letterSpacing: '-0.01em',
        }}
      >
        {block.text}
      </h3>
    )
  }

  if (type === 'list') {
    return (
      <ul
        style={{
          margin: '0 0 24px',
          padding: 0,
          listStyle: 'none',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}
      >
        {block.items.map((item, i) => (
          <li
            key={i}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              fontSize: 16, lineHeight: 1.7,
              color: colors.text,
            }}
          >
            <span
              aria-hidden
              style={{
                marginTop: 9,
                flexShrink: 0,
                width: 6, height: 6, borderRadius: '50%',
                background: goldGrad,
                boxShadow: `0 0 10px ${tint(colors.gold, 50)}`,
              }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (type === 'quote') {
    return (
      <figure
        style={{
          position: 'relative',
          margin: '32px 0',
          padding: '28px 28px 24px',
          borderRadius: 16,
          background: `linear-gradient(135deg, ${tint(colors.navyMid, 70)}, ${tint(colors.navy, 75)})`,
          border: `1px solid ${tint(colors.gold, 22)}`,
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 4,
            background: goldGrad,
          }}
        />
        <QuoteIcon size={26} color={colors.gold} style={{ marginBottom: 10, opacity: 0.85 }} />
        <blockquote
          className="f-head"
          style={{
            margin: 0,
            fontSize: 'clamp(18px, 2vw, 21px)',
            fontWeight: 600,
            lineHeight: 1.5,
            color: colors.text,
            letterSpacing: '-0.005em',
          }}
        >
          {block.text}
        </blockquote>
        {block.cite && (
          <figcaption
            className="f-mono"
            style={{
              marginTop: 12,
              fontSize: 11.5, fontWeight: 700, letterSpacing: '0.14em',
              color: colors.gold, textTransform: 'uppercase',
            }}
          >
            — {block.cite}
          </figcaption>
        )}
      </figure>
    )
  }

  if (type === 'callout') {
    const isGold = block.tone !== 'mute'
    return (
      <aside
        style={{
          position: 'relative',
          margin: '28px 0',
          padding: '20px 22px',
          borderRadius: 14,
          background: isGold ? tint(colors.gold, 8) : tint(colors.text, 5),
          border: `1px solid ${isGold ? tint(colors.gold, 28) : tint(colors.text, 12)}`,
          display: 'flex', gap: 14, alignItems: 'flex-start',
        }}
      >
        <Sparkles size={18} color={isGold ? colors.gold : colors.textMuted} style={{ flexShrink: 0, marginTop: 2 }} />
        <p
          style={{
            margin: 0,
            fontSize: 15, lineHeight: 1.65,
            color: colors.text,
          }}
        >
          {block.text}
        </p>
      </aside>
    )
  }

  return null
}


function PostCard({ post }) {
  return (
    <Link
      to={`/company/blog/${post.id}`}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          height: '100%',
          padding: 16,
          borderRadius: 18,
          background: `linear-gradient(180deg, ${tint(colors.navyMid, 55)}, ${tint(colors.navy, 65)})`,
          border: `1px solid ${tint(colors.gold, 12)}`,
          transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
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
        <CoverArt accent={post.accent} />
        <div style={{ padding: '16px 4px 4px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span
            className="f-mono"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              alignSelf: 'flex-start',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
              color: colors.gold, textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            <Tag size={10} /> {catLabel(post.category)}
          </span>
          <h3
            className="f-head"
            style={{
              margin: '0 0 6px',
              fontSize: 16.5, fontWeight: 700,
              letterSpacing: '-0.01em', lineHeight: 1.3,
              color: colors.text,
            }}
          >
            {post.title}
          </h3>
          <p
            style={{
              margin: '0 0 10px',
              fontSize: 13, lineHeight: 1.6,
              color: colors.textMuted,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </p>
          <p style={{ margin: 'auto 0 0', fontSize: 11.5, color: colors.textMuted }}>
            {post.date} · <Clock size={9} style={{ verticalAlign: 'middle' }} /> {post.readTime}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default function BlogPost() {
  const { id } = useParams()
  const post = findPost(id)


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [id])

  if (!post) {
    return <Navigate to="/company/blog" replace />
  }

  const related = relatedPosts(post, 3)
  const url = typeof window !== 'undefined' ? window.location.href : ''

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
      <ReadingProgress />


      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.07,
          backgroundImage: `radial-gradient(${tint('white', 100)} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black, transparent 75%)',
        }}
      />


      <section style={{ ...SECTION, paddingTop: 40, paddingBottom: 30 }}>
        <div style={WRAP}>
          <Link
            to="/company/blog"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 99,
              textDecoration: 'none',
              fontSize: 13, fontWeight: 600,
              color: colors.textMuted,
              background: tint(colors.text, 4),
              border: `1px solid ${tint(colors.text, 10)}`,
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = colors.text
              e.currentTarget.style.borderColor = tint(colors.gold, 28)
              e.currentTarget.style.background = tint(colors.gold, 6)
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = colors.textMuted
              e.currentTarget.style.borderColor = tint(colors.text, 10)
              e.currentTarget.style.background = tint(colors.text, 4)
            }}
          >
            <ArrowLeft size={14} /> Back to all posts
          </Link>
        </div>
      </section>


      <section style={{ ...SECTION, paddingTop: 20, paddingBottom: 30 }}>
        <div style={WRAP}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
              <span style={PILL(true)}>
                <Tag size={11} /> {catLabel(post.category)}
              </span>
              <span
                className="f-mono"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
                  color: colors.textMuted, textTransform: 'uppercase',
                }}
              >
                <Calendar size={11} /> {post.date}
              </span>
              <span
                className="f-mono"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
                  color: colors.textMuted, textTransform: 'uppercase',
                }}
              >
                <Clock size={11} /> {post.readTime} read
              </span>
            </div>

            <h1
              className="f-head"
              style={{
                margin: '0 0 18px',
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                color: colors.text,
              }}
            >
              {post.title}
            </h1>

            <p
              style={{
                margin: '0 0 26px',
                fontSize: 18,
                lineHeight: 1.65,
                color: colors.textMuted,
                maxWidth: 720,
              }}
            >
              {post.excerpt}
            </p>

            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                paddingTop: 18,
                borderTop: `1px solid ${tint('white', 6)}`,
              }}
            >
              <Avatar initials={post.initials} size={44} accent={post.accent} />
              <div>
                <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: colors.text }}>
                  {post.author}
                </p>
                {post.authorRole && (
                  <p
                    className="f-mono"
                    style={{
                      margin: '2px 0 0',
                      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em',
                      color: colors.gold, textTransform: 'uppercase',
                    }}
                  >
                    {post.authorRole}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      <section style={{ ...SECTION, paddingTop: 10, paddingBottom: 40 }}>
        <div style={WRAP}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          >
            <CoverArt accent={post.accent} hero />
          </motion.div>
        </div>
      </section>


      <section style={{ ...SECTION, paddingTop: 10, paddingBottom: 40 }}>
        <article style={WRAP}>
          {post.body?.map((block, i) => <Block key={i} block={block} />)}
        </article>
      </section>


      <section style={{ ...SECTION, paddingTop: 10, paddingBottom: 50 }}>
        <div style={WRAP}>
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 14,
              background: tint(colors.navyMid, 50),
              border: `1px solid ${tint(colors.gold, 14)}`,
              display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <ShareBar post={post} url={url} />
            <Link
              to="/auth/register"
              className="cta-gold"
              style={{ padding: '10px 18px', fontSize: 13.5 }}
            >
              Try VeloxZap <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>


      {post.authorBio && (
        <section style={{ ...SECTION, paddingTop: 10, paddingBottom: 60 }}>
          <div style={WRAP}>
            <div
              style={{
                position: 'relative',
                padding: 28,
                borderRadius: 18,
                background: `linear-gradient(135deg, ${tint(colors.navyMid, 70)}, ${tint(colors.navy, 80)})`,
                border: `1px solid ${tint(colors.gold, 18)}`,
                overflow: 'hidden',
              }}
            >
              <div
                aria-hidden
                style={{
                  position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
                  background: `linear-gradient(90deg, transparent, ${tint(colors.gold, 70)}, transparent)`,
                }}
              />
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <Avatar initials={post.initials} size={64} accent={post.accent} />
                <div style={{ flex: 1, minWidth: 220 }}>
                  <span
                    className="f-mono"
                    style={{
                      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em',
                      color: colors.gold, textTransform: 'uppercase',
                    }}
                  >
                    Written by
                  </span>
                  <h3
                    className="f-head"
                    style={{
                      margin: '6px 0 4px',
                      fontSize: 19, fontWeight: 800,
                      color: colors.text, letterSpacing: '-0.01em',
                    }}
                  >
                    {post.author}
                  </h3>
                  {post.authorRole && (
                    <p style={{ margin: '0 0 10px', fontSize: 12.5, color: colors.textMuted }}>
                      {post.authorRole}
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: colors.textMuted }}>
                    {post.authorBio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}


      {related.length > 0 && (
        <section style={{ ...SECTION, paddingTop: 30, paddingBottom: 60 }}>
          <div style={WIDE_WRAP}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 22 }}>
              <div>
                <span style={PILL()}>Keep reading</span>
                <h2
                  className="f-head"
                  style={{
                    margin: '14px 0 0',
                    fontSize: 'clamp(22px, 3vw, 30px)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: colors.text,
                  }}
                >
                  More from <span style={gradientText(goldGrad)}>{catLabel(post.category)}</span>
                </h2>
              </div>
              <Link
                to="/company/blog"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  textDecoration: 'none',
                  fontSize: 13.5, fontWeight: 700,
                  color: colors.gold,
                  transition: 'gap 0.18s',
                }}
                onMouseEnter={e => (e.currentTarget.style.gap = '10px')}
                onMouseLeave={e => (e.currentTarget.style.gap = '6px')}
              >
                Browse all posts <ArrowRight size={14} />
              </Link>
            </div>

            <div
              style={{
                display: 'grid', gap: 18,
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              }}
            >
              {related.map(p => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}


      <section style={{ ...SECTION, paddingTop: 20, paddingBottom: 110 }}>
        <div style={WIDE_WRAP}>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'relative',
              padding: 'clamp(36px, 6vw, 56px) clamp(24px, 5vw, 56px)',
              borderRadius: 24,
              background: `linear-gradient(135deg, ${tint(colors.navyMid, 90)}, ${tint(colors.navy, 95)})`,
              border: `1px solid ${tint(colors.gold, 22)}`,
              boxShadow: `0 30px 80px ${tint('black', 60)}, 0 0 0 1px ${tint(colors.gold, 8)}, 0 0 80px ${tint(colors.gold, 10)}`,
              overflow: 'hidden',
              display: 'grid', gap: 28,
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
                  fontSize: 'clamp(22px, 3.4vw, 32px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.12,
                  color: colors.text,
                }}
              >
                Liked this?{' '}
                <span style={gradientText(goldGrad)}>Get the next one in your inbox.</span>
              </h2>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: colors.textMuted, maxWidth: 440 }}>
                One email a week. Product updates, market signals, and the occasional behind-the-scenes story.
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
