import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'

export default function UserFooter() {
  return (
    <footer className="flex items-center justify-between flex-wrap gap-2.5 px-4 pt-4 pb-5 min-[960px]:px-[30px] min-[960px]:pb-[22px] border-t border-[var(--c-border)] text-[11.5px] text-[var(--c-text-muted)]">
      <span className="inline-flex items-center gap-1.5 text-[var(--c-success)]">
        <Activity size={11} />
        All systems operational
      </span>
      <nav className="inline-flex items-center gap-4">
        <Link to="/terms" className="text-[var(--c-text-muted)] hover:text-brand-accent transition">Terms</Link>
        <Link to="/privacy" className="text-[var(--c-text-muted)] hover:text-brand-accent transition">Privacy</Link>
        <Link to="/aml" className="text-[var(--c-text-muted)] hover:text-brand-accent transition">AML</Link>
        <span className="text-[var(--c-text-faint)]">© {new Date().getFullYear()} VeloxZap</span>
      </nav>
    </footer>
  )
}
