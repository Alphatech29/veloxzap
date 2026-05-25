import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Search, X, Check, ChevronRight,
  AlertCircle, Loader2, ShieldCheck, Building2, ArrowUpRight,
  User, Clock, MessageSquare,
} from 'lucide-react'
import useUser from '../../hooks/useUser'
import useWithdraw, { getTransferFee, MIN_TRANSFER } from '../../hooks/useWithdraw'
import useBeneficiaries from '../../hooks/useBeneficiaries'
import { useAlert } from '../../components/ui/Alert'
import PinModal from '../../components/ui/PinModal'
import BeneficiaryPicker from '../../components/ui/BeneficiaryPicker'
import BottomSheet from '../../components/internalUI/BottomSheet'
import BankAvatar from '../../components/ui/BankAvatar'

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000]

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#C9A227,#f5c842)',
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#10b981,#059669)',
]

function formatNGN(n) {
  return '₦' + Number(n).toLocaleString('en-NG')
}
function getInitials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const POPULAR_SLUGS = ['opay','zenith','guaranty trust','gtbank','palmpay','kuda','first bank','moniepoint']
const isPopular = name => POPULAR_SLUGS.some(p => name.toLowerCase().includes(p))

function BankItem({ b, selectedCode, onSelect, showDivider }) {
  const sel = b.code === selectedCode
  return (
    <li className={showDivider ? 'border-t' : ''} style={{ borderColor: 'var(--c-border-soft)' }}>
      <button type="button" onClick={() => onSelect(b)}
        className="w-full flex items-center gap-3.5 px-5 py-3.5 text-left transition active:scale-[0.99]"
        style={sel ? { background: 'var(--c-accent-soft)' } : {}}
      >
        <BankAvatar bankCode={b.code} bankName={b.name} size={40} rounded="2xl" />
        <span className="flex-1 text-[14px] font-medium text-[var(--c-text)] truncate">{b.name}</span>
        {sel
          ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-accent text-brand-primary shrink-0"><Check size={13} strokeWidth={3} /></span>
          : <ChevronRight size={15} className="text-[var(--c-text-muted)] shrink-0" />
        }
      </button>
    </li>
  )
}

/* ── Bank picker sheet ──────────────────────────────────────── */
function BankSheet({ open, banks, loading, selectedCode, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  useEffect(() => { if (open) inputRef.current?.focus() }, [open])

  const q = query.trim().toLowerCase()
  const filtered = q ? banks.filter(b => b.name.toLowerCase().includes(q)) : null
  const popular  = !q ? banks.filter(b => isPopular(b.name)) : []
  const rest     = !q ? banks.filter(b => !isPopular(b.name)) : []

  return (
    <BottomSheet open={open} onClose={onClose} label="Transfer to" title="Select bank" maxHeight="90vh">
      {/* Search */}
      <div className="px-5 pb-4 shrink-0">
        <div
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border transition-all focus-within:shadow-[0_0_0_3px_rgba(201,162,39,0.15)]"
          style={{ background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)' }}
        >
          <Search size={14} className="text-[var(--c-text-muted)] shrink-0" />
          <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search bank name…"
            className="flex-1 bg-transparent border-0 outline-none text-[13.5px] text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
            style={{ boxShadow: 'none' }}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')}
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--c-border)] text-[var(--c-text-muted)] transition active:scale-90">
              <X size={10} />
            </button>
          )}
        </div>
      </div>

      <div className="h-px" style={{ background: 'var(--c-border)' }} />

      <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col px-5 py-3 gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2 animate-pulse">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--c-surface-soft)] shrink-0" />
                  <div className="h-3 rounded-full bg-[var(--c-surface-soft)]" style={{ width: `${100 + i * 20}px` }} />
                </div>
              ))}
            </div>
          ) : filtered && filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <span className="text-3xl">🏦</span>
              <p className="text-[13px] text-[var(--c-text-muted)] m-0">No results for <strong>"{query}"</strong></p>
            </div>
          ) : filtered ? (
            <ul className="list-none m-0 p-0">
              {filtered.map((b, i) => <BankItem key={b.code} b={b} selectedCode={selectedCode} onSelect={onSelect} showDivider={i > 0} />)}
            </ul>
          ) : (
            <>
              {popular.length > 0 && (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-[1.2px] px-5 pt-3 pb-1 m-0" style={{ color: 'var(--c-text-muted)' }}>Popular</p>
                  <ul className="list-none m-0 p-0">
                    {popular.map((b, i) => <BankItem key={b.code} b={b} selectedCode={selectedCode} onSelect={onSelect} showDivider={i > 0} />)}
                  </ul>
                  <div className="flex items-center gap-3 px-5 py-2">
                    <div className="flex-1 h-px" style={{ background: 'var(--c-border)' }} />
                    <span className="text-[9.5px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--c-text-muted)' }}>All banks</span>
                    <div className="flex-1 h-px" style={{ background: 'var(--c-border)' }} />
                  </div>
                </>
              )}
              <ul className="list-none m-0 p-0">
                {rest.map((b, i) => <BankItem key={b.code} b={b} selectedCode={selectedCode} onSelect={onSelect} showDivider={i > 0} />)}
              </ul>
            </>
          )}
      </div>
    </BottomSheet>
  )
}

