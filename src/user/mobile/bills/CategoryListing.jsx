import { ShieldCheck, ChevronRight } from 'lucide-react'
import { CATEGORIES, CATEGORY_LOGOS } from './constants'
import MobilePageHeader from '../../../components/partials/MobilePageHeader'

export default function CategoryListing({ onSelect, onBack }) {
  return (
    <div className="flex flex-col gap-4">
      <MobilePageHeader title="Bills & utilities" onBack={onBack} />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--c-accent-soft-2)] via-[var(--c-surface)] to-[var(--c-surface)] border border-[var(--c-accent-border)] p-4">
        <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-brand-accent/[0.18] blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 w-20 h-20 rounded-full bg-brand-accent/[0.06] blur-2xl" />
        <div className="relative">
          <p className="text-[11px] text-[var(--c-text-muted)] m-0 leading-snug">
            Instant tokens · no queues · verified billers
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9px] font-bold uppercase tracking-[0.8px] text-brand-accent">
              <ShieldCheck size={9} /> Secure
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--c-surface)] border border-[var(--c-border)] text-[9px] font-bold uppercase tracking-[0.8px] text-[var(--c-text-muted)]">
              Instant delivery
            </span>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-2.5">
        <h3 className="text-[9px] uppercase tracking-[1.3px] font-semibold text-[var(--c-text-muted)] m-0 px-0.5">
          Select category
        </h3>
        {CATEGORIES.map(({ id, label, icon: Icon, desc, count }) => {
          const logos = CATEGORY_LOGOS[id] || []
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className="group relative overflow-hidden flex items-center gap-3.5 p-3.5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] active:scale-[0.985] transition-all duration-200 text-left w-full"
            >
              <span aria-hidden className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full bg-brand-accent/[0.07] blur-2xl group-hover:bg-brand-accent/[0.15] transition-all duration-300" />

              <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_4px_16px_rgba(201,162,39,0.38)] shrink-0">
                <Icon size={20} strokeWidth={2.1} />
              </span>

              <div className="relative flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-bold text-[var(--c-text)] m-0 leading-tight">{label}</p>
                  <ChevronRight
                    size={14}
                    className="text-[var(--c-text-faint)] shrink-0 mt-0.5 group-hover:text-brand-accent group-hover:translate-x-0.5 transition-all duration-200"
                  />
                </div>
                <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5 truncate leading-snug">{desc}</p>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {logos.slice(0, 4).map((logo, i) => (
                      <span
                        key={i}
                        style={{ marginLeft: i > 0 ? '-5px' : 0, zIndex: 10 - i }}
                        className="relative inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-white border-[1.5px] border-[var(--c-surface)] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
                      >
                        <img src={logo} alt="" className="w-full h-full object-contain" />
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-brand-accent uppercase tracking-[0.6px]">
                    {count} provider{count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </section>

      <p className="inline-flex items-center justify-center gap-1 text-[9.5px] text-[var(--c-text-muted)] mb-1">
        <ShieldCheck size={10} className="text-brand-accent" />
        Secured by VeloxZap · Verified billers
      </p>
    </div>
  )
}
