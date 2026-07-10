import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { sendEmailVerificationLink, verifyEmailLink } from '../services/emailVerification'

export default function useEmailVerification() {
  const sendMutation = useMutation({
    mutationFn: () => sendEmailVerificationLink(),
  })

  const verifyMutation = useMutation({
    mutationFn: (payload) => verifyEmailLink(payload),
  })

  const sendLink = useCallback(() => sendMutation.mutateAsync(), [sendMutation])
  const verify = useCallback((payload) => verifyMutation.mutateAsync(payload), [verifyMutation])

  const sendError = sendMutation.data && !sendMutation.data.success
    ? (sendMutation.data.message || 'Something went wrong. Please try again.')
    : null

  const verifyError = verifyMutation.isError
    ? (verifyMutation.error?.message || 'Something went wrong. Please try again.')
    : verifyMutation.data && !verifyMutation.data.success
      ? (verifyMutation.data.message || 'Something went wrong. Please try again.')
      : null

  return {
    sendLink,
    sending: sendMutation.isPending,
    sendError,
    resetSend: sendMutation.reset,

    verify,
    verifying: verifyMutation.isPending,
    verifyError,
  }
}
