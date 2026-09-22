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
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(INITIAL_STATE)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const openDrawer = () => setIsOpen(true)
  const closeDrawer = () => setIsOpen(false)

  const updateField = <K extends keyof CustomerInfo>(key: K, value: CustomerInfo[K]) => {
    setCustomerInfo((prev) => ({ ...prev, [key]: value }))
  }

  // Validasi lokal form: semua field wajib terisi dan checkbox dicentang
  const isFormValid = useMemo(() => {
    const isNamaValid = customerInfo.nama.trim().length >= 3
    const isWaValid = customerInfo.whatsapp.trim().length >= 10
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email.trim())
    return isNamaValid && isWaValid && isEmailValid && customerInfo.isConfirmed
  }, [customerInfo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    setIsSubmitted(true)
    // Mode UI murni: simpan di state lokal tanpa kirim ke BE
    console.log('Data Calon Penyewa Terverifikasi:', customerInfo)
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
