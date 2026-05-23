import { useCallback, useEffect, useState } from 'react'
import { fetchBeneficiaries } from '../lib/beneficiaries'

export default function useBeneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [loading, setLoading]             = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const result = await fetchBeneficiaries()
    setLoading(false)
    if (result.success) setBeneficiaries(result.beneficiaries)
  }, [])

  useEffect(() => { load() }, [load])

  // Optimistically prepend / update a beneficiary after a successful transfer
  const addOrUpdate = useCallback(({ account_name, account_number, bank_name, bank_code }) => {
    setBeneficiaries(prev => {
      const exists = prev.findIndex(b => b.account_number === account_number && b.bank_code === bank_code)
      const entry = { account_name, account_number, bank_name, bank_code, last_used_at: new Date().toISOString() }
      if (exists !== -1) {
        const updated = [...prev]
        updated.splice(exists, 1)
        return [entry, ...updated]
      }
      return [entry, ...prev].slice(0, 20)
    })
  }, [])

  return { beneficiaries, loading, reload: load, addOrUpdate }
}
