import { useState, useEffect } from 'react'
import { getLapangan, getBookedSlots } from './lib/api'
import type { Lapangan } from './types/database'
import CourtPicker from './components/CourtPicker'
import TimeSlotGrid from './components/TimeSlotGrid'
import BookingSummary from './components/BookingSummary'
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
  const { totalBayar, nominalDP } = hitungBiayaBooking(selectedSlots.length, tarif)

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
    </div>
  )
}
