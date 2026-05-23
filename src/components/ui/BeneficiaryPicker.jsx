import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Check, Users } from 'lucide-react'
import useIsMobile from '../../hooks/useIsMobile'
import BankAvatar from './BankAvatar'

function BeneficiaryList({ beneficiaries, loading, query, activeKey, onSelect }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--c-surface-soft)] animate-pulse">
            <div className="w-10 h-10 rounded-full bg-[var(--c-border)] shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3 w-28 rounded-full bg-[var(--c-border)]" />
              <div className="h-2.5 w-40 rounded-full bg-[var(--c-border)]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const filtered = beneficiaries.filter(b => {
    const q = query.trim().toLowerCase()
    return !q || b.account_name.toLowerCase().includes(q) || b.account_number.includes(q) || b.bank_name.toLowerCase().includes(q)
  })

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)]">
          <Users size={20} />
        </span>
        <p className="text-[13px] text-[var(--c-text-muted)] m-0 text-center">
          {query ? <>No results for <strong>"{query}"</strong></> : 'No beneficiaries yet.\nThey appear after your first transfer.'}
        </p>
      </div>
    )
  }

  return (
    <ul className="list-none m-0 p-0">
      {filtered.map((b, i) => {
        const key = `${b.account_number}-${b.bank_code}`
        const active = activeKey === key
        return (
          <li key={key} className="border-b last:border-b-0" style={{ borderColor: 'var(--c-border-soft)' }}>
            <button
              type="button"
              onClick={() => onSelect(b)}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition active:scale-[0.99]"
              style={active ? { background: 'var(--c-accent-soft)' } : {}}
            >
              <BankAvatar bankCode={b.bank_code} bankName={b.bank_name} size={40} rounded="full" />
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-bold text-[var(--c-text)] m-0 truncate">{b.account_name}</p>
                <p className="text-[11px] text-[var(--c-text-muted)] m-0 truncate">{b.account_number} · {b.bank_name}</p>
              </div>
              {active && <Check size={15} className="text-brand-accent shrink-0" strokeWidth={2.5} />}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default function BeneficiaryPicker({ open, onClose, beneficiaries, loading, activeAccountNumber, activeBankCode, onSelect }) {
  const isMobile = useIsMobile()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const activeKey = activeAccountNumber && activeBankCode ? `${activeAccountNumber}-${activeBankCode}` : null

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  useEffect(() => {
    if (!open || isMobile) return
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, isMobile, onClose])

  function handleSelect(b) {
    onSelect(b)
    onClose()
  }

  const searchBar = (
    <div
      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.12)]"
      style={{ background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)' }}
    >
      <Search size={14} className="text-[var(--c-text-muted)] shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search name, account or bank…"
        className="flex-1 bg-transparent border-0 outline-none text-[13px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
        style={{ boxShadow: 'none' }}
      />
      {query && (
        <button type="button" onClick={() => setQuery('')}
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--c-border)] text-[var(--c-text-muted)] active:scale-90 transition">
          <X size={10} />
        </button>
      )}
    </div>
  )

  return (
    <AnimatePresence>
      {open && (
        isMobile ? (
          /* ── Mobile: bottom sheet ── */
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[70] bg-black/65 backdrop-blur-[5px]"
              onClick={onClose}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 330, damping: 32, mass: 0.88 }}
              className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-[26px] flex flex-col overflow-hidden"
              style={{
                maxHeight: '88vh',
                background: 'var(--c-surface)',
                paddingBottom: 'env(safe-area-inset-bottom,0px)',
                boxShadow: '0 -20px 60px rgba(0,0,0,0.4)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3.5 shrink-0">
                <div className="w-10 h-1 rounded-full bg-[var(--c-border)]" />
              </div>
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0">
                <div>
                  <p className="text-[9.5px] font-bold text-brand-accent uppercase tracking-[1.2px] m-0">Beneficiaries</p>
                  <h2 className="text-[17px] font-bold text-[var(--c-text)] m-0 mt-0.5">All recipients</h2>
                </div>
                <button type="button" onClick={onClose}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full border active:scale-90 transition"
                  style={{ background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)', color: 'var(--c-text-muted)' }}>
                  <X size={14} />
                </button>
              </div>
              <div className="px-5 pb-3 shrink-0">{searchBar}</div>
              <div className="h-px shrink-0" style={{ background: 'var(--c-border)' }} />
              <div className="overflow-y-auto flex-1">
                <BeneficiaryList beneficiaries={beneficiaries} loading={loading} query={query} activeKey={activeKey} onSelect={handleSelect} />
              </div>
            </motion.div>
          </>
        ) : (
          /* ── Desktop: centered modal ── */
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-[var(--c-scrim)] backdrop-blur-[3px]"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.75 }}
              className="relative w-full max-w-[480px] flex flex-col rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
              style={{ maxHeight: '72vh', background: 'var(--c-surface)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b" style={{ borderColor: 'var(--c-border)' }}>
                <div>
                  <p className="text-[9.5px] font-bold text-brand-accent uppercase tracking-[1.2px] m-0">Beneficiaries</p>
                  <h2 className="text-[16px] font-bold text-[var(--c-text)] m-0 mt-0.5">All recipients</h2>
                </div>
                <button type="button" onClick={onClose}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-[var(--c-surface-soft)] active:scale-90 transition"
                  style={{ borderColor: 'var(--c-border)', color: 'var(--c-text-muted)' }}>
                  <X size={14} />
                </button>
              </div>
              <div className="px-5 py-3 shrink-0 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>{searchBar}</div>
              <div className="overflow-y-auto flex-1">
                <BeneficiaryList beneficiaries={beneficiaries} loading={loading} query={query} activeKey={activeKey} onSelect={handleSelect} />
              </div>
            </motion.div>
          </div>
        )
      )}
    </AnimatePresence>
  )
}
