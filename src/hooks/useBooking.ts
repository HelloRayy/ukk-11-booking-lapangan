// PERAN FILE: Custom Hook untuk mengelola seluruh alur state, kalkulasi biaya, & penyimpanan booking ke Supabase
import { useState, useEffect } from 'react'
import { getLapangan, createBooking } from '../lib/api'
import type { Lapangan } from '../types/database'
import { useSchedule } from './useSchedule'
import { hitungBiayaBooking } from '../utils/costCalculation'

export function useBooking() {
  const [lapangan, setLapangan] = useState<Lapangan[]>([])
  const [selectedLapangan, setSelectedLapangan] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [jamDipilih, setJamDipilih] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // custom hook memantau slot terisi di database
  const { jamTerisi, refreshJadwal } = useSchedule(selectedLapangan, selectedDate)

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
    setJamDipilih([])
  }

  // aksi ganti tanggal (reset slot yang sedang dipilih)
  const pilihTanggal = (date: string) => {
    setSelectedDate(date)
    setJamDipilih([])
  }

  // aksi pilih / lepas slot jam
  const toggleSlot = (jam: string) => {
    if (jamDipilih.includes(jam)) {
      setJamDipilih(jamDipilih.filter((s) => s !== jam))
    } else {
      setJamDipilih([...jamDipilih, jam].sort())
    }
  }

  // kalkulasi matematika biaya otomatis
  const courtAktif = lapangan.find((l) => l.id === selectedLapangan)
  const tarif = courtAktif?.tarif_per_jam || 0
  const { totalBayar, nominalDP, sisaBayar } = hitungBiayaBooking(jamDipilih.length, tarif)

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
        jam_slots: jamDipilih,
        durasi_jam: jamDipilih.length,
        total_bayar: totalBayar,
        nominal_dibayar: dataPemesan.tipeBayar === 'DP' ? nominalDP : totalBayar,
        sisa_bayar: dataPemesan.tipeBayar === 'DP' ? sisaBayar : 0,
        tipe_bayar: dataPemesan.tipeBayar,
        status: dataPemesan.tipeBayar === 'Lunas' ? 'Lunas' : 'Booked',
      })

      alert('Berhasil! Booking lapangan badminton sudah tersimpan.')
      await refreshJadwal()
      setJamDipilih([])
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
    jamDipilih,
    jamTerisi,
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

export const usePemesanan = useBooking

