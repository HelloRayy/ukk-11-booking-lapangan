// PERAN FILE: Halaman kasir - mengelola penarikan transaksi booking, pelunasan sisa DP, pembatalan, & cetak
import { useState, useEffect } from 'react'
import { getAllBookings, updateStatusBooking } from '../lib/api'
import type { Booking } from '../types/database'
import TabelKasir from './kasir/TabelKasir'

export default function HalamanKasir() {
  const [daftarBooking, setDaftarBooking] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)

  // ambil semua data booking dari database Supabase
  const loadDataKasir = async () => {
    setLoading(true)
    try {
      const data = await getAllBookings()
      setDaftarBooking(data)
    } catch (err) {
      console.error(err)
      alert('Gagal mengambil data booking.')
    } finally {
      setLoading(false)
    }
  }

  // otomatis ambil data saat halaman kasir dibuka
  useEffect(() => {
    loadDataKasir()
  }, [])

  // aksi pelunasan sisa bayar DP
  const handleLunasi = async (id: number) => {
    if (!window.confirm('Lunasi sisa pembayaran untuk transaksi ini?')) return
    try {
      await updateStatusBooking(id, 'Lunas', 0)
      await loadDataKasir()
      alert('Berhasil dilunasi!')
    } catch (err) {
      console.error(err)
      alert('Gagal melunasi transaksi.')
    }
  }

  // aksi pembatalan jadwal booking
  const handleBatal = async (id: number) => {
    if (!window.confirm('Batalkan jadwal booking ini? Slot jam akan otomatis dibuka kembali.')) return
    try {
      await updateStatusBooking(id, 'Batal')
      await loadDataKasir()
      alert('Booking berhasil dibatalkan.')
    } catch (err) {
      console.error(err)
      alert('Gagal membatalkan booking.')
    }
  }

  return (
    <TabelKasir
      daftarBooking={daftarBooking}
      loading={loading}
      onLunasi={handleLunasi}
      onBatal={handleBatal}
      onRefresh={loadDataKasir}
    />
  )
}
