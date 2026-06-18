const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not set. Add it to your .env file.')
}

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
const AUTH_PATH_PREFIX = '/api/v1/auth'

let csrfToken = null
let csrfPromise = null
let refreshPromise = null
let onSessionExpired = null

export function setOnSessionExpired(cb) {
  onSessionExpired = typeof cb === 'function' ? cb : null
}

function postRefreshToken(token) {
  return fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': token,
    },
  })
}

async function refreshSession() {
  if (refreshPromise) return refreshPromise
  refreshPromise = (async () => {
    try {
      let res = await postRefreshToken(await getCsrfToken())
      if (res.status === 403) {
        // cached CSRF token is stale (rotated by a prior mutating request) — refetch and retry
        res = await postRefreshToken(await getCsrfToken({ force: true }))
      }
      return res.ok
    } catch {
      return false
    }
  })().finally(() => { refreshPromise = null })
  return refreshPromise
}

async function fetchCsrfToken() {
  const res = await fetch(`${API_BASE_URL}/api/v1/csrf-token`, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`CSRF token fetch failed: HTTP ${res.status}`)
  const data = await res.json()
  if (!data?.csrfToken) throw new Error('CSRF token missing from response')
  return data.csrfToken
}

async function getCsrfToken({ force = false } = {}) {
  if (!force && csrfToken) return csrfToken
  if (!csrfPromise) {
    csrfPromise = fetchCsrfToken()
      .then(t => { csrfToken = t; return t })
      .finally(() => { csrfPromise = null })
  }
  return csrfPromise
}

function buildUrl(path) {
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

async function doFetch(path, init) {
  const url = buildUrl(path)
  const method = (init.method || 'GET').toUpperCase()
  const needsCsrf = MUTATING.has(method)

  const headers = {
    Accept: 'application/json',
    ...(init.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...init.headers,
  }

  if (needsCsrf) {
    headers['X-Requested-With'] = 'XMLHttpRequest'
    headers['X-CSRF-Token'] = await getCsrfToken()
  }

  return fetch(url, {
    ...init,
    method,
    credentials: 'include',
    headers,
  })
}

export async function apiFetch(path, options = {}) {
  const init = { ...options }
  if (init.body && typeof init.body !== 'string' && !(init.body instanceof FormData)) {
    init.body = JSON.stringify(init.body)
  }

  let response
  try {
    response = await doFetch(path, init)
  } catch {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
      code: 'NETWORK_ERROR',
    }
  }

  if (response.status === 403) {
    let body = null
    try { body = await response.clone().json() } catch { body = null }
    if (body?.message === 'Invalid CSRF token') {
      await getCsrfToken({ force: true })
      try {
        response = await doFetch(path, init)
      } catch {
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.',
          code: 'NETWORK_ERROR',
        }
      }
    }
  }

  if (response.status === 401 && !path.startsWith(AUTH_PATH_PREFIX)) {
    const refreshed = await refreshSession()
    if (refreshed) {
      try {
        response = await doFetch(path, init)
      } catch {
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.',
          code: 'NETWORK_ERROR',
        }
      }
    } else {
      onSessionExpired?.()
      return {
        success: false,
        message: 'Your session has expired. Please sign in again.',
        code: 'SESSION_EXPIRED',
        status: 401,
      }
    }
  }

  let payload = null
  try { payload = await response.json() } catch { payload = null }

  if (!response.ok || !payload?.success) {
    const errField = payload?.error
    let message = (typeof errField === 'string' ? errField : errField?.detail || errField?.message || null) || payload?.message || 'Request failed. Please try again.'
    if (message === 'Invalid CSRF token') {
      message = 'Something went wrong. Please refresh the page and try again.'
    }
    return {
      success: false,
      message,
      code: typeof errField === 'object' ? errField?.code : payload?.code,
      status: response.status,
      payload,
    }
  }

  return {
    success: true,
    message: payload.message,
    data: payload.data ?? null,
    payload,
  }
}
