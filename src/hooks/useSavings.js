import { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getSavingsProducts,
  openSavingsAccount,
  getSavingsPlans,
  getSavingsAccount,
  getSavingsLedger,
  getUserSavingsLedger,
  topUpAccount,
  withdrawAccount,
  setScheduleStatus,
  updateSchedule as updateScheduleApi,
  createSchedule as createScheduleApi,
  getSavingsWithdrawals,
} from '../services/savings'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

function parseTiers(raw) {
  if (!raw) return null
  if (typeof raw === 'string') return JSON.parse(raw)
  return raw
}

function mapProduct(p) {
  const tiers = parseTiers(p.lock_duration_tiers)
  return {
    id:                     p.id,
    name:                   p.name,
    description:            p.description,
    annualRate:             Number(p.apy),
    type:                   p.type,
    lockDurationTiers:      tiers,
    minDeposit:             Number(p.min_deposit || 0),
    maxDeposit:             p.max_deposit ? Number(p.max_deposit) : null,
    compoundingFrequency:   p.compounding_frequency,
    earlyWithdrawalPenalty: Number(p.early_withdrawal_penalty),
    status:                 p.status,
    createdAt:              p.created_at,
    updatedAt:              p.updated_at,
  }
}

function mutationError(mutation, fallback) {
  return mutation.data && !mutation.data.success
    ? (mutation.data.message || fallback)
    : null
}

/* Combined products + accounts overview, used by the Saving page */
export function useSavingsOverview() {
  const queryClient = useQueryClient()

  const productsQuery = useQuery({
    queryKey: queryKeys.savings.products('All'),
    queryFn: () => unwrap(getSavingsProducts('All')),
    select: (data) => data.products.map(mapProduct),
  })

  const accountsQuery = useQuery({
    queryKey: queryKeys.savings.plans,
    queryFn: () => unwrap(getSavingsPlans()),
    select: (data) => data.accounts,
  })

  const createMutation = useMutation({
    mutationFn: (payload) => openSavingsAccount(payload),
    onSuccess: (r) => {
      if (r.success) queryClient.invalidateQueries({ queryKey: queryKeys.savings.plans })
    },
  })

  const withdrawMutation = useMutation({
    mutationFn: (accountId) => withdrawAccount(accountId),
    onSuccess: (r) => {
      if (r.success) queryClient.invalidateQueries({ queryKey: queryKeys.savings.plans })
    },
  })

  const create = useCallback((payload) => createMutation.mutateAsync(payload), [createMutation])
  const withdraw = useCallback((accountId) => withdrawMutation.mutateAsync(accountId), [withdrawMutation])
  const resetCreate = useCallback(() => createMutation.reset(), [createMutation])

  const accounts = accountsQuery.data ?? []
  const totalInvested = accounts.reduce((s, a) => s + Number(a.principal || 0), 0)
  const totalEarnings = accounts.reduce((s, a) => s + Number(a.total_interest_earned || 0), 0)
  const activeCount   = accounts.filter(a => a.status === 'active').length

  return {
    plans: productsQuery.data ?? [], plansLoading: productsQuery.isLoading,
    investments: accounts, investmentsLoading: accountsQuery.isLoading,
    totalInvested, totalEarnings, activeCount,
    creating: createMutation.isPending, createError: mutationError(createMutation, 'Failed to create account.'), withdrawing: withdrawMutation.isPending,
    create, withdraw, resetCreate,
    refresh: accountsQuery.refetch,
  }
}

export function useSavingsProducts(initialType = 'All') {
  const [type, setType] = useState(initialType)

  const query = useQuery({
    queryKey: queryKeys.savings.products(type),
    queryFn: () => unwrap(getSavingsProducts(type)),
    select: (data) => data.products,
  })

  return { products: query.data ?? [], loading: query.isLoading, type, setType, refresh: query.refetch }
}

export function useSavingsPlans() {
  const queryClient = useQueryClient()

  const accountsQuery = useQuery({
    queryKey: queryKeys.savings.plans,
    queryFn: () => unwrap(getSavingsPlans()),
    select: (data) => data.accounts,
  })

  const openMutation = useMutation({
    mutationFn: (payload) => openSavingsAccount(payload),
    onSuccess: (r) => {
      if (r.success) queryClient.invalidateQueries({ queryKey: queryKeys.savings.plans })
    },
  })

  const openAccount = useCallback((payload) => openMutation.mutateAsync(payload), [openMutation])

  const accounts = accountsQuery.data ?? []
  const totalSaved = accounts.reduce((s, a) => s + Number(a.principal || 0), 0)
  const totalInterest = accounts.reduce((s, a) => s + Number(a.total_interest_earned || 0), 0)
  const activeCount = accounts.filter(a => a.status === 'active').length

  return {
    accounts, loading: accountsQuery.isLoading, totalSaved, totalInterest, activeCount,
    opening: openMutation.isPending, openError: mutationError(openMutation, 'Failed to open account'), openAccount,
    refresh: accountsQuery.refetch,
  }
}

