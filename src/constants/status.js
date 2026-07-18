// Status vocabulary for wallet/general transactions (bank transfer, bills, airtime, savings, etc.)
export const TRANSACTION_STATUS = {
  successful: { label: 'Successful', cls: 'bg-[var(--c-success-bg)] text-[var(--c-success)]',   bg: 'var(--c-success-bg)',   fg: 'var(--c-success)' },
  processing: { label: 'Processing', cls: 'bg-[var(--c-warn-bg)] text-[var(--c-warn)]',          bg: 'var(--c-warn-bg)',      fg: 'var(--c-warn)' },
  pending:    { label: 'Pending',    cls: 'bg-[var(--c-warn-bg)] text-[var(--c-warn)]',          bg: 'var(--c-warn-bg)',      fg: 'var(--c-warn)' },
  failed:     { label: 'Failed',     cls: 'bg-[var(--c-danger-soft)] text-[var(--c-danger)]',    bg: 'var(--c-danger-soft)',  fg: 'var(--c-danger)' },
  refund:     { label: 'Refund',     cls: 'bg-[var(--c-accent-soft)] text-brand-accent',         bg: 'var(--c-accent-soft)',  fg: 'var(--c-accent)' },
  reverse:    { label: 'Reversed',   cls: 'bg-[var(--c-surface-soft)] text-[var(--c-text-muted)]', bg: 'var(--c-surface-soft)', fg: 'var(--c-text-muted)' },
}

// Status vocabulary for crypto deposits (v_crypto_deposit_history.status)
export const CRYPTO_DEPOSIT_STATUS = {
  pending:    { label: 'Pending',    cls: 'bg-[var(--c-warn-bg)] text-[var(--c-warn)]' },
  successful: { label: 'Successful', cls: 'bg-[var(--c-success-bg)] text-[var(--c-success)]' },
  failed:     { label: 'Failed',     cls: 'bg-[var(--c-danger-soft)] text-[var(--c-danger)]' },
}

// Status vocabulary for gift card trades
export const TRADE_STATUS = {
  pending:    { label: 'Pending',    cls: 'bg-[var(--c-warn-bg)] text-[var(--c-warn)]' },
  processing: { label: 'Processing', cls: 'bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]' },
  paid:       { label: 'Paid',       cls: 'bg-[var(--c-success-bg)] text-[var(--c-success)]' },
  failed:     { label: 'Failed',     cls: 'bg-[var(--c-danger-soft)] text-[var(--c-danger)]' },
  completed:  { label: 'Completed',  cls: 'bg-[var(--c-success-bg)] text-[var(--c-success)]' },
}
