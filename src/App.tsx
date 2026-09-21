import { useState, useEffect } from 'react'
import { getLapangan, getBookedSlots, createBooking } from './lib/api'
import type { Lapangan } from './types/database'
import CourtPicker from './components/CourtPicker'
import TimeSlotGrid from './components/TimeSlotGrid'
import BookingSummary from './components/BookingSummary'
import BookingForm from './components/BookingForm'
import { hitungBiayaBooking } from './utils/calculations'

export default function App() {
  const [lapangan, setLapangan] = useState<Lapangan[]>([])
  const [selectedLapangan, setSelectedLapangan] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ambil data lapangan pas web dibuka
  useEffect(() => {
    async function loadLapangan() {
      try {
        const data = await getLapangan()
        setLapangan(data)
        if (data.length > 0) setSelectedLapangan(data[0].id)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadLapangan()
  }, [])

  // ambil jam yang udah terisi pas ganti tanggal / court
  useEffect(() => {
    if (!selectedLapangan || !selectedDate) return

    async function loadJadwal() {
      try {
        const booked = await getBookedSlots(selectedLapangan!, selectedDate)
        setBookedSlots(booked)
        setSelectedSlots([])
      } catch (err) {
        console.error(err)
      }
    }
    loadJadwal()
  }, [selectedLapangan, selectedDate])

  // toggle pilih jam
  const handleToggleSlot = (jam: string) => {
    if (selectedSlots.includes(jam)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== jam))
    } else {
      setSelectedSlots([...selectedSlots, jam].sort())
    }
  }

  const courtAktif = lapangan.find((l) => l.id === selectedLapangan)
  const tarif = courtAktif?.tarif_per_jam || 0
  const { totalBayar, nominalDP, sisaBayar } = hitungBiayaBooking(selectedSlots.length, tarif)

  // fungsi kirim data booking ke database supabase
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

      // refresh slot jam di hari itu biar tombol jam langsung kekunci
      const booked = await getBookedSlots(selectedLapangan, selectedDate)
      setBookedSlots(booked)
      setSelectedSlots([]) // kosongkan pilihan jam setelah booking sukses
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan booking. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading data lapangan...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 text-black bg-white min-h-screen">
      <header className="border-b pb-3">
        <h1 className="text-2xl font-bold">Booking Lapangan Badminton</h1>
        <p className="text-sm text-gray-500">Pilih court, tanggal, dan jam yang masih kosong.</p>
      </header>

      {/* 1. Pilih Court */}
      <CourtPicker
        lapangan={lapangan}
        selectedId={selectedLapangan}
        onSelect={(id) => setSelectedLapangan(id)}
      />

      {/* 2. Pilih Tanggal */}
      <div>
        <h3 className="font-bold mb-2">2. Pilih Tanggal:</h3>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* 3. Grid Jam */}
      <TimeSlotGrid
        bookedSlots={bookedSlots}
        selectedSlots={selectedSlots}
        onToggleSlot={handleToggleSlot}
      />

      {/* 4. Rincian Biaya */}
      <BookingSummary
        durasiJam={selectedSlots.length}
        selectedSlots={selectedSlots}
        totalBayar={totalBayar}
        nominalDP={nominalDP}
      />

      {/* 5. Form Data Pemesan & Tombol Submit */}
      <BookingForm
        durasiJam={selectedSlots.length}
        totalBayar={totalBayar}
        nominalDP={nominalDP}
        isSubmitting={isSubmitting}
        onKirimData={handleKirimBooking}
      />
    </div>
  )
}
