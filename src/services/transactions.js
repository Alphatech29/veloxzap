import { apiFetch } from '../lib/api'

export async function fetchWalletTransactionByReference(reference) {
  const result = await apiFetch(`/api/v1/users/transaction/${encodeURIComponent(reference)}`, { method: 'GET' })
  if (!result.success) {
    return { success: false, message: result.message }
  }
  return { success: true, transaction: result.data }
}

export async function fetchElectricityTransactionByReference(reference) {
  const result = await apiFetch(`/api/v1/users/transaction/electricity/${encodeURIComponent(reference)}`, { method: 'GET' })
  if (!result.success) {
    return { success: false, message: result.message }
  }
  return { success: true, transaction: result.data }
}

export async function fetchVtuTransactionByReference(reference) {
  const result = await apiFetch(`/api/v1/users/transaction/vtu/${encodeURIComponent(reference)}`, { method: 'GET' })
  if (!result.success) {
    return { success: false, message: result.message }
  }
  return { success: true, transaction: result.data }
}

export async function fetchCableTvTransactionByReference(reference) {
  const result = await apiFetch(`/api/v1/users/transaction/cabletv/${encodeURIComponent(reference)}`, { method: 'GET' })
  if (!result.success) {
    return { success: false, message: result.message }
  }
  return { success: true, transaction: result.data }
}

export async function fetchConversionByReference(reference) {
  const result = await apiFetch(`/api/v1/users/transaction/conversion/${encodeURIComponent(reference)}`, { method: 'GET' })
  if (!result.success) {
    return { success: false, message: result.message }
  }
  return { success: true, transaction: result.data }
}

export async function fetchGiftcardTradeByReference(reference) {
  const result = await apiFetch(`/api/v1/users/transaction/giftcard-trade/${encodeURIComponent(reference)}`, { method: 'GET' })
  if (!result.success) {
    return { success: false, message: result.message }
  }
  return { success: true, trade: result.data }
}

async function fetchHistoryPage({ limit = 100, offset = 0 } = {}) {
  const result = await apiFetch(`/api/v1/users/history?limit=${limit}&offset=${offset}`, { method: 'GET' })

  if (result.status === 404) return { success: true, rows: [] }

  const envelope = Array.isArray(result.payload) ? result.payload[0] : null
  const rows = envelope?.data?.transactions
    ?? result.data?.transactions
    ?? []

  return { success: true, rows }
}


const HISTORY_PAGE_SIZE = 100
const HISTORY_MAX_PAGES = 50

export async function fetchHistory() {
  const rows = []

  for (let page = 0; page < HISTORY_MAX_PAGES; page++) {
    const offset = page * HISTORY_PAGE_SIZE
    const result = await fetchHistoryPage({ limit: HISTORY_PAGE_SIZE, offset })

    if (!result.success) {
      return page === 0 ? result : { success: true, rows }
    }

    rows.push(...result.rows)

    if (result.rows.length < HISTORY_PAGE_SIZE) break
  }

  return { success: true, rows }
}
