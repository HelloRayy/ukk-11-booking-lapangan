// PERAN FILE: Modal Input Pemesanan Manual (Walk-in Booking) Langsung di Meja Kasir
import { useState, useEffect } from 'react'
import type { Lapangan, TipeBayar, StatusBooking } from '../../types/database'
import { getBookedSlots, createBooking } from '../../lib/api'

interface ManualBookingModalProps {
  courts: Lapangan[]
  isOpen: boolean
  onClose: () => void
  onBookingCreated: () => void
  initialCourtId?: number
  initialDate?: string
  initialHour?: string
}

const AVAILABLE_HOURS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
]

export default function ManualBookingModal({
  courts,
  isOpen,
  onClose,
  onBookingCreated,
  initialCourtId,
  initialDate,
  initialHour,
}: ManualBookingModalProps) {
  const today = new Date().toISOString().split('T')[0]

  const [selectedCourtId, setSelectedCourtId] = useState<number>(courts[0]?.id || 1)
  const [selectedDate, setSelectedDate] = useState<string>(today)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [selectedHours, setSelectedHours] = useState<string[]>([])
  const [namaPenyewa, setNamaPenyewa] = useState('')
  const [noHp, setNoHp] = useState('')
  const [tipeBayar, setTipeBayar] = useState<TipeBayar>('Lunas')
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Sinkronisasi nilai inisial saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      if (initialCourtId) setSelectedCourtId(initialCourtId)
      if (initialDate) setSelectedDate(initialDate)
      if (initialHour) setSelectedHours([initialHour])
    }
  }, [isOpen, initialCourtId, initialDate, initialHour])

  // Cek ketersediaan slot jam setiap kali lapangan atau tanggal berubah
  useEffect(() => {
    if (!isOpen || !selectedCourtId) return
    async function fetchAvailability() {
      setIsLoadingSlots(true)
      try {
        const booked = await getBookedSlots(selectedCourtId, selectedDate)
        setBookedSlots(booked)
        // Reset jam terpilih jika jam tersebut ternyata sudah dibooking orang lain
        setSelectedHours((prev) => prev.filter((h) => !booked.includes(h)))
      } catch (err) {
        console.error('Gagal mengambil ketersediaan slot:', err)
      } finally {
        setIsLoadingSlots(false)
      }
    }
    fetchAvailability()
  }, [selectedCourtId, selectedDate, isOpen])

  if (!isOpen) return null

  const activeCourt = courts.find((c) => c.id === selectedCourtId) || courts[0]
  const tarifPerJam = activeCourt?.tarif_per_jam || 50000
  const durasiJam = selectedHours.length
  const totalBayar = durasiJam * tarifPerJam
  const nominalDibayar = tipeBayar === 'DP' ? totalBayar * 0.5 : totalBayar
  const sisaBayar = totalBayar - nominalDibayar

  const toggleHour = (hour: string) => {
    if (selectedHours.includes(hour)) {
      setSelectedHours(selectedHours.filter((h) => h !== hour))
    } else {
      setSelectedHours([...selectedHours, hour].sort((a, b) => parseInt(a) - parseInt(b)))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!namaPenyewa.trim()) {
      setErrorMessage('Nama penyewa wajib diisi.')
      return
    }
    if (selectedHours.length === 0) {
      setErrorMessage('Pilih minimal 1 slot jam bermain.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage(null)

      const statusBooking: StatusBooking = tipeBayar === 'Lunas' ? 'Lunas' : 'Booked'

      await createBooking({
        lapangan_id: selectedCourtId,
        nama_penyewa: `${namaPenyewa.trim()} (Walk-in)`,
        no_hp: noHp.trim() || '0800000000',
        tgl_main: selectedDate,
        jam_slots: selectedHours,
        durasi_jam: durasiJam,
        total_bayar: totalBayar,
        nominal_dibayar: nominalDibayar,
        sisa_bayar: sisaBayar,
        tipe_bayar: tipeBayar,
        status: statusBooking,
      })

      alert('Booking walk-in berhasil disimpan!')
      onBookingCreated()
      onClose()
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Gagal menyimpan booking walk-in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">+ Input Booking Manual (Walk-in)</h3>
            <p className="text-xs text-gray-500">Pemesanan langsung di loket kasir tanpa lewat website.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. Pilih Lapangan & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-gray-600 font-semibold block mb-1">Pilih Lapangan</label>
              <select
                value={selectedCourtId}
                onChange={(e) => setSelectedCourtId(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-gray-300 bg-white"
              >
                {courts.map((court) => (
                  <option key={court.id} value={court.id} disabled={court.status === 'Tutup'}>
                    {court.nama_lapangan} (Rp {court.tarif_per_jam.toLocaleString('id-ID')}/jam) {court.status === 'Tutup' ? '- [TUTUP]' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-600 font-semibold block mb-1">Tanggal Main</label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
          </div>

          {/* 2. Grid Jam Slot */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-gray-600 font-semibold">
                Pilih Jam Sewa {isLoadingSlots && <span className="text-gray-400 font-normal">(Memeriksa jadwal...)</span>}
              </label>
              <span className="text-[11px] text-gray-500">
                Terpilih: <strong className="text-blue-600">{durasiJam} Jam</strong>
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {AVAILABLE_HOURS.map((hour) => {
                const isBooked = bookedSlots.includes(hour)
                const isSelected = selectedHours.includes(hour)

                return (
                  <button
                    key={hour}
                    type="button"
                    disabled={isBooked}
                    onClick={() => toggleHour(hour)}
                    className={`py-1.5 px-1 text-center rounded text-[11px] font-bold transition-all cursor-pointer ${
                      isBooked
                        ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed border border-gray-200'
                        : isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300'
                    }`}
                  >
                    {hour}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. Info Calon Penyewa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-gray-600 font-semibold block mb-1">Nama Penyewa</label>
              <input
                type="text"
                placeholder="e.g. Budi Santoso"
                value={namaPenyewa}
                onChange={(e) => setNamaPenyewa(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="text-gray-600 font-semibold block mb-1">Nomor WhatsApp (Opsional)</label>
              <input
                type="text"
                placeholder="e.g. 08123456789"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
          </div>

          {/* 4. Skema Bayar & Rincian Total */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Skema Pembayaran</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTipeBayar('Lunas')}
                  className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer ${
                    tipeBayar === 'Lunas'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Lunas Langsung (100%)
                </button>
                <button
                  type="button"
                  onClick={() => setTipeBayar('DP')}
                  className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer ${
                    tipeBayar === 'DP'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Bayar DP (50%)
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>Total Sewa ({durasiJam} Jam):</span>
                <span className="font-bold text-gray-900">Rp {totalBayar.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Wajib Dibayar Sekarang di Kasir:</span>
                <span>Rp {nominalDibayar.toLocaleString('id-ID')}</span>
              </div>
              {tipeBayar === 'DP' && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>Sisa Pelunasan Nanti:</span>
                  <span>Rp {sisaBayar.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || durasiJam === 0}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              {isSubmitting ? 'Menyimpan...' : 'Konfirmasi & Simpan Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
