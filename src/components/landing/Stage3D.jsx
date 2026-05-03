

import { colors, tint } from './theme'
import { floatingChips } from './data'
import Tilt from './Tilt'
import Float from './Float'
import Chip from './Chip'
import Card3D from './Card3D'

export default function Stage3D() {
  return (
    <div
      style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1280, margin: '64px auto 0',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          position: 'relative',
          height: 'clamp(540px, 70vw, 640px)',
          perspective: 1500,            
          transformStyle: 'preserve-3d',
        }}
      >
        
        <div style={{ position: 'absolute', left: '50%', top: '50%', translate: '-50% -50%' }}>
          <Tilt>
            <Card3D />
          </Tilt>
        </div>

        
        <div className="hero-float">
          {floatingChips.map((chip, i) => (
            <Float key={i} delay={chip.delay} drift={chip.drift} style={chip.position}>
              <Chip icon={chip.icon} title={chip.title} value={chip.value} color={chip.color} />
            </Float>
          ))}
        </div>

        
        <div
          style={{
            position: 'absolute', left: '50%', bottom: 30,
            width: 'min(580px, 80vw)', height: 90,
            translate: '-50% 0',
            background: `radial-gradient(ellipse, ${tint(colors.gold, 22)}, transparent 70%)`,
            filter: 'blur(28px)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}
