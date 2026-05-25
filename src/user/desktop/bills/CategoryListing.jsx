import { Sparkles, ShieldCheck, ChevronRight } from 'lucide-react'
import { CATEGORIES } from './constants'

export default function CategoryListing({ onSelect }) {
  return (
    <div className="flex flex-col gap-6 max-w-[1240px] mx-auto pb-8">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-semibold m-0">
            <Sparkles size={10} /> Pay bills
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">
            Bills & utilities
          </h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Cable, electricity & internet · instant token, no queues.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
          <ShieldCheck size={10} /> Verified billers
        </span>
      </header>

      <section>
        <h2 className="text-[11px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 mb-3">
          Select a category
        </h2>
        <div className="grid grid-cols-1 min-[640px]:grid-cols-3 gap-4">
          {CATEGORIES.map(({ id, label, icon: Icon, desc, providers, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className="relative overflow-hidden flex flex-col gap-4 p-5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] active:scale-[0.99] transition text-left group"
            >
              <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full bg-brand-accent/[0.07] blur-3xl group-hover:bg-brand-accent/[0.12] transition-all duration-300" />

              <div className="relative flex items-start justify-between gap-3">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent shrink-0">
                  <Icon size={22} strokeWidth={2} />
                </span>
                <span className="text-[9.5px] font-bold uppercase tracking-[0.8px] px-1.5 py-0.5 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-brand-accent shrink-0 mt-1">
                  {count}
                </span>
              </div>

              <div className="relative flex-1">
                <p className="text-[15px] font-bold text-[var(--c-text)] m-0 leading-tight">{label}</p>
                <p className="text-[11.5px] text-[var(--c-text-muted)] m-0 mt-1 leading-snug">{desc}</p>
                <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-2.5 truncate">
                  {providers.join(' · ')}
                </p>
              </div>

              <div className="relative flex items-center justify-end">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-accent group-hover:gap-2 transition-all">
                  Select <ChevronRight size={13} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
