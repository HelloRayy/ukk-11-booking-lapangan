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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#181818] border border-[#262626] text-[#fafafa] font-aeonik rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div>
            <h3 className="text-lg font-bold text-white">+ Input Booking Manual (Walk-in)</h3>
            <p className="text-xs text-[#8e8e8e]">Pemesanan langsung di loket kasir tanpa lewat website.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8e8e8e] hover:text-white text-sm font-bold p-1 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. Pilih Lapangan & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#8e8e8e] font-semibold block mb-1">Pilih Lapangan</label>
              <select
                value={selectedCourtId}
                onChange={(e) => setSelectedCourtId(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-[#262626] bg-[#1a1a1a] text-white focus:outline-none focus:border-[#f2d953]/60 cursor-pointer"
              >
                {courts.map((court) => (
                  <option key={court.id} value={court.id} disabled={court.status === 'Tutup'}>
                    {court.nama_lapangan} (Rp {court.tarif_per_jam.toLocaleString('id-ID')}/jam) {court.status === 'Tutup' ? '- [TUTUP]' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#8e8e8e] font-semibold block mb-1">Tanggal Main</label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#262626] bg-[#1a1a1a] text-white focus:outline-none focus:border-[#f2d953]/60 cursor-pointer"
              />
            </div>
          </div>

          {/* 2. Grid Jam Slot */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[#8e8e8e] font-semibold">
                Pilih Jam Sewa {isLoadingSlots && <span className="text-[#f2d953] font-normal">(Memeriksa jadwal...)</span>}
              </label>
              <span className="text-[11px] text-[#8e8e8e]">
                Terpilih: <strong className="text-[#f2d953]">{durasiJam} Jam</strong>
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
                    className={`py-1.5 px-1 text-center rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isBooked
                        ? 'bg-white/5 text-[#555] line-through cursor-not-allowed border border-[#262626]'
                        : isSelected
                        ? 'bg-[#f2d953] text-[#161616] border border-[#f2d953] shadow-xs'
                        : 'bg-[#141414] hover:bg-white/5 text-white border border-[#262626]'
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
              <label className="text-[#8e8e8e] font-semibold block mb-1">Nama Penyewa</label>
              <input
                type="text"
                placeholder="e.g. Budi Santoso"
                value={namaPenyewa}
                onChange={(e) => setNamaPenyewa(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#262626] bg-[#1a1a1a] text-white focus:outline-none focus:border-[#f2d953]/60"
              />
            </div>
            <div>
              <label className="text-[#8e8e8e] font-semibold block mb-1">Nomor WhatsApp (Opsional)</label>
              <input
                type="text"
                placeholder="e.g. 08123456789"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#262626] bg-[#1a1a1a] text-white focus:outline-none focus:border-[#f2d953]/60"
              />
            </div>
          </div>

          {/* 4. Skema Bayar & Rincian Total */}
          <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">Skema Pembayaran</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTipeBayar('Lunas')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    tipeBayar === 'Lunas'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white/5 text-[#8e8e8e] hover:text-white border border-[#262626]'
                  }`}
                >
                  Lunas Langsung (100%)
                </button>
                <button
                  type="button"
                  onClick={() => setTipeBayar('DP')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    tipeBayar === 'DP'
                      ? 'bg-[#f2d953] text-[#161616] shadow-xs'
                      : 'bg-white/5 text-[#8e8e8e] hover:text-white border border-[#262626]'
                  }`}
                >
                  Bayar DP (50%)
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262626] space-y-1 text-[#8e8e8e]">
              <div className="flex justify-between">
                <span>Total Sewa ({durasiJam} Jam):</span>
                <span className="font-bold text-white">Rp {totalBayar.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Wajib Dibayar Sekarang di Kasir:</span>
                <span>Rp {nominalDibayar.toLocaleString('id-ID')}</span>
              </div>
              {tipeBayar === 'DP' && (
                <div className="flex justify-between text-[#f2d953] font-semibold">
                  <span>Sisa Pelunasan Nanti:</span>
                  <span>Rp {sisaBayar.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#141414] hover:bg-white/5 text-[#8e8e8e] hover:text-white border border-[#262626] text-xs font-bold rounded-lg cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || durasiJam === 0}
              className="px-5 py-2 bg-[#f2d953] hover:bg-[#ffe359] disabled:opacity-50 text-[#161616] text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs active:scale-95"
            >
              {isSubmitting ? 'Menyimpan...' : 'Konfirmasi & Simpan Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
