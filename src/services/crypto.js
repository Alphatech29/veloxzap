import { apiFetch } from '../lib/api'

export async function getCryptoBalances() {
  const result = await apiFetch('/api/v1/users/crypto/balances', { method: 'GET' })
  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Could not load your crypto balances.',
      code: result.code,
      status: result.status,
    }
  }
  return {
    success: true,
    balances: result.data ?? { btc_balance: 0, usdt_trc20_balance: 0, usdc_sol_balance: 0 },
    message: result.message,
  }
}

export async function getCryptoAddresses() {
  const result = await apiFetch('/api/v1/users/crypto/addresses', { method: 'GET' })
  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Could not load your deposit addresses.',
      code: result.code,
      status: result.status,
    }
  }
  return { success: true, addresses: result.data ?? [], message: result.message }
}

export async function getCryptoConfig() {
  const result = await apiFetch('/api/v1/users/crypto/config', { method: 'GET' })
  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Could not load crypto deposit settings.',
      code: result.code,
      status: result.status,
    }
  }
  return { success: true, config: result.data ?? null, message: result.message }
}

export async function getCryptoDepositHistory({ chain, status, page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams()
  if (chain) params.set('chain', chain)
  if (status) params.set('status', status)
  params.set('page', page)
  params.set('pageSize', pageSize)

  const result = await apiFetch(`/api/v1/users/crypto/deposits?${params}`, { method: 'GET' })
  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Could not load your deposit history.',
      code: result.code,
      status: result.status,
    }
  }
  return { success: true, deposits: result.data ?? [], message: result.message }
}
