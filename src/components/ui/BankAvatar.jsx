import { useEffect, useState } from 'react'
import { Landmark } from 'lucide-react'
import { getBankLogoByCode, getBankLogoByCodeAsync } from '../../utils/bankLogos'

export default function BankAvatar({ bankCode, bankName, size = 40, rounded = 'xl', className = '', style = {} }) {
  const [logoUrl, setLogoUrl] = useState(() => getBankLogoByCode(bankCode))
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
    // Try sync first (code map already built)
    const immediate = getBankLogoByCode(bankCode)
    if (immediate) { setLogoUrl(immediate); return }
    // Async fallback while map is still loading
    let cancelled = false
    getBankLogoByCodeAsync(bankCode, bankName).then(url => {
      if (!cancelled) setLogoUrl(url)
    })
    return () => { cancelled = true }
  }, [bankCode, bankName])

  const showLogo = logoUrl && !imgError
  const radius = { sm: '8px', md: '10px', lg: '12px', xl: '14px', '2xl': '16px', full: '9999px' }[rounded] ?? rounded

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 overflow-hidden ${className}`}
      style={{
        width: size, height: size, borderRadius: radius,
        background: showLogo ? 'var(--c-surface)' : 'var(--c-surface-soft)',
        border: '1px solid var(--c-border)',
        ...style,
      }}
    >
      {showLogo ? (
        <img src={logoUrl} alt={bankName} onError={() => setImgError(true)}
          style={{ width: '72%', height: '72%', objectFit: 'contain' }} />
      ) : (
        <Landmark size={size * 0.42} style={{ color: 'var(--c-text-muted)' }} />
      )}
    </span>
  )
}