export function useSavingsAccount(id) {
  const queryClient = useQueryClient()

  const accountQuery = useQuery({
    queryKey: queryKeys.savings.account(id),
    queryFn: () => unwrap(getSavingsAccount(id)),
    select: (data) => data.account,
    enabled: !!id,
  })

  const ledgerQuery = useQuery({
    queryKey: queryKeys.savings.ledger(id),
    queryFn: () => unwrap(getSavingsLedger(id)),
    select: (data) => data.entries,
    enabled: !!id,
  })

  const invalidateAccount = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.savings.account(id) })
  }, [queryClient, id])

  const invalidateAccountAndLedger = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.savings.account(id) })
    queryClient.invalidateQueries({ queryKey: queryKeys.savings.ledger(id) })
  }, [queryClient, id])

  const topUpMutation = useMutation({
    mutationFn: (amount) => topUpAccount(id, amount),
    onSuccess: (r) => { if (r.success) invalidateAccountAndLedger() },
  })

  const withdrawMutation = useMutation({
    mutationFn: (amount_requested) => withdrawAccount(id, amount_requested),
    onSuccess: (r) => { if (r.success) invalidateAccountAndLedger() },
  })

  const pauseMutation = useMutation({
    mutationFn: () => setScheduleStatus(id, 'pause'),
    onSuccess: (r) => { if (r.success) invalidateAccount() },
  })

  const resumeMutation = useMutation({
    mutationFn: () => setScheduleStatus(id, 'resume'),
    onSuccess: (r) => { if (r.success) invalidateAccount() },
  })

  const updateScheduleMutation = useMutation({
    mutationFn: (payload) => updateScheduleApi(id, payload),
    onSuccess: (r) => { if (r.success) invalidateAccount() },
  })

  const createScheduleMutation = useMutation({
    mutationFn: (payload) => createScheduleApi(id, payload),
    onSuccess: (r) => { if (r.success) invalidateAccount() },
  })

  return {
    account: accountQuery.data ?? null, loading: accountQuery.isLoading,
    ledger: ledgerQuery.data ?? [], ledgerLoading: ledgerQuery.isLoading,
    toppingUp: topUpMutation.isPending,
    withdrawing: withdrawMutation.isPending,
    scheduling: pauseMutation.isPending || resumeMutation.isPending || updateScheduleMutation.isPending || createScheduleMutation.isPending,
    topUp: useCallback((amount) => topUpMutation.mutateAsync(amount), [topUpMutation]),
    withdraw: useCallback((amount_requested) => withdrawMutation.mutateAsync(amount_requested), [withdrawMutation]),
    pauseSchedule: useCallback(() => pauseMutation.mutateAsync(), [pauseMutation]),
    resumeSchedule: useCallback(() => resumeMutation.mutateAsync(), [resumeMutation]),
    updateSchedule: useCallback((payload) => updateScheduleMutation.mutateAsync(payload), [updateScheduleMutation]),
    createSchedule: useCallback((payload) => createScheduleMutation.mutateAsync(payload), [createScheduleMutation]),
    refresh: accountQuery.refetch,
    refreshLedger: ledgerQuery.refetch,
  }
}

export function useSavingsLedger(type) {
  const query = useQuery({
    queryKey: queryKeys.savings.userLedger(type),
    queryFn: () => unwrap(getUserSavingsLedger(type)),
    select: (data) => data.entries,
  })

  return { ledger: query.data ?? [], loading: query.isLoading, refresh: query.refetch }
}

export function useSavingsWithdrawals(initialStatus = 'All') {
  const [status, setStatus] = useState(initialStatus)

  const query = useQuery({
    queryKey: queryKeys.savings.withdrawals(status),
    queryFn: () => unwrap(getSavingsWithdrawals(status !== 'All' ? { status: status.toLowerCase() } : {})),
  })

  return {
    withdrawals: query.data?.withdrawals ?? [],
    loading: query.isLoading,
    total: query.data?.total ?? 0,
    status, setStatus,
    refresh: query.refetch,
  }
}

export function useSavingsPlanLedger(planId) {
  const query = useQuery({
    queryKey: queryKeys.savings.ledger(planId),
    queryFn: () => unwrap(getSavingsLedger(planId)),
    select: (data) => data.entries,
    enabled: !!planId,
  })
  return { ledger: query.data ?? [], loading: query.isLoading }
}
