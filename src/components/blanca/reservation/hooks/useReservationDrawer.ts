// PERAN FILE: Custom Hook Logic untuk Pengelolaan State & Validasi Side Panel Calon Penyewa
import { useState, useMemo } from 'react'
import type { CustomerInfo } from '../types'

const INITIAL_STATE: CustomerInfo = {
  nama: '',
  whatsapp: '',
  email: '',
  isConfirmed: false,
}

export function useReservationDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    try {
      const raw =
        localStorage.getItem('blanca_customer_info') ||
        sessionStorage.getItem('blanca_customer_info')
      if (raw) {
        const parsed = JSON.parse(raw)
        return {
          nama: parsed.nama || '',
          whatsapp: parsed.whatsapp || '',
          email: parsed.email || '',
          isConfirmed: Boolean(parsed.isConfirmed),
        }
      }
    } catch (e) {
      console.error('Gagal membaca customer info tersimpan:', e)
    }
    return INITIAL_STATE
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const openDrawer = () => {
    // Re-check localStorage saat drawer dibuka jika data sebelumnya belum dimuat
    try {
      const raw =
        localStorage.getItem('blanca_customer_info') ||
        sessionStorage.getItem('blanca_customer_info')
      if (raw) {
        const parsed = JSON.parse(raw)
        setCustomerInfo((prev) => ({
          nama: prev.nama || parsed.nama || '',
          whatsapp: prev.whatsapp || parsed.whatsapp || '',
          email: prev.email || parsed.email || '',
          isConfirmed: prev.isConfirmed || Boolean(parsed.isConfirmed),
        }))
      }
    } catch (e) {
      console.error('Gagal sinkronisasi data drawer:', e)
    }
    setIsOpen(true)
  }
  const closeDrawer = () => setIsOpen(false)

  const updateField = <K extends keyof CustomerInfo>(key: K, value: CustomerInfo[K]) => {
    setCustomerInfo((prev) => ({ ...prev, [key]: value }))
  }

  // Validasi lokal form: semua field wajib terisi dan checkbox dicentang
  const isFormValid = useMemo(() => {
    const isNamaValid = customerInfo.nama.trim().length >= 3
    // Strict 08: harus diawali 08 dengan total 10 sampai 13 digit angka
    const isWaValid = /^08[0-9]{8,11}$/.test(customerInfo.whatsapp.trim())
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email.trim())
    return isNamaValid && isWaValid && isEmailValid && customerInfo.isConfirmed
  }, [customerInfo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    setIsSubmitted(true)
    // Simpan data calon penyewa ke localStorage & sessionStorage agar persisten meski tab ditutup
    try {
      localStorage.setItem('blanca_customer_info', JSON.stringify(customerInfo))
      sessionStorage.setItem('blanca_customer_info', JSON.stringify(customerInfo))
    } catch (err) {
      console.error('Gagal menyimpan customer info:', err)
    }
    // Arahkan calon penyewa ke rute /reservasi
    window.location.href = '/reservasi'
  }

  const resetForm = () => {
    setCustomerInfo(INITIAL_STATE)
    setIsSubmitted(false)
  }

  return {
    isOpen,
    openDrawer,
    closeDrawer,
    customerInfo,
    updateField,
    isFormValid,
    isSubmitted,
    handleSubmit,
    resetForm,
  }
}
