import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTH_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WEEKDAYS    = ['Su','Mo','Tu','We','Th','Fr','Sa']

function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate() }
function firstDayOf(y, m)  { return new Date(y, m, 1).getDay() }
function toIso(y, m, d)    { return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` }
function parseIso(s)       { return s ? new Date(s + 'T00:00:00') : null }

export default function DatePicker({ value, onChange, placeholder = 'Pick a date', minDate }) {
  const today  = new Date(); today.setHours(0,0,0,0)
  const parsed = parseIso(value)

  const [open,       setOpen]       = useState(false)
  const [dir,        setDir]        = useState(1)
  const [view,       setView]       = useState({
    year:  parsed?.getFullYear()  ?? today.getFullYear(),
    month: parsed?.getMonth()     ?? today.getMonth(),
  })
  const [popupStyle, setPopupStyle] = useState({ position: 'fixed', zIndex: 9999 })

  const triggerRef = useRef(null)
  const popupRef   = useRef(null)

  function calcPosition() {
    if (!triggerRef.current) return
    const r   = triggerRef.current.getBoundingClientRect()
    const gap = 8
    const est = 400
    const flip = (r.bottom + gap + est > window.innerHeight) && r.top > est
    setPopupStyle({
      position : 'fixed',
      zIndex   : 9999,
      left     : r.left,
      width    : r.width,
      ...(flip
        ? { top: 'auto', bottom: window.innerHeight - r.top + gap }
        : { top: r.bottom + gap, bottom: 'auto' }),
    })
  }

  function openPicker() {
    calcPosition()
    setOpen(true)
  }

  /* close on outside click */
  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (
        popupRef.current   && !popupRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  /* reposition on scroll / resize */
  useEffect(() => {
    if (!open) return
    const fn = () => calcPosition()
    window.addEventListener('scroll', fn, true)
    window.addEventListener('resize', fn)
    return () => {
      window.removeEventListener('scroll', fn, true)
      window.removeEventListener('resize', fn)
    }
  }, [open])

  function changeMonth(delta) {
    setDir(delta)
    setView(v => {
      const raw = v.month + delta
      if (raw > 11) return { year: v.year + 1, month: 0 }
      if (raw < 0)  return { year: v.year - 1, month: 11 }
      return { ...v, month: raw }
    })
  }

  function select(d) {
    if (!d) return
    const date = new Date(view.year, view.month, d); date.setHours(0,0,0,0)
    if (minDate && date < minDate) return
    onChange(toIso(view.year, view.month, d))
    setOpen(false)
  }

  const firstDay  = firstDayOf(view.year, view.month)
  const totalDays = daysInMonth(view.year, view.month)
  const cells     = [...Array(firstDay).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)]

  const isSelected = d => !!(d && parsed &&
    parsed.getFullYear() === view.year && parsed.getMonth() === view.month && parsed.getDate() === d)
  const isToday    = d => !!(d &&
    today.getFullYear() === view.year && today.getMonth() === view.month && today.getDate() === d)
  const isDisabled = d => !!(d && minDate && new Date(view.year, view.month, d) < minDate)

  const label = parsed
    ? `${String(parsed.getDate()).padStart(2,'0')} ${MONTH_FULL[parsed.getMonth()]} ${parsed.getFullYear()}`
    : null

  return (
    <div className="relative">

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => open ? setOpen(false) : openPicker()}
        className={[
          'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 bg-[var(--c-surface-soft)]',
          open
            ? 'border-[var(--c-accent-border)] shadow-[0_0_0_3px_rgba(201,162,39,0.12)]'
            : 'border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
        ].join(' ')}
      >
        <span className={[
          'shrink-0 inline-flex items-center justify-center w-[26px] h-[26px] rounded-[8px] border transition-all duration-200',
          open
            ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft border-[rgba(232,197,71,0.55)] text-brand-primary shadow-[0_2px_8px_rgba(201,162,39,0.35)]'
            : 'bg-[var(--c-surface)] border-[var(--c-border)] text-[var(--c-text-muted)]',
        ].join(' ')}>
          <Calendar size={11} strokeWidth={2.2} />
        </span>
        <span className={['text-[12px] flex-1 leading-none', label ? 'text-[var(--c-text)] font-semibold' : 'text-[var(--c-text-faint)]'].join(' ')}>
          {label ?? placeholder}
        </span>
        {label && (
          <span className="shrink-0 text-[9px] uppercase tracking-[1px] font-bold text-brand-accent">
            {MONTH_SHORT[parsed.getMonth()]} {parsed.getFullYear()}
          </span>
        )}
      </button>

      {/* Portal targets .ul-shell so CSS variables are inherited */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="dp"
              ref={popupRef}
              style={popupStyle}
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
              style={{
                ...popupStyle,
                background : 'var(--c-menu-bg)',
                border     : '1px solid var(--c-accent-border)',
                boxShadow  : '0 20px 60px -10px rgba(2,7,23,0.55), 0 0 0 1px rgba(201,162,39,0.08)',
              }}
            >
              {/* Month nav */}
              <div
                className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--c-border)]"
                style={{ background: 'linear-gradient(135deg, var(--c-accent-soft-2) 0%, var(--c-accent-soft) 100%)' }}
              >
                <button type="button" onClick={() => changeMonth(-1)}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-[9px] bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] hover:text-brand-accent hover:border-[var(--c-accent-border)] active:scale-90 transition">
                  <ChevronLeft size={13} />
                </button>

                <AnimatePresence mode="wait" initial={false} custom={dir}>
                  <motion.div
                    key={`${view.year}-${view.month}`}
                    custom={dir}
                    initial={d => ({ opacity: 0, x: d > 0 ? 22 : -22 })}
                    animate={{ opacity: 1, x: 0 }}
                    exit={d => ({ opacity: 0, x: d > 0 ? -22 : 22 })}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="text-center select-none"
                  >
                    <p className="text-[13px] font-bold text-[var(--c-text)] m-0 leading-none">{MONTH_FULL[view.month]}</p>
                    <p className="text-[10px] font-bold text-brand-accent m-0 mt-0.5 tabular-nums">{view.year}</p>
                  </motion.div>
                </AnimatePresence>

                <button type="button" onClick={() => changeMonth(1)}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-[9px] bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] hover:text-brand-accent hover:border-[var(--c-accent-border)] active:scale-90 transition">
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* Weekday labels */}
              <div className="grid grid-cols-7 px-3 pt-3 pb-1">
                {WEEKDAYS.map(d => (
                  <div key={d} className="text-center text-[9px] uppercase tracking-[0.9px] font-bold text-[var(--c-text-faint)]">{d}</div>
                ))}
              </div>

              {/* Day grid */}
              <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.div
                  key={`g-${view.year}-${view.month}`}
                  custom={dir}
                  initial={d => ({ opacity: 0, x: d > 0 ? 18 : -18 })}
                  animate={{ opacity: 1, x: 0 }}
                  exit={d => ({ opacity: 0, x: d > 0 ? -18 : 18 })}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="grid grid-cols-7 px-3 pb-3.5 gap-1"
                >
                  {cells.map((d, i) => {
                    const sel = isSelected(d)
                    const tod = isToday(d)
                    const dis = isDisabled(d)
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => select(d)}
                        disabled={!!dis}
                        className={[
                          'relative flex items-center justify-center h-[30px] w-full rounded-[9px] text-[11.5px] font-semibold transition-all duration-150',
                          !d  ? 'pointer-events-none invisible' : '',
                          sel ? 'text-brand-primary shadow-[0_4px_14px_rgba(201,162,39,0.45)]' : '',
                          !sel && tod  ? 'text-brand-accent ring-1 ring-brand-accent/50 bg-brand-accent/[0.08]' : '',
                          !sel && !tod && !dis ? 'text-[var(--c-text-muted)] hover:bg-[var(--c-surface-soft)] hover:text-[var(--c-text)] active:scale-90' : '',
                          dis && d ? 'text-[var(--c-text-faint)] opacity-30 cursor-not-allowed' : '',
                        ].join(' ')}
                        style={sel ? { background: 'linear-gradient(135deg, #C9A227, #E8C547)' } : undefined}
                      >
                        {sel && <span aria-hidden className="absolute inset-0 rounded-[9px] -z-10 blur-sm" style={{ background: 'rgba(201,162,39,0.3)' }} />}
                        {d}
                      </button>
                    )
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--c-border)] bg-[var(--c-surface-soft-2)]">
                <span className="text-[10px] text-[var(--c-text-faint)]">
                  {MONTH_SHORT[today.getMonth()]} {today.getDate()}, {today.getFullYear()} · today
                </span>
                <button type="button"
                  onClick={() => {
                    setView({ year: today.getFullYear(), month: today.getMonth() })
                    if (!minDate || today >= minDate) select(today.getDate())
                  }}
                  className="text-[10px] font-bold text-brand-accent hover:underline active:scale-95 transition"
                >
                  Go to today
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.querySelector('.ul-shell') ?? document.body
      )}
    </div>
  )
}
