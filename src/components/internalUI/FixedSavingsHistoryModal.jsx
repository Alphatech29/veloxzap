import { motion } from 'framer-motion'
import {
  X, History, Loader2, Receipt,
  ArrowDownLeft, ArrowUpRight, AlertTriangle, Sparkles, Coins,
} from 'lucide-react'
import { useSavingsPlanLedger } from '../../hooks/useSavings'
import { fmtDate } from '../../utils/format'

const LOCK        = '#C9A227'
const LOCK_BG     = 'rgba(201,162,39,0.1)'
const LOCK_BORDER = 'rgba(201,162,39,0.28)'
const MATURE      = '#34d399'

function fmt(n) { return Number(n || 0).toLocaleString('en-NG') }
function fmtN(n) { return '₦' + fmt(Math.round(n || 0)) }

const LEDGER_META = {
  deposit:         { label: 'Initial deposit',          icon: ArrowDownLeft, sign: '+' },
  interest_credit: { label: 'Interest credited',        icon: Sparkles,      sign: '+' },
  withdrawal:      { label: 'Withdrawal',               icon: ArrowUpRight,  sign: '-' },
  penalty:         { label: 'Early withdrawal penalty', icon: AlertTriangle, sign: '-' },
}

function LedgerRow({ entry }) {
  const meta = LEDGER_META[entry.type] || { label: entry.type, icon: Coins, sign: '' }
  const Icon = meta.icon
  const isCredit = meta.sign === '+'
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-xl shrink-0 border"
        style={{
          background: isCredit ? LOCK_BG : 'var(--c-surface-soft)',
          borderColor: isCredit ? LOCK_BORDER : 'var(--c-border-soft)',
          color: isCredit ? LOCK : 'var(--c-text-muted)',
        }}
      >
        <Icon size={13} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11.5px] font-bold text-[var(--c-text)] m-0 truncate">{entry.description || meta.label}</p>
        <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">{fmtDate(entry.created_at)}</p>
      </div>
      <span className="text-[12px] font-black tabular-nums shrink-0" style={{ color: isCredit ? LOCK : 'var(--c-text)' }}>
        {meta.sign}{fmtN(entry.amount)}
      </span>
    </div>
  )
}

export default function FixedSavingsHistoryModal({ lock, onClose }) {
  const { ledger, loading } = useSavingsPlanLedger(lock?.id)
  const { isMature } = lock

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[6px]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="relative w-full max-w-3xl h-[90vh] flex flex-col rounded-[24px] border border-[var(--c-border)] overflow-hidden pointer-events-auto"
          style={{ background: 'var(--c-surface)', boxShadow: '0 32px 80px -16px rgba(2,7,23,0.5)' }}
        >
          <div
            className="shrink-0 flex items-center justify-between gap-3 px-6 py-5 border-b border-[var(--c-border-soft)]"
            style={{ background: 'var(--c-surface)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="inline-flex items-center justify-center w-11 h-11 rounded-2xl shrink-0 border"
                style={{ background: isMature ? 'rgba(52,211,153,0.1)' : LOCK_BG, borderColor: isMature ? 'rgba(52,211,153,0.28)' : LOCK_BORDER, color: isMature ? MATURE : LOCK }}
              >
                <History size={18} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="text-[9.5px] uppercase tracking-[1.3px] font-bold m-0" style={{ color: LOCK }}>History</p>
                <h2 className="text-[16px] font-black text-[var(--c-text)] m-0 truncate tracking-[-0.3px]">{lock.name}</h2>
              </div>
            </div>
            <button type="button" onClick={onClose} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] active:scale-90 transition shrink-0">
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={22} className="animate-spin text-[var(--c-text-muted)]" />
              </div>
            ) : ledger.length === 0 ? (
              <div className="flex flex-col items-center text-center py-16 px-4 gap-3">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border" style={{ background: LOCK_BG, borderColor: LOCK_BORDER, color: LOCK }}>
                  <Receipt size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-[14px] font-black text-[var(--c-text)] m-0">No transactions yet</h3>
                  <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1 leading-relaxed">Deposits and interest credits for this plan will appear here.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[var(--c-border-soft)]">
                {ledger.map(entry => <LedgerRow key={entry.id} entry={entry} />)}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}
