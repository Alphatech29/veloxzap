import BottomSheet from './BottomSheet'
import { useSavingsPlanLedger } from '../../hooks/useSavings'
import {
  Loader2, Receipt, ArrowDownLeft, ArrowUpRight,
  AlertTriangle, Sparkles, Coins,
} from 'lucide-react'

const TEAL        = '#34d399'
const TEAL_BG     = 'rgba(52,211,153,0.1)'
const TEAL_BORDER = 'rgba(52,211,153,0.28)'

function fmtDate(d) {
  if (!d) return null
  const date = /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + 'T00:00:00') : new Date(d)
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}
function fmtTime(d) {
  if (!d) return null
  const date = /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + 'T00:00:00') : new Date(d)
  return date.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit', hour12: true })
}
function fmtN(n) { return '₦' + Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 }) }

const LEDGER_META = {
  deposit:         { label: 'Deposit',                  icon: ArrowDownLeft, sign: '+' },
  top_up:          { label: 'Top-up',                   icon: ArrowDownLeft, sign: '+' },
  interest_credit: { label: 'Interest credited',        icon: Sparkles,      sign: '+' },
  withdrawal:      { label: 'Withdrawal',               icon: ArrowUpRight,  sign: '-' },
  penalty:         { label: 'Early withdrawal penalty', icon: AlertTriangle, sign: '-' },
}

function LedgerRow({ entry }) {
  const meta     = LEDGER_META[entry.type] || { label: entry.type, icon: Coins, sign: '' }
  const Icon     = meta.icon
  const isCredit = meta.sign === '+'
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-xl shrink-0 border"
        style={{
          background:  isCredit ? TEAL_BG    : 'var(--c-surface-soft)',
          borderColor: isCredit ? TEAL_BORDER : 'var(--c-border-soft)',
          color:       isCredit ? TEAL        : 'var(--c-text-muted)',
        }}
      >
        <Icon size={13} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-bold text-[var(--c-text)] m-0 truncate">{entry.description || meta.label}</p>
        <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
          {fmtDate(entry.created_at)} · {fmtTime(entry.created_at)}
        </p>
      </div>
      <span className="text-[12.5px] font-black tabular-nums shrink-0" style={{ color: isCredit ? TEAL : 'var(--c-text)' }}>
        {meta.sign}{fmtN(entry.amount)}
      </span>
    </div>
  )
}

export default function GoalHistorySheet({ open, goal, onClose }) {
  const { ledger, loading } = useSavingsPlanLedger(goal?.id)
  return (
    <BottomSheet open={open} onClose={onClose} label="History" title={goal?.name || ''} maxHeight="88vh">
      <div className="pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 size={22} className="animate-spin text-[var(--c-text-muted)]" />
          </div>
        ) : ledger.length === 0 ? (
          <div className="flex flex-col items-center text-center py-12 px-4 gap-3">
            <span
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border"
              style={{ background: TEAL_BG, borderColor: TEAL_BORDER, color: TEAL }}
            >
              <Receipt size={22} strokeWidth={1.8} />
            </span>
            <div>
              <h3 className="text-[14px] font-black text-[var(--c-text)] m-0">No transactions yet</h3>
              <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1 leading-relaxed">
                Deposits and interest credits will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[var(--c-border-soft)]">
            {ledger.map(entry => <LedgerRow key={entry.id} entry={entry} />)}
          </div>
        )}
      </div>
    </BottomSheet>
  )
}
