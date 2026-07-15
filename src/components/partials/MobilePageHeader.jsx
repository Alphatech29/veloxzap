import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const HEADER_HEIGHT = 52

export default function MobilePageHeader({ title, rightIcon: RightIcon, onRightClick, rightLabel, onBack, right }) {
  const navigate = useNavigate()

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-30 text-[var(--c-text)] backdrop-blur-2xl bg-[var(--c-top-bg)] border-b border-[var(--c-side-border)]"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div
          className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4"
          style={{ height: `${HEADER_HEIGHT}px` }}
        >
          <button
            type="button"
            onClick={onBack || (() => navigate(-1))}
            className="justify-self-start inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--c-text-muted)] active:scale-95 transition"
          >
            <ChevronLeft size={16} /> Back
          </button>

          <h1 className="justify-self-center text-[15px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 text-center truncate">
            {title}
          </h1>

          <div className="justify-self-end">
            {right ? right : RightIcon && (
              <button
                type="button"
                onClick={onRightClick}
                aria-label={rightLabel}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[var(--c-text-muted)] active:scale-90 transition shrink-0"
              >
                <RightIcon size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      <div aria-hidden style={{ height: `calc(${HEADER_HEIGHT}px + env(safe-area-inset-top))` }} />
    </>
  )
}
