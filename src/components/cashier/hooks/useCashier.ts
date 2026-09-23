// PERAN FILE: Custom Hook Logic untuk Mengelola State, Database, Realtime, dan Server-side Search Kasir
import { useState, useEffect, useCallback } from 'react'
import { searchBookings, getLapangan, updateStatusBooking, subscribeToBookings } from '../../../lib/api'
import type { Booking, Lapangan } from '../../../types/database'

export function useCashier() {
  const [daftarBooking, setDaftarBooking] = useState<Booking[]>([])
  const [courts, setCourts] = useState<Lapangan[]>([])
  const [loading, setLoading] = useState(false)

  // State Kontrol Pencarian & Filter
  const [searchKeyword, setSearchKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua')

  // State Modal Dialog
  const [isManualModalOpen, setIsManualModalOpen] = useState(false)
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false)

  // 1. Debounce 300ms untuk input search agar tidak membebani database setiap keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchKeyword])

  // 2. Server-side Query ke Supabase via Single JOIN Query (Bebas N+1)
  const loadDataKasir = useCallback(async () => {
    setLoading(true)
    try {
      const [bookingsData, courtsData] = await Promise.all([
        searchBookings(debouncedKeyword, selectedStatus).catch((err) => {
          console.error('Gagal mencari data booking:', err)
          return []
        }),
        getLapangan().catch((err) => {
          console.error('Gagal mengambil data lapangan:', err)
          return []
        }),
      ])
      setDaftarBooking(bookingsData)
      setCourts(courtsData)
    } finally {
      setLoading(false)
    }
  }, [debouncedKeyword, selectedStatus])

  // 3. Trigger server-side search saat debouncedKeyword atau selectedStatus berubah
  useEffect(() => {
    loadDataKasir()
  }, [loadDataKasir])

  // 4. Pasang WebSocket Supabase Realtime Listener
  useEffect(() => {
    const unsubscribe = subscribeToBookings(() => {
      loadDataKasir()
    })

    return () => {
      unsubscribe()
    }
  }, [loadDataKasir])

  // 5. Aksi pelunasan sisa bayar DP
  const handleLunasi = async (id: number) => {
    if (!window.confirm('Lunasi sisa pembayaran untuk transaksi ini?')) return
    try {
      await updateStatusBooking(id, 'Lunas', 0)
      await loadDataKasir()
      alert('Transaksi berhasil dilunasi!')
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Gagal melunasi transaksi.')
    }
  }

  // 6. Aksi pembatalan jadwal booking
  const handleBatal = async (id: number) => {
    if (!window.confirm('Batalkan jadwal booking ini? Slot jam akan otomatis dibuka kembali untuk pelanggan lain.')) return
    try {
      await updateStatusBooking(id, 'Batal')
      await loadDataKasir()
      alert('Booking berhasil dibatalkan dan slot jam dibuka kembali.')
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Gagal membatalkan booking.')
    }
  }

  return {
    daftarBooking,
    filteredBookings: daftarBooking, // Langsung hasil server-side search dari Supabase
    courts,
    loading,
    searchKeyword,
    selectedStatus,
    isManualModalOpen,
    isCourtModalOpen,
    setSearchKeyword,
    setSelectedStatus,
    setIsManualModalOpen,
    setIsCourtModalOpen,
    handleLunasi,
    handleBatal,
    loadDataKasir,
  }
}
