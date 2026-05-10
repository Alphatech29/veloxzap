import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, ArrowLeft, LayoutDashboard } from 'lucide-react'

export default function MobileUserNotFound() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden text-center px-4 pt-6 pb-7 rounded-[18px] bg-[var(--c-surface)] border border-[var(--c-accent-border)] [background:radial-gradient(420px_180px_at_50%_0%,var(--c-accent-soft-2),transparent_70%),var(--c-surface)]"
    >
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold uppercase tracking-[1.1px] text-brand-accent bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)]">
        <Compass size={11} /> 404
      </span>

      <h1 className="mt-3 mb-0 font-black leading-[0.95] tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-br from-brand-accent via-brand-gold-soft to-brand-accent text-[88px]">
        404
      </h1>

      <h2 className="mx-auto my-2 max-w-[300px] text-[18px] font-bold tracking-[-0.3px] text-[var(--c-text)]">
        Page not <span className="text-brand-accent">found</span>
      </h2>

      <p className="mx-auto max-w-[300px] text-[12.5px] leading-[1.6] text-[var(--c-text-muted)]">
        <code className="px-1.5 py-0.5 rounded font-mono text-[11px] bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)] break-all">
          {location.pathname}
        </code>
        <br />
        doesn't exist in your dashboard.
      </p>

      <div className="flex flex-col gap-2 mt-4">
        <Link
          to="/user/dashboard"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[13px] font-semibold border border-[rgba(232,197,71,0.6)] shadow-[0_8px_24px_rgba(201,162,39,0.18)]"
        >
          <LayoutDashboard size={14} /> Back to dashboard
        </Link>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-[var(--c-surface-soft)] border border-[var(--c-border-strong)] text-[var(--c-text)] text-[13px] font-medium"
        >
          <ArrowLeft size={14} /> Go back
        </button>
      </div>
    </motion.div>
  )
}
