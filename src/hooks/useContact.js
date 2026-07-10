import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { submitContactMessage } from '../services/contact'

export default function useContact() {
  const submitMutation = useMutation({
    mutationFn: (payload) => submitContactMessage(payload),
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
