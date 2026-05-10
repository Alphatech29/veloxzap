import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, ArrowLeft, LayoutDashboard } from 'lucide-react'

export default function UserNotFound() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-7 max-w-[1100px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden text-center px-5 pt-7 pb-9 rounded-[18px] bg-[var(--c-surface)] border border-[var(--c-accent-border)] [background:radial-gradient(700px_240px_at_50%_0%,var(--c-accent-soft-2),transparent_70%),var(--c-surface)]"
      >
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[1.2px] text-brand-accent bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)]">
          <Compass size={11} /> 404 · Page not found
        </span>

        <h1 className="mt-3.5 mb-0 font-black leading-[0.95] tracking-[-0.06em] text-transparent bg-clip-text bg-gradient-to-br from-brand-accent via-brand-gold-soft to-brand-accent text-[clamp(86px,16vw,160px)] [text-shadow:0_0_60px_rgba(201,162,39,0.3)]">
          404
        </h1>

        <h2 className="mx-auto my-2 max-w-[580px] text-[clamp(20px,2.6vw,26px)] font-bold tracking-[-0.4px] text-[var(--c-text)]">
          We couldn't find <span className="text-brand-accent">that page</span>.
        </h2>

        <p className="mx-auto max-w-[520px] text-[13.5px] leading-[1.65] text-[var(--c-text-muted)]">
          The page{' '}
          <code className="px-1.5 py-0.5 mx-0.5 rounded font-mono text-xs bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)]">
            {location.pathname}
          </code>{' '}
          doesn't exist in your dashboard. It may have moved, or the link is wrong.
        </p>

        <div className="flex flex-wrap justify-center gap-2.5 mt-5">
          <Link
            to="/user/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[13px] font-semibold border border-[rgba(232,197,71,0.6)] shadow-[0_8px_24px_rgba(201,162,39,0.18)] hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(201,162,39,0.28)] transition"
          >
            <LayoutDashboard size={14} /> Back to dashboard
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-[var(--c-surface-soft)] border border-[var(--c-border-strong)] text-[var(--c-text)] text-[13px] font-medium cursor-pointer hover:border-[var(--c-accent-border-strong)] hover:bg-[var(--c-accent-soft)] transition"
          >
            <ArrowLeft size={14} /> Go back
          </button>
        </div>
      </motion.div>
    </div>
  )
}
