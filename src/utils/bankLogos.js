import bankList from './bankList'

const NIGERIANBANKS = 'https://nigerianbanks.xyz'

function normalize(name) {
  return (name || '')
    .toLowerCase()
    .replace(/\b(plc|limited|ltd|bank|mfb|microfinance|ng|nigeria|nigerian)\b/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

// Pre-seed from static bankList (instant, no network)
const codeToLogo = new Map(bankList.filter(b => b.logo).map(b => [String(b.code), b.logo]))
const nameToLogo = new Map(bankList.filter(b => b.logo).map(b => [normalize(b.name), b.logo]))

let fetchPromise = null

function loadRemote() {
  if (fetchPromise) return fetchPromise
  fetchPromise = fetch(`${NIGERIANBANKS}/`)
    .then(r => r.json())
    .then(data => {
      if (!Array.isArray(data)) return
      data.forEach(b => {
        if (!b.logo || b.logo.includes('default-image')) return
        const code = String(b.code ?? '')
        if (code && !codeToLogo.has(code)) codeToLogo.set(code, b.logo)
        if (b.name) {
          const key = normalize(b.name)
          if (!nameToLogo.has(key)) nameToLogo.set(key, b.logo)
        }
      })
    })
    .catch(() => {})
    .finally(() => { fetchPromise = null })
  return fetchPromise
}

export function preloadBankLogos() {
  loadRemote()
}

export function buildCodeMap(flutterwaveBanks) {
  flutterwaveBanks.forEach(b => {
    const fwCode = String(b.code)
    if (!codeToLogo.has(fwCode)) {
      const logo = nameToLogo.get(normalize(b.name))
      if (logo) codeToLogo.set(fwCode, logo)
    }
  })
}

export function getBankLogoByCode(code) {
  return codeToLogo.get(String(code ?? '')) ?? null
}

export async function getBankLogoByCodeAsync(code, bankName) {
  await loadRemote()
  return (
    codeToLogo.get(String(code ?? '')) ??
    nameToLogo.get(normalize(bankName)) ??
    null
  )
}
