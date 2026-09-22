// PERAN FILE: Halaman utama Kasir & Pengelola Lapangan (UKK Portal)
import { useState, useEffect, useCallback, useMemo } from 'react'
import { getAllBookings, getLapangan, updateStatusBooking, subscribeToBookings } from '../lib/api'
import type { Booking, Lapangan } from '../types/database'
import CashierTable from './cashier/CashierTable'
import ManualBookingModal from './cashier/ManualBookingModal'
import CourtManagerModal from './cashier/CourtManagerModal'

export default function CashierPage() {
  const [daftarBooking, setDaftarBooking] = useState<Booking[]>([])
  const [courts, setCourts] = useState<Lapangan[]>([])
  const [loading, setLoading] = useState(false)

  // State Kontrol Pencarian & Filter
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua')

  // State Modal Dialog
  const [isManualModalOpen, setIsManualModalOpen] = useState(false)
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false)

  // Ambil semua data booking dan master lapangan dari database Supabase
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

  // Inisialisasi data & pasang listener realtime Supabase
  useEffect(() => {
    loadDataKasir()

    const unsubscribe = subscribeToBookings(() => {
      loadDataKasir()
    })

    return () => {
      unsubscribe()
    }
  }, [loadDataKasir])

  // Filter transaksi berdasarkan kata kunci pencarian dan status pembayaran
  const filteredBookings = useMemo(() => {
    return daftarBooking.filter((b) => {
      // 1. Filter Status
      if (selectedStatus === 'Belum Lunas') {
        if (b.status !== 'Booked' || (b.sisa_bayar || 0) === 0) return false
      } else if (selectedStatus !== 'Semua' && b.status !== selectedStatus) {
        return false
      }

      // 2. Filter Search Keyword (Poin 13 Kisi-Kisi)
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

  // Aksi pelunasan sisa bayar DP
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

  // Aksi pembatalan jadwal booking
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

  return (
    <div className="space-y-4">
      {/* Bar Navigasi Cepat Penguji (Kembali ke Beranda & Kalender) */}
      <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-100 no-print">
        <a
          href="/"
          className="text-gray-500 hover:text-gray-900 font-semibold flex items-center gap-1.5 transition-colors"
        >
          ← Kembali ke Beranda Blanca
        </a>
        <a
          href="/reservasi"
          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
        >
          Buka Kalender Pemesan →
        </a>
      </div>

      {/* Tabel Kasir Interaktif */}
      <CashierTable
        daftarBooking={filteredBookings}
        totalSemuaBooking={daftarBooking}
        loading={loading}
        searchKeyword={searchKeyword}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchKeyword}
        onStatusChange={setSelectedStatus}
        onOpenManualModal={() => setIsManualModalOpen(true)}
        onOpenCourtModal={() => setIsCourtModalOpen(true)}
        onLunasi={handleLunasi}
        onBatal={handleBatal}
        onRefresh={loadDataKasir}
      />

      {/* Modal Booking Manual (Walk-in) */}
      <ManualBookingModal
        courts={courts}
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onBookingCreated={loadDataKasir}
      />

      {/* Modal Kelola Master Lapangan (CRUD) */}
      <CourtManagerModal
        courts={courts}
        isOpen={isCourtModalOpen}
        onClose={() => setIsCourtModalOpen(false)}
        onCourtsUpdated={loadDataKasir}
      />
    </div>
  )
}
