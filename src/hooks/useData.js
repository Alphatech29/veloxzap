import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { getDataVariations, purchaseData, getRecentDataNumbers } from '../services/data'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

function parseVariation(v) {
  const name = v.name || ''

  // Volume + bonus detection — two patterns:
  // 1. TOTAL (... NIGHT_VOL Night ...) e.g. "11GB (7GB+ 4GB Night)"  → outer vol is primary
  const parenNightMatch = name.match(
    /(\d+(?:\.\d+)?)\s*(MB|GB|TB)[^(]*\([^)]*?(\d+(?:\.\d+)?)\s*(MB|GB|TB)\s*[Nn]ight/i
  )
  // 2. PRIMARY + BONUS [Night] at top level e.g. "1.9GB + 2GB Night" (strip parens first)
  const nameNoParens = name.replace(/\([^)]*\)/g, '')
  const topBonusMatch = nameNoParens.match(
    /(\d+(?:\.\d+)?)\s*(MB|GB|TB)\s*\+\s*(\d+(?:\.\d+)?)\s*(MB|GB|TB)(\s*Night)?/i
  )

  let volMatch, bonus
  if (parenNightMatch) {
    volMatch = [null, parenNightMatch[1], parenNightMatch[2]]
    bonus = `+${parenNightMatch[3]}${parenNightMatch[4].toUpperCase()} Night`
  } else if (topBonusMatch) {
    volMatch = [null, topBonusMatch[1], topBonusMatch[2]]
    bonus = `+${topBonusMatch[3]}${topBonusMatch[4].toUpperCase()}${topBonusMatch[5] ? ' Night' : ''}`
  } else {
    volMatch = name.match(/(\d+(?:\.\d+)?)\s*(MB|GB|TB)/i)
    bonus = null
  }

  // Device-type overrides (check before validity)
  const isMifi      = /mi[-\s]?fi/i.test(name)
  const isRouter    = /router|mbb|mbps/i.test(name)
  const isUnlimited = /unlimited/i.test(name)

  // Validity patterns
  const hrMatch    = name.match(/(\d+)\s*(?:hrs?|hours?)/i)
  const dayMatch   = name.match(/[-–]\s*(\d+)\s*days?/i) || name.match(/\b(\d+)\s*days?\b/i)
  const monthMatch = name.match(/\((\d+)[- ]?months?\)/i) || name.match(/(\d+)[- ]?months?\s+plan/i)
  const yearMatch  = name.match(/\((\d+)\s*years?\)/i)
  const hasWeekly  = /weekly/i.test(name)
  const hasMonthly = /monthly/i.test(name)

  let validity = '—'
  let type = 'other'

  if (isMifi) {
    type = 'mifi'
    // still parse validity below for display
  } else if (isRouter) {
    type = 'router'
  } else if (isUnlimited) {
    type = 'unlimited'
  }

  if (hrMatch) {
    validity = `${hrMatch[1]} hrs`
    if (type === 'other') type = 'daily'
  } else if (dayMatch) {
    const days = parseInt(dayMatch[1])
    validity = days === 1 ? '1 day' : `${days} days`
    if (type === 'other') type = days <= 3 ? 'daily' : days <= 14 ? 'weekly' : 'monthly'
  } else if (monthMatch) {
    const m = parseInt(monthMatch[1])
    validity = m === 1 ? '1 month' : `${m} months`
    if (type === 'other') type = m === 1 ? 'monthly' : m === 2 ? '2months' : '3months'
  } else if (yearMatch) {
    const y = parseInt(yearMatch[1])
    validity = y === 1 ? '1 year' : `${y} years`
    if (type === 'other') type = '3months'
  } else if (hasWeekly) {
    validity = 'Weekly'
    if (type === 'other') type = 'weekly'
  } else if (hasMonthly) {
    validity = 'Monthly'
    if (type === 'other') type = 'monthly'
  }

  // Fallback: derive validity/type from variation code when name gives nothing
  if (validity === '—') {
    const code = v.code || ''
    if (/\bdaily\b/i.test(code)) {
      validity = '1 day';   if (type === 'other') type = 'daily'
    } else if (/\b2days?\b/i.test(code)) {
      validity = '2 days';  if (type === 'other') type = 'daily'
    } else if (/\b2weeks?\b/i.test(code)) {
      validity = '14 days'; if (type === 'other') type = 'weekly'
    } else if (/\bweekend\b/i.test(code)) {
      validity = 'Weekend'; if (type === 'other') type = 'weekly'
    } else if (/\bweekly\b/i.test(code)) {
      validity = '7 days';  if (type === 'other') type = 'weekly'
    } else if (/\bmonthly\b|\bmega\b|\bspecial\b/i.test(code)) {
      validity = '30 days'; if (type === 'other') type = 'monthly'
    }
  }

  const price  = Math.round(v.amount)
  const amount = v.amount

  const volume = `${volMatch[1]} ${volMatch[2].toUpperCase()}`

  // Hot = common daily/weekly/monthly plans in the ₦200–₦5000 range
  const hot = price >= 200 && price <= 5000 && ['daily', 'weekly', 'monthly'].includes(type)

  return { id: v.code, variationCode: v.code, type, hot, volume, bonus, validity, price, amount, name: v.name, tag: null }
}

