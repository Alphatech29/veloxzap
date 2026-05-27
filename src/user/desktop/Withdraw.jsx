import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, ShieldCheck, Info, Loader2,
  Building2, Search, X, Check, ChevronDown, Clock,
  AlertCircle, CheckCircle2, Receipt, Banknote, MessageSquare,
} from 'lucide-react'
import useUser from '../../hooks/useUser'
import KycGate from '../../components/internalUI/KycGate'
import useWithdraw, { getTransferFee, MIN_TRANSFER } from '../../hooks/useWithdraw'
import useBeneficiaries from '../../hooks/useBeneficiaries'
import { useAlert } from '../../components/ui/Alert'
import PinModal from '../../components/ui/PinModal'
import BeneficiaryPicker from '../../components/ui/BeneficiaryPicker'
import BankAvatar from '../../components/ui/BankAvatar'


function formatNGN(n) {
  return '₦' + Number(n).toLocaleString('en-NG')
}

function getInitials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#C9A227,#f5c842)',
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#10b981,#059669)',
]

const QUICK_PCTS = [
  { id: '25',  label: '25%', value: 0.25 },
  { id: '50',  label: '50%', value: 0.5  },
  { id: '75',  label: '75%', value: 0.75 },
  { id: 'max', label: 'Max', value: 1    },
]

