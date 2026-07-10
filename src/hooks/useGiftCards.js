import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getGiftCardBrands, submitGiftCardTrade, getRecentGiftCardTrades } from '../services/giftcards'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

export const DENOMINATIONS = [5, 10, 15, 25, 50, 100, 200, 500]

export function countryLabel(id) {
  if (!id) return '—'
  return id.length <= 3
    ? id.toUpperCase()
    : id.charAt(0).toUpperCase() + id.slice(1)
}

export function countryCode(id) {
  if (!id) return ''
  return id.slice(0, 2).toUpperCase()
}

function normalizeTrade(t) {
  const date = t.created_at ? new Date(t.created_at) : null
  const createdAt = date
    ? date.toLocaleString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
    : '—'
  let cardImages = []
  if (Array.isArray(t.card_image)) {
    cardImages = t.card_image
  } else {
    try { cardImages = t.card_image ? JSON.parse(t.card_image) : [] } catch { cardImages = [] }
  }
  let cardEcodes = []
  if (Array.isArray(t.card_ecode)) {
    cardEcodes = t.card_ecode
  } else {
    try { cardEcodes = t.card_ecode ? JSON.parse(t.card_ecode) : [] } catch { cardEcodes = t.card_ecode ? [t.card_ecode] : [] }
  }
  if (!Array.isArray(cardEcodes)) cardEcodes = cardEcodes ? [cardEcodes] : []
  return {
    id:              t.id,
    reference:       t.reference,
    brandId:         t.brand_id,
    brandName:       t.brand_name,
    subCategoryId:   t.sub_category_id,
    subCategoryName: t.sub_category_name,
    cardType:        t.card_type,
    countryId:       t.country,
    denomination:    Number(t.amount),
    currency:        t.currency,
    rate:            Number(t.rate),
    receiveAmount:   Number(t.receive_amount),
    fee:             Number(t.fee),
    finalAmount:     Number(t.final_amount),
    cardEcodes,
    cardImages,
    cardQty:         Number(t.card_qty) || 1,
    status:          t.status,
    rejectNote:      t.reject_note || null,
    createdAt,
  }
}

export default function useGiftCards({ autoRecent = true } = {}) {
  const queryClient = useQueryClient()

  const brandsQuery = useQuery({
    queryKey: queryKeys.giftcards.brands,
    queryFn: () => unwrap(getGiftCardBrands()),
    select: (data) => data.brands,
    staleTime: 5 * 60_000,
  })

  const recentQuery = useQuery({
    queryKey: queryKeys.giftcards.recent,
    queryFn: () => unwrap(getRecentGiftCardTrades()),
    select: (data) => data.trades.map(normalizeTrade),
    enabled: autoRecent,
  })

  const submitMutation = useMutation({
    mutationFn: ({ brandId, subCategoryId, denomination, cardType, codes, images }) =>
      submitGiftCardTrade({ brandId, subCategoryId, denomination, cardType, codes, images }),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.giftcards.recent })
        queryClient.invalidateQueries({ queryKey: queryKeys.wallet })
      }
    },
  })

  const submit = useCallback((payload) => submitMutation.mutateAsync(payload), [submitMutation])

  const refreshRecent = useCallback(() => recentQuery.refetch(), [recentQuery])

  const reset = useCallback(() => {
    submitMutation.reset()
  }, [submitMutation])

  const submitError = submitMutation.data && !submitMutation.data.success
    ? (submitMutation.data.message || 'Trade submission failed.')
    : null

  return {
    brands: brandsQuery.data ?? [],
    brandsLoading: brandsQuery.isLoading,

    recentTrades: recentQuery.data ?? [],
    recentLoading: recentQuery.isLoading,

    submitting: submitMutation.isPending,
    submitError,

    submit,
    refreshRecent,
    reset,
  }
}
