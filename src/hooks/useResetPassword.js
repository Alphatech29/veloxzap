import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { resetPassword } from '../services/resetPassword'

export default function useResetPassword() {
  const submitMutation = useMutation({
    mutationFn: (payload) => resetPassword(payload),
  })

  const submit = useCallback((payload) => submitMutation.mutateAsync(payload), [submitMutation])

  const submitError = submitMutation.data && !submitMutation.data.success
    ? (submitMutation.data.message || 'Something went wrong. Please try again.')
    : null

  return {
    submit,
    submitting: submitMutation.isPending,
    submitError,
    reset: submitMutation.reset,
  }
}
