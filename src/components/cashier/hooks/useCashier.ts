// PERAN FILE: Custom Hook Logic untuk Mengelola State, Database, Realtime, dan Filter Kasir
import { useState, useEffect, useCallback, useMemo } from 'react'
import { getAllBookings, getLapangan, updateStatusBooking, subscribeToBookings } from '../../../lib/api'
import type { Booking, Lapangan } from '../../../types/database'

export function useCashier() {
  const [daftarBooking, setDaftarBooking] = useState<Booking[]>([])
  const [courts, setCourts] = useState<Lapangan[]>([])
  const [loading, setLoading] = useState(false)

  // State Kontrol Pencarian & Filter
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua')

  // State Modal Dialog
  const [isManualModalOpen, setIsManualModalOpen] = useState(false)
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false)

  // 1. Ambil data booking dan master lapangan secara paralel dari Supabase
  const loadDataKasir = useCallback(async () => {
    setLoading(true)
    try {
      const [bookingsData, courtsData] = await Promise.all([
        getAllBookings().catch((err) => {
          console.error('Gagal mengambil data booking:', err)
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
  }, [])

  // 2. Inisialisasi data & pasang pendengar WebSocket Supabase Realtime
  useEffect(() => {
    loadDataKasir()

    const unsubscribe = subscribeToBookings(() => {
      loadDataKasir()
    })

    return () => {
      unsubscribe()
    }
  }, [loadDataKasir])

  // 3. Logika penyaringan instan berdasarkan search bar (Poin 13) dan status
  const filteredBookings = useMemo(() => {
    return daftarBooking.filter((b) => {
      // Filter Status
      if (selectedStatus === 'Belum Lunas') {
        if (b.status !== 'Booked' || (b.sisa_bayar || 0) === 0) return false
      } else if (selectedStatus !== 'Semua' && b.status !== selectedStatus) {
        return false
      }

      // Filter Search Keyword (Poin 13)
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase().trim()
        const matchName = b.nama_penyewa.toLowerCase().includes(q)
        const matchPhone = (b.no_hp || '').toLowerCase().includes(q)
        const matchInvoice = `inv-${b.id}`.toLowerCase().includes(q) || String(b.id).includes(q)
        const matchCourt = (b.lapangan?.nama_lapangan || '').toLowerCase().includes(q)
        return matchName || matchPhone || matchInvoice || matchCourt
      }

      return true
    })
  }, [daftarBooking, selectedStatus, searchKeyword])

  // 4. Aksi pelunasan sisa bayar DP
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

  // 5. Aksi pembatalan jadwal booking
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
    filteredBookings,
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
