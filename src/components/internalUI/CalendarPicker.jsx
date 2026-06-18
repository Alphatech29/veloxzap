import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react'

const TEAL = '#34d399'
const TEAL_BG = 'rgba(52,211,153,0.1)'
const TEAL_BORDER = 'rgba(52,211,153,0.28)'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function fmtDisplay(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function CalendarPicker({ value, onChange, label, optional }) {
  const [open, setOpen] = useState(false)
  const [{ viewYear, viewMonth }, setView] = useState(() => {
    const d = value ? new Date(value + 'T00:00:00') : new Date()
    return { viewYear: d.getFullYear(), viewMonth: d.getMonth() }
  })

  const firstDow = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const selDate = value ? new Date(value + 'T00:00:00') : null
  const now = new Date()

  function pick(day) {
    if (!day) return
    const d = new Date(viewYear, viewMonth, day)
    onChange(d.toISOString().split('T')[0])
    setOpen(false)
  }

  function prevMonth() {
    setView(({ viewYear, viewMonth }) =>
      viewMonth === 0
        ? { viewYear: viewYear - 1, viewMonth: 11 }
        : { viewYear, viewMonth: viewMonth - 1 }
    )
  }

  function nextMonth() {
    setView(({ viewYear, viewMonth }) =>
      viewMonth === 11
        ? { viewYear: viewYear + 1, viewMonth: 0 }
        : { viewYear, viewMonth: viewMonth + 1 }
    )
  }

  function isSelected(day) {
    return !!(
      selDate &&
      selDate.getFullYear() === viewYear &&
      selDate.getMonth() === viewMonth &&
      selDate.getDate() === day
    )
  }

  function isToday(day) {
    return (
      now.getFullYear() === viewYear &&
      now.getMonth() === viewMonth &&
      now.getDate() === day
    )
  }

  return (
    <div
      className="rounded-2xl border transition-all"
      style={{
        background: value ? 'rgba(52,211,153,0.03)' : 'var(--c-surface-soft)',
        borderColor: open || value ? TEAL_BORDER : 'var(--c-border)',
        boxShadow: open || value ? '0 0 0 3px rgba(52,211,153,0.07)' : 'none',
        overflow: 'hidden',
      }}
    >
      {/* ── Trigger ─────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center w-full gap-3 px-4 py-3.5 text-left"
      >
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-all"
          style={{
            background: value ? TEAL_BG : 'var(--c-border-soft)',
            color: value ? TEAL : 'var(--c-text-faint)',
          }}
        >
          <Calendar size={16} strokeWidth={2} />
        </span>

        <div className="flex-1 min-w-0">
          <p
            className="text-[9.5px] uppercase tracking-[1.1px] font-bold m-0"
            style={{ color: 'var(--c-text-faint)' }}
          >
            {label}
            {optional && (
              <span className="font-normal normal-case tracking-normal ml-1 text-[9px]">
                · opt
              </span>
            )}
          </p>
          <p
            className="text-[13.5px] font-bold m-0 mt-0.5 leading-tight truncate"
            style={{ color: value ? 'var(--c-text)' : 'var(--c-text-faint)' }}
          >
            {value ? fmtDisplay(value) : optional ? 'Optional' : 'Select a date'}
          </p>
        </div>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="shrink-0"
          style={{ color: 'var(--c-text-faint)' }}
        >
          <ChevronDown size={14} strokeWidth={2} />
        </motion.span>
      </button>

      {/* ── Calendar panel ──────────────────────────────── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="cal"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--c-border-soft)]" style={{ background: 'var(--c-surface)' }}>

              {/* Month navigation */}
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  type="button" onClick={prevMonth}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-xl transition active:scale-90"
                  style={{
                    background: 'var(--c-surface-soft)',
                    border: '1px solid var(--c-border)',
                    color: 'var(--c-text-muted)',
                  }}
                >
                  <ChevronLeft size={13} strokeWidth={2.4} />
                </button>

                <div className="text-center">
                  <p className="text-[13.5px] font-black text-[var(--c-text)] tracking-[-0.3px] m-0">
                    {MONTHS[viewMonth]}
                  </p>
                  <p className="text-[11px] font-bold text-[var(--c-text-muted)] m-0 mt-0.5 tabular-nums">
                    {viewYear}
                  </p>
                </div>

                <button
                  type="button" onClick={nextMonth}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-xl transition active:scale-90"
                  style={{
                    background: 'var(--c-surface-soft)',
                    border: '1px solid var(--c-border)',
                    color: 'var(--c-text-muted)',
                  }}
                >
                  <ChevronRight size={13} strokeWidth={2.4} />
                </button>
              </div>

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 px-3 mb-1">
                {DAYS.map(d => (
                  <div
                    key={d}
                    className="flex items-center justify-center h-7 text-[9px] font-black uppercase tracking-[0.8px]"
                    style={{ color: 'var(--c-text-faint)' }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
                {cells.map((day, i) => {
                  const sel = day && isSelected(day)
                  const tod = day && isToday(day)

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pick(day)}
                      disabled={!day}
                      className="flex items-center justify-center h-8 rounded-xl text-[12.5px] font-bold transition-all active:scale-90 disabled:pointer-events-none"
                      style={
                        sel
                          ? {
                              background: TEAL,
                              color: '#0A1F44',
                              boxShadow: '0 4px 12px rgba(52,211,153,0.4)',
                            }
                          : tod
                            ? {
                                background: TEAL_BG,
                                color: TEAL,
                                boxShadow: `inset 0 0 0 1.5px ${TEAL_BORDER}`,
                              }
                            : {
                                color: day ? 'var(--c-text)' : 'transparent',
                              }
                      }
                    >
                      {day ?? ''}
                    </button>
                  )
                })}
              </div>

              {/* Clear */}
              {value && (
                <div className="flex justify-center pb-4">
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onChange('') }}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold transition hover:opacity-70"
                    style={{ color: 'var(--c-text-faint)' }}
                  >
                    <X size={9} strokeWidth={2.4} /> Clear date
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom teal accent when value is set and closed */}
      <AnimatePresence>
        {value && !open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-0.5"
            style={{ background: `linear-gradient(90deg,${TEAL},rgba(52,211,153,0.2))` }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
