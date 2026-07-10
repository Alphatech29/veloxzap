import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import useCountryPicker from './useCountryPicker'
import { register } from '../services/register'

const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_HINT  = '8+ characters with letters & numbers'

function scorePassword(pw) {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8)          s++
  if (pw.length >= 12)         s++
  if (/[A-Z]/.test(pw))        s++
  if (/[0-9]/.test(pw))        s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return Math.min(s, 4)
}

export default function useRegister({ redirectTo = '/auth/login' } = {}) {
  const navigate = useNavigate()
  const countryPicker = useCountryPicker()

  const [first,    setFirst]    = useState('')
  const [last,     setLast]     = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [password, setPassword] = useState('')
  const [referral, setReferral] = useState('')
  const [show,     setShow]     = useState(false)
  const [agree,    setAgree]    = useState(false)
  const [error,    setError]    = useState('')

  const registerMutation = useMutation({
    mutationFn: (payload) => register(payload),
  })

  const score = useMemo(() => scorePassword(password), [password])
  const strengthHint = password ? STRENGTH_LABEL[score] : STRENGTH_HINT

  function toggleShow()         { setShow(s => !s) }
  function onPhoneChange(e)     { setPhone(e.target.value.replace(/[^\d ]/g, '')) }
  function onReferralChange(e)  { setReferral(e.target.value.toUpperCase()) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!first || !last || !email || !phone || !password) {
      setError('Please complete all required fields.'); return
    }
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {
      setError('Password must be 8+ chars with uppercase, lowercase, number and a special character (@ $ ! % * ? &).'); return
    }
    if (!agree) {
      setError('Please accept the Terms and Privacy Policy to continue.'); return
    }

    const fullName = `${first.trim()} ${last.trim()}`.trim()
    const nationalDigits = phone.replace(/\D/g, '').replace(/^0+/, '')
    const e164Phone = `${countryPicker.country.dial}${nationalDigits}`

    const result = await registerMutation.mutateAsync({
      fullName,
      email:    email.trim(),
      country:  countryPicker.country.name,
      phone:    e164Phone,
      password,
      referral: referral.trim() || undefined,
    })

    if (!result.success) {
      setError(result.message)
      return
    }
    navigate(redirectTo)
  }

  return {
    first, setFirst,
    last,  setLast,
    email, setEmail,
    phone, setPhone, onPhoneChange,
    password, setPassword,
    referral, setReferral, onReferralChange,

    show, toggleShow,
    agree, setAgree,

    score, strengthHint,

    loading: registerMutation.isPending, error,
    handleSubmit,

    countryPicker,
  }
}
