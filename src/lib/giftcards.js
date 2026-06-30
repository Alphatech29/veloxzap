import { apiFetch } from './api'

export async function getGiftCardBrands() {
  const result = await apiFetch('/api/v1/users/giftcard-brands', { method: 'GET' })
  if (!result.success) return { success: false, brands: [], message: result.message }
  return { success: true, brands: result.data ?? [] }
}

export async function getPublicGiftCardBrands() {
  const result = await apiFetch('/api/v1/general/giftcard-brands', { method: 'GET' })
  if (!result.success) return { success: false, brands: [], message: result.message }
  return { success: true, brands: result.data ?? [] }
}

export async function submitGiftCardTrade({ brandId, subCategoryId, denomination, cardType, codes, images }) {
  let body
  if (cardType === 'physical') {
    body = new FormData()
    body.append('brand_id', String(brandId))
    body.append('sub_category_id', String(subCategoryId))
    body.append('amount', String(denomination))
    body.append('mode', 'physical')
    images?.forEach(img => { if (img) body.append('image', img) })
  } else {
    body = {
      brand_id:        brandId,
      sub_category_id: subCategoryId,
      amount:          denomination,
      mode:            'ecode',
      code:            codes?.[0] ?? '',
    }
  }
  const result = await apiFetch('/api/v1/users/trade-card', { method: 'POST', body })
  if (!result.success) return { success: false, message: result.message }
  return { success: true, message: result.message, data: result.data }
}

export async function getRecentGiftCardTrades() {
  const result = await apiFetch('/api/v1/users/giftcard-trades', { method: 'GET' })
  if (!result.success) return { success: false, trades: [] }
  return { success: true, trades: result.data?.trades ?? [] }
}
