import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function KycGate({ verified, children }) {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (verified) return children

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-[3px] opacity-40">
        {children}
      </div>

      <div
        className="absolute inset-0 z-30 flex items-center justify-center"
        style={{ background: isDark ? 'rgba(10,31,68,0.88)' : 'rgba(245,245,240,0.88)' }}
      >
        <div
          className="mx-4 w-full max-w-[360px] rounded-[24px] flex flex-col items-center gap-5 px-8 py-10"
          style={{
            background: 'var(--c-surface)',
            border: '1px solid var(--c-accent-border)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,162,39,0.08)',
          }}
        >
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: 'var(--c-accent-soft)',
              border: '1.5px solid var(--c-accent-border)',
              boxShadow: '0 0 32px rgba(201,162,39,0.12)',
            }}
          >
            <ShieldAlert size={28} style={{ color: '#C9A227' }} />
          </div>

          {/* Text */}
          <div className="text-center">
            <h2
              className="text-[17px] font-bold m-0 leading-tight"
              style={{ color: 'var(--c-text)' }}
            >
              Verification Required
            </h2>
            <p
              className="text-[12.5px] m-0 mt-2 leading-relaxed"
              style={{ color: 'var(--c-text-muted)' }}
            >
              Complete your identity (KYC) verification to unlock withdrawals and transfers.
            </p>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => navigate('/user/profile')}
            className="inline-flex items-center justify-center gap-2 w-full h-[46px] rounded-[14px] font-bold text-[13px] transition active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg,#C9A227,#f0d060)',
              color: '#0A1F44',
              boxShadow: '0 6px 20px -4px rgba(201,162,39,0.5)',
            }}
          >
            Complete KYC <ArrowRight size={14} />
          </button>

          <p
            className="text-[10px] m-0 -mt-2 text-center"
            style={{ color: 'var(--c-text-subtle)' }}
          >
            Verification typically takes a few minutes
          </p>
        </div>
      </div>
    </div>
  )
}
