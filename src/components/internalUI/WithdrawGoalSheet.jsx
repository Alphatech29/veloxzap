import BottomSheet, { SheetRow } from './BottomSheet'
import { Loader2, ArrowUpRight, AlertTriangle, ShieldCheck } from 'lucide-react'

const WITHDRAWAL_BLOCKED = new Set(['pending', 'approved', 'completed'])

function fmtN(n) { return '₦' + Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 }) }

export default function WithdrawGoalSheet({ open, goal, onClose, onConfirm, withdrawing }) {
  const blocked = WITHDRAWAL_BLOCKED.has(goal?.withdrawalStatus)
  return (
    <BottomSheet open={open} onClose={() => !withdrawing && onClose()} label="Withdraw" title={goal?.name || 'Target savings'} maxHeight="65vh">
      <div className="px-5 pt-2 pb-8 flex flex-col gap-4">
        <div className="rounded-2xl border border-[var(--c-border-soft)] overflow-hidden divide-y divide-[var(--c-border-soft)]" style={{ background: 'var(--c-surface-soft)' }}>
          <SheetRow label="Saved so far"    value={fmtN(goal?.principal)} bold />
          <SheetRow label="Interest earned" value={fmtN(goal?.interestEarned)} accent />
          {goal?.goal != null && <SheetRow label="Target amount" value={fmtN(goal.goal)} muted />}
        </div>

        {goal?.penalty > 0 && (
          <div
            className="flex items-start gap-2.5 p-3.5 rounded-2xl"
            style={{ background: 'rgba(251,146,60,0.07)', border: '1px solid rgba(251,146,60,0.22)' }}
          >
            <AlertTriangle size={14} strokeWidth={2.2} style={{ color: '#fb923c', marginTop: 1, shrink: 0 }} />
            <p className="text-[11.5px] font-semibold leading-relaxed m-0" style={{ color: '#fb923c' }}>
              A <span className="font-black">{goal.penalty}% early withdrawal penalty</span> will be deducted from your balance before it is returned to your wallet.
            </p>
          </div>
        )}

        {blocked ? (
          <div
            className="inline-flex items-center justify-center w-full h-[50px] rounded-xl font-bold text-[13.5px] border"
            style={{ background: 'rgba(251,146,60,0.07)', borderColor: 'rgba(251,146,60,0.25)', color: '#fb923c' }}
          >
            Withdrawal {goal?.withdrawalStatus}
          </div>
        ) : (
          <button
            type="button" onClick={onConfirm} disabled={withdrawing}
            className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-xl font-bold text-[13.5px] transition active:scale-[0.99] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: '1px solid rgba(232,197,71,0.5)', boxShadow: '0 8px 24px -6px rgba(201,162,39,0.5)' }}
          >
            {withdrawing
              ? <><Loader2 size={15} className="animate-spin" /> Processing…</>
              : <><ArrowUpRight size={15} strokeWidth={2.2} /> Confirm withdrawal</>
            }
          </button>
        )}

        <p className="inline-flex items-center gap-1.5 text-[10px] text-[var(--c-text-faint)] justify-center m-0">
          <ShieldCheck size={11} className="text-brand-accent" /> Funds returned to your wallet after approval
        </p>
      </div>
    </BottomSheet>
  )
}
