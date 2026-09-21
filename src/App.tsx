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

  // tarik data lapangan pas aplikasi pertama kali dibuka
  useEffect(() => {
    async function loadLapangan() {
      try {
        const data = await getLapangan()
        setLapangan(data)
        if (data.length > 0) {
          setSelectedLapangan(data[0].id)
        }
      } catch (err) {
        console.error('Error load lapangan:', err)
      } finally {
        setLoading(false)
      }
    }
    loadLapangan()
  }, [])

  // narik jam yang udah dibooking setiap ganti tanggal atau ganti court
  useEffect(() => {
    if (!selectedLapangan || !selectedDate) return

    async function loadJadwalTerisi() {
      try {
        const booked = await getBookedSlots(selectedLapangan!, selectedDate)
        setBookedSlots(booked)
        setSelectedSlots([]) // reset jam pilihan kalo ganti court/hari
      } catch (err) {
        console.error('Error load jadwal terisi:', err)
      }
    }
    loadJadwalTerisi()
  }, [selectedLapangan, selectedDate])

  // handle pilih / batal pilih jam
  const handleToggleSlot = (jam: string) => {
    if (selectedSlots.includes(jam)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== jam))
    } else {
      setSelectedSlots([...selectedSlots, jam].sort())
    }
  }

  // cari court yang lagi dipilih
  const courtAktif = lapangan.find((l) => l.id === selectedLapangan)
  const tarif = courtAktif?.tarif_per_jam || 0

  // hitung total sama dp pake helper calculations
  const { totalBayar, nominalDP } = hitungBiayaBooking(selectedSlots.length, tarif)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans">
        <p className="animate-pulse text-base text-slate-400">Loading data GOR Badminton...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* judul aplikasi */}
        <header className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-emerald-400">
            Booking Lapangan Badminton
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Pilih court, tentukan tanggal, dan pilih slot jam main yang masih kosong.
          </p>
        </header>

        {/* 1. komponen pilih court */}
        <CourtPicker
          lapangan={lapangan}
          selectedId={selectedLapangan}
          onSelect={(id) => setSelectedLapangan(id)}
        />

        {/* 2. pilih tanggal main */}
        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            2. Pilih Tanggal Main:
          </label>
          <div>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* 3. komponen grid slot jam */}
        <TimeSlotGrid
          bookedSlots={bookedSlots}
          selectedSlots={selectedSlots}
          onToggleSlot={handleToggleSlot}
        />

        {/* 4. rincian biaya sewa & opsi dp */}
        <BookingSummary
          durasiJam={selectedSlots.length}
          selectedSlots={selectedSlots}
          totalBayar={totalBayar}
          nominalDP={nominalDP}
        />

      </div>
    </div>
  )
}