/* ── Premium digit dots progress ──────────────────────────── */
function DigitProgress({ count, max = 10 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{ scale: i < count ? 1 : 0.6, opacity: i < count ? 1 : 0.25 }}
          transition={{ duration: 0.15 }}
          className="rounded-full"
          style={{
            width: i < count ? 6 : 4,
            height: i < count ? 6 : 4,
            background: i < count ? 'var(--c-brand-accent, #C9A227)' : 'var(--c-border)',
          }}
        />
      ))}
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────── */
export default function MobileWithdraw() {
  const navigate = useNavigate()
  const { alert } = useAlert()
  const { user, wallet, dedicatedAccount, refreshWallet } = useUser()
  const { beneficiaries, loading: beneficiariesLoading, addOrUpdate } = useBeneficiaries()
  const {
    banks, banksLoading,
    verifying, verifyError, accountName, setAccountName,
    verify, submitting, submitError, submit, reset, clearRecipient,
  } = useWithdraw()

  const balance = wallet?.available_balance ?? 0

  const STORAGE_KEY = 'veloxzap.withdraw.draft'

  function loadDraft() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null') } catch { return null }
  }

  const draft = loadDraft()

  const [step, setStep]                   = useState(draft?.step ?? 1)
  const [bank, setBank]                   = useState(draft?.bank ?? null)
  const [accountNumber, setAccountNumber] = useState(draft?.accountNumber ?? '')
  const [bankSheetOpen, setBankSheetOpen]         = useState(false)
  const [beneficiaryPickerOpen, setBeneficiaryPickerOpen] = useState(false)
  const [amount, setAmount]               = useState(draft?.amount ?? '')
  const [remark, setRemark]               = useState(draft?.remark ?? '')
  const [pinOpen, setPinOpen]             = useState(false)
  const [previewOpen, setPreviewOpen]     = useState(false)
  const [statusSheet, setStatusSheet]     = useState(null)   // null | 'processing' | 'success'
  const [lastTransfer, setLastTransfer]   = useState(null)

  // Restore verified account name from draft on mount
  useEffect(() => {
    const d = loadDraft()
    if (d?.accountName) setAccountName(d.accountName)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist draft whenever key fields change
  useEffect(() => {
    if (accountNumber || bank || accountName || amount || remark || step > 1) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        step, bank, accountNumber, accountName, amount, remark,
      }))
    }
  }, [step, bank, accountNumber, accountName, amount, remark])

  const num          = parseFloat(String(amount).replace(/[^\d.]/g, '')) || 0
  const FEE          = getTransferFee(num)
  const totalDebit   = num + FEE
  const insufficient = totalDebit > balance
  const verified     = !!accountName && !verifyError
  const canProceed   = verified && !!bank
  const belowMin     = num > 0 && num < MIN_TRANSFER
  const canSubmit    = num >= MIN_TRANSFER && !insufficient && canProceed

  useEffect(() => {
    if (accountNumber.length === 10 && bank) {
      verify({ bank_code: bank.code, account_number: accountNumber })
    } else if (accountNumber.length !== 10) {
      clearRecipient()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountNumber, bank])

  function handleBankSelect(b) {
    setBank(b)
    setBankSheetOpen(false)
    clearRecipient()
    if (accountNumber.length === 10) verify({ bank_code: b.code, account_number: accountNumber })
  }

  function handleBeneficiarySelect(b) {
    setAccountNumber(b.accountNumber)
    const matched = banks.find(bk => bk.code === b.bankCode)
    setBank(matched || { code: b.bankCode, name: b.bankName })
    clearRecipient()
  }

  function handleAmountChange(e) {
    const raw = e.target.value.replace(/[^\d.]/g, '')
    const parts = raw.split('.')
    setAmount(parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : raw)
  }

  async function handleConfirm(pin) {
    if (!bank) return
    setPinOpen(false)
    setPreviewOpen(false)
    setStatusSheet('processing')
    setLastTransfer({ name: accountName, bank: bank.name, amount: num, fee: FEE, total: num + FEE })

    const result = await submit({
      amount: num,
      bank_code: bank.code,
      bank_name: bank.name,
      account_number: accountNumber,
      account_name: accountName,
      pin,
      narration: remark.trim() || undefined,
    })

    if (result.success) {
      setStatusSheet('success')
      sessionStorage.removeItem(STORAGE_KEY)
      setAmount(''); setRemark(''); setBank(null); setAccountNumber(''); clearRecipient(); setStep(1)
      refreshWallet()
      addOrUpdate({ account_name: accountName, account_number: accountNumber, bank_name: bank.name, bank_code: bank.code })
    } else {
      setStatusSheet(null)
      setPreviewOpen(true)
      alert({ type: 'error', title: 'Transfer failed', message: result.message })
    }
  }

  function handleBack() {
    if (step === 2) {
      setAmount('')
      setRemark('')
      setStep(1)
    } else {
      setBank(null)
      setAccountNumber('')
      setAmount('')
      setRemark('')
      clearRecipient()
      reset()
      sessionStorage.removeItem(STORAGE_KEY)
      navigate(-1)
    }
  }

  const senderName     = user?.full_name || user?.name || user?.email || 'My Account'
  const senderInitials = getInitials(senderName)

  return (
    <div className="flex flex-col pb-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-3 -mt-1">
        <button type="button"
          onClick={handleBack}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border active:scale-95 transition shrink-0"
          style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-[15px] font-bold text-[var(--c-text)] m-0 leading-tight">Send money</h1>
          <p className="text-[10px] text-[var(--c-text-muted)] m-0">
            {step === 1 ? 'Recipient details' : 'Amount & remark'}
          </p>
        </div>
        {/* Step pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {[1, 2].map(s => (
            <motion.div
              key={s}
              animate={{ width: step === s ? 24 : 8, opacity: step >= s ? 1 : 0.3 }}
              transition={{ duration: 0.25 }}
              className="h-2 rounded-full"
              style={{ background: step >= s ? 'var(--c-brand-accent, #C9A227)' : 'var(--c-border)' }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════ STEP 1 ══════════ */}
        {step === 1 && (
          <motion.div key="s1"
            initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col gap-2"
          >

            {/* ── From card ── */}
            <div
              className="rounded-[20px] p-4 relative overflow-hidden"
              style={{
                background: 'linear-gradient(140deg, #0A1F44 0%, #0f2d62 55%, #091a3a 100%)',
                boxShadow: '0 16px 48px -12px rgba(10,31,68,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {/* Glow blobs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.12)' }} />
              <div className="absolute -bottom-8 -left-6 w-28 h-28 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(201,162,39,0.07)' }} />
              {/* Dot grid */}
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '18px 18px' }} />


              <div className="relative flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black text-brand-primary shrink-0"
                  style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', boxShadow: '0 4px 14px rgba(201,162,39,0.4)' }}
                >
                  {senderInitials || <User size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-bold text-white m-0 truncate">{senderName}</p>
                  {dedicatedAccount?.account_number
                    ? <p className="text-[10.5px] text-white/45 m-0 mt-0.5 font-medium tracking-[0.3px]">
                       VeloxZap wallet - {dedicatedAccount.account_number}
                      </p>
                    : <p className="text-[10.5px] text-white/45 m-0 mt-0.5">VeloxZap wallet</p>
                  }
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[9px] text-white/35 m-0 font-medium uppercase tracking-[0.8px]">Balance</p>
                  <p className="text-[10px] font-black text-white tabular-nums m-0 mt-0.5 leading-tight">{formatNGN(balance)}</p>
                </div>
              </div>
            </div>

            {/* ── Account number ── */}
            <div
              className="rounded-[14px] overflow-hidden"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
            >
              <div className="flex items-center justify-between px-3.5 pt-2.5 pb-1.5">
                <p className="text-[9px] font-bold text-[var(--c-text-muted)] uppercase tracking-[1.1px] m-0">Account number</p>
                <AnimatePresence>
                  {accountNumber.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.12 }}
                      type="button"
                      onClick={() => { setAccountNumber(''); clearRecipient(); setBank(null); sessionStorage.removeItem(STORAGE_KEY) }}
                      className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ color: 'var(--c-text-muted)', background: 'var(--c-surface-soft)', border: '1px solid var(--c-border)' }}
                    >Clear</motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="px-3.5 pb-2.5">
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] transition-all duration-200"
                  style={{
                    background: verifyError ? 'rgba(248,113,113,0.05)' : verified ? 'rgba(16,185,129,0.05)' : 'var(--c-surface-soft)',
                    border: verifyError ? '1.5px solid rgba(248,113,113,0.4)' : verified ? '1.5px solid rgba(16,185,129,0.4)' : '1.5px solid var(--c-border)',
                  }}
                >
                  <input
                    type="tel" inputMode="numeric" maxLength={10}
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="0000000000"
                    className="flex-1 bg-transparent border-0 outline-none font-black tabular-nums text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] placeholder:font-normal placeholder:tracking-normal"
                    style={{ fontSize: 15, letterSpacing: '3px', boxShadow: 'none' }}
                  />
                  {verifying && (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="shrink-0">
                      <Loader2 size={15} style={{ color: '#C9A227' }} />
                    </motion.div>
                  )}
                  {verified && !verifying && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0"
                      style={{ background: '#10b981', color: '#fff' }}>
                      <Check size={10} strokeWidth={3} />
                    </motion.span>
                  )}
                  {verifyError && !verifying && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0"
                      style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>
                      <AlertCircle size={10} />
                    </span>
                  )}
                </div>

                <div className="mt-1.5">
                  <DigitProgress count={accountNumber.length} />
                </div>
              </div>

              <AnimatePresence>
                {verified && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
                    <div className="px-3.5 pb-2.5">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-[10px]"
                        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <Check size={11} strokeWidth={3} style={{ color: '#10b981', flexShrink: 0 }} />
                        <p className="text-[12px] font-bold text-[var(--c-text)] m-0 truncate">{accountName}</p>
                        <span className="text-[9px] font-bold uppercase tracking-[0.8px] shrink-0" style={{ color: '#10b981' }}>Verified</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                {verifyError && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                    <div className="px-3.5 pb-2.5">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-[10px]"
                        style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)' }}>
                        <AlertCircle size={11} style={{ color: '#f87171', flexShrink: 0 }} />
                        <p className="text-[11.5px] font-semibold m-0" style={{ color: '#f87171' }}>{verifyError}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Bank ── */}
            <div
              className="rounded-[18px] overflow-hidden"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <button type="button" onClick={() => setBankSheetOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 transition active:scale-[0.99]"
                style={{ background: 'transparent' }}
              >
                {bank
                  ? <BankAvatar bankCode={bank.code} bankName={bank.name} size={40} rounded="xl" />
                  : <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--c-surface-soft)', border: '1.5px solid var(--c-border)', color: 'var(--c-text-muted)' }}><Building2 size={15} /></span>
                }
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[9px] font-bold text-[var(--c-text-muted)] uppercase tracking-[1px] m-0">Bank</p>
                  <p className={`text-[13.5px] font-semibold m-0 mt-0.5 truncate ${bank ? 'text-[var(--c-text)]' : 'text-[var(--c-text-faint)]'}`}>
                    {bank ? bank.name : "Recipient's bank"}
                  </p>
                </div>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border)' }}
                >
                  <ChevronRight size={13} className="text-[var(--c-text-muted)]" />
                </div>
              </button>
            </div>

            {/* ── Proceed button ── */}
            <motion.button
              type="button"
              disabled={!canProceed}
              onClick={() => setStep(2)}
              whileTap={{ scale: 0.97 }}
              className="w-full h-[50px] rounded-[16px] flex items-center justify-center gap-2 font-bold transition-all"
              style={canProceed ? {
                background: 'linear-gradient(135deg,#C9A227,#f0d060)',
                color: '#0A1F44',
                fontSize: 14,
                boxShadow: '0 6px 20px -4px rgba(201,162,39,0.55)',
              } : {
                background: 'var(--c-surface)',
                color: 'var(--c-text-muted)',
                fontSize: 14,
                border: '1px solid var(--c-border)',
              }}
            >
              {verifying ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : 'Proceed'}
            </motion.button>

            {/* ── Beneficiaries ── */}
            <div
              className="rounded-[18px] overflow-hidden"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                <Clock size={12} className="text-brand-accent" />
                <p className="text-[9.5px] font-bold text-[var(--c-text-muted)] uppercase tracking-[1.1px] m-0 flex-1">Recent</p>
                <button type="button" onClick={() => setBeneficiaryPickerOpen(true)}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-lg border active:scale-90 transition"
                  style={{ background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)', color: 'var(--c-text-muted)' }}>
                  <Search size={11} />
                </button>
                <button type="button" onClick={() => setBeneficiaryPickerOpen(true)}
                  className="text-[9.5px] font-bold px-2 py-0.5 rounded-full border transition"
                  style={{ color: 'var(--c-text-muted)', borderColor: 'var(--c-border)', background: 'var(--c-surface-soft)' }}>
                  Show all
                </button>
              </div>

              {/* Search */}
              <div className="flex flex-col px-4 pb-3 gap-1">
                {beneficiariesLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-[12px] bg-[var(--c-surface-soft)] animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-[var(--c-border)] shrink-0" />
                      <div className="flex-1 flex flex-col gap-1.5">
                        <div className="h-2.5 w-24 rounded-full bg-[var(--c-border)]" />
                        <div className="h-2 w-32 rounded-full bg-[var(--c-border)]" />
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
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-[12px] transition-all text-left w-full"
                        style={{
                          background: active ? 'linear-gradient(135deg,rgba(201,162,39,0.12),rgba(201,162,39,0.06))' : 'var(--c-surface-soft)',
                          border: active ? '1.5px solid rgba(201,162,39,0.35)' : '1.5px solid var(--c-border-soft)',
                          boxShadow: active ? '0 2px 10px rgba(201,162,39,0.12)' : 'none',
                        }}
                      >
                        <BankAvatar bankCode={b.bank_code} bankName={b.bank_name} size={32} rounded="full" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold text-[var(--c-text)] m-0 truncate">{b.account_name}</p>
                          <p className="text-[10px] text-[var(--c-text-muted)] m-0 truncate">{b.account_number} · {b.bank_name}</p>
                        </div>
                        {active && <Check size={14} className="text-brand-accent shrink-0" />}
                      </motion.button>
                    )
                  })
                )}
              </div>
            </div>

          </motion.div>
        )}

        {/* ══════════ STEP 2 ══════════ */}
        {step === 2 && (
          <motion.div key="s2"
            initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 28 }}
            transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col gap-2"
          >


            {/* Recipient mini card */}
            <div
              className="rounded-[18px] overflow-hidden"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <BankAvatar bankCode={bank?.code} bankName={bank?.name} size={40} rounded="xl" />
                <div className="flex-1 min-w-0">
                  <p className="text-[9.5px] font-bold text-[var(--c-text-muted)] uppercase tracking-[0.9px] m-0">To</p>
                  <p className="text-[13.5px] font-bold text-[var(--c-text)] m-0 mt-0.5 truncate">{accountName}</p>
                  <p className="text-[10.5px] text-[var(--c-text-muted)] m-0 mt-0.5">{accountNumber} · {bank?.name}</p>
                </div>
                <button type="button" onClick={() => setStep(1)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-full transition"
                  style={{ color: '#C9A227', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.2)' }}>
                  Edit
                </button>
              </div>
            </div>

            {/* Amount hero */}
            <div
              className="rounded-[18px] overflow-hidden"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-[var(--c-text-muted)] uppercase tracking-[1.1px] m-0">Amount</p>
                  <p className="text-[10px] text-[var(--c-text-muted)] m-0">
                    Min <span className="font-bold text-[var(--c-text)]">₦{MIN_TRANSFER.toLocaleString()}</span>
                  </p>
                </div>

                {/* Big amount input */}
                <div
                  className="px-4 py-4 rounded-[14px] transition-all duration-200"
                  style={{
                    background: insufficient || belowMin
                      ? 'rgba(248,113,113,0.06)'
                      : num > 0
                        ? 'linear-gradient(135deg,rgba(201,162,39,0.08),rgba(201,162,39,0.03))'
                        : 'var(--c-surface-soft)',
                    border: insufficient || belowMin
                      ? '1.5px solid rgba(248,113,113,0.4)'
                      : num > 0
                        ? '1.5px solid rgba(201,162,39,0.3)'
                        : '1.5px solid var(--c-border)',
                    boxShadow: num > 0 && !insufficient && !belowMin ? '0 0 0 4px rgba(201,162,39,0.07)' : 'none',
                  }}
                >
                  <div className="flex items-start gap-1">
                    <span className="text-[16px] font-black mt-2" style={{ color: num > 0 && !belowMin ? '#C9A227' : 'var(--c-text-muted)' }}>₦</span>
                    <input
                      type="tel" inputMode="numeric"
                      value={amount} onChange={handleAmountChange}
                      placeholder="0" autoFocus
                      className="flex-1 bg-transparent border-0 outline-none font-black tabular-nums placeholder:text-[var(--c-text-faint)]"
                      style={{ fontSize: 30, lineHeight: 1.1, letterSpacing: '-0.5px', boxShadow: 'none', color: (insufficient || belowMin) ? '#f87171' : 'var(--c-text)', minWidth: 0 }}
                    />
                  </div>
                  <AnimatePresence>
                    {belowMin && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-[11px] font-bold mt-1.5 m-0 flex items-center gap-1 overflow-hidden"
                        style={{ color: '#f87171' }}
                      >
                        <AlertCircle size={11} /> Minimum transfer is ₦{MIN_TRANSFER.toLocaleString()}
                      </motion.p>
                    )}
                    {insufficient && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-[11px] font-bold mt-1.5 m-0 flex items-center gap-1 overflow-hidden"
                        style={{ color: '#f87171' }}
                      >
                        <AlertCircle size={11} /> Exceeds available balance
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick amounts */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {QUICK_AMOUNTS.map(q => (
                    <motion.button key={q} type="button" onClick={() => setAmount(String(q))}
                      whileTap={{ scale: 0.95 }}
                      className="py-2 rounded-[10px] text-[11px] font-bold border transition"
                      style={num === q
                        ? { background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', border: 'none', boxShadow: '0 4px 12px rgba(201,162,39,0.3)' }
                        : { background: 'var(--c-surface-soft)', color: 'var(--c-text-muted)', borderColor: 'var(--c-border-soft)' }
                      }>
                      {formatNGN(q)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Remark */}
            <div
              className="rounded-[18px] overflow-hidden"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border)', color: 'var(--c-text-muted)' }}
                >
                  <MessageSquare size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9.5px] font-bold text-[var(--c-text-muted)] uppercase tracking-[0.9px] m-0 mb-1">
                    Remark <span className="normal-case tracking-normal font-normal">(optional)</span>
                  </p>
                  <input
                    type="text" value={remark} onChange={e => setRemark(e.target.value)}
                    placeholder="e.g. Rent, school fees, business…" maxLength={50}
                    className="w-full bg-transparent border-0 outline-none text-[13.5px] font-medium text-[var(--c-text)] placeholder:text-[var(--c-text-faint)]"
                    style={{ boxShadow: 'none' }}
                  />
                </div>
                {remark && (
                  <span className="text-[10px] text-[var(--c-text-muted)] shrink-0 tabular-nums">{50 - remark.length}</span>
                )}
              </div>
            </div>

            {submitError && (
              <div className="flex items-start gap-2.5 p-4 rounded-[20px]"
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}>
                <AlertCircle size={14} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
                <p className="text-[12px] m-0 leading-snug font-semibold" style={{ color: '#f87171' }}>{submitError}</p>
              </div>
            )}

            <div className="pt-1">
              <motion.button
                type="button"
                disabled={!canSubmit}
                onClick={() => { reset(); setPreviewOpen(true) }}
                whileTap={{ scale: 0.97 }}
                className="w-full h-[50px] rounded-[16px] flex items-center justify-center gap-2 font-bold transition-all"
                style={canSubmit ? {
                  background: 'linear-gradient(135deg,#C9A227,#f0d060)',
                  color: '#0A1F44',
                  fontSize: 14,
                  boxShadow: '0 6px 20px -4px rgba(201,162,39,0.55)',
                } : {
                  background: 'var(--c-surface)',
                  color: 'var(--c-text-muted)',
                  fontSize: 14,
                  border: '1px solid var(--c-border)',
                }}
              >
                Continue

              </motion.button>
              <p className="text-center text-[10px] mt-2 flex items-center justify-center gap-1.5" style={{ color: 'var(--c-text-muted)' }}>
                <ShieldCheck size={10} className="text-brand-accent" />
                Bank-level security · PIN protected · NIP fee applies
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Bank sheet */}
      <BankSheet
        open={bankSheetOpen}
        banks={banks} loading={banksLoading}
        selectedCode={bank?.code}
        onSelect={handleBankSelect}
        onClose={() => setBankSheetOpen(false)}
      />

      {/* Preview sheet */}
      <AnimatePresence>
        {previewOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[4px]"
              onClick={() => setPreviewOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.85 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[24px] overflow-hidden"
              style={{ background: 'var(--c-surface)', paddingBottom: 'env(safe-area-inset-bottom,0px)', boxShadow: '0 -16px 48px rgba(0,0,0,0.35)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-[3px] rounded-full bg-[var(--c-border)]" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-3 pb-4">
                <div>
                  <p className="text-[9.5px] font-bold text-brand-accent uppercase tracking-[1.2px] m-0">Review</p>
                  <h2 className="text-[17px] font-bold text-[var(--c-text)] m-0 mt-0.5">Confirm transfer</h2>
                </div>
                <button type="button" onClick={() => setPreviewOpen(false)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full border active:scale-90 transition"
                  style={{ background: 'var(--c-surface-soft)', borderColor: 'var(--c-border)', color: 'var(--c-text-muted)' }}>
                  <X size={14} />
                </button>
              </div>

              {/* Recipient row */}
              <div className="mx-5 mb-3 flex items-center gap-3 px-4 py-3 rounded-[16px]"
                style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border)' }}>
                <BankAvatar bankCode={bank?.code} bankName={bank?.name} size={40} rounded="xl" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-bold text-[var(--c-text)] m-0 truncate">{accountName}</p>
                  <p className="text-[11px] text-[var(--c-text-muted)] m-0">{accountNumber} · {bank?.name}</p>
                </div>
              </div>

              {/* Amount breakdown */}
              <div className="mx-5 mb-4 rounded-[16px] overflow-hidden"
                style={{ border: '1px solid var(--c-border)' }}>
                <div className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: 'var(--c-border-soft)' }}>
                  <span className="text-[12px] text-[var(--c-text-muted)]">Amount</span>
                  <span className="text-[13px] font-bold text-[var(--c-text)] tabular-nums">{formatNGN(num)}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: 'var(--c-border-soft)' }}>
                  <span className="text-[12px] text-[var(--c-text-muted)]">Fee</span>
                  <span className="text-[12px] text-[var(--c-text-muted)] tabular-nums">+{formatNGN(FEE)}</span>
                </div>
                {remark.trim() && (
                  <div className="flex items-center justify-between px-4 py-3 border-b"
                    style={{ borderColor: 'var(--c-border-soft)' }}>
                    <span className="text-[12px] text-[var(--c-text-muted)]">Remark</span>
                    <span className="text-[12px] font-medium text-[var(--c-text)] truncate max-w-[160px]">{remark}</span>
                  </div>
                )}
                <div className="flex items-center justify-between px-4 py-3.5"
                  style={{ background: 'var(--c-accent-soft)' }}>
                  <span className="text-[12.5px] font-bold text-[var(--c-text)]">Total Amount</span>
                  <span className="text-[17px] font-black tabular-nums" style={{ color: '#C9A227' }}>{formatNGN(num + FEE)}</span>
                </div>
              </div>

              {/* Confirm button */}
              <div className="px-5 pb-5">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPinOpen(true)}
                  className="w-full h-[52px] rounded-[16px] flex items-center justify-center gap-2 font-bold"
                  style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', fontSize: 15, boxShadow: '0 6px 20px -4px rgba(201,162,39,0.55)' }}
                >
                 Confirm
                </motion.button>
                <p className="text-center text-[10px] mt-2.5 flex items-center justify-center gap-1.5" style={{ color: 'var(--c-text-muted)' }}>
                  <ShieldCheck size={10} className="text-brand-accent" />
                  PIN required to complete this transfer
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Status sheet — processing & success */}
      <AnimatePresence>
        {statusSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-[4px]"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.85 }}
              className="fixed bottom-0 left-0 right-0 z-[90] rounded-t-[24px] overflow-hidden"
              style={{ background: 'var(--c-surface)', paddingBottom: 'env(safe-area-inset-bottom,0px)', boxShadow: '0 -16px 48px rgba(0,0,0,0.35)' }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-[3px] rounded-full bg-[var(--c-border)]" />
              </div>

              {statusSheet === 'processing' && (
                <div className="flex flex-col items-center gap-4 px-6 py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--c-accent-soft)', border: '2px solid rgba(201,162,39,0.3)' }}
                  >
                    <Loader2 size={28} style={{ color: '#C9A227' }} />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-[16px] font-bold text-[var(--c-text)] m-0">Processing transfer</p>
                    <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1">Please wait, do not close the app…</p>
                  </div>
                  {lastTransfer && (
                    <div className="w-full px-4 py-3 rounded-[14px] flex items-center justify-between"
                      style={{ background: 'var(--c-surface-soft)', border: '1px solid var(--c-border)' }}>
                      <div>
                        <p className="text-[11px] text-[var(--c-text-muted)] m-0">Sending to</p>
                        <p className="text-[13px] font-bold text-[var(--c-text)] m-0">{lastTransfer.name}</p>
                        <p className="text-[10.5px] text-[var(--c-text-muted)] m-0">{lastTransfer.bank}</p>
                      </div>
                      <p className="text-[16px] font-black tabular-nums" style={{ color: '#C9A227' }}>{formatNGN(lastTransfer.amount)}</p>
                    </div>
                  )}
                </div>
              )}

              {statusSheet === 'success' && (
                <div className="flex flex-col items-center gap-4 px-6 py-8">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}
                  >
                    <Check size={30} strokeWidth={2.5} style={{ color: '#10b981' }} />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-[17px] font-bold text-[var(--c-text)] m-0">Transfer successful!</p>
                    <p className="text-[12px] text-[var(--c-text-muted)] m-0 mt-1">Your funds are on their way</p>
                  </div>
                  {lastTransfer && (
                    <div className="w-full rounded-[14px] overflow-hidden" style={{ border: '1px solid var(--c-border)' }}>
                      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                        <span className="text-[11.5px] text-[var(--c-text-muted)]">Recipient</span>
                        <span className="text-[12px] font-bold text-[var(--c-text)]">{lastTransfer.name}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                        <span className="text-[11.5px] text-[var(--c-text-muted)]">Bank</span>
                        <span className="text-[12px] font-bold text-[var(--c-text)]">{lastTransfer.bank}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                        <span className="text-[11.5px] text-[var(--c-text-muted)]">Amount</span>
                        <span className="text-[12px] font-bold text-[var(--c-text)] tabular-nums">{formatNGN(lastTransfer.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--c-border-soft)' }}>
                        <span className="text-[11.5px] text-[var(--c-text-muted)]">Fee</span>
                        <span className="text-[11.5px] text-[var(--c-text-muted)] tabular-nums">+{formatNGN(lastTransfer.fee)}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3.5" style={{ background: 'rgba(16,185,129,0.06)' }}>
                        <span className="text-[12.5px] font-bold text-[var(--c-text)]">Total Amount</span>
                        <span className="text-[16px] font-black tabular-nums" style={{ color: '#10b981' }}>{formatNGN(lastTransfer.total)}</span>
                      </div>
                    </div>
                  )}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStatusSheet(null)}
                    className="w-full h-[50px] rounded-[16px] font-bold text-[14px]"
                    style={{ background: 'linear-gradient(135deg,#C9A227,#f0d060)', color: '#0A1F44', boxShadow: '0 6px 20px -4px rgba(201,162,39,0.5)' }}
                  >
                    Done
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
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
        onSelect={b => {
          handleBeneficiarySelect({ accountNumber: b.account_number, bankCode: b.bank_code, bankName: b.bank_name })
          setBeneficiaryPickerOpen(false)
        }}
      />

      {/* PIN modal */}
      <PinModal
        open={pinOpen}
        title="Confirm transfer"
        subtitle={`Send ${formatNGN(num)} to ${accountName || 'recipient'}`}
        loading={submitting}
        onConfirm={handleConfirm}
        onCancel={() => setPinOpen(false)}
      />
    </div>
  )
}
