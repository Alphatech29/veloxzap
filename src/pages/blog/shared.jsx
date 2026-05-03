import {
  ShieldCheck, TrendingUp, Lightbulb, Megaphone, BookOpen,
  Sparkles, Zap,
} from 'lucide-react'
import { colors, tint } from '../../components/landing/theme'

const goldGrad = `linear-gradient(135deg, ${colors.gold}, ${colors.champagne})`

export const CATEGORIES = [
  { key: 'all',         label: 'All posts',       icon: BookOpen   },
  { key: 'product',     label: 'Product',         icon: Sparkles   },
  { key: 'security',    label: 'Security',        icon: ShieldCheck },
  { key: 'insights',    label: 'Market insights', icon: TrendingUp },
  { key: 'tutorials',   label: 'Tutorials',       icon: Lightbulb  },
  { key: 'company',     label: 'Company news',    icon: Megaphone  },
]

export const catLabel = (k) => CATEGORIES.find(c => c.key === k)?.label ?? k

export const PILL = (gold = false) => ({
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '6px 14px', borderRadius: 99,
  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
  fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: gold ? colors.gold : colors.textMuted,
  background: gold ? tint(colors.gold, 10) : tint(colors.text, 5),
  border: `1px solid ${gold ? tint(colors.gold, 28) : tint(colors.text, 10)}`,
})

export function Avatar({ initials, size = 32, accent = colors.gold }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, ${accent}, ${colors.champagne})`,
        color: colors.navy,
        display: 'grid', placeItems: 'center',
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 800, fontSize: size * 0.4,
        boxShadow: `0 4px 12px ${tint(accent, 35)}, inset 0 1px 0 ${tint('white', 30)}`,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

export function CoverArt({ accent, large = false, hero = false }) {
  const ratio = hero ? '21 / 9' : large ? '16 / 9' : '16 / 10'
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: ratio,
        borderRadius: hero ? 22 : large ? 18 : 14,
        background: `linear-gradient(135deg, ${tint(accent, 22)}, ${tint(colors.navyMid, 80)})`,
        border: `1px solid ${tint(accent, 24)}`,
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background:
            `radial-gradient(circle at 80% 20%, ${tint(accent, 32)} 0%, transparent 55%),` +
            `radial-gradient(circle at 15% 80%, ${tint(colors.champagne, 18)} 0%, transparent 55%)`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, opacity: 0.18,
          backgroundImage: `radial-gradient(${tint('white', 100)} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
          background: `linear-gradient(90deg, transparent, ${tint(accent, 80)}, transparent)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: hero ? 36 : large ? 28 : 18,
          right:  hero ? 36 : large ? 28 : 18,
          width:  hero ? 88 : large ? 72 : 52,
          height: hero ? 88 : large ? 72 : 52,
          borderRadius: hero ? 22 : large ? 18 : 13,
          background: goldGrad,
          display: 'grid', placeItems: 'center',
          boxShadow: `0 12px 28px ${tint(accent, 40)}, inset 0 1px 0 ${tint('white', 35)}`,
        }}
      >
        <Zap size={hero ? 40 : large ? 32 : 22} color={colors.navy} fill={colors.navy} />
      </div>
    </div>
  )
}
