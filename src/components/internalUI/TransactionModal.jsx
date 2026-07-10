import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Download, AlertCircle, Copy, Check } from 'lucide-react'
import { fmtDate } from '../../utils/format'
import { useWalletTransaction, useElectricityTransaction, useVtuTransaction, useCableTvTransaction, useConversionTransaction, useGiftcardTrade } from '../../hooks/useTransactions'
import { TRANSACTION_STATUS as STATUS_META } from '../../constants/status'
import { formatNetwork } from '../../constants/network'

function formatNGN(n) {
  return '₦' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function SkeletonRows({ count = 4 }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)]">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
          <span aria-hidden className="h-3 w-16 rounded bg-[var(--c-border)] animate-pulse" />
          <span aria-hidden className="h-3 w-24 rounded bg-[var(--c-border)] animate-pulse" />
        </div>
      ))}
    </div>
  )
}

function formatDisco(serviceId) {
  if (!serviceId) return null
  return serviceId
    .replace(/-?electric$/i, '')
    .split('-')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function parseEcodes(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    return [raw]
  }
}

export default function TransactionModal({ tx, onClose }) {
  const open = !!tx && tx.category !== 'Savings'

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  return (
    <AnimatePresence>
      {open && <Body tx={tx} onClose={onClose} />}
    </AnimatePresence>
  )
}

