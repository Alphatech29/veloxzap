export const FLAG_MAP = { NGN: 'ng', USD: 'us' }

export function flagCode(currency) {
  return FLAG_MAP[currency?.toUpperCase()] ?? 'un'
}

// Backend stores from_currency/to_currency as the raw sign (₦ / $), not a code
export function currencyCode(sign) {
  return sign === '₦' ? 'NGN' : sign === '$' ? 'USD' : sign
}
