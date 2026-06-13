export function fmtDate(d) {
  return new Date(d).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hourCycle: 'h12' })
}

// Date-only values ('YYYY-MM-DD') are parsed as local Y/M/D rather than via
// the Date constructor — `new Date('2026-01-31')` is UTC midnight, which
// renders as 30 Jan in negative-UTC-offset timezones.
export function fmtDateOnly(d) {
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}/.test(d)) {
    const [y, m, day] = d.slice(0, 10).split('-').map(Number)
    return new Date(y, m - 1, day).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}
