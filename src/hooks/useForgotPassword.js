import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { forgotPassword } from '../lib/forgotPassword'

export default function useForgotPassword() {
  const submitMutation = useMutation({
    mutationFn: (payload) => forgotPassword(payload),
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