function parseVariationList(rawList) {
  const seen = new Set()
  return rawList
    .filter(v => {
      if (seen.has(v.code)) return false
      seen.add(v.code)
      return /\d+(?:\.\d+)?\s*(?:MB|GB|TB)/i.test(v.name)
    })
    .map(parseVariation)
}

function mutationError(mutation, fallback) {
  return mutation.data && !mutation.data.success
    ? (mutation.data.message || fallback)
    : null
}

export const CASHBACK_RATE = 0.00

export const TYPE_TABS = [
  { id: 'hot',       label: 'Hot' },
  { id: 'daily',     label: 'Daily' },
  { id: 'weekly',    label: 'Weekly' },
  { id: 'monthly',   label: 'Monthly' },
  { id: '2months',   label: '2 Months' },
  { id: '3months',   label: '3 Months+' },
  { id: 'mifi',      label: 'MiFi' },
  { id: 'router',    label: 'Routers' },
  { id: 'unlimited', label: 'Unlimited' },
  { id: 'other',     label: 'Other' },
]

export default function useData({ autoRecent = true } = {}) {
  const queryClient = useQueryClient()

  const [tab, setTab] = useState('hot')
  const [activeNetwork, setActiveNetwork] = useState(null)

  // every network whose plans have been requested at least once
  const [requestedNetworks, setRequestedNetworks] = useState([])

  const recentQuery = useQuery({
    queryKey: queryKeys.data.recent,
    queryFn: () => unwrap(getRecentDataNumbers()),
    select: (data) => data.numbers,
    enabled: autoRecent,
  })

  const variationQueries = useQueries({
    queries: requestedNetworks.map((network) => ({
      queryKey: queryKeys.data.variations(network),
      queryFn: () => unwrap(getDataVariations(network)),
      select: (data) => parseVariationList(data.data),
      staleTime: 30 * 60_000,
    })),
  })

  // variations cache: { mtn: [...], airtel: [...], ... }
  const variations = useMemo(() => {
    const map = {}
    requestedNetworks.forEach((network, i) => {
      if (variationQueries[i]?.data) map[network] = variationQueries[i].data
    })
    return map
  }, [requestedNetworks, variationQueries])

  const activeIndex = requestedNetworks.indexOf(activeNetwork)
  const activeVariationsQuery = activeIndex !== -1 ? variationQueries[activeIndex] : null

  const fetchVariations = useCallback((network) => {
    if (!network) return
    setActiveNetwork(network)
    setRequestedNetworks(prev => prev.includes(network) ? prev : [...prev, network])
  }, [])

  const buyMutation = useMutation({
    mutationFn: (payload) => purchaseData(payload),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.data.recent })
        queryClient.invalidateQueries({ queryKey: queryKeys.wallet })
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.recent })
      }
    },
  })

  const buy = useCallback((payload) => buyMutation.mutateAsync(payload), [buyMutation])

  const reset = useCallback(() => {
    buyMutation.reset()
  }, [buyMutation])

  return {
    recentNumbers: recentQuery.data ?? [],
    recentLoading: recentQuery.isLoading,

    variations,
    variationsLoading: !!activeVariationsQuery?.isLoading,
    variationsError: activeVariationsQuery?.isError ? 'Failed to load plans.' : null,

    buying: buyMutation.isPending,
    buyError: mutationError(buyMutation, 'Data purchase failed.'),

    tab,
    setTab,

    fetchVariations,
    buy,
    refreshRecent: recentQuery.refetch,
    reset,
  }
}
