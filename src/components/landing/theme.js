

export const colors = {
  gold:      'var(--color-brand-accent)',     
  navy:      'var(--color-brand-primary)',    
  navyMid:   'var(--color-brand-mid)',        
  champagne: 'var(--color-brand-gold-soft)',  
  text:      'var(--color-text)',             
  textMuted: 'var(--color-text-muted)',
}

export function tint(color, percent) {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`
}

export const goldGradient = `linear-gradient(135deg, ${colors.gold}, ${colors.champagne})`

export function gradientText(gradient) {
  return {
    background: gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }
}
