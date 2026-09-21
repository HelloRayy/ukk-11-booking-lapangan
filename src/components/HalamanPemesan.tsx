// PERAN FILE: Halaman utama pemesan - memuat langkah 1 sampai 5 pemesanan lapangan & simpan ke Supabase
import { useState, useEffect } from 'react'
import { getLapangan, createBooking } from '../lib/api'
import type { Lapangan } from '../types/database'
import { useJadwal } from '../hooks/useJadwal'
import PilihLapangan from './PilihLapangan'
import GridJam from './GridJam'
import RingkasanBiaya from './RingkasanBiaya'
import FormPemesan from './FormPemesan'
import { hitungBiayaBooking } from '../utils/hitungBiaya'

export default function HalamanPemesan() {
  const [lapangan, setLapangan] = useState<Lapangan[]>([])
  const [selectedLapangan, setSelectedLapangan] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // custom hook: mengelola slot jam yang sudah dipesan orang lain
  const { bookedSlots, refreshJadwal } = useJadwal(selectedLapangan, selectedDate)

  // ambil data lapangan saat halaman dibuka
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

  // toggle klik slot jam
  const handleToggleSlot = (jam: string) => {
    if (selectedSlots.includes(jam)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== jam))
    } else {
      setSelectedSlots([...selectedSlots, jam].sort())
    }
  }

  // kalkulasi biaya sewa otomatis
  const courtAktif = lapangan.find((l) => l.id === selectedLapangan)
  const tarif = courtAktif?.tarif_per_jam || 0
  const { totalBayar, nominalDP, sisaBayar } = hitungBiayaBooking(selectedSlots.length, tarif)

  // fungsi submit data pemesanan ke Supabase
  const handleKirimBooking = async (dataPemesan: {
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

  if (loading) {
    return <div className="p-4 border rounded text-center text-gray-500">Memuat data lapangan...</div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* 1. Pilih Court */}
      <PilihLapangan
        lapangan={lapangan}
        selectedId={selectedLapangan}
        onSelect={(id) => {
          setSelectedLapangan(id)
          setSelectedSlots([])
        }}
      />

      {/* 2. Pilih Tanggal */}
      <div>
        <h3 className="font-bold mb-2">2. Pilih Tanggal:</h3>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => {
            setSelectedDate(e.target.value)
            setSelectedSlots([])
          }}
          className="border p-2 rounded"
        />
      </div>

      {/* 3. Grid Jam */}
      <GridJam
        selectedDate={selectedDate}
        bookedSlots={bookedSlots}
        selectedSlots={selectedSlots}
        onToggleSlot={handleToggleSlot}
      />

      {/* 4. Rincian Biaya */}
      <RingkasanBiaya
        durasiJam={selectedSlots.length}
        selectedSlots={selectedSlots}
        totalBayar={totalBayar}
        nominalDP={nominalDP}
      />

      {/* 5. Form Data Pemesan & Tombol Submit */}
      <FormPemesan
        durasiJam={selectedSlots.length}
        totalBayar={totalBayar}
        nominalDP={nominalDP}
        isSubmitting={isSubmitting}
        onKirimData={handleKirimBooking}
      />
    </div>
  )
}