function Body({ tx, onClose }) {
  const isIn = tx.kind === 'in'
  const isInternal = tx.kind === 'internal'
  const status = STATUS_META[tx.status] || STATUS_META.successful
  const isBankTransfer = tx.serviceType === 'bank_transfer'
  const isBankDeposit = tx.serviceType === 'bank_deposit'
  const isElectricity = tx.serviceType === 'Electricity'
  const isDataPurchase = tx.serviceType === 'data purchase'
  const isAirtimePurchase = tx.serviceType === 'airtime recharge'
  const isInternet = tx.serviceType === 'Internet'
  const isTvSubscription = tx.serviceType === 'Cable tv'
  const isCurrencyConversion = tx.serviceType === 'currency conversion'
  const isGiftcardTrade = tx.serviceType === 'Giftcard Trade'
  const { transaction: recipient, loading: recipientLoading } = useWalletTransaction((isBankTransfer || isBankDeposit) ? tx.reference : null)
  const { transaction: electricity, loading: electricityLoading } = useElectricityTransaction(isElectricity ? tx.reference : null)
  const { transaction: vtu, loading: vtuLoading } = useVtuTransaction((isDataPurchase || isAirtimePurchase || isInternet) ? tx.reference : null)
  const { transaction: cabletv, loading: cabletvLoading } = useCableTvTransaction(isTvSubscription ? tx.reference : null)
  const { transaction: conversion, loading: conversionLoading } = useConversionTransaction(isCurrencyConversion ? tx.reference : null)
  const { trade: giftcardTrade, loading: giftcardTradeLoading } = useGiftcardTrade(isGiftcardTrade ? tx.reference : null)

  const [copiedValue, setCopiedValue] = useState(null)
  function copyToken(value) {
    if (navigator.clipboard) navigator.clipboard.writeText(value)
    setCopiedValue(value)
    setTimeout(() => setCopiedValue(null), 1500)
  }

  const [previewImage, setPreviewImage] = useState(null)

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="absolute inset-0 bg-[var(--c-scrim)] backdrop-blur-[3px] border-0 cursor-default"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Transaction details"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
        className="relative w-[420px] max-h-[calc(100vh-32px)] overflow-y-auto rounded-[20px] shadow-[0_32px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(201,162,39,0.15)]"
        style={{ background: 'var(--c-surface)' }}
      >
        {/* Header */}
        <div className="relative overflow-hidden flex items-center gap-3 px-5 py-4 border-b border-[var(--c-border)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,162,39,0.08)] via-transparent to-transparent pointer-events-none" />
          <span
            className={[
              'relative inline-flex items-center justify-center w-11 h-11 rounded-xl shrink-0',
              isIn ? 'bg-[var(--c-success-bg)] text-[var(--c-success)]' : isInternal ? 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)]' : 'bg-[var(--c-warn-bg)] text-[var(--c-warn)]',
            ].join(' ')}
          >
            {isIn ? <ArrowDownLeft size={18} strokeWidth={2.4} /> : isInternal ? <ArrowLeftRight size={18} strokeWidth={2.4} /> : <ArrowUpRight size={18} strokeWidth={2.4} />}
          </span>
          <div className="relative flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[var(--c-text)] m-0 truncate">
              {tx.description || tx.title}
            </p>
            <p
              className={[
                'text-[17px] font-black tabular-nums m-0 mt-0.5',
                isIn ? 'text-[var(--c-success)]' : 'text-[var(--c-text)]',
              ].join(' ')}
            >
              {isInternal ? '' : isIn ? '+' : '-'}{formatNGN(tx.total)}
            </p>
          </div>
          <div className="relative flex items-center gap-2 shrink-0">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold ${status.cls}`}>
              {status.label}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] transition active:scale-90"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Recipient details (bank transfers) / Sender details (bank deposits) */}
        {(isBankTransfer || isBankDeposit) && (
          <div className="mx-5 mt-4">
            <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">
              {isBankDeposit ? 'Sender details' : 'Recipient details'}
            </p>
            {recipientLoading ? (
              <SkeletonRows count={isBankDeposit ? 5 : 4} />
            ) : isBankDeposit ? (
              <div className="rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)]">
                {[
                  { label: 'Sender',         value: recipient?.sender_name },
                  { label: 'Account number', value: recipient?.sender_account_number },
                  { label: 'Bank',           value: recipient?.sender_bank_name },
                  { label: 'Remark',         value: recipient?.note },
                  { label: 'Description',    value: recipient?.description },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                    <span className="text-[11px] text-[var(--c-text-muted)]">{label}</span>
                    <span className="text-[11.5px] font-semibold tabular-nums text-[var(--c-text)]">{value || '—'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)]">
                {[
                  { label: 'Recipient',      value: recipient?.recipient_name },
                  { label: 'Account number', value: recipient?.recipient_account_number },
                  { label: 'Bank',           value: recipient?.recipient_bank_name },
                  { label: 'Remark',         value: recipient?.note },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                    <span className="text-[11px] text-[var(--c-text-muted)]">{label}</span>
                    <span className="text-[11.5px] font-semibold tabular-nums text-[var(--c-text)]">{value || '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Electricity details */}
        {isElectricity && (
          <div className="mx-5 mt-4">
            <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">Electricity details</p>
            {electricityLoading ? (
              <SkeletonRows count={7} />
            ) : (
              <div className="rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)]">
                {[
                  { label: 'Meter number',   value: electricity?.meter_number },
                  { label: 'Disco',          value: formatDisco(electricity?.service_id) },
                  { label: 'Customer',       value: electricity?.customer_name },
                  { label: 'Address',        value: electricity?.customer_address },
                  { label: 'Phone',          value: electricity?.phone_number },
                  { label: 'Variation',      value: electricity?.variation_code },
                  { label: 'Token',          value: electricity?.token, copyable: true },
                ].map(({ label, value, copyable }) => (
                  <div key={label} className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                    <span className="text-[11px] text-[var(--c-text-muted)]">{label}</span>
                    <span className="inline-flex items-center gap-1.5 min-w-0">
                      <span className="text-[11.5px] font-semibold tabular-nums text-[var(--c-text)] truncate">{value || '—'}</span>
                      {copyable && value && (
                        <button
                          type="button"
                          onClick={() => copyToken(value)}
                          aria-label="Copy token"
                          className="inline-flex items-center justify-center w-5 h-5 rounded shrink-0 text-[var(--c-text-muted)] hover:text-brand-accent transition"
                        >
                          {copiedValue === value ? <Check size={11} className="text-[var(--c-success)]" /> : <Copy size={11} />}
                        </button>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Purchase details (data / airtime) */}
        {(isDataPurchase || isAirtimePurchase) && (
          <div className="mx-5 mt-4">
            <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">
              {isDataPurchase ? 'Mobile Data' : 'Airtime'}
            </p>
            {vtuLoading ? (
              <SkeletonRows count={isDataPurchase ? 4 : 3} />
            ) : (
              <div className="rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)]">
                {[
                  { label: 'Transaction type',      value: isDataPurchase ? 'Mobile Data' : 'Airtime' },
                  { label: 'Recipient Mobile',      value: vtu?.phone_number },
                  { label: 'Network', value: formatNetwork(vtu?.service_id) },
                  ...(isDataPurchase ? [{ label: 'Data Bundle', value: vtu?.plan }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                    <span className="text-[11px] text-[var(--c-text-muted)]">{label}</span>
                    <span className="text-[11.5px] font-semibold tabular-nums text-[var(--c-text)]">{value || '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Internet details */}
        {isInternet && (
          <div className="mx-5 mt-4">
            <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">Internet</p>
            {vtuLoading ? (
              <SkeletonRows count={5} />
            ) : vtu?.service_id === 'smile-direct' ? (
              <div className="rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)]">
                {[
                  { label: 'Phone',      value: vtu?.phone_number },
                  { label: 'Network',    value: formatNetwork(vtu?.service_id) },
                  { label: 'Plan',       value: vtu?.plan },
                  { label: 'Email',      value: vtu?.email },
                  { label: 'Account',    value: vtu?.account },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                    <span className="text-[11px] text-[var(--c-text-muted)]">{label}</span>
                    <span className="text-[11.5px] font-semibold tabular-nums text-[var(--c-text)] truncate">{value || '—'}</span>
                  </div>
                ))}
              </div>
            ) : vtu?.service_id === 'spectranet' ? (
              <div className="rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)]">
                {[
                  { label: 'Phone',         value: vtu?.phone_number },
                  { label: 'Network',       value: formatNetwork(vtu?.service_id) },
                  { label: 'Pin',           value: vtu?.pin, copyable: true },
                  { label: 'Serial number', value: vtu?.serial_number },
                  { label: 'Expires on',    value: vtu?.expires_on ? fmtDate(vtu.expires_on) : null },
                ].map(({ label, value, copyable }) => (
                  <div key={label} className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                    <span className="text-[11px] text-[var(--c-text-muted)]">{label}</span>
                    <span className="inline-flex items-center gap-1.5 min-w-0">
                      <span className="text-[11.5px] font-semibold tabular-nums text-[var(--c-text)] truncate">{value || '—'}</span>
                      {copyable && value && (
                        <button
                          type="button"
                          onClick={() => copyToken(value)}
                          aria-label="Copy pin"
                          className="inline-flex items-center justify-center w-5 h-5 rounded shrink-0 text-[var(--c-text-muted)] hover:text-brand-accent transition"
                        >
                          {copiedValue === value ? <Check size={11} className="text-[var(--c-success)]" /> : <Copy size={11} />}
                        </button>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {/* TV subscription details */}
        {isTvSubscription && (
          <div className="mx-5 mt-4">
            <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">TV Subscription</p>
            {cabletvLoading ? (
              <SkeletonRows count={4} />
            ) : (
              <div className="rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)]">
                {[
                  { label: 'Product',        value: cabletv?.product_name },
                  { label: 'Provider',       value: formatDisco(cabletv?.service_id) },
                  { label: 'Smartcard',      value: cabletv?.smartcard_number },
                  { label: 'Customer',       value: cabletv?.customer_name },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                    <span className="text-[11px] text-[var(--c-text-muted)]">{label}</span>
                    <span className="text-[11.5px] font-semibold tabular-nums text-[var(--c-text)] truncate">{value || '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Currency conversion details */}
        {isCurrencyConversion && (
          <div className="mx-5 mt-4">
            <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">Currency Conversion</p>
            {conversionLoading ? (
              <SkeletonRows count={5} />
            ) : (
              <div className="rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)]">
                {[

                  { label: 'From ',    value: conversion?.from_amount != null
                      ? `${conversion.from_currency || ''}${Number(conversion.from_amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : null },
                  { label: 'To ',      value: conversion?.to_amount != null
                      ? `${conversion.to_currency || ''}${Number(conversion.to_amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : null },
                  { label: 'Exchange rate',  value: conversion?.exchange_rate != null
                      ? conversion.from_currency === '$'
                        ? `$1 = ${conversion.to_currency || ''}${Number(conversion.exchange_rate).toLocaleString('en-NG', { maximumFractionDigits: 6 })}`
                        : `${conversion.from_currency || ''}${Number(conversion.exchange_rate).toLocaleString('en-NG', { maximumFractionDigits: 6 })} = ${conversion.to_currency || ''}1`
                      : null },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                    <span className="text-[11px] text-[var(--c-text-muted)]">{label}</span>
                    <span className="text-[11.5px] font-semibold tabular-nums text-[var(--c-text)] truncate">{value || '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Giftcard Trade details */}
        {isGiftcardTrade && (
          <div className="mx-5 mt-4">
            <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">Giftcard Trade</p>
            {giftcardTradeLoading ? (
              <SkeletonRows count={9} />
            ) : (
              <div className="rounded-xl overflow-hidden border border-[var(--c-border)] divide-y divide-[var(--c-border)]">
                {[
                  { label: 'Brand',          value: giftcardTrade?.brand_name },
                  { label: 'Category',       value: giftcardTrade?.sub_category_name },
                  { label: 'Card type',      value: giftcardTrade?.card_type },
                  { label: 'Country',        value: giftcardTrade?.country },
                  { label: 'Rate',           value: giftcardTrade?.rate != null ? `${formatNGN(giftcardTrade.rate)} / 1${giftcardTrade.currency}` : null },
                  { label: 'Amount',         value: giftcardTrade?.amount != null
                      ? (() => {
                          const count = giftcardTrade.card_type === 'ecode'
                            ? parseEcodes(giftcardTrade?.card_ecode).length
                            : giftcardTrade.card_type === 'physical'
                              ? parseEcodes(giftcardTrade?.card_image).length
                              : 0
                          return `${giftcardTrade.currency || ''}${Number(giftcardTrade.amount)}${count > 1 ? ` x${count}` : ''}`
                        })()
                      : null },
                  { label: 'Gross payout', value: giftcardTrade?.receive_amount != null ? formatNGN(giftcardTrade.receive_amount) : null },
                  { label: 'Fee deducted',            value: giftcardTrade?.fee != null ? formatNGN(giftcardTrade.fee) : null },
                  { label: 'You receive',   value: giftcardTrade?.final_amount != null ? formatNGN(giftcardTrade.final_amount) : null },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                    <span className="text-[11px] text-[var(--c-text-muted)]">{label}</span>
                    <span className="text-[11.5px] font-semibold tabular-nums text-[var(--c-text)] truncate">{value || '—'}</span>
                  </div>
                ))}
              </div>
            )}

            {!giftcardTradeLoading && giftcardTrade?.status === 'failed' && giftcardTrade?.reject_note && (
              <div className="mt-2 px-3.5 py-3 rounded-xl bg-[var(--c-danger-soft)] border border-[var(--c-danger-border,rgba(248,113,113,0.25))]">
                <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-danger)] mb-1 m-0">Rejection reason</p>
                <p className="text-[12px] text-[var(--c-text)] m-0 leading-snug">{giftcardTrade.reject_note}</p>
              </div>
            )}

            {!giftcardTradeLoading && giftcardTrade?.card_type === 'ecode' && (() => {
              const codes = parseEcodes(giftcardTrade?.card_ecode)
              return codes.length > 0 ? (
                <div className="mt-2">
                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">
                    E-code{codes.length > 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {codes.map((code, i) => (
                      <div key={i} className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)]">
                        {codes.length > 1 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[var(--c-accent-soft)] border border-[var(--c-accent-border)] text-[9px] font-black text-brand-accent shrink-0">
                            {i + 1}
                          </span>
                        )}
                        <p className="text-[13px] font-mono font-semibold text-[var(--c-text)] m-0 break-all select-all flex-1">{code}</p>
                        <button
                          type="button"
                          onClick={() => copyToken(code)}
                          aria-label="Copy e-code"
                          className="inline-flex items-center justify-center w-5 h-5 rounded shrink-0 text-[var(--c-text-muted)] hover:text-brand-accent transition"
                        >
                          {copiedValue === code ? <Check size={11} className="text-[var(--c-success)]" /> : <Copy size={11} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            })()}

            {!giftcardTradeLoading && giftcardTrade?.card_type === 'physical' && (() => {
              const images = parseEcodes(giftcardTrade?.card_image)
              return images.length > 0 ? (
                <div className="mt-2">
                  <p className="text-[9.5px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)] mb-2 m-0">Card images</p>
                  <div className="flex flex-wrap gap-2">
                    {images.map((img, i) => {
                      const url = `${import.meta.env.VITE_API_BASE_URL}/uploads/images/${img}`
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPreviewImage(url)}
                          className="relative h-20 w-20 rounded-lg overflow-hidden border border-[var(--c-border)] shrink-0"
                        >
                          <img
                            src={url}
                            alt={`Card ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 inline-flex items-center justify-center w-3.5 h-3.5 rounded-tl-md bg-black/55 text-white text-[7px] font-black leading-none">{i + 1}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null
            })()}
          </div>
        )}

        {/* Reference */}
        <div className="flex items-center justify-between gap-2 mx-5 mt-3 px-3 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border)]">
          <span className="text-[9px] uppercase tracking-[0.8px] font-bold text-[var(--c-text-muted)]">Transaction No</span>
          <span className="text-[11px] font-mono font-semibold text-[var(--c-text)] tracking-tight select-all">
            {tx.reference || tx.id}
          </span>
        </div>

        {/* Session ID (bank deposits only) */}
        {isBankDeposit && recipient?.session_id && (
          <div className="flex items-center justify-between gap-2 mx-5 mt-2 px-3 py-2 rounded-lg bg-[var(--c-surface-soft)] border border-[var(--c-border)]">
            <span className="text-[9px] uppercase tracking-[0.8px] font-bold text-[var(--c-text-muted)]">Session ID</span>
            <span className="text-[11px] font-mono font-semibold text-[var(--c-text)] tracking-tight select-all">
              {recipient.session_id}
            </span>
          </div>
        )}

        <p className="text-[10px] text-[var(--c-text-muted)] text-center pt-4 pb-2 m-0">Transaction date: {fmtDate(tx.createdAt)}</p>

        <footer className="grid grid-cols-2 gap-2 px-5 pb-5 pt-2 border-t border-[var(--c-border)]">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)] text-[11px] font-bold hover:border-[var(--c-accent-border)] hover:text-brand-accent active:scale-[0.98] transition"
          >
            <Download size={12} strokeWidth={2.6} /> Receipt
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)] text-[11px] font-bold hover:border-[var(--c-danger-border)] hover:text-[var(--c-danger)] active:scale-[0.98] transition"
          >
            <AlertCircle size={12} strokeWidth={2.6} /> Report
          </button>
        </footer>
      </motion.div>

      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewImage(null)}
          >
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
              src={previewImage}
              alt="Card preview"
              className="max-w-full max-h-full rounded-xl object-contain shadow-[0_32px_100px_rgba(0,0,0,0.55)]"
              onClick={e => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              aria-label="Close preview"
              className="absolute top-5 right-5 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition active:scale-90"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
