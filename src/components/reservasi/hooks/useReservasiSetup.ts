// PERAN FILE: Custom Hook Logic untuk membaca data sesi awal di route /reservasi
import { useState, useEffect } from 'react'
import type { StoredCustomerInfo } from '../types'

export function useReservasiSetup() {
  const [customer, setCustomer] = useState<StoredCustomerInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('blanca_customer_info')
      if (raw) {
        setCustomer(JSON.parse(raw))
      }
    } catch (e) {
      console.error('Gagal membaca data calon penyewa:', e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleBackToHome = () => {
    window.location.href = '/blanca.html'
  }

  return {
    customer,
    isLoading,
    handleBackToHome,
  }
}
