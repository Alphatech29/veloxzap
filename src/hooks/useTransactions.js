import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchHistory } from '../lib/transactions'

function diffDays(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.round((todayStart - dateStart) / (1000 * 60 * 60 * 24))
}

function dayLabel(dateStr) {
  const d = diffDays(dateStr)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  if (d <= 7) return 'This week'
  return 'Earlier'
}

function metaLabel(dateStr) {
  const d = diffDays(dateStr)
  const date = new Date(dateStr)
  if (d === 0) return date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
  if (d === 1) return 'Yesterday'
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
}

function normalize(row) {
  return {
    // identifiers
    id:          String(row.id),
    reference:   row.reference ?? null,

    // direction & category
    kind:        row.status_type === 'credit' ? 'in' : 'out',
    category:    (row.service_type || 'Other').replace(/^\w/, c => c.toUpperCase()),
    title:       (row.service_type || 'Transaction').replace(/^\w/, c => c.toUpperCase()),
    description: row.description ?? null,

    // display labels
    meta:        metaLabel(row.created_at),
    day:         dayLabel(row.created_at),

    // financials (Numbers, not strings)
    amount:      Number(row.total),
    fee:         Number(row.fee   ?? 0),
    total:       Number(row.total ?? row.amount),
    currency:    row.currency ?? '₦',

    // status
    status:      row.status === 'successful' ? 'completed' : row.status,

    // raw timestamps for audit trail
    createdAt:   row.created_at  ?? null,
    updatedAt:   row.updated_at  ?? null,
  }
}

export default function useTransactions({ autoFetch = true, recentLimit = 6 } = {}) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)

  const fetchRecent = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await fetchHistory()
    setLoading(false)
    if (result.success) {
      setTransactions(result.rows.slice(0, recentLimit).map(normalize))
    } else {
      setError(result.message || 'Failed to load transactions.')
    }
    return result
  }, [recentLimit])

  useEffect(() => {
    if (autoFetch) fetchRecent()
  }, [autoFetch, fetchRecent])

  // Only status_type:"credit" + status:"successful" counts as inflow
  // Only status_type:"debit"  + status:"successful" counts as outflow
  const inflow = useMemo(
    () => transactions
      .filter(t => t.kind === 'in' && t.status === 'completed')
      .reduce((s, t) => s + t.total, 0),
    [transactions]
  )

  const outflow = useMemo(
    () => transactions
      .filter(t => t.kind === 'out' && t.status === 'completed')
      .reduce((s, t) => s + t.total, 0),
    [transactions]
  )

  const refresh = useCallback(() => fetchRecent(), [fetchRecent])

  return { transactions, loading, error, inflow, outflow, refresh, fetchRecent }
}
