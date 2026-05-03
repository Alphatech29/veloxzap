

import { colors, tint } from './theme'
import { tickerItems } from './data'

export default function Ticker() {
  
  const items = [...tickerItems, ...tickerItems]

  return (
    <div
      style={{
        position: 'relative', zIndex: 2, marginTop: 0, overflow: 'hidden',
        borderTop:    `1px solid ${tint(colors.gold, 14)}`,
        borderBottom: `1px solid ${tint(colors.gold, 14)}`,
        background: tint(colors.navy, 75),
        backdropFilter: 'blur(14px)',
        padding: '10px 0',
      }}
    >
      <div style={{ display: 'flex', width: 'max-content', animation: 'vticker 60s linear infinite' }}>
        {items.map(({ label, value, change }, i) => {
          const isPositive = change.startsWith('+')
          return (
            <div key={i} className="tick-row">
              <span className="f-mono" style={{ fontSize: 11, color: tint(colors.text, 38) }}>{label}</span>
              <span className="f-mono" style={{ fontSize: 11, color: colors.text, fontWeight: 700 }}>{value}</span>
              {change && (
                <span
                  className="f-mono"
                  style={{
                    fontSize: 10, padding: '1px 6px', borderRadius: 4,
                    color:      isPositive ? colors.champagne : '#f87171',
                    background: isPositive ? tint(colors.champagne, 14) : 'rgba(248,113,113,0.12)',
                  }}
                >
                  {change}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
