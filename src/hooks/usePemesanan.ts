// PERAN FILE: Custom Hook untuk mengelola seluruh alur state, kalkulasi biaya, & penyimpanan booking ke Supabase
import { useState, useEffect } from 'react'
import { getLapangan, createBooking } from '../lib/api'
import type { Lapangan } from '../types/database'
import { useJadwal } from './useJadwal'
import { hitungBiayaBooking } from '../utils/hitungBiaya'

export function usePemesanan() {
  const [lapangan, setLapangan] = useState<Lapangan[]>([])
  const [selectedLapangan, setSelectedLapangan] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // custom hook memantau slot terisi di database
  const { bookedSlots, refreshJadwal } = useJadwal(selectedLapangan, selectedDate)

  // ambil daftar lapangan saat pertama kali dibuka
  useEffect(() => {
    async function loadLapangan() {
      try {
        const data = await getLapangan()
        setLapangan(data)
        if (data.length > 0) setSelectedLapangan(data[0].id)
      } catch (err) {
        console.error('Gagal mengambil data lapangan:', err)
      } finally {
        setLoading(false)
      }
    }
    loadLapangan()
  }, [])

  // aksi ganti lapangan (reset slot yang sedang dipilih)
  const pilihLapangan = (id: number) => {
    setSelectedLapangan(id)
    setSelectedSlots([])
  }

  // aksi ganti tanggal (reset slot yang sedang dipilih)
  const pilihTanggal = (date: string) => {
    setSelectedDate(date)
    setSelectedSlots([])
  }

  // aksi pilih / lepas slot jam
  const toggleSlot = (jam: string) => {
    if (selectedSlots.includes(jam)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== jam))
    } else {
      setSelectedSlots([...selectedSlots, jam].sort())
    }
  }

  // kalkulasi matematika biaya otomatis
  const courtAktif = lapangan.find((l) => l.id === selectedLapangan)
  const tarif = courtAktif?.tarif_per_jam || 0
  const { totalBayar, nominalDP, sisaBayar } = hitungBiayaBooking(selectedSlots.length, tarif)

  // kirim data transaksi booking ke Supabase
  const kirimBooking = async (dataPemesan: {
    nama: string
    noHp: string
    tipeBayar: 'Lunas' | 'DP'
  }) => {
    if (!selectedLapangan) return

    setIsSubmitting(true)
    try {
      await createBooking({
        lapangan_id: selectedLapangan,
        nama_penyewa: dataPemesan.nama,
        no_hp: dataPemesan.noHp,
        tgl_main: selectedDate,
        jam_slots: selectedSlots,
        durasi_jam: selectedSlots.length,
        total_bayar: totalBayar,
        nominal_dibayar: dataPemesan.tipeBayar === 'DP' ? nominalDP : totalBayar,
        sisa_bayar: dataPemesan.tipeBayar === 'DP' ? sisaBayar : 0,
        tipe_bayar: dataPemesan.tipeBayar,
        status: dataPemesan.tipeBayar === 'Lunas' ? 'Lunas' : 'Booked',
      })

      alert('Berhasil! Booking lapangan badminton sudah tersimpan.')
      await refreshJadwal()
      setSelectedSlots([])
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan booking. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    lapangan,
    loading,
    selectedLapangan,
    selectedDate,
    selectedSlots,
    bookedSlots,
    isSubmitting,
    totalBayar,
    nominalDP,
    sisaBayar,
    pilihLapangan,
    pilihTanggal,
    toggleSlot,
    kirimBooking,
  }
}