function StatusBadge({ status }) {
  const map = {
    pending:   { label: 'Pending',   cls: 'bg-[var(--c-warn-bg)] text-[var(--c-warn)]' },
    completed: { label: 'Paid',      cls: 'bg-[var(--c-success-bg)] text-[var(--c-success)]' },
    failed:    { label: 'Failed',    cls: 'bg-[var(--c-danger-bg,#3a1a1a)] text-[var(--c-danger,#f87171)]' },
  }
  const s = map[status] || map.pending
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] uppercase tracking-[0.8px] font-bold ${s.cls}`}>
      {s.label}
    </span>
  )
}

function SummaryRow({ label, value, bold, accent, muted }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[10.5px] text-[var(--c-text-muted)]">{label}</span>
      <span className={[
        'whitespace-nowrap text-right text-[11.5px]',
        bold   ? 'font-bold text-[var(--c-text)]'   : '',
        accent ? 'font-bold text-brand-accent'       : '',
        muted  ? 'font-semibold text-[var(--c-text-muted)]' : '',
        !bold && !accent && !muted ? 'font-semibold text-[var(--c-text)]' : '',
      ].join(' ')}>
        {value}
      </span>
    </div>
  )
}

const POPULAR_SLUGS = ['opay','zenith','guaranty trust','gtbank','palmpay','kuda','first bank','moniepoint']
const isPopular = name => POPULAR_SLUGS.some(p => name.toLowerCase().includes(p))

function BankRow({ b, selectedCode, onSelect }) {
  const selected = b.code === selectedCode
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(b)}
        className={[
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition active:scale-[0.98]',
          selected
            ? 'bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)]'
            : 'hover:bg-[var(--c-surface-soft)] border border-transparent',
        ].join(' ')}
      >
        <BankAvatar bankCode={b.code} bankName={b.name} size={32} rounded="xl" />
        <span className="flex-1 text-[12.5px] font-semibold text-[var(--c-text)] truncate">{b.name}</span>
        {selected && <Check size={13} className="text-brand-accent shrink-0" />}
      </button>
    </li>
  )
}

/* ── Bank picker modal ──────────────────────────────────────── */
function BankPickerModal({ banks, loading, selectedCode, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const q = query.trim().toLowerCase()
  const filtered = q ? banks.filter(b => b.name.toLowerCase().includes(q)) : null
  const popular  = !q ? banks.filter(b => isPopular(b.name)) : []
  const rest     = !q ? banks.filter(b => !isPopular(b.name)) : []

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[6px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-[480px] max-h-[70vh] flex flex-col rounded-[20px] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(201,162,39,0.15)]"
          style={{ background: 'var(--c-surface)' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,162,39,0.1)] via-transparent to-transparent pointer-events-none" />
            <div className="relative flex items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="inline-flex items-center gap-1 text-[9.5px] uppercase tracking-[1.3px] font-bold text-brand-accent m-0">
                  <Building2 size={9} /> Select bank
                </p>
                <h2 className="text-[16px] font-bold tracking-[-0.3px] text-[var(--c-text)] m-0 mt-0.5">Choose your bank</h2>
              </div>
              <button type="button" onClick={onClose} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] active:scale-90 transition shrink-0">
                <X size={14} />
              </button>
            </div>
            <div className="px-5 pb-4">
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition">
                <Search size={14} className="text-[var(--c-text-muted)] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search bank name…"
                  className="flex-1 bg-transparent border-0 outline-none text-[13px] font-medium text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                  style={{ boxShadow: 'none' }}
                />
                <AnimatePresence>
                  {query && (
                    <motion.button initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.12 }}
                      type="button" onClick={() => setQuery('')}
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--c-border)] text-[var(--c-text-muted)] transition"
                    >
                      <X size={10} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--c-border)] to-transparent" />
          </div>

          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex flex-col gap-px p-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[var(--c-surface-soft)] animate-pulse">
                    <div className="w-8 h-8 rounded-xl bg-[var(--c-border)] shrink-0" />
                    <div className="h-3 w-36 rounded-full bg-[var(--c-border)]" />
                  </div>
                ))}
              </div>
            ) : filtered && filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)]">
                  <Search size={18} />
                </span>
                <p className="text-[12px] text-[var(--c-text-muted)] m-0">No bank matches <strong>"{query}"</strong></p>
              </div>
            ) : filtered ? (
              <ul className="list-none m-0 p-3 flex flex-col gap-1">
                {filtered.map(b => <BankRow key={b.code} b={b} selectedCode={selectedCode} onSelect={onSelect} />)}
              </ul>
            ) : (
              <div className="p-3 flex flex-col gap-1">
                {popular.length > 0 && (
                  <>
                    <p className="text-[9.5px] font-bold uppercase tracking-[1.2px] text-[var(--c-text-muted)] px-3 pt-1 pb-0.5 m-0">Popular</p>
                    <ul className="list-none m-0 p-0 flex flex-col gap-1">
                      {popular.map(b => <BankRow key={b.code} b={b} selectedCode={selectedCode} onSelect={onSelect} />)}
                    </ul>
                    <div className="flex items-center gap-2 my-1.5 px-1">
                      <div className="flex-1 h-px bg-[var(--c-border)]" />
                      <span className="text-[9px] font-bold uppercase tracking-[1px] text-[var(--c-text-muted)]">All banks</span>
                      <div className="flex-1 h-px bg-[var(--c-border)]" />
                    </div>
                  </>
                )}
                <ul className="list-none m-0 p-0 flex flex-col gap-1">
                  {rest.map(b => <BankRow key={b.code} b={b} selectedCode={selectedCode} onSelect={onSelect} />)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}

/* ── Main component ─────────────────────────────────────────── */
export default function DesktopWithdraw() {
  const { alert } = useAlert()
  const { user, wallet, refreshWallet } = useUser()
  const { beneficiaries, loading: beneficiariesLoading, addOrUpdate } = useBeneficiaries()
  const {
    banks, banksLoading,
    verifying, verifyError, accountName, setAccountName,
    verify,
    submitting, submitError,
    submit, reset, clearRecipient,
  } = useWithdraw()

  const balance = wallet?.ngn_balance ?? 0

  const [amount, setAmount]                   = useState('')
  const [bank, setBank]                       = useState(null)
  const [accountNumber, setAccountNumber]     = useState('')
  const [remark, setRemark]                   = useState('')
  const [beneficiaryPickerOpen, setBeneficiaryPickerOpen] = useState(false)
  const [bankPickerOpen, setBankPickerOpen]           = useState(false)
  const [pinOpen, setPinOpen]                 = useState(false)
  const [success, setSuccess]                 = useState(false)

  const num          = parseFloat(String(amount).replace(/[^\d.]/g, '')) || 0
  const FEE          = getTransferFee(num)
  const totalDebit   = num + FEE
  const insufficient = totalDebit > balance
  const verified     = !!accountName && !verifyError
  const belowMin     = num > 0 && num < MIN_TRANSFER
  const canSubmit    = num >= MIN_TRANSFER && !insufficient && bank && verified

  // auto-verify when account number hits 10 digits
  useEffect(() => {
    if (accountNumber.length === 10 && bank) {
      verify({ bank_code: bank.code, account_number: accountNumber })
    } else if (accountNumber.length !== 10) {
      clearRecipient()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountNumber, bank])

  function handleAmountChange(e) {
    const raw = e.target.value.replace(/[^\d.]/g, '')
    const parts = raw.split('.')
    setAmount(parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : raw)
  }

  function handleQuick(pct) {
    const target = Math.floor(balance * pct)
    const fee = getTransferFee(target)
    const safe = Math.max(0, target - fee)
    setAmount(String(safe))
  }

  function handleBeneficiarySelect(b) {
    setAccountNumber(b.accountNumber)
    const matched = banks.find(bk => bk.code === b.bankCode)
    setBank(matched || { code: b.bankCode, name: b.bankName })
    clearRecipient()
  }

  function handleBankSelect(b) {
    setBank(b)
    setBankPickerOpen(false)
    clearRecipient()
    if (accountNumber.length === 10) {
      verify({ bank_code: b.code, account_number: accountNumber })
    }
  }

  async function handleConfirm(pin) {
    if (!bank) return
    const result = await submit({
      amount: num,
      bank_code: bank.code,
      bank_name: bank.name,
      account_number: accountNumber,
      account_name: accountName,
      pin,
      narration: remark.trim() || undefined,
    })
    setPinOpen(false)
    if (result.success) {
      setSuccess(true)
      addOrUpdate({ account_name: accountName, account_number: accountNumber, bank_name: bank.name, bank_code: bank.code })
      setAmount(''); setBank(null); setAccountNumber(''); setRemark(''); clearRecipient()
      refreshWallet()
      alert({ type: 'success', title: 'Transfer successful!', message: result.message || 'Your funds are on the way.' })
      setTimeout(() => setSuccess(false), 3000)
    } else {
      alert({ type: 'error', title: 'Transfer failed', message: result.message })
    }
  }

  return (
    <KycGate verified={user?.is_kyc_verified === 1}>
    <div className="flex flex-col gap-4 max-w-[1240px] mx-auto pb-8">

      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
            <Sparkles size={10} /> Send money
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">Withdraw to bank</h1>
          <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-0.5">
            Transfer from your wallet to any Nigerian bank account
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9.5px] font-bold uppercase tracking-[1px] text-brand-accent">
          <ShieldCheck size={10} /> Secure transfer
        </span>
      </header>

      <section className="grid grid-cols-1 min-[960px]:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">

          {/* Amount */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">Amount</h2>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] text-[var(--c-text-muted)]">
                  Min <span className="font-bold text-[var(--c-text)]">₦{MIN_TRANSFER.toLocaleString()}</span>
                </span>
                <span className="text-[10px] text-[var(--c-text-muted)]">·</span>
                <span className="text-[10px] text-[var(--c-text-muted)]">
                  Balance <span className="font-bold text-[var(--c-text)] tabular-nums">{formatNGN(balance)}</span>
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition overflow-hidden">
              <div className="flex items-center gap-2 px-3.5 py-3">
                <span className="text-[18px] font-black text-[var(--c-text-muted)]">₦</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="flex-1 bg-transparent border-0 outline-none text-[22px] font-black tabular-nums tracking-[-0.4px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                  style={{ boxShadow: 'none' }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {QUICK_PCTS.map(p => (
                <button key={p.id} type="button" onClick={() => handleQuick(p.value)}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] text-[var(--c-text-muted)] hover:border-[var(--c-accent-border)] hover:text-brand-accent active:scale-95 transition">
                  {p.label}
                </button>
              ))}
              {insufficient && (
                <span className="inline-flex items-center gap-1 ml-auto text-[10.5px] font-bold text-[var(--c-danger)]">
                  <Info size={11} /> Insufficient balance
                </span>
              )}
              {belowMin && !insufficient && (
                <span className="inline-flex items-center gap-1 ml-auto text-[10.5px] font-bold text-[var(--c-warn)]">
                  <Info size={11} /> Minimum ₦{MIN_TRANSFER.toLocaleString()}
                </span>
              )}
            </div>
          </article>

          {/* Bank details */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4 flex flex-col gap-3">
            <h2 className="text-[12.5px] font-bold m-0 text-[var(--c-text)] tracking-[-0.1px]">Bank details</h2>

            {/* Bank selector */}
            <div>
              <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-1.5">Bank</p>
              <button
                type="button"
                onClick={() => setBankPickerOpen(true)}
                className={[
                  'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all active:scale-[0.99] text-left',
                  bank
                    ? 'bg-gradient-to-r from-[rgba(201,162,39,0.07)] to-transparent border-[var(--c-accent-border)] hover:border-[var(--c-accent-border-strong)]'
                    : 'bg-[var(--c-surface-soft)] border-[var(--c-border)] hover:border-[var(--c-accent-border)]',
                ].join(' ')}
              >
                {bank
                  ? <BankAvatar bankCode={bank.code} bankName={bank.name} size={36} rounded="xl" />
                  : <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-brand-accent shrink-0"><Building2 size={15} /></span>
                }
                <span className={`flex-1 text-[13px] font-semibold truncate ${bank ? 'text-[var(--c-text)]' : 'text-[var(--c-text-faint)]'}`}>
                  {bank ? bank.name : 'Select bank'}
                </span>
                <ChevronDown size={14} className="text-[var(--c-text-muted)] shrink-0" />
              </button>
            </div>

            {/* Account number */}
            <div>
              <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-1.5">Account number</p>
              <div className={[
                'flex items-center gap-2 px-3.5 py-3 rounded-xl border transition',
                verifyError
                  ? 'border-[var(--c-danger,#f87171)] bg-[var(--c-danger-soft,#2a1a1a)]'
                  : verified
                    ? 'border-[var(--c-success)] bg-[var(--c-success-bg)]'
                    : 'bg-[var(--c-surface-soft)] border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)]',
              ].join(' ')}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit account number"
                  className="flex-1 bg-transparent border-0 outline-none text-[14px] font-bold tabular-nums text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-normal"
                  style={{ boxShadow: 'none' }}
                />
                {verifying && <Loader2 size={15} className="animate-spin text-brand-accent shrink-0" />}
                {verified && !verifying && <Check size={15} className="text-[var(--c-success)] shrink-0" />}
                {verifyError && !verifying && <AlertCircle size={15} className="text-[var(--c-danger,#f87171)] shrink-0" />}
              </div>
            </div>

            {/* Account name */}
            <div>
              <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-1.5">Account name</p>
              <div className={[
                'px-3.5 py-3 rounded-xl border text-[13px] font-bold min-h-[46px] flex items-center',
                verified
                  ? 'bg-[var(--c-accent-soft)] border-[var(--c-accent-border)] text-brand-accent'
                  : 'bg-[var(--c-surface-soft)] border-[var(--c-border)] text-[var(--c-text-faint)]',
              ].join(' ')}>
                {verified ? accountName : verifyError ? (
                  <span className="text-[var(--c-danger,#f87171)] font-semibold text-[12px]">{verifyError}</span>
                ) : 'Auto-filled after verification'}
              </div>
            </div>

            {/* Remark */}
            <div>
              <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-1.5">
                Remark <span className="normal-case tracking-normal font-normal text-[var(--c-text-faint)]">(optional)</span>
              </p>
              <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] focus-within:border-[var(--c-accent-border-strong)] focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.10)] transition">
                <MessageSquare size={14} className="text-[var(--c-text-muted)] shrink-0" />
                <input
                  type="text"
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  placeholder="e.g. Rent, school fees, business…"
                  maxLength={50}
                  className="flex-1 bg-transparent border-0 outline-none text-[13px] font-medium text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                  style={{ boxShadow: 'none' }}
                />
                {remark && (
                  <span className="text-[10px] text-[var(--c-text-muted)] tabular-nums shrink-0">{50 - remark.length}</span>
                )}
              </div>
            </div>
          </article>

        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3 min-[960px]:sticky min-[960px]:top-[80px]">

          {/* Summary */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-accent-border)] overflow-hidden">
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)] bg-gradient-to-br from-[var(--c-accent-soft-2)] to-[var(--c-accent-soft)]">
              <h3 className="inline-flex items-center gap-1.5 text-[12px] font-bold m-0 text-[var(--c-text)]">
                <Receipt size={12} className="text-brand-accent" /> Summary
              </h3>
            </header>
            <div className="p-4 flex flex-col gap-2">
              <SummaryRow label="Amount"        value={num > 0 ? formatNGN(num) : '—'}            bold />
              <SummaryRow label="Fee"           value={num > 0 ? `+${formatNGN(FEE)}` : '—'}      muted />
              <div className="border-t border-dashed border-[var(--c-border)] my-0.5" />
              <SummaryRow label="Total Amount"  value={num > 0 ? formatNGN(totalDebit) : '—'}     accent />
              {bank && (
                <SummaryRow label="To" value={bank.name} />
              )}
              {verified && (
                <SummaryRow label="Account" value={accountName} />
              )}
              {remark.trim() && (
                <SummaryRow label="Remark" value={remark.trim()} />
              )}

              {(submitError) && (
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--c-danger-soft,#2a1a1a)] border border-[var(--c-danger-border,#5a2a2a)] mt-1">
                  <AlertCircle size={13} className="text-[var(--c-danger,#f87171)] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[var(--c-danger,#f87171)] m-0 leading-snug">{submitError}</p>
                </div>
              )}

              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => { reset(); setPinOpen(true) }}
                className={[
                  'relative overflow-hidden inline-flex items-center justify-center gap-2 w-full h-10 rounded-xl text-[12px] font-bold tracking-[0.2px] transition active:scale-[0.99] mt-1.5',
                  canSubmit
                    ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_6px_18px_-6px_rgba(201,162,39,0.5)] hover:-translate-y-px'
                    : 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)] border border-[var(--c-border-soft)] cursor-not-allowed',
                ].join(' ')}
              >
                {success ? (
                  <><CheckCircle2 size={14} /> Sent successfully</>
                ) : (
                  <>Proceed</>
                )}
              </button>

              <p className="inline-flex items-center justify-center gap-1 text-[10px] text-[var(--c-text-muted)] mt-0.5">
                <ShieldCheck size={9} className="text-brand-accent" />
                Secured · PIN required to confirm
              </p>
            </div>
          </article>

          {/* Beneficiaries */}
          <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--c-border-soft)]">
              <Clock size={12} className="text-brand-accent shrink-0" />
              <h2 className="text-[11px] font-bold text-[var(--c-text-muted)] uppercase tracking-[1.1px] m-0 flex-1">Recent</h2>
              <button type="button" onClick={() => setBeneficiaryPickerOpen(true)}
                className="inline-flex items-center justify-center w-6 h-6 rounded-lg border transition hover:border-[var(--c-accent-border)] hover:text-brand-accent active:scale-90"
                style={{ background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)', color: 'var(--c-text-muted)' }}>
                <Search size={11} />
              </button>
              <button type="button" onClick={() => setBeneficiaryPickerOpen(true)}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border transition hover:border-[var(--c-accent-border)] hover:text-brand-accent"
                style={{ color: 'var(--c-text-muted)', borderColor: 'var(--c-border)', background: 'var(--c-surface-soft)' }}>
                Show all
              </button>
            </div>

            <div className="px-3 py-3 flex flex-col gap-1">
              {beneficiariesLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[var(--c-surface-soft)] animate-pulse">
                    <div className="w-8 h-8 rounded-xl bg-[var(--c-border)] shrink-0" />
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="h-2.5 w-28 rounded-full bg-[var(--c-border)]" />
                      <div className="h-2 w-36 rounded-full bg-[var(--c-border)]" />
                    </div>
                  </div>
                ))
              ) : beneficiaries.length === 0 ? (
                <p className="text-[11px] text-[var(--c-text-muted)] text-center py-3 m-0">No recent beneficiaries yet</p>
              ) : (
                beneficiaries.slice(0, 6).map((b, i) => {
                  const active = accountNumber === b.account_number && bank?.code === b.bank_code
                  return (
                    <motion.button
                      key={`${b.account_number}-${b.bank_code}`}
                      type="button"
                      onClick={() => handleBeneficiarySelect({ accountNumber: b.account_number, bankCode: b.bank_code, bankName: b.bank_name })}
                      whileTap={{ scale: 0.99 }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left w-full transition-all"
                      style={{
                        background: active ? 'linear-gradient(135deg,rgba(201,162,39,0.12),rgba(201,162,39,0.05))' : 'var(--c-surface-soft)',
                        border: active ? '1.5px solid rgba(201,162,39,0.35)' : '1.5px solid var(--c-border-soft)',
                        boxShadow: active ? '0 2px 8px rgba(201,162,39,0.1)' : 'none',
                      }}
                    >
                      <BankAvatar bankCode={b.bank_code} bankName={b.bank_name} size={32} rounded="xl" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-[var(--c-text)] m-0 truncate">{b.account_name}</p>
                        <p className="text-[10px] text-[var(--c-text-muted)] m-0 truncate">{b.account_number} · {b.bank_name}</p>
                      </div>
                      {active && <Check size={13} className="text-brand-accent shrink-0" />}
                    </motion.button>
                  )
                })
              )}
            </div>
          </article>

          {/* Info card */}
          <article className="rounded-xl border border-[var(--c-border-soft)] bg-[var(--c-surface-soft)] p-3 flex items-start gap-2.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
              <Banknote size={13} />
            </span>
            <div className="leading-snug">
              <p className="text-[11px] font-semibold text-[var(--c-text)] m-0">Processing time</p>
              <p className="text-[10px] text-[var(--c-text-muted)] m-0 mt-0.5">
                Transfers arrive within <span className="text-brand-accent font-semibold">5 minutes</span>. Bank delays may apply on weekends.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Bank picker modal */}
      <AnimatePresence>
        {bankPickerOpen && (
          <BankPickerModal
            banks={banks}
            loading={banksLoading}
            selectedCode={bank?.code}
            onSelect={handleBankSelect}
            onClose={() => setBankPickerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Beneficiary picker */}
      <BeneficiaryPicker
        open={beneficiaryPickerOpen}
        onClose={() => setBeneficiaryPickerOpen(false)}
        beneficiaries={beneficiaries}
        loading={beneficiariesLoading}
        activeAccountNumber={accountNumber}
        activeBankCode={bank?.code}
        onSelect={b => handleBeneficiarySelect({ accountNumber: b.account_number, bankCode: b.bank_code, bankName: b.bank_name })}
      />

      {/* PIN modal */}
      <PinModal
        open={pinOpen}
        title="Confirm withdrawal"
        subtitle={`Enter your 4-digit PIN to send ${formatNGN(num)} to ${accountName || 'your account'}`}
        loading={submitting}
        onConfirm={handleConfirm}
        onCancel={() => setPinOpen(false)}
      />
    </div>
    </KycGate>
  )
}
